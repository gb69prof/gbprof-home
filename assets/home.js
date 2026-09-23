/* The scene runs only while visible, with a three-second interval per cycle.
   No tracking, remote scripts, fonts, cookies or persistent storage. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const svg = document.querySelector('.scene-art');
  const finger = document.querySelector('#finger-motion');
  const toggle = document.querySelector('.motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = false;
  let visible = true;
  let started = false;
  function sync() {
    const reduced = preference.matches;
    const running = !reduced && !pausedByUser && visible && !document.hidden;
    toggle.hidden = reduced;
    toggle.setAttribute('aria-pressed', String(pausedByUser));
    toggle.textContent = pausedByUser ? 'Animazione: in pausa' : 'Animazione: attiva';
    if (reduced) {
      hero.classList.remove('running', 'paused');
      if (started && typeof finger.endElement === 'function') finger.endElement();
      started = false;
      return;
    }
    if (running && !started) {
      hero.classList.add('running');
      if (typeof finger.beginElement === 'function') finger.beginElement();
      started = true;
    }
    hero.classList.toggle('paused', !running);
    if (typeof svg.pauseAnimations === 'function') {
      if (running) svg.unpauseAnimations(); else svg.pauseAnimations();
    }
  }
  toggle.addEventListener('click', () => { pausedByUser = !pausedByUser; sync(); });
  if (preference.addEventListener) preference.addEventListener('change', sync);
  else preference.addListener(sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, {threshold:0}).observe(hero);
  }
  sync();
})();

(() => {
 const routes = {didattica:'lezioni.html',strumenti:'strumenti.html',laboratorio:'#spazi',archivio:'/Conversazioni-con-Libera/'};
 function routeOldLink(){const target=routes[location.hash.slice(1)];if(target) location.replace(target);}
 window.addEventListener('hashchange',routeOldLink);routeOldLink();
})();
