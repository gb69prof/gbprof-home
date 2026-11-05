(() => {
 'use strict';
 const images = {"conoscenza-felicita": {"title": "Conoscenza e felicità", "alt": "Un giovane guarda il cielo accanto a un telescopio, tenendo un fiore appassito.", "caption": "Il telescopio richiama il progresso della conoscenza; il fiore appassito ricorda che il sapere non elimina la fragilità della vita."}, "ragione": {"title": "La ragione e i suoi limiti", "alt": "Un giovane tra un lume acceso, libri e una finestra aperta sul mondo moderno.", "caption": "Il lume illumina i libri: la ragione permette di conoscere. Il paesaggio oltre la finestra invita a riflettere sulle trasformazioni della civiltà."}, "sensismo": {"title": "Dai sensi all’immaginazione", "alt": "Una mano sfiora una siepe mentre lo sguardo si rivolge a un paesaggio lontano.", "caption": "Il contatto con la siepe richiama la sensazione concreta; l’orizzonte suggerisce ciò che la mente può immaginare a partire dall’esperienza."}, "natura": {"title": "Le leggi della natura", "alt": "Un uomo osserva il mare, la pioggia e un vulcano in un vasto paesaggio.", "caption": "La figura umana è piccola rispetto ai fenomeni naturali: la natura segue processi propri, indipendenti dai nostri desideri."}, "antichi-moderni": {"title": "Antichi e moderni", "alt": "Due archi affiancano statue e un tempio antico a un giovane e un paesaggio industriale.", "caption": "I due archi rappresentano due modelli culturali: vicinanza alla natura e immaginazione; analisi, progresso e disincanto. È un confronto simbolico."}, "classicismo-romanticismo": {"title": "Classicismo e Romanticismo", "alt": "Un busto classico, libri e una penna accanto a una finestra aperta sul paesaggio.", "caption": "Il busto e i libri richiamano la tradizione classica; la finestra aperta suggerisce il dialogo della letteratura con il mondo e la vita interiore."}, "verso-leopardi": {"title": "Il filo che conduce a Leopardi", "alt": "Un giovane pensoso accanto a una siepe e a un sentiero che attraversa le colline.", "caption": "Il sentiero rappresenta il percorso verso Leopardi: sensazioni, conoscenza dei limiti e domanda sulla felicità."}, "ginestra": {"title": "Il fiore e la social catena", "alt": "Una ginestra fiorisce sulla lava; due persone si sostengono davanti al Vesuvio.", "caption": "Il fiore rende visibile la fragilità; le due figure traducono simbolicamente la solidarietà. Non raffigurano un episodio narrato nel canto."}};
 const layout=document.querySelector('.study-layout');
 const panel=document.getElementById('image-panel');
 const image=document.getElementById('lesson-image-large');
 const title=document.getElementById('image-title');
 const caption=document.getElementById('image-caption');
 const error=document.getElementById('image-error');
 const buttons=[...document.querySelectorAll('[data-lesson-image]')];
 const small=window.matchMedia('(max-width: 739px)');
 let active=null;
 function placePanel(){
  if(small.matches && active) active.closest('.lesson-part').querySelector('.lesson-heading').after(panel);
  else layout.append(panel);
 }
 function close(){
  const previous=active;
  panel.hidden=true;
  layout.classList.remove('has-image');
  buttons.forEach(button=>button.setAttribute('aria-expanded','false'));
  active=null;
  layout.append(panel);
  if(previous){previous.focus({preventScroll:true});previous.closest('.lesson-part').scrollIntoView({block:'start',behavior:'instant'});}
 }
 function open(button){
  if(active===button){close();return;}
  active=button;
  const key=button.dataset.lessonImage;
  const item=images[key];
  title.textContent=item.title;
  image.alt=item.alt;
  caption.textContent=item.caption;
  error.hidden=true;
  image.hidden=false;
  image.src=key==='ginestra'?'../assets/ginestra.webp':'../lezione-1/images/'+key+'.webp';
  buttons.forEach(b=>b.setAttribute('aria-expanded',String(b===button)));
  placePanel();
  panel.hidden=false;
  layout.classList.add('has-image');
  button.closest('.lesson-part').scrollIntoView({block:'start',behavior:'instant'});
 }
 buttons.forEach(button=>button.addEventListener('click',()=>open(button)));
 document.getElementById('close-image').addEventListener('click',close);
 document.addEventListener('keydown',event=>{if(event.key==='Escape' && active){close();event.preventDefault();}});
 image.addEventListener('error',()=>{error.hidden=false;image.hidden=true;});
 if(small.addEventListener) small.addEventListener('change',placePanel);
 else small.addListener(placePanel);
})();
