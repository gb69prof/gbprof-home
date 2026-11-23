#!/usr/bin/env python3
"""Collaudo su URL realmente servito. --fixture usa una risposta locale per file e disattiva i service worker."""
import argparse
import json
import mimetypes
import os
import shutil
from pathlib import Path
from urllib.parse import unquote,urlsplit

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]/'HOMO'
SCREENS={'desktop':(1440,900),'tablet':(1024,768),'telefono':(390,844)}
SECTIONS=['inizio','prima','comparsa','umanita','atlante','tempo','evoluzione','anatomia','cultura','genetica','incontri','scomparsa','archivio','confronto','dibattiti','storia','glossario','fonti','metodi','immagini','ricerca','taccuino']
BOOKS=['sapiens','naledi','erectus','heidelberg','neanderthal','denisova','flores','luzon']

def serve_file(route):
    url=urlsplit(route.request.url)
    if url.hostname!='homo.test' or not url.path.startswith('/Spazi/homo/'):
        route.abort()
        return
    rel=unquote(url.path[len('/Spazi/homo/'):]) or 'index.html'
    f=(ROOT/rel).resolve()
    if not f.is_relative_to(ROOT.resolve()) or not f.is_file():
        route.fulfill(status=404,body='Missing asset')
        return
    mime=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
    route.fulfill(status=200,content_type=mime,body=f.read_bytes())

def check(value,msg):
    if not value:
        raise AssertionError(msg)

def route(page,url,key):
    page.goto(url.split('#')[0]+'#'+key,wait_until='domcontentloaded')
    page.wait_for_function('(r)=>document.body.dataset.route === r && document.querySelector("main h1")',arg=key.split('/')[0])
    if key.startswith('scheda/'):
        page.wait_for_function('(path)=>document.querySelector("#routeContent")?.dataset.article===path',arg='/'.join(key.split('/')[:2]))
    if key=='atlante':page.locator('[data-slider]').wait_for()
    else:page.wait_for_function('!document.querySelector("#routeContent") || !!document.querySelector("#routeContent").firstElementChild')

def title(page):
    return page.locator('main h1').first.inner_text()

