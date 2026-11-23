"""Ricostruisce gli strati da tre sorgenti pubbliche. Uso con /usr/bin/python3,
NumPy, GDAL e Pillow: build_atlas.py CARTELLA_CON_I_TRE_DOWNLOAD."""
import csv
import hashlib
import io
import json
from pathlib import Path
import sys

import numpy as np
from osgeo import gdal
from PIL import Image

DATA = Path(sys.argv[1])
OUT = Path(__file__).resolve().parents[1] / "geo"
DATES = [350, 300, 250, 200, 150, 120, 100, 80, 70, 60, 50, 45, 40, 35, 30]
# NOAA, ETOPO5.DAT: signed int16 big-endian, prima cella a 90° N, 0° E.
elev = np.roll(np.fromfile(DATA / 'etopo5.dat', dtype='>i2').reshape(2160, 4320), 2160, axis=1)
# Campionamento ai centri dei pixel da 10', origine -180,90.
# La griglia di partenza ha le misure ai nodi multipli di 5'.
elev = elev[1::2, 1::2].astype(np.float32)
text = (DATA / 'spratt2016-noaa.txt').read_text()
rows = {int(row['age_calkaBP']): row for row in csv.DictReader(io.StringIO(text[text.index('age_calkaBP\tSeaLev_shortPC1'):]), delimiter='\t')}
biomefile = DATA / 'biome.nc'
assert hashlib.md5(biomefile.read_bytes()).hexdigest() == 'bf940ff4e876baff6d108c0ec34f753e'
ds = gdal.Open(str(biomefile))
def palette_image(cells, colors, path):
    pic = Image.fromarray(cells.astype('uint8'), 'P')
    pic.putpalette([n for c in colors for n in c] + [0] * (768 - len(colors) * 3))
    pic.save(path, transparency=0, optimize=True)

# Fondo con rilievo e batimetria attuali; scala cromatica separata per le terre.
slope_y, slope_x = np.gradient(elev)
shade = np.clip((slope_y - slope_x) / 72, -11, 11)
h = np.clip(elev / 4000, 0, 1)
d = np.clip(-elev / 5500, 0, 1)
base = np.stack([np.where(elev >= 0, light + h*(peak-light) + shade, sea + d*(deep-sea)) for light, peak, sea, deep in ((207,151,149,77),(198,136,183,130),(164,108,185,144))], axis=-1)
Image.fromarray(np.clip(base,0,255).astype('uint8'), 'RGB').save(OUT/'layers/base.webp', quality=84, method=6)
colors = [(0,0,0),(66,113,80),(134,149,94),(207,180,102),(228,193,148),(155,168,153),(194,183,165),(239,245,241)]
palette = np.zeros(29,dtype=np.uint8)
palette[1:12] = 1
palette[12:19] = 2
palette[19:21] = 3
palette[21] = 4
palette[22:27] = 5
palette[27] = 6
palette[28] = 7
data = []
for date in DATES:
    row = rows[date]
    level, lower, upper = [float(row[k]) for k in ('SeaLev_shortPC1','SeaLev_shortPC1_err_lo','SeaLev_shortPC1_err_up')]
    data.append(dict(ka=date, sea=level, low=lower, high=upper))
    cells = np.zeros(elev.shape,dtype='uint8')
    cells[(elev<0)&(elev>=level)] = 1
    cells[(elev>=0)&(elev<level)] = 2
    palette_image(cells, [(0,0,0),(228,194,125),(146,181,184)], OUT/f'layers/sea-{date}.png')
    band = ds.GetRasterBand(800-date)
    assert float(band.GetMetadataItem('NETCDF_DIM_time')) == -1000*date
    raw = band.ReadAsArray()
    mapped = palette[np.clip(raw,0,28)]
    palette_image(np.where(mapped == 7,0,mapped), colors, OUT/f'layers/eco-{date}.png')
    palette_image(np.where(mapped == 7,7,0), colors, OUT/f'layers/ice-{date}.png')
(OUT/'epochs.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
