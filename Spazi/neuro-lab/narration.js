/* NeuroLab — guida vocale. Sintesi vocale nativa, nessun servizio esterno. */
(function () {
"use strict";
const $ = (id) => document.getElementById(id);
const api = window.NeuroLabAPI;
const synth = window.speechSynthesis;
const supported = Boolean(api && synth && window.SpeechSynthesisUtterance);
const state = {session:0,segments:[],index:0,running:false,paused:false,voice:null,mode:"all"};
const femaleNames = /(?:alice|elsa|isabella|federica|paola|giulia|silvia|lucia|bianca|elena|francesca|caterina|anna|serena|maria|violetta|vittoria|emma|sophia|sofia|flavia|elisa|giovanna|alessia|carla|margherita|female|donna|woman|rosa|camilla|clara|aurora|valentina|rita|daniela|chiara|valeria|arianna|marta)/i;
const masculineNames = /(?:cosimo|luca|giorgio|diego|matteo|riccardo|\bmale\b|uomo|gianni|andrea|mauro|roberto|giuseppe|stefano|fabio|marco|alessandro|enrico|lorenzo|pietro|franco)/i;
let currentVoices = [];
let lastIntro = "";

function status(message) { $("voiceStatus").textContent = message; }
function setButtons() {
 $("voicePlay").disabled = !supported;
 $("voicePhase").disabled = !supported;
 $("voicePause").disabled = !state.running;
 $("voiceStop").disabled = !state.running;
 $("voicePause").textContent = state.paused ? "▶ Riprendi" : "Ⅱ Pausa";
}
function isItalian(v) { return /^it(?:-|_)/i.test(v.lang) || /\bitalian[oa]?\b/i.test(v.name); }
function voiceOrder(a,b) {
 const rank = v => {
  const name = v.name || "";
  const female = femaleNames.test(name) && !masculineNames.test(name);
  const italian = /^it[-_]IT/i.test(v.lang);
  return (female?0:10) + (italian?0:3) + (v.localService?0:1);
 };
 return rank(a)-rank(b) || a.name.localeCompare(b.name,"it");
}
function refreshVoices() {
 if(!supported) return;
 let voices = [];
 try { voices = synth.getVoices().filter(isItalian).sort(voiceOrder); }
 catch(_error) { voices=[]; }
 const oldChoice = state.voice ? state.voice.voiceURI : "";
 currentVoices=voices;
 $("voiceChoice").replaceChildren();
 if(!voices.length) {
  const option=document.createElement("option");
  option.value="";
  option.textContent="Nessuna voce italiana rilevata";
  $("voiceChoice").append(option);
  state.voice=null;
  if(!state.running)status("Per l’audio serve una voce italiana disponibile nelle impostazioni del dispositivo.");
  return;
 }
 voices.forEach(function (v,index) {
  const option = document.createElement("option");
  option.value=String(index);
  const identifiedFemale = femaleNames.test(v.name) && !masculineNames.test(v.name);
  option.textContent=(identifiedFemale?"♀ ":"") + v.name + " · " + v.lang;
  $("voiceChoice").appendChild(option);
 });
 const chosenOld=voices.findIndex(v=>v.voiceURI===oldChoice);
 let index=chosenOld>=0?chosenOld:voices.findIndex(v=>femaleNames.test(v.name) && !masculineNames.test(v.name));
 if(index<0) index=0;
 $("voiceChoice").value=String(index);
 state.voice=voices[index];
 const chosenName=state.voice.name;
 if(!state.running) {
  status(femaleNames.test(chosenName)&&!masculineNames.test(chosenName) ?
   "Voce preferita: " + chosenName + ". Premi «Ascolta tutto» per iniziare." :
   "Nessuna voce identificata come femminile. Scegli una voce italiana dal menu e provala, oppure installane una femminile.");
 }
}
function sceneData() { return api.getData(); }
function buildScript(mode, phase) {
 const d=sceneData();
 const intensity=d.intensity===0?"zero: il recettore non viene attivato dallo stimolo simulato":
  d.intensity<34?"bassa":d.intensity<74?"intermedia":"elevata";
 const intro="Benvenuti in NeuroLab. Oggi esploriamo " +
   ({vista:"la vista",udito:"l’udito",olfatto:"l’olfatto",gusto:"il gusto",tatto:"il tatto"}[d.id])+
   ". Lo stimolo scelto è: "+d.stimulus.toLowerCase()+". L’intensità impostata è "+intensity+
   ". Osserveremo come i recettori trasformano uno stimolo fisico o chimico in segnali, quali vie attraversano e come diverse reti cerebrali contribuiscono alla percezione.";
 const outro="Il percorso non è un semplice filo che accende un unico punto del cervello. È una rete: il cervello integra segnali, attenzione, memoria ed esperienza. "+d.note+
   " Ricorda che questa è una simulazione didattica, non una misurazione di un cervello reale.";
 const all=[{kind:"intro",text:intro}];
 d.steps.forEach((item,index)=>all.push({kind:"step",phase:index,text:
  ["Prima","Seconda","Terza","Quarta","Quinta"][index]+
  " fase: "+item[0]+". "+item[1]}));
 all.push({kind:"end",text:outro});
 if(mode==="phase") return [all[phase+1]];
 return all;
}
function renderTranscript() {
 const d=sceneData();
 const wrapper=$("voiceTranscript");
 wrapper.replaceChildren();
 const h=document.createElement("h3");
 h.textContent="Spiegazione completa · "+d.name;
 wrapper.append(h);
 const all=buildScript("all",0);
 all.forEach(part=>{
  const p=document.createElement("p");
  p.textContent=part.text;
  wrapper.append(p);
 });
 const caveat=document.createElement("p");
 caveat.className="voice-caveat";
 caveat.textContent="La guida utilizza le voci italiane presenti nel browser o nel sistema. Il timbro e la disponibilità delle voci femminili possono variare tra Windows, Android e iPad.";
 wrapper.append(caveat);
 lastIntro=d.id+":"+d.intensity;
}

function stop(silent) {
 state.session++;
 state.running=false;
 state.paused=false;
 state.segments=[];
 state.index=0;
 if(supported) {
  try { synth.cancel(); } catch (_error) {}
 }
 setButtons();
 if(!silent)status("Narrazione interrotta. Puoi riprenderla dall’inizio o ascoltare una fase.");
}
function speakNext(session) {
 if(!state.running || session!==state.session)return;
 if(state.index>=state.segments.length){
  state.running=false;state.paused=false;setButtons();
  if(state.mode==="all" && api.finish)api.finish();
  status("Spiegazione completata. Seleziona un altro senso o ripeti l’esperimento.");
  return;
 }
 const segment=state.segments[state.index];
 if(segment.kind==="step") api.seekStep(segment.phase);
 const sentence=new SpeechSynthesisUtterance(segment.text);
 sentence.lang="it-IT";
 if(state.voice)sentence.voice=state.voice;
 sentence.rate=Number($("voiceRate").value)||.96;
 sentence.pitch=1;
 sentence.volume=.95;
 sentence.onstart=()=>{
  if(session!==state.session)return;
  const part=segment.kind==="step"? "Fase "+(segment.phase+1)+" di 5":segment.kind==="intro"?"Introduzione":"Conclusione";
  status("In ascolto · "+part+" · "+sceneData().name);
 };
 sentence.onend=()=>{
  if(session!==state.session||!state.running)return;
  state.index++;
  speakNext(session);
 };
 sentence.onerror=(event)=>{
  if(session!==state.session)return;
  if(event.error==="interrupted"||event.error==="canceled")return;
  stop(true);
  status("La lettura non è riuscita ("+(event.error||"errore")+
   "). Prova un’altra voce italiana dal menu oppure verifica le voci installate nel dispositivo.");
 };
 try { synth.speak(sentence); }
 catch (_error) {stop(true);status("Il dispositivo non riesce ad avviare la sintesi vocale.");}
}
function play(mode) {
 if(!supported){status("Questo browser non supporta la lettura vocale del laboratorio.");return;}
 refreshVoices();
 if(!currentVoices.length){
  status("Nessuna voce italiana riconosciuta: abilita una voce italiana femminile nelle impostazioni del dispositivo.");
  return;
 }
 const choice=currentVoices[Number($("voiceChoice").value)];
 if(!choice){status("Scegli prima una voce italiana dall’elenco.");return;}
 if(masculineNames.test(choice.name)&&!femaleNames.test(choice.name)){
  status("La voce selezionata sembra maschile. Per questa guida scegli una voce femminile.");
  return;
 }
 // Per le voci senza metadati di genere, il menu è lasciato alla scelta esplicita dell’utente.
 stop(true);
 state.voice=choice;
 state.mode=mode;
 api.pauseVisual();
 if(mode==="all")api.seekStep(0);
 state.running=true;
 const phase=Math.min(4,Math.max(0,Math.floor(api.getProgress()*5)));
 state.segments=buildScript(mode,phase);
 state.index=0;
 const session=state.session;
 setButtons();
 speakNext(session);
}
function togglePause(){
 if(!state.running)return;
 try{
  if(state.paused){synth.resume();state.paused=false;status("Narrazione ripresa.");}
  else{synth.pause();state.paused=true;status("Narrazione in pausa.");}
  setButtons();
 }catch(_error){status("Impossibile mettere in pausa la voce su questo dispositivo.");}
}
window.addEventListener("neurolab:interaction",()=>{if(state.running){stop(true);status("Narrazione fermata: i controlli hanno cambiato la simulazione.");}renderTranscript();});
$("voicePlay").addEventListener("click",()=>play("all"));
$("voicePhase").addEventListener("click",()=>play("phase"));
$("voiceStop").addEventListener("click",()=>stop(false));
$("voicePause").addEventListener("click",togglePause);
$("voiceChoice").addEventListener("change",()=>{state.voice=currentVoices[Number($("voiceChoice").value)]||null;stop(true);
 if(state.voice)status("Voce selezionata: "+state.voice.name+". Premi «Ascolta tutto».");});
$("voiceRate").addEventListener("change",()=>{if(state.running)status("Il nuovo ritmo sarà applicato dalla fase successiva.");});
window.addEventListener("neurolab:sensechange",()=>{
 stop(true);
 renderTranscript();
 if(supported)refreshVoices();
});
$("intensity").addEventListener("input",()=>{
 if(!state.running && lastIntro!==sceneData().id+":"+sceneData().intensity)renderTranscript();
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden && state.running && !state.paused)togglePause();
});
if(!supported){
 status("La sintesi vocale non è supportata su questo browser. Il testo completo resta disponibile qui sotto.");
 $("voiceChoice").disabled=true;
}else{
 refreshVoices();
 if(typeof synth.addEventListener==="function")synth.addEventListener("voiceschanged",refreshVoices);
 else if("onvoiceschanged" in synth)synth.onvoiceschanged=refreshVoices;
}
renderTranscript();
setButtons();
})();