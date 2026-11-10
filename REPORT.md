# REPORT.md — NeuroLab 3.0

Data: 4 novembre 2026 (Europe/Rome).

## Autonomia verificabile — revisione dell’interfaccia

**Obiettivo:** rifare il laboratorio esistente sulla base dell’immagine allegata, privilegiando realismo della figura e composizione dei pannelli. Pubblicazione autorizzata direttamente nella richiesta.

**Operazioni:** riscritti `Spazi/neuro-lab/index.html`, `style.css` e il motore di `main.js`; aggiornato `narration.js`; creati tre asset WebP locali in `Spazi/neuro-lab/assets/`; aggiornati soltanto i controlli NeuroLab del workflow di distribuzione. Nessuna modifica a home, altri progetti o configurazioni del server.

**Risultato visivo:** volto, testa, collo e torace realistici; cervello semitrasparente; fiore, piuma, diapason e limone; segnali e regioni cerebrali disegnati e animati separatamente; pannelli blu/ciano/viola, sequenza inferiore cliccabile e cinque schede illustrate. Tutti i controlli precedenti conservati, quelli secondari raccolti in «Controlli avanzati».

**Decisioni scientifiche:** vista fino alla corteccia occipitale; udito attraverso tronco, talamo e aree temporali; olfatto attraverso bulbo e corteccia piriforme senza primo relay talamico obbligatorio; gusto attraverso nervi cranici, nucleo solitario, talamo e insula/opercolo; tatto fine attraverso midollo, bulbo, talamo e S1. Il nuovo stimolo tattile è sulla spalla, visibile nel ritratto: testi e percorso sono stati adattati. Intensità e velocità di animazione restano indipendenti. A intensità zero spariscono risposta e attività evidenziata.

**Verifiche prima della pubblicazione:**
- Parsing Node di entrambi i JavaScript, `git diff --check`, unicità ID, corrispondenza controlli/JS e presenza degli asset: superati.
- Browser Chromium: selezione di tutti i cinque sensi, cinque fasi cliccabili, percorsi distinti, olfatto senza talamo iniziale, intensità 0 e 100, tre interruttori e filtri del percorso: superati.
- Ciclo animato: avvio, pausa, ripresa, completamento a 100%. Corretto il calcolo del tempo affinché l’animazione non rallenti artificialmente quando il browser produce pochi fotogrammi.
- Responsive: anteprima desktop 1363 px e viewport iframe 1024, 820 e 390 px; nessuno scorrimento orizzontale del documento. Tablet fisico/Safari non provati.
- Nessun errore applicativo osservato nella console (esclusi messaggi dell’estensione dell’ambiente di prova).
- Guida vocale: prova con eventi di sintesi simulati per selezione di Elsa italiana, tutte le fasi, pausa/ripresa, stop, ascolto singola fase e annullamento al cambio di senso/controlli. Il browser di prova non dispone di voci italiane: verificato il messaggio di indisponibilità; timbro e resa acustica non validati.

