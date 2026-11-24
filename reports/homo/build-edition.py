"""Build the exported research catalogue and a scope-local, versioned offline edition."""
import csv,hashlib,json,sys
from pathlib import Path
P=Path(sys.argv[1] if len(sys.argv)>1 else 'HOMO')
def read(rel):return json.loads((P/rel).read_text())
def save(rel,v): (P/rel).write_text(json.dumps(v,ensure_ascii=False,separators=(',',':'))+'\n')
pops=read('data/populations.json')
with (P/'data/populations.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(['Identificativo','Popolazione','Regione','Reperti','Cronologia','Limiti','Livello di evidenza','Fonti'])
 for p in pops:w.writerow([p[k] for k in ['id','name','region','anchors','label','limits','level']]+[','.join(p['refs'])])
aliases=[
 ('longi','Homo longi','denisova','Il tipo Harbin è associato ai Denisoviani.','harbin'),
 ('juluensis','Homo juluensis','denisova','Due fossili di Xujiayao sono stati ricondotti mediante proteine alla linea denisoviana.','https://doi.org/10.1038/s41586-026-11132-z'),
 ('bodoensis','Homo bodoensis','heidelberg','Nome proposto per materiale africano del Pleistocene medio, con Bodo come tipo.','delson'),
 ('rhodesiensis','Homo rhodesiensis','heidelberg','Kabwe è il tipo di un nome storico impiegato in classificazioni concorrenti.','kabwe'),
 ('ghost','Popolazioni arcaiche inferite',None,'Struttura demografica ed introgressione possono generare segnali sovrapponibili.','stem')]
catalog={'version':'1.0','reviewed':'2026-11-23','units':'ka prima del presente, salvo diversa indicazione nella scheda.','populations':pops,'taxonomicAlternatives':[dict(zip(['id','name','compareWith','limits','source'],a)) for a in aliases],'sites':read('geo/sites.json'),'epochs':read('geo/epochs.json'),'geography':read('geo/interpretations.geojson'),'relations':read('data/relations.json'),'sources':read('data/references.json'),'chapters':{p['id']:read('data/'+p['id']+'.json') for p in pops},'methods':read('data/methods.json'),'debates':read('data/debates.json'),'images':read('media/catalog.json'),'models':read('media/models.json'),'revisions':read('data/revisions.json'),'themes':read('data/themes.json'),'disappearance':read('data/disappearance.json')}
save('data/research-database.json',catalog)
assets=sorted(str(p.relative_to(P)) for p in P.rglob('*') if p.is_file() and not any(i in ['docs','.git','.openai'] for i in p.relative_to(P).parts) and p.name not in ['sw.js','REPORT.md'])
h=hashlib.sha256()
for file in assets:h.update(file.encode());h.update((P/file).read_bytes())
version=h.hexdigest()[:16]
worker="""// Generated from the local publication tree. Its scope is the HOMO directory.
const PREFIX = 'gbprof-homo-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + '__VERSION__';
const FILES = __FILES__;
const URLS = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      for (let i = 0; i < FILES.length; i += 12) {
        await cache.addAll(FILES.slice(i, i + 12).map(file => new Request(new URL(file, self.registration.scope), {cache:'reload'})));
      }
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'activate') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url), scope = new URL(self.registration.scope);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  url.hash = ''; url.search = '';
  if (url.pathname.endsWith('/')) url.pathname += 'index.html';
  if (!URLS.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(url.href) || fetch(request);
  })());
});
"""
(P/'sw.js').write_text(worker.replace('__VERSION__',version).replace('__FILES__',json.dumps(assets,ensure_ascii=False,indent=1)))
print(version,len(assets),sum((P/a).stat().st_size for a in assets))
