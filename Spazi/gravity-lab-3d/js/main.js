import {Simulation,STEP} from './physics.js';
import {SpaceScene} from './scene.js';
import {Interaction} from './interaction.js';
import {$,wireUI,updateInfo} from './ui.js';
const app={sim:new Simulation(),running:true,speed:1,accumulator:0,selected:null,
 message(text){$('#status').textContent=text;},
 updatePlay(){$('#play').innerHTML=this.running?'Ⅱ <span>Pausa</span>':'▶ <span>Avvia</span>';$('#state').textContent=this.running?'IN SIMULAZIONE':'IN PAUSA';},
 setLaunch(draft){const v=draft?Math.hypot(draft.v.x,draft.v.z):0;$('#launch').disabled=v<.15;$('#launch-speed').innerHTML=(v?v.toFixed(2):'—')+' <small>u.d. / u.t.</small>';},
 select(b){this.selected=b;$('#body-info').hidden=!b;if(b)updateInfo(this);}
};
try{
 app.view=new SpaceScene($('#viewport'),app.sim);app.interaction=new Interaction(app.view,app);wireUI(app);if(app.view.software)app.message("Modalità grafica compatibile attiva. Disegna il tuo esperimento.");
 let last=performance.now(),sample=0,frame=0;
 function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;if(app.running){app.accumulator+=dt*app.speed;let count=0;while(app.accumulator>=STEP&&count++<64){app.sim.step();app.accumulator-=STEP;if(++sample%8===0)app.view.recordTraces();}}else app.accumulator=0;
 app.view.sync();if(frame++%6===0){$('#elapsed').innerHTML=app.sim.time.toFixed(1)+' <small>u.t.</small>';$('#count').textContent=app.sim.asteroids.length;updateInfo(app);if(app.sim.events.length)app.message(app.sim.events.splice(0).join(' · '));}requestAnimationFrame(animate);}
 document.addEventListener('visibilitychange',()=>{last=performance.now();app.accumulator=0;});requestAnimationFrame(animate);
}catch(err){$('#error').hidden=false;$('#error').textContent='La scena 3D non può essere avviata. Verifica che WebGL sia disponibile e ricarica la pagina. '+err.message;console.error(err);}
