/* Animated preview: use the original image whenever motion is paused or reduced. */
(() => {
 const hero=document.querySelector('.hero'), img=document.querySelector('.scene-art'), toggle=document.querySelector('.motion-toggle');
 const pref=window.matchMedia('(prefers-reduced-motion: reduce)'); let paused=false, visible=true;
 function sync(){const run=!pref.matches&&!paused&&visible&&!document.hidden; hero.classList.toggle('running',run); hero.classList.toggle('paused',!run); const src=run?img.dataset.animated:img.dataset.still; if(img.getAttribute('src')!==src) img.setAttribute('src',src); toggle.hidden=pref.matches; toggle.setAttribute('aria-pressed',String(paused)); toggle.textContent=paused?'Animazione: in pausa':'Animazione: attiva';}
 toggle.addEventListener('click',()=>{paused=!paused;sync()}); if(pref.addEventListener)pref.addEventListener('change',sync);else pref.addListener(sync); document.addEventListener('visibilitychange',sync); if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:0}).observe(hero);sync();
})();
(() => {
 const routes = {didattica:'lezioni.html',strumenti:'strumenti.html',laboratorio:'#spazi',archivio:'/Conversazioni-con-Libera/'};
 function routeOldLink(){const target=routes[location.hash.slice(1)];if(target) location.replace(target);}
 window.addEventListener('hashchange',routeOldLink);routeOldLink();
})();
