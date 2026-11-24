const asset=(path)=>new URL(path,import.meta.url).href;
let runtime;
async function loadViewer(){
  globalThis.ModelViewerElement??={};
  globalThis.ModelViewerElement.dracoDecoderLocation=asset('./vendor/draco/');
  runtime??=import('./vendor/model-viewer.min.js').then(()=>{
    const model=customElements.get('model-viewer');
    model.dracoDecoderLocation=asset('./vendor/draco/');
    return model;
  }).catch(e=>{runtime=null;throw e;});
  await runtime;
}
export async function mountModel(host,entry){
  await loadViewer();
  const frame=document.createElement('model-viewer');
  frame.setAttribute('alt','Calco digitalizzato · '+entry.name);
  frame.setAttribute('camera-controls','');
  frame.setAttribute('touch-action','pan-y');
  frame.setAttribute('interaction-prompt','none');
  frame.setAttribute('loading','eager');
  frame.setAttribute('reveal','auto');
  frame.setAttribute('exposure','.76');
  // These thumbnails retain the scanned cast coordinates; only the viewing camera moves.
  frame.setAttribute('camera-orbit','18deg 82deg auto');
  frame.setAttribute('shadow-intensity','.56');
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Apertura della geometria…';
  const controls=document.createElement('div');controls.className='hl-model-actions';
  function turn(angle,zoom=1){
    const o=frame.getCameraOrbit();
    frame.cameraOrbit=`${o.theta+angle}rad ${o.phi}rad ${o.radius*zoom}m`;
    frame.jumpCameraToGoal();
  }
  for(const [title,fn] of [['Ruota a sinistra',()=>turn(-Math.PI/6)],['Ruota a destra',()=>turn(Math.PI/6)],['Avvicina',()=>turn(0,.82)],['Allontana',()=>turn(0,1.22)],['Ripristina vista',()=>{frame.cameraOrbit='18deg 82deg auto';frame.jumpCameraToGoal();}]]){
    const button=document.createElement('button');button.type='button';button.textContent=title;button.disabled=true;button.onclick=fn;controls.append(button);
  }
  const credits=document.createElement('p');credits.className='hl-model-credit';
  const link=document.createElement('a');link.href=entry.url;link.target='_blank';link.rel='noopener';link.textContent='Scheda della collezione ↗';
  const terms=document.createElement('a');terms.href=entry.licenseUrl;terms.target='_blank';terms.rel='noopener';terms.textContent='Condizioni di utilizzo';
  const isLocal=entry.mesh.startsWith('models/');
  const note=isLocal?'Scansione di un calco · Kenyon College. Riduzione della triangolazione, colore uniforme e scala normalizzata. CC BY 4.0. ':'© Smithsonian Institution, National Museum of Natural History. Uso didattico e non commerciale. ';
  credits.append(note,link,' · ',terms);
  const fallback=document.createElement('a');fallback.href=entry.viewer;fallback.rel='noopener';fallback.target='_blank';fallback.textContent='Consulta la scansione originale ↗';
  const onError=()=>{status.textContent=isLocal?'WebGL non è disponibile in questa configurazione. Puoi consultare la scheda della scansione.':'Il museo non ha restituito la geometria oppure WebGL non è disponibile. I quattro calchi locali del Kenyon College sono accessibili anche senza rete.';};
  frame.addEventListener('error',onError);
  frame.addEventListener('load',()=>{
    status.textContent='Trascina per ruotare. Per ingrandire usa due dita, la rotella o i comandi qui sotto.';
    controls.querySelectorAll('button').forEach(b=>b.disabled=false);
  });
  host.replaceChildren(frame,status,controls,credits,fallback);
  frame.src=isLocal?asset(entry.mesh):entry.mesh;
}
