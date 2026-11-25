import {esc} from '../atlante-italia/common.js';

const records = [
  {site:'grotta-guattari',find:'grotta-guattari-storico-1',name:'Guattari 1 (Circeo 1)',place:'Grotta Guattari, San Felice Circeo, Lazio',image:'img-lab-guattari',model:'model-kenyon-circeo-1'},
  {site:'saccopastore',find:'saccopastore-1',person:'saccopastore-ind-1',name:'Saccopastore 1',place:'Valle dell’Aniene, Roma, Lazio',image:'img-lab-saccopastore',model:'model-fe7bd1eb-c632-4201-81e2-fc592592ee57'},
  {site:'altamura',find:'altamura-1',name:'Altamura 1',place:'Grotta di Lamalunga, Altamura, Puglia',image:'img-lab-altamura',lesson:'lez-altamura'}
];
let models;
export function mostraRepertoItaliano(root,db,kind,id) {
  const record=records.find(r=>id===r[{sito:'site',individuo:'person',reperto:'find'}[kind]]);
  if(!record)return;
  const box=document.createElement('section'),im=db.images.find(i=>i.id===record.image);
  box.className='paleo';box.setAttribute('aria-label','Documentazione di '+record.name);
  const subject=esc(record.name);
  box.innerHTML='<header><p class="localita">Collezione italiana · '+esc(record.place)+'</p><h2>'+subject+'</h2></header><div class="esposizione"><figure>'+(im?'<div class="vetrina"><img src="'+esc(im.path)+'" loading="lazy" alt="'+esc(im.title)+'"></div><figcaption>'+esc(im.category)+' · '+esc(im.author)+' · <a target="_blank" rel="noopener" href="'+esc(im.url)+'">Fonte</a> · <a target="_blank" rel="noopener" href="'+esc(im.licenseUrl||im.url)+'">'+esc(im.license||'Crediti')+'</a></figcaption>':'')+'<div class="comandi"></div><div class="hl-model" data-italian-model></div></figure><div><h3>Dal reperto alla ricostruzione</h3><p>Il percorso comparativo mostra il cranio, un possibile volto e una scena di vita di La Ferrassie 1, rinvenuto a Savignac-de-Miremont, in Dordogna (Francia). I tratti individuali ricostruiti si riferiscono al fossile francese.</p><p><a href="../#scheda/neanderthal/ricostruzione">Confronta con La Ferrassie 1 ↗</a></p></div></div>';
  const anchor=root.querySelector('.storygrid');
  if(!anchor)return;
  anchor.before(box);
  const controls=box.querySelector('.comandi');
  if(!record.model){controls.innerHTML='<a href="#lezione/'+record.lesson+'">Osserva il reperto nella lezione di Altamura</a>';return;}
  const button=document.createElement('button');button.type='button';button.className='avvia';button.textContent='Osserva il reperto in 3D';controls.append(button);
  button.onclick=async()=>{
    button.disabled=true;
    const host=box.querySelector('[data-italian-model]');
    host.textContent='Apertura della scheda tridimensionale…';
    try {
      models??=fetch(new URL('../atlante-italia/lab/models.json',import.meta.url)).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).catch(e=>{models=null;throw e;});
      const [catalog,viewer]=await Promise.all([models,import('../atlante-italia/lab/viewer.js')]);
      if(!box.isConnected)return;
      const model=catalog.find(m=>m.id===record.model);
      await viewer.mountModel(host,model);
      button.remove();
    }catch{button.disabled=false;host.textContent='Il modello non si è aperto. La documentazione fotografica e la fonte restano consultabili.';}
  };
}
