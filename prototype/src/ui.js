import {createFortuneStore} from './fortune-store.js';
import {mountMedia} from './media.js';
const panel=document.querySelector('#panel'),body=document.querySelector('#body'),store=createFortuneStore();
let dispose=()=>{},onReturn=()=>{},previousFocus;
const intro=['你好，我是 Johnny，喜欢编程、音乐和游戏。','写代码时相信下一次能跑通，玩游戏时相信下一把能赢。','冷笑话是被动技能，搞怪是日常任务。','欢迎来我的小镇逛逛。如果感觉有点冷，可能是我的笑话生效了。'];
function paragraph(text,cls){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;body.append(p);return p;}
function shrine(){let timer,extractTimer;const drawResult=r=>{body.replaceChildren();paragraph('今日签文 · '+r.date,'eyebrow');paragraph(r.fortuneLevel,'fortune-level');paragraph(r.fortuneText,'paper');paragraph('娱乐签文，仅供一笑。');if(store.warning)paragraph(store.warning,'warning');};const existing=store.read();if(existing){drawResult(existing);return ()=>{};}paragraph('远道搬来的神社，今天也在认真营业。');const tube=paragraph('▥','tube');const button=document.createElement('button');button.textContent='抽签';body.append(button);if(store.warning)paragraph(store.warning,'warning');button.onclick=()=>{button.disabled=true;const result=store.draw();tube.classList.add('shake');button.textContent='签已保存，正在展开…';extractTimer=setTimeout(()=>{tube.classList.remove('shake');tube.textContent='│';button.textContent='签已抽出，正在展开…';},450);timer=setTimeout(()=>{if(panel.open)drawResult(result);},matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);};return ()=>{clearTimeout(timer);clearTimeout(extractTimer);};}
export function show(place,onClose){if(panel.open)return;previousFocus=document.activeElement;onReturn=onClose;document.querySelector('#title').textContent=place.name;body.replaceChildren();panel.showModal();
 if(place.id==='home'){intro.forEach(t=>paragraph(t));dispose=()=>{};}
 else if(place.id==='shrine')dispose=shrine();
 else if(place.id==='world'){dispose=()=>{};paragraph('沿路标步行，按 E 往返；尚未建成的区域暂不可进入。');const list=document.createElement('ul');list.className='region-list';for(const region of place.regions){const item=document.createElement('li');item.textContent=region.name+' — '+(!region.available?'尚未建成':place.state.regionId===region.id?'当前位置':place.state.discovered.includes(region.id)?'已发现':'未探索');list.append(item);}body.append(list);paragraph('累计跨区 '+place.state.progress.transitions+' 次；刷新后回到当前区域的安全路口。','eyebrow');}
 else{paragraph('▰','chest-open');dispose=mountMedia(body);}
 document.querySelector('#close').focus();}
panel.addEventListener('close',()=>{dispose();dispose=()=>{};body.replaceChildren();onReturn();previousFocus?.focus?.();});
document.querySelector('#close').onclick=()=>panel.close();
export const isOpen=()=>panel.open;
export const showNavigation=(regions,state,onClose)=>show({id:'world',name:'世界路书',regions,state},onClose);

