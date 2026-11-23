import {esc, cites, sourceCard, supported, levelTag, link, csv, download, norm} from './common.js';

const labels = (ids, C) => ids.map(id => C.pops.find(pop => pop.id === id)?.name || id);
const byText = (a, b) => String(a).localeCompare(String(b), 'it', {sensitivity:'base'});
const options = (items, label, value) => items.map(item => '<option value="'+esc(value(item))+'">'+esc(label(item))+'</option>').join('');
const speciesPicker = C => '<label class="field">Popolazione <select name="species"><option value="">Tutte le popolazioni</option>'+options(C.pops,p=>p.name,p=>p.id)+'</select></label>';
const queryField = (label, placeholder='') => '<label class="field">'+esc(label)+' <input name="q" type="search" placeholder="'+esc(placeholder)+'"></label>';
const searchMatch = (query, ...texts) => norm(texts.join(' ')).includes(norm(query).trim());
const speciesLinks = (ids,C) => ids.map(id=>'<a href="#scheda/'+encodeURIComponent(id)+'">'+esc(labels([id],C)[0])+'</a>').join(' · ');
const inner = (r,sel) => r.querySelector(sel);
const heading = (r,count,noun) => {inner(r,'[role=status]').textContent=count+' '+noun;};
const empty = text => '<p class="small">'+esc(text)+'</p>';
const strictSites = C => C.sites.filter(s=>!C.strict || supported(s.level));

const imageSites = {
  'rising-star':['naledi-scheletri','naledi-mano','naledi-piede','naledi-dh3'],
  'liang-bua':['liang-bua','flores-calco'], callao:['callao','luzon-denti'],
  baishiya:['baishiya','xiahe'], irhoud:['irhoud','irhoud-tc'], feldhofer:['feldhofer-stampa'],
  mauer:['mauer','mauer-cava','mauer-rx'], 'mata-menge':['mata-menge','omero-tc','omeri-confronto','scala-omeri'],
  ngandong:['ngandong'], harbin:['harbin'], dmanisi:['dmanisi-scavo']
};
const periodOptions = [
 ['0-50','0–50 ka'],['50-100','50–100 ka'],['100-150','100–150 ka'],['150-250','150–250 ka'],
 ['250-350','250–350 ka'],['350-600','350–600 ka'],['600-1000','600–1.000 ka'],['1000-2500','1–2,5 Ma'],
 ['minimum','Datazioni con solo limite minimo'],['uncalibrated','Date al radiocarbonio non calibrate']
];

function inPeriod(s, period, strict){
 if (!period) return true;
 if (strict && s.dateLevel && !supported(s.dateLevel)) return false;
 if (period==='minimum' || period==='uncalibrated') return s.ageType===period;
 const [young, old]=period.split('-').map(Number);
 return (s.spans||[]).some(([a,b])=>Math.min(a,b)<=old && Math.max(a,b)>=young);
}

