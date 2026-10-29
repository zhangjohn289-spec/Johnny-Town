import {fortuneGroups} from './fortunes.js';
export const STORAGE_KEY='johnny-town.fortune.v1';
export function localDate(now=new Date()){return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function generate(date,random=Math.random){let value=random()*100;const group=fortuneGroups.find(g=>(value-=g.weight)<0)||fortuneGroups.at(-1);const f=group.fortunes[Math.min(group.fortunes.length-1,Math.floor(random()*group.fortunes.length))];return {date,fortuneLevel:group.level,fortuneId:f.id,fortuneText:f.text};}
function valid(v){return v&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&fortuneGroups.some(g=>g.level===v.fortuneLevel&&g.fortunes.some(f=>f.id===v.fortuneId))&&typeof v.fortuneText==='string'&&v.fortuneText.length>0&&v.fortuneText.length<2000;}
export function createFortuneStore({storage=()=>window.localStorage,today=()=>localDate(),random=Math.random}={}){
 let memory=null,warning='';
 function read(){let saved;try{const raw=storage().getItem(STORAGE_KEY);if(raw){saved=JSON.parse(raw);if(!valid(saved))throw Error('invalid');}}catch{warning='本地记录无法读取或已损坏；当前页面会保留抽签结果，但刷新后可能丢失。';}if(saved&&valid(saved))memory=saved;return memory?.date===today()?memory:null;}
 return {read,get warning(){return warning;},draw(){const old=read();if(old)return old;const result=generate(today(),random);memory=result;try{storage().setItem(STORAGE_KEY,JSON.stringify(result));}catch{warning='浏览器无法保存结果；本页内不会重复抽签，刷新或重开后可能丢失。';}return result;}};
}
