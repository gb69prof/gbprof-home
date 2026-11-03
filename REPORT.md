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

---

## NeuroLab 2.1 - voce e anatomia (4 novembre 2026)

### Obiettivo
Implementare i due miglioramenti richiesti: spiegazione sonora femminile degli esperimenti e rappresentazione umana più realistica.

### Modifiche eseguite
- Aggiunto Spazi/neuro-lab/narration.js con Web Speech API, testo scientifico derivato dalle tappe di ciascun senso, voce italiana selezionabile, preferenza per voci dai nomi femminili identificabili, comandi Ascolta tutto / Fase / Pausa / Ferma, ritmo di lettura e trascrizione completa.
- La guida vocale sincronizza le cinque spiegazioni con l'evidenziazione delle tappe. Non avvia audio senza azione dell'utente.
- Creato Spazi/neuro-lab/anatomy-realistic.svg con testa, rilievi facciali, cervello, coste, polmoni, cuore, muscolatura, vertebre e nervi periferici in vista frontale con volumetria e ombreggiatura.
- Aggiornati Spazi/neuro-lab/index.html, style.css e main.js. Se il nuovo disegno non si carica, rimane il modello precedente.
- Aggiunti al workflow controlli HTTP per entrambi i nuovi asset.

### Fonti e decisioni
- Sintesi vocale: Web Speech API, https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices
- Restano valide le precedenti fonti NCBI Bookshelf per i cinque sensi.
- La voce femminile è preferita automaticamente quando il nome consente di identificarla; il browser non espone un attributo di genere affidabile e la disponibilità varia per dispositivo. In alternativa l'utente può scegliere dal menu una voce italiana. Nessun servizio a pagamento né API esterne.
- L'anatomia resta un'illustrazione didattica vettoriale 2.5D più ricca, non un modello 3D fotorealistico o un atlante clinico.

### Verifiche e limiti
- Sintassi JavaScript di main.js e narration.js: parsing V8 superato.
- ID controlli vocali presenti nell'HTML: verificato.
- GitHub Actions verifica la pubblicazione online dei nuovi asset e dei collegamenti di NeuroLab.
- Non è stato effettuato un test manuale della qualità vocale e dell'aspetto su iPad e altri browser.
- REPORT.md resta nella radice del repository, fuori dalla directory pubblica Spazi.
