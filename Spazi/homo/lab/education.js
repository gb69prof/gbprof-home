import {esc, cites, levelTag, link, supported} from '../ui/common.js';
import {evolution} from './labs.js';
import {geneticsLesson} from '../data/genetics-lesson.js';

const methodFamilies = [
  ['Ordinare e datare', ['stratigrafia','radiocarbonio','serie-uranio','termoluminescenza','osl','esr','paleomagnetismo','bayes']],
  ['Confrontare i corpi', ['morfometria','ricostruzione']],
  ['Leggere le molecole', ['isotopi','paleogenetica','paleoproteomica']],
  ['Ricostruire gli eventi', ['tafonomia']]
];

const deposits = [
  {
    name: 'Deposizione',
    text: 'Si accumula un deposito con un osso. Il reperto e il materiale che lo circonda costituiscono l’unità antica dello schema.',
    shape: 'M18 93 Q160 80 305 94 T602 90 L602 198 H18Z'
  },
  {
    name: 'Erosione',
    text: 'L’erosione incide il deposito. Sulla sinistra rimane un rilievo di sedimento antico. A destra l’acqua ha asportato una parte della sequenza.',
    shape: 'M18 93 Q100 87 178 89 C246 89 251 139 330 147 Q444 163 602 135 L602 198 H18Z'
  },
  {
    name: 'Riempimento',
    text: 'Un deposito più recente riempie la depressione. Il contatto obliquo accosta materiali di età diverse. Una parte del sedimento giovane finisce più in basso della sommità del deposito antico.',
    shape: 'M18 93 Q100 87 178 89 C246 89 251 139 330 147 Q444 163 602 135 L602 198 H18Z'
  },
  {
    name: 'Confronto',
    text: 'A sinistra l’osso e a destra il campione giovane sono sulla stessa linea orizzontale. Per attribuire un’età all’osso occorre seguire la superficie di contatto e scegliere campioni della sua unità.',
    shape: 'M18 93 Q100 87 178 89 C246 89 251 139 330 147 Q444 163 602 135 L602 198 H18Z'
  }
];

function sectionDiagram(stage) {
  const presence = stage >= 2;
  const sample = stage === 3;
  const younger = 'M178 89 C246 89 251 139 330 147 Q444 163 602 135 L602 85 Q434 79 293 86 Q220 87 178 89Z';
  return `<svg viewBox="0 0 620 210" role="img" aria-label="${esc(deposits[stage].text)}" class="edu-strata">
    <defs><pattern id="edu-sand" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="4" cy="7" r="1.6" fill="#59452d"/></pattern><pattern id="edu-silt" width="15" height="10" patternUnits="userSpaceOnUse"><path d="M0 7H8" stroke="#786a50" stroke-width="1.6"/></pattern></defs>
    <path d="${deposits[stage].shape}" fill="#c8a36f" stroke="#6c5039" stroke-width="2"/><path d="${deposits[stage].shape}" fill="url(#edu-sand)"/>
    ${presence?`<g class="edu-reveal"><path d="${younger}" fill="#e6d7ad" stroke="#6c5039" stroke-width="2"/><path d="${younger}" fill="url(#edu-silt)"/></g>`:''}
    <path d="M70 116q-7 -8 -12 -2q-6 6 1 11q6 3 10 -1l19 -1q5 5 10 1q7 -7 0 -11q-5 -4 -10 2Z" fill="#faf4da" stroke="#3c3529" stroke-width="2"/>
    <path d="M80 111L70 57H28" fill="none" stroke="currentColor" stroke-width="2"/><text x="28" y="48">Osso</text>
    ${sample?`<g class="edu-reveal"><path d="M103 119H512" stroke="#37352e" stroke-width="2" stroke-dasharray="8 6"/><path d="M501 111l8 8l-8 8l-8 -8Z" fill="#fff" stroke="#36382c" stroke-width="2"/><path d="M502 108l20 -48h69" fill="none" stroke="currentColor" stroke-width="2"/><text x="466" y="49">Campione</text></g>`:''}
  </svg>`;
}

