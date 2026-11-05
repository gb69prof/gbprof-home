# REPORT — Laboratorio di letteratura italiana
Data: 5 novembre 2026

## Obiettivo
Pubblicare su gbprof.it una porta pubblica del Laboratorio di letteratura italiana, mantenendo fuori dalle pagine pubbliche le undici lezioni originali e le bozze di ChatGPT Spazio non ancora approvate.

## Operazioni
- Esaminata la homepage pubblica e la struttura del repository gb69prof/gbprof-home.
- Creato `Spazi/laboratorio-letteratura/index.html`, pagina autonoma, accessibile, responsive e senza dipendenze da sistemi privati.
- Aggiunta la porta al catalogo `lezioni.html`.
- Nessun testo completo da Google Drive o ChatGPT Spazio incorporato nella pagina pubblica.

## Fonti
- Cartella Drive del docente «Lezioni-partiOK» (11 documenti), per la sola definizione del programma.
- Spazio ChatGPT «Laboratorio di letteratura italiana», distinto dal sito pubblico.
- Sorgenti del portale `gbprof-home`: `lezioni.html`, `Spazi/index.html`, workflow di deploy.

## Decisioni
Pubblicazione limitata a presentazione, metodo e programma per autori. Tutte le schede degli autori sono contrassegnate «in revisione» o «in preparazione»; nessun collegamento pubblico alle dispense né a pagine private dello Spazio. Il presente REPORT è conservato in `reports/`, fuori dalla cartella `Spazi/` servita pubblicamente.

## Verifiche e problemi
- GitHub ha confermato la creazione della pagina e l'aggiornamento di `lezioni.html`.
- La pubblicazione sul server dipende dal workflow automatico associato al push su main; verificare in seguito HTTP 200, corretto link dal catalogo e visualizzazione mobile.
- Non sono state effettuate revisione filologica delle 11 lezioni né pubblicazione di contenuti didattici non approvati.
