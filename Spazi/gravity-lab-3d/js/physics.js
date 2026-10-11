// Dimensionless Newtonian N-body system. Fixed-step kick-drift-kick (Velocity Verlet).
export const G=1, STEP=1/240, MAX_ASTEROIDS=12;
export const PLANETS=[
 ['Mercurio',6,0.015,0.25,'#bbb9b0',0.4],
 ['Venere',10,0.035,0.4,'#e7c18b',2.1],
 ['Terra',15,0.05,0.48,'#55c4e6',4.2],
 ['Marte',21,0.025,0.36,'#e77a55',0.8],
 ['Giove',29,0.3,0.95,'#d5ac84',3.5]
];
export class Simulation {
 constructor(){this.reset();}
 reset(){this.time=0;this.serial=0;this.events=[];this.bodies=[{id:'sun',name:'Sole',kind:'Stella',mass:1000,radius:1.5,x:0,z:0,vx:0,vz:0,color:'#ffbd5a',active:true}];
 for(const [name,r,m,radius,color,a] of PLANETS){const v=Math.sqrt(G*1000/r);this.bodies.push({id:name,name,kind:'Pianeta',mass:m,radius,color,x:r*Math.cos(a),z:r*Math.sin(a),vx:-v*Math.sin(a),vz:v*Math.cos(a),active:true});}
 // Cancel total momentum; the Sun remains free to respond to every other body.
 const sun=this.bodies[0];for(const p of this.bodies.slice(1)){sun.vx-=p.mass*p.vx/sun.mass;sun.vz-=p.mass*p.vz/sun.mass;}
 }
 get asteroids(){return this.bodies.filter(b=>b.kind==='Asteroide');}
 launch(p,v){if(this.asteroids.length>=MAX_ASTEROIDS)return null;const b={id:'a'+ ++this.serial,name:'Asteroide '+this.serial,kind:'Asteroide',mass:0.000001,radius:.16,color:'#75f5b7',x:p.x,z:p.z,vx:v.x,vz:v.z,active:true,trace:[],status:'In volo'};this.bodies.push(b);return b;}
 accelerations(){const a=this.bodies.map(()=>({x:0,z:0}));for(let i=0;i<this.bodies.length;i++)for(let j=i+1;j<this.bodies.length;j++){
 const b=this.bodies[i],c=this.bodies[j];if(!b.active||!c.active)continue;const dx=c.x-b.x,dz=c.z-b.z;const r2=Math.max(dx*dx+dz*dz,0.0025);const k=G/(r2*Math.sqrt(r2));a[i].x+=k*c.mass*dx;a[i].z+=k*c.mass*dz;a[j].x-=k*b.mass*dx;a[j].z-=k*b.mass*dz;}
 return a;}
 step(dt=STEP){let a=this.accelerations();this.bodies.forEach((b,i)=>{if(!b.active)return;b.vx+=a[i].x*dt/2;b.vz+=a[i].z*dt/2;b.x+=b.vx*dt;b.z+=b.vz*dt;});
 a=this.accelerations();this.bodies.forEach((b,i)=>{if(!b.active)return;b.vx+=a[i].x*dt/2;b.vz+=a[i].z*dt/2;});this.time+=dt;
 for(const b of this.asteroids){if(!b.active)continue;for(const c of this.bodies){if(c.kind==='Asteroide')continue;if(Math.hypot(b.x-c.x,b.z-c.z)<c.radius+b.radius){b.active=false;b.status='Impatto con '+c.name;this.events.push(b.name+': '+b.status);break;}}
 if(Math.hypot(b.x,b.z)>180){b.active=false;b.status='Uscito dal campo visivo';this.events.push(b.name+': '+b.status);}}
 }
 clearAsteroids(){this.bodies=this.bodies.filter(b=>b.kind!=='Asteroide');}
}
// Smooth, unbounded potential-inspired profile. There is no radial cutoff.
// Planet wells are enhanced for visibility, independent of dynamics.
export function fieldHeight(x,z,bodies,amp=1){let h=0;for(const b of bodies){if(b.kind==='Asteroide')continue;const r2=(x-b.x)**2+(z-b.z)**2;h-=b.kind==='Stella'?48/Math.sqrt(r2+16):1.4*Math.sqrt(b.mass/.05)/Math.sqrt(r2+.8); }return amp*h;}
