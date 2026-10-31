import {mountActivity} from './activity-ui.js';
import {renderDialogue} from './dialogue-ui.js';
import {renderSecret,renderGolden} from './ruins-ui.js';
import {createFortuneStore} from './fortune-store.js';
import {renderCityHall} from './city-hall.js';
import {renderChestLink} from './chest-link.js';
import {renderStory,renderJournal,getStory} from './story-ui.js';
import {renderWelcome,renderPortfolio} from './portfolio-ui.js';
import content from './portfolio-content.json';
const panel=document.querySelector('#panel'),body=document.querySelector('#body'),store=createFortuneStore();
const actions=document.querySelector('#panel-actions');
let dispose=()=>{},onReturn=()=>{},previousFocus,returnToWorld=false,afterClose=null;
const intro=['你好，我是 Johnny，喜欢编程、音乐和游戏。','写代码时相信下一次能跑通，玩游戏时相信下一把能赢。','冷笑话是被动技能，搞怪是日常任务。','欢迎来我的小镇逛逛。如果感觉有点冷，可能是我的笑话生效了。'];
function paragraph(text,cls){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;body.append(p);return p;}
function shrine(){let timer,extractTimer;const drawResult=r=>{body.replaceChildren();paragraph('今日签文 · '+r.date,'eyebrow');paragraph(r.fortuneLevel,'fortune-level');paragraph(r.fortuneText,'paper');paragraph('娱乐签文，仅供一笑。');if(store.warning)paragraph(store.warning,'warning');};const existing=store.read();if(existing){drawResult(existing);return ()=>{};}paragraph('远道搬来的神社，今天也在认真营业。');const tube=paragraph('▥','tube');const button=document.createElement('button');button.textContent='抽签';body.append(button);if(store.warning)paragraph(store.warning,'warning');button.onclick=()=>{button.disabled=true;const result=store.draw();tube.classList.add('shake');button.textContent='签已保存，正在展开…';extractTimer=setTimeout(()=>{tube.classList.remove('shake');tube.textContent='│';button.textContent='签已抽出，正在展开…';},450);timer=setTimeout(()=>{if(panel.open)drawResult(result);},matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);};return ()=>{clearTimeout(timer);clearTimeout(extractTimer);};}
export function show(place,onClose){if(panel.open)return;previousFocus=document.activeElement;onReturn=onClose;document.querySelector('#title').textContent=place.name;body.replaceChildren();body.scrollTop=0;actions.replaceChildren();panel.showModal();
 if(place.id==='home'){intro.forEach(t=>paragraph(t));dispose=()=>{};}
 else if(place.id==='city-hall'){dispose=()=>{};renderCityHall(body);}
 else if(place.id==='shrine')dispose=shrine();
 else if(place.id==='world'){dispose=()=>{};renderJournal(body,place.regions,place.state);}
 else if(place.id==='quick'){panel.classList.add('reading-panel','portfolio-panel');dispose=()=>panel.classList.remove('reading-panel','portfolio-panel');renderPortfolio(body,actions,()=>{returnToWorld=true;panel.close();});}
 else if(place.id==='welcome'){panel.classList.add('reading-panel','welcome-panel');dispose=()=>panel.classList.remove('reading-panel','welcome-panel');renderWelcome(body,actions,()=>{afterClose=place.readPortfolio;panel.close();},()=>panel.close());}
 else if(place.kind==='activity')dispose=mountActivity(body,place);
 else if(place.kind==='npc'){dispose=()=>{};renderDialogue(body,place,()=>panel.close());}
 else if(place.kind==='secret')dispose=renderSecret(body,place)||(()=>{});
 else if(place.kind==='rune')dispose=renderGolden(body,place.trialView);
 else if(place.kind==='story'){dispose=()=>{};renderStory(body,getStory(place.storyId));}
 else{paragraph('▰','chest-open');dispose=()=>{};renderChestLink(body);}
 document.querySelector('#close').focus();}
panel.addEventListener('close',()=>{const next=afterClose;afterClose=null;dispose();dispose=()=>{};body.replaceChildren();actions.replaceChildren();onReturn();if(returnToWorld){returnToWorld=false;document.querySelector('#game').focus({preventScroll:true});}else previousFocus?.focus?.();next?.();});
document.querySelector('#close').onclick=()=>panel.close();
export const isOpen=()=>panel.open;
export const showNavigation=(regions,state,onClose)=>show({id:'world',name:'世界路书 · 探索日志',regions,state},onClose);
export const showQuick=(regionId,onClose)=>show({id:'quick',name:'自我介绍 · Johnny Town',regionId},onClose);
export function showWelcome(onClose,readPortfolio,acknowledge){
 if(isOpen())return;
 show({id:'welcome',name:content.welcome.title,readPortfolio},()=>{acknowledge();onClose();});
 // All explicit dismissals, including native Escape, acknowledge and return to
 // the world. The primary action opens the portfolio only after close cleanup.
 returnToWorld=true;
}