function attachStratigraphy(root) {
  const group = root.querySelector('.edu-controls');
  const steps = [...group.querySelectorAll('button')];
  const output = root.querySelector('.edu-stage');
  const choose = i => {
    steps.forEach((button,j) => button.setAttribute('aria-pressed',String(i === j)));
    output.innerHTML = `${sectionDiagram(i)}<p role="status"><strong>${esc(deposits[i].name)}.</strong> ${esc(deposits[i].text)}</p>`;
  };
  steps.forEach((button,i) => button.addEventListener('click',() => choose(i)));
  choose(0);
}

export function renderMethods(root,C) {
  const methods = C.methods || [];
  const lookup = new Map(methods.map(m=>[m.id,m]));
  const known = new Set(methodFamilies.flatMap(([,ids])=>ids));
  const other = methods.filter(m=>!known.has(m.id)).map(m=>m.id);
  const families = other.length ? [...methodFamilies,['Altri metodi',other]] : methodFamilies;
  const selectors = families.map(([family,ids]) => {
    const items = ids.map(id=>lookup.get(id)).filter(Boolean);
    return items.length ? `<fieldset class="edu-method-family"><legend>${esc(family)}</legend>${items.map(m=>`<button type="button" data-method="${esc(m.id)}" aria-pressed="false" aria-controls="edu-method-detail">${esc(m.title)}</button>`).join('')}</fieldset>` : '';
  }).join('');
  root.innerHTML = `<p class="lead">Una data misura un evento preciso. Un osso, la crosta che lo ricopre e il terreno che lo circonda possono raccontare tre tempi diversi.</p>
    <section class="box edu-simulation"><h2>Due campioni alla stessa profondità</h2><p>Segui la formazione di un deposito in sezione. Il disegno semplifica il problema stratigrafico emerso a Liang Bua. Le forme e le distanze sono illustrative.</p>
    <div class="edu-controls" role="group" aria-label="Fasi della formazione del deposito">${deposits.map((s,i)=>`<button type="button" aria-pressed="false" aria-controls="edu-strata-output">${i+1}. ${esc(s.name)}</button>`).join('')}</div>
    <div class="edu-stage" id="edu-strata-output"></div>${cites(['sutikna'],C.refs)}</section>
    <div class="edu-method-layout"><div><h2>Scegli un metodo</h2>${selectors}</div><section class="box edu-method-detail" id="edu-method-detail" tabindex="-1" aria-label="Metodo selezionato"></section></div>`;
  attachStratigraphy(root);
  const detail = root.querySelector('#edu-method-detail');
  const buttons = [...root.querySelectorAll('[data-method]')];
  const choose = id => {
    const method = lookup.get(id);
    if (!method) {
      detail.textContent = 'I metodi non sono disponibili.';
      return;
    }
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.method===id)));
    detail.innerHTML = `<h2>${esc(method.title)}</h2><p>${esc(method.principle)}</p><h3>Un caso di ricerca</h3><p>${esc(method.example)}</p><h3>Limiti di interpretazione</h3><p>${esc(method.limit)}</p>${cites(method.sources,C.refs)}`;
  };
  buttons.forEach(b=>b.addEventListener('click',()=>{
    choose(b.dataset.method);
    detail.focus();
  }));
  choose(methods[0]?.id);
}

