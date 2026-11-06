// Shared UI: Modal, Form, Header, Shell (navigation)
/* ---------- Shared UI ---------- */
const INP='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white';
const B1='px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium';
const B2='px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm';
const BR='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm';
const CARD='bg-white rounded-xl shadow-sm border p-4 fade';
const CC={meeting:'bg-blue-500',garbage:'bg-gray-500',market:'bg-amber-500',vendorHours:'bg-emerald-500',event:'bg-purple-500'};
const SC=['meeting','garbage','market','vendorHours','event'];

function Modal({title,onClose,children}){
  return html`<div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40" onClick=${onClose}>
    <div class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto sb p-5 fade" onClick=${e=>e.stopPropagation()}>
      <h3 class="font-bold text-lg mb-3">${title}</h3>${children}</div></div>`;
}

/* Generic validated form. fields: [{k, type, o(options), req, l(label key)}] */
function Form({fields,init,onSubmit,onCancel,onDelete}){
  const {t}=useC();
  const [v,setV]=useState({...Object.fromEntries(fields.filter(f=>f.o).map(f=>[f.k,f.o[0]])),...init});
  const [er,setEr]=useState({});
  const set=(k,x)=>setV({...v,[k]:x});
  const submit=e=>{e.preventDefault();const x={};
    fields.forEach(f=>{const val=String(v[f.k]||'').trim();
      if(f.req&&!val)x[f.k]=t('required');
      else if(f.type==='email'&&val&&!/^\S+@\S+\.\S+$/.test(val))x[f.k]=t('invalid')});
    setEr(x);if(!Object.keys(x).length)onSubmit(v)};
  return html`<form onSubmit=${submit} class="space-y-3" noValidate>
    ${fields.map(f=>html`<div key=${f.k}>
      <label class="block text-sm font-medium mb-1">${t(f.l||f.k)}${f.req?' *':''}</label>
      ${f.o?html`<select class=${INP} value=${v[f.k]||''} onChange=${e=>set(f.k,e.target.value)}>${f.o.map(o=>html`<option key=${o} value=${o}>${t(o)}</option>`)}</select>`
      :f.type==='textarea'?html`<textarea rows="3" class=${INP} value=${v[f.k]||''} onChange=${e=>set(f.k,e.target.value)}></textarea>`
      :html`<input type=${f.type||'text'} class=${INP} value=${v[f.k]||''} onChange=${e=>set(f.k,e.target.value)} />`}
      ${er[f.k]&&html`<p class="text-red-600 text-xs mt-1">${er[f.k]}</p>`}</div>`)}
    <div class="flex justify-between gap-2 pt-1">
      <div>${onDelete&&html`<button type="button" class=${BR} onClick=${onDelete}>${t('delete')}</button>`}</div>
      <div class="flex gap-2">${onCancel&&html`<button type="button" class=${B2} onClick=${onCancel}>${t('cancel')}</button>`}<button class=${B1}>${t('save')}</button></div>
    </div></form>`;
}
const Head=({title,children})=>html`<div class="flex flex-wrap items-center justify-between gap-2 mb-4"><h1 class="text-2xl font-bold text-emerald-800">${title}</h1><div class="flex flex-wrap gap-2">${children}</div></div>`;
/* ---------- Line icons (replace emoji) ---------- */
const ICONS={
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6a8 8 0 0 1 0 12"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5a5 5 0 0 1 4.5 5"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 8h6"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  inbox:'<path d="M3 13l3-8h12l3 8"/><path d="M3 13v6h18v-6h-5l-1 2h-6l-1-2z"/>',
  pin:'<path d="M12 17v5"/><path d="M8 3h8l-1 6 3 4H6l3-4z"/>',
  store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  mapPin:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
};
const Ico=({n,cls})=>html`<svg class=${cls||'inline w-4 h-4 -mt-0.5 mr-1'} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" dangerouslySetInnerHTML=${{__html:ICONS[n]||''}}></svg>`;
const Empty=()=>{const {t}=useC();return html`<div class="text-center text-gray-500 py-10 border-2 border-dashed rounded-xl"><${Ico} n="inbox" cls="inline w-5 h-5 -mt-1 mr-1" />${t('empty')}</div>`};

/* ---------- Header + navigation ---------- */
const NAV=[['dashboard','home'],['announcements','megaphone'],['schedule','clock'],['calendar','calendar'],['chat','chat'],['contacts','users'],['guidelines','book'],['reports','flag'],['settings','cog']];
function Header(){
  const {t,lang,setLang,me,go,setMeId}=useC();
  return html`<header class="bg-white border-b sticky top-0 z-30"><div class="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
    <button class="font-bold text-emerald-700 text-lg" onClick=${()=>go(me?'dashboard':'landing')}><svg class="inline w-6 h-6 -mt-1 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>${t('appName')}</button>
    <div class="flex items-center gap-2">
      <select class="border rounded-lg px-2 py-1 text-sm" value=${lang} onChange=${e=>setLang(e.target.value)} aria-label=${t('language')}><option value="en">English</option><option value="ceb">Bisaya</option><option value="tl">Tagalog</option></select>
      ${me?html`<span class="hidden sm:inline text-sm">${me.name}</span><button class=${B2} onClick=${()=>{setMeId(null);go('landing')}}>${t('logout')}</button>`
        :html`<button class=${B2} onClick=${()=>go('login')}>${t('login')}</button>`}
    </div></div></header>`;
}
function Shell({children}){
  const {t,page,go,unread}=useC();
  return html`<div class="md:flex gap-4 max-w-6xl mx-auto p-3">
    <nav class="md:w-52 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 shrink-0 sb">
      ${NAV.map(([k,i])=>html`<button key=${k} onClick=${()=>go(k)} class=${`whitespace-nowrap text-left px-3 py-2 rounded-lg text-sm ${page===k?'bg-emerald-600 text-white':'bg-white border hover:bg-emerald-50'}`}><${Ico} n=${i} />${t(k)}${k==='chat'&&unread>0?html` <span class="bg-red-500 text-white rounded-full px-1.5 text-xs">${unread}</span>`:''}</button>`)}
    </nav><main class="flex-1 min-w-0">${children}</main></div>`;
}

