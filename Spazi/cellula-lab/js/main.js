import { ORG, SPECIMENS, QUESTIONS } from "./data.js";
import { CellScene } from "./scene.js";

const $=id=>document.getElementById(id);
const STORE="gbprof-cellula-lab-progress-v1";
function readProgress(){try{const p=JSON.parse(localStorage.getItem(STORE)||"{}");return {animal:new Set(Array.isArray(p.animal)?p.animal:[]),plant:new Set(Array.isArray(p.plant)?p.plant:[]),best:Number(p.best)||0};}catch{return {animal:new Set(),plant:new Set(),best:0};}}
const progress=readProgress();
function saveProgress(){try{localStorage.setItem(STORE,JSON.stringify({animal:[...progress.animal],plant:[...progress.plant],best:progress.best}));}catch{}}
const state={type:"animal",mode:"explore",selected:"nucleus",prediction:null,observing:false,direction:"equal",quiz:{index:0,score:0,answered:false}};
let scene=null;

function selectOrg(id){
  if(!SPECIMENS[state.type].list.includes(id)||state.mode!=="explore")return;
  state.selected=id;const d=ORG[id];
  $("org-code").textContent=d.code;$("org-category").textContent=d.category;$("org-name").textContent=d.name;$("org-description").textContent=d.description;$("org-fact").textContent=d.fact;
  $("org-location").textContent=d.location;$("org-observe").textContent=d.observe;$("org-symbol").textContent=d.symbol;$("org-symbol").style.color=d.color;$("org-symbol").style.textShadow="0 0 38px "+d.color+"9c";
  if(SPECIMENS[state.type].mission.includes(id)){progress[state.type].add(id);saveProgress();}
  if(scene)scene.select(id);
  renderList();renderMission();
}
function renderList(){
  const host=$("organelle-list");host.replaceChildren();
  for(const id of SPECIMENS[state.type].list){const d=ORG[id],mission=SPECIMENS[state.type].mission.includes(id),found=progress[state.type].has(id);
    const button=document.createElement("button");button.type="button";button.className="org-btn"+(state.selected===id?" active":"");button.style.setProperty("--org-color",d.color);button.setAttribute("aria-pressed",String(state.selected===id));
    const dot=document.createElement("span");dot.className="org-dot";dot.setAttribute("aria-hidden","true");
    const name=document.createElement("span");name.textContent=d.name;
    const flag=document.createElement("span");flag.className=mission&&found?"org-found":"org-target";flag.textContent=mission?(found?"✓":"☆"):"→";flag.setAttribute("aria-label",mission?(found?"Struttura riconosciuta":"Obiettivo della missione"):"");
    button.append(dot,name,flag);button.addEventListener("click",()=>{if(state.mode!=="explore")goTo("explore");selectOrg(id);});
    host.append(button);
  }
}
function renderMission(){
  const targets=SPECIMENS[state.type].mission,found=targets.filter(id=>progress[state.type].has(id));
  $("found-count").textContent=found.length+" / "+targets.length;$("mission-count").textContent=found.length+" / "+targets.length;
  $("mission-bar").style.width=(found.length/targets.length*100)+"%";$("mission-success").hidden=found.length!==targets.length;
  const host=$("mission-items");host.replaceChildren();
  for(const id of targets){const done=progress[state.type].has(id);const elem=document.createElement("div");elem.className="mission-item"+(done?" found":"");elem.innerHTML="<i aria-hidden='true'>"+(done?"✓":"·")+"</i><span>"+ORG[id].name+"</span>";host.append(elem);}
}
function setSpecimen(type){
  if(!SPECIMENS[type])return;
  state.type=type;state.selected="nucleus";
  for(const [id,cell] of [["animal-btn","animal"],["plant-btn","plant"]]){$(id).classList.toggle("active",cell===type);$(id).setAttribute("aria-pressed",String(cell===type));}
  $("scene-status").textContent=SPECIMENS[type].name.toUpperCase()+" · MODELLO 3D";$("specimen-code").textContent=SPECIMENS[type].code;
  if(scene){scene.makeCell(type);scene.setMode(state.mode);scene.autoRotate=$("rotate-btn").classList.contains("active");}
  if(state.mode==="explore")stageCopy();else if(state.mode==="osmosis")updateTonicity();
  renderList();renderMission();
  if(state.mode==="explore")selectOrg("nucleus");
  if(state.mode==="osmosis"&&state.observing)observe();
}
function stageCopy(){
  const titles={explore:state.type==="animal"?["Un universo","invisibile."]:["La vita","che cattura luce."],osmosis:["L'acqua","trova la strada."],quiz:["Quanto","hai scoperto?"]};
  const tags={explore:"01 / ANATOMIA CELLULARE",osmosis:"02 / ESPERIMENTO: OSMOSI",quiz:"03 / VERIFICA DELLE SCOPERTE"};
  const desc={explore:"Trascina il modello, avvicinati e tocca un organulo per scoprirne il lavoro.",osmosis:"Modifica i soluti, fai una previsione e osserva che cosa accade alla cellula.",quiz:"Otto domande. Ogni risposta, una nuova possibilità di capire."};
  const words=titles[state.mode];$("stage-title").innerHTML=words[0]+"<br><em>"+words[1]+"</em>";$("stage-subtitle").textContent=desc[state.mode];$("stage-tag").textContent=tags[state.mode];
}
function goTo(mode){
  if(!["explore","osmosis","quiz"].includes(mode))return;
  state.mode=mode;
  document.querySelectorAll("[data-mode]").forEach(b=>{const on=b.dataset.mode===mode;b.classList.toggle("active",on);b.setAttribute("aria-current",on?"step":"false");});
  $("explore-panel").hidden=mode!=="explore";$("osmosis-panel").hidden=mode!=="osmosis";$("quiz-panel").hidden=mode!=="quiz";$("osm-hud").hidden=mode!=="osmosis";
  $("labels-btn").disabled=mode!=="explore";
  if(scene)scene.setMode(mode);
  stageCopy();
  if(mode==="explore"){selectOrg(state.selected);$("cell-canvas").setAttribute("aria-label","Modello 3D della cellula. Trascina e usa il catalogo degli organuli.");}
  if(mode==="osmosis"){$("cell-canvas").setAttribute("aria-label","Esperimento 3D sull'osmosi. Regola il cursore nel pannello per osservare.");updateTonicity();}
  if(mode==="quiz"){$("cell-canvas").setAttribute("aria-label","Modello 3D illustrativo. Svolgi la verifica nel pannello.");renderQuiz();}
}
function tonicity(){
  const v=Number($("solute-slider").value);return v<35?"in":v>65?"out":"equal";
}
function tonicName(dir){return dir==="in"?"Ipotonico":dir==="out"?"Ipertonico":"Isotonico";}
function updateTonicity(){
  const v=Number($("solute-slider").value);state.direction=tonicity();
  $("solute-percent").textContent=v+"%";$("tonicity").textContent=tonicName(state.direction);
  if(state.observing){state.observing=false;$("osmosis-result").hidden=true;}
  if(scene)scene.setOsmosis("equal",false);
  $("osm-direction").textContent="In attesa della previsione";$("osm-description").textContent="Scegli una risposta e avvia l'osservazione.";
}
function osmText(type,dir){
  if(type==="animal"){
    if(dir==="in")return {title:"La cellula si gonfia",desc:"In ambiente ipotonico l'acqua entra in quantità netta maggiore di quella che esce. Il volume aumenta; in casi estremi una cellula animale può andare incontro a lisi."};
    if(dir==="out")return {title:"La cellula si restringe",desc:"In ambiente ipertonico l'acqua esce in quantità netta maggiore di quella che entra. Il volume della cellula animale diminuisce."};
    return {title:"Volume sostanzialmente stabile",desc:"In ambiente isotonico le molecole d'acqua attraversano la membrana in entrambe le direzioni, ma non c'è un flusso netto."};
  }
  if(dir==="in")return {title:"La cellula diventa turgida",desc:"L'acqua entra, il vacuolo tende a espandersi e la parete cellulare contrasta l'aumento di volume. Si sviluppa pressione di turgore."};
  if(dir==="out")return {title:"Il protoplasto si ritrae",desc:"L'acqua esce dalla cellula vegetale: vacuolo e protoplasto si restringono. In condizioni sufficientemente ipertoniche la membrana può distaccarsi dalla parete: plasmolisi."};
  return {title:"Non c'è flusso netto",desc:"In una soluzione isotonica l'acqua continua a entrare e uscire, ma i flussi netti si bilanciano; il turgore può essere scarso."};
}
function observe(){
  state.direction=tonicity();state.observing=true;
  const dir=state.direction,correct=state.prediction===dir;
  const labels={in:["Verso l'interno","Entra più acqua di quanta ne esca."],out:["Verso l'esterno","Esce più acqua di quanta ne entri."],equal:["Nessun flusso netto","L'acqua passa in entrambe le direzioni."]};
  $("osm-direction").textContent=labels[dir][0];$("osm-description").textContent=labels[dir][1];
  const result=osmText(state.type,dir);
  $("osmosis-result").hidden=false;$("result-title").textContent=result.title;$("result-body").textContent=result.desc;
  $("prediction-outcome").classList.toggle("incorrect",state.prediction!==null&&!correct);
  $("prediction-outcome").textContent=state.prediction===null?"ESITO DELL'OSSERVAZIONE":correct?"✓ PREVISIONE CORRETTA":"PREVISIONE DA RIVEDERE";
  if(scene)scene.setOsmosis(dir,true);
}
function resetOsmosis(){
  $("solute-slider").value="50";state.prediction=null;state.observing=false;
  document.querySelectorAll("[data-predict]").forEach(b=>{b.classList.remove("selected");b.setAttribute("aria-pressed","false");});
  $("osmosis-result").hidden=true;updateTonicity();
}
function resetQuiz(){state.quiz={index:0,score:0,answered:false};renderQuiz();}
function renderQuiz(){
  const q=state.quiz;
  $("quiz-score").textContent=q.score+" "+(q.score===1?"punto":"punti");$("quiz-bar").style.width=((q.index+(q.answered?1:0))/QUESTIONS.length*100)+"%";
  if(q.index>=QUESTIONS.length){
    $("quiz-content").hidden=true;$("quiz-finish").hidden=false;$("quiz-counter").textContent="COMPLETATO";
    $("final-score").textContent=q.score+" risposte corrette su "+QUESTIONS.length+". Miglior risultato: "+Math.max(q.score,progress.best)+"/"+QUESTIONS.length+".";
    $("final-note").textContent=q.score===QUESTIONS.length?"Hai riconosciuto tutte le relazioni fondamentali. Ora prova a spiegarle senza guardare il modello.":q.score>=5?"Hai compreso molte funzioni. Riparti dalle spiegazioni degli errori per consolidarle.":"Questa verifica è un esperimento di apprendimento, non un voto: esplora gli organuli e riprova.";
    if(q.score>progress.best){progress.best=q.score;saveProgress();}
    return;
  }
  $("quiz-content").hidden=false;$("quiz-finish").hidden=true;
  const question=QUESTIONS[q.index];$("quiz-counter").textContent=String(q.index+1).padStart(2,"0")+" / "+String(QUESTIONS.length).padStart(2,"0");
  $("quiz-topic").textContent=question.topic;$("quiz-question").textContent=question.question;
  $("quiz-feedback").hidden=true;$("quiz-feedback").classList.remove("wrong");$("quiz-next").hidden=true;
  const host=$("quiz-answers");host.replaceChildren();
  question.answers.forEach((answer,i)=>{const button=document.createElement("button");button.type="button";button.dataset.answer=String(i);const index=document.createElement("span");index.textContent=String.fromCharCode(65+i);const name=document.createElement("b");name.textContent=answer;button.append(index,name);button.addEventListener("click",()=>answerQuiz(i));host.append(button);});
}
function answerQuiz(answer){
  const q=state.quiz;if(q.answered||q.index>=QUESTIONS.length)return;q.answered=true;
  const question=QUESTIONS[q.index],correct=answer===question.correct;
  if(correct)q.score++;
  $("quiz-score").textContent=q.score+" "+(q.score===1?"punto":"punti");
  $("quiz-bar").style.width=((q.index+1)/QUESTIONS.length*100)+"%";
  document.querySelectorAll("#quiz-answers button").forEach((button,i)=>{button.disabled=true;if(i===question.correct)button.classList.add("correct");else if(i===answer)button.classList.add("wrong");});
  $("quiz-feedback").hidden=false;$("quiz-feedback").classList.toggle("wrong",!correct);
  $("quiz-feedback").textContent=(correct?"✓ Esatto. ":"Non proprio. ")+question.why;
  $("quiz-next").hidden=false;$("quiz-next").textContent=q.index===QUESTIONS.length-1?"Scopri il tuo risultato →":"Prossima domanda →";
}
function bindInterface(){
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.mode)));
  $("animal-btn").addEventListener("click",()=>setSpecimen("animal"));$("plant-btn").addEventListener("click",()=>setSpecimen("plant"));
  $("rotate-btn").addEventListener("click",()=>{if(!scene)return;scene.autoRotate=!scene.autoRotate;const on=scene.autoRotate;$("rotate-btn").classList.toggle("active",on);$("rotate-btn").setAttribute("aria-pressed",String(on));});
  $("labels-btn").addEventListener("click",()=>{if(!scene)return;scene.setLabels(!scene.labelsOn);$("labels-btn").classList.toggle("active",scene.labelsOn);$("labels-btn").setAttribute("aria-pressed",String(scene.labelsOn));});
  $("zoom-in-btn").addEventListener("click",()=>scene&&scene.changeZoom(-.42));
  $("zoom-out-btn").addEventListener("click",()=>scene&&scene.changeZoom(.42));
  $("reset-view-btn").addEventListener("click",()=>scene&&scene.resetView());
  $("focus-btn").addEventListener("click",()=>scene&&scene.focus(state.selected));
  $("solute-slider").addEventListener("input",updateTonicity);
  document.querySelectorAll("[data-predict]").forEach(b=>b.addEventListener("click",()=>{state.prediction=b.dataset.predict;document.querySelectorAll("[data-predict]").forEach(other=>{const on=other===b;other.classList.toggle("selected",on);other.setAttribute("aria-pressed",String(on));});if(state.observing){state.observing=false;$("osmosis-result").hidden=true;if(scene)scene.setOsmosis("equal",false);}}));
  $("observe-btn").addEventListener("click",observe);$("reset-osmosis").addEventListener("click",resetOsmosis);
  $("quiz-next").addEventListener("click",()=>{state.quiz.index++;state.quiz.answered=false;renderQuiz();});
  $("quiz-restart").addEventListener("click",resetQuiz);$("back-explore").addEventListener("click",()=>goTo("explore"));
  const dialog=$("help-dialog");const open=()=>dialog.showModal();
  $("open-help").addEventListener("click",open);$("footer-help").addEventListener("click",open);
  $("close-help").addEventListener("click",()=>dialog.close());$("understood").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
}
function setupPWA(){
  if("serviceWorker" in navigator && location.protocol==="https:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}));}
  let deferred;
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;$("install-app").hidden=false;});
  $("install-app").addEventListener("click",async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$("install-app").hidden=true;});
  window.addEventListener("appinstalled",()=>{$("install-app").hidden=true;deferred=null;});
}
function init(){
  bindInterface();
  try{scene=new CellScene($("cell-canvas"),$("scene-labels"),selectOrg);$("rotate-btn").classList.toggle("active",scene.autoRotate);$("rotate-btn").setAttribute("aria-pressed",String(scene.autoRotate));}
  catch(err){console.error("Cellula Lab: rendering 3D non disponibile",err);$("webgl-error").hidden=false;$("cell-canvas").hidden=true;}
  setSpecimen("animal");goTo("explore");resetOsmosis();setupPWA();
}
init();
