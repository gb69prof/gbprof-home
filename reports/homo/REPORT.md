# HOMO · Report di autonomia verificabile

Edizione scientifica del 23 novembre 2026. Registro tecnico conservato nel repository in reports/homo, esterno alla directory servita sotto Spazi/homo.

## Obiettivo e prodotto

Realizzare un atlante scientifico in italiano delle popolazioni contemporanee a Homo sapiens e pubblicarlo attraverso la sezione Spazi di gbprof.it. La directory pubblicabile è Spazi/homo. Il punto d’ingresso della home viene generato da Spazi/index.html mediante tools/bundle-home.py.

## Operazioni e decisioni

Sei agenti distinti hanno lavorato sul corpus africano, l’Eurasia, il Sud-est asiatico insulare, il Pleistocene medio, l’iconografia e la cartografia. La coordinatrice ha curato integrazione, interfaccia, persistenza, cronologia, laboratorio comparativo, pubblicazione e controllo delle evidenze. Revisioni incrociate hanno corretto la finestra di Sima, il trattamento delle età minime di Callao, il conteggio delle classificazioni asiatiche e la gestione del filtro rigoroso.

La PWA contiene otto monografie per 21.709 parole di narrazione oltre alle bibliografie, dieci dossier di dibattito, quattordici metodi, una monografia sulle scomparse di 1.562 parole, lezioni trasversali, rete di parentela e flussi genetici. Sono presenti 24 località, 15 epoche, 37 immagini suddivise per natura documentaria e 10 lettori 3D esterni della Smithsonian. I dati e i file necessari ai percorsi principali, comprese immagini e carte, sono locali. Servono Internet per gli articoli originali e le collezioni 3D.

La collocazione nel repository gbprof-home segue il collegamento Spazi già presente sul server. Nel log di distribuzione del 23 novembre sono documentati sia il collegamento della home sia quello della directory Spazi. La ricostruzione della home sul server ha come sorgente Spazi/index.html. Si usa questo meccanismo senza interventi su Caddy, SSH o permessi del server.

## Fonti e aggiornamenti

Ricerche bibliografiche mirate per taxon, sito, datazione e controversia hanno privilegiato pubblicazioni primarie e testi dei curatori. La bibliografia obbligatoria è stata integrata con articoli usciti fino al 18 novembre 2026. Le schede associano al capitolo una fonte, il tipo di evidenza e i limiti. Il corpus è una selezione documentale interrogabile, senza pretesa di esaustività bibliometrica. La revisione è documentale e non è stata svolta da un paleoantropologo incaricato. Ogni ricostruzione IA include fonti, prompt, data e limiti. I crediti delle immagini e i modelli sono consultabili nei rispettivi cataloghi. Le revisioni scientifiche sono visibili in data/revisions.json e nella sezione «La ricerca continua».

## Prove

I controlli strutturali si eseguono con python reports/homo/validate.py. Le verifiche sui dati e sulle visualizzazioni sono documentate anche in atlas.md e CARTOGRAFIA.md. Lo script verifica-browser.py esercita la PWA su un’origine realmente servita. COLLAUDO.md distingue prove effettive e verifiche ancora aperte. La versione corrente della cache deriva dagli hash dei file distribuiti.

## Manutenzione

Per modificare la PWA aggiornare i JSON, i media o i moduli nell’albero Spazi/homo. Aggiornare il registro delle revisioni con data, fonte e motivazione e rigenerare l’edizione con python reports/homo/build-edition.py Spazi/homo dalla radice del repository. Per aggiungere una popolazione, registrare il nuovo ID in data/populations.json e aggiungere la monografia con lo stesso ID. L’ordine dei record determina l’ordine editoriale. I file della revisione tecnica restano in reports/homo. La versione corrente e lo stato dei collaudi fanno fede per questa edizione.
