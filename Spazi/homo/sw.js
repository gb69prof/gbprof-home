// Generated from the local publication tree. Its scope is the HOMO directory.
const PREFIX = 'gbprof-homo-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + '9dbe168f74babf85';
const FILES = [
 "app.js",
 "data/debates.json",
 "data/denisova.json",
 "data/disappearance.json",
 "data/erectus.json",
 "data/flores.json",
 "data/genetics-lesson.js",
 "data/heidelberg.json",
 "data/luzon.json",
 "data/methods.json",
 "data/naledi.json",
 "data/neanderthal.json",
 "data/populations.csv",
 "data/populations.json",
 "data/references.json",
 "data/relations.json",
 "data/research-database.json",
 "data/revisions.json",
 "data/sapiens.json",
 "data/themes.json",
 "geo/atlas.css",
 "geo/atlas.js",
 "geo/epochs.json",
 "geo/interpretations.geojson",
 "geo/layers/base.webp",
 "geo/layers/eco-100.png",
 "geo/layers/eco-120.png",
 "geo/layers/eco-150.png",
 "geo/layers/eco-200.png",
 "geo/layers/eco-250.png",
 "geo/layers/eco-30.png",
 "geo/layers/eco-300.png",
 "geo/layers/eco-35.png",
 "geo/layers/eco-350.png",
 "geo/layers/eco-40.png",
 "geo/layers/eco-45.png",
 "geo/layers/eco-50.png",
 "geo/layers/eco-60.png",
 "geo/layers/eco-70.png",
 "geo/layers/eco-80.png",
 "geo/layers/ice-100.png",
 "geo/layers/ice-120.png",
 "geo/layers/ice-150.png",
 "geo/layers/ice-200.png",
 "geo/layers/ice-250.png",
 "geo/layers/ice-30.png",
 "geo/layers/ice-300.png",
 "geo/layers/ice-35.png",
 "geo/layers/ice-350.png",
 "geo/layers/ice-40.png",
 "geo/layers/ice-45.png",
 "geo/layers/ice-50.png",
 "geo/layers/ice-60.png",
 "geo/layers/ice-70.png",
 "geo/layers/ice-80.png",
 "geo/layers/sea-100.png",
 "geo/layers/sea-120.png",
 "geo/layers/sea-150.png",
 "geo/layers/sea-200.png",
 "geo/layers/sea-250.png",
 "geo/layers/sea-30.png",
 "geo/layers/sea-300.png",
 "geo/layers/sea-35.png",
 "geo/layers/sea-350.png",
 "geo/layers/sea-40.png",
 "geo/layers/sea-45.png",
 "geo/layers/sea-50.png",
 "geo/layers/sea-60.png",
 "geo/layers/sea-70.png",
 "geo/layers/sea-80.png",
 "geo/sites.geojson",
 "geo/sites.json",
 "icons/192.png",
 "icons/512.png",
 "icons/apple.png",
 "icons/icon.svg",
 "index.html",
 "lab/education.css",
 "lab/education.js",
 "lab/labs.js",
 "manifest.webmanifest",
 "media/baishiya.webp",
 "media/callao.webp",
 "media/catalog.json",
 "media/chapelle.webp",
 "media/cover.webp",
 "media/crani-singapore.webp",
 "media/denisova-bianfu.webp",
 "media/dmanisi-scavo.webp",
 "media/dossier-produzione.json",
 "media/feldhofer-stampa.webp",
 "media/ferrassie-ambiente.webp",
 "media/flores-ambiente.webp",
 "media/flores-calco.webp",
 "media/flores-volto.webp",
 "media/harbin.webp",
 "media/irhoud-tc.webp",
 "media/irhoud.webp",
 "media/liang-bua.webp",
 "media/luzon-denti.webp",
 "media/mata-menge.webp",
 "media/mauer-cava.webp",
 "media/mauer-rx.webp",
 "media/mauer.webp",
 "media/misure-omeri.json",
 "media/models.json",
 "media/naledi-dh3.webp",
 "media/naledi-mano.webp",
 "media/naledi-piede.webp",
 "media/naledi-scheletri.webp",
 "media/nariokotome-corpo.webp",
 "media/neanderthal-corpo.webp",
 "media/neanderthal-modello.webp",
 "media/ngandong.webp",
 "media/oase-modello.webp",
 "media/omeri-confronto.webp",
 "media/omero-tc.webp",
 "media/rising-ambiente.webp",
 "media/scala-omeri.svg",
 "media/solo-ambiente.webp",
 "media/turkana-modello.webp",
 "media/xiahe.webp",
 "ui/collections.js",
 "ui/common.js",
 "ui/style.css"
];
const URLS = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      for (let i = 0; i < FILES.length; i += 12) {
        await cache.addAll(FILES.slice(i, i + 12).map(file => new Request(new URL(file, self.registration.scope), {cache:'reload'})));
      }
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'activate') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url), scope = new URL(self.registration.scope);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  url.hash = ''; url.search = '';
  if (url.pathname === scope.pathname) url.pathname += 'index.html';
  if (!URLS.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(url.href) || fetch(request);
  })());
});
