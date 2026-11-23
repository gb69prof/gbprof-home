import {esc,cites,fmt,supported,levelTag,getJSON,link} from '../ui/common.js';
const choices=(pops,sel)=>pops.map(p=>`<label class="check"><input type="checkbox" name="pop" value="${esc(p.id)}" ${sel.includes(p.id)?'checked':''}> ${esc(p.name)}</label>`).join('');
const chosen=root=>[...root.querySelectorAll('input[name="pop"]:checked')].map(el=>el.value);
const timeEvents=[{t:315,title:'Selci riscaldate a Jebel Irhoud',ref:'richter'},{t:167,title:'Bianfu, inizio della finestra fossilifera 167–134 ka',ref:'rao'},{t:117,title:'Giava, estremo antico del deposito di Ngandong',ref:'rizal'},{t:60,title:'Liang Bua, estremo recente dei resti scheletrici',ref:'sutikna'},{t:50.5,title:'Flusso neanderthaliano condiviso, stima 50,5–43,5 ka',ref:'iasi'},{t:40,title:'Termine approssimativo di numerose sequenze musteriane europee',ref:'higham'},{t:125,title:'Alto livello marino dell’ultimo interglaciale',ref:'spratt'}];
export function timeline(root, C) {
  const pops = C.pops.filter(p => !C.strict || supported(p.level));
  const isBounded = p => Number.isFinite(p.start) && Number.isFinite(p.end);
  const inside = (age, older, younger) => age <= older && age >= younger;
  const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
  const boundsAt = (p, age) => p.bounds.some(([older, younger]) => inside(age, older, younger));
  const names = entries => entries.map(p => esc(p.name)).join(', ') || 'nessuna';
  const compareIntervals = sets => {
    if (sets.length < 2) return 'Seleziona almeno due popolazioni.';
    const bounded = sets.filter(isBounded);
    const older = Math.min(...bounded.map(p => p.start));
    const younger = Math.max(...bounded.map(p => p.end));
    if (bounded.length >= 2 && older < younger) {
      return 'Gli intervalli di riferimento delle popolazioni con due estremi disponibili non si intersecano. Non si può dedurre da questo la data di un’estinzione.';
    }
    if (bounded.length !== sets.length) {
      return 'Durata indeterminabile. Per Callao disponiamo di età minime su reperti, senza una coppia di estremi che definisca la durata della popolazione.';
    }
    const width = older - younger;
    const hasWindow = sets.some(p => p.chronologyKind === 'deposit');
    const hasTaxon = sets.some(p => p.chronologyKind === 'taxonomy');
    let sentence = width === 0
      ? 'Le finestre si toccano a ' + fmt(older) + ' ka. La durata dell’intersezione dei riferimenti è zero.'
      : fmt(width * 1000) + ' anni, da ' + fmt(older) + ' a ' + fmt(younger) + ' ka. È l’ampiezza dell’intersezione dei riferimenti convenzionali su scala mondiale.';
    if (hasWindow) sentence += ' Per naledi si interseca la finestra di datazione della deposizione. Anche un solo episodio è compatibile con essa.';
    if (hasTaxon) sentence += ' Per heidelbergensis il risultato presuppone la classificazione ampia che accomuna Mauer e Kabwe.';
    return sentence + ' Per dimostrare una coabitazione o un incontro occorrono prove geografiche, stratigrafiche o genetiche.';
  };
  function countAt(age) {
    const nominal = [];
    const dating = [];
    const taxonomy = [];
    for (const p of pops) {
      if (!isBounded(p)) continue;
      const inReference = inside(age, p.start, p.end);
      if (p.chronologyKind === 'taxonomy') {
        if (inReference || boundsAt(p, age)) taxonomy.push(p);
      } else if (p.chronologyKind === 'deposit') {
        if (boundsAt(p, age)) dating.push(p);
      } else if (inReference) nominal.push(p);
      else if (boundsAt(p, age)) dating.push(p);
    }
    return {nominal, dating, taxonomy};
  }
  root.innerHTML = `<div class="toolbar"><label>Scala<select id="span"><option value="350">Ultimi 350.000 anni</option><option value="2050">Ultimi 2,05 milioni di anni</option><option value="150">Ultimi 150.000 anni</option><option value="80">Ultimi 80.000 anni</option></select></label><span class="small">ka = migliaia di anni prima del presente.</span></div>
    <section class="box"><fieldset><legend>Popolazioni da confrontare</legend><div class="checks">${choices(pops,['sapiens','neanderthal'])}</div></fieldset><div id="overlap" aria-live="polite"></div></section>
    <div id="timePlot"></div>
    <section class="box" aria-labelledby="countTitle"><h2 id="countTitle">Quante forme potevano essere contemporanee?</h2>
    <p>Il grafico conta le popolazioni del catalogo in ciascuna epoca mondiale. Il conteggio utilizza tutte le voci ammesse dal filtro di attendibilità, indipendentemente dalle caselle del confronto.</p>
    <div id="countChart"></div><label class="field" for="countAge">Esplora l’epoca in migliaia di anni fa
    <input id="countAge" type="range" min="0" max="350" step="1" value="300" dir="rtl"></label><div id="countInfo" aria-live="polite"></div>
    <details class="citations"><summary>Come si legge il conteggio</summary><p>La fascia piena conta gli intervalli che collegano i riferimenti scelti per ciascuna popolazione, assumendo continuità fra i reperti. Per Flores si considera soltanto la serie fossile di Liang Bua. Gli strumenti più recenti e i fossili affini di Mata Menge appartengono a confronti separati.</p>
    <p>Il tratteggio aggiunge le voci compatibili soltanto con una finestra datata o con gli estremi incerti. Comprende naledi nella finestra di Dinaledi e, quando il filtro lo ammette, il caso tassonomico di heidelbergensis. Questa somma descrive le scelte del catalogo. Le lacune dei ritrovamenti e i possibili sinonimi impediscono di trasformarla in un censimento delle specie vissute sulla Terra.</p>
    <p>Callao resta fuori dal totale perché il limite minimo non colloca con certezza il reperto a una particolare data. Gli intervalli di incertezza dipendono dai metodi dei singoli siti e non hanno tutti lo stesso significato statistico.</p></details></section>
    <div id="events"></div>`;
  const spanInput = root.querySelector('#span');
  const ageInput = root.querySelector('#countAge');
  const allEvents = [...timeEvents,
    {t:1995,title:'Drimolen, riferimento centrale per la finestra di DNH 134 (2,04–1,95 Ma)',ref:'drimolen'},
    {t:700,title:'Mata Menge, resti affini a floresiensis',ref:'kaifu'},
    {t:609,title:'Mauer, stima centrale del contesto della mandibola',ref:'mauer'},
    {t:448,title:'Sima de los Huesos, età media modellata del livello LU-6',ref:'simaeta'},
    {t:250,title:'Denisova, inizio approssimativo dei più antichi strati con DNA sedimentario denisoviano',ref:'dencave'}
  ];
  const describeAge = () => {
    const age = Number(ageInput.value);
    const {nominal, dating, taxonomy} = countAt(age);
    const total = nominal.length + dating.length + taxonomy.length;
    const at = age ? fmt(age) + ' ka' : 'Oggi';
    ageInput.setAttribute('aria-valuetext', at);
    root.querySelector('#countInfo').innerHTML = `<h3 style="margin-top:1em">${at} · ${total} ${total === 1 ? 'voce compatibile' : 'voci compatibili'}</h3>
      <p><b>Dentro gli intervalli di riferimento (${nominal.length})</b> · ${names(nominal)}.</p>
      <p><b>Soltanto nella finestra di datazione (${dating.length})</b> · ${names(dating)}.</p>
      ${C.strict?'':`<p><b>Con attribuzione discussa (${taxonomy.length})</b> · ${names(taxonomy)}.</p>`}`;
    const line = root.querySelector('#epochLine');
    if (line) {
      const x = 28 + 684 * (1 - age / Number(spanInput.value));
      line.setAttribute('x1', x); line.setAttribute('x2', x);
    }
  };
  function drawCounts(span) {
    const stops = new Set([0, span]);
    for (const p of pops.filter(isBounded)) {
      for (const t of [p.start, p.end, ...p.bounds.flatMap(b => b.slice(0,2))]) {
        if (t > 0 && t < span) stops.add(t);
      }
    }
    const ticks = [...stops].sort((a,b) => b-a);
    const x = t => 28 + 684 * (1 - t/span);
    const y = n => 120 - n*12;
    const bars = ticks.slice(1).map((young,i) => {
      const old=ticks[i], summary=countAt((old+young)/2), n=summary.nominal.length;
      const optional=summary.dating.length+summary.taxonomy.length, width=x(young)-x(old);
      return `<g><title>${fmt(old)}–${fmt(young)} ka · ${n} intervalli e ${optional} voci aggiuntive</title><rect x="${x(old)}" y="${y(n)}" width="${width}" height="${n*12}" fill="var(--olive)"/><rect x="${x(old)}" y="${y(n+optional)}" width="${width}" height="${optional*12}" fill="url(#chronoHatch)"/></g>`;
    }).join('');
    root.querySelector('#countChart').innerHTML = `<figure><svg viewBox="0 0 740 149" role="img" aria-label="Conteggio nel tempo su scala mondiale. Esplora i valori e i nomi mediante il cursore successivo." style="width:100%;height:auto;color:var(--dim)">
      <defs><pattern id="chronoHatch" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M-1 1L1 -1M0 6L6 0M5 7L7 5" stroke="var(--earth)" stroke-width="2"/></pattern></defs>
      ${[0,2,4,6,8].map(n=>`<text x="20" y="${y(n)+4}" text-anchor="end" fill="currentColor" font-size="13">${n}</text><path d="M28 ${y(n)}H712" stroke="var(--line)" fill="none"/>`).join('')}${bars}
      <line id="epochLine" x1="28" x2="28" y1="15" y2="122" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3" />
      <text x="28" y="143" fill="currentColor" font-size="14">${fmt(span)} ka</text><text x="370" y="143" fill="currentColor" text-anchor="middle" font-size="14">${fmt(span/2)} ka</text><text x="712" y="143" fill="currentColor" text-anchor="end" font-size="14">Oggi</text></svg>
      <figcaption>Pieno, voci entro i riferimenti convenzionali. Tratteggio, ulteriori voci compatibili con datazione o attribuzione.</figcaption></figure>`;
  }
  function render() {
    const span = Number(spanInput.value);
    const ids = chosen(root), sets = pops.filter(p => ids.includes(p.id));
    const x = t => clamp(100 * (1 - t/span), 0, 100);
    root.querySelector('#overlap').innerHTML = `<h3 class="section-gap">Sovrapposizione cronologica</h3><p>${esc(compareIntervals(sets))}</p>`;
    const rows = sets.map(p => {
      const open = p.chronologyKind === 'minimum';
      const markers = p.bounds.filter(b => b[1] <= span).map(([old,young,label]) => {
        const left = Math.min(99.5, x(old)), width = Math.min(100-left, Math.max(.5,x(young)-left));
        return `<span title="${esc(label)}" class="bound" style="left:${left}%;width:${width}%"></span>`;
      }).join('');
      const interval = isBounded(p) && p.chronologyKind !== 'deposit' && p.end <= span
        ? `<i class="interval ${p.chronologyKind==='taxonomy'?'hyp':''}" style="left:${x(p.start)}%;width:${x(p.end)-x(p.start)}%"></i>` : '';
      const minimum = open && p.bounds[0][1] <= span
        ? `<i aria-hidden="true" style="position:absolute;left:${Math.max(0,x(p.bounds[0][0])-2)}%;top:-4px;color:var(--earth)">‹</i>` : '';
      return `<div class="time-row"><a href="#scheda/${esc(p.id)}">${esc(p.name)}</a><div class="track" role="img" aria-label="${esc(p.label)}">${interval}${markers}${minimum}</div><small>${esc(p.label)}</small><p class="small">${esc(p.limits)}</p>${cites(p.refs,C.refs)}</div>`;
    }).join('');
    root.querySelector('#timePlot').innerHTML = `<div class="box"><div class="axis"><b>${fmt(span)} ka</b><b>${fmt(span/2)} ka</b><b>Oggi</b></div>${rows||'<p>Nessuna popolazione selezionata.</p>'}</div><p class="small">Le linee uniscono i riferimenti di confronto. Le fasce tratteggiate rappresentano le finestre datate. La linea discontinua di heidelbergensis dipende dalla classificazione. Per Luzon il segno verso sinistra indica un limite aperto verso il passato.</p>`;
    ageInput.max = span;
    ageInput.value = Math.min(Number(ageInput.value), span);
    drawCounts(span);
    describeAge();
    root.querySelector('#events').innerHTML = '<h2 class="section-gap">Eventi nella finestra</h2><div class="list">'+
      allEvents.filter(e => e.t <= span).sort((a,b) => b.t-a.t).map(e=>`<article><b>${fmt(e.t)} ka</b> · ${esc(e.title)}${cites([e.ref],C.refs)}</article>`).join('') + '</div>';
  }
  ageInput.oninput = describeAge;
  root.onchange = event => { if (event.target !== ageInput) render(); };
  render();
}
export function compare(root,C,anatomy=false){
 const pops=C.pops.filter(p=>!C.strict||supported(p.level));root.innerHTML=`<div class="box"><fieldset><legend>Scegli le popolazioni</legend><div class="checks">${choices(pops,anatomy?['naledi','flores','denisova']:['sapiens','neanderthal'])}</div></fieldset></div><div id="comparison"></div>`;
 const show=()=>{const ss=pops.filter(p=>chosen(root).includes(p.id));const cols=anatomy?[['Esemplare e volume','measure'],['Cranio e faccia','face'],['Mandibola e denti','teeth'],['Scheletro e locomozione','body']]:[['Dove','region'],['Reperti di riferimento','anchors'],['Quando','label'],['Limiti del confronto','limits']];root.querySelector('#comparison').innerHTML=ss.length?`<div class="tab-scroll" tabindex="0" role="region" aria-label="Tabella comparativa scorrevole"><table><thead><tr><th>Carattere</th>${ss.map(p=>`<th scope="col"><a href="#scheda/${p.id}">${esc(p.name)}</a></th>`).join('')}</tr></thead><tbody>${cols.map(([n,k])=>`<tr><th scope="row">${n}</th>${ss.map(p=>`<td>${esc(p[k])}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Pubblicazioni</th>${ss.map(p=>'<td>'+cites(anatomy?p.anatomyRefs:p.refs,C.refs)+'</td>').join('')}</tr></tbody></table></div>${anatomy?`<h2 class="section-gap">Capacità endocranica</h2><p class="lead">Singoli reperti, una scala comune in centimetri cubi.</p><div class="box">${ss.map(p=>`<div class="time-row"><strong>${esc(p.name)}</strong><div class="track" role="img" aria-label="${p.volume?fmt(p.volume)+' centimetri cubi':'valore sconosciuto'}">${p.volume?`<i class="metric" style="width:${p.volume/18}%"></i>`:''}</div><small>${esc(p.measure)}</small></div>`).join('')}<div class="axis"><b>0</b><b>900</b><b>1.800 cm³</b></div></div><p class="small">Una ricostruzione dell’endocranio stima un volume. Forma cerebrale, numero di neuroni e capacità cognitive richiedono dati differenti.</p><h2 class="section-gap">Collezioni tridimensionali</h2><div id="models"></div>`:''}`:'<p>Seleziona almeno una popolazione.</p>';
 if(anatomy&&ss.length){let m=C.models.filter(m=>ss.some(p=>p.id===m.species));root.querySelector('#models').innerHTML=m.map(m=>`<div class="box"><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><button data-model="${esc(m.id)}">Apri il modello 3D</button> ${link(m.url,'Scheda della collezione')}</div>`).join('')||'<p>Per questa selezione il catalogo non include un modello con lettore autorizzato.</p>'}
 };root.onchange=show;show()
}
const paths=[
 ['a','s','M110 170 C210 170 190 53 350 53'],['a','b','M110 170 H195 Q205 170 222 185'],['b','n','M222 185 C275 185 260 145 350 145'],['b','d','M222 185 C280 185 260 235 350 235']
];
export function evolution(root,C,genetic=false){
 const opt=genetic?'':`<label>Modello<select id="treeModel"><option value="dna">Filogenesi molecolare</option>${C.strict?'':'<option value="asia">Ipotesi insulare da erectus</option><option value="basal">Ipotesi di divergenza antica a Flores</option>'}</select></label>`;
 root.innerHTML=`<div class="toolbar">${opt}<label>Relazione in primo piano<select id="rel"><option value="">Ramificazioni</option>${C.relations.map(r=>`<option value="${r.id}">${esc(r.title)}</option>`).join('')}</select></label></div><div id="network"></div>`;
 function draw(){let model=root.querySelector('#treeModel')?.value||'dna',r=C.relations.find(r=>r.id===root.querySelector('#rel').value);
 let svg=`<svg class="flow-diagram" viewBox="0 0 650 320" role="img" aria-label="Divergenze tra sapiens, Neanderthal e Denisoviani. Diagramma topologico senza scala temporale"><title>Storie di popolazioni</title>${paths.map(p=>`<path d="${p[2]}" fill="none" stroke="currentColor" stroke-width="2"/>`).join('')}<circle cx="110" cy="170" r="4" fill="currentColor"/><text x="20" y="199">Antenato</text><text x="20" y="221">comune</text><text x="362" y="58">Homo sapiens</text><text x="362" y="150">Neanderthal</text><text x="362" y="240">Denisoviani</text>${r?`<defs><marker id="tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="var(--earth)"/></marker></defs><path d="${({sn:'M338 145 Q300 117 338 54',ns:'M336 53 Q290 99 336 145',ds:'M343 234 C210 210 220 76 344 54',nd:'M335 145 Q294 191 335 235'})[r.id]}" fill="none" stroke="var(--earth)" stroke-width="4" marker-end="url(#tip)" ${r.id==='nd'?'marker-start="url(#tip)"':''}/>`:''}${model!=='dna'?`<path d="M88 169 Q95 272 212 278 L337 278" fill="none" stroke="var(--earth)" stroke-width="2" stroke-dasharray="6 5"/><text x="100" y="311">${model==='asia'?'H. erectus asiatico':'Ramo antico di Homo'}</text><text x="363" y="284">H. floresiensis</text>`:''}</svg>`;
 root.querySelector('#network').innerHTML=svg+`<p class="small">Linee continue, relazioni di parentela sostenute dai genomi. Collegamento colorato, flusso genetico o, a doppia estremità, parentela dei genitori di Denny. Tratteggio, ipotesi morfologica. Le distanze grafiche non misurano anni.</p><article class="box section-gap"><h2>${esc(r?.title||(model==='dna'?'Una parentela ramificata':model==='asia'?'L’ipotesi del nanismo insulare':'Una dispersione più antica'))}</h2>${levelTag(r?.level||(model==='dna'?'Fortemente supportato':'Controverso'))}<p class="prose">${esc(r?.text||(model==='dna'?'Il DNA nucleare avvicina Neanderthal e Denisoviani tra loro più che a sapiens. A Sima de los Huesos il DNA nucleare è affine a quello neanderthaliano, mentre il mitocondriale segue una storia diversa. Un ramo indica una separazione tra popolazioni ancestrali. Le generazioni successive possono incontrarsi ancora.':model==='asia'?'I fossili minuti di Mata Menge retrodatano il corpo piccolo a Flores. Alcuni caratteri dentari sono compatibili con una derivazione da erectus asiatico e con riduzione corporea sull’isola. La sequenza fossile conserva ampi vuoti.':'Alcune analisi combinano denti, cranio e scheletro in una matrice di caratteri e collocano Flores vicino a forme antiche del genere Homo. La topologia cambia secondo il campione e la ponderazione dei caratteri. Un antenato diretto rimane da identificare.'))}</p>${cites(r?.sources||(model==='dna'?['sima','reich']:['kaifu','argue']),C.refs)}</article>`;
 }root.onchange=draw;draw()
}
