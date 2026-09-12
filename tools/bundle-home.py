from pathlib import Path
import base64,re
r=Path(__file__).resolve().parents[1]
s=(r/'home-source.html').read_text()
css=(r/'assets/style.css').read_text()
js=(r/'assets/home.js').read_text()
s=re.sub(r'<link rel="preload"[^>]+>','',s)
s=s.replace('<link rel="stylesheet" href="assets/style.css">','<style>'+css+'''\n.directory-view{display:none}.directory-view:target{display:block}body:has(>.directory-view:target)>#home-view{display:none}\n</style>''')
s=s.replace('<script src="assets/home.js" defer></script>','')
s=s.replace('<body>','<body><div id="home-view">')
s=s.replace('href="lezioni.html"','href="#lezioni"').replace('href="strumenti.html"','href="#strumenti"')
# Share the hero bitmap across the base scene and its filtered finger layer.
hero='data:image/webp;base64,'+base64.b64encode((r/'assets/dialogo.webp').read_bytes()).decode()
s=s.replace('<image href="assets/dialogo.webp" width="1402" height="1122"/>','<image id="scene-bitmap" href="'+hero+'" width="1402" height="1122"/>')
s=s.replace('<image class="finger-layer" href="assets/dialogo.webp" width="1402" height="1122" filter="url(#finger-warp)"/>','<use class="finger-layer" href="#scene-bitmap" filter="url(#finger-warp)"/>')
for name in ['lezioni','strumenti','spazi','archivio']:
 data='data:image/webp;base64,'+base64.b64encode((r/f'assets/porta-{name}.webp').read_bytes()).decode()
 s=s.replace('assets/porta-'+name+'.webp',data)
panes=''
for name in ['lezioni','strumenti']:
 body=re.search(r'<body>(.*?)</body>',(r/f'{name}.html').read_text(),re.S)[1]
 body=body.replace('href="index.html#porte"','href="#porte"').replace('href="index.html"','href="#top"')
 body=body.replace('id="contenuto"',f'id="contenuto-{name}"').replace('href="#contenuto"',f'href="#contenuto-{name}"')
 # Legacy strumenti ID would collide with the new page anchor.
 body=body.replace('id="strumenti"','id="strumenti-progetti"')
 panes+=f'<section id="{name}" class="directory-view" aria-label="{name.capitalize()}">{body}</section>'
js=js.replace("didattica:'lezioni.html'","didattica:'#lezioni'").replace("strumenti:'strumenti.html',",'')
route='''\n(() => {const home=document.getElementById('home-view'); const names=['lezioni','strumenti']; function displayPage(){const key=location.hash.slice(1),selected=names.includes(key);home.hidden=selected;names.forEach(n=>{const el=document.getElementById(n);el.style.display=n===key?'block':'none';});if(selected){window.scrollTo(0,0);const h=document.querySelector('#'+key+' h1');h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}else if(['top','porte'].includes(key)){document.getElementById(key).scrollIntoView();}}window.addEventListener('hashchange',displayPage);displayPage();})();'''
# Publish one self-contained entrypoint. No changes to server routing or other projects.
s=s.replace('</body>', '</div>'+panes+'<script>'+js+route+'</script></body>')
(r/'index.html').write_text(s)
print('Self-contained page:',len(s.encode()),'bytes')
