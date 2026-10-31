import {dialogues,narrativeStart} from './npc-stories.js';
export {dialogues};
export const npcs=[
 {id:'town-clerk',name:'市政书记员',region:'town',position:{x:340,y:490},sprite:'npc-clerk',interactionRadius:54,dialogueId:'clerk',behavior:'idle',facing:'south'},
 {id:'mechanical-apprentice',name:'机械学徒',region:'valley',position:{x:620,y:580},sprite:'npc-apprentice',interactionRadius:54,dialogueId:'apprentice',behavior:'idle',facing:'south'},
 {id:'traveling-explorer',name:'旅行探险家',region:'meadow',position:{x:430,y:450},sprite:'npc-explorer',interactionRadius:54,dialogueId:'explorer',behavior:'idle',facing:'south'},
 {id:'forest-archivist',name:'森林档案员',region:'woods',position:{x:500,y:460},sprite:'npc-archivist',interactionRadius:54,dialogueId:'archivist',behavior:'idle',facing:'south'},
];
export function dialogueNode(id,node='start',context){const graph=Object.hasOwn(dialogues,id)?dialogues[id]:null;return graph&&Object.hasOwn(graph,node)?(node==='start'&&context?narrativeStart(id,context):graph[node]):null;}
export function chooseInteraction(existing,npcs,position){
 const nearest=list=>list.map(p=>({p,d:Math.hypot(position.x-p.door.x,position.y-p.door.y)})).filter(v=>v.d<(v.p.interactionRadius??75)).sort((a,b)=>a.d-b.d)[0]?.p;
 return nearest(existing)||nearest(npcs);
}
