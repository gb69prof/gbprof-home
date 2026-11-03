(function () {
"use strict";

const SENSES = {
 vista: {
  name:"Vista", icon:"☀", color:"#55d2ff", glow:"rgba(76,197,255,.21)",
  title:"Dalla luce alla corteccia", stimulus:"Luce", detail:"Luce riflessa da un paesaggio",
  receptor:"Retina · coni e bastoncelli", sourcePoint:[373,166],
  incoming:"M 155 218 Q 265 176 373 166",
  peripheral:"M 373 166 C 387 166 398 153 412 155 C 428 161 426 150 446 152",
  central:"M 446 152 C 467 136 464 111 452 92",
  zoom:[199,114], brain:"Corteccia visiva primaria (V1)", location:"Lobo occipitale",
  steps:[
   ["Stimolo esterno","La luce riflessa dagli oggetti attraversa le strutture ottiche dell’occhio e raggiunge la retina."],
   ["Attivazione del recettore","Coni e bastoncelli trasformano la luce in segnali bioelettrici; le cellule gangliari inviano impulsi nervosi."],
   ["Trasmissione della via ottica","Nervo ottico → chiasma ottico (incrocio parziale) → tratto ottico → corpo genicolato laterale del talamo."],
   ["Elaborazione cerebrale","Dal talamo, le radiazioni ottiche raggiungono V1 nel lobo occipitale. Ulteriori aree analizzano forme, colore e movimento."],
   ["Percezione visiva","L’informazione viene integrata con memoria, aspettative e attenzione: riconosciamo una scena, non semplici impulsi."]
  ],
  nodes:["Retina","Nervo ottico","Chiasma ottico","Corpo genicolato laterale (talamo)","Radiazioni ottiche","V1 occipitale","Aree visive associative"],
  low:"Una luce tenue", mid:"Un’immagine del mondo", high:"Una luce molto intensa",
  lowText:"A intensità ridotta, i dettagli possono diventare difficili da distinguere.",
  midText:"Reti visive distribuite elaborano contorni, colori, movimento e profondità.",
  highText:"Una luminosità eccessiva può provocare abbagliamento: più luce non significa sempre vedere meglio.",
  intensityFact:"La retina codifica la luce con la risposta dei fotorecettori e con l’attività delle cellule gangliari. Adattamento alla luce e contesto cambiano il risultato.",
  scienceFact:"Il segnale percorre nervo ottico, chiasma, talamo e corteccia occipitale. Il cervello non riceve una fotografia già pronta: ricostruisce proprietà della scena attraverso molte reti. Il talamo non è una generica stazione unica, ma qui è coinvolto soprattutto il corpo genicolato laterale.",
  note:"Per la vista la via nervosa resta nella testa: il torace non è attraversato.",
  source:"https://www.ncbi.nlm.nih.gov/books/NBK553189/"
 },
 udito: {
  name:"Udito",icon:"♫",color:"#70c5ff",glow:"rgba(112,197,255,.22)",
  title:"Dalle vibrazioni ai suoni",stimulus:"Onde sonore",detail:"Vibrazioni dell’aria",
  receptor:"Coclea · cellule ciliate",sourcePoint:[480,157],
  incoming:"M 155 218 Q 275 159 480 157",
  peripheral:"M 480 157 C 464 172 459 190 438 215 C 423 208 428 182 437 164",
  central:"M 437 164 C 438 142 456 142 474 122",
  zoom:[141,174],brain:"Corteccia uditiva primaria (A1)",location:"Lobo temporale · giro di Heschl",
  steps:[
   ["Stimolo esterno","Le onde di pressione fanno vibrare timpano e ossicini dell’orecchio medio."],
   ["Attivazione del recettore","Nella coclea, il movimento del liquido piega le stereociglia delle cellule ciliate, che attivano fibre nervose."],
   ["Trasmissione uditiva","Nervo cocleare (VIII) → nuclei cocleari → complesso olivare superiore → collicolo inferiore → corpo genicolato mediale."],
   ["Elaborazione cerebrale","Le vie in gran parte bilaterali raggiungono il lobo temporale. Le reti uditive distinguono frequenze, ritmo e provenienza."],
   ["Percezione uditiva","Il cervello riconosce un suono e ne interpreta il significato alla luce del contesto e dell’esperienza."]
  ],
  nodes:["Cellule ciliate cocleari","Nervo cocleare (VIII)","Nuclei cocleari","Complesso olivare superiore","Collicolo inferiore","Corpo genicolato mediale (talamo)","A1 temporale"],
  low:"Un suono lieve",mid:"Un suono riconoscibile",high:"Un suono forte",
  lowText:"Un suono debole può essere difficile da percepire in presenza di rumore.",
  midText:"I circuiti uditivi analizzano altezza, intensità, ritmo e posizione del suono.",
  highText:"Un volume elevato non migliora necessariamente la comprensione e può danneggiare l’udito.",
  intensityFact:"Il suono più intenso tende a reclutare più fibre e a modificare i tassi di scarica, ma non fa correre più velocemente un singolo impulso. Il volume percepito non cresce in modo lineare.",
  scienceFact:"Le vie uditive sono in larga parte bilaterali già nel tronco encefalico. Il sistema confronta segnali dalle due orecchie per stimare la direzione dei suoni. Il grafico mostra solo un ramo esemplificativo.",
  note:"Per l’udito è rappresentato un ramo: molte vie ascendenti sono bilaterali.",
  source:"https://www.ncbi.nlm.nih.gov/sites/books/NBK532311/"
 },
 olfatto: {
  name:"Olfatto",icon:"❋",color:"#83e1ba",glow:"rgba(131,225,186,.18)",
  title:"Dalle molecole agli odori",stimulus:"Molecole odorose",detail:"Volatili nell’aria inspirata",
  receptor:"Epitelio olfattivo · neuroni",sourcePoint:[404,199],
  incoming:"M 155 260 C 285 255 343 210 404 199",
  peripheral:"M 404 199 C 402 184 392 170 397 155 C 402 143 409 140 421 142",
  central:"M 421 142 C 431 147 436 164 446 169",
  zoom:[102,184],brain:"Corteccia piriforme",location:"Base del telencefalo · reti limbiche",
  steps:[
   ["Stimolo esterno","Molecole volatili entrano nella cavità nasale durante l’inspirazione."],
   ["Attivazione del recettore","I neuroni recettoriali dell’epitelio olfattivo riconoscono combinazioni di molecole odorose."],
   ["Trasmissione olfattiva","Gli assoni attraversano la lamina cribrosa fino al bulbo olfattivo; da qui parte il tratto olfattivo."],
   ["Elaborazione cerebrale","La corteccia piriforme e aree collegate all’amigdala ricevono il segnale senza un relay talamico iniziale obbligatorio."],
   ["Percezione olfattiva","Odori, ricordi e associazioni emotive si intrecciano; la corteccia orbitofrontale contribuisce all’identificazione cosciente."]
  ],
  nodes:["Epitelio olfattivo","Nervo olfattivo (I)","Bulbo olfattivo","Tratto olfattivo","Corteccia piriforme","Amigdala / corteccia entorinale","Reti orbitofrontali"],
  low:"Un odore appena percepibile",mid:"Un odore riconoscibile",high:"Un odore molto intenso",
  lowText:"Con basse concentrazioni alcune molecole non superano la soglia di rilevazione.",
  midText:"Il cervello riconosce configurazioni di odori e le collega ai ricordi.",
  highText:"Un odore forte può risultare invadente; l’adattamento modifica la sensibilità nel tempo.",
  intensityFact:"La concentrazione influisce su quanti recettori vengono attivati e sul loro schema di attività, ma non equivale direttamente all’intensità soggettiva. L’olfatto si adatta spesso rapidamente.",
  scienceFact:"L’olfatto è diverso dagli altri sensi classici: dal bulbo olfattivo raggiunge direttamente aree corticali e limbiche senza un passaggio talamico iniziale obbligatorio. La rete talamica può intervenire in fasi successive.",
  note:"L’olfatto non richiede un passaggio iniziale obbligatorio nel talamo.",
  source:"https://www.ncbi.nlm.nih.gov/books/NBK10982/"
 },
 gusto: {
  name:"Gusto",icon:"◡",color:"#f3c76a",glow:"rgba(243,199,106,.18)",
  title:"Dalle sostanze ai sapori",stimulus:"Sostanze disciolte",detail:"Una piccola goccia di limone",
  receptor:"Gemma gustativa · cellule",sourcePoint:[405,218],
  incoming:"M 155 272 C 282 294 340 236 405 218",
  peripheral:"M 405 218 C 422 228 432 242 438 216 C 440 194 438 174 434 161",
  central:"M 434 161 C 446 148 453 161 466 158",
  zoom:[126,151],brain:"Corteccia gustativa primaria",location:"Insula anteriore / opercolo frontale",
  steps:[
   ["Stimolo esterno","Molecole sciolte nella saliva entrano in contatto con le gemme gustative."],
   ["Attivazione del recettore","Cellule specializzate rispondono a dolce, salato, acido, amaro e umami."],
   ["Trasmissione gustativa","Le informazioni viaggiano nei nervi cranici VII, IX e X fino alla porzione gustativa del nucleo del tratto solitario."],
   ["Elaborazione cerebrale","Dal nucleo del tratto solitario il segnale raggiunge il talamo (VPM) e poi insula e opercolo frontale."],
   ["Percezione gustativa","Il sapore complessivo nasce dall’integrazione del gusto con olfatto retronasale, temperatura e consistenza."]
  ],
  nodes:["Gemme gustative","Nervi VII, IX e X","Nucleo del tratto solitario","Talamo (VPM)","Insula anteriore","Opercolo frontale","Reti orbitofrontali"],
  low:"Sapore appena accennato",mid:"Sapore riconoscibile",high:"Sapore molto intenso",
  lowText:"Una concentrazione tenue può produrre un gusto difficile da riconoscere.",
  midText:"Le cellule gustative e le reti cerebrali concorrono a distinguere le qualità fondamentali.",
  highText:"Una concentrazione elevata può risultare aspra o fastidiosa, senza aggiungere nuove qualità al gusto.",
  intensityFact:"L’intensità dipende da concentrazione, classe di sostanza, recettori attivati e adattamento. Non esistono zone rigidamente separate della lingua dedicate ai singoli gusti.",
  scienceFact:"La corteccia gustativa primaria coinvolge soprattutto insula anteriore e opercolo frontale. Ciò che chiamiamo comunemente sapore dipende molto anche dall’olfatto e da altre sensazioni somatiche.",
  note:"Il gusto è distinto dal sapore completo, che coinvolge anche l’olfatto.",
  source:"https://www.ncbi.nlm.nih.gov/books/NBK11018/"
 },
 tatto: {
  name:"Tatto",icon:"✋",color:"#e9a4f8",glow:"rgba(233,164,248,.19)",
  title:"Dalla pelle alla corteccia",stimulus:"Pressione sul palmo",detail:"Un contatto delicato sulla mano",
  receptor:"Pelle · meccanocettori",sourcePoint:[188,550],
  incoming:"M 155 430 C 188 456 203 506 188 550",
  peripheral:"M 188 550 C 205 520 218 475 239 430 C 260 380 268 328 303 308 C 345 286 373 323 405 318 C 413 276 400 245 407 226 C 412 204 427 193 429 166",
  central:"M 429 166 C 431 145 417 134 413 104",
  zoom:[112,85],brain:"Corteccia somatosensoriale (S1)",location:"Lobo parietale · giro postcentrale",
  steps:[
   ["Stimolo esterno","Una lieve pressione deforma la pelle del palmo e le terminazioni sensoriali."],
   ["Attivazione del recettore","Meccanocettori cutanei, per esempio corpuscoli di Meissner e cellule di Merkel, rispondono alla deformazione."],
   ["Trasmissione somatica","Fibre sensitive → midollo spinale, cordoni posteriori → nucleo cuneato nel bulbo → lemnisco mediale dopo incrocio."],
   ["Elaborazione cerebrale","Dal talamo (VPL), il segnale raggiunge S1 nel giro postcentrale del lobo parietale."],
   ["Percezione tattile","Le reti somatosensoriali ricostruiscono posizione, forza e caratteristiche del contatto."]
  ],
  nodes:["Meccanocettori del palmo","Nervo periferico","Midollo · fascicolo cuneato","Nucleo cuneato (bulbo)","Lemnisco mediale · dopo incrocio","Talamo (VPL)","S1 parietale"],
  low:"Un tocco leggerissimo",mid:"Una pressione distinguibile",high:"Una pressione marcata",
  lowText:"Un contatto molto lieve può sfuggire alla percezione.",
  midText:"Le reti somatosensoriali localizzano il punto di contatto e valutano la sua intensità.",
  highText:"Una pressione più marcata attiva diversamente i recettori; dolore e temperatura seguono anche altre vie.",
  intensityFact:"Il sistema tattile usa più popolazioni di recettori e fibre. Frequenza di scarica e numero di unità attivate contribuiscono alla codifica della forza. Qui è mostrato il tatto fine, non la via del dolore.",
  scienceFact:"Per il tatto fine della mano il fascicolo cuneato sale nel midollo e sinapta nel bulbo; le fibre incrociano e proseguono verso VPL e S1. La via del dolore e della temperatura è diversa e non viene simulata.",
  note:"Il percorso tattile rappresenta il tatto fine della mano, non dolore e temperatura.",
  source:"https://www.ncbi.nlm.nih.gov/books/NBK507888/"
 }
};

const $ = id => document.getElementById(id);
const scene = $("scene");
const p1 = $("pathPeripheral"), p2 = $("pathCentral");
const base1 = $("pathPeripheralBase"), base2 = $("pathCentralBase");
const focus = $("brainHighlight");
const focusGlow = $("brainHighlightGlow");
const focusPoint = $("brainHighlightPoint");
const receptor = $("receptorCore"), receptorHalo = $("receptorHalo");
const pulse = $("pulse"), pulseHalo = $("pulseHalo");
const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const state = {sense:"vista",intensity:65,progress:0,playing:false,mode:"all",highlight:true,speed:1,tab:"route"};
let lastTime = 0;
let pathLength1 = 0, pathLength2 = 0;
let audioContext = null;

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function levelName() {
 if (state.intensity === 0) return "Assente";
 if (state.intensity < 34) return "Bassa";
 if (state.intensity < 74) return "Media";
 return "Elevata";
}
function current() { return SENSES[state.sense]; }
function setText(id, value) { $(id).textContent = value; }

function buildSteps() {
 const d = current();
 const wrap = $("steps");
 wrap.replaceChildren();
 d.steps.forEach(function (item, index) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "step";
  btn.setAttribute("aria-label", "Fase " + (index + 1) + ": " + item[0] + ". " + item[1]);
  const num = document.createElement("span");
  num.className = "step-num";
  num.textContent = String(index + 1);
  const body = document.createElement("span");
  const title = document.createElement("strong");
  title.className = "step-title";
  title.textContent = item[0];
  const text = document.createElement("span");
  text.className = "step-info";
  text.textContent = item[1];
  body.append(title,text); btn.append(num,body);
  btn.addEventListener("click",function () {
   state.progress = [.09,.28,.48,.72,.97][index];
   state.playing = false;
   render();
  });
  wrap.append(btn);
 });
}

function updateToneButton() {
 const old = $("listenDemo");
 if (old) old.remove();
 if (state.sense !== "udito") return;
 const button = document.createElement("button");
 button.id = "listenDemo";
 button.type = "button";
 button.textContent = "♫ Ascolta un suono dimostrativo";
 button.style.cssText = "margin:2px 0 13px;padding:8px 10px;border:1px solid #649fc3;border-radius:7px;background:#134362;color:#dbf7ff;font-weight:750;font-size:11px";
 button.addEventListener("click", function () {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context || state.intensity === 0) return;
  try {
   if (!audioContext) audioContext = new Context();
   audioContext.resume();
   const osc = audioContext.createOscillator();
   const gain = audioContext.createGain();
   osc.type = "sine";
   osc.frequency.value = 440;
   const t = audioContext.currentTime;
   const volume = Math.min(.045, state.intensity / 100 * .045);
   gain.gain.setValueAtTime(0,t);
   gain.gain.linearRampToValueAtTime(Math.max(.001,volume),t+.04);
   gain.gain.exponentialRampToValueAtTime(.001,t+.52);
   osc.connect(gain); gain.connect(audioContext.destination);
   osc.start(t); osc.stop(t+.54);
  } catch (_error) {
   button.textContent = "Audio non disponibile su questo browser";
  }
 });
 $("perceptionText").after(button);
}

