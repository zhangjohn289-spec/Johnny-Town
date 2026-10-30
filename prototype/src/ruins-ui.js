import {secrets,memorialOpening} from './ruins-data.js';
export function renderSecret(root,place){
 const data=secrets.find(s=>s.id===place.id);let page=0;
 const p=document.createElement('p');p.className='story-lead';root.append(p);
 const status=document.createElement('p');status.setAttribute('role','status');root.append(status);
 const button=document.createElement('button');root.append(button);
 let pages=[...data.pages];
 if(['manuscript','clock','phase-door'].includes(place.id))pages=[pages[place.count%pages.length]];
 if(place.id==='phase-door')pages.unshift('PHASE 06 — COMING SOON.');
 if(place.id==='clock')pages.push(place.state.secrets.waited?'Some things are worth waiting for.':'放下对话，在钟旁静候 8 秒。离开会重新计时。');
 if(place.id==='golden'&&place.state.secrets.golden)pages.push('Lesson 4: Pay your respects.');
 if(place.id==='safe-chest')pages.push('你已经被这个世界骗过一次了。为什么还相信宝箱？');
 if(place.id==='engineer')pages.push('WAAAAAAAAAGH！');
 if(place.id==='memorial')pages=[memorialOpening(place.state),...pages];
 const draw=()=>{if(place.id==='memorial'&&page===pages.length-1)place.complete();p.textContent=pages[page];status.textContent=`${page+1} / ${pages.length}`;button.textContent=page===0&&place.id==='engineer'?'启动机器':page===0&&place.id==='safe-chest'?'打开宝箱':page<pages.length-1?'下一页':'从头阅读';};
 button.onclick=()=>{if(place.id==='engineer'&&page===0)place.activate();page=(page+1)%pages.length;draw();};draw();
}
