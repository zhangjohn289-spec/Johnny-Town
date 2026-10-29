// Only configure a URL after its source and embedding/usage conditions are confirmed.
// Self-owned or explicitly licensed HTML5 video URLs only; never scrape a platform video URL.
export const mediaConfig={url:null,sourceUrl:null,confirmed:false};
export async function attemptPlayback(video,status){
 try{await video.play();status.textContent='正在播放';}
 catch{video.muted=true;try{await video.play();status.textContent='已静音播放，请点击“开启声音”。';}catch{status.textContent='自动播放受限，请点击“手动播放”。';}}
}
export function mountMedia(root,config=mediaConfig){
 const status=document.createElement('p');status.setAttribute('role','status');root.append(status);
 const start=()=>{root.querySelector('video')?.remove();
 if(!config.confirmed||!config.url){status.textContent='媒体来源尚未确认，当前无法播放。播放器接口已准备好，确认可用来源后再启用。';return;}
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.src=config.url;video.preload='metadata';root.prepend(video);video.onerror=()=>{status.textContent='视频加载失败，请重试或稍后再来。';};void attemptPlayback(video,status);};
 const controls=document.createElement('div');for(const [label,fn] of [['重试',start],['手动播放',()=>{const v=root.querySelector('video');if(v)void attemptPlayback(v,status);}],['开启声音',()=>{const v=root.querySelector('video');if(v){v.muted=false;void attemptPlayback(v,status);}}]]){const b=document.createElement('button');b.textContent=label;b.onclick=fn;controls.append(b);}root.append(controls);
 if(config.confirmed&&config.sourceUrl){const link=document.createElement('a');link.href=config.sourceUrl;link.textContent='前往来源观看';link.target='_blank';link.rel='noopener noreferrer';root.append(link);}start();return ()=>{const v=root.querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load();v.remove();}};
}
