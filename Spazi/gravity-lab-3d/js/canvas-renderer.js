import * as THREE from 'three';
// Software projection fallback for browsers without WebGL2. Physics and camera
// are unchanged; Three.js supplies scene transforms and perspective projection.
export class CanvasRenderer {
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.ratio=1;this.vector=new THREE.Vector3();}
 setPixelRatio(r){this.ratio=Math.min(r,1.5);}
 setClearColor(){}
 setSize(w,h){this.width=w;this.height=h;this.domElement.width=w*this.ratio;this.domElement.height=h*this.ratio;this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';}
 project(x,y,z,matrix,camera){const v=this.vector.set(x,y,z);if(matrix)v.applyMatrix4(matrix);v.project(camera);return{x:(v.x+1)*this.width/2,y:(1-v.y)*this.height/2,z:v.z};}
 render(scene,camera){scene.updateMatrixWorld();camera.updateMatrixWorld();const ctx=this.ctx,w=this.width,h=this.height;ctx.setTransform(this.ratio,0,0,this.ratio,0,0);ctx.clearRect(0,0,w,h);const bodies=[];
 scene.traverseVisible(o=>{if(o.isSprite)return;if(o.isMesh){if(o.userData.body)bodies.push(o);return;}if(!o.geometry)return;
 const p=o.geometry.attributes.position;if(!p)return;ctx.strokeStyle=o.material.color.getStyle();ctx.fillStyle=ctx.strokeStyle;ctx.globalAlpha=o.material.opacity??1;
 if(o.isPoints){for(let i=0;i<p.count;i++){const q=this.project(p.getX(i),p.getY(i),p.getZ(i),o.matrixWorld,camera);if(q.z>-1&&q.z<1)ctx.fillRect(q.x,q.y,1.1,1.1);}return;}
 if(!o.isLine)return;ctx.lineWidth=o.material.isLineDashedMaterial?1.6:o.material.color.getHex()===0x75f5b7?2.2:.7;ctx.setLineDash(o.material.isLineDashedMaterial?[7,6]:[]);ctx.beginPath();
 if(o.isLineSegments){const idx=o.geometry.index;for(let i=0;i<idx.count;i+=2){const a=idx.getX(i),b=idx.getX(i+1),u=this.project(p.getX(a),p.getY(a),p.getZ(a),o.matrixWorld,camera),v=this.project(p.getX(b),p.getY(b),p.getZ(b),o.matrixWorld,camera);if(u.z<1&&v.z<1&&u.z>-1&&v.z>-1){ctx.moveTo(u.x,u.y);ctx.lineTo(v.x,v.y);}}}else{let first=true;const end=Math.min(p.count,o.geometry.drawRange.count);for(let i=0;i<end;i++){const q=this.project(p.getX(i),p.getY(i),p.getZ(i),o.matrixWorld,camera);if(q.z>=1||q.z<=-1){first=true;continue;}if(first){ctx.moveTo(q.x,q.y);first=false;}else ctx.lineTo(q.x,q.y);}}
 ctx.stroke();ctx.setLineDash([]);});
 bodies.sort((a,b)=>b.position.distanceToSquared(camera.position)-a.position.distanceToSquared(camera.position));ctx.globalAlpha=1;
 for(const m of bodies){const b=m.userData.body,q=this.project(b.x,0,b.z,null,camera);if(q.z>1||q.z< -1)continue;const dist=m.position.distanceTo(camera.position),r=Math.max(2,b.radius*h/(2*Math.tan(camera.fov*Math.PI/360)*dist));
 if(b.kind==='Stella'){const glow=ctx.createRadialGradient(q.x,q.y,r*.1,q.x,q.y,r*3);glow.addColorStop(0,'#ffca6d77');glow.addColorStop(1,'#ffad3000');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(q.x,q.y,r*3,0,Math.PI*2);ctx.fill();}
 const g=ctx.createRadialGradient(q.x-r*.3,q.y-r*.4,0,q.x,q.y,r);g.addColorStop(0,b.kind==='Stella'?'#fff2c7':b.color);g.addColorStop(1,b.kind==='Stella'?'#ffb34e':'#20384a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fill();if(b.kind!=='Asteroide'){ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillStyle=b.kind==='Stella'?'#ffd393':'#bfd0df';ctx.fillText(b.name.toUpperCase(),q.x,q.y-r-10);}}
 }
}
