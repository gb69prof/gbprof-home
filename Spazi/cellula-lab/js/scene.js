import * as THREE from "../../gravity-lab-3d/vendor/three.module.js";
import { ORG, SPECIMENS } from "./data.js";

const TAU = Math.PI * 2;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LIMIT = (n,min,max)=>Math.max(min,Math.min(max,n));
function seedRandom(seed){let s=seed>>>0;return ()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;};}
function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.35,metalness:.06,emissive:color,emissiveIntensity:.1,...extra});}
function meshSphere(color,scale,radius=1,extra={}){const m=new THREE.Mesh(new THREE.SphereGeometry(radius,32,22),material(color,extra));m.scale.set(...scale);return m;}
function tube(points,color,radius=.015,opacity=1){const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(24,points.length*3),radius,7,false),material(color,{transparent:opacity<1,opacity,emissiveIntensity:.2}));}
function roundedShape(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
function capsule(w,h,d,color,alpha,edgeColor){const group=new THREE.Group();const geo=new THREE.ExtrudeGeometry(roundedShape(w,h,.21),{depth:d,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:.042,bevelThickness:.035,curveSegments:8});geo.translate(0,0,-d/2);const body=new THREE.Mesh(geo,material(color,{transparent:true,opacity:alpha,depthWrite:false,side:THREE.DoubleSide,metalness:.1,roughness:.2,emissiveIntensity:.2}));group.add(body);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,40),new THREE.LineBasicMaterial({color:edgeColor,transparent:true,opacity:.62}));group.add(edges);return group;}

