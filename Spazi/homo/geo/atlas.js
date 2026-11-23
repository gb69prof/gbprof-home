const regionViews = {
  'Africa, Eurasia e Oceania': [-23, -48, 169, 74], 'Africa': [-21,-36,55,40],
  'Europa': [-14,32,52,72], 'Asia': [23,-12,157,75], 'Siberia': [55,40,157,73],
  'Indonesia': [93,-13,142,9], 'Filippine': [115,3,130,22], 'Oceania': [105,-48,180,8]
};
const names = {sapiens:'Homo sapiens',erectus:'Homo erectus',heidelberg:'Homo heidelbergensis',
  naledi:'Homo naledi',neanderthal:'Neanderthal',denisova:'Denisoviani',flores:'Homo floresiensis',luzon:'Homo luzonensis'};
const biomeKey = [['#427150','Foreste'],['#86955e','Savane, boscaglie e parchi'],['#cfb466','Praterie'],['#e4c194','Deserto'],['#9ba899','Tundra'],['#c2b7a5','Suolo spoglio']];
const url = file => new URL(file, import.meta.url).href;
const strong = s => ['Documentato','Fortemente supportato'].includes(s);
const pretty = n => n.toLocaleString('it-IT',{maximumFractionDigits:1});
const xy = ([lon,lat]) => [lon+180,90-lat];
const toBox = ([w,s,e,n]) => ({x:w+180,y:90-n,w:e-w,h:n-s});
const makeSvg = (tag,attrs={},txt) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg',tag);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
  if (txt!=null) el.textContent=txt;
  return el;
};
const escape = str => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let atlasData;
function loadData() {
  if (!atlasData) atlasData=Promise.all(['sites.json','epochs.json','interpretations.geojson'].map(async file=>{
    const res=await fetch(url(file));
    if(!res.ok) throw new Error('Caricamento cartografico incompleto');
    return res.json();
  })).catch(err=>{atlasData=null;throw err;});
  return atlasData;
}
function inBox([lon,lat],box) {
  const [x,y]=xy([lon,lat]); return x>=box.x && x<=box.x+box.w && y>=box.y && y<=box.y+box.h;
}
export async function renderAtlas(root,options={}) {
  const el=document.createElement('section');
  el.className='paleo-atlas';
  el.innerHTML='<p role="status">Caricamento delle carte…</p>';
  root.replaceChildren(el);
  let sites,epochs,notes;
  try {[sites,epochs,notes]=await loadData();} catch(error) {
    el.innerHTML='<p role="alert">Dati cartografici non disponibili. Riapri l’atlante quando la connessione è attiva.</p>';
    return;
  }
  const strict=Boolean(options.strict);
  el.innerHTML=`<div class="pa-controls"><label>Regione<select data-region>${Object.keys(regionViews).map(s=>`<option>${s}</option>`).join('')}</select></label>
    <label>Popolazione<select data-species><option value="">Tutte le popolazioni</option>${Object.entries(names).map(([id,v])=>`<option value="${id}">${v}</option>`).join('')}</select></label>
    <label>Siti da mostrare<select data-period><option value="slice">Compatibili con la finestra</option><option value="all">Tutte le epoche</option></select></label></div>
    <div class="pa-time"><label>Epoca della carta <output data-epoch></output><input type="range" min="0" max="${epochs.length-1}" step="1" value="6" data-slider aria-label="Epoca della carta"></label>
    <p data-date></p></div>
    <div class="pa-layers"><span>Strati</span>
    <label><input type="checkbox" data-layer="coast" checked> Paleo-coste</label>
    <label><input type="checkbox" data-layer="ice" checked> Calotte</label>
    <label><input type="checkbox" data-layer="eco"> Biomi</label>
    <label><input type="checkbox" data-layer="notes"> Interpretazioni</label></div>
    <figure class="pa-frame"><div class="pa-view"><svg class="pa-map" xmlns="http://www.w3.org/2000/svg" aria-label="Carta paleogeografica con siti archeologici attivabili" role="group" preserveAspectRatio="xMidYMid meet"></svg></div>
    <div class="pa-nav" aria-label="Navigazione sulla carta"><button type="button" data-pan="in" aria-label="Ingrandisci la carta">+</button><button type="button" data-pan="out" aria-label="Riduci la carta">−</button><button type="button" data-pan="west" aria-label="Sposta a ovest">Ovest</button><button type="button" data-pan="east" aria-label="Sposta a est">Est</button><button type="button" data-pan="north" aria-label="Sposta a nord">Nord</button><button type="button" data-pan="south" aria-label="Sposta a sud">Sud</button><button type="button" data-pan="reset">Centra regione</button><button type="button" data-pan="expand" aria-pressed="false">Schermo intero</button></div>
    <figcaption data-caption></figcaption></figure>
    <div class="pa-key" data-key></div><p class="pa-status" data-status role="status"></p>
    <div class="pa-sites" data-results></div><div data-note-list></div>
    <p class="pa-downloads"><a download="homo-siti.geojson" href="${url('sites.geojson')}">Scarica i siti in GeoJSON</a> · <a download="homo-livelli-marini.json" href="${url('epochs.json')}">Scarica i livelli del mare</a></p><details class="pa-method"><summary>Fonti, proiezione e limiti della carta</summary><p>La proiezione cilindrica equidistante mantiene paralleli i meridiani e ingrandisce le aree alle latitudini elevate. Il fondo mostra il rilievo di ETOPO5. Per ogni data la quota del mare è ricavata dalla componente principale di sette serie, con intervallo al 95%. Il confronto con la batimetria odierna suggerisce quali piattaforme potevano emergere. Subsidenza, tettonica, isostasia e sedimentazione modificano localmente le coste. A questa scala un braccio di mare stretto può scomparire.</p>
    <p>Le calotte e i biomi provengono dal dataset di Krapp et al. nella distribuzione pastclim. La griglia di mezzo grado approssima il paesaggio regionale. Le ricostruzioni ecologiche e la batimetria sono indipendenti: vicino alle coste i margini possono divergere. In modalità rigorosa rimangono la base di riferimento attuale e i reperti con attribuzione sostenuta. Le finestre controverse vengono escluse dal filtro temporale rigoroso.</p>
    <p>La finestra di confronto arriva a metà della distanza dalle date adiacenti dello slider. I simboli indicano reperti compatibili con la finestra; uno stesso intervallo di incertezza può attraversarne più di una. I minimi cronologici aperti e gli anni radiocarbonici non calibrati sono reperibili scegliendo «Tutte le epoche». Nella lista le schede rinviano alle rispettive fonti.</p>
    <ul><li><a href="https://www.ncei.noaa.gov/products/etopo-global-relief-model">NOAA/NCEI, ETOPO5 · rilievo e batimetria</a></li>
    <li><a href="https://doi.org/10.25921/rd66-5820">Spratt e Lisiecki, 2016 · dati del livello marino, NOAA</a></li>
    <li><a href="https://doi.org/10.1038/s41597-021-01009-3">Krapp et al., 2021 · ricostruzione climatica degli ultimi 800 mila anni</a></li>
    <li><a href="https://zenodo.org/records/8415273">Leonardi e Manica, pastclim · dati BIOME4, CC BY 4.0</a></li>
    <li><a href="https://www.fieldmuseum.org/page/pleistocene-sea-level-maps">Voris e Field Museum · confronto delle piattaforme della Sonda e di Sahul</a></li></ul></details>`;
  const one=s=>el.querySelector(s);
  const map=one('.pa-map'), reg=one('[data-region]'),pop=one('[data-species]'),period=one('[data-period]'),slider=one('[data-slider]');
  const layers = key=>one(`[data-layer="${key}"]`);
  if (strict) for(const key of ['coast','ice','eco']) {layers(key).checked=false;layers(key).disabled=true;}
  let box=toBox(regionViews[reg.value]);
  let width=el.clientWidth || 800;
  let selected=null;
  function setExpanded(expanded) {
    const frame=one('.pa-frame'), button=one('[data-pan="expand"]');
    frame.classList.toggle('pa-expanded',expanded);
    button.textContent=expanded?'Esci dalla carta ingrandita':'Schermo intero';
    button.setAttribute('aria-pressed',String(expanded));
    if(expanded){
      frame.setAttribute('role','dialog');
      frame.setAttribute('aria-modal','true');
      frame.setAttribute('aria-label','Carta paleogeografica ingrandita');
      button.focus();
    }else{
      for(const name of ['role','aria-modal','aria-label'])frame.removeAttribute(name);
    }
  }
  function openDetail(id) {
    const detail=el.querySelector(`[data-item="${id}"]`);
    if(detail){
      if(one('.pa-frame').classList.contains('pa-expanded'))setExpanded(false);
      detail.open=true;
      detail.scrollIntoView({block:'nearest'});
      detail.querySelector('summary').focus();
    }
  }
  one('.pa-frame').addEventListener('keydown',e=>{
    const frame=one('.pa-frame');
    if(!frame.classList.contains('pa-expanded'))return;
    if(e.key==='Escape'){
      e.preventDefault();setExpanded(false);one('[data-pan="expand"]').focus();
    }
    if(e.key==='Tab'){
      const items=[...frame.querySelectorAll('[tabindex="0"],button')];
      if(e.shiftKey&&document.activeElement===items[0]){
        e.preventDefault();items.at(-1).focus();
      }else if(!e.shiftKey&&document.activeElement===items.at(-1)){
        e.preventDefault();items[0].focus();
      }
    }
  });
  const marks=(feature,func)=>{
    feature.setAttribute('tabindex','0');
    feature.setAttribute('role','button');
    feature.addEventListener('click',func);
    feature.addEventListener('keydown',e=>{if (e.key===' '||e.key==='Enter'){e.preventDefault();func();}});
  };
  function draw() {
    const i=Number(slider.value), ep=epochs[i], date=ep.ka;
    const hi=i ? (epochs[i-1].ka+date)/2 : date+(date-epochs[i+1].ka)/2;
    const lo=i<epochs.length-1 ? (date+epochs[i+1].ka)/2 : date-(epochs[i-1].ka-date)/2;
    const temporal=period.value==='slice';
    const matches=(spans)=>spans.some(([a,b])=>a<=hi && b>=lo);
    const visible=sites.filter(s=>(!pop.value||s.species.includes(pop.value)) && (!strict||strong(s.level)) && (!temporal||((!strict||strong(s.dateLevel))&&matches(s.spans))) && inBox(s.coordinates,box));
    const displayAge=s=>strict&&!strong(s.dateLevel)?'Stima cronologica esclusa dal filtro rigoroso.':s.age;
    const noteList=layers('notes').checked ? notes.features.filter(n=>{
      const p=n.properties;
      return (!strict||strong(p.level)) && (!temporal||p.timeIndependent||matches([[p.minKa,p.maxKa]])) && (!pop.value||((p.kind==='range'?['denisova','sapiens']:p.kind==='overlap'?['sapiens','neanderthal']:['sapiens']).includes(pop.value))) && (n.geometry.type==='Point'?inBox(n.geometry.coordinates,box):n.geometry.coordinates.some(pt=>inBox(pt,box)));
    }):[];
    if(!visible.some(s=>s.id===selected))selected=null;
    one('[data-epoch]').textContent=`${(date*1000).toLocaleString('it-IT')} anni fa`;
    slider.setAttribute('aria-valuetext',one('[data-epoch]').textContent);
    one('[data-date]').textContent=`Livello medio globale stimato ${pretty(ep.sea)} m rispetto a oggi (IC 95% da ${pretty(ep.low)} a ${pretty(ep.high)} m).`;
    map.setAttribute('viewBox',`${box.x} ${box.y} ${box.w} ${box.h}`);
    // L'altezza del contenitore segue l'estensione selezionata anche sui tablet.
    map.style.aspectRatio=String(box.w/box.h);
    map.replaceChildren();
    map.append(makeSvg('title',{},`Carta a ${date} mila anni fa — ${reg.value}`));
    const addLayer=file=>map.append(makeSvg('image',{href:url('layers/'+file),x:0,y:0,width:360,height:180,preserveAspectRatio:'none'}));
    addLayer('base.webp');
    if(layers('coast').checked)addLayer(`sea-${date}.png`);
    if(layers('eco').checked)addLayer(`eco-${date}.png`);
    if(layers('ice').checked)addLayer(`ice-${date}.png`);
    const unit=box.w/Math.max(290,Math.min(width,1100));
    const step=box.w>110?30:box.w>50?15:box.w>24?10:box.w>10?5:2;
    for(let lon=-180;lon<180;lon+=step) {
      const x=180+lon;if(x<=box.x||x>=box.x+box.w)continue;
      map.append(makeSvg('line',{x1:x,x2:x,y1:box.y,y2:box.y+box.h,class:'pa-grid'}));
      map.append(makeSvg('text',{x:x+2*unit,y:box.y+12*unit,'font-size':11*unit,class:'pa-coordinate'},Math.abs(lon)+'°'+(lon<0?'O':lon>0?'E':'')));
    }
    for(let lat=-90;lat<90;lat+=step) {
      const y=90-lat;if(y<=box.y||y>=box.y+box.h)continue;
      map.append(makeSvg('line',{x1:box.x,x2:box.x+box.w,y1:y,y2:y,class:'pa-grid'}));
      map.append(makeSvg('text',{x:box.x+2*unit,y:y-2*unit,'font-size':11*unit,class:'pa-coordinate'},Math.abs(lat)+'°'+(lat<0?'S':lat>0?'N':'')));
    }
    for(const n of noteList){
      const p=n.properties;
      const g=makeSvg('g',{class:'pa-interpretation','aria-label':p.name});
      if(n.geometry.type==='LineString')g.append(makeSvg('polyline',{points:n.geometry.coordinates.map(c=>xy(c).join(',')).join(' '),class:'pa-corridor'}));
      else {
        const [x,y]=xy(n.geometry.coordinates);
        g.append(makeSvg('circle',{cx:x,cy:y,r:13*unit,class:p.kind==='overlap'?'pa-overlap':'pa-range'}));
      }
      marks(g,()=>openDetail(n.id));
      map.append(g);
    }
    visible.forEach((s,index)=>{
      const [x,y]=xy(s.coordinates);
      const g=makeSvg('g',{class:'pa-marker','aria-label':s.name+' · '+s.specimen,transform:`translate(${x} ${y})`});
      g.append(makeSvg('title',{},s.name+' · '+displayAge(s)));
      g.append(makeSvg('circle',{r:13*unit,fill:'transparent'}));
      if(s.contact)g.append(makeSvg('circle',{r:9.5*unit,class:'pa-contact'}));
      if(s.evidenceType==='Sito archeologico')g.append(makeSvg('rect',{x:-5*unit,y:-5*unit,width:10*unit,height:10*unit,class:'pa-dot'}));
      else g.append(makeSvg('circle',{r:(selected===s.id?7:5.7)*unit,class:'pa-dot'}));
      marks(g,()=>{selected=s.id;openDetail(s.id);});
      map.append(g);
    });
    one('[data-caption]').textContent=strict?'Base geografica attuale di riferimento. Sono attivi i criteri rigorosi per reperti e datazioni.':
      layers('coast').checked?'Carta paleogeografica modellata. Le piattaforme emerse sono in ocra, le terre sommerse in azzurro.':'Rilievo e linea di costa attuali usati come riferimento geografico.';
    const key=[['#5d2e22','● Reperto fossile'],['#5d2e22','■ Sito archeologico'],['#952d19','◎ Individuo con evidenza genetica di contatto']];
    if(layers('coast').checked)key.push(['#e4c27d','Piattaforma emersa']);
    if(layers('ice').checked)key.push(['#eff5f1','Calotta ricostruita']);
    if(layers('eco').checked)key.push(...biomeKey);
    if(layers('notes').checked)key.push(['#73417a','Asse migratorio ipotetico (tratteggio)'],['#69351c','Sovrapposizione regionale (anello)'],['#5b4776','Distribuzione da indagare (anello puntinato)']);
    one('[data-key]').innerHTML=key.map(([color,label])=>`<span><i style="--pa-color:${color}"></i>${label}</span>`).join('');
    one('[data-status]').textContent=`${visible.length} ${visible.length===1?'sito visibile':'siti visibili'} · ${temporal?`finestra di confronto da ${pretty(hi)} a ${pretty(lo)} mila anni fa`:'tutte le epoche, indipendentemente dalla data del paesaggio'}.`;
    const results=one('[data-results]');
    results.innerHTML=visible.length?visible.map(s=>`<details class="pa-record" data-item="${s.id}"><summary>${escape(s.name)} <span>${escape(s.region)}</span></summary><p><b>${escape(s.specimen)}</b><br>${escape(displayAge(s))}</p><p>${escape(s.limits)}</p><a href="#reperto/${s.id}">Apri la scheda del reperto</a></details>`).join(''):'<p>In questa vista nessun reperto del catalogo soddisfa i filtri. Puoi ampliare la regione o scegliere tutte le epoche.</p>';
    one('[data-note-list]').innerHTML=noteList.map(n=>`<details class="pa-method" data-item="${n.id}"><summary>${escape(n.properties.name)}</summary><p>${escape(n.properties.level)}. ${escape(n.properties.summary)}</p><a href="${escape(n.properties.source)}">Pubblicazione di riferimento</a></details>`).join('');
  }
  const reset=()=>{box=toBox(regionViews[reg.value]);};
  reg.addEventListener('change',()=>{reset();draw();});
  for(const node of [pop,period,...el.querySelectorAll('[data-layer]')])node.addEventListener('change',draw);
  slider.addEventListener('input',draw);
  el.querySelector('.pa-nav').addEventListener('click',e=>{
    const key=e.target.closest('button')?.dataset.pan;if(!key)return;
    if(key==='expand'){
      setExpanded(!one('.pa-frame').classList.contains('pa-expanded'));
      return;
    }
    if(key==='reset')reset();
    else if(key==='in'||key==='out'){
      const factor=key==='in'?Math.max(.7,5/box.w):Math.min(1.4,360/box.w,180/box.h);
      box.x+=box.w*(1-factor)/2;box.y+=box.h*(1-factor)/2;box.w*=factor;box.h*=factor;
    } else if(key==='west'||key==='east')box.x+=box.w*(key==='east'?.25:-.25);
    else box.y+=box.h*(key==='south'?.25:-.25);
    box.x=Math.max(0,Math.min(360-box.w,box.x));box.y=Math.max(0,Math.min(180-box.h,box.y));draw();
  });
  // Un ridimensionamento non richiede listener globali che restino dopo la navigazione.
  draw();
  if(typeof ResizeObserver!=='undefined'){
    const obs=new ResizeObserver(entries=>{
      if(!el.isConnected){obs.disconnect();return;}
      const next=entries[0].contentRect.width;
      if(next>0&&Math.abs(next-width)>1){width=next;draw();}
    });obs.observe(el);
  }
}
