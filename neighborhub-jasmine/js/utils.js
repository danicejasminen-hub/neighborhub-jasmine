// React setup, useLocalStorage hook and small helpers
const {useState,useEffect,useContext,createContext,useRef}=React;
const html=htm.bind(React.createElement);

/* ---------- Persistent storage hook ---------- */
function useLocalStorage(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init}catch(e){return init}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}},[key,v]);
  return [v,setV];
}

/* ---------- Helpers ---------- */
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const off=n=>{const d=new Date();d.setDate(d.getDate()+n);return ymd(d)};
const uid=()=>Math.random().toString(36).slice(2,9);
const upsert=(set,it)=>set(l=>l.some(x=>x.id===it.id)?l.map(x=>x.id===it.id?it:x):[it,...l]);
const remove=(set,id)=>set(l=>l.filter(x=>x.id!==id));

