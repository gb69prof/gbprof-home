"""Rigenera conteggi, CSV e manifest della cache dopo un aggiornamento dei dati scientifici."""
import csv
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

here = Path(__file__).resolve().parent
root = here.parents[2]
pwa = root / 'Spazi/homo'
data = pwa / 'atlante-italia/data'
db = json.loads((data/'catalogo.json').read_text())
sites = {s['id']: s for s in db['sites']}
eligible = [f for f in db['finds'] if not f.get('excluded') and sites[f['site']]['kind'] != 'escluso']
units = Counter(f['nature'] for f in eligible)
studies = {'Studio primario','Studio scientifico','Revisione','Rassegna scientifica','Catalogo scientifico','Tesi di ricerca','Tesi di dottorato (abstract pubblico)','Relazione archeologica','Studio primario e supplemento','Supplemento scientifico'}
db['stats'].update(
    sites=len(sites), bodySites=sum(s['kind']=='corporeo' for s in sites.values()),
    finds=len(eligible), elements=units['elemento'], skeletons=units['scheletro'], lots=units['lotto'],
    individuals=len(db['individuals']), regions=len(db['regions']), publications=len(db['sources']),
    consulted=sum(s['type']!='Bibliografia del catalogo' for s in db['sources']),
    scientific=sum(s['type'] in studies for s in db['sources']),
    photographs=sum(i['category'].lower().startswith('fotografia') for i in db['images']),
    generated=sum(bool(i.get('generated')) for i in db['images']), articles=len(db['articles']))
(data/'catalogo.json').write_text(json.dumps(db, ensure_ascii=False, separators=(',',':'))+'\n')
fields = ['id','site','name','anatomy','nature','taxon','older','younger','scale','method','certainty','notes','refs']
with (data/'reperti.csv').open('w', newline='', encoding='utf-8-sig') as out:
    writer = csv.DictWriter(out, fields, extrasaction='ignore')
    writer.writeheader()
    for f in eligible:
        writer.writerow(dict(f, refs='|'.join(f['refs'])))
subprocess.run([sys.executable,str(here.parent/'build-edition.py'),str(pwa)],check=True)
subprocess.run([sys.executable,str(here/'verifica.py')],check=True)
