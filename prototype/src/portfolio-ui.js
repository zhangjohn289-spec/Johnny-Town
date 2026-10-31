import content from './portfolio-content.json';
const add=(root,tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;root.append(n);return n;};
// A deliberately small renderer for the approved bundled copy: paragraphs,
// subheadings, lists, emphasis and explicit line breaks. Never insert HTML.
function inline(root,text){
 for(const part of text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)){
  if(part.startsWith('**')&&part.endsWith('**'))add(root,'strong',part.slice(2,-2));
  else if(part.startsWith('*')&&part.endsWith('*'))add(root,'em',part.slice(1,-1));
  else root.append(document.createTextNode(part));
 }
}
export function renderApprovedCopy(root,markdown){
 for(const block of markdown.split('\n\n')){
  if(block.startsWith('### ')){inline(add(root,'h4'),block.slice(4));continue;}
  if(block.startsWith('- ')){const list=add(root,'ul');for(const line of block.split('\n'))inline(add(list,'li'),line.slice(2));continue;}
  const p=add(root,'p');block.split('\n').forEach((line,i)=>{if(i)add(p,'br');inline(p,line.trimEnd());});
 }
}
function action(root,text,callback,primary=false){const b=add(root,'button',text,primary?'reading-primary':'');b.type='button';b.onclick=callback;return b;}
export function renderWelcome(root,actions,read,{acknowledged=false,persistent=true,onChecked=()=>{}}={}){
 const letter=add(root,'article',null,'reading-copy welcome-letter');letter.setAttribute('aria-label','欢迎信');renderApprovedCopy(letter,content.welcome.markdown);
 const gate=add(root,'section',null,'welcome-ack reading-copy');add(gate,'h4','启程之前');
 const explanation=add(gate,'p','这封信里有探索小镇所需的基本指引。读完之后，请在下方做个标记；如果还没读完，也不用着急，慢慢来就好。');explanation.id='welcome-ack-help';
 const label=add(gate,'label');label.htmlFor='welcome-read';
 const checkbox=add(label,'input');checkbox.id='welcome-read';checkbox.type='checkbox';checkbox.checked=acknowledged;checkbox.setAttribute('aria-describedby','welcome-ack-help');
 add(label,'span','我已阅读欢迎信，并了解基本操作方式');checkbox.onchange=()=>onChecked(checkbox.checked);
 if(!persistent)add(gate,'p','浏览器无法保存阅读确认；本次确认后可继续探索，刷新后需要再次确认。','editorial-note');
 action(actions,'查看自我介绍',read,true);
}
export function renderPortfolio(root,actions,readWelcome){
 const nav=add(root,'nav',null,'portfolio-navigation');nav.setAttribute('aria-label','自我介绍章节');
 const label=add(nav,'label','阅读章节');label.htmlFor='portfolio-section';
 const select=add(nav,'select');select.id='portfolio-section';
 for(const [i,s] of content.sections.entries()){const option=add(select,'option',`${i+1}. ${s.title} · ${s.english}`);option.value=s.id;}
 const article=add(root,'article',null,'reading-copy portfolio-page');article.setAttribute('aria-labelledby','portfolio-heading');
 const paint=()=>{const s=content.sections.find(s=>s.id===select.value);article.replaceChildren();add(article,'h3',s.title).id='portfolio-heading';add(add(article,'p',null,'portfolio-english'),'em',s.english);renderApprovedCopy(article,s.markdown);root.scrollTop=0;};
 select.onchange=paint;select.value=content.sections[0].id;paint();
 if(readWelcome)action(actions,'重新阅读欢迎信',readWelcome);
}
