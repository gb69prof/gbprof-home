"""Build the eight unabridged Come lavoro chapters from the supplied texts.

Run from any directory: python3 tools/build-work-story.py
The JSON preserves source text and provenance; no editorial text is summarized.
"""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'Spazi/come-lavoro'
CHAPTERS = json.loads((ROOT / 'content/come-lavoro/chapters.json').read_text())
SLUGS = ['', 'la-macchina-che-risponde', 'pensare-attraverso-laltro',
         'dirigere-un-progetto', 'foscolo-un-mondo-da-attraversare',
         'cinque-ambienti', 'anatomia-di-una-conversazione', 'dallidea-alle-mani']
SHORT = ['Come lavoro', "La macchina che risponde e l'essere umano che domanda",
         "Pensare attraverso l'altro", "L'arte di dirigere un progetto con l'intelligenza artificiale",
         'Foscolo — Un mondo da attraversare', 'Cinque ambienti, cinque problemi da risolvere',
         'Anatomia di una conversazione', "Dall'idea alle mani"]
SUBHEADS = {'L’idea', "L'idea", "Dall'idea alla scena", 'La progettazione tecnica',
    'Che cosa insegna questa scelta?', 'Il problema filosofico', 'La traduzione simbolica',
    'La scelta narrativa', 'Dal concetto alla costruzione', 'Il limite della metafora',
    'La prima intuizione', 'La prima versione del progetto', 'La revisione', 'Lo zaino simbolico',
    'Le difficoltà tecniche', 'Che cosa abbiamo imparato?', 'Il problema',
    "La scelta dell'architettura", "L'interazione più importante", 'Un problema di linguaggio visivo',
    'Il valore didattico', 'Perché il percorso non può finire nel tempio', "L'idea dell'incrocio",
    'Le opere come esperienze differenti', 'Gli strumenti', 'Il ritorno alla domanda iniziale'}

def link(n, current):
    prefix = './' if current == 0 else '../'
    return prefix + (SLUGS[n] + '/' if SLUGS[n] else '')

def contents(current, large=False):
    links = []
    for n, title in enumerate(SHORT):
        active = ' aria-current="page"' if n == current else ''
        # Old incoming fragments now lead to the relevant chapter in the contents.
        old = {1:'conoscere', 2:'metodo', 4:'foscolo', 7:'prova-tu'}
        anchor = f' id="{old[n]}"' if large and n in old else ''
        links.append(f'<li{anchor}><a href="{link(n,current)}"{active}><span class="chapter-no">{n+1:02}</span><span>{escape(title)}</span><span class="index-arrow" aria-hidden="true">↗</span></a></li>')
    return '<ol class="chapter-list">' + ''.join(links) + '</ol>'

