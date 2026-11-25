import {esc} from '../ui/common.js';

const url = path => new URL(path, import.meta.url).href;
const json = async path => {
  const response = await fetch(url(path));
  if (!response.ok) throw Error(response.status);
  return response.json();
};
let collection, engine;
function records() {
  collection ??= Promise.all([json('./catalogo.json'),json('../media/catalog.json')])
    .catch(error => {collection = null; throw error;});
  return collection;
}
async function viewerEngine() {
  if (!customElements.get('model-viewer')) {
    const decoder = url('../atlante-italia/lab/vendor/draco/');
    globalThis.ModelViewerElement ??= {};
    globalThis.ModelViewerElement.dracoDecoderLocation = decoder;
    engine ??= import('../atlante-italia/lab/vendor/model-viewer.min.js')
      .catch(error => {engine = null; throw error;});
    await engine;
    customElements.get('model-viewer').dracoDecoderLocation = decoder;
  }
}
const museum = 'https://humanorigins.si.edu/evidence/3d-collection/fossils/891/la-ferrassie';
const names = ['Osserva il reperto','Dal reperto al volto','Incontralo nel suo ambiente'];
const lf = [
  {mesh:'RepertoLF1',title:'Il cranio',coords:['-0.00116m 0.08339m -0.01581m','0.03641m 0.02251m 0.08187m','0.01343m -0.03374m 0.09102m'],views:['72deg 65deg 0.36m','23deg 78deg 0.30m','9deg 87deg 0.27m'],description:'Scansione a luce strutturata del calco dell’Université de Liège. La mandibola è assente. Calibrazione isotropa e decimazione per la consultazione in scala.',points:[['Volta','La volta è lunga e bassa. Confronta il contorno in vista laterale.'],['Regione sopraorbitaria','Osserva il rilievo osseo che attraversa la regione sopra le orbite.'],['Regione nasale','L’apertura piriforme è un margine osseo. La punta del naso e le narici richiedono una stima.']]},
  {mesh:'VoltoLF1',coords:['0m 0.11m 0.065m','0m 0.04m 0.112m','0.030m 0.066m 0.097m'],views:['55deg 75deg 0.45m','35deg 85deg 0.40m','12deg 84deg 0.36m'],title:'Il volto possibile',description:'Approssimazione facciale riferita a LF1. Il profilo osseo pone vincoli a soluzioni diverse per i tessuti molli.',points:[['Profilo della fronte','Il modello segue l’inclinazione del frontale. Capigliatura e spessore della cute dipendono dalle scelte anatomiche e visive.'],['Tessuti del naso','Cartilagini e punta sono stimate. Il fossile conserva la regione ossea.'],['Occhi e pelle','Iride, espressione e pigmentazione in questa scena sono scelte di rappresentazione.']]},
  {mesh:'FiguraLF1',habitat:'../media/ferrassie-ambiente.webp',title:'Sotto il riparo',description:'Un adulto osserva una scheggia all’ingresso di un riparo calcareo della Dordogna. Il gesto, la posa e il paesaggio illustrano un episodio immaginato.',points:[['Respiro','Il movimento del torace dà ritmo alla figura seduta.'],['Sguardo','Il breve sollevamento dello sguardo appartiene alla regia.'],['Scheggia','La lavorazione della pietra è documentata nel sito. L’oggetto qui raffigurato è una scelta di scena.']]}
];
const originalPhotos = {harbin:'harbin',lb1:'flores-calco',dh3:'naledi-dh3',irhoud10:'irhoud',cch6:'luzon-denti',ngandong:'ngandong',mauer:'mauer'};
const rawLink = (href,label) => '<a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>';
function imageStage(image, title) {
  return {title,poster:url('../'+image.src),description:image.caption,credit:image.credit,license:image.license,link:image.url,terms:image.licenseUrl};
}
function local(stage, name) {
  return {...stage,poster:url('./modelli/'+name+'.jpg'),src:url('./modelli/'+name+'.glb')};
}
function available(chapter,images,strict) {
  const ext=chapter.visteEsterne||[],cast=ext.find(v=>v.fase==='reperto');
  if(chapter.id==='lf1') {
    return lf.slice(0,strict?1:3).map((stage,step)=>local({...stage,step,
      credit:step?'Ricostruzione gbprof · Libera. Revisione specialistica da effettuare.':cast.licenza,
      link:step?null:cast.url,terms:step?null:cast.licenzaUrl,license:step?null:'CC BY 4.0',
      level:step===0?'Documentato':step===1?'Stimato':'Scelta di rappresentazione'},stage.mesh));
  }
  if(chapter.id==='les1')return [local({title:'La ricomposizione del cranio di Neo',description:chapter.immagineDidascalia,credit:cast.licenza,link:cast.url,level:'Documentato',license:'CC BY-NC 4.0',terms:'https://creativecommons.org/licenses/by-nc/4.0/'},'CranioLES1')];
  const photo=images.find(p=>p.id===originalPhotos[chapter.id]);
  if(!photo)return [];
  const first={...imageStage(photo,'Il reperto e il suo contesto'),level:'Documentato'};
  if(cast?.embed)first.embed=cast.embed;
  if(chapter.id==='dh3'&&!strict)return [local({title:'La mandibola DH3',description:'U.W. 101-361. Due silhouette fotografate della mandibola guidano l’involucro tridimensionale. Le superfici interpolate sono in grigio-verde. Larghezza e spessore sono stimati.',credit:'Berger et al., eLife 2015, fig. 4 · elaborazione gbprof, 2026',level:'Stimato',license:'CC BY 4.0',terms:'https://creativecommons.org/licenses/by/4.0/',link:'https://doi.org/10.7554/eLife.09560'},'MandibolaDH3')];
  const result=[first];
  for(const item of ext){
    if(strict||item.fase==='reperto')continue;
    const step=item.fase==='volto'?1:2;
    if(item.modelloWeb)result.push({step,title:item.tipo,src:url('../'+item.modelloWeb),poster:url('../'+item.posterWeb),description:item.didascalia,level:item.livello,credit:item.licenza,link:item.url,habitat:chapter.id==='lb1'?'../media/flores-ambiente.webp':null});
    else if(item.immagineWeb){const image=images.find(x=>x.src===item.immagineWeb);if(image)result.push({...imageStage(image,item.tipo),step,level:'Scelta di rappresentazione'});}
  }
  return result;
}
const evidenceNames=['Documentato','Stimato','Scelta di rappresentazione'];
function evidences(chapter,strict) {
  return evidenceNames.filter((_,i)=>!strict||i===0).map(level=>{
    const pages=(chapter.pagine||[]).filter(p=>p.livello===level);
    return pages.length?'<dt>'+level+'</dt><dd>'+pages.map(p=>esc(p.testo)).join(' ')+'</dd>':'';
  }).join('');
}
class PaleoVisita extends HTMLElement {
  async connectedCallback() {
    this.classList.add('paleo');
    try {
      const [db,images]=await records();
      if (!this.isConnected) return;
      const chapters=db.capitoli.filter(c=>c.idAtlante===this.getAttribute('specie'));
      const chapter=chapters.find(c=>c.id===this.selectedIndividual)||chapters[0];
      if (!chapter) {this.remove();return;}
      const strict=this.hasAttribute('rigoroso'),stages=available(chapter,images,strict);
      this.innerHTML='<header><p class="localita">'+esc(chapter.specie)+'</p><h2>'+esc(chapter.titolo)+'</h2><p>'+esc(chapter.localita)+' · '+esc(chapter.cronologia)+'</p></header><div class="viste" role="group" aria-label="Passaggi della ricostruzione"></div><div class="esposizione"><figure><div class="vetrina"></div><figcaption></figcaption><div class="comandi"></div><p class="stato" role="status"></p></figure><div class="scheda"><h3></h3><p class="descrizione"></p><div class="punti" role="group" aria-label="Punti di interesse"></div><p class="nota" aria-live="polite"></p></div></div><details><summary>Evidenze e limiti della ricostruzione</summary><dl class="evidenze">'+evidences(chapter,strict)+'</dl><p>'+esc(chapter.parti)+'</p></details><details><summary>Fonti e crediti</summary><p>'+esc(chapter.istituzione)+' · '+esc(chapter.inventario)+'</p>'+chapter.fonti.map(s=>'<p>'+rawLink(s.url,s.titolo)+'</p>').join('')+(chapter.id==='lf1'?'<p><a href="'+url('./modelli/CREDITI.md')+'">Modellazione, licenze e scelte anatomiche</a></p>':'')+'</details>';
      if(chapters.length>1) {
        const label=document.createElement('label');label.textContent='Scegli l’individuo ';
        const select=document.createElement('select');select.dataset.individuo='';
        for(const c of chapters)select.append(new Option(c.titolo,c.id,c===chapter,c===chapter));
        select.onchange=async()=>{this.stop();this.selectedIndividual=select.value;await this.connectedCallback();this.querySelector('[data-individuo]')?.focus();};
        label.append(select);this.querySelector('header').prepend(label);
      }
      if(chapter.id==='lf1')this.querySelector('details:last-child').insertAdjacentHTML('beforeend','<p>'+rawLink(museum,'Confronta il calco dello Smithsonian')+'</p>');
      this.stages=stages;
      stages.forEach((stage,index)=>this.button('.viste',names[stage.step||0],()=>this.show(index)));
      if(stages.length) this.show(0);
      if(location.hash.endsWith('/ricostruzione')) this.scrollIntoView({block:'start'});
    } catch {if(this.isConnected)this.innerHTML='<p>La raccolta delle ricostruzioni non è disponibile. Ricarica questa scheda per riprovare.</p>';}
  }
  disconnectedCallback(){this.stop();}
  stop(){this.turn=(this.turn||0)+1;this.motion?.abort();this.model?.pause?.();this.model=null;}
  button(container,title,action,css='') {
    const b=document.createElement('button');b.type='button';b.textContent=title;b.className=css;b.addEventListener('click',action);this.querySelector(container).append(b);return b;
  }
  show(index) {
    this.stop();const stage=this.stages[index];
    this.querySelectorAll('.viste button').forEach((b,i)=>b.setAttribute('aria-pressed',String(index===i)));
    const frame=this.querySelector('.vetrina');
    frame.replaceChildren();frame.classList.toggle('ambiente',Boolean(stage.habitat));frame.style.backgroundImage=stage.habitat?'url('+url(stage.habitat)+')':'';
    frame.hidden=!stage.poster&&!stage.embed&&!stage.src;
    if(stage.poster){const img=new Image();img.src=stage.poster;img.alt=stage.posterAlt||stage.title;frame.append(img);}
    const fig=this.querySelector('figcaption');
    fig.innerHTML=(stage.level?'<strong>'+esc(stage.level)+'</strong> · ':'')+esc(stage.credit||'')+(stage.license?' · '+(stage.terms?rawLink(stage.terms,stage.license):esc(stage.license)):'')+(stage.link?' · '+rawLink(stage.link,'Fonte originale'):'');
    this.querySelector('.comandi').replaceChildren();this.querySelector('.stato').textContent='';
    this.querySelector('h3').textContent=stage.title;this.querySelector('.descrizione').textContent=stage.description;
    this.querySelector('.punti').replaceChildren();this.querySelector('.nota').textContent='';
    (stage.points||[]).forEach(([name,detail],i)=>{
      this.button('.punti',name,()=>{this.querySelector('.nota').textContent=detail;
        if(this.model && stage.coords?.[i]){this.model.cameraTarget=stage.coords[i];this.model.cameraOrbit=stage.views[i];this.model.jumpCameraToGoal();this.querySelectorAll('.hotspot').forEach((b,k)=>b.hidden=k!==i);}
      });
    });
    if(stage.src||stage.embed){this.button('.comandi',stage.embed?'Apri il modello del museo':'Apri modello 3D',b=>this.load(stage,b.currentTarget),'avvia');}
    else if(stage.link&&!stage.poster) this.querySelector('.comandi').innerHTML=rawLink(stage.link,'Osserva il modello nella collezione');
  }
  async load(stage,launcher) {
    const turn=this.turn,frame=this.querySelector('.vetrina'),status=this.querySelector('.stato');
    if(stage.embed){const f=document.createElement('iframe');f.title=stage.title;f.allowFullscreen=true;f.src=stage.embed;frame.replaceChildren(f);launcher.remove();status.textContent='Visualizzatore esterno. La fonte originale rimane accessibile dai crediti.';return;}
    launcher.disabled=true;status.textContent='Apertura del modello…';
    const fail=()=>{if(!this.isConnected||turn!==this.turn)return;this.show(this.stages.indexOf(stage));this.querySelector('.stato').textContent='Il modello non è disponibile. Puoi consultare la tavola statica, le osservazioni e le fonti.';};
    try{
      await viewerEngine();if(turn!==this.turn||!this.isConnected)return;
      const model=document.createElement('model-viewer');this.model=model;
      model.alt=stage.title;model.setAttribute('camera-controls','');model.setAttribute('touch-action','pan-y');model.setAttribute('interaction-prompt','none');model.setAttribute('shadow-intensity','.65');model.setAttribute('exposure','1.05');model.poster=stage.poster;model.cameraOrbit=stage.orbit||'18deg 80deg auto';model.setAttribute('loading','eager');
      (stage.coords||[]).forEach((coord,i)=>{
        const marker=document.createElement('button');marker.type='button';marker.className='hotspot';marker.slot='hotspot-'+i;marker.dataset.position=coord;marker.textContent=String(i+1);marker.setAttribute('aria-label',stage.points[i][0]);marker.hidden=true;
        marker.onclick=()=>this.querySelectorAll('.punti button')[i].click();model.append(marker);
      });
      model.addEventListener('error',fail,{once:true});
      model.addEventListener('load',()=>{
        if(!this.isConnected||turn!==this.turn)return;
        status.textContent='Trascina per ruotare. Usa due dita, la rotella o i comandi per avvicinarti.';
        launcher.remove();
        const adjust=(angle,scale)=>{const o=model.getCameraOrbit();model.cameraOrbit=(o.theta+angle)+'rad '+o.phi+'rad '+(o.radius*scale)+'m';model.jumpCameraToGoal();};
        for(const [title,angle,scale] of [['Ruota a sinistra',-.38,1],['Ruota a destra',.38,1],['Avvicina',0,.8],['Allontana',0,1.25]])this.button('.comandi',title,()=>adjust(angle,scale));
        this.button('.comandi','Ripristina vista',()=>{this.querySelectorAll('.hotspot').forEach(b=>b.hidden=true);model.cameraTarget='auto auto auto';model.cameraOrbit=stage.orbit||'18deg 80deg auto';model.jumpCameraToGoal();});
        if(model.availableAnimations?.length){
          const reduce=matchMedia('(prefers-reduced-motion: reduce)');
          const toggle=this.button('.comandi','',()=>{if(model.paused)model.play();else model.pause();sync();});
          const sync=()=>{toggle.textContent=model.paused?'Avvia animazione':'Pausa animazione';};
          if(!reduce.matches)model.play();sync();
          this.motion=new AbortController();
          reduce.addEventListener('change',()=>{if(reduce.matches)model.pause();sync();},{signal:this.motion.signal});
        }
      },{once:true});
      frame.replaceChildren(model);model.src=stage.src;
    }catch{fail();}
  }
}
customElements.define('paleo-visita',PaleoVisita);
