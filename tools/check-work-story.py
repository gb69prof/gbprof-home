"""Check editorial completeness, static links, semantics and deterministic output."""
from html.parser import HTMLParser
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'Spazi/come-lavoro'
SLUGS = ['', 'la-macchina-che-risponde', 'pensare-attraverso-laltro',
         'dirigere-un-progetto', 'foscolo-un-mondo-da-attraversare',
         'cinque-ambienti', 'anatomia-di-una-conversazione', 'dallidea-alle-mani']

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.blocks, self.tags = [], [], [], []
        self.capture, self.buffer = None, []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for attr in ('href','src'):
            if attr in attrs: self.links.append(attrs[attr])
        if 'source-text' in attrs.get('class','').split():
            self.capture, self.buffer = tag, []
    def handle_data(self, data):
        if self.capture: self.buffer.append(data)
    def handle_endtag(self, tag):
        if self.capture == tag:
            self.blocks.append(''.join(self.buffer))
            self.capture = None

chapters = json.loads((ROOT / 'content/come-lavoro/chapters.json').read_text())
links = 0
for current, (chapter, slug) in enumerate(zip(chapters,SLUGS)):
    path = DEST / slug / 'index.html'
    page = Page(path)
    expected = [s.strip() for s in chapter['text'].splitlines() if s.strip() and set(s.strip()) != {'_'}]
    # The opening title is rendered as the brand heading, with a decorative dot.
    if current == 0: expected = expected[1:]
    assert page.blocks == expected, f'Editorial text differs: {slug}'
    assert len(page.ids) == len(set(page.ids)), f'Duplicate IDs: {slug}'
    assert page.tags.count('h1') == 1 and page.tags.count('main') == 1
    assert not {'form','input','button','script'}.intersection(page.tags)
    for url in page.links:
        if ':' in url: continue
        filename, _, fragment = url.partition('#')
        target = (path.parent / filename).resolve() if filename else path.resolve()
        if target.is_dir(): target /= 'index.html'
        assert target.is_file(), f'Missing target {path}: {url}'
        if fragment: assert fragment in Page(target).ids, f'Missing fragment {path}: {url}'
        links += 1
    print(f'{current+1:02}: {len(expected)} original text blocks preserved')
print(f'PASS: eight complete chapters, {links} local links, unique IDs and static semantic pages.')
