// Landing page + Login/Sign up (real photos, no emoji stickers)
/* ---------- Real photos (Unsplash, free license; needs internet) ---------- */
const UN=(id,w)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w||1200}&q=70`;
const PH={
  street:'1743362620071-f0ae50f42df2',
  aerial:'1516156008625-3a9d6067fab5',
  market:'1694892671389-642241672449',
  stall:'1775719842668-de7a71ff87ae',
  vendor:'1773252668203-d4ff23e182d9',
  baskets:'1765480953875-a7338f896e91',
  talk:'1548964643-c881abfc1046',
  meeting:'1714974528714-1eaf201fa508'
};
/* <img> that hides itself if the photo cannot load, so no broken-image icon */
const Photo=({id,w,alt,cls})=>html`<img src=${UN(PH[id],w)} alt=${alt||''} loading="lazy" class=${'object-cover '+(cls||'w-full h-full')} onError=${e=>{e.target.style.display='none'}} />`;

/* Neighbourhood adverts (shown on landing + login/signup) */
const ADS=[
  {img:'market',tk:'ad1',dk:'ad1d'},
  {img:'vendor',tk:'ad2',dk:'ad2d'},
  {img:'baskets',tk:'ad3',dk:'ad3d'}
];
function AdCard({a,compact}){
  const {t}=useC();
  return html`<div class="bg-white/95 backdrop-blur rounded-xl overflow-hidden shadow flex text-gray-800 text-left">
    <div class=${compact?'w-20 shrink-0':'w-28 shrink-0'}><${Photo} id=${a.img} w=${400} alt=${t(a.tk)} /></div>
    <div class="p-2.5 min-w-0"><span class="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold">${t('sponsored')}</span>
      <div class="font-semibold text-sm leading-tight">${t(a.tk)}</div><div class="text-xs text-gray-600">${t(a.dk)}</div></div></div>`;
}

/* ---------- Landing ---------- */
function Landing(){
  const {t,go,me}=useC();
  const feats=[['market','f1'],['meeting','f2'],['talk','f3']];
  return html`<div>
    <section class="bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500 text-white">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2">
        <div class="px-6 py-14 md:py-20 flex flex-col justify-center">
          <p class="font-medium mb-3 text-sm sm:text-base">${t('tagline')}</p>
          <h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight">${t('heroTitle')}</h1>
          <p class="mb-7 text-base sm:text-lg max-w-md">${t('heroText')}</p>
          <div class="flex gap-3"><button class="px-6 py-3 rounded-lg bg-white text-emerald-700 font-semibold shadow" onClick=${()=>go(me?'dashboard':'signup')}>${t('getStarted')}</button>
            ${!me&&html`<button class="px-6 py-3 rounded-lg border border-white font-semibold hover:bg-white/10" onClick=${()=>go('login')}>${t('login')}</button>`}</div></div>
        <div class="h-56 md:h-auto md:min-h-[360px]"><${Photo} id="street" w=${1400} alt="Neighborhood street" /></div></div></section>

    <section class="max-w-6xl mx-auto px-4 py-10"><h2 class="text-2xl font-bold text-center text-emerald-800 mb-6">${t('features')}</h2>
      <div class="grid sm:grid-cols-3 gap-4">${feats.map(([p,k])=>html`<div key=${k} class="bg-white rounded-xl shadow-sm border overflow-hidden fade">
        <div class="h-40"><${Photo} id=${p} w=${700} alt=${t(k)} /></div>
        <div class="p-4"><h3 class="font-semibold">${t(k)}</h3><p class="text-sm text-gray-600">${t(k+'d')}</p></div></div>`)}</div></section>

    <section class="max-w-6xl mx-auto px-4 pb-10"><h2 class="text-xl font-bold text-emerald-800 mb-3">${t('localAds')}</h2>
      <div class="grid md:grid-cols-3 gap-3">${ADS.map(a=>html`<div key=${a.tk} class="shadow-sm border rounded-xl overflow-hidden bg-emerald-50"><${AdCard} a=${a} /></div>`)}</div></section>

    <section class="relative h-64 sm:h-80 overflow-hidden">
      <${Photo} id="aerial" w=${1600} alt="Neighborhood from above" />
      <div class="absolute inset-0 bg-emerald-900/55 flex items-center justify-center text-center text-white px-4"><div>
        <h2 class="text-2xl sm:text-3xl font-bold mb-3">${t('bottomTitle')}</h2>
        <button class="px-6 py-3 rounded-lg bg-white text-emerald-700 font-semibold" onClick=${()=>go(me?'dashboard':'signup')}>${t('getStarted')}</button></div></div></section>
    <footer class="text-center text-xs text-gray-500 py-4">NeighborHub · ${t('tagline')}</footer></div>`;
}

/* ---------- Login / Sign up ---------- */
function Auth({mode}){
  const {t,users,setUsers,setMeId,go}=useC();
  const [m,setM]=useState(mode);const [err,setErr]=useState('');
  const fields=m==='login'?[{k:'email',type:'email',req:1},{k:'password',type:'password',req:1}]
    :[{k:'name',req:1},{k:'email',type:'email',req:1},{k:'password',type:'password',req:1},{k:'role',o:['resident','business','admin']}];
  const submit=v=>{
    if(m==='login'){const u=users.find(x=>x.email.toLowerCase()===v.email.toLowerCase()&&x.password===v.password);
      if(!u)return setErr(t('badLogin'));setMeId(u.id);go('dashboard')}
    else{if(users.some(x=>x.email.toLowerCase()===v.email.toLowerCase()))return setErr(t('emailUsed'));
      const u={id:uid(),...v};setUsers([...users,u]);setMeId(u.id);go('dashboard')}};
  return html`<div class="max-w-5xl mx-auto p-4 mt-4 grid md:grid-cols-2 gap-4 items-stretch">
    <div class=${CARD+' self-center'}>
      <h1 class="text-xl font-bold mb-3">${m==='login'?t('login'):t('signup')}</h1>
      ${err&&html`<p class="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">${err}</p>`}
      <${Form} key=${m} fields=${fields} init=${{}} onSubmit=${submit} />
      <p class="text-sm mt-3">${m==='login'?t('noAcc'):t('haveAcc')} <button class="text-emerald-700 underline" onClick=${()=>{setErr('');setM(m==='login'?'signup':'login')}}>${m==='login'?t('signup'):t('login')}</button></p>
      ${m==='login'&&html`<p class="text-xs text-gray-500 mt-3">Demo: admin@demo.com / admin123 · resident@demo.com / demo123</p>`}</div>
    <div class="relative rounded-xl overflow-hidden min-h-[420px] bg-emerald-700 text-white fade">
      <div class="absolute inset-0"><${Photo} id="street" w=${1000} alt="Neighborhood" /></div>
      <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/30 to-transparent"></div>
      <div class="relative h-full flex flex-col justify-end p-4 gap-2">
        <h2 class="text-xl font-bold">${t('heroTitle')}</h2><p class="text-sm mb-1">${t('tagline')}</p>
        ${ADS.map(a=>html`<${AdCard} key=${a.tk} a=${a} compact=${true} />`)}</div></div></div>`;
}
