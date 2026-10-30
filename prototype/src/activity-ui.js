import {activityInfo,RHYTHM_NOTES,HIT_WINDOW,hitNote,gearPower} from './activities-data.js';
const add=(root,tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;root.append(n);return n;};
const button=(root,text,fn)=>{const b=add(root,'button',text);b.type='button';b.onclick=fn;return b;};
export function mountActivity(root,place){const panel=root.closest('dialog');panel.classList.add('activity-panel');const dispose=place.activityId==='rhythm'?rhythm(root,place.onComplete):gears(root,place.onComplete);return ()=>{dispose();panel.classList.remove('activity-panel');};}
function rhythm(root,complete){
 let raf=0,running=false,started=0,notes=[],disposed=false;
 const intro=()=>{running=false;cancelAnimationFrame(raf);root.replaceChildren();add(root,'p','跟随原创练习节奏敲击：先数四拍，再完成16个音符，约20秒。空格或「敲击」均可。亮起的音符是可敲击的拍点；灰色是休止。无需声音，不设通关分数。');button(root,'开始练习',start);};
 function stop(message){running=false;cancelAnimationFrame(raf);root.replaceChildren();add(root,'p',message,'activity-feedback');button(root,'重新练习',start);}
 function start(){if(disposed)return;running=true;started=performance.now();notes=RHYTHM_NOTES.map(()=> 'pending');root.replaceChildren();
  const status=add(root,'p','预备 · 4','activity-status');status.setAttribute('role','status');
  const grid=add(root,'div',null,'rhythm-grid');const cells=RHYTHM_NOTES.map((n,i)=>{const cell=add(grid,'span',String(i+1),'rhythm-note');cell.setAttribute('aria-label','音符 '+(i+1));return cell;});
  const feedback=add(root,'p','看亮起的音符，按空格或点敲击。','activity-feedback');feedback.setAttribute('role','status');
  const hit=()=>{if(!running)return;const i=hitNote(notes,performance.now()-started);if(i>=0){notes[i]='hit';feedback.textContent='合拍！';}else feedback.textContent='这一拍稍偏，跟着下一次亮起再试。';};
  button(root,'敲击',hit).className='rhythm-tap';
  currentHit=hit;
  const tick=()=>{if(!running||disposed)return;const elapsed=performance.now()-started;
   for(let i=0;i<notes.length;i++){if(notes[i]==='pending'&&elapsed>RHYTHM_NOTES[i]+HIT_WINDOW){notes[i]='miss';feedback.textContent='漏了一拍，下一拍继续。';}cells[i].className='rhythm-note '+notes[i]+(notes[i]==='pending'&&Math.abs(elapsed-RHYTHM_NOTES[i])<=HIT_WINDOW?' active':'');}
   const message=elapsed<4000?'预备 · '+Math.max(1,4-Math.floor(elapsed/1000)):`第 ${Math.min(16,Math.floor((elapsed-4000)/1000)+1)} 拍 · ${notes.filter(n=>n==='hit').length} 次合拍`;if(status.textContent!==message)status.textContent=message;
   if(elapsed>RHYTHM_NOTES.at(-1)+600){running=false;root.replaceChildren();add(root,'p',`练习完成 · 合拍 ${notes.filter(n=>n==='hit').length} / 16`,'activity-result');add(root,'p',activityInfo.rhythm.interest,'story-lead');complete('rhythm');button(root,'再练一次',start);return;}raf=requestAnimationFrame(tick);
  };raf=requestAnimationFrame(tick);
 }
 let currentHit=()=>{};
 const key=e=>{if(running&&e.code==='Space'){e.preventDefault();e.stopPropagation();if(!e.repeat)currentHit();}};
 const interrupt=()=>{if(running)stop('本轮已取消，进度未记录。准备好后可以重新练习。');};
 const visibility=()=>{if(document.hidden)interrupt();};
 document.addEventListener('keydown',key,true);window.addEventListener('blur',interrupt);document.addEventListener('visibilitychange',visibility);intro();
 return ()=>{disposed=true;running=false;cancelAnimationFrame(raf);document.removeEventListener('keydown',key,true);window.removeEventListener('blur',interrupt);document.removeEventListener('visibilitychange',visibility);};
}
function gearSVG(){let points=[];for(let i=0;i<48;i++){const a=i*Math.PI/24,r=i%6<3?18:14;points.push(`${Math.cos(a)*r},${Math.sin(a)*r}`);}return `<svg viewBox="-21 -21 42 42" aria-hidden="true"><polygon points="${points.join(' ')}" fill="#bb9557" stroke="#574c39" stroke-width="2"/><circle r="6" fill="#344b43" stroke="#edcd87" stroke-width="2"/></svg>`;}
function gears(root,complete){
 let disposed=false;
 function start(){if(disposed)return;let directions=[1,1,1,1];root.replaceChildren();add(root,'p','输入轴固定顺时针 ↻。四枚外齿轮依次啮合，每一对相邻齿轮必须反向转动，才能把动力送到右端。点每枚齿轮切换方向，再测试；没有时间限制。');
  add(root,'p','输入 ↻ → 1 → 2 → 3 → 4 → 工坊','gear-chain');const row=add(root,'div',null,'gear-row');const buttons=[];
  const feedback=add(root,'p','调整箭头，恢复整条传动链。','activity-feedback');feedback.setAttribute('role','status');
  const paint=(powered=[])=>buttons.forEach((b,i)=>{b.innerHTML=gearSVG();add(b,'span',`${i+1} ${directions[i]===1?'↻ 顺时针':'↺ 逆时针'}`);b.setAttribute('aria-label',`齿轮 ${i+1}：${directions[i]===1?'顺时针':'逆时针'}，点击切换`);b.className='gear-control'+(powered[i]?' powered':'');});
  for(let i=0;i<4;i++)buttons.push(button(row,'',()=>{directions[i]*=-1;paint();feedback.textContent='方向已调整，请测试传动链。';}));paint();
  button(root,'重置',()=>{directions=[1,1,1,1];paint();feedback.textContent='已重置，输入轴仍为顺时针。';});
  button(root,'测试传动',()=>{const powered=gearPower(directions);paint(powered);if(powered.every(Boolean)){feedback.textContent='工坊恢复动力！';if(!root.querySelector('.engineering-interest'))add(root,'p',activityInfo.gears.interest,'engineering-interest story-lead');complete('gears');}else feedback.textContent=`动力在齿轮 ${powered.indexOf(false)+1} 处中断：检查它与前一枚齿轮是否反向。`;});
  button(root,'再试一次',start);
 }
 add(root,'p','恢复工坊动力：四枚齿轮，一条传动链。');button(root,'开始组装',start);
 return ()=>{disposed=true;};
}
