import './vendor/leaflet.js';
import { countries, regions, climate } from './geography.js';
import { frames } from './coasts.js';
import { biomes } from './biomes.js';

const L = window.L;
const world = [[35, 4], [49, 21]];
const italy = [[36.4, 6.55], [47.12, 18.62]];
const url = name => new URL(name, import.meta.url).href;
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const labels = {arcaico:'Homo arcaico indeterminato', affine:'H. heidelbergensis e affini', neanderthal:'H. neanderthalensis', sapiens:'H. sapiens', controverso:'Attribuzioni multiple o controverse', tracce:'Sola evidenza indiretta'};
const colors = {arcaico:'#a77a26', affine:'#d26927', neanderthal:'#245f94', sapiens:'#267354', controverso:'#79488d', tracce:'#686b68'};
const fmt = new Intl.NumberFormat('it-IT',{maximumFractionDigits:2});
const bp = n => fmt.format(n);
const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const compareRegion = (a,b) => fold(a).split('vallee')[0].split('sudtirol')[0] === fold(b).split('vallee')[0].split('sudtirol')[0];
const isNum = v => v !== null && v !== undefined && v !== '' && Number.isFinite(+v);
const nice = (a,b) => a === b ? 'circa ' + bp(a) : bp(a) + '–' + bp(b);
const short = n => n >= 1e6 ? fmt.format(n/1e6)+' Ma' : fmt.format(n/1000)+' ka';
const options = (list, all='Tutti') => '<option value="">'+esc(all)+'</option>'+list.map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join('');
const listValues = (list,key) => [...new Set(list.flatMap(x => textValue(x[key]) ? [textValue(x[key])] : []))].sort((a,b)=>a.localeCompare(b,'it'));
const textValue = x => typeof x === 'string' || typeof x === 'number' ? String(x).trim() : Array.isArray(x) ? x.map(textValue).filter(Boolean).join(', ') : '';
const findRange = f => isNum(f.older) && isNum(f.younger) ? [Math.max(+f.older,+f.younger), Math.min(+f.older,+f.younger)] : null;
function datedRange(f) {
  const scale = String(f.scale || f.dateScale || f.chronologyScale || f.chronoscale || '');
  if(/non calibr|uncal|radiocarbon years|14c bp(?!.*cal)/i.test(scale) && !/cal bp/i.test(scale)) return null;
  return findRange(f);
}
const overlaps = (a,b,c,d) => a >= d && b <= c;
function chronologyOptions(record) {
  const alternatives=Array.isArray(record.datingAlternatives) ? record.datingAlternatives : [];
  const choices=alternatives.flatMap(a=>{
    const range=datedRange(a);
    return range ? [{range,label:textValue(a.label),ref:a.ref}] : [];
  });
  if(choices.length)return choices;
  const range=datedRange(record);
  return range ? [{range,label:'',ref:null}] : [];
}
const horizon = [2000000,5000];
const windows = [
  ['Intera sequenza',...horizon],['Pleistocene inferiore',2000000,774000],['Pleistocene medio',774000,129000],
  ['Pleistocene superiore',129000,11700],['Transizione neandertaliani–sapiens',55000,35000],
  ['Ultimo massimo glaciale',26500,19000],['Tardoglaciale e primo Olocene',19000,5000],['Olocene iniziale e Mesolitico',11700,5000]
];
const events = [
  ['Caucaso · Dmanisi','Mondo',1850000,1780000,'Le industrie del sito precedono il deposito dei celebri crani. La fascia raffigura le occupazioni più antiche.','https://pmc.ncbi.nlm.nih.gov/articles/PMC3127884/'],
  ['Spagna · Sima del Elefante TE7','Europa',1400000,1100000,'Il mascellare ATE7-1 conserva parte di una faccia. Gli autori propongono Homo aff. erectus.','https://doi.org/10.1038/s41586-025-08681-0'],
  ['Marocco · Jebel Irhoud','Mondo',349000,281000,'Termoluminescenza delle selci riscaldate associate ai resti di Homo sapiens, 315 ± 34 ka.','https://pubmed.ncbi.nlm.nih.gov/28593967/'],
  ['Monticchio · ultimo interglaciale terrestre','Clima',127200,109500,'La successione pollinica e le varve del lago descrivono un interglaciale regionale. Gli estremi differiscono da quelli delle definizioni marine.','https://doi.org/10.1073/pnas.0603321104'],
  ['Fumane · livelli uluzziani','Culture',44500,41100,'Intervallo modellato per il livello A3. La sequenza di Fumane non stabilisce limiti cronologici universali.','https://pmc.ncbi.nlm.nih.gov/articles/PMC9992387/'],
  ['Fumane · Protoaurignaziano A2–A1','Culture',42000,39250,'Intervallo al 95,4% del modello per A2–A1. La sovrapposizione statistica con A3 conserva l’incertezza delle datazioni.','https://pmc.ncbi.nlm.nih.gov/articles/PMC9992387/'],
  ['Bacino adriatico · Gravettiano','Culture',35000,25000,'Le analisi di più siti collocano l’inizio fra 35 e 34 ka e la fine fra 26 e 25 ka cal BP. La barra comprende gli estremi esterni.','https://doi.org/10.1016/j.quascirev.2021.107319'],
  ['Estensione glaciale globale · LGM','Clima',26500,19000,'Sintesi globale delle posizioni di massima estensione glaciale. I singoli ghiacciai alpini hanno cronologie locali.','https://doi.org/10.1126/science.1172873'],
  ['Adriatico · Epigravettiano antico','Culture',26000,17600,'Gli intervalli delle transizioni regionali sono circa 26–25 ka e 18,1–17,6 ka cal BP.','https://doi.org/10.1016/j.quascirev.2021.107319'],
  ['Adriatico · Epigravettiano recente','Culture',17600,11600,'Le transizioni stimate si collocano fra 17,6–17,1 ka e 11,9–11,6 ka cal BP.','https://doi.org/10.1016/j.quascirev.2021.107319']
];
const layerLabels = {politica:'Italia contemporanea',rilievo:'Rilievi e morfologia',paleo:'Paleogeografia',mare:'Variazioni del livello marino',ghiaccio:'Estensione delle glaciazioni',bio:'Ambienti ricostruiti',corridoi:'Possibili corridoi migratori'};
const taxaFor = (s,fs) => [...new Set(fs.map(f=>f.taxon).filter(k=>k && k in labels).concat(fs.length ? [] : [s.taxon || 'tracce']))];
const anatomyGroups = {
  denti:/dent|tooth|teeth|incis|molar|canin|premol|enamel/i,
  cranio:/cran|front|pariet|skull|occipit|temporale|mastoid|maxill|mascell|zygoma|zigom/i,
  mandibola:/mandib|jaw/i, tronco:/vertebr|costol|costal|stern|rib\b|sacr/i,
  arti:/fem[ou]|omero|omerale|humer|tibi|fibul|peron|radi[ou]|uln|clavic|scapol|scapul|metacarp|metatars|calcagn|calcan|talus|tallone|phal|falang|patell|rotul|mano|piede|foot|hand/i,
  bacino:/bacin|pelvi|ischi|ileo|iliac|ilium|coxal|hip/i, scheletro:/scheletr|skeleton|sepolt|burial/i
};
const geoHelp = `<details class="ag-provenance"><summary>Fonti cartografiche, licenze e scala</summary><ul>
<li>Confini contemporanei semplificati da <a href="https://github.com/openpolis/geojson-italy">ISTAT / Openpolis, CC BY 4.0</a> e <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth, pubblico dominio</a>.</li>
<li>Rilievo terrestre e sottomarino attuale da <a href="https://doi.org/10.7289/V5C8276M">ETOPO1, Amante ed Eakins, NOAA, 2009</a>, campionamento a 2′, ombreggiatura e colori elaborati per l’atlante.</li>
<li>Terre e mari in 53 epoche, da 26.000 anni fa a oggi, da <a href="https://doi.org/10.1111/geb.13573">De Groeve et al., 2022</a>, <a href="https://doi.org/10.21942/uva.20029220.v1">raster SLW140 GEBCO 2021, CC BY 4.0</a>. Ritaglio italiano di un modello con celle di 2′ e intervalli di 500 anni.</li>
<li>Glaciazioni da <a href="https://doi.org/10.5281/zenodo.15600659">GLACIMONTIS, Lima et al., CC BY 4.0</a>, <a href="https://doi.org/10.1038/s41597-026-06841-z">articolo del 2026</a>. Ritaglio del raster normalizzato; esempi delle ricostruzioni originarie per <a href="https://doi.org/10.1111/bor.12427">Orta</a>, <a href="https://doi.org/10.1016/j.quascirev.2022.107400">Ticino-Toce</a> e <a href="https://doi.org/10.1016/j.quascirev.2018.07.003">Appennino settentrionale</a>.</li>
<li>Biomi modellati da <a href="https://doi.org/10.1038/s41597-021-01009-3">Krapp et al., 2021</a>, <a href="https://zenodo.org/records/8415273">pastclim, CC BY 4.0</a>. Ritaglio dei livelli di HOMO a 0,5°, con categorie aggregate. Archivi pollinici di <a href="https://doi.org/10.1073/pnas.0603321104">Monticchio</a> e <a href="https://www.sciencedirect.com/science/article/abs/pii/S0277379110002349">Fimon</a>.</li>
<li>Ipotesi del corridoio meridionale delle Alpi da <a href="https://doi.org/10.1038/s41586-023-05726-0">Posth et al., 2023</a>. Il simbolo è disegnato per l’atlante.</li>
<li>Serie marina globale <a href="https://doi.org/10.1594/PANGAEA.701576">LR04, Lisiecki e Raymo 2005, CC BY 3.0</a>, ritaglio degli ultimi due milioni di anni. <a href="https://leafletjs.com/">Leaflet 1.9.4</a>, BSD 2-Clause. La proiezione Web Mercator serve alla navigazione.</li></ul></details>`;