function setSense(id) {
 if (!SENSES[id]) return;
 state.sense = id;
 state.progress = 0;
 state.playing = !reducedMotion;
 const d = current();
 document.documentElement.style.setProperty("--accent",d.color);
 document.documentElement.style.setProperty("--glow",d.glow);
 scene.dataset.sense = id;
 document.querySelectorAll("[data-sense]").forEach(btn=>{
  const chosen = btn.dataset.sense === id;
  btn.classList.toggle("active",chosen);
  btn.setAttribute("aria-pressed",String(chosen));
 });
 setText("sceneTitle", d.name);
 const sub = document.createElement("span");
 sub.textContent = " · " + d.title;
 $("sceneTitle").append(sub);
 setText("processTitle","Il processo " + ({vista:"della vista",udito:"dell’udito",olfatto:"dell’olfatto",gusto:"del gusto",tatto:"del tatto"}[id]));
 setText("stimulusName",d.stimulus);
 setText("stimulusDetail",d.detail);
 setText("stimulusGlyph",d.icon);
 $("stimulusArt").className = "stimulus-art " + id;
 setText("receptorLabel",d.receptor);
 setText("brainAreaLabel",d.brain);
 setText("brainSideNote",d.location);
 setText("perceptionGlyph",d.icon);
 $("perceptionVisual").className = "perception-visual " + id;
 $("incomingSignal").setAttribute("d",d.incoming);
 [p1,base1].forEach(el=>el.setAttribute("d",d.peripheral));
 [p2,base2].forEach(el=>el.setAttribute("d",d.central));
 pathLength1 = p1.getTotalLength();
 pathLength2 = p2.getTotalLength();
 [receptor,receptorHalo].forEach(el=>{
  el.setAttribute("cx",d.sourcePoint[0]);
  el.setAttribute("cy",d.sourcePoint[1]);
 });
 [focus,focusGlow,focusPoint].forEach(el=>{
  el.setAttribute("cx",d.zoom[0]);
  el.setAttribute("cy",d.zoom[1]);
 });
 buildSteps();
 updatePerception();
 renderTab();
 updateToneButton();
 render();
}

