// Configure only verified, licensed HTML5 media. Platform pages are not video URLs.
const localEnabled=import.meta.env?.DEV && typeof __LOCAL_VIDEO_ENABLED__!=='undefined' && __LOCAL_VIDEO_ENABLED__;
export const mediaConfig=localEnabled
 ? {url:import.meta.env.BASE_URL+'__local-video',sourceUrl:null,confirmed:true}
 : {url:null,sourceUrl:null,confirmed:false};
export async function attemptPlayback(video,status,isActive=()=>true){
 const loadFailed=()=>{if(!video.error)return false;status.textContent='视频加载失败，请重试或稍后再来。';return true;};
 try{await video.play();if(!isActive()){video.pause();return;}status.textContent='正在播放';}
 catch{if(!isActive()||loadFailed())return;video.muted=true;try{await video.play();if(!isActive()){video.pause();return;}status.textContent='已静音播放，请点击“开启声音”。';}catch{if(isActive()&&!loadFailed())status.textContent='自动播放受限，请点击“手动播放”。';}}
}
export function mountMedia(root,config=mediaConfig){
 const status=document.createElement('p');status.setAttribute('role','status');root.append(status);
 let generation=0,disposed=false;
 const stop=()=>{const v=root.querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load();v.remove();}};
 const play=v=>{const attempt=generation;void attemptPlayback(v,status,()=>!disposed&&attempt===generation);};
 const start=()=>{generation++;stop();
 if(!config.confirmed||!config.url){status.textContent='宝箱里的影片暂时无法播放，请稍后再来。';return;}
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.src=config.url;video.preload='metadata';root.prepend(video);const attempt=generation;video.onerror=()=>{if(!disposed&&attempt===generation)status.textContent='视频加载失败，请重试或稍后再来。';};play(video);};
 const controls=document.createElement('div');for(const [label,fn] of [['重试',start],['手动播放',()=>{const v=root.querySelector('video');if(v)play(v);}],['开启声音',()=>{const v=root.querySelector('video');if(v){v.muted=false;play(v);}}]]){const b=document.createElement('button');b.textContent=label;b.onclick=fn;controls.append(b);}root.append(controls);
 if(config.confirmed&&config.sourceUrl){const link=document.createElement('a');link.href=config.sourceUrl;link.textContent='前往来源观看';link.target='_blank';link.rel='noopener noreferrer';root.append(link);}start();return ()=>{disposed=true;generation++;stop();};
}
