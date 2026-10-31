import {renderAudio} from './audio-ui.js';
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
let uiAudio; export const configureUIAudio=audio=>{uiAudio=audio;};
let dispose=()=>{},onReturn=()=>{},previousFocus,returnToWorld=false,afterClose=null,mandatoryWelcome=null,welcomeConfirm=null;
const intro=['你好，我是 Johnny，喜欢编程、音乐和游戏。','写代码时相信下一次能跑通，玩游戏时相信下一把能赢。','冷笑话是被动技能，搞怪是日常任务。','欢迎来我的小镇逛逛。如果感觉有点冷，可能是我的笑话生效了。'];
function paragraph(text,cls){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;body.append(p);return p;}
function shrine(){let timer,extractTimer;const drawResult=r=>{body.replaceChildren();paragraph('今日签文 · '+r.date,'eyebrow');paragraph(r.fortuneLevel,'fortune-level');paragraph(r.fortuneText,'paper');paragraph('娱乐签文，仅供一笑。');if(store.warning)paragraph(store.warning,'warning');};const existing=store.read();if(existing){drawResult(existing);return ()=>{};}paragraph('远道搬来的神社，今天也在认真营业。');const tube=paragraph('▥','tube');const button=document.createElement('button');button.textContent='抽签';body.append(button);if(store.warning)paragraph(store.warning,'warning');button.onclick=()=>{button.disabled=true;const result=store.draw();uiAudio?.effect('fortune');tube.classList.add('shake');button.textContent='签已保存，正在展开…';extractTimer=setTimeout(()=>{tube.classList.remove('shake');tube.textContent='│';button.textContent='签已抽出，正在展开…';},450);timer=setTimeout(()=>{if(panel.open)drawResult(result);},matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);};return ()=>{clearTimeout(timer);clearTimeout(extractTimer);};}
export function show(place,onClose){if(panel.open)return;previousFocus=document.activeElement;onReturn=onClose;document.querySelector('#title').textContent=place.name;document.querySelector('#close').textContent=place.id==='welcome'?'开始自由探索':'返回探索';body.replaceChildren();body.scrollTop=0;actions.replaceChildren();panel.showModal();
 uiAudio?.effect(place.trialView?.mode==='complete'?'confirm':'open');
 if(place.id==='audio')dispose=renderAudio(body,place.audio);
 else if(place.id==='home'){intro.forEach(t=>paragraph(t));dispose=()=>{};}
 else if(place.id==='city-hall'){dispose=()=>{};renderCityHall(body);}
 else if(place.id==='shrine')dispose=shrine();
 else if(place.id==='world'){dispose=()=>{};renderJournal(body,place.regions,place.state);}
 else if(place.id==='quick'){panel.classList.add('reading-panel','portfolio-panel');dispose=()=>panel.classList.remove('reading-panel','portfolio-panel');renderPortfolio(body,actions,mandatoryWelcome?null:()=>{afterClose=place.readWelcome;panel.close();});if(mandatoryWelcome)document.querySelector('#close').textContent='返回欢迎信';}
 else if(place.id==='welcome'){
  panel.classList.add('reading-panel','welcome-panel');
  const close=document.querySelector('#close'),acknowledged=place.store.isAcknowledged();
  close.disabled=!acknowledged;close.setAttribute('aria-describedby','welcome-ack-help');
  welcomeConfirm=()=>{if(!acknowledged&&!document.querySelector('#welcome-read').checked)return;place.store.acknowledge();mandatoryWelcome=null;returnToWorld=true;panel.close();};
  dispose=()=>{panel.classList.remove('reading-panel','welcome-panel');close.disabled=false;close.removeAttribute('aria-describedby');welcomeConfirm=null;};
  renderWelcome(body,actions,()=>{afterClose=place.readPortfolio;panel.close();},{acknowledged,persistent:place.store.persistent,onChecked:checked=>{close.disabled=!acknowledged&&!checked;}});
 }
 else if(place.kind==='activity')dispose=mountActivity(body,place);
 else if(place.kind==='npc'){dispose=()=>{};renderDialogue(body,place,()=>panel.close());}
 else if(place.kind==='secret')dispose=renderSecret(body,place)||(()=>{});
 else if(place.kind==='rune')dispose=renderGolden(body,place.trialView);
 else if(place.kind==='story'){dispose=()=>{};renderStory(body,getStory(place.storyId));}
 else{paragraph('▰','chest-open');dispose=()=>{};renderChestLink(body);}
 if(place.id==='welcome'){body.focus({preventScroll:true});body.scrollTop=0;}else document.querySelector('#close').focus();}
// Keep the world locked while switching welcome -> portfolio -> welcome.
// Native/programmatic dismissal cannot turn an incomplete reading into consent.
panel.addEventListener('cancel',event=>{if(mandatoryWelcome&&panel.classList.contains('welcome-panel'))event.preventDefault();});
panel.addEventListener('close',()=>{const next=afterClose||mandatoryWelcome?.open;afterClose=null;if(!next)uiAudio?.effect('close');dispose();dispose=()=>{};body.replaceChildren();actions.replaceChildren();onReturn();if(!next){if(returnToWorld){returnToWorld=false;document.querySelector('#game').focus({preventScroll:true});}else previousFocus?.focus?.();}next?.();});
document.querySelector('#close').onclick=()=>{if(welcomeConfirm){welcomeConfirm();return;}if(panel.classList.contains('portfolio-panel')&&!mandatoryWelcome)returnToWorld=true;panel.close();};
export const isOpen=()=>panel.open;
export const showNavigation=(regions,state,onClose)=>show({id:'world',name:'世界路书 · 探索日志',regions,state},onClose);
export const showQuick=(regionId,onClose,readWelcome)=>show({id:'quick',name:'自我介绍 · Johnny Town',regionId,readWelcome},onClose);
export function showWelcome(onClose,readPortfolio,store){
 if(isOpen())return;
 const open=()=>show({id:'welcome',name:content.welcome.title,store,
  readPortfolio:store.isAcknowledged()?readPortfolio:()=>showQuick(null,()=>{},open)},()=>{if(store.isAcknowledged())onClose();});
 if(!store.isAcknowledged())mandatoryWelcome={open};
 open();
 returnToWorld=true;
}


export const showAudio=(audio,onClose)=>show({id:'audio',name:'小镇声音',audio},onClose);
