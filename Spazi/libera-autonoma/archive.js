/* Manifesto con SOLI prodotti autonomi già pubblicati. Nessuna lettura da Drive privato. */
'use strict';
(async () => {
  const list = document.getElementById('archive-list');
  if (!list) return;
  const clear = () => { while (list.firstChild) list.removeChild(list.firstChild); };
  const show = (message) => {
    clear();
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = message;
    list.appendChild(p);
    list.setAttribute('aria-busy', 'false');
  };
  try {
    const response = await fetch('manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('manifest');
    const data = await response.json();
    if (!data || !Array.isArray(data.opere)) throw new Error('schema');
    const opere = data.opere.filter(item =>
      item && typeof item.titolo === 'string' && typeof item.data === 'string' &&
      typeof item.file === 'string' && /^opere\/[a-z0-9-]+\.html$/.test(item.file)
    ).sort((a, b) => b.data.localeCompare(a.data));
    if (!opere.length) {
      show('Nessuna produzione autonoma ancora pubblicata.');
      return;
    }
    clear();
    for (const item of opere) {
      const link = document.createElement('a');
      link.className = 'work'; link.href = item.file;
      const meta = document.createElement('div');
      meta.className = 'work-meta';
      const date = document.createElement('time');
      date.dateTime = item.data;
      date.textContent = /^\d{4}-\d{2}-\d{2}$/.test(item.data) ?
        new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(item.data + 'T12:00:00Z')) : item.data;
      meta.appendChild(date);
      if (item.genere) {
        const genre = document.createElement('span');
        genre.textContent = String(item.genere).slice(0,80);
        meta.appendChild(genre);
      }
      const h = document.createElement('h2'); h.textContent = item.titolo;
      const p = document.createElement('p'); p.textContent = item.sintesi || '';
      const more = document.createElement('span'); more.className = 'work-arrow'; more.textContent = 'LEGGI →';
      link.append(meta, h, p, more);
      list.appendChild(link);
    }
    list.setAttribute('aria-busy','false');
  } catch (err) {
    show('L’archivio non è temporaneamente disponibile.');
  }
})();