export class CellScene {
  constructor(canvas,labelsHost,onSelect){
    this.canvas=canvas;this.labelsHost=labelsHost;this.onSelect=onSelect;
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.45;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(35,1,.1,60);this.zoom=6.75;this.camera.position.set(0,0,this.zoom);
    this.pivot=new THREE.Group();this.scene.add(this.pivot);
    this.scene.add(new THREE.HemisphereLight(0xc5fff6,0x21374d,2.1));
    const key=new THREE.PointLight(0xa6f8db,46,16,2);key.position.set(2.5,4,4);this.scene.add(key);
    const warm=new THREE.PointLight(0xffb49f,19,12,2);warm.position.set(-3,-2,2);this.scene.add(warm);
    const back=new THREE.PointLight(0x61a3ff,23,12,2);back.position.set(-1,1,-3);this.scene.add(back);
    this.stars();this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.orgMap=new Map();this.type="animal";this.mode="explore";this.selected="nucleus";this.labelsOn=true;this.autoRotate=!reducedMotion;this.osmosis="equal";this.osmosisRunning=false;this.targetScale=1;this.waterPhase=0;this.time=0;this.pointerPositions=new Map();this.dragged=false;this.lastDistance=0;this.isResizing=false;
    this.highlight=new THREE.Mesh(new THREE.TorusGeometry(1,.015,8,96),new THREE.MeshBasicMaterial({color:0xbaffdf,transparent:true,opacity:.75,depthTest:false}));this.highlight.renderOrder=9;this.scene.add(this.highlight);
    this.makeCell("animal");this.bindEvents();
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas.parentElement);this.resize();
    this.clock=new THREE.Clock();this.animate();
  }
  stars(){
    const random=seedRandom(9281),a=[];for(let i=0;i<170;i++)a.push((random()-.5)*13,(random()-.5)*10,-2-random()*8);
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(a,3));
    const p=new THREE.Points(geo,new THREE.PointsMaterial({color:0x9fd9ca,size:.018,transparent:true,opacity:.35,sizeAttenuation:true,depthWrite:false}));this.scene.add(p);
    const ringGeo=new THREE.RingGeometry(2.28,2.285,140);const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0x5aada5,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));ring.position.z=-1.35;this.scene.add(ring);
  }
  register(id,group){group.name=id;group.traverse(obj=>{if(obj.isMesh)obj.userData.org=id;});if(!this.orgMap.has(id))this.orgMap.set(id,group);return group;}
  makeMembrane(parent,size,plant=false){
    const g=new THREE.Group();
    if(plant){g.add(capsule(2.47,1.89,.98,0x5ad9bd,.075,0x86dfc5));}
    else{
      const shell=new THREE.Mesh(new THREE.SphereGeometry(1,70,52),new THREE.ShaderMaterial({
        transparent:true,depthWrite:false,side:THREE.FrontSide,
        vertexShader:"varying vec3 vNormal; varying vec3 vView; void main(){ vec4 world=modelMatrix*vec4(position,1.0); vNormal=normalize(mat3(modelMatrix)*normal); vView=cameraPosition-world.xyz; gl_Position=projectionMatrix*viewMatrix*world; }",
        fragmentShader:"varying vec3 vNormal; varying vec3 vView; void main(){ float f=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),2.35); vec3 color=mix(vec3(0.025,0.29,0.26),vec3(0.52,1.0,0.84),f); gl_FragColor=vec4(color,0.045+0.73*f); }"
      }));shell.scale.set(...size);g.add(shell);
      const inner=meshSphere(0x247b7b,size,1,{transparent:true,opacity:.052,depthWrite:false,side:THREE.BackSide});g.add(inner);
    }
    parent.add(g);this.register("membrane",g);
  }
  makeNucleus(parent,pos,scale=1){
    const g=new THREE.Group();g.position.set(...pos);g.scale.setScalar(scale);
    const outer=meshSphere(0x8d69ca,[.42,.38,.32],1,{transparent:true,opacity:.82,emissive:0x613daf,emissiveIntensity:.3,roughness:.27,depthWrite:false});g.add(outer);
    const inner=meshSphere(0xeabaff,[.13,.13,.11],1,{emissive:0xb48bff,emissiveIntensity:.65});inner.position.set(-.09,.06,.22);g.add(inner);
    for(let k=0;k<2;k++){const arr=[];for(let i=0;i<=36;i++){let t=i/36*TAU*1.4;arr.push([Math.cos(t)*.2-.01,k===0?Math.sin(t)*.19:Math.cos(t)*.18,.22+Math.sin(t+k*2)*.027]);}g.add(tube(arr,k===0?0xebd2ff:0x7f5cda,.008,.85));}
    for(let i=0;i<22;i++){const t=i/22*TAU;const dot=meshSphere(0xcdaff3,[.014,.014,.014]);dot.position.set(Math.cos(t)*.39,Math.sin(t)*.35,.09+Math.sin(t*3)*.06);g.add(dot);}
    parent.add(g);this.register("nucleus",g);
  }
  makeMito(parent,pos,angle=0,scale=1){
    const group=new THREE.Group();group.position.set(...pos);group.rotation.z=angle;group.scale.setScalar(scale);
    group.add(meshSphere(0xf18a53,[.28,.15,.145],1,{transparent:true,opacity:.87,roughness:.28,emissive:0x9f4b18,emissiveIntensity:.32,depthWrite:false}));
    const inner=meshSphere(0xffae70,[.243,.115,.112],1,{transparent:true,opacity:.22,depthWrite:false});group.add(inner);
    for(let row=-1;row<=1;row++){const points=[];for(let i=0;i<29;i++){let x=-.205+i/28*.41;points.push([x,row*.046+.024*Math.sin(i/28*TAU*3+row*.8),.125-Math.abs(x)*.07]);}group.add(tube(points,0xffdfb9,.012));}
    parent.add(group);this.register("mitochondrion",group);
  }
  makeER(parent,pos,scale=1){
    const group=new THREE.Group();group.position.set(...pos);group.scale.setScalar(scale);
    for(let layer=0;layer<6;layer++){const pts=[],r=.41+layer*.08;for(let i=0;i<=36;i++){const t=-1.1+i/36*Math.PI*1.75;pts.push([Math.cos(t)*r,Math.sin(t)*r*.6,.06*Math.sin(t*2+layer)-layer*.016]);}group.add(tube(pts,layer%2?0xd870a2:0xee9ab1,.023,.91));
      for(let j=1;j<7;j++){let t=-1.1+j/7*Math.PI*1.75;let p=meshSphere(0xffd3a2,[.023,.023,.023]);p.position.set(Math.cos(t)*r,Math.sin(t)*r*.6,.085+layer*.003);group.add(p);}
    }
    parent.add(group);this.register("er",group);
  }
  makeGolgi(parent,pos,angle=0,scale=1){
    const group=new THREE.Group();group.position.set(...pos);group.rotation.z=angle;group.scale.setScalar(scale);
    for(let k=0;k<6;k++){const points=[],w=.21+Math.sin(k*.5)*.03;for(let i=0;i<=23;i++){let t=i/23;points.push([(t-.5)*2*w,Math.sin(t*Math.PI)*(.08+k*.003)+k*.065-.22,Math.sin(t*Math.PI)*.04]);}group.add(tube(points,k%2?0xffd69a:0xed9c61,.026));}
    for(let k=0;k<5;k++){let b=meshSphere(0xffca8d,[.045,.045,.045]);b.position.set(.23+Math.sin(k)*.06,-.2+k*.09,.06);group.add(b);}
    parent.add(group);this.register("golgi",group);
  }
  makeRibosomes(parent,pos,scale=1){
    const group=new THREE.Group();group.position.set(...pos);group.scale.setScalar(scale);const rand=seedRandom(318);
    for(let i=0;i<53;i++){let x=(rand()-.5)*1.65,y=(rand()-.5)*1.4,z=(rand()-.5)*.5;let dot=meshSphere(i%4===0?0xf6e1b5:0xcbb5d0,[.018,.018,.018]);dot.position.set(x,y,z);group.add(dot);}
    parent.add(group);this.register("ribosome",group);
  }
  makeLysosomes(parent){
    const g=new THREE.Group();g.position.set(.62,-.57,.16);
    for(let i=0;i<3;i++){const p=meshSphere(i===0?0xd98fbf:0xecb9d9,[.085,.082,.08],1,{transparent:true,opacity:.9,emissiveIntensity:.3});p.position.set(i*.16-.12,.06*Math.sin(i*2),i*.06);g.add(p);let core=meshSphere(0xffe1ba,[.026,.026,.026]);core.position.set(p.position.x,p.position.y,p.position.z+.075);g.add(core);}
    this.interior.add(g);this.register("lysosome",g);
  }
  makeChloroplast(parent,pos,angle=0,scale=1){
    const g=new THREE.Group();g.position.set(...pos);g.rotation.z=angle;g.scale.setScalar(scale);
    g.add(meshSphere(0x48c17e,[.29,.165,.14],1,{transparent:true,opacity:.79,depthWrite:false,emissive:0x165d37,emissiveIntensity:.4}));
    for(let i=0;i<4;i++){const x=-.16+i*.105;for(let j=0;j<4;j++){const disc=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.013,20),material(j%2?0x8cfc9f:0x206e44,{emissiveIntensity:.36}));disc.rotation.x=Math.PI/2;disc.position.set(x,-.047+j*.028,.123);disc.scale.y=.88;g.add(disc);}}
    parent.add(g);this.register("chloroplast",g);
  }
  makeVacuole(parent){
    const g=new THREE.Group();g.position.set(.18,-.05,-.13);
    const s=meshSphere(0x62cadc,[.69,.58,.29],1,{transparent:true,opacity:.42,depthWrite:false,roughness:.16,emissive:0x2c8d9a,emissiveIntensity:.26});g.add(s);
    const edge=new THREE.Mesh(new THREE.SphereGeometry(1,42,28),new THREE.MeshBasicMaterial({color:0x8bedfa,transparent:true,opacity:.1,wireframe:true,depthWrite:false}));edge.scale.set(.697,.587,.296);g.add(edge);
    parent.add(g);this.vacuole=g;this.register("vacuole",g);
  }
  makeCell(type){
    if(this.model){this.model.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});this.pivot.remove(this.model);}
    this.orgMap.clear();this.type=type;this.model=new THREE.Group();this.pivot.add(this.model);this.interior=new THREE.Group();this.model.add(this.interior);this.vacuole=null;
    if(type==="animal"){
      this.makeMembrane(this.interior,[1.35,1.01,.76]);
      this.makeNucleus(this.interior,[-.32,.05,.1],1);
      this.makeER(this.interior,[-.31,.06,-.2],.89);
      this.makeMito(this.interior,[.64,-.33,.18],-.48,1.08);
      this.makeMito(this.interior,[.79,.41,-.12],.55,.84);
      this.makeMito(this.interior,[-.83,-.53,-.04],.25,.82);
      this.makeGolgi(this.interior,[.57,.25,.21],-.35,.85);
      this.makeRibosomes(this.interior,[0,0,0],1);
      this.makeLysosomes(this.interior);
    }else{
      const wall=capsule(2.85,2.2,1.2,0x90c489,.105,0xa9eaa1);this.model.add(wall);this.register("wall",wall);
      this.makeMembrane(this.interior,[1,1,1],true);
      this.makeVacuole(this.interior);
      this.makeNucleus(this.interior,[-.82,-.28,.24],.72);
      this.makeMito(this.interior,[-.82,.26,.21],-.28,.8);
      this.makeMito(this.interior,[.65,-.72,.18],.38,.62);
      this.makeChloroplast(this.interior,[-.84,.71,.14],-.35,.82);
      this.makeChloroplast(this.interior,[.97,.26,.18],1.15,.8);
      this.makeChloroplast(this.interior,[-.09,-.79,.18],.09,.79);
      this.makeGolgi(this.interior,[.69,.58,.20],.36,.62);
      this.makeRibosomes(this.interior,[-.19,.04,-.09],.8);
    }
    this.createWater();this.setOsmosis("equal",false);this.makeLabels();
    this.pivot.rotation.set(-.14,.28,0);this.select("nucleus");
  }
  createWater(){
    this.water=new THREE.Group();this.model.add(this.water);this.droplets=[];const rand=seedRandom(671);
    const geometry=new THREE.SphereGeometry(.032,8,6);
    for(let i=0;i<46;i++){const mat=new THREE.MeshBasicMaterial({color:0x9becff,transparent:true,opacity:.72,depthWrite:false,blending:THREE.AdditiveBlending});const p=new THREE.Mesh(geometry,mat);p.userData={angle:i/46*TAU+rand()*.3,phase:rand(),speed:.35+rand()*.55,radius:.024+rand()*.019};this.droplets.push(p);this.water.add(p);}
    this.water.visible=false;
  }
  setMode(mode){this.mode=mode;this.water.visible=mode==="osmosis"&&this.osmosisRunning;this.labelsHost.hidden=mode!=="explore";this.makeLabels();}
  setOsmosis(direction,running){this.osmosis=direction;this.osmosisRunning=running;this.water.visible=this.mode==="osmosis"&&running;
    this.targetScale=!running?1:this.type==="animal"?(direction==="in"?1.16:direction==="out"?.81:1):(direction==="in"?1.035:direction==="out"?.77:1);
  }
  makeLabels(){
    this.labelsHost.replaceChildren();this.labelElements=new Map();if(this.mode!=="explore"||!this.labelsOn)return;
    for(const id of SPECIMENS[this.type].labels){const info=ORG[id];const button=document.createElement("button");button.className="scene-label";button.type="button";button.innerHTML="<i aria-hidden='true'></i>"+info.name;button.style.setProperty("--label-color",info.color);button.addEventListener("click",()=>this.onSelect(id));this.labelElements.set(id,button);this.labelsHost.append(button);}
  }
  select(id){if(!this.orgMap.has(id))return;this.selected=id;this.highlight.material.color.set(ORG[id]?.color||"#baffdf");this.makeLabels();this.updateLabels();}
  setLabels(on){this.labelsOn=on;this.makeLabels();}
  focus(id){this.select(id);this.zoom=LIMIT(this.zoom-0.48,4.65,9.5);this.camera.position.z=this.zoom;this.autoRotate=false;}
  resetView(){this.zoom=window.innerWidth<700?7.7:6.75;this.camera.position.z=this.zoom;this.pivot.rotation.set(-.14,.28,0);}
  resize(){
    const rect=this.canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const w=Math.round(rect.width),h=Math.round(rect.height);
    this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();
    if(w<430&&this.zoom<7.0){this.zoom=7.5;this.camera.position.z=this.zoom;}
  }
  bindEvents(){
    const c=this.canvas;
    c.addEventListener("pointerdown",e=>{c.setPointerCapture(e.pointerId);this.pointerPositions.set(e.pointerId,{x:e.clientX,y:e.clientY});this.dragged=false;});
    c.addEventListener("pointermove",e=>{
      if(!this.pointerPositions.has(e.pointerId))return;
      const prev=this.pointerPositions.get(e.pointerId),dx=e.clientX-prev.x,dy=e.clientY-prev.y;
      this.pointerPositions.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(Math.abs(dx)+Math.abs(dy)>2)this.dragged=true;
      if(this.pointerPositions.size===1){this.pivot.rotation.y+=dx*.008;this.pivot.rotation.x=LIMIT(this.pivot.rotation.x+dy*.008,-.78,.78);this.autoRotate=false;}
      if(this.pointerPositions.size===2){const pair=[...this.pointerPositions.values()];const dist=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y);if(this.lastDistance)this.changeZoom((this.lastDistance-dist)*.011);this.lastDistance=dist;}
    });
    const end=e=>{if(!this.pointerPositions.has(e.pointerId))return;this.pointerPositions.delete(e.pointerId);if(!this.dragged&&e.type==="pointerup")this.pick(e);if(this.pointerPositions.size<2)this.lastDistance=0;};
    c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);
    c.addEventListener("wheel",e=>{e.preventDefault();this.changeZoom(e.deltaY*.008);},{passive:false});
    c.addEventListener("keydown",e=>{const key=e.key;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-"].includes(key)){e.preventDefault();this.autoRotate=false;if(key==="ArrowLeft")this.pivot.rotation.y-=.16;if(key==="ArrowRight")this.pivot.rotation.y+=.16;if(key==="ArrowUp")this.pivot.rotation.x-=.13;if(key==="ArrowDown")this.pivot.rotation.x+=.13;if(key==="+")this.changeZoom(-.4);if(key==="-")this.changeZoom(.4);}});
  }
  changeZoom(amount){this.zoom=LIMIT(this.zoom+amount,4.4,10);this.camera.position.z=this.zoom;}
  pick(e){
    const rect=this.canvas.getBoundingClientRect();
    this.pointer.x=(e.clientX-rect.left)/rect.width*2-1;this.pointer.y=-((e.clientY-rect.top)/rect.height*2-1);
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hits=this.raycaster.intersectObject(this.model,true);let candidate=null;
    for(const hit of hits){let id=hit.object.userData.org;if(!id)continue;if(id!=="membrane"&&id!=="wall"){candidate=id;break;}if(!candidate)candidate=id;}
    if(candidate)this.onSelect(candidate);
  }
  updateLabels(){
    if(!this.labelElements||!this.labelsOn||this.mode!=="explore")return;
    const rect=this.canvas.getBoundingClientRect(),p=new THREE.Vector3();
    for(const [id,el] of this.labelElements){const obj=this.orgMap.get(id);if(!obj)continue;
      obj.getWorldPosition(p);p.project(this.camera);
      const x=(p.x+1)*.5*rect.width,y=(-p.y+1)*.5*rect.height;
      const visible=p.z>-1&&p.z<1&&x>70&&x<rect.width-65&&y>155&&y<rect.height-100;
      el.classList.toggle("invisible",!visible);el.classList.toggle("active",id===this.selected);el.style.left=x+"px";el.style.top=y+"px";
    }
  }
  animate(){
    requestAnimationFrame(()=>this.animate());
    const delta=Math.min(this.clock.getDelta(),.06);this.time+=delta;
    if(this.autoRotate)this.pivot.rotation.y+=delta*.095;
    this.interior.scale.lerp(new THREE.Vector3(this.targetScale,this.targetScale,this.targetScale),Math.min(1,delta*2.2));
    if(this.vacuole){const target=this.osmosisRunning?(this.osmosis==="out"?.69:this.osmosis==="in"?1.07:1):1;const current=this.vacuole.scale.x;this.vacuole.scale.setScalar(current+(target-current)*Math.min(1,delta*2.6));}
    this.waterPhase+=delta;
    if(this.water.visible){for(const drop of this.droplets){const d=drop.userData, t=(d.phase+this.waterPhase*d.speed*.25)%1;const mode=this.osmosis==="equal"?(this.droplets.indexOf(drop)%2===0?"in":"out"):this.osmosis;const r=mode==="in"?1.85-t*1.75:.26+t*1.7;drop.position.set(Math.cos(d.angle)*r,Math.sin(d.angle)*r*.77,Math.sin(d.angle*3)*.25);drop.scale.setScalar((.55+Math.sin(t*Math.PI)*.55)*d.radius/.032);drop.material.opacity=.25+.65*Math.sin(t*Math.PI);}}
    const target=this.orgMap.get(this.selected);
    this.highlight.visible=!!target&&this.mode==="explore";
    if(target&&this.highlight.visible){const p=new THREE.Vector3();target.getWorldPosition(p);this.highlight.position.copy(p);this.highlight.quaternion.copy(this.camera.quaternion);const base=this.selected==="nucleus"?.49:this.selected==="vacuole"?.8:this.selected==="membrane"||this.selected==="wall"?1.3:.29;const s=base*(1+.055*Math.sin(this.time*2.6));this.highlight.scale.setScalar(s);this.highlight.material.opacity=.42+.22*Math.sin(this.time*2);}
    this.updateLabels();this.renderer.render(this.scene,this.camera);
  }
}
