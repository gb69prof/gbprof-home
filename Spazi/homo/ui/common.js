export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const supported=level=>['Documentato','Fortemente supportato'].includes(level);
export const link=(url,title)=>/^https?:\/\//.test(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>`:esc(title);
export function sourceCard(s){return `<div class="source"><strong>${link(s.url||'',s.title)}</strong>${s.authors?esc([s.authors,s.year,s.journal].filter(Boolean).join(' · ')):''}${s.type?' · '+esc(s.type):''}${s.evidence?'<p>'+esc(s.evidence)+'</p>':''}${s.limits?'<p class="small">'+esc(s.limits)+'</p>':''}${s.doi?'<small>DOI '+esc(s.doi)+'</small>':''}</div>`}
export function cites(list=[],refs={}){const items=list.map(s=>typeof s==='string'?refs[s]:s).filter(Boolean);return items.length?`<details class="citations"><summary>Fonti e limiti (${items.length})</summary>${items.map(sourceCard).join('')}</details>`:''}
export const levelTag=l=>`<span class="level">${esc(l)}</span>`;
export const fmt=v=>Number(v).toLocaleString('it-IT',{maximumFractionDigits:2});
export const getJSON=async path=>{const r=await fetch(path);if(!r.ok)throw Error(path+' HTTP '+r.status);return r.json()};
export function download(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
export function csv(rows){return '\ufeff'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')}
export function storeRead(key,fallback){try{return JSON.parse(localStorage.getItem('homo.atlante.'+key))??fallback}catch{return fallback}}
export function storeWrite(key,v){try{localStorage.setItem('homo.atlante.'+key,JSON.stringify(v));return true}catch{return false}}
