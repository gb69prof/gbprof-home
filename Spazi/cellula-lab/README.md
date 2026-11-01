# Cellula Lab 2.0 — laboratorio virtuale di biologia

Laboratorio statico accessibile da [gbprof.it/Spazi/cellula-lab/](https://gbprof.it/Spazi/cellula-lab/). Per provarlo localmente, avviare un server HTTP nella cartella e aprirne l’indirizzo nel browser; non aprire `index.html` con `file://`.

## Sei esperienze

- **Sintesi proteica:** percorso di una proteina secreta, in sei fasi, con avanzamento automatico o manuale, velocità regolabile e interruzione didattica della traduzione.
- **Produzione di ATP:** schema della membrana mitocondriale interna, gradiente protonico e ATP sintasi, con cursori qualitativi per ossigeno e disponibilità di ADP e fosfato.
- **Osmosi:** modifica dei soluti esterni, previsione e movimento illustrativo dell'acqua nei due sensi; risposta schematica animale o vegetale.
- **Fotosintesi:** selezione automatica della cellula vegetale, cloroplasto, schema delle reazioni luminose e del ciclo di Calvin; luce e anidride carbonica regolabili.
- **Divisione cellulare:** modello tridimensionale di cellula animale con quattro cromosomi, sei fasi dall'interfase alla citodieresi e avanzamento automatico o manuale.
- **Stress termico:** cursore di intensità, risposte qualitative e animazione illustrativa nella cellula.

Le due cellule 3D sono esplorabili con rotazione, zoom, selezione degli organuli e schede scientifiche. Sono presenti quiz e note sulle semplificazioni.

## Ascoltare la spiegazione

Aprire un'esperienza e premere **Ascolta la spiegazione**. La scena viene portata in vista e sopra di essa compaiono i pulsanti per mettere in pausa, riprendere o fermare. Nei percorsi a fasi la voce parte dalla fase selezionata e fa avanzare le fasi alla fine di ogni clip; con la traduzione bloccata il percorso si arresta al ribosoma. Il testo della clip è consultabile sotto **Leggi il testo della spiegazione**. Le simulazioni a cursore hanno un commento introduttivo registrato: la voce non legge in tempo reale ogni nuovo valore.

La voce italiana femminile **Sara** è sintetica, generata localmente con Kokoro e inclusa come audio MP3: non richiede connessione, servizi esterni o installazione di modelli vocali per la riproduzione. Per provenienza e licenza vedere `voce/ATTRIBUZIONI.md`. La scelta e la qualità percepita della voce vanno valutate ascoltandola.

## Limiti scientifici e visivi

Le scene sono modelli didattici procedurali, non ricostruzioni da microscopia, non in scala e non validati all'ultrastruttura. Colori, quantità, distanze, trasparenze, moti e marcatori sono convenzionali. Non raggiungono il fotorealismo da microscopia.

Il percorso proteico riguarda una proteina secreta; il blocco della traduzione è una semplificazione, non la simulazione di un farmaco. Gli indici per ATP e fotosintesi sono regole qualitative, non velocità o previsioni sperimentali: quello dell'ATP rappresenta soltanto la fosforilazione ossidativa; quello della fotosintesi rappresenta schematicamente la fissazione del carbonio. Le reazioni luminose e il ciclo di Calvin sono distinti e l'ossigeno liberato proviene dall'acqua. Il cursore dell'osmosi non rappresenta concentrazioni misurate; la risposta reale dipende anche dalla permeabilità e, nelle piante, dal potenziale di pressione.

La duplicazione del DNA precede la mitosi. Nel modello della divisione numero di cromosomi e tempi sono ridotti; la citodieresi illustrata è animale, mentre nelle cellule vegetali si forma una piastra cellulare. Lo stress rappresenta qualitativamente un solo tipo di perturbazione, quella termica, senza temperatura in gradi né effetti cumulativi; l'esito reale dipende anche da durata e tipo di cellula.

## Verifiche e dipendenze

Verifiche nel browser del PC: caricamento WebGL; passaggio fra le sei esperienze; cursori, fasi manuali, risposta al blocco della traduzione e riproduzione, pausa e arresto dell'audio; avanzamento sincronizzato della voce nei percorsi a fasi. Controllo dell'impaginazione con dimensioni simulate di 820 e 390 pixel di larghezza. Tutte le 17 clip sono state decodificate tecnicamente e confrontate con il testo mediante riconoscimento automatico: questo non sostituisce l'ascolto umano né certifica naturalezza e pronuncia. Le richieste audio parziali e la logica di cache sono state controllate separatamente. Nel browser del PC, dopo il caricamento della cache, il laboratorio e la voce sono stati riaperti anche con il server locale di prova spento; la rete del computer non è stata scollegata fisicamente.

Non sono state eseguite prove su un iPad fisico, Safari iPadOS, gesti multitouch reali, ascolto umano delle nuove clip o installazione PWA offline su dispositivo. Le prestazioni e la riproduzione reale su iPad restano da verificare.

Three.js 0.180.0 è incluso in `vendor/`, con licenza MIT in `vendor/THREE-LICENSE.txt`. Il motore 3D, i caratteri di sistema e gli audio non richiedono Internet; i collegamenti alle fonti si aprono online.

Fonti: OpenStax Biology 2e, [cellule](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells), [osmosi](https://openstax.org/books/biology-2e/pages/5-2-passive-transport), [fosforilazione ossidativa](https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation), [sintesi proteica](https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis), [fotosintesi](https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis), [ciclo cellulare](https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle), [enzimi e temperatura](https://openstax.org/books/biology-2e/pages/6-5-enzymes).