function updatePerception() {
 const d = current();
 const v = state.intensity;
 const level = levelName();
 const heading = v === 0 ? "Stimolo assente" : v < 34 ? d.low : v < 74 ? d.mid : d.high;
 const body = v === 0 ?
  "Senza lo stimolo scelto non viene generata, in questo modello, una risposta sensoriale a tale evento." :
  v < 34 ? d.lowText : v < 74 ? d.midText : d.highText;
 setText("perceptionHeading",heading);
 setText("perceptionText",body);
 setText("perceptionLevel",level);
 setText("intensityValue",v + "%");
 $("intensity").style.setProperty("--range-pct",v+"%");
 $("stimulusArt").style.filter = "brightness(" + (.55+v*.008) + ") saturate(" + (.55+v*.009) + ")";
 const width = (2.2 + v*.032).toFixed(2);
 p1.style.strokeWidth = width;
 p2.style.strokeWidth = width;
 receptorHalo.style.opacity = v===0 ? ".12" : String(.3+v*.007);
 renderTab();
}

function setPathReveal(path, length, fraction) {
 if (!length) return;
 path.style.strokeDasharray = length + " " + length;
 path.style.strokeDashoffset = String(length * (1 - clamp(fraction,0,1)));
}

function render() {
 const p = state.progress;
 const phase = Math.min(4,Math.floor(p*5));
 const periphProgress = clamp((p-.17)/.43,0,1);
 const centralProgress = clamp((p-.59)/.29,0,1);
 const showPeriph = state.mode!=="central";
 const showCentral = state.mode!=="peripheral";
 setPathReveal(p1,pathLength1,periphProgress);
 setPathReveal(p2,pathLength2,centralProgress);
 p1.style.opacity = showPeriph ? (state.intensity===0 ? ".07" : "1") : ".04";
 p2.style.opacity = showCentral ? (state.intensity===0 ? ".07" : "1") : ".04";
 base1.style.opacity = showPeriph ? ".5" : ".06";
 base2.style.opacity = showCentral ? ".5" : ".06";

 const d = current();
 let pt = {x:d.sourcePoint[0],y:d.sourcePoint[1]};
 let visiblePulse = p>.16 && p<.9 && state.intensity>0;
 if(p>.17 && p<.6 && pathLength1) pt=p1.getPointAtLength(clamp(periphProgress,0,1)*pathLength1);
 if(p>=.6 && pathLength2) pt=p2.getPointAtLength(clamp(centralProgress,0,1)*pathLength2);
 if (state.mode==="peripheral" && p>=.6) visiblePulse=false;
 if (state.mode==="central" && p<.6) visiblePulse=false;
 [pulse,pulseHalo].forEach(el=>{
  el.setAttribute("cx",pt.x); el.setAttribute("cy",pt.y);
  el.classList.toggle("is-hidden",!visiblePulse);
 });
 const areaOpacity = state.highlight && state.intensity>0 && p>.60 && showCentral;
 focus.style.opacity = areaOpacity ? String(.28+state.intensity*.007) : ".09";
 focusGlow.style.opacity = areaOpacity ? String(.17+state.intensity*.005) : "0";
 focusPoint.style.opacity = areaOpacity ? "1" : ".35";

 const activeStep = p===0 ? -1 : phase;
 [...$("steps").children].forEach((btn,i)=>{
  const active = i===activeStep;
  btn.classList.toggle("active",active);
  btn.setAttribute("aria-current",active ? "step" : "false");
 });
 $("progressFill").style.width = (p*100).toFixed(1)+"%";
 setText("signalPercent",Math.round(p*100)+"%");
 setText("signalStatus", state.intensity===0 ? "Stimolo assente · nessuna risposta" :
   p===0 ? "Premi ▶ per iniziare" : p>=1 ? "Percorso completato · reti integrate" :
   d.steps[activeStep][0]);
 setText("statusBadge",state.playing?"IN CORSO":p>=1?"COMPLETATO":p===0?"PRONTA":"IN PAUSA");
 $("playBtn").textContent=state.playing?"Ⅱ":"▶";
 $("playBtn").setAttribute("aria-label",state.playing?"Metti in pausa la simulazione":"Avvia la simulazione");
 setText("scienceNote",d.note);
}

