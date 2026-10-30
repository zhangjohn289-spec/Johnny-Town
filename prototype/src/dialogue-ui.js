import {dialogueNode} from './npc-data.js';
export function renderDialogue(root,npc,close){
 let node='start',line=0;
 function draw(focus=false){
  root.replaceChildren();const data=dialogueNode(npc.dialogueId,node);
  const text=document.createElement('p');text.className='story-lead';text.setAttribute('aria-live','polite');text.textContent=data?.lines?.[line]||'这页记录暂时找不到了。我们下次再聊。';root.append(text);
  const button=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;root.append(b);};
  if(data&&line<data.lines.length-1)button('继续',()=>{line++;draw(true);});
  else if(data?.choices)for(const choice of data.choices)button(choice.text,()=>{if(choice.to===null){close();return;}node=choice.to;line=0;draw(true);});
  else button('结束交谈',close);
  if(focus)root.querySelector('button')?.focus();
 }
 draw();
}
