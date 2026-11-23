# Collaudo dell’atlante e dell’archivio

Revisione scientifica e tecnica del 23 novembre 2026.

| Controllo | Esito |
|---|---|
| Archivio | 24 ID stabili distinti. Ciascuna scheda ha coordinate, fonte, popolazione, reperto, descrizione, cronologia, metodo e limiti. Il GeoJSON contiene gli stessi 24 identificativi. |
| Carte | Aperte e decodificate con Pillow tutte le 46 immagini. Controllati il checksum del NetCDF sorgente e il valore temporale di ciascuna delle 15 bande utilizzate. Testata l’esistenza di tutti gli strati richiesti dai comandi della carta. |
| Interazione | Eseguiti con successo test del DOM in JavaScript per cambio di data, filtri regionali e di popolazione, visibilità degli strati, zoom, spostamento, ripristino della regione, espansione ed Escape, selezione di una località con Invio, apertura della scheda e disponibilità degli export. |
| Modalità rigorosa | Verificata l’esclusione delle ricostruzioni modellate del paesaggio e delle finestre cronologiche controverse. Il filtro denisoviano include Bianfu e Xujiayao e non include Baxian. |
| Finestra di Callao | Campi cronologici aperti. I valori originari di almeno 67 e 50 ka, la successiva reinterpretazione con minimo di 134 ± 14 ka e la fonte del 2023 sono visibili nella scheda; nessuna barra 67–50 ka è utilizzata per simulare una durata della specie. |
| Sima de los Huesos | Separati il vincolo di circa 430 ka sul sedimento soprastante e la media modellata di 448 ± 15 ka per l’unità LU-6 contenente i fossili, secondo Demuro et al. (2019). |
| Fossili asiatici | Conservati i due intervalli alternativi di Penghu. La cronologia di Bianfu si riferisce ai resti nei livelli 167–134 ka. La coppia di campioni molecolari di Xujiayao è specificata per codice. Per Naxian e Baxian sono riportate separatamente le cronologie dei due depositi. Il molare PA1796 rimane di affinità incerta. |
| Riscontro editoriale | Confrontati titoli e identificatori degli studi tramite lettura degli articoli e consultazione di Crossref, PubMed e depositi istituzionali. Le note di provenienza distinguono posizione dello scavo e indicatore regionale. |

Il collaudo isolato del modulo ha esercitato la struttura DOM e gli eventi tramite jsdom. Il tentativo di avviare Chromium in quel processo è stato bloccato dal divieto di creazione del socket di profilo del browser. Quel test non certifica rendering, lettori di schermo, hardware iPad o conformità completa a WCAG. Eventuali verifiche visuali e d’installabilità della PWA completa sono registrate nel collaudo generale.

Le fonti cartografiche, la riclassificazione dei biomi, i diritti e la procedura per rigenerare le immagini sono descritti in CARTOGRAFIA.md. Le due epoche considerate per gli assi schematizzati verso Sahul sono quelle del modello di Kealy e colleghi. Nessuno dei tracciati rappresenta un itinerario archeologicamente seguito passo per passo.
