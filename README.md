# gbprof — porta principale

Repository sorgente della home di `gbprof.it`.

La home funziona come portale verso repository indipendenti pubblicati sul server: III anno, IV anno, V anno, Filosofia, UTILITY, Competenze e progetti futuri.

## Come lavoro

La sezione sotto le quattro porte apre `Spazi/come-lavoro/index.html`. La pagina è
autosufficiente: CSS e immagini sono dentro `Spazi/come-lavoro/`, perché gli asset
preesistenti nella radice del server sono condivisi con altri progetti.

L'immagine è esclusivamente l'allegato personale `immagine(20261025-171600).png`:
stessa composizione intera 4:3, senza rigenerazione, ritocco o crop. Le due copie
WebP (qualità 88) misurano 720 × 540 e 1448 × 1086, rispettivamente 86.760 e
253.080 byte. SHA-256 dell'originale:
`13cfc0bfe177c6f26e8bd698863dc1c3e7c01da5644529b583d9ed5520688c2e`.

Le parti I e II contengono una prima introduzione allo strumento e al metodo.
Le parti III (Foscolo) e IV (Prova tu) sono strutture dichiarate in preparazione:
non contengono conversazioni ricostruite, date, output fittizi o funzioni simulate.
Per completarle occorre selezionare i materiali originali e scrivere gli esercizi.

### Ricostruzione e pubblicazione

Modificare `home-source.html` e `assets/style.css`, poi eseguire
`python tools/bundle-home.py`: `index.html` è il bundle pubblicato. Il manifesto
«Il sapere torna a dialogare», prima presente soltanto nel bundle, è stato
riallineato ai sorgenti senza modificarne testo o aspetto.

Il workflow è limitato ai push su `main` e verifica pagina e asset all’indirizzo
`https://gbprof.it/Spazi/come-lavoro/`. Usa la directory `Spazi` già pubblicata,
perché il deploy non ha il permesso di creare un nuovo collegamento nella radice
del server. Non sono necessarie modifiche a Caddy, Docker o ai permessi.
La pubblicazione è stata autorizzata da gbprof il 25 ottobre 2026.

Verifiche della modifica: build riproducibile, sezioni preesistenti identiche,
ID e ancore validi nel bundle e nella pagina interna, sintassi JavaScript e shell,
anteprima desktop e mobile a 390 px. Il deploy e Safari/iPad reali restano da
verificare dopo approvazione; l'anteprima mobile usa un viewport iframe.
