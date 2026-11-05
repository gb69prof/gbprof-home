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

## Aggiornamento — Anteprima della prima tappa di Leopardi (5 novembre 2026)
**Obiettivo:** consentire al docente di vedere su gbprof.it la Lezione 1 e la presentazione con sfondo bianco, senza pubblicare l'intero archivio di 11 dispense.

**Operazioni:** creata `Spazi/laboratorio-letteratura/leopardi/lezione-1/index.html` con testo didattico derivato dalla pagina «Lezione 1» dello Spazio ChatGPT; costruite 7 diapositive HTML/SVG, area testuale bianca e illustrazioni concettuali laterali; aggiunti comandi avanti/indietro, modalità proiezione e navigazione da tastiera; collegata la prima tappa all'indice pubblico `Spazi/laboratorio-letteratura/index.html`.

**Decisioni:** pubblicata soltanto una anteprima didattica esplicitamente etichettata come tale. Non sono stati pubblicati gli 11 documenti sorgenti, i link a Google Drive e allo Spazio ChatGPT, né il PowerPoint binario: il PPTX modificabile rimane nella pagina di lavoro di ChatGPT Spazio. Le slide web ricostruiscono i contenuti e la disposizione testo/immagine, ma non sono una copia pixel-identica del file PowerPoint.

**Verifiche:** GitHub ha confermato entrambi i commit di creazione e collegamento. La verifica HTTP da ambiente esterno non ha dato una risposta utilizzabile; non si dichiara pertanto il deploy al server completato o la pagina raggiungibile finché non verificata sul dominio.
