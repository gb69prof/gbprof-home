# REPORT.md — NeuroLab

Data: 3 novembre 2026

## Obiettivo
Simulazione dei cinque sensi collegata alla sezione Spazi di gbprof.it.

## Operazioni
Creati Spazi/neuro-lab/index.html, style.css e main.js con cinque sensi, intensità, impulsi animati, percorsi, stadi di elaborazione e mini-demo acustica. Aggiunto il collegamento in Spazi/index.html. Aggiornato il controllo HTTP nel workflow deploy.yml.

## Fonti
NCBI Bookshelf: NBK553189 (vista), NBK532311 (udito), NBK10982 (olfatto), NBK11018 (gusto), NBK507888 (tatto fine).

## Decisioni
SVG vettoriale animato e non modello 3D in scala; percorsi neuroanatomici semplificati ma distinti. Olfatto senza relay talamico iniziale obbligatorio; udito con bilateralità; intensità visualizzata tramite numero e luminosità degli impulsi senza alterare la velocità di conduzione.

## Verifiche
Parsing JavaScript V8 OK; ID HTML richiesti dal codice presenti. GitHub Actions deploy su f789629e conclusa con successo: HTTP 200 per /Spazi/neuro-lab/, CSS e JS; riferimenti da homepage e Spazi presenti. Test manuali reali su iPad non effettuati.

## Problemi e limiti
Aspetto ispirato al concept, ma grafica SVG, non 3D fotorealistica. Tempi e coordinate del percorso non sono dati neurofisiologici. Le prove automatiche non sostituiscono test di usabilità su dispositivi reali.

## Nota di pubblicazione
Questo report è nella radice del repository per non essere pubblicato tramite il collegamento /Spazi/.

App: https://gbprof.it/Spazi/neuro-lab/
Codice: https://github.com/gb69prof/gbprof-home/tree/main/Spazi/neuro-lab
