import {mostraRepertoItaliano} from '../ricostruzioni/italia.js';
import {esc,it,href,link,door,doorGrid,page,gallery} from './common.js';
import {catalog,detail} from './catalogo.js';
import {sections,article,library,source,locationPage,staticSection} from './letture.js';
const main=document.querySelector('main'),menu=document.querySelector('#menu');
document.querySelector('#menuLinks').innerHTML='<nav class="menulinks">'+sections.map(([r,t])=>door(r,'',t)).join('')+'</nav>';
document.querySelector('#menuOpen').onclick=()=>menu.showModal();
document.querySelector('#closeMenu').onclick=()=>menu.close();
menu.addEventListener('click',e=>{if(e.target.closest('a')||e.target===menu)menu.close()});
document.querySelector('.skip').onclick=e=>{e.preventDefault();main.focus()};
let data,sequence=0,photoIndex=0,cleanup;
const covers=['paglicci.webp','isernia.webp','cavallo.webp'];
function coverInfo(){return data.images.find(im=>im.path==='media/'+covers[photoIndex])}
function switchPhoto(){const im=coverInfo();const hero=main.querySelector('.cover');if(!hero||!im)return;const pic=hero.querySelector('img');pic.src=im.path;pic.alt=im.title+'. '+im.category+' generata con IA.';pic.classList.remove('switchpic');requestAnimationFrame(()=>pic.classList.add('switchpic'));const locator=hero.querySelector('.locator');const slug=covers[photoIndex].replace('.webp','');locator.querySelector('img').src='media/localizza-'+slug+'.svg';locator.href=href('sito',['grotta-paglicci','isernia-la-pineta','grotta-del-cavallo'][photoIndex]);locator.setAttribute('aria-label','Apri il sito · '+im.title);hero.querySelector('[data-caption]').textContent=im.title+' · '+im.period;hero.querySelector('[data-nphoto]').textContent=(photoIndex+1)+' / 3'}
function tile(route,title,sub,path,category,alt){return '<a class="tile" href="'+esc(route)+'"><div class="photo"><img src="'+esc(path)+'" loading="lazy" alt="'+esc(alt)+'"></div><span class="kicker">'+esc(category)+'</span><strong>'+esc(title)+'</strong><small>'+esc(sub)+'</small></a>'}
function home(){
 const s=data.stats,im=coverInfo();const num=(v,t,r)=>'<a href="'+r+'"><strong>'+it(v)+'</strong><span>'+t+'</span></a>';
 main.innerHTML='<section class="cover"><img src="'+im.path+'" fetchpriority="high" alt="'+esc(im.title)+'"><div class="wrap"><span class="kicker">HOMO &nbsp; / &nbsp; Le umanità che ci hanno preceduto</span><h1>Atlante paleoantropologico d’Italia</h1><p class="lead">Oltre un milione di anni di presenza umana nella penisola</p><div class="actions"><a class="btn" href="#mappa">Esplora la mappa <span aria-hidden="true">↗</span></a><a class="btn ghost" href="#catalogo">Consulta il catalogo</a></div></div><a class="locator" href="#sito/grotta-paglicci"><img alt="Localizzazione in Italia" src="media/localizza-paglicci.svg"></a><div class="coverbar"><span><span data-caption></span> · <a href="#immagini">Ricostruzione IA</a></span><button id="nextLandscape" aria-label="Mostra il paesaggio di un’altra epoca">Paesaggio <span data-nphoto></span> →</button></div></section><section class="nums" aria-label="Consistenza del catalogo"><div class="wrap">'+num(s.sites,'siti in catalogo','#catalogo/siti')+num(s.finds,'schede di reperto','#catalogo/reperti')+num(s.regions,'atlanti regionali','#territori')+num(s.publications,'riferimenti in biblioteca','#biblioteca')+'</div></section><div class="wrap"><section class="band"><div class="sectiontop"><div><span class="kicker">Percorsi di esplorazione</span><h2>Dentro i ritrovamenti</h2></div>'+link('lezioni','','Tutte le monografie →','secondarylink')+'</div><div class="tiles">'+tile('#lezione/lez-altamura','Il volto nella roccia','Lo scheletro di Altamura e l’accesso virtuale a un cranio imprigionato nella calcite.','lab/assets/altamura.webp','Altamura · Puglia','Vista documentaria del cranio di Lamalunga')+tile('#lezione/lez-principe','Il Principe delle Arene Candide','Un adolescente, l’ocra e le conchiglie di una sepoltura gravettiana.','lab/assets/arene-candide.webp','Finale Ligure · Liguria','La sepoltura esposta nel museo di Genova')+tile('#puglia','Dal Gargano al Salento','Segui le tracce delle popolazioni che hanno attraversato i paesaggi pugliesi.','media/cavallo.webp','Itinerario regionale','Ipotesi ricostruttiva del riparo uluzziano')+'</div></section><section class="band"><span class="kicker">Tempo profondo</span><h2>Qual è la prima traccia?</h2><p class="intro">A Pirro Nord, nel Gargano, gli strumenti di pietra attestano attività umane. La fauna suggerisce un’età tra 1,3 e 1,7 milioni di anni; le misure fisiche sul deposito si concentrano intorno a 800.000 anni. Il sottotitolo dell’atlante riprende la cronologia più antica proposta. La carta mostra entrambe le letture.</p><div class="pills">'+link('sito','pirro-nord','Il sito di Pirro Nord','pill')+link('tempo','','Confronta gli intervalli','pill')+'</div></section><section class="band"><span class="kicker">Indice delle collezioni</span><h2>Esplora l’atlante</h2>'+doorGrid(sections.map(([r,t,d])=>door(r,'',t,d)))+'</section></div>';switchPhoto();main.querySelector('#nextLandscape').onclick=()=>{photoIndex=(photoIndex+1)%covers.length;switchPhoto()};
}
async function route(move=true){
 const seq=++sequence;if(typeof cleanup==='function')cleanup();cleanup=null;
 let [r='inizio',id='',filter='']=(location.hash.slice(1)||'inizio').split('/').map(decodeURIComponent);
 if(r==='inizio')home();
 else if(r==='catalogo')catalog(main,data,id||'reperti',filter);
 else if(['sito','reperto','individuo'].includes(r)){main.innerHTML=detail(data,r,id);mostraRepertoItaliano(main,data,r,id);}
 else if(r==='lezione'||r==='puglia'){const a=data.articles.find(x=>x.id===(r==='puglia'?'lez-puglia':id));main.innerHTML=article(data,a);if(r==='puglia')main.querySelector('.pagebody').insertAdjacentHTML('afterbegin','<div class="pills" style="margin-bottom:18px">'+link('regione','Puglia','Carta e catalogo della Puglia','pill')+link('lezione','lez-coste','Le coste del Pleistocene','pill')+'</div>')}
 else if(r==='biblioteca')library(main,data);
 else if(r==='fonte')main.innerHTML=source(data,id);
 else if(['mappa','tempo','regione'].includes(r)){
  const regional=r==='regione';
  main.innerHTML=regional?locationPage(data,id):page(r==='mappa'?'Esplora l’Italia':'Linea del tempo',r==='mappa'?'Scegli un punto per leggerne la provenienza, l’attribuzione e la cronologia.':'Allarga o restringi l’intervallo e osserva come cambia la distribuzione delle testimonianze.','Carta e cronologia','<div id="region-map"></div>');
  const {renderGeo}=await import('./geo/geo.js');if(seq!==sequence)return;
  cleanup=await renderGeo(main.querySelector('#region-map'),data,site=>{location.hash=href('sito',site)},r==='tempo'?'time':'map',regional?id:undefined)
 }
 else if(['genetica','metodo','anatomia'].includes(r)){const title=sections.find(s=>s[0]===r)[1];main.innerHTML=page(title,'','Laboratorio','<div id="labhost"></div>');const {renderLab}=await import('./lab/lab.js');if(seq!==sequence)return;cleanup=await renderLab(main.querySelector('#labhost'),r)}
 else main.innerHTML=staticSection(data,r,id)||page('Pagina non trovata','','Atlante d’Italia',link('inizio','','Torna alla copertina'));
 if(seq!==sequence)return;document.title=(r==='inizio'?'Atlante paleoantropologico d’Italia':main.querySelector('h1')?.textContent||'Atlante d’Italia')+' · HOMO';if(move){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true})}
}
function fail(err){console.error(err);main.innerHTML=page('La sezione non si è aperta','Puoi riprovare o consultare il database scaricabile.','Atlante','<button onclick="location.reload()">Riprova</button> <a href="data/catalogo.json">Apri i dati</a>')}
try{const res=await fetch('data/catalogo.json');if(!res.ok)throw Error('Database '+res.status);data=await res.json();await route(false);window.addEventListener('hashchange',()=>route().catch(fail))}catch(e){fail(e)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('../sw.js').catch(()=>{});
