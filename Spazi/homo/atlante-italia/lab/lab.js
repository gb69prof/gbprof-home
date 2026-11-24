import {anatomy} from './anatomy.js';
import {methods} from './methods.js';
const local = path => new URL(path,import.meta.url).href;
// Coordinate relative alla figura pubblicata, in percentuale della sua area visibile.
const targets = {
  'Circeo 1':[50,61,18,33,'Apertura nasale'],
  'Isernia IS42':[79,26,35,44,'Superficie labiale'],
  'Fontana Ranuccio FR1R e FR2':[39,80,28,40,'Molare inferiore destro FR1R'],
  'Visogliano Vis. 1–6':[17,14,30,24,'Premolare superiore Vis. 1'],
  'Notarchirico Vn-H1':[34,52,8,62,'Diafisi in vista posteriore'],
  'Dama del Caviglione':[25,50,6,92,'Colonna del Caviglione'],
  'La Ferrassie 1 · mano':[54,50,6,92,'Colonna di La Ferrassie 1']
};
const escapeHTML = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const resources = ()=>Promise.all(['sources','media','models'].map(async name=>{
  const response=await fetch(local(name+'.json'));
  if(!response.ok) throw Error('archivio del laboratorio');
  return response.json();
}));
let cached;
export function renderLab(container,section){
  const root=document.createElement('div');
  root.className='homo-lab';root.innerHTML='<p role="status">Apertura delle collezioni…</p>';
  container.replaceChildren(root);
  cached??=resources().catch(e=>{cached=null;throw e;});
  return cached.then(([sources,media,models])=>{
    const refs=Object.fromEntries(sources.map(r=>[r.id.slice(4),r]));
    const images=Object.fromEntries(media.map(r=>[r.file.split('/').pop().replace('.webp',''),r]));
    const cite=(...keys)=>keys.map(key=>refs[key]).filter(Boolean).map(r=>`<a class="hl-cite" href="${escapeHTML(r.url)}" target="_blank" rel="noopener">${escapeHTML(r.authors.split(',')[0])}${r.year?' · '+r.year:' · collezione'} ↗</a>`).join(' ');
    const photo=(id,label,target)=>{
      const p=images[id];if(!p)return '';
      return `<figure class="hl-figure"><a href="${local(p.file)}" target="_blank" rel="noopener" aria-label="Ingrandisci la figura. ${escapeHTML(p.title)}"><span class="hl-plate"><img src="${local(p.file)}" alt="${escapeHTML(p.title)}" loading="lazy">${target?`<i class="hl-target" hidden style="left:${target[0]}%;top:${target[1]}%;width:${target[2]}%;height:${target[3]}%" aria-hidden="true"></i>`:''}</span></a><figcaption>${escapeHTML(label||p.title)} <span>${escapeHTML(p.category)} · ${escapeHTML(p.author)} · <a href="${escapeHTML(p.url)}" target="_blank" rel="noopener">Fonte</a> · <a href="${escapeHTML(p.licenseUrl||p.url)}" target="_blank" rel="noopener">${escapeHTML(p.license)}</a></span></figcaption></figure>`;
    };
    if(section==='anatomia') renderAnatomy(root,cite,photo,refs,models);
    else if(section==='genetica') renderGenetics(root,cite,photo);
    else renderMethods(root,cite,photo);
  }).catch(()=>{root.innerHTML='<p role="status">I dati del laboratorio non sono disponibili. Riapri questa sezione quando la connessione è attiva.</p>';});
}
function renderAnatomy(root,cite,photo,refs,models){
  root.innerHTML=`<header class="hl-intro"><p class="hl-eyebrow">Anatomia comparata</p><h2>Due reperti, uno sguardo ravvicinato</h2><p>Scegli una regione anatomica e due esemplari. Le figure conservano le barre di scala originali. Quattro scansioni del Kenyon College si possono ruotare anche senza rete. La collezione comprende inoltre modelli Smithsonian e punti anatomici del molare del Poggio. Le misure dei femori si confrontano in millimetri.</p></header><label class="hl-field">Regione anatomica<select data-organ>${Object.keys(anatomy).map(k=>`<option>${k}</option>`).join('')}</select></label><button type="button" class="hl-action" data-pair3d>Confronta due crani in 3D</button><div class="hl-pair"></div><div data-measures></div>`;
  const organ=root.querySelector('[data-organ]'),pair=root.querySelector('.hl-pair'),metric=root.querySelector('[data-measures]');
  let choices=[];
  function comparison(){
    const data=anatomy[organ.value],a=data[choices[0]],b=data[choices[1]];
    metric.replaceChildren();if(!a?.metrics||!b?.metrics)return;
    metric.innerHTML=`<section class="hl-panel"><h3>Dimensioni della diafisi a metà lunghezza</h3><p>Ogni coppia di barre usa la stessa scala in millimetri. I dati sono trascritti dalla tabella 2 di Micarelli e colleghi.</p><div class="hl-measures">${['Diametro antero-posteriore','Diametro medio-laterale','Circonferenza'].map((k,i)=>`<h4>${k}</h4>${[a,b].map((r,j)=>`<div class="hl-barline"><span>${escapeHTML(r.name)}</span><div><i class="hl-bar-${j}" style="width:${100*r.metrics[i]/(i===2?110:40)}%"></i></div><strong>${r.metrics[i].toLocaleString('it-IT')} mm</strong></div>`).join('')}`).join('')}</div>${cite('micarelli')}</section>`;
  }
  function display(slot){
    const data=anatomy[organ.value], specimen=data[choices[slot]],panel=pair.children[slot];
    const live=panel.querySelector('.hl-specimen');
    const target=targets[specimen.image==='mano'&&specimen.name==='La Ferrassie 1'?'La Ferrassie 1 · mano':specimen.name];
    live.innerHTML=`<p class="hl-eyebrow">${escapeHTML(specimen.group)}</p><h3>${escapeHTML(specimen.name)}</h3>${specimen.image?photo(specimen.image,null,target):''}${target?`<label class="hl-check"><input type="checkbox" data-highlight> Evidenzia · ${escapeHTML(target[4])}</label>`:''}${specimen.points?'<div class="hl-model" data-points></div>':''}${specimen.model?`<div class="hl-model"><button type="button" class="hl-action" data-load>Apri il modello 3D</button><span>${specimen.model.startsWith('kenyon-')?'Calco digitalizzato · Kenyon College, disponibile offline':'Calco digitalizzato · collegamento allo Smithsonian'}</span></div>`:''}<p>${escapeHTML(specimen.text)}</p><details><summary>Cosa osservare</summary><p>${escapeHTML(specimen.focus)}</p></details>${cite(specimen.ref)}${specimen.model==='kenyon-kabwe'?'<p><a href="https://www.si.edu/object/3d/homo-heidelbergensis-cranium:875362ca-8f60-4c40-b170-462392480281" target="_blank" rel="noopener">Confronta anche il calco Smithsonian di Kabwe ↗</a></p>':''}`;
    if(specimen.points){
      const host=live.querySelector('[data-points]');
      import('./points.js').then(m=>m.mountPoints(host,specimen.points)).catch(()=>{host.textContent='Il dataset morfometrico non è disponibile.';});
    }
    if(target){const toggle=live.querySelector('[data-highlight]');toggle.onchange=()=>{live.querySelector('.hl-target').hidden=!toggle.checked;};}
    if(specimen.model) live.querySelector('[data-load]').onclick=async()=>{
      const host=live.querySelector('.hl-model');
      live.querySelector('h3').after(host);
      const entry=models.find(m=>m.id==='model-'+specimen.model);
      host.innerHTML='<p role="status">Apertura del modello tridimensionale…</p>';
      try {
        const {mountModel}=await import('./viewer.js');
        await mountModel(host,entry);
      } catch {
        host.innerHTML='<p role="status">Il visore locale non è disponibile.</p>';
        const fallback=document.createElement('a');fallback.href=refs[specimen.ref].url;fallback.target='_blank';fallback.rel='noopener';fallback.textContent='Consulta la fonte del modello ↗';host.append(fallback);
      }
    };
  }
  function build(){
    const data=anatomy[organ.value];choices=[0,1];
    pair.innerHTML=['Primo reperto','Secondo reperto'].map((label,i)=>`<article class="hl-panel"><label class="hl-field">${label}<select data-side="${i}">${data.map((s,n)=>`<option value="${n}" ${i===n?'selected':''}>${escapeHTML(s.name)}</option>`).join('')}</select></label><div class="hl-specimen"></div></article>`).join('');
    pair.querySelectorAll('select').forEach((s,i)=>{s.onchange=()=>{choices[i]=+s.value;display(i);comparison();};display(i);});comparison();
  }
  organ.onchange=build;build();
  root.querySelector('[data-pair3d]').onclick=()=>{
    organ.value='Crani';build();
    ['kenyon-circeo-1','kenyon-predmosti'].forEach((key,i)=>{
      const index=anatomy.Crani.findIndex(s=>s.model===key);choices[i]=index;
      pair.querySelector('[data-side="'+i+'"]').value=index;display(i);pair.children[i].querySelector('[data-load]').click();
    });
    pair.scrollIntoView?.({block:'start'});
  };
}
function renderGenetics(root,cite,photo){
  root.innerHTML=`<header class="hl-intro"><p class="hl-eyebrow">Genetica e migrazioni</p><h2>Le parentele lasciano tracce differenti</h2><p>Un frammento della scapola di Altamura e una mandibola di Riparo Tagliente raccontano due storie diverse. Il primo conserva un segnale della linea materna. Nella seconda, il DNA nucleare permette il confronto fra popolazioni attraverso migliaia di varianti.</p></header>
  <section class="hl-panel"><h3>Ramificazioni e scambi</h3><p>Schema delle relazioni principali fra popolazioni. Il tempo procede da sinistra a destra; le distanze nel disegno sono convenzionali.</p>
  <label class="hl-check"><input type="checkbox" checked data-flows> Mostra i rapporti documentati fra rami</label>
  <svg class="hl-tree" viewBox="0 0 680 285" role="img" aria-labelledby="hl-tree-title hl-tree-desc"><title id="hl-tree-title">Rami sapiens, Neanderthal e Denisova</title><desc id="hl-tree-desc">Una popolazione ancestrale si ramifica nella linea sapiens e nella linea che conduce a Neanderthal e Denisoviani. Il fondo genetico di parte dei sapiens include contributi neandertaliani. A Denisova un individuo aveva madre neandertaliana e padre denisoviano.</desc><g fill="none" stroke="#314e58" stroke-width="6"><path d="M30 145 H111 Q133 145 153 109 L186 52 H510"/><path d="M111 145 Q139 145 161 176 L183 205 H252 Q274 205 294 180 L343 139 H510"/><path d="M250 205 Q282 205 305 225 L338 245 H510"/></g><g fill="#314e58"><circle cx="111" cy="145" r="8"/><circle cx="250" cy="205" r="8"/></g><g class="hl-flows" fill="none" stroke="#a65932" stroke-width="4" stroke-dasharray="8 5"><path d="M365 139 Q380 103 417 53"/><path d="M440 139 Q468 157 477 191 M440 245 Q466 234 477 191"/></g><circle class="hl-flows" cx="477" cy="191" r="7" fill="#a65932"/><g fill="#162e38" font-family="system-ui,sans-serif" font-size="20"><text x="522" y="59">Sapiens</text><text x="522" y="146">Neanderthal</text><text x="522" y="252">Denisoviani</text></g></svg>
  <p data-network aria-live="polite"></p>${cite('vindija','slon')}</section>
  <div class="hl-pair"><article class="hl-panel"><h3>DNA mitocondriale</h3><p>I mitocondri trasmettono di norma il proprio DNA per linea materna. La sequenza ricavata dalla scapola di Altamura avvicina questo individuo ai Neanderthal. Un solo ramo materno rappresenta una piccola parte della sua genealogia.</p>${cite('lari')}</article><article class="hl-panel"><h3>DNA nucleare</h3><p>Il genoma nucleare conserva eredità da molti antenati. In Siberia i tratti ereditati dai genitori in Denisova 11 hanno permesso di identificare direttamente una madre neandertaliana e un padre denisoviano. È un caso documentato in Asia.</p>${cite('slon')}</article></div>
  <section class="hl-panel"><h3>Leggi le carte paleogenomiche</h3><label class="hl-field">Campione e periodo<select data-genmap><option value="0">Europa gravettiana · prima del massimo glaciale</option><option value="1">Europa meridionale · Epigravettiano</option></select></label><div data-map></div></section>
  <section class="hl-panel"><h3>Due fossili, centinaia di chilometri</h3><p>La mandibola di Riparo Tagliente è datata a 16.980–16.510 anni cal BP. A Monopoli, Le Mura 1 risale a 17.320–16.910 cal BP. Entrambi mostrano affinità con la componente chiamata «Villabruna», dal nome di un individuo vissuto più tardi. Il nome identifica una parentela statistica. Le date vicine e la distanza fra i siti documentano la diffusione di quella componente, lasciando aperto il percorso preciso di chi la portò lungo la penisola.</p>${cite('tagliente','mura','posth')}</section>
  <section class="hl-panel"><h3>Sapiens e Neanderthal si incontrarono in Italia?</h3><p>Nel 2011 la riattribuzione dei denti uluzziani del Cavallo a sapiens ha spostato indietro la presenza della nostra specie nell’Italia meridionale. A Roccia San Sebastiano un molare neandertaliano e uno sapiens provengono da livelli successivi. Si documenta un avvicendamento locale.</p><p>Nel 2024 un modello che comprende 105 nuove datazioni su quattro siti meridionali ha sostenuto una discontinuità regionale fra gli ultimi contesti musteriani e i primi uluzziani. L’introgressione genetica in Eurasia è documentata. Per localizzare uno specifico incontro nella penisola servirebbero ulteriori prove dirette.</p>${cite('cavallo','oxilia','higham','vindija')}</section>`;
  const control=root.querySelector('[data-flows]'),network=root.querySelector('[data-network]');
  const redraw=()=>{root.querySelectorAll('.hl-flows').forEach(g=>g.style.display=control.checked?'':'none');network.textContent=control.checked?'I tratti ocra indicano il contributo neandertaliano ad antenati di parte dei sapiens e, più in basso, l’incontro di due linee parentali documentato nell’individuo Denisova 11.':'I rami continui rappresentano divergenze di popolazioni. Il punto di biforcazione sintetizza una storia demografica distribuita nel tempo.';};
  control.onchange=redraw;redraw();
  const select=root.querySelector('[data-genmap]');const show=()=>{const second=select.value==='1';root.querySelector('[data-map]').innerHTML=photo(second?'genetica-epigravettiano':'genetica-gravettiano')+`<p>${second?'Le distanze genetiche fra i campioni epigravettiani cambiano tra nord e sud. I nodi dell’albero indicano relazioni stimate; la loro posizione grafica non localizza una biforcazione sul territorio.':'Nel Gravettiano l’analoga cultura materiale attraversava regioni con profili genetici differenti. La geografia dei campioni consente di distinguere l’estensione di una tradizione dalle parentele fra le persone che la praticarono.'}</p>`+cite('posth');};
  select.onchange=show;show();
}
function renderMethods(root,cite,photo){
  root.innerHTML=`<header class="hl-intro"><p class="hl-eyebrow">Il mestiere del paleoantropologo</p><h2>Come si passa da un frammento a una conclusione?</h2><p>Un frammento ha una posizione, una forma e una storia dopo la deposizione. Le analisi rispondono a domande diverse. Segui un caso italiano, poi prova a variare il parametro di un esperimento.</p></header>
  <section class="hl-panel"><h3>Dal terreno all’interpretazione</h3><label class="hl-field">Fase di lavoro<select data-tech>${methods.map(([title],i)=>`<option value="${i}">${escapeHTML(title)}</option>`).join('')}</select></label><div data-tech-text aria-live="polite"></div></section>
  <section class="hl-panel"><h3>Esperimento 1 · Un confine nella tomografia</h3><p>Questa fila didattica di voxel contiene valori simulati d’intensità. Sposta la soglia e osserva quali voxel il calcolo include nella superficie. Un confine delineato dall’operatore può spostarsi anche con un piccolo cambiamento della soglia.</p><label class="hl-field">Soglia di intensità, unità convenzionali <input data-ct type="range" min="0" max="100" value="56" step="1"></label><div class="hl-voxels" data-vox></div><output data-ct-result aria-live="polite"></output>${cite('divincenzo','zanolli')}</section>
  <section class="hl-panel"><h3>Esperimento 2 · Il decadimento del carbonio-14</h3><p>Parti da 100 parti di radiocarbonio e fai scorrere il tempo in unità di emivita fisica (circa 5.730 anni). L’esercizio modella un sistema chiuso. Per datare un reperto servono misurazione, incertezza, controllo della contaminazione e curva di calibrazione.</p><label class="hl-field">Numero di emivite<input data-half type="range" min="0" max="8" step="0.25" value="1"></label><div class="hl-decay"><i></i></div><output data-half-result aria-live="polite"></output>${cite('intcal')}</section>
  <section class="hl-panel"><h3>Esperimento 3 · Quale campione risponde alla domanda?</h3><p>Alla Pineta l’età del dente è ricavata dal contesto. Scegli il materiale che documenta gli eventi eruttivi utilizzati per ordinare la successione.</p><div class="hl-answers">${['Collagene del dente','Cristalli vulcanici nei sedimenti','Smalto per confronto di forma'].map((v,i)=>`<button type="button" data-sample="${i}">${v}</button>`).join('')}</div><p data-feedback aria-live="polite"></p>${cite('peretto')}</section>`;
  const sel=root.querySelector('[data-tech]'),tech=root.querySelector('[data-tech-text]');
  const showTech=()=>{const i=+sel.value,[,title,text,...refs]=methods[i];const pic=({0:'isernia-dente',1:'isernia-strati',2:'notarchirico',4:'ceprano',5:'fontana',6:'altamura-forma',10:'isernia-strati'})[i];tech.innerHTML=`<h4>${escapeHTML(title)}</h4><p>${escapeHTML(text)}</p>${cite(...refs)}${pic?photo(pic):''}`;};
  sel.onchange=showTech;showTech();
  const intensities=[12,17,26,35,48,54,56,62,78,91,93,74,63,53,41,25,11,9];
  const ct=root.querySelector('[data-ct]');const ctDraw=()=>{const threshold=+ct.value,n=intensities.filter(i=>i>=threshold).length;root.querySelector('[data-vox]').innerHTML=intensities.map(i=>`<span class="${i>=threshold?'included':''}" title="Intensità ${i}">${i}</span>`).join('');root.querySelector('[data-ct-result]').textContent=`Soglia ${threshold} · ${n} voxel inclusi su ${intensities.length}.`;};
  ct.oninput=ctDraw;ctDraw();
  const half=root.querySelector('[data-half]');const decay=()=>{const f=+half.value,remaining=100*2**-f;root.querySelector('.hl-decay i').style.width=remaining+'%';root.querySelector('[data-half-result]').textContent=`${f.toLocaleString('it-IT')} emivite · circa ${Math.round(5730*f).toLocaleString('it-IT')} anni fisici · radiocarbonio residuo ${remaining.toLocaleString('it-IT',{maximumFractionDigits:2})}%.`;};
  half.oninput=decay;decay();
  const feedback=['La finestra del radiocarbonio è molto più breve dell’età del deposito. Il collagene non registra la data di un’eruzione.','Esatto. Gli autori misurano il rapporto fra isotopi dell’argon in cristalli vulcanici. Per collegare eruzione e dente ricostruiscono poi la successione degli strati.','Lo smalto è utile per studiare la morfologia dentale. Il confronto di forma, da solo, non misura l’età dell’eruzione.'];
  root.querySelectorAll('[data-sample]').forEach((b,i)=>b.onclick=()=>{root.querySelector('[data-feedback]').textContent=feedback[i];});
}