for current, chapter in enumerate(CHAPTERS):
    lines = [line.strip() for line in chapter['text'].splitlines() if line.strip() and not set(line.strip()) == {'_'}]
    title = lines.pop(0)
    subtitle = lines.pop(0) if current in (0,2,3,4,5,6,7) else ''
    prefix = './' if current == 0 else '../'
    home = '../../' if current == 0 else '../../../'
    blocks, outline = [], []
    section_count = 0
    for line in lines:
        is_heading = bool(re.match(r'^\d+\. ', line) or line.startswith('Conclusione —') or (current == 0 and line == 'Prima di tutto, una domanda'))
        if is_heading:
            section_count += 1
            ident = f'c{current+1}-s{section_count}'
            outline.append(f'<li><a href="#{ident}">{escape(line)}</a></li>')
            blocks.append(f'<h2 class="source-text" id="{ident}" tabindex="-1">{escape(line)}</h2>')
        elif current == 5 and line in SUBHEADS:
            blocks.append(f'<h3 class="source-text">{escape(line)}</h3>')
        else:
            cls = 'source-text principle' if line.startswith('Principio progettuale:') else 'source-text'
            blocks.append(f'<p class="{cls}">{escape(line)}</p>')
    subtitle_html = f'<p class="chapter-subtitle source-text">{escape(subtitle)}</p>' if subtitle else ''
    portrait = f'''<figure class="story-portrait"><img src="{prefix}assets/come-lavoro-1448.webp" srcset="{prefix}assets/come-lavoro-720.webp 720w, {prefix}assets/come-lavoro-1448.webp 1448w" sizes="(max-width: 760px) calc(100vw - 40px), 52vw" width="1448" height="1086" fetchpriority="high" decoding="async" alt="Gianfranco, gbprof, seduto al tavolo in dialogo con la figura digitale dell’intelligenza artificiale."><figcaption>Gianfranco · gbprof</figcaption></figure>''' if current == 0 else ''
    eyebrow = 'DIETRO LE QUINTE · IL MIO LAVORO CON L’IA' if current == 0 else f'COME LAVORO / CAPITOLO {current+1:02}'
    hero_title = 'Come lavoro<span aria-hidden="true">.</span>' if current == 0 else escape(title)
    title_class = 'source-text' if current else ''
    hero = f'''<header class="story-hero {'story-opening' if current == 0 else 'chapter-hero'}"><div><p class="eyebrow">{eyebrow}</p><h1 class="{title_class}" id="{'work-title' if current==0 else 'chapter-title-'+str(current+1)}">{hero_title}</h1>{subtitle_html}<p class="byline">{'Un racconto in otto capitoli' if current==0 else 'Gianfranco · gbprof'}</p></div>{portrait}</header>'''
    local_index = f'<details class="local-index"><summary>In questo capitolo <span aria-hidden="true">+</span></summary><ol>{"".join(outline)}</ol></details>' if len(outline)>1 else ''
    nav = f'<aside class="story-sidebar"><nav aria-label="Indice dei capitoli"><p class="eyebrow">IL RACCONTO</p>{contents(current)}</nav></aside>'
    mobile_nav = f'<details class="mobile-index"><summary>Indice del racconto <span>{current+1:02} / 08</span></summary><nav aria-label="Indice dei capitoli su mobile">{contents(current)}</nav></details>'
    reading = f'<div class="reading-layout">{nav}<article class="story-prose" aria-label="Testo integrale del capitolo">{local_index}{"".join(blocks)}</article></div>'
    index = f'<section class="story-contents" id="indice"><div><p class="eyebrow">SEGUIRE IL FILO</p><h2>Dentro il mio lavoro.</h2></div><nav aria-label="Tutti gli otto capitoli">{contents(current,True)}</nav></section>' if current==0 else ''
    prev = f'<a class="previous" href="{link(current-1,current)}"><small>← CAPITOLO PRECEDENTE</small><span>{escape(SHORT[current-1])}</span></a>' if current else '<a class="previous" href="#indice"><small>IL PERCORSO</small><span>Sfoglia gli otto capitoli ↓</span></a>'
    nxt = f'<a class="next" href="{link(current+1,current)}"><small>CONTINUA A LEGGERE →</small><span>{escape(SHORT[current+1])}</span></a>' if current<7 else f'<a class="next" href="{link(0,current)}"><small>TORNA ALL’INIZIO →</small><span>Come lavoro.</span></a>'
    page=f'''<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#080e13"><meta name="description" content="{escape(subtitle or title)}"><title>{escape(title)} — gbprof</title><link rel="stylesheet" href="{prefix}racconto.css"></head>
<body class="story-page"><a class="story-skip" href="#contenuto">Vai al contenuto</a><header class="story-masthead wrap"><a class="brand" href="{home}#come-lavoro" aria-label="gbprof, homepage">gbprof</a><a class="back-home" href="{home}#come-lavoro">← Il sito di gbprof</a></header>
<main id="contenuto" class="wrap">{hero}{mobile_nav}{reading}{index}<nav class="chapter-turn" aria-label="Prosegui nel racconto">{prev}{nxt}</nav></main>
<footer class="story-footer wrap"><a class="brand" href="{link(0,current)}">gbprof<span>Come lavoro</span></a><nav aria-label="Informazioni"><a href="{home}privacy.html">Privacy</a><a href="{home}accessibilita.html">Accessibilità</a><a href="#contenuto">Torna in alto ↑</a></nav></footer></body></html>'''
    out = DEST / SLUGS[current] / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page)

# Preserve incoming room URLs, with an ordinary link as a no-redirect fallback.
for old, new in [('conoscere/la-macchina-che-risponde','la-macchina-che-risponde'),('dialogare/pensare-attraverso-laltro','pensare-attraverso-laltro')]:
    dest=DEST / old / 'index.html'
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=../../{new}/"><title>Come lavoro — gbprof</title><link rel="stylesheet" href="../../racconto.css"></head><body class="story-page"><main class="wrap"><h1>Il racconto continua.</h1><p><a href="../../{new}/">Leggi il capitolo di Come lavoro →</a></p></main></body></html>''')
print(f'Built {len(CHAPTERS)} complete chapters and two compatible room URLs.')