export function renderGenetics(root,C) {
  root.innerHTML = `<div class="prose edu-genetics">${geneticsLesson.map((chapter,index)=>`<section><h2>${esc(chapter.title)}</h2>${levelTag(chapter.level)}${chapter.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${cites(chapter.sources,C.refs)}${index===3?'<p><a href="#scheda/denisova">Leggi la monografia sui Denisoviani</a></p>':''}</section>`).join('')}</div>
    <section aria-label="Flussi genetici documentati"><h2>Esplora gli incontri genetici</h2><p>Seleziona una relazione per osservare quali popolazioni collega e su quale evidenza si fonda.</p><div class="edu-flow"></div></section>`;
  evolution(root.querySelector('.edu-flow'),C,true);
}

// Each branch links an interpretive question to chapters that supply the corresponding evidence.
const branches = {
  sapiens:[['Datare le prime presenze',[0,1,2]],['Ricostruire corpi e pratiche',[3,5,6]],['Seguire parentele e dispersioni',[4,7,8,9]]],
  naledi:[['Ricostruire il deposito e la cronologia',[0,1,2,9]],['Riconoscere e confrontare il corpo',[3,4,5,6,8]],['Interpretare il comportamento',[7]]],
  flores:[['Leggere il paesaggio e i depositi',[0,1,2,8]],['Ricostruire il corpo',[3,4,5]],['Spiegare attività e incontri possibili',[6,7,9]]],
  luzon:[['Datare i luoghi e i loro abitanti',[0,1,4,5]],['Interrogare denti e scheletro',[2,3,7]],['Valutare comportamento e contatti',[6,8,9]]],
  erectus:[['Seguire fiumi e dispersioni',[0,4,6,9]],['Confrontare anatomia e classificazione',[1,2,3,8]],['Interpretare segni e contemporaneità',[5,7]]],
  neanderthal:[['Seguire la storia della popolazione',[0,1,2,8,9]],['Leggere gesti e organizzazione',[3,4,5,6]],['Riconoscere un incontro',[7]]],
  heidelberg:[['Ancorare il nome ai reperti',[0,1,2,3]],['Ricostruire parentele e cronologia',[4,7,8,9]],['Valutare le attività',[5,6]]],
  denisova:[['Identificare i resti',[0,1,2,4,5,6]],['Ricostruire ambienti e attività',[7,8]],['Seguire gli incontri e la persistenza',[3,9,10]]],
  prima:[['Ricostruire un comportamento',[0]],['Definire una popolazione',[1]]],
  comparsa:[['Interpretare la forma',[0]],['Vincolare la cronologia',[1]],['Collegare le popolazioni',[2]]],
  cultura:[['Leggere una superficie modificata',[0]],['Ricostruire la sussistenza',[1]],['Valutare ciò che si conserva',[2]]],
  incontri:[['Distinguere contemporaneità e prossimità',[0]],['Riconoscere la parentela diretta',[1]],['Stimare le generazioni trascorse',[2]]],
  disappearance:[['Verificare le ultime attestazioni',[0,4]],['Valutare ambiente e demografia',[1,2]],['Riconoscere contatti ed eredità',[3,5]]]
};

export function renderConcept(root,C,chapters,route) {
  const parts = String(route || '').replace(/^#/,'').split('/').filter(Boolean);
  const key = parts[parts.length-1] || '';
  const path = parts.map(encodeURIComponent).join('/');
  const data = Array.isArray(chapters) ? chapters : [];
  const article = C.pops?.find(p=>p.id===key) || C.themes?.find?.(t=>t.id===key);
  const groups = branches[key] || (['scomparsa','scomparse'].includes(key) ? branches.disappearance : []);
  const visible = data.map((ch,i)=>({ch,i})).filter(({ch})=>ch && (!C.strict || supported(ch.level)));
  const known = new Set(groups.flatMap(([,items])=>items));
  const remaining = visible.filter(({i})=>!known.has(i)).map(({i})=>i);
  const named = groups.length ? 'Ulteriori capitoli' : 'Argomenti del percorso';
  const all = remaining.length ? [...groups,[named,remaining]] : groups;
  const label = article?.name || article?.title || (['scomparsa','disappearance'].includes(key)?'La scomparsa delle altre umanità':'Percorso di lettura');
  const nodes = all.map(([title,indices])=>{
    const items = indices.map(i=>visible.find(row=>row.i===i)).filter(Boolean);
    if (!items.length) return '';
    return `<li class="edu-branch"><h4>${esc(title)}</h4><ul>${items.map(({ch,i})=>`<li><a href="#${esc(path)}/${i}">${esc(ch.title)}</a></li>`).join('')}</ul></li>`;
  }).join('');
  root.innerHTML = `<nav class="edu-concept" aria-label="Mappa concettuale dei capitoli"><h3>Mappa concettuale</h3>
    ${nodes ? `<div class="edu-map-root">${esc(label)}</div><ul class="edu-branches">${nodes}</ul>` : '<p>Nessun capitolo corrisponde al filtro di attendibilità.</p>'}
    </nav>`;
}
