# Come lavoro — racconto integrale

Gli otto testi di `chapters.json` provengono dai documenti Google Drive indicati
nei rispettivi campi `source_url`. Sono stati letti il 25 ottobre 2026 e inseriti
integralmente, senza riassunti o riscritture. Si normalizzano soltanto BOM,
terminatori di riga e separatori grafici di sottolineature. Titoli e paragrafi
rimangono nell'ordine originale. Le date e le citazioni del racconto sono quelle
fornite dall'autore: questa implementazione non costituisce una verifica dei
documenti storici del progetto o delle trascrizioni richiamate nei testi.

La nuova esperienza è il racconto personale di gbprof, in otto capitoli statici.
Non contiene quiz, esercizi o prompt da copiare. Il testo è sempre visibile;
gli elementi espandibili contengono soltanto indici di navigazione.

## Aggiornamento

1. Aggiornare il testo e la provenienza del capitolo in `chapters.json`.
2. Eseguire `python3 tools/build-work-story.py` dalla radice del repository.
3. Eseguire `python3 tools/check-work-story.py` e verificare il risultato nel browser.
4. Committare insieme fonti e HTML generati.

Non è necessaria una build sul server: gli HTML generati sono già nel repository.
Il CSS `Spazi/come-lavoro/racconto.css` è indipendente dagli stili precedenti.
L'immagine personale esistente è riutilizzata senza modifiche.

I vecchi URL di Conoscere e Dialogare reindirizzano ai capitoli corrispondenti,
con un collegamento HTML utilizzabile anche quando il reindirizzamento è bloccato.
La homepage generale e le altre sezioni del sito non cambiano.

## Verifiche

Il controllo confronta ogni blocco dei capitoli con il testo della fonte,
controlla destinazioni e frammenti dei collegamenti locali, ID univoci e struttura
semantica. Le pagine pubblicabili non dipendono da JavaScript o servizi esterni.
Il deploy esistente parte soltanto da `main`: questa proposta richiede approvazione
prima del merge.
