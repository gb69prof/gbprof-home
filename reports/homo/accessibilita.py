"""Campione di pagine e preferenze WCAG. Richiede Playwright e axe-core."""
import json
import sys
from playwright.sync_api import sync_playwright

base,axe=sys.argv[1:]
with sync_playwright() as runtime:
    browser=runtime.chromium.launch()
    page=browser.new_page(viewport={'width':1280,'height':840})
    page.goto(base)
    page.wait_for_selector('.cover h1')
    page.evaluate('navigator.serviceWorker.ready')
    session=page.context.new_cdp_session(page)
    manifest=session.send('Page.getAppManifest')
    assert not manifest.get('errors'),manifest.get('errors')
    install=session.send('Page.getInstallabilityErrors')
    assert not install.get('installabilityErrors'),install
    print('Manifest e installabilità Chromium verificati.')
    failures=[]
    for theme,w,routes in [('light',1280,['inizio','scheda/naledi','atlante','tempo','metodi','evoluzione','fonti','reperto/bianfu','anatomia','taccuino']),('dark',390,['inizio','scheda/flores','atlante','tempo','metodi'])]:
        page.set_viewport_size({'width':w,'height':840})
        page.locator('#settingsBtn').click()
        page.locator('#themeOpt').select_option(theme)
        page.keyboard.press('Escape')
        for key in routes:
            page.goto(base+'#'+key)
            page.wait_for_function("k=>document.body.dataset.route===k",arg=key.split('/')[0])
            if key=='atlante':
                page.locator('[data-slider]').wait_for()
            page.add_script_tag(path=axe)
            result=page.evaluate("""async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.slice(0,5).map(n=>({target:n.target,summary:n.failureSummary}))}))}""")
            if result: failures.append([theme,w,key,result])
    print(json.dumps(failures,ensure_ascii=False,indent=1))
    browser.close()
    if failures:sys.exit(1)
