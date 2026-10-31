import {secrets,memorialOpening} from './ruins-data.js';
import {lessons} from './golden-trial.js';
function paragraph(root,text,cls){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;root.append(p);return p;}
export function renderGolden(root,view){
 const panel=root.closest('dialog');panel.classList.add('golden-panel');
 paragraph(root,view.lesson===null?'未醒的刻痕':`Lesson ${view.lesson+1} · 五课回旋`,'eyebrow');
 paragraph(root,view.lesson===null?'这枚石头，还在等一段尚未开始的旅程。':lessons[view.lesson],'story-lead lesson-line');
 paragraph(root,view.stage===5?'五课回旋 · 已完成 · 5 / 5':`五课回旋 · ${view.stage} / 5`,'golden-progress').setAttribute('role','status');
 const hint=document.createElement('details');hint.className='story-details';const summary=document.createElement('summary');summary.textContent='听听石上的回声 · 路途提示';hint.append(summary);paragraph(hint,view.clue);root.append(hint);
 if(view.stage===5){const reread=document.createElement('details');reread.className='story-details';const title=document.createElement('summary');title.textContent='重读五课';reread.append(title);lessons.forEach((line,i)=>paragraph(reread,`${i+1}. ${line}`));root.append(reread);}
 // Preserve the native keyboard/touch dialog's existing close/focus behavior.
 return ()=>panel.classList.remove('golden-panel');
}
export function renderSecret(root,place){
 if(place.id==='golden')return renderGolden(root,place.trialView);
 const data=secrets.find(s=>s.id===place.id);let page=0;
 const p=document.createElement('p');p.className='story-lead';root.append(p);
 const status=document.createElement('p');status.setAttribute('role','status');root.append(status);
 const button=document.createElement('button');root.append(button);
 let pages=[...data.pages];
 if(['manuscript','clock','phase-door'].includes(place.id))pages=[pages[place.count%pages.length]];
 if(place.id==='clock')pages.push(place.state.secrets.waited?'Some things are worth waiting for.':'放下对话，在钟旁静候 8 秒。离开会重新计时。');
 if(place.id==='safe-chest')pages.push('你已经被这个世界骗过一次了。为什么还相信宝箱？');
 if(place.id==='engineer')pages.push('WAAAAAAAAAGH！');
 if(place.id==='memorial')pages=[memorialOpening(place.state),...pages];
 const draw=()=>{if(place.id==='memorial'&&page===pages.length-1)place.complete();p.textContent=pages[page];status.textContent=`${page+1} / ${pages.length}`;button.textContent=page===0&&place.id==='engineer'?'启动机器':page===0&&place.id==='safe-chest'?'打开宝箱':page<pages.length-1?'下一页':'从头阅读';};
 button.onclick=()=>{if(place.id==='engineer'&&page===0)place.activate();page=(page+1)%pages.length;draw();};draw();
}
