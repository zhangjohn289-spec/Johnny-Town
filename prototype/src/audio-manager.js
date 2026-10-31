import {createAudioStore} from './audio-store.js';
export const AMBIENCE=['town','woods','meadow','lake','valley','ruins'];
const EFFECTS=['open','close','confirm','fortune'];
// One game-owned controller survives scene restarts. Phaser owns sound objects,
// gains and decoded buffers; this helper owns only intent, lazy IO and envelopes.
export function createTownAudio({sound,cache,store=createAudioStore(),doc=globalThis.document,
 fetchFile=globalThis.fetch,base=import.meta.env?.BASE_URL||'/Johnny-Town/',
 raf=globalThis.requestAnimationFrame,cancel=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const context=sound?.context,subscribers=new Set(),pending=new Map(),failed=new Set(),effects=new Set(),controllers=new Set();
 let settings=store.read(),activated=false,dead=false,desired=null,current=null,frame=0,last=0,loading=null,activation=0,activating=false,warning='',lastEffect=-Infinity;
 const usable=()=>!!context&&!!sound?.add&&context.state!=='closed';
 const canPlay=()=>!dead&&settings.enabled&&settings.volume>0&&activated&&!doc.hidden&&context?.state==='running';
 const snapshot=()=>({...settings,activated,activating,supported:usable(),region:desired,playing:current?.id||null,effects:effects.size,warning,loaded:pending.size});
 const emit=()=>{for(const fn of subscribers)fn(snapshot());};
 // Phaser's game-destroy listeners may dispose the SoundManager before ours.
 // Its already-destroyed instances have pendingRemove set and need no removal.
 const remove=s=>{if(s&&!s.pendingRemove)sound.remove(s);};
 function stop(){if(frame)cancel(frame);frame=0;if(current)remove(current.sound);current=null;for(const s of effects)remove(s);effects.clear();}
 // No background retries. A failed key is retried only by another explicit enable.
 function load(id){
  const key='town-audio-'+id;if(cache?.exists(key))return Promise.resolve(key);
  if(failed.has(id))return Promise.resolve(null);
  if(pending.has(id))return pending.get(id);
  const controller=new AbortController();controllers.add(controller);
  const timer=setTimeout(()=>controller.abort(),8000);
  const task=(async()=>{try{
   const response=await fetchFile(base+'audio/'+id+'.wav',{signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.arrayBuffer();if(dead||controller.signal.aborted)return null;
   const buffer=await Promise.race([context.decodeAudioData(data),new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Error('decode timeout')),{once:true}))]);
   if(dead)return null;cache.add(key,buffer);return key;
  }catch{if(!dead){failed.add(id);warning='部分声音暂不可用；探索不受影响。';emit();}return null;}
  finally{clearTimeout(timer);controllers.delete(controller);}})();pending.set(id,task);return task;
 }
 function schedule(){if(!frame&&!dead){last=now();frame=raf(tick);}}
 function reconcile(){
  if(!canPlay()){stop();emit();return;}
  if(current){schedule();return;}
  if(!desired||loading===desired)return;
  const id=desired;loading=id;
  load(id).then(key=>{if(loading===id)loading=null;
   if(key&&canPlay()&&desired===id&&!current){try{const s=sound.add(key,{loop:true,volume:0});if(s.play()){current={id,sound:s,gain:0};schedule();}else{remove(s);warning='浏览器未能播放声音，请再次点击启用。';activated=false;}}catch{warning='声音暂不可用；探索不受影响。';activated=false;}emit();}
   // A newer region may have replaced an in-flight request.
   if(desired!==id&&!current)reconcile();
  });
 }
 function tick(){frame=0;if(!canPlay()){stop();emit();return;}if(!current){reconcile();return;}
  const time=now(),dt=Math.min(100,time-last);last=time;
  const target=current.id===desired?1:0,step=dt/450;
  current.gain=target?Math.min(1,current.gain+step):Math.max(0,current.gain-step);
  current.sound.setVolume(current.gain*settings.volume/100*.8);
  if(!target&&current.gain===0){remove(current.sound);current=null;emit();reconcile();return;}
  if(current.gain!==target)frame=raf(tick);
 }
 function visibility(){if(doc.hidden){stop();emit();}else reconcile();}
 function stateChange(){if(context.state!=='running'){activated=false;stop();}emit();}
 doc.addEventListener('visibilitychange',visibility);context?.addEventListener('statechange',stateChange);
 const api={
  snapshot,subscribe(fn){subscribers.add(fn);fn(snapshot());return ()=>subscribers.delete(fn);},
  setRegion(id){desired=AMBIENCE.includes(id)?id:null;reconcile();},
  async enable(){
   if(dead||activating)return false;
   settings=store.set({enabled:true});warning='';for(const id of failed)pending.delete(id);failed.clear();
   if(!usable()){warning='此浏览器暂不支持声音；可以继续静音探索。';emit();return false;}
   const ticket=++activation;activating=true;emit();let timeout;
   try{
    // Called directly from the control's click, before any network await.
    await Promise.race([context.resume(),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('blocked')),2500);})]);
    if(ticket!==activation||dead)return false;
    activated=context.state==='running';if(!activated)throw Error('not running');
    for(const id of EFFECTS)load(id);reconcile();return true;
   }catch{if(ticket===activation){activated=false;warning='浏览器未允许声音，请点击「启用声音」重试。';}return false;}
   finally{clearTimeout(timeout);if(ticket===activation){activating=false;emit();}}
  },
  mute(){++activation;activating=false;activated=false;settings=store.set({enabled:false});stop();emit();},
  volume(value){settings=store.set({volume:value});if(current)current.sound.setVolume(current.gain*settings.volume/100*.8);for(const s of effects)s.setVolume(settings.volume/100*.6);reconcile();emit();},
  effect(id){
   if(!EFFECTS.includes(id)||!canPlay()||now()-lastEffect<90)return;
   const key='town-audio-'+id;if(!cache.exists(key))return; // Never play stale feedback after loading.
   lastEffect=now();if(effects.size>=3)return;
   try{const s=sound.add(key,{volume:settings.volume/100*.6});effects.add(s);s.once('complete',()=>{effects.delete(s);remove(s);});if(!s.play()){effects.delete(s);remove(s);}}catch{/* Optional feedback must never interrupt UI. */}
  },
  destroy(){if(dead)return;dead=true;++activation;stop();for(const c of controllers)c.abort();doc.removeEventListener('visibilitychange',visibility);context?.removeEventListener('statechange',stateChange);subscribers.clear();},
 };
 return api;
}
