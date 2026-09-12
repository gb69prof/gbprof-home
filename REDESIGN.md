# Home redesign 2026 — prima implementazione

Branch di lavoro: `home-redesign-2026`. La home pubblica e `main` non sono stati modificati.

## Scena

La hero usa l'immagine di riferimento, compressa in WebP (circa 388 KiB), mantenendola intera. Il rapporto della scena SVG è 1402 × 1122: immagine, contatto, parole e connessioni condividono le stesse coordinate. Nei formati larghi lo spazio laterale viene accompagnato da luce calda e blu; nei formati verticali immagine e frase occupano zone distinte.

La microanimazione dura 18 secondi, inclusa una lunga fase di quiete: piccolo spostamento locale del dito con displacement SVG, impulso sul tablet, parole che sfumano in caratteri e nodi, risposta luminosa. CSS e SVG nativi, senza video o librerie. Il ciclo si sospende fuori vista o quando la scheda è nascosta. Il comando sotto la hero consente di metterlo in pausa; `prefers-reduced-motion` lascia una scena statica. Senza JavaScript restano disponibili immagine, indice e tutti i collegamenti.

Le quattro porte sono illustrazioni SVG locali: biblioteca, studio, galleria e archivio. Seguono i 17 progetti originali, con testi e destinazioni conservati, inclusi tutti gli anchor precedenti. Privacy e accessibilità sono mantenute. Nessun caricamento di font, analytics o altri servizi esterni.

## Anteprima

Dalla directory del repository:

```sh
python -m http.server 8765
```

Aprire `http://localhost:8765` nel browser del computer sul quale gira il server. I link assoluti ai progetti dipendono dalle altre directory del dominio `gbprof.it`, che non appartengono a questo repository; il server locale serve soltanto la home e le sue pagine informative.

## Verifiche eseguite

- Repository e home pubblica analizzati; home pubblica aperta e osservata nel browser.
- Tutte le 29 destinazioni originali conservate; i 17 blocchi dei progetti hanno testo e URL invariati.
- ID univoci, anchor validi, asset locali presenti, XML delle quattro porte valido.
- Sintassi JavaScript verificata con `node --check`.
- Pagine privacy/accessibilità e workflow di deploy invariati; il deploy è limitato a `main`.

## Verifiche ancora necessarie

Il browser cloud della sessione ha rifiutato sia `http://127.0.0.1:8765` sia l'apertura del file locale. Non è stato possibile osservare la prima implementazione: i controlli visuali **non risultano superati** e non è stata creata un'anteprima pubblica.

Prima di approvare la pubblicazione, verificare in un browser con accesso all'anteprima:

- Desktop 1440 × 810; iPad orizzontale 1024 × 768 e verticale 768 × 1024; smartphone 390 × 844.
- Visibilità simultanea di volto, tablet e Libera; nessuna sovrapposizione della frase al gesto.
- Un intero ciclo animato, in particolare la lieve deformazione del dito e l'allineamento del contatto; controllare anche Safari su iPad.
- Navigazione da tastiera, pausa/ripresa, preferenza di movimento ridotto, ingrandimento e assenza di scorrimento orizzontale.

Non unire questo branch a `main` senza autorizzazione di gbprof.
