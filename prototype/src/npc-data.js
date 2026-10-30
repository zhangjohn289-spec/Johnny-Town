const dialogue=(greeting,a,b)=>({start:{lines:greeting,choices:[{text:a[0],to:'topic'},{text:b[0],to:'other'},{text:'下次见。',to:null}]},topic:{lines:a.slice(1)},other:{lines:b.slice(1)}});
export const dialogues={
 clerk:dialogue(['欢迎来到市政厅。请问这次要查哪一份档案？'],['想了解这座小镇。','最初，这里只是一个互动个人网站。后来，介绍变成了可以走进去的像素世界。','森林、湖岸、机械谷和遗迹各有各的故事。档案柜正在努力跟上建设速度。'],['谁是镇长？','Johnny, the Chief Mek。出色的工程师，可怕的预算申请人。','他说还能再扩建一点。我们还在整理上一次的表格。']),
 apprentice:dialogue(['看那根转轴！每一台大机器，都得先有一个愿意转动的小零件。'],['你们在造什么？','能造出其他机器的机器！机械、传动和自动化，都是这里的日常。','Johnny喜欢把大胆想法拆成小实验。先让一个零件动起来，再想下一个。'],['每台机器都能工作吗？','大部分能。最后总会能的。','这张图纸已经改了七遍。第八遍听起来就很有希望。']),
 explorer:dialogue(['这里每条路都讲着不同的故事。你的脚步不必照着别人的顺序。'],['我该去哪里？','镇北是记忆森林，草甸东北通向旋律湖，东南是机械谷。','留意草甸边缘的旧石阶。选你感兴趣的方向就好，没有标准顺序。'],['这里有秘密吗？','遗忘遗迹里有些东西，得多看一眼才会回应。','我不会替你翻开最后一页。发现的乐趣，值得自己留下。']),
 archivist:dialogue(['许多人把记忆当成收在盒子里的东西。','我觉得，它也会慢慢改变拿着盒子的人。'],['你为什么在这里？','我替路过的人保管故事，也读那些没写在书脊上的经历。','认识一个人，也可以是一段旅程：从兴趣走向故事，再带着自己的问题离开。'],['我应该记住什么？','不必记下每个日期。读过的句子、学会的事，有时会在意想不到的时候回来。','每个故事都有起点。有趣的是，它接下来通向哪里。']),
};
export const npcs=[
 {id:'town-clerk',name:'市政书记员',region:'town',position:{x:340,y:490},sprite:'npc-clerk',interactionRadius:54,dialogueId:'clerk',behavior:'idle',facing:'south'},
 {id:'mechanical-apprentice',name:'机械学徒',region:'valley',position:{x:620,y:580},sprite:'npc-apprentice',interactionRadius:54,dialogueId:'apprentice',behavior:'idle',facing:'south'},
 {id:'traveling-explorer',name:'旅行探险家',region:'meadow',position:{x:430,y:450},sprite:'npc-explorer',interactionRadius:54,dialogueId:'explorer',behavior:'idle',facing:'south'},
 {id:'forest-archivist',name:'森林档案员',region:'woods',position:{x:500,y:460},sprite:'npc-archivist',interactionRadius:54,dialogueId:'archivist',behavior:'idle',facing:'south'},
];
export function dialogueNode(id,node='start'){const graph=Object.hasOwn(dialogues,id)?dialogues[id]:null;return graph&&Object.hasOwn(graph,node)?graph[node]:null;}
export function chooseInteraction(existing,npcs,position){
 const nearest=list=>list.map(p=>({p,d:Math.hypot(position.x-p.door.x,position.y-p.door.y)})).filter(v=>v.d<(v.p.interactionRadius??75)).sort((a,b)=>a.d-b.d)[0]?.p;
 return nearest(existing)||nearest(npcs);
}
