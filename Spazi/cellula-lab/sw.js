/* Cache soltanto di questo laboratorio; supporta le richieste audio parziali di Safari. */
const CACHE='cellula-lab-2-live-v1';
const CORE=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./vendor/three.module.min.js','./vendor/three.core.min.js','./voce/testi.json',...['protein-0','protein-1','protein-2','protein-2-bloccata','protein-3','protein-4','protein-5','energy','osmosis','photo','mitosis-0','mitosis-1','mitosis-2','mitosis-3','mitosis-4','mitosis-5','stress'].map(x=>`./voce/${x}.mp3`)];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cellula-lab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function partial(request,response){
 const data=await response.arrayBuffer();const range=/^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range')||'');
 if(!range||(!range[1]&&!range[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.byteLength}`}});
 let start=range[1]?Number(range[1]):Math.max(0,data.byteLength-Number(range[2]));
 let end=range[1]&&range[2]?Math.min(Number(range[2]),data.byteLength-1):data.byteLength-1;
 if(start>end||start>=data.byteLength)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.byteLength}`}});
 const headers=new Headers(response.headers);headers.set('Content-Range',`bytes ${start}-${end}/${data.byteLength}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');headers.delete('Content-Encoding');
 return new Response(data.slice(start,end+1),{status:206,statusText:'Partial Content',headers});
}
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request.url);
  if(cached)return request.headers.has('range')?partial(request,cached):cached;
  const response=await fetch(request);
  if(response.status===200&&!request.headers.has('range'))await cache.put(request,response.clone());
  return response;
 })());
});
