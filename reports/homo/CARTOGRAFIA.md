# Fonti cartografiche e trasformazioni

Revisione del 23 novembre 2026. I dati nell’atlante sono locali. I collegamenti alle pubblicazioni richiedono una connessione.

| Risorsa | Elaborazione e provenienza |
|---|---|
| Fondo in rilievo | NOAA/National Geophysical Data Center, ETOPO5. Griglia originale a 5 minuti d’arco, campionata ai centri di pixel di 10 minuti. L’ombreggiatura accentua il rilievo terrestre. [Distribuzione NOAA](https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/) |
| Mare | R. M. Spratt e L. E. Lisiecki, *A Late Pleistocene sea level stack*, 2016. Estrazione delle 15 righe temporali richieste dalla serie breve 0–430 ka. Si conserva il valore centrale e l’intervallo al 95%. Le mappe colorano le celle che attraversano lo zero batimetrico alla quota media stimata. [Dati NOAA](https://doi.org/10.25921/rd66-5820) · [Articolo](https://doi.org/10.5194/cp-12-1079-2016) |
| Biomi e calotte | M. Krapp et al., *A statistics-based reconstruction of high-resolution global terrestrial climate for the last 800,000 years*, 2021. Distribuzione pastclim di M. Leonardi e A. Manica, file Krapp2021_biome_v1.2.2.nc, CC BY 4.0. Riclassificazione editoriale delle uscite BIOME4, senza interpolazione spaziale dei valori. Gruppi 1–11 foreste, 12–18 savane e boscaglie, 19–20 praterie, 21 deserto, 22–26 tundre, 27 spoglio, 28 ghiaccio. [Studio](https://doi.org/10.1038/s41597-021-01009-3) · [Dati Zenodo](https://zenodo.org/records/8415273) · [Licenza](https://creativecommons.org/licenses/by/4.0/) |
| Itinerari di Sahul | Assi schematici originali disegnati tra le regioni indicate da Kealy, Louys e O’Connor (2018). Le linee illustrano due ipotesi geografiche, con vertici deliberatamente arrotondati. [Articolo](https://doi.org/10.1016/j.jhevol.2018.10.003) |
| Altri simboli | Le 24 schede di reperti/località indicano caso per caso le fonti, l’incertezza cronologica e la precisione della provenienza. Il simbolo di contatto identifica il luogo del ritrovamento di un individuo con ascendenza mista. Il simbolo di sovrapposizione regionale riassume lo studio europeo di Higham et al. (2014). Il simbolo in Nuova Guinea indica la provenienza geografica di popolazioni con ascendenza denisoviana, senza assegnare un areale archeologico. |

## Riproducibilità

Lo script build_atlas.py utilizza NumPy, GDAL e Pillow. Richiede nella cartella passata come argomento tre file di origine.

- etopo5.dat corrisponde a [ETOPO5.DAT, NOAA](https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/ETOPO5.DAT).
- spratt2016-noaa.txt è il [file tabulare NOAA](https://www.ncei.noaa.gov/pub/data/paleo/contributions_by_author/spratt2016/spratt2016-noaa.txt).
- biome.nc corrisponde a Krapp2021_biome_v1.2.2.nc [distribuito su Zenodo](https://zenodo.org/api/records/8415273/files/Krapp2021_biome_v1.2.2.nc/content). Il codice verifica il checksum MD5 pubblicato e controlla, per ogni banda estratta, l’anno indicato nei metadati.

Il fondo e i suoi strati usano la stessa proiezione cilindrica equidistante. La linea costiera è un modello eustatico semplificato che trascura gli spostamenti tettonici e isostatici. L’aggregazione dei biomi riduce il dettaglio locale. La posizione dei punti è in WGS84, ordine longitudine–latitudine. Le finestre aperte e le possibili cronologie disgiunte sono esplicite in sites.json. Per ciascun reperto si registra l’istituto depositario quando documentato, altrimenti si identifica come tale l’istituzione del progetto.
