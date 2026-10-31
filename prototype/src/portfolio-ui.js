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
export function renderWelcome(root,actions,read){
 const letter=add(root,'article',null,'reading-copy welcome-letter');letter.setAttribute('aria-label','欢迎信');renderApprovedCopy(letter,content.welcome.markdown);
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
 action(actions,'重新阅读欢迎信',readWelcome);
}
