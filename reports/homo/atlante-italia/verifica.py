"""Verifica l'integrità dell'edizione nazionale e la corrispondenza con l'export CSV."""
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parents[3]
atlas = root / 'Spazi/homo/atlante-italia'
db = json.loads((atlas / 'data/catalogo.json').read_text())
tables = {}
for name in ['species','sites','finds','individuals','assemblages','contexts','datingResults','attributions','regions','museums','articles','images','models','sources']:
    rows = db[name]
    ids = [row['id'] for row in rows]
    assert len(ids) == len(set(ids)), f'ID duplicati in {name}'
    tables[name] = set(ids)
def references(value):
    if isinstance(value, list):
        for item in value:
            references(item)
    elif isinstance(value, dict):
        for key, item in value.items():
            if key == 'refs':
                assert set(item) <= tables['sources'], (key, set(item) - tables['sources'])
            if key == 'paragraphRefs':
                assert all(set(row) <= tables['sources'] for row in item)
            references(item)
references(db)
assert len(db['regions']) == 20
assert sum(a['kicker']=='Monografia' for a in db['articles']) >= 17
region_names = {r['name'] for r in db['regions']}
assert all(r.get('history') and r.get('landscape') and r.get('refs') for r in db['regions'])
for s in db['sites']:
    assert s['region'] in region_names and s['taxon'] in tables['species']
    assert 35.4 < s['lat'] < 47.3 and 6.3 < s['lon'] < 19 and s['precision'] and s['refs'], s['id']
for f in db['finds']:
    assert f['site'] in tables['sites'] and f['contextId'] in tables['contexts'] and f['refs'], f['id']
    assert f['nature'] in ('elemento','lotto','scheletro'), f['id']
    if f.get('older') is not None and f.get('younger') is not None:
        assert f['older'] >= f['younger'], f['id']
for p in db['individuals']+db['assemblages']:
    assert p['site'] in tables['sites'] and set(p['finds']) <= tables['finds'], p['id']
for m in db['museums']:
    assert set(m['finds'])<=tables['finds']
for im in db['images']:
    assert (atlas / im['path']).is_file() and im['category'] and im['url']
    assert im.get('generated') or im.get('license'), im['id']
assert all(s.get('title') and s.get('authors') and s.get('url') for s in db['sources'])
for m in db['models']:
    if m.get('mesh') and not m['mesh'].startswith('https://'):
        assert (atlas/'lab'/m['mesh']).is_file(), m['id']
    assert m['source'] in tables['sources'] and m['url'].startswith('https://')
ss = {s['id']:s for s in db['sites']}
eligible = [f for f in db['finds'] if not f.get('excluded') and ss[f['site']]['kind']!='escluso']
with (atlas/'data/reperti.csv').open(encoding='utf-8-sig') as f:
    csv_ids = [x['id'] for x in csv.DictReader(f)]
assert csv_ids == [f['id'] for f in eligible]
assert len(eligible) == db['stats']['finds']
assert len(db['excludedFinds'])>=3 and not set(x['id'] for x in db['excludedFinds']) & set(csv_ids)
sw=(root/'Spazi/homo/sw.js').read_text()
assert '"atlante-italia/index.html"' in sw and "url.pathname.endsWith('/')" in sw
assert 'REPORT.md' not in sw and not list(atlas.rglob('REPORT.md'))
print('Relazioni, coordinate, licenze, CSV, classificazione e cache verificati.')
print(json.dumps(db['stats'], ensure_ascii=False))
