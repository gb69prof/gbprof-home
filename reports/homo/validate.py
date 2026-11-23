#!/usr/bin/env python3
"""Controlli ripetibili sul sito statico. Impiego: python QA/validate.py [cartella web]."""
from argparse import ArgumentParser
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import struct
import sys

LEVELS = {'Documentato', 'Fortemente supportato', 'Plausibile', 'Controverso', 'Sconosciuto'}
EXPECTED = {350, 300, 250, 200, 150, 120, 100, 80, 70, 60, 50, 45, 40, 35, 30}
SPECIES = {'sapiens','naledi','erectus','heidelberg','neanderthal','denisova','flores','luzon'}

class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.ids = []
        self.lang = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'html':
            self.lang = attrs.get('lang')
        if tag in ('script','link','img','source','a'):
            for key in ('src','href'):
                if key in attrs:
                    self.urls.append(attrs[key])

class Audit:
    def __init__(self, root):
        self.root = root
        self.errors = []
        self.checked = 0
        self.metrics = {}
    def check(self, value, message):
        self.checked += 1
        if not value:
            self.errors.append(message)
    def local(self, name):
        path = (self.root / name).resolve()
        self.check(path.is_relative_to(self.root) and path.is_file(), 'Risorsa assente o fuori ambito: '+str(name))
        return path
    def read(self, name):
        return json.loads(self.local(name).read_text(encoding='utf-8'))
    def unique(self, rows, where):
        ids = [r.get('id') for r in rows]
        self.check(None not in ids and len(set(ids)) == len(ids), 'ID assenti o duplicati: '+where)
        return set(ids)
    def reference(self, ref, where, ids):
        if isinstance(ref, str):
            self.check(ref in ids, f'Fonte {ref} non risolta in {where}')
        else:
            url=ref.get('url','')
            parsed=urlparse(url)
            accessible=parsed.scheme in ('http','https') or (url and not parsed.scheme and (self.root/url).is_file())
            self.check(ref.get('title') and accessible, 'Metadati fonte mancanti: '+where)
    def citations(self, row, where, ids, field='sources'):
        cites = row.get(field)
        self.check(bool(cites), f'{field} assente in {where}')
        for ref in cites or []:
            self.reference(ref, where, ids)
    def content(self):
        refs = self.read('data/references.json')
        common = self.unique(refs,'bibliografia generale')
        pops = self.read('data/populations.json')
        ids = self.unique(pops,'popolazioni')
        self.check(ids == SPECIES, 'Identità delle otto popolazioni')
        counts = {}
        for sp in sorted(ids | {'disappearance'}):
            book = self.read(f'data/{sp}.json')
            self.check(book['id'] == sp, 'Nome file e ID: '+sp)
            self.check(all(book.get(k) for k in ['glossary','discoveries','specimens','subtitle']), 'Apparato: '+sp)
            bookrefs = self.unique(book['sources'],sp)
            for ref in book['sources']:
                self.reference(ref,sp,bookrefs)
                self.check(('year' in ref) and all(ref.get(k) for k in ['authors','journal','evidence','limits']), 'Fonte incompleta: '+str(ref['id']))
            count = 0
            for c in book['chapters']:
                self.check(c['title'] and c['level'] in LEVELS, 'Capitolo o livello: '+sp)
                self.citations(c,sp,bookrefs)
                self.check(all(isinstance(p,str) and p.strip() for p in c['paragraphs']), 'Paragrafo vuoto: '+sp)
                count += sum(len(p.split()) for p in c['paragraphs'])
            self.check((1500<=count<=2200 if sp=='disappearance' else 2500<=count<=4000), f'Lunghezza narrativa {sp}: {count}')
            counts[sp] = count
        self.metrics['parole_corpo'] = counts
        for p in pops:
            self.citations(p,p['id'],common,'refs')
            self.citations(p,p['id'],common,'anatomyRefs')
            self.check(p.get('level') in LEVELS and p['bounds'], 'Cronologia: '+p['id'])
            if p['id']=='luzon':
                self.check(p['start'] is None, 'Luzon convertito in durata chiusa')
        for n in ('methods','debates','relations'):
            rows = self.read('data/'+n+'.json')
            self.metrics[n] = len(rows)
            self.unique(rows,n)
            for row in rows:
                self.citations(row,n,common)
                if n=='relations':
                    self.check(row['from'] in ids and row['to'] in ids,'Estremo di una relazione mancante')
                if 'level' in row:
                    self.check(row['level'] in LEVELS,'Livello non ammesso in '+n)
        for theme in self.read('data/themes.json'):
            for c in theme['chapters']:
                self.citations(c,theme['id'],common)
    def geography(self):
        sites = self.read('geo/sites.json')
        features = self.read('geo/sites.geojson')['features']
        first,second = self.unique(sites,'siti'),self.unique(features,'GeoJSON')
        self.check(first==second, 'Disallineamento ID fra schede dei siti e GeoJSON')
        by_id={f['id']:f for f in features}
        for site in sites:
            label=site['id']
            for k in ('region','specimen','age','method','discovery','description','institution','limits','coordinateScope'):
                self.check(bool(site.get(k)), f'{label} senza {k}')
            lon,lat=site['coordinates']
            self.check(-180<=lon<=180 and -90<=lat<=90,'Coordinate non valide: '+label)
            self.check(by_id[label]['geometry']['coordinates']==site['coordinates'], 'Coordinate discordanti: '+label)
            self.citations(site,label,set())
            self.check(set(site['species'])<=SPECIES,'Attribuzione estranea: '+label)
        epochs=self.read('geo/epochs.json')
        self.check({e['ka'] for e in epochs}==EXPECTED,'Date del selettore paleogeografico')
        for e in epochs:
            self.check(e['low']<=e['sea']<=e['high'],'Livello marino fuori intervallo')
            for layer in ('sea','ice','eco'):
                p=self.local(f'geo/layers/{layer}-{e["ka"]}.png')
                if p.exists():
                    with p.open('rb') as handle:
                        header=handle.read(24)
                    self.check(header[:8]==b'\x89PNG\r\n\x1a\n' and min(struct.unpack('>II',header[16:24]))>0, 'PNG illeggibile: '+p.name)
        self.metrics['siti']=len(sites)
        self.metrics['epoche']=len(epochs)
    def media(self):
        catalog=self.read('media/catalog.json')
        originals=self.read('media/dossier-produzione.json')
        self.unique(catalog,'catalogo visivo')
        self.unique(originals,'ricostruzioni originali')
        for item in catalog+originals:
            p=self.local(item['src'])
            self.check(all(item.get(k) for k in ['title','credit','license','caption','type']), 'Attribuzione/licenza incompleta: '+item['id'])
            if p.is_file() and p.suffix=='.webp':
                with p.open('rb') as f: data=f.read(12)
                self.check(data[:4]==b'RIFF' and data[8:12]==b'WEBP','WebP illeggibile: '+item['id'])
            self.citations(item,item['id'],set())
        for item in originals:
            self.check(all(item.get(k) for k in ['prompt','date','documented','plausible','artistic']),'Dossier di produzione: '+item['id'])
        self.metrics['catalogo']=len(catalog)
        self.metrics['dossier_originali']=len(originals)
    def entry(self):
        parser=Assets()
        parser.feed(self.local('index.html').read_text())
        self.check(parser.lang=='it', 'Attributo lingua documento')
        self.check(len(parser.ids)==len(set(parser.ids)), 'ID HTML duplicati')
        for url in parser.urls:
            path=urlparse(url)
            if not path.scheme and path.path:
                self.local(unquote(path.path))
        mf=self.read('manifest.webmanifest')
        self.check(mf.get('scope','./') in ('.','./','/Spazi/homo/'),'Manifest può interferire con altre app')
        self.check(mf.get('display') in ('standalone','fullscreen','minimal-ui'), 'Modalità installata')
        self.check(mf.get('start_url') in ('.','./','index.html','./index.html','/Spazi/homo/'),'Manifest start_url')
        for icon in mf.get('icons',[]):
            self.local(icon['src'])
        sizes={i['sizes'] for i in mf.get('icons',[])}
        self.check({'192x192','512x512'}<=sizes,'Icone installazione 192 e 512 pixel')
        self.local('sw.js')
    def run(self):
        for section in ('content','geography','media','entry'):
            try:
                getattr(self,section)()
            except (FileNotFoundError,KeyError,TypeError,ValueError,IndexError,struct.error) as e:
                self.errors.append(f'{section}: {e}')
        return {'controlli':self.checked, 'metriche':self.metrics, 'errori':self.errors}

if __name__=='__main__':
    p=ArgumentParser(description=__doc__)
    p.add_argument('root',nargs='?',type=Path,default=Path(__file__).resolve().parents[2]/'Spazi'/'homo')
    audit=Audit(p.parse_args().root.resolve()).run()
    print(json.dumps(audit,ensure_ascii=False,indent=2))
    sys.exit(bool(audit['errori']))