export function renderGeo(container, data, onSite, mode='map', initialRegion='') {
  if(container._atlasGeoDestroy) container._atlasGeoDestroy();
  const records = new Map();
  const sites = data.sites.filter(s=>s.kind!=='escluso' && s.period!=='Escluso');
  for(const f of data.finds) {
    if(!records.has(f.site)) records.set(f.site,[]);
    records.get(f.site).push(f);
  }
  const state = {older:horizon[0],younger:horizon[1],axis:[...horizon],layer:'rilievo',coast:21000,biome:45000,page:0};
  const regionNames=[...new Set([...sites.map(s=>s.region).filter(Boolean),...(initialRegion?[initialRegion]:[])])].sort((a,b)=>a.localeCompare(b,'it'));
  const selectList = (key, caption, values, all) => '<label>'+caption+'<select data-key="'+key+'">'+options(values,all)+'</select></label>';
  const traits = data.finds.concat(sites).map(f=>({...f,conservation:textValue(f.preservation || f.conservation || f.state || f.condition || '')}));
  const root=document.createElement('section');root.className='atlas-geo';container.replaceChildren(root);
  root.innerHTML=`<div class="ag-top">
    ${selectList('region','Regione',regionNames.map(x=>[x,x]),'Tutta Italia')}
    ${selectList('taxon','Attribuzione',Object.entries(labels),'Tutte le attribuzioni')}
    <label>Carta tematica<select data-key="layer">${Object.entries(layerLabels).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')}</select></label>
    </div>
    <div class="ag-layerControls"></div><p class="ag-layerNote"></p>
    <div class="ag-map" role="region" aria-label="Carta interattiva dei ritrovamenti italiani"></div>
    <ul class="ag-legend">${Object.entries(labels).map(([k,v])=>'<li><i style="--ag-color:'+colors[k]+'"></i>'+v+'</li>').join('')}</ul>
    <div class="ag-selection" aria-live="polite"></div>
    <details class="ag-time" ${mode==='time'?'open':''}><summary>Finestra temporale e confronti</summary>
    <div class="ag-time-body"><div class="ag-controlrow"><label>Inquadramento cronologico<select data-key="window">${windows.map(([v],i)=>'<option value="'+i+'">'+v+'</option>').join('')}<option value="custom">Finestra personalizzata</option></select></label>
    <button type="button" data-action="zoom">Ingrandisci la finestra</button><button type="button" data-action="alltime">Due milioni di anni</button></div>
    <div class="ag-sliders">${[['older','Estremo antico'],['younger','Estremo recente']].map(([key,v])=>'<label>'+v+' · anni BP<input type="number" min="5000" max="2000000" step="1" data-number="'+key+'"><input type="range" data-range="'+key+'" aria-label="'+v+' della finestra"></label>').join('')}</div>
    <p class="ag-dates" aria-live="polite"></p>
    <div class="ag-plot"></div>
    <label class="ag-comparison">Confronta con l’Italia<select data-key="compare">${options([['Europa','Europa'],['Mondo','Resto del mondo'],['Clima','Intervalli climatici'],['Culture','Culture archeologiche']],'Tutti i riferimenti')}</select></label>
    <div class="ag-events"></div></div></details>
    <details class="ag-filters"><summary>Filtri sui reperti</summary><div class="ag-filtergrid">
    ${selectList('anatomy','Anatomia',[['denti','Denti'],['cranio','Cranio e massiccio facciale'],['mandibola','Mandibola'],['tronco','Tronco'],['arti','Arti, mani e piedi'],['bacino','Bacino'],['scheletro','Scheletro / sepoltura']],'Tutte le anatomie')}
    ${selectList('method','Metodo di datazione',listValues(traits,'method').map(x=>[x,x]),'Tutti i metodi')}
    ${selectList('certainty','Certezza scientifica',listValues(traits,'certainty').map(x=>[x,x]),'Tutti i livelli')}
    ${selectList('conservation','Conservazione',listValues(traits,'conservation').map(x=>[x,x]).concat([['__none','Non specificata']]),'Tutti gli stati')}
    ${selectList('kind','Tipo di evidenza',[['corporeo','Resti corporei'],['impronte','Impronte'],['archeologia','Sola archeologia']],'Tutte le evidenze')}
    <label>Minimo di schede di reperto per sito<input data-key="count" type="number" min="0" step="1" value="0"></label></div></details>
    <div class="ag-result-head"><h3>Siti nella selezione</h3><button type="button" data-action="reset">Azzera i filtri</button></div>
    <p class="ag-count" role="status" aria-live="polite"></p><div class="ag-results"></div><div class="ag-pages"></div>
    ${geoHelp}`;
  const q=s=>root.querySelector(s);
  const field=s=>q('[data-key="'+s+'"]');
  field('region').value=initialRegion;
  field('layer').value='rilievo';
  const map=L.map(q('.ag-map'),{scrollWheelZoom:false,zoomSnap:0.25,minZoom:4,maxZoom:11,maxBounds:[[33,0],[51,25]],maxBoundsViscosity:.9,attributionControl:false});
  L.control.scale({imperial:false,position:'bottomleft',maxWidth:100}).addTo(map);
  map.zoomControl.getContainer().querySelector('.leaflet-control-zoom-in').setAttribute('aria-label','Ingrandisci carta');
  map.zoomControl.getContainer().querySelector('.leaflet-control-zoom-out').setAttribute('aria-label','Riduci carta');
  const base=L.layerGroup().addTo(map), them=L.layerGroup().addTo(map), markers=L.layerGroup().addTo(map);
  for(const [name,z] of [['baseVector',201],['mapRaster',202],['mapOver',350],['mapGeo',390]]) map.createPane(name).style.zIndex=z;
  const drawShape = (group,geojson,opts, pane='mapGeo')=>L.geoJSON(geojson,{style:opts,interactive:false,pane}).addTo(group);
  const paintImage=(src,alt,opacity=1,pane='mapRaster',group=base)=>L.imageOverlay(src,world,{alt,opacity,interactive:false,pane}).addTo(group);
  const matchRegion = value=>regions.features.find(r=>compareRegion(r.properties.reg_name,value));
  function fit(value){
    const reg=matchRegion(value);
    map.fitBounds(reg ? L.geoJSON(reg).getBounds() : italy,{padding:[12,12],maxZoom:8,animate:false});
  }
  fit(initialRegion);
  let destroyed=false;
  const observer=typeof ResizeObserver==='undefined' ? null : new ResizeObserver(()=>{if(!destroyed&&root.isConnected){map.invalidateSize({pan:false});}});
  observer?.observe(q('.ag-map'));
  const routeChanged=()=>requestAnimationFrame(()=>{if(!root.isConnected)dispose();});
  const dispose=()=>{if(destroyed)return;destroyed=true;observer?.disconnect();window.removeEventListener('hashchange',routeChanged);map.remove();};
  window.addEventListener('hashchange',routeChanged);
  container._atlasGeoDestroy=dispose;
  let visible=[],activeIndex=new Map();
  const regStyle={color:'#6a6e60',weight:.9,opacity:.82,fill:false};
  function nameMark(xy,text,cls='') {
    L.marker(xy,{interactive:false,keyboard:false,pane:'mapGeo',icon:L.divIcon({className:'ag-label '+cls,html:esc(text),iconSize:[115,20],iconAnchor:[57,10]})}).addTo(them);
  }
  function pointInfo(xy,name,body){
    const item=L.circleMarker(xy,{radius:6,color:'#255138',fillColor:'#e7eed4',weight:2.5,fillOpacity:1,pane:'mapGeo'}).addTo(them);
    item.bindTooltip(name).bindPopup('<strong>'+esc(name)+'</strong><p>'+esc(body)+'</p>');
  }
  function drawLayer(){
    base.clearLayers();them.clearLayers();
    const layer=state.layer, paleo=layer==='paleo'||layer==='mare';
    drawShape(base,countries,{fillColor:'#e2ddc8',fillOpacity:1,weight:1,color:'#aaa98c'},'baseVector');
    if(layer!=='politica' && !paleo) paintImage(url('rilievo.webp'),'Rilievo terrestre e batimetria moderna');
    if(paleo) {
      paintImage('data:image/png;base64,'+frames[Math.round(state.coast/500)],'Terre emerse e mari ricostruiti');
      drawShape(them,countries,{fill:false,color:'#4f6971',dashArray:'3 4',weight:1.2,opacity:.85});
    }
    if(layer==='politica'||layer==='rilievo')drawShape(them,regions,regStyle);
    if(layer==='politica'){
      for(const f of regions.features){
        const center=L.geoJSON(f).getBounds().getCenter();
        if(map.getZoom()>=6.4)nameMark(center,f.properties.reg_name.split('/')[0]);
      }
    }
    if(layer==='ghiaccio')paintImage(url('ghiacciai.png'),'Massima estensione locale dei ghiacciai',.94,'mapOver',them);
    if(layer==='bio') {
      paintImage('data:image/png;base64,'+biomes[String(state.biome/1000)],'Biomi modellati',.94,'mapOver',them);
      pointInfo([45+28/60,11+32/60],'Lago di Fimon','I sedimenti del lago conservano una sequenza pollinica che documenta come la vegetazione del margine alpino sia cambiata durante l’ultimo ciclo glaciale.');
      pointInfo([40+56/60,15+35/60],'Lago Grande di Monticchio','Le varve e il polline registrano il passaggio dalla steppa al bosco e limiti dell’ultimo interglaciale differenti secondo la regione. Punto di riferimento del bacino.');
    }
    if(layer==='corridoi'){
      L.polyline([[45.52,15.6],[45.7,13.55],[45.67,12.15],[45.45,10.77]],{color:'#783e68',weight:5,opacity:.95,dashArray:'7 9',pane:'mapGeo',interactive:false}).addTo(them);
      nameMark([45.65,12.4],'← verso ovest','ag-route');
    }
    const reg=matchRegion(field('region').value);
    if(reg)drawShape(them,reg,{color:'#203b42',weight:2.4,fill:false});
    const cb=q('.ag-layerControls'); const note=q('.ag-layerNote');
    cb.replaceChildren();
    const addSelector=(caption,epochOptions,value,onChange)=>{
      cb.innerHTML='<label>'+caption+'<select>'+epochOptions.map(([k,l])=>'<option value="'+k+'">'+esc(l)+'</option>').join('')+'</select></label>';
      const sel=cb.querySelector('select');sel.value=String(value);sel.addEventListener('change',()=>{onChange(+sel.value);drawLayer();});
    };
    const notes={
      politica:'Confini amministrativi contemporanei. Ingrandisci la carta per leggere i nomi regionali.',
      rilievo:'Rilievo e fondali attuali. Le tinte chiare individuano le pianure e le piattaforme marine, l’ombreggiatura evidenzia il rilievo.',
      paleo:'Ocra per le terre allora emerse e oggi sommerse, avorio per le altre terre, verde acqua per i mari fino a 140 m di profondità. Il tratteggio segna i confini e le coste attuali.',
      mare:'Confronta le 53 ricostruzioni ogni 500 anni. L’ocra mostra la superficie allora emersa e oggi sommersa. Il modello considera batimetria e variazioni regionali del livello relativo del mare.',
      ghiaccio:'L’azzurro rappresenta le massime estensioni glaciali locali sintetizzate da GLACIMONTIS per l’intervallo 57–14 ka. Gli avanzamenti disegnati possono appartenere a momenti diversi.',
      bio:'Biomi potenziali su celle di mezzo grado. Verde scuro per le foreste, oliva per i boschi aperti, ocra per le praterie, grigio per la tundra. I due cerchi indicano archivi pollinici indipendenti.',
      corridoi:'Tratteggio viola, ipotesi geografica. Le affinità genomiche suggeriscono un ingresso da nord-est e movimenti est–ovest a sud delle Alpi durante o attorno all’ultimo massimo glaciale. La posizione della linea è schematica.'
    };
    if(paleo)addSelector('Paesaggio ricostruito',frames.map((_,i)=>[i*500,i===0?'Oggi':bp(i*500)+' anni fa']).reverse(),state.coast,x=>state.coast=x);
    if(layer==='bio')addSelector('Epoca del modello',Object.keys(biomes).map(Number).sort((a,b)=>b-a).map(x=>[x*1000,x+' ka']),state.biome,x=>state.biome=x);
    if(paleo||layer==='bio'){
      const btn=document.createElement('button');btn.type='button';btn.textContent='Filtra i siti intorno a questa epoca';
      btn.onclick=()=>{const ep=paleo?state.coast:state.biome;const d=paleo?500:2500;
        if(ep+d<horizon[1]){note.textContent='Questa epoca è più recente del termine dell’atlante, fissato a 5.000 BP.';return;}
        setWindow(Math.min(horizon[0],ep+d),Math.max(horizon[1],ep-d));q('.ag-time').open=true;};
      cb.append(btn);
    }
    note.textContent=notes[layer]+(paleo||layer==='bio'?' Il selettore del paesaggio e la finestra dei reperti sono indipendenti.':'');
    if(layer==='corridoi')note.insertAdjacentHTML('beforeend',' <a href="https://doi.org/10.1038/s41586-023-05726-0">Studio di Posth et al.</a>');
  }
  const cityProps=['lat','lon'];
  const geocoded=s=>cityProps.every(k=>isNum(s[k])) && +s.lat>=35 && +s.lat<=48 && +s.lon>=5 && +s.lon<=20;
  const siteClick=id=>{if(typeof onSite==='function')onSite(id);};
  function selectSite(s){
    const box=q('.ag-selection'); const f=activeIndex.get(s.id)||[]; const ts=taxaFor(s,f);
    box.hidden=false;
    box.innerHTML='<div><strong>'+esc(s.name)+'</strong><p>'+esc(s.region)+' · '+esc(ts.map(k=>labels[k]||k).join(' / '))+'</p><p>'+esc(textValue(s.precision)||'Precisione della localizzazione non specificata')+'</p></div><button type="button">Apri la scheda del sito</button>';
    box.querySelector('button').onclick=()=>siteClick(s.id);
  }
  function buildMarkers(){
    markers.clearLayers();const groups=new Map();
    for(const s of visible.filter(geocoded)){
      const key=s.lat+','+s.lon;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(s);
    }
    for(const list of groups.values()){
      const s=list[0], labs=[...new Set(list.flatMap(d=>taxaFor(d,activeIndex.get(d.id)||[])))];
      const key=labs.length===1?labs[0]:'controverso';
      const approx=list.some(v=>/appross|comun|centroide|indicativ|localit|gazetteer/i.test(textValue(v.precision)));
      const icon=L.divIcon({className:'ag-marker'+(approx?' ag-approx':''),html:'<span style="--ag-color:'+(colors[key]||colors.controverso)+'">'+(list.length>1?list.length:'')+'</span>',iconSize:[26,26],iconAnchor:[13,13]});
      const names=list.map(x=>x.name).join(' · '), marker=L.marker([+s.lat,+s.lon],{icon,keyboard:true,title:names,alt:names}).addTo(markers);
      marker.bindTooltip(esc(names),{direction:'top',offset:[0,-8]});
      marker.on('click',()=>{
        if(list.length===1){selectSite(s);return;}
        const box=q('.ag-selection');box.hidden=false;box.innerHTML='<strong>Siti alla medesima posizione pubblicata</strong><div class="ag-joint"></div>';
        for(const same of list){const btn=document.createElement('button');btn.type='button';btn.textContent=same.name;btn.onclick=()=>selectSite(same);box.lastChild.append(btn);}
      });
    }
  }
  function readFilters(){
    const read=k=>field(k).value;
    const reg=read('region'), kind=read('kind'), taxon=read('taxon'), anatomy=read('anatomy'), method=read('method'), certainty=read('certainty'), preserve=read('conservation');
    const min=Math.max(0,Number(read('count'))||0), full=state.older===horizon[0] && state.younger===horizon[1];
    const timeFits=f=>{
      const ranges=chronologyOptions(f);
      return ranges.length ? ranges.some(({range})=>overlaps(...range,state.older,state.younger)) : full;
    };
    activeIndex=new Map();visible=sites.filter(s=>{
      if(reg && !compareRegion(s.region,reg) || kind && s.kind!==kind)return false;
      const rs=records.get(s.id)||[];
      const kept=rs.filter(f=>{
        const status=textValue(f.preservation || f.conservation || f.state || f.condition);
        return (!taxon || taxon===(f.taxon||s.taxon)) && (!method || textValue(f.method)===method) && (!certainty || textValue(f.certainty)===certainty)
          && (!preserve || (preserve==='__none' ? !status : status===preserve))
          && (!anatomy || anatomyGroups[anatomy].test(textValue(f.anatomy)+' '+textValue(f.name)))
          && timeFits(f);
      });
      const viaSite=!rs.length&&!anatomy&&!preserve&&(!taxon||taxon===s.taxon)
        &&(!method||method===textValue(s.method))&&(!certainty||certainty===textValue(s.certainty))&&timeFits(s);
      if((!kept.length&&!viaSite) || kept.length<min)return false;
      activeIndex.set(s.id,kept);return true;
    }).sort((a,b)=>a.name.localeCompare(b.name,'it'));
  }
  function showResults(){
    const countMap=visible.filter(geocoded).length, noCoords=visible.length-countMap;
    q('.ag-count').textContent=visible.length+' siti · '+countMap+' con coordinate'+(noCoords?' · '+noCoords+' consultabili nel solo elenco':'')+'. Il bordo tratteggiato indica una posizione approssimativa.';
    const pane=q('.ag-results');pane.replaceChildren();
    for(const s of visible.slice(state.page*12,(state.page+1)*12)){
      const row=document.createElement('button');row.type='button';row.className='ag-siterow';
      row.innerHTML='<strong>'+esc(s.name)+'</strong><small>'+esc(s.region)+(geocoded(s)?'':' · senza coordinate')+'</small>';
      row.onclick=()=>{selectSite(s);if(geocoded(s)){map.setView([+s.lat,+s.lon],Math.max(map.getZoom(),7),{animate:false});}q('.ag-selection').scrollIntoView({block:'nearest'});};
      pane.append(row);
    }
    if(!visible.length)pane.textContent='Nessun sito corrisponde ai filtri selezionati.';
    const pages=q('.ag-pages');pages.replaceChildren();
    if(visible.length>12){
      for(const [inc,txt] of [[-1,'Precedenti'],[0,(state.page+1)+' / '+Math.ceil(visible.length/12)],[1,'Successivi']]){
        const el=document.createElement(inc?'button':'span');el.textContent=txt;
        if(inc){el.type='button';el.disabled=state.page+inc<0||(state.page+inc)*12>=visible.length;el.onclick=()=>{state.page+=inc;showResults();};}
        pages.append(el);
      }
    }
  }
  function lineHTML(name,lo,hi,aside,color,link,more) {
    const x=100*(state.older-Math.min(lo,state.older))/(state.older-state.younger), w=100*(Math.min(lo,state.older)-Math.max(hi,state.younger))/(state.older-state.younger);
    const label=link?'<a href="'+esc(link)+'">'+esc(name)+'</a>':esc(name);
    return '<div class="ag-event"><div><strong>'+label+'</strong><small>'+esc(aside)+' · '+nice(lo,hi)+' BP</small></div><div class="ag-track" aria-hidden="true"><i style="left:'+x+'%;width:'+w+'%;--ag-color:'+color+'"></i></div></div>'+(more?'<p class="ag-event-note">'+esc(more)+'</p>':'');
  }
  let maxDateRows=10;
  function showTime() {
    q('.ag-dates').textContent=nice(state.older,state.younger)+' anni BP. I siti con datazioni sovrapposte alla finestra compaiono sulla carta. La vista integrale include anche schede prive di intervallo confrontabile.';
    const svg=q('.ag-plot'), poly=climate.filter(([a])=>a<=state.older&&a>=state.younger).map(([a,b])=>(((state.older-a)/(state.older-state.younger))*600).toFixed(2)+','+(8+(5.4-b)*31).toFixed(2)).join(' ');
    svg.innerHTML='<div class="ag-plot-label"><strong>Clima globale · δ¹⁸O bentonico</strong><span>5,4–2,6 ‰</span></div><svg viewBox="0 0 600 102" preserveAspectRatio="none" role="img" aria-label="Serie marina LR04 per la finestra selezionata"><path d="M0 28H600M0 59H600M0 90H600" fill="none" stroke="#c4cdc5"/><polyline fill="none" stroke="#33666d" stroke-width="1.35" vector-effect="non-scaling-stroke" points="'+poly+'"/></svg><div class="ag-axis"><span>'+short(state.older)+'</span><span>'+short(state.younger)+'</span></div><p>I valori alti, in alto nel grafico, riflettono in genere più ghiaccio continentale e oceani profondi più freddi. La risoluzione della serie limita i confronti sulle finestre più brevi. <a href="https://doi.org/10.1594/PANGAEA.701576">Serie LR04</a></p>';
    const cat=field('compare').value, scope=q('.ag-events');
    const matching=events.filter(e=>(!cat||e[1]===cat)&&overlaps(e[2],e[3],state.older,state.younger));
    const rows=visible.flatMap(s=>{const fs=activeIndex.get(s.id)||[];return (fs.length?fs:[s]).flatMap(f=>chronologyOptions(f)
      .filter(({range})=>overlaps(...range,state.older,state.younger)).map(({range:dates,label})=>({s,f,dates,label})));}).sort((a,b)=>b.dates[0]-a.dates[0]);
    scope.innerHTML='<h4>Italia · reperti e contesti datati</h4>'+rows.slice(0,maxDateRows).map(({s,f,dates,label})=>lineHTML(f.name,...dates,s.region+' · '+(label|| (f===s?'contesto':s.name)),colors[f.taxon||s.taxon]||colors.controverso,'','')).join('')+(!rows.length?'<p>Nessun intervallo confrontabile nella selezione.</p>':'');
    if(rows.length>maxDateRows){const btn=document.createElement('button');btn.type='button';btn.textContent='Altri intervalli ('+(rows.length-maxDateRows)+')';btn.onclick=()=>{maxDateRows+=25;showTime();};scope.append(btn);}
    scope.insertAdjacentHTML('beforeend','<h4>Riferimenti geografici, climatici e culturali</h4>'+(matching.map(([n,g,a,b,m,u])=>lineHTML(n,a,b,g,'#ab7344',u,m)).join('')||'<p>Nessun riferimento selezionato cade in questo intervallo.</p>'));
  }
  function sync(){
    for(const key of ['older','younger']){
      const r=q('[data-range="'+key+'"]'); r.min=state.axis[1];r.max=state.axis[0];r.step=state.axis[0]-state.axis[1]>160000?500:10;
      r.value=state[key];r.setAttribute('aria-valuetext',bp(state[key])+' anni BP');
      q('[data-number="'+key+'"]').value=state[key];
    }
  }
  function refresh(){
    readFilters();state.page=0;maxDateRows=10;q('.ag-selection').hidden=true;
    buildMarkers();showResults();if(q('.ag-time').open)showTime();sync();
  }
  function setWindow(older,younger,axis=true) {
    state.older=older;state.younger=younger;if(axis)state.axis=[older,younger];
    const ix=windows.findIndex(([,a,b])=>a===older&&b===younger);
    field('window').value=ix<0?'custom':String(ix);
    refresh();
  }
  for(const key of ['region','taxon','kind','method','certainty','conservation','anatomy','count'])field(key).addEventListener('change',()=>{
    if(key==='region'){fit(field('region').value);drawLayer();}refresh();
  });
  field('window').addEventListener('change',()=>{const w=windows[Number(field('window').value)];if(w)setWindow(w[1],w[2]);});
  field('compare').addEventListener('change',showTime);
  field('layer').addEventListener('change',()=>{state.layer=field('layer').value;drawLayer();});
  q('.ag-time').addEventListener('toggle',()=>{if(q('.ag-time').open)showTime();});
  q('[data-action="zoom"]').onclick=()=>{
    const size=state.older-state.younger;
    if(size<=20)return;
    const mid=(state.older+state.younger)/2;setWindow(Math.round(mid+size/4),Math.round(mid-size/4));
  };
  q('[data-action="alltime"]').onclick=()=>setWindow(...horizon);
  q('[data-action="reset"]').onclick=()=>{
    for(const k of ['taxon','kind','anatomy','method','certainty','conservation','compare'])field(k).value='';
    field('region').value=initialRegion||'';field('count').value=0;fit(initialRegion);drawLayer();setWindow(...horizon);
  };
  for(const key of ['older','younger']){
    for(const type of ['range','number']){
      const el=q('[data-'+type+'="'+key+'"]');el.addEventListener(type==='range'?'input':'change',()=>{
        const n=Number(el.value);if(!Number.isFinite(n)||!el.value){sync();return;}
        const older=key==='older'?Math.max(state.younger+1,Math.min(horizon[0],Math.round(n))):state.older;
        const younger=key==='younger'?Math.min(state.older-1,Math.max(horizon[1],Math.round(n))):state.younger;
        if(type==='number')state.axis=[Math.max(state.axis[0],older),Math.min(state.axis[1],younger)];
        setWindow(older,younger,false);
      });
    }
  }
  map.on('zoomend',()=>{if(state.layer==='politica')drawLayer();});
  drawLayer();refresh();
  return dispose;
}
