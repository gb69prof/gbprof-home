import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {strict as assert} from 'node:assert';
import {fileURLToPath} from 'node:url';

const root=path.resolve(process.argv[2]||'Spazi/homo');
const out=path.resolve(process.argv[3]||'risultati');
await fs.mkdir(out,{recursive:true});
const blocked=new Set(), errors=[], httpCalls=[];
const ext={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.webmanifest':'application/manifest+json','.wasm':'application/wasm','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.geojson':'application/geo+json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  const resource=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  httpCalls.push(resource);
  if(!resource.startsWith('/Spazi/homo/')){res.writeHead(404).end();return;}
  let dest=path.resolve(root,'.'+resource.substring('/Spazi/homo'.length));
  if(!dest.startsWith(root+path.sep)&&dest!==root){res.writeHead(403).end();return;}
  if(blocked.has(path.basename(dest))){res.writeHead(503).end('Test di errore controllato');return;}
  try {
    if((await fs.stat(dest)).isDirectory())dest=path.join(dest,'index.html');
    const bytes=await fs.readFile(dest);
    res.writeHead(200,{'Content-Type':ext[path.extname(dest)]||'application/octet-stream','Cache-Control':'no-cache'}).end(bytes);
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port+'/Spazi/homo/';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{}),
  args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--no-sandbox','--disable-dev-shm-usage']});
const report={browser:browser.version(),server:'HTTP locale ordinario (127.0.0.1), service worker attivo, Chromium reale headless',
  data:new Date().toISOString(),commit:process.env.CANDIDATE_SHA||'',prove:[]};
async function record(test,fn){
  try{const result=await fn();report.prove.push({prova:test,esito:'superata',dettaglio:result});console.log('OK',test,JSON.stringify(result));}
  catch(e){report.prove.push({prova:test,esito:'non superata',dettaglio:String(e).slice(0,1600)});console.log('KO',test,String(e));}
  await fs.writeFile(path.join(out,'http-browser.json'),JSON.stringify(report,null,2));
}
const desktop=await browser.newContext({viewport:{width:1365,height:920},locale:'it-IT'});
const page=await desktop.newPage();page.setDefaultTimeout(16000);
page.on('pageerror',e=>errors.push(String(e)));
async function go(p,slug){
  await p.goto(base+'#scheda/'+slug+'/ricostruzione',{waitUntil:'domcontentloaded'});
  const ex=p.locator('paleo-visita[specie="'+slug+'"]');
  await ex.locator('.viste button').first().waitFor();
  await ex.scrollIntoViewIfNeeded();
  return ex;
}
async function snapshot(p,root,title){
  await root.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await p.waitForTimeout(160);
  await p.screenshot({path:path.join(out,title+'.jpg'),type:'jpeg',quality:80});
}
async function open3d(p,ex,index,file){
  await ex.locator('.viste button').nth(index).click();
  await ex.locator('.avvia').click();
  await p.waitForFunction(f=>{const m=document.querySelector('paleo-visita model-viewer');return m?.loaded&&m.src.toLowerCase().includes(f.toLowerCase());},file,{timeout:26000});
  const m=ex.locator('model-viewer');
  const dimensions=await m.evaluate(n=>{const v=n.getDimensions();return [v.x,v.y,v.z]});
  assert(dimensions.every(v=>v>0));return {file,dimensioni:dimensions,animazioni:await m.evaluate(n=>n.availableAnimations)};
}
async function chapterLesedi(ex){
  const selector=ex.locator('select').first();
  if(await selector.count()){
    const option=await selector.locator('option').evaluateAll(nn=>nn.find(v=>/Lesedi|Neo|LES1/i.test(v.textContent))?.value);
    if(option){await selector.selectOption(option);return;}
  }
  const b=ex.getByRole('button',{name:/Lesedi|Neo\b|LES1/i}).first();
  if(await b.count())await b.click();
  else throw Error('Impossibile selezionare LES1 nella monografia naledi');
}
try {
  await record('Ingressi alle tre fasi di LF1',async()=>{
    const ex=await go(page,'neanderthal');const labels=await ex.locator('.viste button').allTextContents();
    assert.equal(labels.length,3);await snapshot(page,ex,'01-desktop-scheda');return labels;
  });
  for(const [i,file,name] of [[0,'RepertoLF1.glb','02-desktop-cranio'],[1,'VoltoLF1.glb','03-desktop-volto'],[2,'FiguraLF1.glb','04-desktop-incontro']]){
    await record('LF1 '+file+', osservazione e interazione',async()=>{
      const ex=await go(page,'neanderthal');const info=await open3d(page,ex,i,file);
      await ex.locator('.punti button').first().click();info.osservazione=await ex.locator('.nota').innerText();assert(info.osservazione.length>12);
      if(i===0){
        const m=ex.locator('model-viewer');const theta=await m.evaluate(n=>n.getCameraOrbit().theta);
        await ex.getByRole('button',{name:'Ruota a destra'}).click();const dopo=await m.evaluate(n=>n.getCameraOrbit().theta);assert(Math.abs(dopo-theta)>.05);
      }
      if(i===2){await ex.getByRole('button',{name:/Pausa/}).click();assert(await ex.locator('model-viewer').evaluate(n=>n.paused));info.pausa=true;}
      await snapshot(page,ex,name);return info;
    });
  }
  for(const [slug,i,file,name] of [['denisova',1,'BustoHarbin.glb','05-desktop-Harbin'],['flores',2,'FiguraLB1.glb','06-desktop-Flores'],['naledi',0,'CranioLES1.glb','07-desktop-LES1']]){
    await record(file+' caricato e renderizzato',async()=>{
      const ex=await go(page,slug);if(slug==='naledi')await chapterLesedi(ex);
      const info=await open3d(page,ex,i,file);await snapshot(page,ex,name);return info;
    });
  }
  await record('Scheda italiana di Guattari e confronto con il fossile francese',async()=>{
    await page.goto(base+'atlante-italia/#sito/grotta-guattari');
    const section=page.locator('section.paleo').first();const a=section.locator('a[href*=neanderthal]');
    await a.waitFor();const href=await a.getAttribute('href');await snapshot(page,section,'08-confronto-Italia');
    await a.click();await page.waitForSelector('paleo-visita[specie=neanderthal] .viste button');return href;
  });
  await record('Visita offline dopo il primo caricamento, incluso modello 3D',async()=>{
    const ex=await go(page,'neanderthal');await open3d(page,ex,0,'RepertoLF1.glb');
    await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:60000});
    const key=await page.evaluate(async()=>{const c=await caches.keys();for(const key of c){const cache=await caches.open(key);if(await cache.match(new URL('ricostruzioni/modelli/RepertoLF1.glb',location.href)))return key;}return '';});assert(key,'GLB non registrato nella cache offline');
    await desktop.setOffline(true);
    try{
      await page.reload({waitUntil:'domcontentloaded'});await ex.locator('.viste button').first().waitFor();
      const info=await open3d(page,ex,0,'RepertoLF1.glb');assert.equal(await page.evaluate(()=>navigator.onLine),false);
      await snapshot(page,ex,'09-offline');return {cache:key,offline:true,...info};
    }finally{await desktop.setOffline(false);}
  });
  await record('Fallback su mancato trasferimento del GLB',async()=>{
    const separate=await browser.newContext({serviceWorkers:'block',viewport:{width:1365,height:920}});const p=await separate.newPage();
    try{
      const ex=await go(p,'neanderthal');blocked.add('VoltoLF1.glb');await ex.locator('.viste button').nth(1).click();
      await ex.locator('.avvia').click();await ex.locator('.stato').filter({hasText:/non è disponibile|tavola statica|non disponibile/}).waitFor();
      assert(await ex.locator('.vetrina img').evaluate(im=>im.complete&&im.naturalWidth>0));await snapshot(p,ex,'10-fallback');
      return await ex.locator('.stato').innerText();
    }finally{blocked.delete('VoltoLF1.glb');await separate.close();}
  });
  await record('Smartphone emulato e gesto touch per la rotazione',async()=>{
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'it-IT'});
    const p=await ctx.newPage();p.setDefaultTimeout(16000);
    try{
      const ex=await go(p,'neanderthal');const result=await open3d(p,ex,0,'RepertoLF1.glb');
      await snapshot(p,ex,'11-mobile-cranio');const m=ex.locator('model-viewer');const info=await p.evaluate(()=>({viewport:innerWidth,contenuto:document.documentElement.scrollWidth,touch:navigator.maxTouchPoints}));
      assert(info.touch>0&&info.viewport===390&&info.contenuto<=391,JSON.stringify(info));const dim=await m.boundingBox();const x=dim.x+dim.width*.54,y=dim.y+dim.height*.45;
      const theta=await m.evaluate(n=>n.getCameraOrbit().theta);const cd=await ctx.newCDPSession(p);
      for(const [type,dx] of [['touchStart',0],['touchMove',-16],['touchMove',-38],['touchMove',-65],['touchEnd',-65]]){
        await cd.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:x+dx,y,force:.7,id:1}]});await p.waitForTimeout(100);
      }
      const after=await m.evaluate(n=>n.getCameraOrbit().theta);assert(Math.abs(after-theta)>.005,[after,theta].join('/'));return {...result,...info,angoloPrima:theta,angoloDopo:after};
    }finally{await ctx.close();}
  });
}finally{
  report.erroriRuntime=errors;report.richiesteHTTP=httpCalls.length;
  await fs.writeFile(path.join(out,'http-browser.json'),JSON.stringify(report,null,2));
  await browser.close();server.close();
}
if(report.prove.some(t=>t.esito!=='superata'))process.exitCode=1;