function routeChips(nodes) {
 const row = document.createElement("div");
 row.className="route-chips";
 nodes.forEach((s,i)=>{
  const chip=document.createElement("span");
  chip.textContent=(i? "→ " : "") + s;
  row.appendChild(chip);
 });
 return row;
}
function renderTab() {
 const d = current();
 const body=$("tab-panel");
 body.replaceChildren();
 let h=document.createElement("h3");
 let p=document.createElement("p");
 if(state.tab==="route") {
  h.textContent="Il percorso: "+d.name.toLowerCase();
  body.append(h,routeChips(d.nodes));
  p.textContent="Percorso principale rappresentato in forma schematica. Alcune vie hanno diramazioni, incroci e circuiti di ritorno non disegnati. La posizione dei nodi non è una misura anatomica.";
  body.append(p);
 } else if(state.tab==="intensity") {
  h.textContent="Più stimolo non significa impulsi più veloci";
  p.textContent=d.intensityFact + " L’intensità è una scala qualitativa di laboratorio (0–100%), non una misura fisiologica. Le frequenze di scarica e il numero di neuroni attivi possono cambiare, non la velocità di un singolo potenziale d’azione.";
  body.append(h,p);
 } else {
  h.textContent="Dal segnale alla percezione: nessun centro agisce da solo";
  p.textContent=d.scienceFact+" Questa animazione mostra una via didattica, non registra un cervello reale e non pretende di riprodurre l’esperienza soggettiva.";
  body.append(h,p);
 }
 const sources=document.createElement("div");
 sources.className="science-sources";
 const a=document.createElement("a");
 a.href=d.source;a.target="_blank";a.rel="noopener noreferrer";
 a.textContent="Approfondimento scientifico: NCBI Bookshelf ↗";
 sources.appendChild(a);
 body.appendChild(sources);
 document.querySelectorAll(".tab").forEach(tab=>{
  const active=tab.dataset.tab===state.tab;
  tab.classList.toggle("active",active);
  tab.setAttribute("aria-selected",String(active));
  tab.tabIndex=active?0:-1;
 });
 $("tab-panel").setAttribute("aria-labelledby","tab-"+state.tab);
}

