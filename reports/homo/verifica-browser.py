"""Controlla una PWA servita su HTTP(S), inclusi la cache e il ritorno offline."""
import argparse
from urllib.parse import urlsplit
from functools import partial
from threading import Thread
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

def visit(page, base, fragment):
    page.goto(base + '#' + fragment, wait_until='domcontentloaded')
    page.wait_for_function("(r) => document.body.dataset.route === r && !!document.querySelector('main h1')",arg=fragment.split('/')[0])

def run(engine,base,origin=None):
    with sync_playwright() as runtime:
        browser=getattr(runtime,engine).launch()
        context=browser.new_context(viewport={'width':390,'height':844},locale='it-IT')
        page=context.new_page()
        page.set_default_timeout(20000)
        issues=[]
        page.on('pageerror',lambda error:issues.append((page.url,str(error))))
        if base.startswith('https://gbprof.it/'):
            page.goto('https://gbprof.it/#spazi',wait_until='domcontentloaded')
            door=page.locator('#spazi a[href="/Spazi/homo/"]')
            door.click()
            page.wait_for_url(base)
            page.wait_for_selector('.cover h1')
            print(engine, 'accesso dalla sezione pubblica #spazi verificato')
        visit(page,base,'inizio')
        assert page.locator('.cover img').evaluate('(i)=>i.decode().then(()=>i.naturalWidth>0)')
        for route in ['umanita','fonti','immagini','metodi','genetica','anatomia','confronto','evoluzione','scheda/sapiens','scheda/luzon','tempo','atlante']:
            visit(page,base,route)
            if route=='atlante':page.locator('[data-slider]').wait_for()
            assert page.locator('main').evaluate('el=>el.scrollWidth <= document.documentElement.clientWidth+2'),route
        visit(page,base,'scheda/naledi')
        page.locator('[data-action=bookmark]').click()
        visit(page,base,'taccuino')
        assert page.locator('main a[href="#scheda/naledi"]').count()
        visit(page,base,'scheda/denisova')
        page.locator('p[data-pi]').first.evaluate("""p=>{const range=document.createRange();range.selectNodeContents(p);range.setEnd(p.firstChild,20);const s=getSelection();s.removeAllRanges();s.addRange(range)}""")
        page.locator('[data-action=highlight]').click()
        page.locator('textarea').fill('Verifica del taccuino')
        page.locator('#noteForm button').click()
        assert page.locator('main mark').count()==1
        visit(page,base,'tempo')
        page.locator('input[value=luzon]').check()
        assert 'indetermin' in page.locator('#overlap').inner_text().lower()
        visit(page,base,'archivio')
        page.locator('input[name=q]').fill('Bianfu')
        page.locator('a[href="#reperto/bianfu"]').click()
        expect(page.locator('main h1')).to_contain_text('Bianfu')
        visit(page,base,'inizio')
        page.locator('.italia-porta').click()
        page.locator('#nextLandscape').wait_for()
        page.locator('#nextLandscape').click()
        expect(page.locator('[data-caption]')).to_contain_text('Isernia')
        page.get_by_role('link',name='Consulta il catalogo').click()
        page.locator('input[name=q]').fill('guattari')
        page.locator('#crows a').first.click()
        expect(page.locator('.facts')).to_contain_text('Identificativo')
        for route, selector in [('mappa','.leaflet-container'),('regione/Puglia','.leaflet-container'),('anatomia','[data-organ]'),('biblioteca','#bcount')]:
            page.goto(base+'atlante-italia/#'+route, wait_until='domcontentloaded')
            page.locator(selector).first.wait_for()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'),route
        visit(page,base,'inizio')
        page.wait_for_function("navigator.serviceWorker.getRegistration().then(r=>!!r?.active)",timeout=90000)
        page.reload()
        page.wait_for_function('!!navigator.serviceWorker.controller')
        page.wait_for_selector('main .cover h1')
        scope=page.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.scope)')
        assert scope==base,(scope,base)
        page.wait_for_function("caches.keys().then(async keys=>(await (await caches.open(keys.find(k=>k.startsWith('gbprof-homo-')))).keys()).length>120)")
        # Stop the actual local origin for all three engines. This also tests WebKit
        # without Playwright issue 42775, which interrupts SW responses in offline emulation.
        checked_offline = origin is not None or engine != 'webkit'
        if origin is not None:
            expect(page.locator('main .cover h1')).to_have_text('HOMO')
            origin.shutdown()
            origin.server_close()
        elif engine != 'webkit':
            context.set_offline(True)
        else:
            assert page.evaluate('caches.match(new URL("data/luzon.json", location.href)).then(r=>!!r?.ok)')
        page.goto(base+'?verifica-cache=1',wait_until='domcontentloaded')
        page.wait_for_selector('main .cover h1')
        visit(page,base,'scheda/luzon')
        assert page.locator('.chapter').count()>=8
        visit(page,base,'atlante')
        page.locator('[data-slider]').wait_for()
        visit(page,base,'reperto/bianfu')
        assert 'Bianfu' in page.locator('main h1').inner_text()
        page.goto(base+'atlante-italia/',wait_until='domcontentloaded')
        page.locator('#nextLandscape').wait_for()
        page.goto(base+'atlante-italia/#tempo',wait_until='domcontentloaded')
        page.locator('.leaflet-container').wait_for()
        assert not issues,issues
        print(engine,browser.version,base,'lettura, interazione e immagini verificate;', 'avvio da cache con origine indisponibile' if checked_offline else 'cache pubblica verificata; offline provato sulla copia identica del repository')
        browser.close()

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('engine',choices=['chromium','firefox','webkit'])
    parser.add_argument('url')
    args=parser.parse_args()
    if urlsplit(args.url).hostname=='127.0.0.1':
        root=Path(__file__).resolve().parents[2]
        server=ThreadingHTTPServer(('127.0.0.1',urlsplit(args.url).port),partial(SimpleHTTPRequestHandler,directory=str(root)))
        Thread(target=server.serve_forever,daemon=True).start()
        try:
            run(args.engine,args.url,server)
        finally:
            server.shutdown()
            server.server_close()
    else:
        run(args.engine,args.url)