def test_size(page,url,name):
    data={'schermo':name,'sezioni':{},'prove':[],'errori':[]}
    failures=[]
    page.on('pageerror',lambda error:failures.append(str(error)))
    page.on('response',lambda response: failures.append(f'{response.status} {response.url}') if response.status>=400 and response.url.startswith(url.split('#')[0]) else None)
    def run(label,fn):
        try:
            fn()
            data['prove'].append(label)
        except Exception as e:
            data['errori'].append(label+': '+str(e))
    for section in SECTIONS+['scheda/'+sp for sp in BOOKS]:
        def inspect(k=section):
            route(page,url,k)
            data['sezioni'][k]=title(page)
            check('non è presente nell’indice' not in page.locator('main').inner_text(),'route non implementata')
            check(page.locator('main').evaluate('(m)=>m.scrollWidth<=document.documentElement.clientWidth+2'),'overflow orizzontale pagina')
            check(not page.locator('main img:not([alt])').count(),'immagini senza alternativa testuale')
            if k.startswith('scheda/'):
                check(page.locator('.chapter').count()>=8,'capitoli incompleti')
                check(page.locator('.chapter .citations').count()==page.locator('.chapter').count(),'fonti di capitolo assenti')
        run(section,inspect)
    def menu():
        route(page,url,'inizio')
        page.locator('#indexBtn').focus()
        page.keyboard.press('Enter')
        dialog=page.locator('#panel')
        check(dialog.is_visible(),'indice non aperto con Invio')
        check(dialog.locator('.index-list a').count()==len(SECTIONS),'voci mancanti nell’indice')
        page.keyboard.press('Escape')
        check(not dialog.is_visible(),'dialog non chiuso con ESC')
        check(page.evaluate("document.activeElement.id==='indexBtn'"),'focus non ripristinato')
    run('Tastiera, indice e ritorno del focus',menu)
    def atlas():
        route(page,url,'atlante')
        page.locator('[data-region]').select_option(label='Africa')
        page.locator('[data-period]').select_option('all')
        page.locator('[data-species]').select_option('sapiens')
        check(page.locator('[data-item="irhoud"]').count()==1,'sito filtrato assente')
        page.locator('[data-layer="eco"]').check()
        slider=page.locator('[data-slider]')
        slider.focus();page.keyboard.press('End')
        check('30.000' in page.locator('[data-epoch]').inner_text(),'epoca errata')
        vb=page.locator('.pa-map').get_attribute('viewBox')
        page.locator('[data-pan="in"]').click()
        check(vb!=page.locator('.pa-map').get_attribute('viewBox'),'zoom invariato')
        page.locator('[data-pan="reset"]').click()
        page.locator('[data-item="irhoud"] summary').click()
        page.locator('[data-item="irhoud"] a').click()
        page.wait_for_function("document.body.dataset.route==='reperto'")
        check('Irhoud' in title(page),'reperto non aperto')
    run('Atlante, filtri, epoca, zoom e scheda',atlas)
    def timeline():
        route(page,url,'tempo'); controls=page.locator('input[name=pop]')
        controls.evaluate_all("(els)=>els.forEach(el=>{if(el.checked!==['sapiens','naledi'].includes(el.value))el.click()})")
        check('79.000' in page.locator('#overlap').inner_text(),'stima di intersezione sapiens/naledi diversa da 79000')
        page.locator('input[value=luzon]').check()
        check('indeterminabile' in page.locator('#overlap').inner_text(),'limite minimo trasformato in durata')
        page.locator('#span').select_option('2000');check('2.000' in page.locator('#timePlot').inner_text(),'scala non modificata')
    run('Cronologia e limite aperto di Callao',timeline)
    def comparative():
        route(page,url,'confronto')
        page.locator('input[value=naledi]').check()
        check('Homo naledi' in page.locator('#comparison table').inner_text(),'tabella non aggiornata')
        route(page,url,'evoluzione')
        page.locator('#treeModel').select_option('basal')
        check('H. floresiensis' in page.locator('#network').inner_text(),'ipotesi non resa')
        page.locator('#rel').select_option('nd')
        check('Denny' in page.locator('#network').inner_text(),'relazione genetica assente')
    run('Confronto, rete e scelta di modello',comparative)
    def archives():
        route(page,url,'archivio')
        page.locator('input[name=q]').fill('Callao')
        check(page.locator('[data-results] article').count()==1,'filtri archivio')
        for fmt in ('json','csv'):
            with page.expect_download() as item: page.locator('[data-export='+fmt+']').click()
            download=item.value
            contents=Path(download.path()).read_text(encoding='utf-8-sig')
            check('callao' in contents.lower(),'export non corrisponde al filtro')
        route(page,url,'fonti')
        page.locator('input[name=q]').fill('10.1038/nature22336')
        check(page.locator('[data-results] .source').count()==1,'bibliografia DOI')
        for fmt in ('bib','ris'):
            with page.expect_download() as item:page.locator('[data-format='+fmt+']').click()
            check('10.1038/nature22336' in Path(item.value.path()).read_text(),'riferimento assente da export')
    run('Ricerca ed esportazioni JSON/CSV/RIS/BibTeX',archives)
    def stored():
        route(page,url,'scheda/naledi')
        page.locator('[data-action=bookmark]').click()
        route(page,url,'taccuino');check(page.locator('main a[href="#scheda/naledi"]').count()>0,'segnalibro non salvato')
        page.reload();page.wait_for_selector('main a[href="#scheda/naledi"]')
        route(page,url,'immagini')
        thumb=page.locator('[data-image]').first;thumb.click()
        img=page.locator('#fullImage')
        img.wait_for()
        check(img.evaluate('(i)=>i.complete&&i.naturalWidth>0'),'immagine non decodificata')
        page.locator('dialog [data-action=zoom]').click()
        check('zoomed' in img.get_attribute('class'),'zoom immagine non applicato')
        page.keyboard.press('Escape')
    run('Segnalibro persistente e ingrandimento immagini',stored)
    def preferences():
        route(page,url,'scheda/naledi');initial=page.locator('.chapter').count()
        page.locator('#settingsBtn').click();page.locator('#strictOpt').check()
        check(page.locator('.chapter').count()<initial,'nessun effetto filtro rigoroso')
        check(set(page.locator('.chapter>.level').all_text_contents())<=set(['Documentato','Fortemente supportato']),'livelli deboli visibili')
        page.locator('#themeOpt').select_option('dark')
        check(page.evaluate("document.documentElement.dataset.theme==='dark'"),'tema non cambiato dopo filtro')
        page.locator('#strictOpt').uncheck()
        check(page.locator('.chapter').count()==initial,'filtro non ripristinato')
        page.locator('#readerOpt').check()
        check(page.locator('body.reader').count()==1,'modalità lettura')
        page.locator('#readerOpt').uncheck()
        page.keyboard.press('Escape')
    run('Preferenze ripetute e classificazione dei capitoli',preferences)
    data['errori_runtime']=failures
    return data

def offline(page,base,context):
    page.goto(base);page.evaluate('navigator.serviceWorker.ready.then(x=>x.scope)')
    page.reload();page.wait_for_function('!!navigator.serviceWorker.controller')
    scope=page.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.scope)')
    context.set_offline(True)
    try:
        page.reload(wait_until='domcontentloaded')
        for key in ['scheda/sapiens','scheda/luzon','archivio','tempo','atlante']:
            route(page,base,key)
        return {'ambito':scope,'offline':'OK'}
    finally:
        context.set_offline(False)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--url')
    p.add_argument('--fixture',action='store_true')
    p.add_argument('--screens',default='desktop,tablet,telefono')
    args=p.parse_args()
    if not args.fixture and not args.url: p.error('Indicare un URL di collaudo o --fixture')
    base=args.url or 'https://homo.test/Spazi/homo/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM') or shutil.which('chromium'),headless=True)
        results={'url':base,'browser':browser.version,'origine':'fixture locale via intercettazione' if args.fixture else 'HTTP','risultati':[]}
        for screen in args.screens.split(','):
            w,h=SCREENS[screen]
            context=browser.new_context(viewport={'width':w,'height':h}, locale='it-IT',accept_downloads=True,service_workers='block' if args.fixture else 'allow')
            if args.fixture:context.route('**/*',serve_file)
            page=context.new_page();page.set_default_timeout(4000)
            results['risultati'].append(test_size(page,base,screen))
            if screen=='desktop' and not args.fixture:
                try: results['service_worker']=offline(page,base,context)
                except Exception as e: results['service_worker']={'errore':str(e)}
            context.close()
        browser.close()
    print(json.dumps(results,indent=2,ensure_ascii=False))
    return int(any(r['errori'] or r['errori_runtime'] for r in results['risultati']) or bool(results.get('service_worker',{}).get('errore')))

if __name__=='__main__':
    raise SystemExit(main())
