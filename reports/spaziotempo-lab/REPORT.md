# REPORT.md — autonomia verificabile

**Obiettivo (9 novembre 2026).** Creare un esperimento 3D narrato sullo spaziotempo di Einstein, integrabile nella sezione Spazi di gbprof.it.

**Operazioni.** Ispezione del sito e del repository; produzione di interfaccia, controlli, geometrie e animazioni in Three.js; guida vocale italiana e verifica finale; inserimento di una scheda nella sezione Spazi.

**Fonti.** Appunti universitari sulla relatività generale e sulle onde gravitazionali, elencati nel README del progetto.

**Decisioni.** Minkowski è presentato come una soluzione nel vuoto, non l'unica. La griglia non è una sostanza. L'onda attraversa una regione senza materia locale ma trasporta energia gravitazionale. Nessuna API a consumo.

**Verifiche eseguite.** Sintassi `node --check` OK; parsing HTML OK; test Chromium con renderer 3D sostituito esplicitamente da un mock: navigazione nei quattro modi, polarizzazione, testo, quiz OK; nessun errore JavaScript negli eventi testati.

**Limiti.** Animazioni 3D con la libreria reale del sito e sintesi vocale su Safari/iPad non ancora verificate end-to-end. Visualizzazioni didattiche qualitative.

**Pubblicazione.** Non collegare e non esporre questo report sul sito.