**Fonti:** progetto originale al commit `1308956d2e6facdffff5b3da89d860eb33da1225`; immagine dell’utente `immagine(20261103-234025).png`; OpenStax, [Anatomy and Physiology, 14.2 Central Processing](https://openstax.org/books/anatomy-and-physiology/pages/14-2-central-processing), oltre alle fonti NCBI già documentate sotto.

**Limiti:** ritratto raster realistico con livelli SVG e controlli interattivi, non un modello 3D ruotabile. Anatomia e posizioni sono illustrative: strutture profonde proiettate lateralmente, incroci e diramazioni semplificati. Narrazione tramite Web Speech API, preferenza femminile italiana; richiede una voce disponibile nel dispositivo e non usa una registrazione incorporata.

**Pubblicazione completata e verificata:** https://gbprof.it/Spazi/neuro-lab/ . Commit del codice: `edb6e3687dd52bd1a2dbccae5e9030b0b6322890`. [Deploy to gbprof server — riuscito](https://github.com/gb69prof/gbprof-home/actions/runs/41743981763). HTML, CSS, due JavaScript e tre immagini restituiscono HTTP 200 e hanno SHA-256 identico ai file locali validati. Nel browser pubblico verificati anche cambio Vista/Olfatto, bulbo olfattivo e selezione della fase corticale.

**Report escluso dal sito:** conservato alla radice sorgente. Il workflow verifica HTTP 404 per `/REPORT.md` e `/Spazi/neuro-lab/REPORT.md`; le sole modifiche a questo report non avviano il deploy sul server. Nessun cambiamento delle configurazioni globali di pubblicazione.

### Asset e generazione
Generazione tramite strumento immagini integrato, con riferimento visivo dell’utente per il ritratto; conversione WebP senza ritocco del contenuto o perdita della trasparenza degli stimoli.

- `assets/anatomy-portrait.webp`: ritratto maschile fotorealistico di profilo verso sinistra, cervello blu-lavanda semitrasparente, nervi di collo e torace, laboratorio blu scuro; nessun testo o percorso incorporato. Segnali, didascalie e regioni sono aggiunti dal codice.
- `assets/stimuli.webp`: griglia trasparente 2×2 con giglio rosa, diapason, piuma e limone; selezione delle celle tramite CSS.
- `assets/neural-details.webp`: griglia 2×2 di illustrazioni di fotorecettori, fascio nervoso, talamo e corteccia; uso decorativo nei pannelli della vista. Per gli altri recettori si usano icone specifiche del senso; nell’olfatto il pannello non mostra il talamo.

---

## Cronologia precedente (conservata)

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


## NeuroLab — integrazione del quaderno della vista (4 novembre 2026)

**Obiettivo:** integrare nella simulazione le tre tappe illustrate: percorso della vista, confronto tra specie, riflessione sui limiti della rappresentazione della realtà.

**Operazioni:** aggiunti `lezione-vista/index.html`, `lezione.css` e tre immagini WebP; inserito un collegamento nel laboratorio esistente. Le immagini allegate sono utilizzate come illustrazioni, accompagnate da testo HTML accessibile e da limiti espliciti. Il confronto animale non è una simulazione calibrata.

**Fonti:** OpenStax (vie visive), Neitz e colleghi (cane), studio sul punto neutro nel gatto PubMed 27720709, Communications Biology sull’ottica degli occhi composti, Fenk e colleghi sui movimenti della retina in Drosophila. La questione filosofica è lasciata aperta; l’immagine della cucina luminosa è dichiarata metafora.

**Verifiche:** ID e risorse locali, navigazione e collegamento dalla simulazione controllati in anteprima. Pubblicazione completata con [deploy riuscito](https://github.com/gb69prof/gbprof-home/actions/runs/41788972661); pagina online, navigazione tra le tappe e caricamento di tutte le immagini verificati nel browser. Nessuna prova su iPad fisico.

**Indirizzo:** https://gbprof.it/Spazi/neuro-lab/lezione-vista/ . Il report rimane nella radice del repository, escluso dal sito pubblico.


## Collegamento rapido alla lezione della vista

Aggiunto un collegamento visibile in alto nel laboratorio verso `lezione-vista/`. Confermati i collegamenti di ritorno dalla lezione. I collegamenti preesistenti restano disponibili. Verifica pubblica da effettuare dopo la distribuzione.


## Psicologia — percorso in undici lezioni (4 novembre 2026)

**Obiettivo:** aggiungere una porta per la Psicologia negli Spazi e un percorso derivato dagli undici capitoli Drive indicati da gbprof.

**Modifiche:** aggiornata `Spazi/index.html`; creata `Spazi/psicologia/index.html` con 11 lezioni, domande, snodi storici, limiti, schemi testuali, riflessioni e autoverifiche. Il progresso si conserva nel browser. Report alla radice, fuori dalla directory pubblica `Spazi`.

**Revisione:** distinti Wundt/Titchener e condizionamento classico/operante; segnalata l’etica di Little Albert; Freud trattato come teoria storica; Maslow come modello, non legge; svolta cognitiva presentata come graduale; chiariti BOLD e limiti inferenziali; evitati determinismo situazionale e culturale; contestualizzati i campioni WEIRD.

**Fonti:** Università di Lipsia (1879/1883); APA (psicologia empirica, Little Albert, etica); Mandler (cognitivismo); Henrich, Heine e Norenzayan (campioni WEIRD); Kenrick e colleghi (gerarchia dei bisogni). Link nella pagina.

**Verifica:** commit su `main` avvia il workflow di distribuzione esistente; la pagina e la porta saranno verificate dopo il deploy. Il report resta fuori dal sito pubblico.


## Psicologia — ampliamento delle lezioni (4 novembre 2026)

**Correzione del primo rilascio:** la prima versione conteneva undici schede sintetiche e non raggiungeva la profondità didattica richiesta. È stata ampliata mantenendo i materiali Drive 01–11 come base e conservando porta, navigazione, autoverifiche e progressi.

**Revisione:** per ciascuna tappa ora sono sviluppati contesto e problema, cambiamento teorico o metodologico, immagine della mente, contributi e limiti; si aggiungono conclusione, parole e saperi essenziali. Restano le domande, le mappe, gli spunti e i quiz. Le precisazioni storiche e metodologiche già registrate sopra restano integrate.

**Verifica richiesta:** controllare la nuova versione online e la porta in `/#spazi` dopo il deploy. REPORT.md resta fuori dalla directory pubblica.


## Prova animazione home — 5 novembre 2026

**Obiettivo:** provare la GIF approvata per la prima immagine della home, conservando l'originale.
**Operazioni:** sostituzione reversibile della scena con animazione WebP ricavata dalla GIF; originale conservato come fallback per pausa e riduzione movimento. Sorgente e bundler aggiornati; nessuna modifica diretta al server.
**Fonti:** immagine originale assets/dialogo.webp e prova gbprof_libera_prova.gif.
**Limiti:** movimento a fotogrammi con scatti; progetto preparato in ramo separato. Il deploy automatico esegue reset --hard sul server: verificare preventivamente che non cancelli modifiche locali.


**Esito pubblicazione, 5 novembre 2026:** il deploy ha salvato la precedente modifica locale a `index.html` in uno stash Git e ha aggiornato la cartella del progetto generando la pagina animata. Il controllo successivo della home pubblica è fallito; nel browser la home continua a mostrare la scena precedente. La pubblicazione effettiva nella root del sito non è verificata. Immagine originale conservata in `assets/dialogo.webp`.


**Completamento 5 novembre 2026:** animazione pubblicata nella home; il contenuto HTTP e il file generato sul server hanno SHA-256 `49f7fa9f786f5867f2b10a52c75098fdbe2f1abe9271f07ebe498c0e33e0c565`. La precedente verifica visualizzava una copia in cache. Originale conservato e vecchi index salvati in stash. Verificata la scena nel browser con URL aggiornato; `object-fit:contain` mantiene l'immagine completa. Il workflow riporta ancora errore in un controllo successivo alla pubblicazione; l'insieme delle ulteriori verifiche automatiche non è completo. iPad fisico non verificato.


## Home — ripristino codici in movimento (5 novembre 2026)
Ripristinati sopra la scena animata parole, codici e segnali luminosi della versione precedente, con pausa e preferenza per movimento ridotto. La bitmap originale rimane conservata. Le verifiche pubbliche seguono il deploy.


## 2026-11-10 — Libera autonoma: archivio pubblico

**Obiettivo.** Aprire dalla porta «Archivio» di gbprof.it un secondo ingresso indipendente dalle «Conversazioni con Libera», dedicato soltanto ai lavori prodotti nelle sessioni autonome di Libera e aggiornato automaticamente alla loro effettiva produzione.

**Operazioni.**
- Verificato il repository corretto `gb69prof/gbprof-home` e il collegamento pubblico già esistente di `/Spazi/`.
- Creata `Spazi/archivio/index.html`: due accessi, Conversazioni con Libera e Libera autonoma.
- Creata `Spazi/libera-autonoma/`: `index.html`, `style.css`, `archive.js`, `manifest.json`, inizialmente senza opere.
- Modificato `home-source.html` per indirizzare la quarta porta a `/Spazi/archivio/`.
- Mantenuta invariata la pubblicazione delle conversazioni preesistenti.
- Inserite in `.github/workflows/deploy.yml` verifiche HTTP per homepage, pagine, JS, CSS, manifest e blocco del report.
- Aggiornata l'automazione attiva «Libera — laboratorio autonomo», con pubblicazione consentita esclusivamente dei nuovi lavori scelti e prodotti nelle sessioni autonome, da copiare in `Spazi/libera-autonoma/opere/` e aggiungere a `manifest.json`. Google Drive conserva i report, il diario e la memoria; non sono pubblicati.

**Verifica.** Workflow di deploy `42890847739`, avviato dal commit `e2773bde48bec1755f4afa78f12e89fd1203f40f`, completato con esito `success`; log del job: «Libera autonoma: porte e risorse pubbliche verificate». Sono stati controllati HTTP 200 per `/Spazi/archivio/`, `/Spazi/libera-autonoma/`, `style.css`, `archive.js`, `manifest.json`; homepage con nuovo link e `REPORT.md` della cartella pubblica non accessibile (404).

**Decisioni.** Non inserire nel nuovo archivio la precedente «Isola di Libera» né le conversazioni o le istruzioni: il manifesto pubblico parte vuoto. Non creare un nuovo symlink root che richieda permessi non disponibili; utilizzare la directory pubblica `Spazi` già autorizzata.

**Limiti e prossimi controlli.** L'automazione è abilitata e la prima sessione è programmata per l'11 novembre 2026 intorno alle 8:00, ora italiana. **Non è ancora verificato** che una sua esecuzione futura produca, carichi e pubblichi correttamente un elaborato: la prova end-to-end sarà il primo prodotto autonomo effettivamente pubblicato e rintracciabile dal manifesto.
