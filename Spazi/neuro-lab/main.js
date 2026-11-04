(function () {
"use strict";

const SENSES = {
  "vista": {
    "name": "Vista",
    "title": "Dalla luce alla corteccia",
    "receptor": "Retina · coni e bastoncelli",
    "brain": "Corteccia visiva primaria (V1)",
    "location": "Lobo occipitale",
    "nodes": [
      "Retina",
      "Nervo ottico",
      "Chiasma ottico",
      "Corpo genicolato laterale (talamo)",
      "Radiazioni ottiche",
      "V1 occipitale",
      "Aree visive associative"
    ],
    "low": "Una luce tenue",
    "mid": "Un’immagine del mondo",
    "high": "Una luce molto intensa",
    "lowText": "A intensità ridotta, i dettagli possono diventare difficili da distinguere.",
    "midText": "Reti visive distribuite elaborano contorni, colori, movimento e profondità.",
    "highText": "Una luminosità eccessiva può provocare abbagliamento: più luce non significa sempre vedere meglio.",
    "intensityFact": "La retina codifica la luce con la risposta dei fotorecettori e con l’attività delle cellule gangliari. Adattamento alla luce e contesto cambiano il risultato.",
    "scienceFact": "Il segnale percorre nervo ottico, chiasma, talamo e corteccia occipitale. Il cervello non riceve una fotografia già pronta: ricostruisce proprietà della scena attraverso molte reti. Il talamo non è una generica stazione unica, ma qui è coinvolto soprattutto il corpo genicolato laterale.",
    "note": "Per la vista la via nervosa resta nella testa: il torace non è attraversato.",
    "source": "https://www.ncbi.nlm.nih.gov/books/NBK553189/"
  },
  "udito": {
    "name": "Udito",
    "title": "Dalle vibrazioni ai suoni",
    "receptor": "Coclea · cellule ciliate",
    "brain": "Corteccia uditiva primaria (A1)",
    "location": "Lobo temporale · giro di Heschl",
    "nodes": [
      "Cellule ciliate cocleari",
      "Nervo cocleare (VIII)",
      "Nuclei cocleari",
      "Complesso olivare superiore",
      "Collicolo inferiore",
      "Corpo genicolato mediale (talamo)",
      "A1 temporale"
    ],
    "low": "Un suono lieve",
    "mid": "Un suono riconoscibile",
    "high": "Un suono forte",
    "lowText": "Un suono debole può essere difficile da percepire in presenza di rumore.",
    "midText": "I circuiti uditivi analizzano altezza, intensità, ritmo e posizione del suono.",
    "highText": "Un volume elevato non migliora necessariamente la comprensione e può danneggiare l’udito.",
    "intensityFact": "Il suono più intenso tende a reclutare più fibre e a modificare i tassi di scarica, ma non fa correre più velocemente un singolo impulso. Il volume percepito non cresce in modo lineare.",
    "scienceFact": "Le vie uditive sono in larga parte bilaterali già nel tronco encefalico. Il sistema confronta segnali dalle due orecchie per stimare la direzione dei suoni. Il grafico mostra solo un ramo esemplificativo.",
    "note": "Per l’udito è rappresentato un ramo: molte vie ascendenti sono bilaterali.",
    "source": "https://www.ncbi.nlm.nih.gov/sites/books/NBK532311/"
  },
  "olfatto": {
    "name": "Olfatto",
    "title": "Dalle molecole agli odori",
    "receptor": "Epitelio olfattivo · neuroni",
    "brain": "Corteccia piriforme",
    "location": "Base del telencefalo · reti limbiche",
    "nodes": [
      "Epitelio olfattivo",
      "Nervo olfattivo (I)",
      "Bulbo olfattivo",
      "Tratto olfattivo",
      "Corteccia piriforme",
      "Amigdala / corteccia entorinale",
      "Reti orbitofrontali"
    ],
    "low": "Un odore appena percepibile",
    "mid": "Un odore riconoscibile",
    "high": "Un odore molto intenso",
    "lowText": "Con basse concentrazioni alcune molecole non superano la soglia di rilevazione.",
    "midText": "Il cervello riconosce configurazioni di odori e le collega ai ricordi.",
    "highText": "Un odore forte può risultare invadente; l’adattamento modifica la sensibilità nel tempo.",
    "intensityFact": "La concentrazione influisce su quanti recettori vengono attivati e sul loro schema di attività, ma non equivale direttamente all’intensità soggettiva. L’olfatto si adatta spesso rapidamente.",
    "scienceFact": "L’olfatto è diverso dagli altri sensi classici: dal bulbo olfattivo raggiunge direttamente aree corticali e limbiche senza un passaggio talamico iniziale obbligatorio. La rete talamica può intervenire in fasi successive.",
    "note": "L’olfatto non richiede un passaggio iniziale obbligatorio nel talamo.",
    "source": "https://www.ncbi.nlm.nih.gov/books/NBK10982/"
  },
  "gusto": {
    "name": "Gusto",
    "title": "Dalle sostanze ai sapori",
    "receptor": "Gemma gustativa · cellule",
    "brain": "Corteccia gustativa primaria",
    "location": "Insula anteriore / opercolo frontale",
    "nodes": [
      "Gemme gustative",
      "Nervi VII, IX e X",
      "Nucleo del tratto solitario",
      "Talamo (VPM)",
      "Insula anteriore",
      "Opercolo frontale",
      "Reti orbitofrontali"
    ],
    "low": "Sapore appena accennato",
    "mid": "Sapore riconoscibile",
    "high": "Sapore molto intenso",
    "lowText": "Una concentrazione tenue può produrre un gusto difficile da riconoscere.",
    "midText": "Le cellule gustative e le reti cerebrali concorrono a distinguere le qualità fondamentali.",
    "highText": "Una concentrazione elevata può risultare aspra o fastidiosa, senza aggiungere nuove qualità al gusto.",
    "intensityFact": "L’intensità dipende da concentrazione, classe di sostanza, recettori attivati e adattamento. Non esistono zone rigidamente separate della lingua dedicate ai singoli gusti.",
    "scienceFact": "La corteccia gustativa primaria coinvolge soprattutto insula anteriore e opercolo frontale. Ciò che chiamiamo comunemente sapore dipende molto anche dall’olfatto e da altre sensazioni somatiche.",
    "note": "Il gusto è distinto dal sapore completo, che coinvolge anche l’olfatto.",
    "source": "https://www.ncbi.nlm.nih.gov/books/NBK11018/"
  },
  "tatto": {
    "name": "Tatto",
    "title": "Dalla pelle alla corteccia",
    "receptor": "Pelle · meccanocettori",
    "brain": "Corteccia somatosensoriale (S1)",
    "location": "Lobo parietale · giro postcentrale",
    "nodes": [
      "Meccanocettori del palmo",
      "Nervo periferico",
      "Midollo · fascicolo cuneato",
      "Nucleo cuneato (bulbo)",
      "Lemnisco mediale · dopo incrocio",
      "Talamo (VPL)",
      "S1 parietale"
    ],
    "low": "Un tocco leggerissimo",
    "mid": "Una pressione distinguibile",
    "high": "Una pressione marcata",
    "lowText": "Un contatto molto lieve può sfuggire alla percezione.",
    "midText": "Le reti somatosensoriali localizzano il punto di contatto e valutano la sua intensità.",
    "highText": "Una pressione più marcata attiva diversamente i recettori; dolore e temperatura seguono anche altre vie.",
    "intensityFact": "Il sistema tattile usa più popolazioni di recettori e fibre. Frequenza di scarica e numero di unità attivate contribuiscono alla codifica della forza. Qui è mostrato il tatto fine, non la via del dolore.",
    "scienceFact": "Per il tatto fine della mano il fascicolo cuneato sale nel midollo e sinapta nel bulbo; le fibre incrociano e proseguono verso VPL e S1. La via del dolore e della temperatura è diversa e non viene simulata.",
    "note": "Il percorso tattile rappresenta il tatto fine della mano, non dolore e temperatura.",
    "source": "https://www.ncbi.nlm.nih.gov/books/NBK507888/"
  }
};

// Coordinate del ritratto 1536 × 1024. Le vie sono proiezioni laterali illustrative.
const MODELS = {
 vista:{point:[703,375],relay:[932,280],area:[1165,330],incoming:'M270 500L680 375',peripheral:'M703 375 C748 367 803 375 838 353 C879 336 897 291 932 280',central:'M932 280 C1016 262 1077 340 1165 330',contour:'M1168 225Q1211 277 1191 373Q1172 412 1138 370Q1158 333 1140 300Z',labels:['Retina','Nervo ottico','Talamo','corpo genicolato laterale','Corteccia visiva','lobo occipitale'],description:'Le reti visive analizzano forme, colori, movimento e profondità.',stimulus:'Un fiore rosa',detail:'Luce riflessa dai petali',journey:['Luce del fiore','Retina','Nervo ottico','Talamo','Corteccia visiva','Un fiore rosa'],captions:['La luce entra nell’occhio.','La luce diventa un segnale.','Gli impulsi viaggiano.','Il segnale viene inoltrato.','Le reti analizzano la scena.','Riconosco forma e colore.'],steps:[['Ricezione','La luce del fiore raggiunge la retina. Coni e bastoncelli la trasformano in segnali bioelettrici.'],['Trasmissione','Le cellule gangliari inviano impulsi nel nervo ottico. Al chiasma alcune fibre si incrociano.'],['Smistamento','Il tratto ottico raggiunge il corpo genicolato laterale del talamo, che invia segnali alla corteccia.'],['Elaborazione','Le radiazioni ottiche raggiungono V1, nel lobo occipitale. Altre reti analizzano colore, forma e movimento.'],['Sensazione','Il cervello integra i segnali con memoria e attenzione: «Vedo un fiore rosa davanti a me».']]},
 udito:{point:[1005,413],relay:[947,296],area:[1010,336],incoming:'M280 470Q640 270 1005 413',peripheral:'M1005 413Q948 410 985 483Q1034 487 1010 411Q988 351 947 296',central:'M947 296Q973 300 1010 336',contour:'M933 325Q991 292 1070 322L1082 351Q999 367 939 353Z',labels:['Coclea','Nervo cocleare','Talamo','corpo genicolato mediale','Corteccia uditiva','lobo temporale'],description:'Le reti uditive analizzano frequenza, ritmo e provenienza del suono.',stimulus:'Un diapason',detail:'Vibrazioni nell’aria',journey:['Onde sonore','Coclea','Nervo cocleare','Tronco e talamo','Corteccia uditiva','Un suono'],captions:['Il suono fa vibrare il timpano.','Si attivano le cellule ciliate.','Gli impulsi salgono nel nervo.','Più stazioni confrontano i segnali.','Le reti distinguono i suoni.','Riconosco ciò che ascolto.'],steps:[['Ricezione','Le vibrazioni raggiungono la coclea attraverso timpano e ossicini. Le cellule ciliate attivano le fibre nervose.'],['Trasmissione','Il nervo cocleare, parte dell’VIII nervo cranico, conduce gli impulsi ai nuclei cocleari del tronco encefalico.'],['Smistamento','Le vie uditive, in gran parte bilaterali, attraversano tronco, collicolo inferiore e talamo.'],['Elaborazione','La corteccia uditiva, nel lobo temporale, e le reti collegate analizzano frequenze, ritmo e posizione.'],['Sensazione','L’attività delle reti diventa esperienza: riconosco un suono e lo collego al suo significato.']]},
 tatto:{point:[440,840],relay:[931,282],area:[1014,161],incoming:'M325 760L440 840',peripheral:'M440 840C586 822 732 837 928 846Q1013 808 1004 670L993 480Q998 409 972 359L931 282',central:'M931 282Q958 242 1014 161',contour:'M988 103Q1021 109 1038 134L1012 242Q1002 264 980 253L1000 156Z',labels:['Pelle della spalla','Vie somatosensoriali','Talamo','nucleo VPL','Corteccia somatosensoriale','lobo parietale · S1'],description:'S1 e altre reti localizzano il contatto e ne analizzano le caratteristiche.',stimulus:'Una piuma',detail:'Contatto leggero sulla spalla',journey:['Contatto','Pelle','Midollo e bulbo','Talamo','Corteccia S1','Un tocco'],captions:['La piuma deforma la pelle.','Rispondono i meccanocettori.','Il segnale sale e si incrocia.','Il VPL inoltra il segnale.','Le reti localizzano il contatto.','Percepisco un tocco leggero.'],steps:[['Ricezione','Una piuma sfiora la spalla. La deformazione della pelle attiva i meccanocettori cutanei.'],['Trasmissione','Le fibre sensitive entrano nel midollo. Per il tatto fine, il segnale sale nei cordoni posteriori fino al bulbo.'],['Smistamento','Dopo la sinapsi nel nucleo cuneato e l’incrocio nel bulbo, il lemnisco mediale raggiunge il talamo, nucleo VPL.'],['Elaborazione','Il segnale arriva a S1, nel lobo parietale del lato opposto. Altre reti analizzano posizione e forza.'],['Sensazione','Percepisco un contatto sulla spalla. Dolore e temperatura coinvolgono anche vie diverse da quella mostrata.']]},
 gusto:{point:[650,551],relay:[929,282],area:[893,330],incoming:'M360 620L650 551',peripheral:'M650 551C753 548 887 579 975 495Q999 466 966 404L929 282',central:'M929 282Q891 292 893 330',contour:'M858 305Q886 283 912 311L927 342Q886 370 862 345Z',labels:['Gemme gustative','Nervi VII, IX e X','Talamo','nucleo VPM','Corteccia gustativa','insula / opercolo frontale'],description:'L’insula e l’opercolo frontale elaborano le qualità gustative.',stimulus:'Una goccia di limone',detail:'Molecole sciolte nella saliva',journey:['Limone','Gemme gustative','Nervi cranici','Tronco e talamo','Insula e opercolo','Un gusto acido'],captions:['Le sostanze si sciolgono.','Si attivano le cellule gustative.','Il segnale percorre VII, IX, X.','Nucleo solitario, poi VPM.','Le reti elaborano il gusto.','Gusto e olfatto formano il sapore.'],steps:[['Ricezione','Le molecole disciolte nella saliva raggiungono le gemme gustative. Il limone attiva una risposta al gusto acido.'],['Trasmissione','Le informazioni gustative viaggiano nei nervi cranici VII, IX e X verso il nucleo del tratto solitario.'],['Smistamento','Dal tronco encefalico il segnale raggiunge il talamo, in particolare la componente gustativa del VPM.'],['Elaborazione','La corteccia gustativa comprende insula anteriore e opercolo frontale, qui mostrati in proiezione.'],['Sensazione','Percepisco il gusto acido. Il sapore completo integra anche olfatto, temperatura e consistenza.']]},
 olfatto:{point:[628,445],relay:[758,342],area:[863,372],incoming:'M280 500Q461 400 628 445',peripheral:'M628 445Q649 362 758 342',central:'M758 342C790 343 819 366 863 372',contour:'M817 353Q856 340 892 364L895 386Q853 405 822 382Z',labels:['Epitelio olfattivo','Tratto olfattivo','Bulbo olfattivo','prima elaborazione','Corteccia olfattiva','piriforme · regione profonda'],description:'La corteccia piriforme e le reti collegate elaborano le combinazioni di odori.',stimulus:'Il profumo di un fiore',detail:'Molecole odorose nell’aria',journey:['Molecole odorose','Epitelio olfattivo','Nervo olfattivo','Bulbo olfattivo','Corteccia olfattiva','Un profumo'],captions:['Le molecole entrano nel naso.','Rispondono i neuroni recettori.','Gli assoni raggiungono il bulbo.','Il segnale viene riorganizzato.','Nessun primo relay talamico.','Un odore può evocare un ricordo.'],steps:[['Ricezione','Le molecole del fiore raggiungono l’epitelio nella parte alta della cavità nasale e attivano neuroni olfattivi.'],['Trasmissione','Gli assoni dei recettori attraversano la lamina cribrosa e raggiungono il bulbo olfattivo.'],['Prima elaborazione','Nel bulbo il segnale viene riorganizzato. Il tratto olfattivo lo invia alle aree corticali primarie.'],['Elaborazione','La corteccia piriforme riceve segnali senza un passaggio talamico iniziale obbligatorio. È una regione profonda.'],['Sensazione','Percepisco un profumo. Reti olfattive, memoria ed emozioni partecipano al riconoscimento dell’odore.']]}
};
for (const [id,m] of Object.entries(MODELS)) {
 Object.assign(SENSES[id],{sourcePoint:m.point,zoom:m.area,incoming:m.incoming,peripheral:m.peripheral,central:m.central,steps:m.steps,stimulus:m.stimulus,detail:m.detail});
}
// Il nuovo ritratto mostra la spalla, non una mano: anche i testi seguono lo stimolo.
for(const k of ['nodes','low','mid','high','lowText','midText','highText','scienceFact','note']){
 const d=SENSES.tatto;
 if(Array.isArray(d[k])) d[k]=d[k].map(s=>s.replace(/del palmo/g,'della spalla').replace(/della mano/g,'della spalla'));
 else d[k]=d[k].replace(/del palmo/g,'della spalla').replace(/della mano/g,'della spalla');
}
SENSES.vista.mid='Un fiore rosa, davanti a me';SENSES.vista.midText='Riconosco il fiore: forma e colore emergono dall’attività di più reti visive.';
SENSES.vista.high='Un fiore nella luce intensa';
const $=id=>document.getElementById(id);
const state={sense:'vista',intensity:75,progress:0,playing:false,mode:'all',highlight:true,path:true,mental:true,speed:1,tab:'route'};
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const positions=[.12,.34,.54,.79,.98];
const phaseForJourney=[0,0,1,2,3,4];
const p1=$('pathPeripheral'),p2=$('pathCentral');
let len1=0,len2=0,lastTime=0,raf=0,audioContext;
const dots=Array.from({length:6},()=>{const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','3.3');c.setAttribute('fill','#fff4c6');c.style.filter='drop-shadow(0 0 5px #ffcc55)';$('routeLayer').append(c);return c;});
const current=()=>SENSES[state.sense],model=()=>MODELS[state.sense],text=(id,s)=>{$(id).textContent=s;};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const emit=(action)=>window.dispatchEvent(new CustomEvent('neurolab:interaction',{detail:{action}}));
function point(el,p){el.setAttribute('cx',p[0]);el.setAttribute('cy',p[1]);}
function seek(index,manual=true){state.progress=positions[index];state.playing=false;if(manual)emit('seek');render();}
function thumb(i){const e=document.createElement('span');e.className='step-thumb thumb-'+i;e.setAttribute('aria-hidden','true');if(i===1&&state.sense!=='vista'){e.className='step-thumb receptor-icon';const svg=document.querySelector('.sense-button[data-sense="'+state.sense+'"] svg').cloneNode(true);e.append(svg);}if(i===5&&state.sense==='olfatto')e.className='step-thumb thumb-3';return e;}
function buildSteps(){
 $('steps').replaceChildren();$('journeySteps').replaceChildren();
 current().steps.forEach((s,i)=>{
  const b=document.createElement('button');b.className='step';b.type='button';b.setAttribute('aria-label','Fase '+(i+1)+': '+s[0]);
  const body=document.createElement('span'),h=document.createElement('strong'),n=document.createElement('span'),t=document.createElement('span');
  n.className='step-num';n.textContent=i+1;h.className='step-title';h.append(n,document.createTextNode(s[0]));t.className='step-info';t.textContent=s[1];body.append(h,t);b.append(thumb([1,2,5,3,4][i]),body);b.addEventListener('click',()=>seek(i));$('steps').append(b);
 });
 model().journey.forEach((s,i)=>{
  const b=document.createElement('button');b.type='button';b.className='journey-step';b.dataset.phase=phaseForJourney[i];
  const h=document.createElement('strong'),p=document.createElement('small');h.textContent=s;p.textContent=model().captions[i];b.append(thumb([0,1,2,5,3,4][i]),h,p);b.addEventListener('click',()=>seek(phaseForJourney[i]));$('journeySteps').append(b);
 });
}
function updateSense(id){
 if(!SENSES[id])return;state.sense=id;state.progress=0;state.playing=false;
 const d=current(),m=model();document.body.dataset.sense=id;$('scene').dataset.sense=id;
 document.querySelectorAll('.sense-button[data-sense]').forEach(b=>{const active=b.dataset.sense===id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 text('sceneTitle',d.name);const span=document.createElement('span');span.textContent=' · '+d.title;$('sceneTitle').append(span);
 text('anatomyTitle','Le vie '+({vista:'visive',udito:'uditive',tatto:'somatosensoriali',gusto:'gustative',olfatto:'olfattive'}[id])+' nel corpo umano');
 text('processTitle','Il processo '+({vista:'della vista',udito:'dell’udito',tatto:'del tatto',gusto:'del gusto',olfatto:'dell’olfatto'}[id]));
 ['stimulus','detail'].forEach((k,i)=>text(i?'stimulusDetail':'stimulusName',m[k]));
 ['receptorLabel','nerveLabel','relayLabel','relayDetail','cortexLabel','cortexDetail'].forEach((k,i)=>text(k,m.labels[i]));
 text('brainAreaLabel',d.brain);text('brainSideNote',d.location);text('areaDescription',m.description);text('scienceNote',d.note);
 $('sceneStimulus').className='scene-stimulus '+id;
 $('incomingSignal').setAttribute('d',m.incoming);$('lightBeam').style.display=id==='vista'?'':'none';
 ['pathPeripheral','pathPeripheralBase'].forEach(k=>$(k).setAttribute('d',m.peripheral));['pathCentral','pathCentralBase'].forEach(k=>$(k).setAttribute('d',m.central));
 len1=p1.getTotalLength();len2=p2.getTotalLength();
 ['receptorHalo','receptorCore'].forEach(k=>point($(k),m.point));['relayGlow','relayCore'].forEach(k=>point($(k),m.relay));['brainHighlight','brainHighlightGlow','brainHighlightPoint'].forEach(k=>point($(k),m.area));
 $('regionContour').setAttribute('d',m.contour);
 $('receptorLeader').setAttribute('d','M540 275L'+m.point.join(' '));$('relayLeader').setAttribute('d','M950 150L'+m.relay.join(' '));$('cortexLeader').setAttribute('d','M1370 250L'+m.area.join(' '));
 const midpoint=p1.getPointAtLength(len1*.4);$('nerveLeader').setAttribute('d','M860 530L'+midpoint.x+' '+midpoint.y);
 buildSteps();updatePerception();renderTab();updateToneButton();render();window.dispatchEvent(new CustomEvent('neurolab:sensechange',{detail:{sense:id}}));
}
function updatePerception(){
 const d=current(),v=state.intensity;
 text('intensityValue',v+'%');$('intensity').style.setProperty('--range-pct',v+'%');text('journeySense',d.name+' · intensità '+v+'%');
 text('perceptionLevel',v===0?'Assente':v<34?'Bassa':v<74?'Media':'Elevata');
 text('perceptionHeading',v===0?'Stimolo assente':v<34?d.low:v<74?d.mid:d.high);
 text('perceptionText',v===0?'Nel modello non è generata una risposta allo stimolo scelto. L’attività spontanea del cervello non è rappresentata.':v<34?d.lowText:v<74?d.midText:d.highText);
 $('sceneStimulus').style.opacity=v===0?'.18':String(.48+v*.0052);
 $('stimulusConnection').style.opacity=v===0?'0':String(.18+v*.0082);
}
function reveal(p,len,f){p.style.strokeDasharray=len+' '+len;p.style.strokeDashoffset=len*(1-clamp(f));}
function render(){
 const p=state.progress,v=state.intensity,phase=p===0?-1:Math.min(4,Math.floor(p*5));
 const showP=state.mode!=='central',showC=state.mode!=='peripheral';
 const f1=clamp((p-.16)/.34),f2=clamp((p-.59)/.20);
 reveal(p1,len1,f1);reveal(p2,len2,f2);
 p1.style.opacity=showP&&v>0?'1':'0';p2.style.opacity=showC&&v>0?'1':'0';
 $('pathPeripheralBase').style.opacity=showP?(v>0?'.65':'.14'):'0';$('pathCentralBase').style.opacity=showC?(v>0?'.65':'.14'):'0';
 const travelling=!reducedMotion&&p>.16&&p<.86&&v>0&&((p<.59&&showP)||(p>=.59&&showC));
 const sample=p<.59?p1.getPointAtLength(f1*len1):p2.getPointAtLength(f2*len2);
 ['pulse','pulseHalo'].forEach(k=>{point($(k),[sample.x,sample.y]);$(k).style.display=travelling?'':'none';});
 // L'intensità aumenta la densità degli impulsi, mai la loro velocità.
 dots.forEach((dot,i)=>{const q=p-(i+1)*.036,inP=q>=.16&&q<.59&&showP,inC=q>=.59&&q<.85&&showC;dot.style.display=!reducedMotion&&v>0&&i<Math.ceil(v/17)&&(inP||inC)?'':'none';if(inP||inC){const pt=inP?p1.getPointAtLength(clamp((q-.16)/.34)*len1):p2.getPointAtLength(clamp((q-.59)/.20)*len2);point(dot,[pt.x,pt.y]);}});
 const cortex=state.highlight&&showC&&v>0;
 $('brainRegion').style.opacity=cortex?(p===0?'.55':p>=.6?String(.3+v*.007):'.12'):'0';
 $('relayGlow').style.opacity=v>0&&p>=.4&&state.mode!=='central'?'.85':'0';$('relayCore').style.opacity=v>0?'.8':'.12';$('receptorHalo').style.opacity=v>0?String(.3+v*.007):'0';$('receptorCore').style.opacity=v>0?'1':'.15';
 $('scene').classList.toggle('no-path',!state.path);$('scene').classList.toggle('no-highlight',!state.highlight);$('scene').classList.toggle('no-mental',!state.mental);document.body.classList.toggle('mental-hidden',!state.mental);
 [...$('steps').children].forEach((b,i)=>{b.classList.toggle('active',i===phase);b.setAttribute('aria-current',i===phase?'step':'false');});
 [...$('journeySteps').children].forEach(b=>{const active=Number(b.dataset.phase)===phase;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'step':'false');});
 $('progressFill').style.width=p*100+'%';
 document.querySelector('.track').setAttribute('aria-valuenow',String(Math.round(p*100)));
 text('signalPercent',Math.round(p*100)+'%');
 const msg=v===0?'Stimolo assente · nessuna risposta':p===0?'Segui il segnale · avvia la simulazione':p===1?'Percorso completato · il cervello integra':current().steps[phase][0];
 if($('signalStatus').textContent!==msg)text('signalStatus',msg);
 text('statusBadge',state.playing?'IN CORSO':p===1?'COMPLETATO':p===0?'PRONTA':'IN PAUSA');
 $('playBtn').innerHTML=state.playing?'<span>Ⅱ</span> Pausa simulazione':'<span>▶</span> '+(p>0&&p<1?'Riprendi simulazione':'Avvia la simulazione');
 $('playBtn').setAttribute('aria-label',state.playing?'Metti in pausa la simulazione':p>0&&p<1?'Riprendi la simulazione':'Avvia la simulazione');
}
function renderTab(){
 const d=current(),b=$('tab-panel');b.replaceChildren();const h=document.createElement('h3'),p=document.createElement('p');
 if(state.tab==='route'){
  h.textContent='Il percorso: '+d.name.toLowerCase();b.append(h);const row=document.createElement('div');row.className='route-chips';d.nodes.forEach((s,i)=>{const c=document.createElement('span');c.textContent=(i?'→ ':'')+s;row.append(c);});b.append(row);
  p.textContent='Vista laterale illustrativa: le strutture profonde sono proiettate in superficie. Diramazioni, incroci, bilateralità e circuiti di ritorno sono semplificati. L’animazione rallenta il processo per renderlo leggibile; non mostra tempi biologici reali.';
 }else if(state.tab==='intensity'){h.textContent='Più stimolo non significa impulsi più veloci';p.textContent=d.intensityFact+' La scala 0–100% è qualitativa e non corrisponde a una misura fisica né a una risposta soggettiva lineare.';b.append(h);}
 else{h.textContent='Il cervello interpreta attraverso reti';p.textContent=d.scienceFact+' La percezione coinvolge molte aree connesse: il punto luminoso indica un’area di riferimento, non un unico «centro della sensazione». Le immagini sono illustrazioni e non scansioni cliniche.';b.append(h);}
 b.append(p);const a=document.createElement('a');a.className='science-sources';a.href='https://openstax.org/books/anatomy-and-physiology/pages/14-2-central-processing';a.target='_blank';a.rel='noopener';a.textContent='Percorsi sensoriali · OpenStax, Anatomy and Physiology ↗';b.append(a);
 document.querySelectorAll('.tab').forEach(t=>{const active=t.dataset.tab===state.tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;});b.setAttribute('aria-labelledby','tab-'+state.tab);
}
function frame(t){
 if(!state.playing){raf=0;return;}const dt=lastTime?Math.max(0,t-lastTime):0;lastTime=t;
 state.progress=clamp(state.progress+dt*state.speed/14000);if(state.progress>=1)state.playing=false;render();raf=state.playing?requestAnimationFrame(frame):0;
}
function start(){if(state.progress>=1)state.progress=0;state.playing=true;lastTime=0;if(!raf)raf=requestAnimationFrame(frame);render();}
function togglePlay(){emit('play');if(state.playing){state.playing=false;render();}else start();}
function updateToneButton(){
 $('listenDemo')?.remove();if(state.sense!=='udito')return;
 const b=document.createElement('button');b.id='listenDemo';b.type='button';b.textContent='♫ Ascolta il diapason (440 Hz)';b.style.cssText='margin-top:9px;padding:7px;font-size:10px;min-height:34px';
 b.addEventListener('click',async()=>{if(!state.intensity)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error();audioContext??=new C();await audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime;o.frequency.value=440;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04*state.intensity/100,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+.7);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(t+.75);o.onended=()=>{o.disconnect();g.disconnect();};}catch{b.textContent='Audio dimostrativo non disponibile';}});$('perceptionText').after(b);
}
$('playBtn').addEventListener('click',togglePlay);
$('resetBtn').addEventListener('click',()=>{emit('reset');state.playing=false;state.progress=0;render();});
$('replayBtn').addEventListener('click',()=>{emit('replay');state.progress=0;start();});
$('intensity').addEventListener('input',e=>{emit('intensity');state.intensity=Number(e.target.value);updatePerception();render();});
for(const [id,key] of [['pathToggle','path'],['highlightToggle','highlight'],['mentalToggle','mental']])$(id).addEventListener('change',e=>{state[key]=e.target.checked;render();});
$('speed').addEventListener('change',e=>state.speed=Number(e.target.value));
$('fullscreenBtn').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else text('signalStatus','Schermo intero non supportato dal dispositivo.');}catch{text('signalStatus','Schermo intero non disponibile.');}});
for(const b of document.querySelectorAll('.sense-button[data-sense]'))b.addEventListener('click',()=>updateSense(b.dataset.sense));
for(const b of document.querySelectorAll('.anatomy-label'))b.addEventListener('click',()=>seek(Number(b.dataset.phase)));
for(const b of document.querySelectorAll('input[name=route]'))b.addEventListener('change',()=>{state.mode=b.value;render();});
for(const t of document.querySelectorAll('.tab')){
 t.addEventListener('click',()=>{state.tab=t.dataset.tab;renderTab();});
 t.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('.tab')],i=tabs.indexOf(t),n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[n].focus();tabs[n].click();});
}
for(const b of document.querySelectorAll('[data-open-tab]'))b.addEventListener('click',()=>{state.tab=b.dataset.openTab;renderTab();$('tab-panel').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});$('tab-panel').focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body){e.preventDefault();togglePlay();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){state.playing=false;render();}});
window.NeuroLabAPI=Object.freeze({getSense:()=>state.sense,getProgress:()=>state.progress,getData:()=>{const d=current();return{id:state.sense,name:d.name,title:d.title,stimulus:d.stimulus,receptor:d.receptor,brain:d.brain,location:d.location,intensity:state.intensity,steps:d.steps.map(s=>s.slice()),note:d.note,scienceFact:d.scienceFact};},pauseVisual:()=>{state.playing=false;render();},seekStep:i=>{if(Number.isInteger(i)&&i>=0&&i<5)seek(i,false);},finish:()=>{state.progress=1;state.playing=false;render();}});
$('realisticBody').addEventListener('error',()=>{text('signalStatus','Immagine anatomica non disponibile. Le fasi e i controlli restano utilizzabili.');});
updateSense('vista');
})();