export function renderArchive(root,C){
 const regions=[...new Set(C.sites.map(s=>s.region))].sort(byText);
 root.innerHTML='<form class="toolbar" role="search">'+queryField('Cerca nel catalogo','Reperto, località o metodo')+speciesPicker(C)+
 '<label class="field">Regione <select name="region"><option value="">Tutte le regioni</option>'+options(regions,x=>x,x=>x)+'</select></label>'+
 '<label class="field">Intervallo <select name="period"><option value="">Tutte le datazioni</option>'+options(periodOptions,x=>x[1],x=>x[0])+'</select></label></form>'+
 '<p class="small">Gli intervalli numerici comprendono le finestre di datazione che li intersecano. I minimi e le date non calibrate hanno filtri dedicati.</p>'+
 '<div class="row-between"><p role="status"></p><div class="actions"><button type="button" data-export="json">Esporta JSON</button><button type="button" data-export="csv">Esporta CSV</button></div></div><div class="list" data-results></div>';
 const form=inner(root,'form');let selected=[];
 function refresh(){
  const {q,species,region,period}=Object.fromEntries(new FormData(form));
  selected=strictSites(C).filter(s=>(!region || s.region===region) && (!species || s.species.includes(species)) && inPeriod(s,period,C.strict) && searchMatch(q,s.name,s.id,s.region,s.specimen,s.method,s.age,s.description,...labels(s.species,C))).sort((a,b)=>byText(a.name,b.name));
  heading(root,selected.length,'schede nel catalogo');
  inner(root,'[data-results]').innerHTML=selected.map(s=>'<article class="box"><p class="meta">'+esc(s.region)+' · '+esc(s.age)+'</p><h2><a href="#reperto/'+encodeURIComponent(s.id)+'">'+esc(s.name)+'</a></h2><p>'+esc(s.specimen)+'</p><small>'+esc(labels(s.species,C).join(' · '))+'</small></article>').join('') || empty('Nessuna scheda corrisponde ai filtri.');
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',refresh);refresh();
 root.querySelectorAll('[data-export]').forEach(btn=>btn.onclick=()=>{
  if(btn.dataset.export==='json') download('homo-reperti.json',JSON.stringify(selected,null,2),'application/json');
  else {
   const keys=['id','name','specimen','species','region','coordinates','age','ageType','spans','method','discovery','description','institution','limits','level','sources','version','reviewed'];
   const columns=['ID','Sito','Reperti','Popolazioni','Regione','Coordinate (lon, lat)','Età','Tipo di data','Intervalli in ka','Metodo','Scoperta','Descrizione','Istituzione','Limiti','Evidenza','Fonti','Versione','Revisione'];
   download('homo-reperti.csv',csv([columns,...selected.map(s=>keys.map(k=> k==='species'?labels(s.species,C).join(' / '): k==='sources'?s.sources.map(v=>v.url).join(' / '): Array.isArray(s[k])?JSON.stringify(s[k]):s[k]))]),'text/csv;charset=utf-8');
  }
 });
}

export function renderSpecimen(root,C,id){
 const s=C.sites.find(row=>row.id===id);
 if(!s || (C.strict && !supported(s.level))){root.innerHTML=empty(s?'Scheda esclusa dal filtro di attendibilità.':'Scheda assente dal catalogo.');return;}
 const fields=[
  ['Reperti e identificativi',s.specimen],['Posizione',s.region],['Coordinate geografiche',s.coordinates? s.coordinates[1]+'°, '+s.coordinates[0]+'° (latitudine, longitudine). '+(s.coordinateScope||'') : s.coordinateScope],
  ['Età e incertezza',C.strict&&s.dateLevel&&!supported(s.dateLevel)?'Stima esclusa dal filtro di attendibilità.':s.age],
  ['Metodo di datazione',s.method],['Scoperta e scavi',s.discovery],['Istituzione indicata dalla fonte',s.institution],['Limiti dell’interpretazione',s.limits]
 ];
 const imgs=(C.images||[]).filter(im=>(imageSites[id]||[]).includes(im.id));
 root.innerHTML='<p class="meta">'+esc(s.evidenceType)+'</p><p class="lead">'+esc(s.description)+'</p>'+
 levelTag(s.level)+'<p>'+speciesLinks(s.species,C)+'</p><dl>'+fields.filter(x=>x[1]).map(([k,v])=>'<dt><strong>'+esc(k)+'</strong></dt><dd>'+esc(v)+'</dd>').join('')+'</dl>'+
 (imgs.length?'<h3>Documentazione visiva</h3><div class="gallery-grid">'+imgs.map(im=>'<figure><button type="button" class="figure-btn" data-image="'+esc(im.id)+'" aria-label="'+esc('Ingrandisci '+im.title)+'"><img loading="lazy" src="'+esc(im.src)+'" alt="'+esc(im.title)+'"></button><figcaption><strong>'+esc(im.title)+'</strong> · '+esc(im.type)+'<br>'+esc(im.caption)+'<br><small>'+esc(im.credit)+' · '+link(im.licenseUrl,im.license)+' · '+link(im.url,'Scheda originale')+'</small></figcaption></figure>').join('')+'</div>':'')+
 cites(s.sources,C.refs)+'<p class="small">Revisione del record '+esc(s.reviewed)+' · Versione '+esc(s.version)+'</p>';
}

function normalizedSource(s){
 const raw=(s.doi||s.url||'').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'');
 return raw.replace(/\/$/,'').toLowerCase() || norm(s.title);
}
function sourceList(C){
 const entries=new Map();
 const include=s=>{
  if(!s?.title) return;
  const key=normalizedSource(s);
  if(!key) return;
  const current=entries.get(key);
  if(!current) {entries.set(key,{...s});return;}
  for(const [field,value] of Object.entries(s)) if(!current[field] && value)current[field]=value;
 };
 (Object.values(C.refs||{})).forEach(include);
 C.monos.forEach(m=>(m.sources||[]).forEach(include));
 C.sites.forEach(s=>(s.sources||[]).forEach(include));
 (C.debates||[]).forEach(d=>(d.sources||[]).forEach(include));
 return [...entries.values()].sort((a,b)=>byText(a.authors||a.title,b.authors||b.title) || (Number(a.year)||0)-(Number(b.year)||0));
}
const bibString=s=>String(s||'').replace(/[{}]/g,'').replaceAll('\\',' ').replace(/[\r\n]/g,' ');
function bibliography(rows,kind){
 if(kind==='ris')return rows.map(s=>[['TY',s.doi?'JOUR':'GEN'],['TI',s.title],['AU',s.authors],['PY',s.year],['JO',s.journal],['DO',s.doi],['UR',s.url],['ER','']].filter(([k,v])=>v||k==='ER').map(([k,v])=>k+'  - '+String(v??'').replace(/[\r\n]/g,' ')).join('\r\n')).join('\r\n\r\n')+'\r\n';
 return rows.map((s,i)=>{
  const props=[['title',s.title],['author',s.authors],['year',s.year],['journal',s.journal],['doi',s.doi],['url',s.url]].filter(([,v])=>v);
  const key=String(s.id||'homo-'+(i+1)).replace(/[^\w-]/g,'')+'-'+(i+1);
  return '@'+(s.doi?'article':'misc')+'{'+key+',\n'+props.map(([k,v])=>'  '+k+' = {'+bibString(v)+'}').join(',\n')+'\n}';
 }).join('\n\n')+'\n';
}
export function renderSources(root,C){
 const rows=sourceList(C);
 const journals=[...new Set(rows.map(s=>s.journal).filter(Boolean))].sort(byText);
 root.innerHTML='<form class="toolbar" role="search">'+queryField('Cerca nella bibliografia','Autore, titolo, anno o DOI')+'<label class="field">Rivista o istituzione <select name="journal"><option value="">Tutte le sedi</option>'+options(journals,x=>x,x=>x)+'</select></label></form>'+
 '<div class="row-between"><p role="status"></p><div class="actions"><button data-format="bib" type="button">Scarica BibTeX</button><button data-format="ris" type="button">Scarica RIS</button></div></div><div data-results></div>';
 const form=inner(root,'form');let filtered=[];
 function refresh(){
  const {q,journal}=Object.fromEntries(new FormData(form));
  filtered=rows.filter(s=>(!journal||s.journal===journal)&&searchMatch(q,s.authors,s.title,s.journal,s.year,s.doi,s.evidence,s.type));
  heading(root,filtered.length,'riferimenti bibliografici');
  inner(root,'[data-results]').innerHTML=filtered.map(sourceCard).join('')||empty('Nessun riferimento corrisponde alla ricerca.');
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',refresh);refresh();
 root.querySelectorAll('[data-format]').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.format;download('homo-bibliografia.'+k,bibliography(filtered,k),k==='ris'?'application/x-research-info-systems':'application/x-bibtex');});
}
export function renderHistory(root,C){
 const events=C.monos.flatMap(m=>(m.discoveries||[]).map(t=>{
  const match=String(t).match(/\b(?:1[5-9]\d{2}|20\d{2})\b/);
  const [prefix,...tail]=String(t).split(' · ');
  return {year:match?Number(match[0]):null,stamp:tail.length?prefix:'',text:tail.length?tail.join(' · '):String(t),id:m.id,name:m.name};
 })).sort((a,b)=>(a.year??9999)-(b.year??9999)||byText(a.name,b.name));
 const years=[...new Set(events.map(e=>e.year).filter(Boolean))];
 root.innerHTML='<form class="toolbar" role="search">'+speciesPicker(C)+'<label class="field">Anno iniziale della voce <select name="year"><option value="">Tutti gli anni</option>'+options(years,y=>y,y=>y)+'</select></label>'+queryField('Cerca un evento')+'</form><p role="status"></p><div class="stack" data-results></div>';
 const form=inner(root,'form');
 function refresh(){
  const {q,year,species}=Object.fromEntries(new FormData(form));
  const selected=events.filter(e=>(!species||e.id===species)&&(!year||String(e.year)===year)&&searchMatch(q,e.stamp,e.text,e.name));
  heading(root,selected.length,'voci nella storia delle scoperte');
  inner(root,'[data-results]').innerHTML=selected.map(e=>'<article class="box"><p class="meta">'+esc(e.stamp||e.year)+'</p><p>'+esc(e.text)+'</p>'+speciesLinks([e.id],C)+'</article>').join('')||empty('Nessun evento corrisponde ai filtri.');
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',refresh);refresh();
}
export function renderGlossary(root,C){
 const terms=new Map();
 C.monos.forEach(m=>Object.entries(m.glossary||{}).forEach(([term,definition])=>{
  const key=norm(term);
  if(!terms.has(key)) terms.set(key,{term,entries:[]});
  terms.get(key).entries.push({definition,id:m.id,name:m.name});
 }));
 const all=[...terms.values()].sort((a,b)=>byText(a.term,b.term));
 root.innerHTML='<form class="toolbar" role="search">'+queryField('Cerca nel glossario','Termine o definizione')+speciesPicker(C)+'</form><p role="status"></p><div data-results></div>';
 const form=inner(root,'form');
 function refresh(){
  const {q,species}=Object.fromEntries(new FormData(form));
  const terms=all.map(({term,entries})=>({term,entries:entries.filter(e=>(!species||e.id===species)&&searchMatch(q,term,e.definition,e.name))})).filter(t=>t.entries.length);
  heading(root,terms.length,'termini nel glossario');
  inner(root,'[data-results]').innerHTML=terms.map(t=>'<section class="box"><h2>'+esc(t.term)+'</h2>'+t.entries.map(e=>'<p>'+esc(e.definition)+' <a href="#scheda/'+encodeURIComponent(e.id)+'">'+esc(e.name)+'</a></p>').join('')+'</section>').join('')||empty('Nessun termine corrisponde alla ricerca.');
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',refresh);refresh();
}
