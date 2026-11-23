# Collaudo di HOMO

**Edizione del 23 novembre 2026.** L’oggetto delle prove è la PWA italiana preparata per il percorso `/Spazi/homo/`. Le prove di anteprima sono descritte nella tabella. I controlli successivi alla pubblicazione sono registrati in fondo alla pagina.

## Prove eseguite

| Area | Come è stata provata | Esito |
| --- | --- | --- |
| Struttura del corpus | Controllo Python con sola libreria standard su file reali, identità, campi, collegamenti alle fonti, formati di immagini, 15 epoche e 45 strati ambientali. | 1.930 controlli, zero errori nel passaggio finale. Le otto monografie contano da 2.531 a 3.045 parole ciascuna. La monografia sulle scomparse ne conta 1.562. |
| Navigazione | Chrome su anteprima HTTP. Apertura di tutte le 22 voci dell’indice e delle otto schede, controllo dell’intestazione, delle immagini con testo alternativo e dell’assenza di eccedenze di pagina. | Tutti i 30 percorsi aperti. I collegamenti delle monografie mostrano capitoli con fonti e appartenenza al giusto articolo. |
| Responsive | Tre viewport indipendenti di Chrome in iframe, a 1.440 × 900, 1.024 × 768 e 390 × 844 pixel, nella stessa copia sotto un percorso isolato. | 118 verifiche per viewport, 354 complessive. Zero errori nell’ultimo passaggio. La prima prova ha rilevato in mobile due menu a discesa troppo larghi, in Fonti e Galleria. Correzione verificata su copia con cache nuova. |
| Copertina | Ispezione visiva della pagina reale in desktop, tablet e telefono. | Titolo, sottotitolo, due accessi e pulsante crediti distinguibili sul fondo scuro. A 390 pixel la composizione si concentra sul volto centrale. Il titolo rimane intero, con i due pulsanti affiancati e i crediti sotto. La striscia dei collegamenti scorre separatamente. |
| Confronti e mappe | Confronto cronologico sapiens/naledi, aggiunta di Luzon, cambio del modello evolutivo, parentela di Denny, tabella anatomica, regione e popolazione in atlante, conteggio e zoom. | L’intersezione convenzionale restituisce 79 mila anni. Con il minimo aperto di Callao la durata risulta indeterminabile. Funzionano aggiornamento delle viste, zoom della carta e selezioni. |
| Ricerca ed esportazioni | Ricerca globale di Bianfu, ricerca di Callao nell’archivio, filtro del DOI di Irhoud in biblioteca. Richiesti effettivamente quattro download. | Cinque risultati per Bianfu nella copia provata, un reperto filtrato per Callao e una citazione per il DOI. Il browser ha avviato i download JSON, CSV, RIS e BibTeX. |
| Lettura, evidenziatore e taccuino | Selezionato un passo di 18 caratteri, aggiunta un’annotazione temporanea, creazione di segnalibro, ricarica completa, controllo del taccuino e rimozione delle sole voci create per la prova. | Nota e segnalibro presenti dopo il ricaricamento in tutti i tre formati. |
| Preferenze e tastiera | Attivato il filtro rigoroso in una monografia con capitoli controversi, cambiato il tema nello stesso dialogo, ripristinato il filtro e alternata la lettura senza distrazioni. Chiuso l’indice con Escape. | I capitoli esclusi ricompaiono alla disattivazione. In modalità rigorosa i capitoli visibili espongono solo i due livelli ammessi. Escape richiude l’indice e restituisce il focus al pulsante di apertura. |
| Ingrandimento immagini | Apertura di un’immagine del catalogo e attivazione dello zoom. | Si carica e decodifica la risorsa locale e cambia lo stato di zoom. |
| Manifest | Controllo dei percorsi locali di inizio e ambito, modalità standalone e risorse delle icone 192 e 512 pixel. | Risorse presenti e riferimenti relativi. |
| Avvio senza origine disponibile | Eseguita l’installazione del vero service worker in Chrome su una copia di prova con ambito `/qa-offline/Spazi/homo/`. Poi la relativa directory è stata rimossa dal server di anteprima, lasciando intatti il sito principale e la memoria del browser. Da una nuova finestra incorporata, ricaricata l’app e richieste tutte le risorse precaricate con ricarica della cache HTTP. | Il service worker attivo controllava la nuova pagina. Sono stati letti 125 asset, pari a 8.053.320 byte. Funzionavano i percorsi per naledi, luzonensis, atlante, cronologia, archivio e dossier sapiens. Il controllo richiesto sulla stessa origine per un file estraneo al precache ha restituito 404. La prova a 354 verifiche è stata ripetuta con la directory ancora assente, senza errori. |