function animate(t) {
 const dt=Math.min(70,t-(lastTime||t));
 lastTime=t;
 if(state.playing) {
  state.progress=clamp(state.progress+(dt*state.speed)/11400,0,1);
  if(state.progress>=1) state.playing=false;
  render();
 }
 if(state.intensity>0 && !reducedMotion) {
  const shimmer=.26+(.74*Math.abs(Math.sin(t/(520-2.8*state.intensity))));
  pulseHalo.style.opacity=String(shimmer);
 }
 requestAnimationFrame(animate);
}

document.querySelectorAll("[data-sense]").forEach(btn=>btn.addEventListener("click",()=>setSense(btn.dataset.sense)));
$("intensity").addEventListener("input",e=>{
 state.intensity=Number(e.target.value);
 updatePerception();
 render();
});
document.querySelectorAll("input[name=route]").forEach(el=>el.addEventListener("change",e=>{
 if(e.target.checked){state.mode=e.target.value;render();}
}));
$("highlightToggle").addEventListener("change",e=>{
 state.highlight=e.target.checked;render();
});
$("speed").addEventListener("change",e=>{
 state.speed=Number(e.target.value);
});
function togglePlay() {
 if(state.progress>=1)state.progress=0;
 state.playing=!state.playing;
 render();
}
function reset() { state.playing=false;state.progress=0;render(); }
$("playBtn").addEventListener("click",togglePlay);
$("resetBtn").addEventListener("click",reset);
$("replayBtn").addEventListener("click",()=>{state.progress=0;state.playing=true;render();});
$("fullscreenBtn").addEventListener("click",()=>{
 try {
  if(document.fullscreenElement && document.exitFullscreen)document.exitFullscreen();
  else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();
 }catch(_error){/* Fullscreen opzionale */ }
});
document.querySelectorAll(".tab").forEach(btn=>{
 btn.addEventListener("click",()=>{state.tab=btn.dataset.tab;renderTab();});
 btn.addEventListener("keydown",e=>{
  if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
  const tabs=[...document.querySelectorAll(".tab")];
  const next=(tabs.indexOf(btn)+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length;
  e.preventDefault();tabs[next].focus();tabs[next].click();
 });
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden&&state.playing){state.playing=false;render();}
});
document.addEventListener("keydown",e=>{
 if(e.code==="Space"&&e.target===document.body){e.preventDefault();togglePlay();}
});
setSense("vista");
state.playing=false;
render();
requestAnimationFrame(animate);
})();