export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const uniq=a=>[...new Set(a.filter(x=>x!==undefined&&x!==null&&x!==''))];
export const it=n=>Number(n).toLocaleString('it-IT');
export const taxa={arcaico:'Homo di attribuzione indeterminata',affine:'H. heidelbergensis e forme affini',neanderthal:'H. neanderthalensis',sapiens:'H. sapiens',controverso:'Attribuzioni controverse o multiple',tracce:'Presenza umana, specie indeterminata'};
export const kinds={corporeo:'Resti corporei',impronte:'Impronte',archeologia:'Contesto archeologico',escluso:'Fuori dall’intervallo o escluso'};
export const tax=s=>taxa[s]||s||'Non determinabile';
export const href=(r,id)=>'#'+r+(id?'/' + encodeURIComponent(id):'');
export const link=(r,id,label,cls='')=>'<a class="'+esc(cls)+'" href="'+esc(href(r,id))+'">'+esc(label)+'</a>';
export const door=(r,id,title,sub='')=>'<a class="door" href="'+esc(href(r,id))+'"><span>'+esc(title)+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><b aria-hidden="true">↗</b></a>';
export const doorGrid=items=>'<div class="doorlist">'+items.join('')+'</div>';
export const ext=(url,label)=>/^https?:\/\//i.test(url||'')?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>':esc(label);
export const block=(title,body)=>body?'<section class="block"><h2>'+esc(title)+'</h2>'+body+'</section>':'';
export const text=v=>v==null||v===''?'':Array.isArray(v)?v.map(text).filter(Boolean).join(' · '):typeof v==='object'?Object.entries(v).map(([k,x])=>k+' — '+text(x)).join(' · '):String(v);
export const facts=rows=>'<dl class="facts">'+rows.filter(([,v])=>v!==null&&v!==undefined&&v!=='').map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(text(v))+'</dd>').join('')+'</dl>';
export const dateText=o=>Number.isFinite(o.older)&&Number.isFinite(o.younger)?(o.older===o.younger?'circa '+it(o.older):it(o.older)+'–'+it(o.younger))+' anni'+(o.scale?' · '+o.scale:' BP'):text(o.chronology||o.dateLabel||o.period||'Cronologia numerica non disponibile');
export const matches=(terms,name)=>{const str=norm(name);return (terms||[]).some(t=>{const n=norm(t);return n.length>=4&&(str.includes(n)||n.includes(str)&&str.length>=5)})};
export function photoCard(im){return '<figure><a href="'+esc(im.path)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+esc(im.path)+'" alt="'+esc(im.title)+'"></a><figcaption><small>'+esc(im.category)+(im.generated?' · IA':'')+'</small><strong>'+esc(im.title)+'</strong>'+esc(im.author||'')+' '+(im.licenseUrl?ext(im.licenseUrl,im.license):esc(im.license||''))+(im.changes?' · '+esc(im.changes):'')+'<details><summary>'+(im.generated?'Basi scientifiche e scelte visive':'Provenienza')+'</summary>'+esc(im.evidence||'')+' '+ext(im.url,im.source||'Fonte originale')+(im.prompt?'<p>'+esc(im.prompt)+'</p>':'')+'</details></figcaption></figure>'}
export const gallery=items=>items.length?'<div class="gallery">'+items.map(photoCard).join('')+'</div>':'';
export const sourceList=(db,ids)=>uniq(ids||[]).map(id=>db.sources.find(s=>s.id===id)).filter(Boolean).map(s=>'<div class="biblioline">'+link('fonte',s.id,s.title||('Riferimento '+s.id),'refTitle')+'<small>'+esc(text(s.authors))+' · '+esc(s.year||'s.d.')+' · '+esc(s.type||'Fonte')+'</small></div>').join('');
export function page(title,sub,section,content){return '<div class="wrap"><header class="pagehead"><div class="crumb">'+link('inizio','', 'Atlante d’Italia')+' / '+esc(section)+'</div><span class="kicker">'+esc(section)+'</span><h1>'+esc(title)+'</h1>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</header><div class="pagebody">'+content+'</div></div>'}
export const sitesFor=(db,names)=>db.sites.filter(s=>matches(names,s.name)||matches(names,s.aliases?.join(' ')||''));
export const articlesFor=(db,site)=>db.articles.filter(a=>matches(a.siteNames,site.name));
