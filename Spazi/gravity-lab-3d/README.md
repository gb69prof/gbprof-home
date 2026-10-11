# Gravity Lab 3D

Laboratorio in italiano, statico, senza framework applicativo. Three.js 0.180.0 e OrbitControls sono distribuiti localmente con la loro licenza. Non richiede CDN o account esterni.

## Struttura
- `index.html`, `css/style.css`: interfaccia responsive.
- `js/physics.js`: N-body newtoniano, Velocity Verlet, passo fisso 1/240.
- `js/scene.js`: scena Three.js, campo visuale e tracce.
- `js/canvas-renderer.js`: proiezione software compatibile quando WebGL2 non è disponibile.
- `js/interaction.js`: Pointer Events, disegno, lancio, selezione.
- `js/ui.js`, `js/main.js`: comandi e ciclo di simulazione.

Pubblicare questa cartella con un server HTTP statico. Non occorre installare dipendenze o eseguire una compilazione. I file applicativi sono la copia originale del progetto Sites.

## Verifiche
`node tests/verify.mjs`: 24.000 passi, variazione massima dei raggi iniziali 0,7484%; deviazione da rotta inerziale; impatto solare; limiti e reset; Pointer Events mouse/touch con adattatori DOM e ripristino camera.

Verifiche browser documentate dal progetto originale: verificati caricamento in modalità compatibile, disegno e lancio, dati del Sole, pausa/ripresa/reset, viste, slider, toggle, guida e pulizia. L'ambiente browser non espone WebGL: il percorso GPU e Safari su iPad fisico non sono stati eseguiti. Il codice touch condivide lo stesso percorso Pointer Events del mouse. Lo zoom e la rotazione sono gestiti da OrbitControls.

## Modello e limiti
Unità relative, G=1, Sole=1000, corpi sul piano orbitale. I nomi dei pianeti sono didattici; masse, raggi e distanze non riproducono il Sistema solare. Sole e pianeti partecipano allo stesso calcolo N-body. Gli asteroidi hanno massa 0,000001. Impatti arrestati; oltre 180 unità, corpi disattivati. Max 12 asteroidi, max 1.200 punti per traccia. Distanza minima numerica 0,05 per evitare singolarità.

La griglia usa un profilo ispirato al potenziale, regolarizzato e senza cutoff radiale. I pozzi planetari sono amplificati visivamente. Non rappresenta letteralmente lo spazio-tempo e non determina la fisica. Il bordo della griglia è solo il bordo del disegno. Per la cattura da una traiettoria non legata occorre uno scambio di energia con un terzo corpo; non viene simulata dissipazione.

## Origine della copia

Progetto originale: https://gravity-lab-gbprof-3d.gbprof.chatgpt.site/
Commit sorgente: a0d3c9a117b6c28f8631dee6d26218ef6e7f9119.
Copia su gbprof.it: https://gbprof.it/Spazi/gravity-lab-3d/
I file applicativi, le dipendenze Three.js e la loro licenza sono conservati senza modifiche.
