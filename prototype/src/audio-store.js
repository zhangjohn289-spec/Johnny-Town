export const AUDIO_KEY='johnny-town.audio.v1';
export function createAudioStore({storage=()=>globalThis.localStorage}={}){
 let value={enabled:false,volume:50},persistent=true;
 let saved=null;try{saved=storage().getItem(AUDIO_KEY);}catch{persistent=false;}
 try{const raw=JSON.parse(saved);if(raw?.version===1&&typeof raw.enabled==='boolean'&&Number.isFinite(raw.volume)&&raw.volume>=0&&raw.volume<=100)value={enabled:raw.enabled,volume:raw.volume};}catch{/* Corrupt settings are not a storage-access failure. */}
 return {read:()=>({...value,persistent}),set(patch){value={...value,...patch,volume:Math.max(0,Math.min(100,Number.isFinite(patch.volume)?patch.volume:value.volume))};try{storage().setItem(AUDIO_KEY,JSON.stringify({version:1,...value}));}catch{persistent=false;}return this.read();}};
}
