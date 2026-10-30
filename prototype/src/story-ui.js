import {secrets} from './ruins-data.js';
import {profile,stories,getStory} from './story-content.js';

function node(parent,tag,text,className){
  const element=document.createElement(tag);if(text)element.textContent=text;
  if(className)element.className=className;parent.append(element);return element;
}
export function renderStory(root,story){
  node(root,'p',story.english+' · '+story.symbol,'eyebrow');
  node(root,'p',story.summary,'story-lead');
  const details=node(root,'details',null,'story-details');
  node(details,'summary','继续阅读');
  for(const text of story.detail) node(details,'p',text);
}
export function renderQuick(root,regionId,close){
  node(root,'p',profile.introduction,'story-lead');
  const interests=node(root,'ul',null,'interest-list');
  for(const interest of profile.interests)node(interests,'li',interest);
  for(const section of profile.overview){node(root,'h3',section.title);node(root,'p',section.text);}
  node(root,'p','沿路标探索森林、湖岸与山谷；M 键可重读已发现的故事。','route-note');
  const explore=node(root,'button','开始自由探索');explore.type='button';explore.onclick=close;
}
export function renderJournal(root,regions,state){
  node(root,'p','沿路标步行，按 E 往返；每段旅途都可以慢慢重走。');
  const list=node(root,'ul',null,'region-list');
  for(const region of regions) node(list,'li',region.name+' — '+(!region.available?'尚未建成':state.regionId===region.id?'当前位置':state.discovered.includes(region.id)?'已发现':'未探索'));
  node(root,'h3','旅途 · 探索日志');
  node(root,'p',`已发现 ${state.stories.length} / ${stories.length} 处故事`,'journal-progress').setAttribute('role','status');
  const journal=node(root,'div',null,'journal-entries');
  for(const [index,story] of stories.entries()){
    if(!state.stories.includes(story.id)){node(journal,'p',`片段 ${index+1} · 尚未读到的一页`,'journal-locked');continue;}
    const entry=node(journal,'details',null,'story-details');node(entry,'summary','重读 · '+story.name);
    node(entry,'p',story.summary,'story-lead');for(const text of story.detail)node(entry,'p',text);
  }
  node(root,'h3','发现的秘密 · Secrets Discovered');
  node(root,'p',`${state.secrets.found.length} / 9`,'secrets-progress');
  for(const secret of secrets){
    if(!state.secrets.found.includes(secret.id)){node(root,'p','未知的秘密','secret-locked');continue;}
    const entry=node(root,'details',null,'secret-entry');node(entry,'summary',secret.name);node(entry,'p',secret.id==='memorial'?'谢谢你来过。预算仍未获批。':secret.pages[0]);
  }
  if(state.secrets.golden)node(root,'p','黄金回旋已完成 · Lesson 4: Pay your respects.');
  if(state.secrets.waited)node(root,'p','Some things are worth waiting for.');
  node(root,'p','累计跨区 '+state.progress.transitions+' 次；刷新后回到当前区域的安全路口。','eyebrow');
}
export {profile,getStory};
