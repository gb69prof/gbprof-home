# Spaziotempo Lab — gbprof

Laboratorio 3D interattivo sulla geometria dello spaziotempo di Einstein, con sintesi vocale italiana.

## Inserimento
La pagina è in `/Spazi/spaziotempo-lab/` e riusa la copia locale di Three.js già presente in `/Spazi/gravity-lab-3d/vendor/three.module.js`. L'import map di `index.html` imposta il percorso sul dominio gbprof.it: non servono API a consumo né altre installazioni lato sito.

## Esperimenti
1. Vuoto di Minkowski: mostra/nascondi coordinate e cambia scala.
2. Orologio di luce: velocità relativa, fattore di Lorentz e tempo proprio.
3. Massa e geometria: rappresentazione di curvatura, raggi luminosi, confronto di orologi idealizzato.
4. Onde gravitazionali: polarizzazioni più e croce e sonde in caduta libera.

Animazioni e vista 3D orientabili, zoom, pausa, schermo intero, spiegazioni in italiano e domanda finale.

## Limiti fisici
Lo spaziotempo non è fatto di linee né di una superficie elastica. La visualizzazione è qualitativa: non risolve le equazioni di Einstein. In vuoto con costante cosmologica nulla, lo spazio di Minkowski è *una possibile soluzione*, non l'unica. Le onde gravitazionali attraversano regioni dove il tensore energia-impulso della materia è nullo, ma trasportano energia gravitazionale.

## Audio
Voce: `SpeechSynthesisUtterance` del browser, lingua `it-IT`. La riproduzione viene attivata dagli interventi dell'utente. Le voci disponibili e la loro qualità variano in funzione del sistema operativo/browser. Tutte le spiegazioni rimangono anche scritte.

## Fonti
- Universität Stuttgart, *Einstein Field Equations*, https://download.itp3.uni-stuttgart.de/rt2324/Lecture_25.pdf
- University of Paris, *General Relativity and Gravitational Waves*, https://apc.u-paris.fr/APC_CS/Conferences/Site_Cargese/Courses_files/novak_notes.pdf
- CERN, *Detecting gravitational waves*, https://indico.cern.ch/event/855973/contributions/3602248/attachments/1991852/3321449/2020_02_21_Gouaty_ESIPAP.pdf
