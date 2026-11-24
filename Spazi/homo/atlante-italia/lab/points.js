// Draw only the published landmark coordinates. No edges or surfaces are inferred.
let dataset;
export async function mountPoints(host,key){
  dataset??=fetch(new URL('./models/landmarks.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('dataset');return r.json();}).catch(e=>{dataset=null;throw e;});
  const rows=(await dataset)[key];
  if(!rows)throw Error('punti non disponibili');
  const mean=[0,1,2].map(i=>rows.reduce((t,row)=>t+row[i],0)/rows.length);
  const points=rows.map(p=>p.map((x,i)=>x-mean[i]));
  const radius=Math.max(...points.map(p=>Math.hypot(...p)));
  host.innerHTML='<svg viewBox="-150 -105 300 210" class="hl-landmarks" role="img" aria-label="Nuvola di 125 coordinate anatomiche pubblicate, ruotabile con i controlli."></svg><label class="hl-field">Rotazione orizzontale <input type="range" min="-180" max="180" value="0" step="2"></label><label class="hl-field">Inclinazione <input type="range" min="-90" max="90" value="25" step="2"></label><label class="hl-field">Ingrandimento <input type="range" min="70" max="160" value="100" step="5"></label><p class="hl-model-credit">125 punti · scala normalizzata per la lettura della forma. Coordinate di Piccirilli et al. (2025), <a href="https://doi.org/10.6092/unibo/amsacta/8337" target="_blank" rel="noopener">AMS Acta</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.</p>';
  const svg=host.querySelector('svg'),controls=[...host.querySelectorAll('input')];
  function redraw(){
    const [yaw,pitch,zoom]=controls.map(c=>+c.value),a=yaw*Math.PI/180,b=pitch*Math.PI/180;
    const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),k=82*zoom/100/radius;
    const sorted=points.map(([x,y,z])=>{const h=x*ca+z*sa,d=-x*sa+z*ca;return [h,k*(-y*cb+d*sb),y*sb+d*cb];}).sort((p,q)=>p[2]-q[2]);
    svg.innerHTML=sorted.map(([x,y,z])=>{const light=(z/radius+1)/2;return `<circle cx="${(k*x).toFixed(2)}" cy="${y.toFixed(2)}" r="${(1.5+light).toFixed(2)}" fill="hsl(192 36% ${35+light*32}%)" stroke="#edf3f0" stroke-width=".25"/>`;}).join('');
  }
  controls.forEach(c=>c.oninput=redraw);redraw();
}