## Limiti delle verifiche

Il comportamento responsive è stato esercitato col motore Chromium a tre larghezze. Le prove multibrowser successive sono riportate in fondo. Safari ed Edge sui dispositivi reali, iPad e LIM fisici, lettori di schermo e installazione dal menu di un sistema operativo richiedono verifiche dedicate. La prova della cache ha sottratto l’origine dei contenuti e disabilitato l’uso della normale cache HTTP nelle richieste di controllo. La connettività del computer restava attiva. I modelli tridimensionali di collezioni esterne richiedono connessione e dipendono dai rispettivi fornitori. Il controllo dei metadati di licenza e dell’accessibilità nel markup è documentale. La conformità integrale WCAG 2.2 AA e la validazione scientifica umana specialistica restano da accertare.

## Come ripetere

- `python reports/homo/validate.py Spazi/homo` esercita i controlli statici.
- `QA/responsive.html` può essere servito su una copia di anteprima isolata. Il parametro `app` indica il percorso relativo della PWA. Il lettore locale di test apre tre viewport e riporta gli errori per dimensione.
- `QA/outage.html` attende che la copia specifica `qa-offline/Spazi/homo/` sia stata installata nella cache dello stesso browser. Eseguire questa prova solo su una copia di test con il proprio ambito e dopo averne sottratto temporaneamente i file. Il sito di produzione non è coinvolto.
- `python QA/browser.py --url URL_DI_COLLAUDO` contiene una suite Playwright aggiuntiva. In questa sessione l’avvio di un processo Chromium dalla shell è risultato inibito dalla creazione di socket locali. Le prove rendicontate nella tabella sono state eseguite nel browser Chrome connesso all’anteprima ufficiale.

## Pubblicazione e collaudo dell’edizione distribuita

L’edizione pubblica corrisponde al commit acabe2a2. La distribuzione sul server è riuscita il 23 novembre 2026. Il controllo della home ha individuato la porta «Esplora le altre umanità». Il clic ha aperto la copertina su https://gbprof.it/Spazi/homo/. L’hash dei contenuti del service worker dell’edizione è b23bf1c2d76822dc. I controlli automatici hanno verificato che il service worker pubblico corrispondesse byte per byte al file versionato.

| Prova finale | Risultato |
|---|---|
| Chromium 141, Firefox 142 e WebKit 26 | Navigazione dalla home pubblica, lettura delle monografie, apertura del reperto di Bianfu, immagini, cronologia, segnalibri ed evidenziazioni superate in tutti e tre i motori. |
| Offline | Con l’origine HTTP di test spenta i tre motori hanno riaperto la PWA, la monografia di Luzon, l’atlante e Bianfu. Sul dominio pubblico la ripetizione con rete disconnessa nel browser è riuscita su Chromium e Firefox. Per WebKit sono stati verificati cache pubblica e riavvio senza server sulla copia identica. |
| Installabilità | Il protocollo DevTools di Chromium ha restituito un manifest valido e nessun errore di installabilità. |
| Accessibilità automatizzata | axe-core 4.10.3 in 15 combinazioni di percorso, viewport e tema, con i criteri automatizzabili WCAG A/AA selezionati. Nessuna violazione segnalata nel campione. Restano aperte verifica manuale completa e prove assistive. |
| Registri | [Distribuzione sul server](https://github.com/gb69prof/gbprof-home/actions/runs/45270128013) · [Collaudo della PWA pubblicata](https://github.com/gb69prof/gbprof-home/actions/runs/45270127899) · [Collaudo prima della pubblicazione](https://github.com/gb69prof/gbprof-home/actions/runs/45269841866). |
