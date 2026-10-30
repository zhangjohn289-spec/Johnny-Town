export const secrets=[
 ['manuscript','永远写不完的手稿',['这里有一份尚未完成的报告。第 1 页，共 847 页。','第 2 页，共 1,204 页。','有人正在以惊人的速度增加页数。']],
 ['golden','黄金回旋之石',['相信回旋吧。只管相信就是了。','按地上的编号，依次走到三枚符文旁按 E。没有时间限制，走错可重新开始。']],
 ['engineer','绿皮工程师的遗产',['根据古代工程文献，只要相信它能运转，它就能运转。']],
 ['safe-chest','绝对安全的宝箱',['这个宝箱绝对不会播放奇怪的视频。']],
 ['clock','等待者之钟',['它似乎在等待什么。','它仍然在等待。','你为什么还在等？']],
 ['flight','失败的飞行实验',['实验记录：飞船成功起飞。','实验记录二：飞船成功后空翻。','实验记录三：飞船的设计者认为这属于正常飞行。']],
 ['logs','被封存的开发日志',['最初，这里只是一份普通的个人介绍。','后来，镇长决定添加一栋房子。','然后出现了森林。','然后是湖。','然后是机械谷。','没有人知道镇长什么时候才会停下来。']],
 ['phase-door','不存在的下一阶段',['财政部长拒绝批准本项目。','镇长正在重新提交预算申请。','预算审议仍在进行中。']],
 ['memorial','最后的纪念碑',['You came here to learn about someone.','Instead, you found an entire world.','Thank you for exploring.','P.S. The budget was not approved.']],
].map(([id,name,pages])=>({id,name,pages}));
export const secretIds=secrets.map(s=>s.id);
export function normalizeSecrets(value){return {found:[...new Set((Array.isArray(value?.found)?value.found:[]).filter(id=>secretIds.includes(id)))],golden:value?.golden===true,waited:value?.waited===true};}
export function nextRune(current,index){return index===current?current+1:index===0?1:0;}
export function memorialOpening(state){return state.stories.length===13&&secretIds.filter(id=>id!=='memorial').every(id=>state.secrets.found.includes(id))&&state.secrets.golden&&state.secrets.waited?'Congratulations. You have explored every corner of Johnny Town.':'Congratulations. You have found a quiet corner of Johnny Town.';}
const coords=[[180,640],[660,440],[400,440],[860,450],[180,420],[430,240],[360,640],[820,150],[630,150]];
const places=secrets.map((s,i)=>({id:s.id,name:s.name,kind:'secret',action:'查看',x:coords[i][0]-28,y:coords[i][1]-65,w:56,h:40,door:{x:coords[i][0],y:coords[i][1]}}));
for(const [i,[x,y]] of [[570,530],[700,560],[790,520]].entries())places.push({id:'rune-'+i,name:'回旋符文 '+(i+1),kind:'rune',index:i,action:'激活',x:x-12,y:y-30,w:24,h:16,door:{x,y}});
export const ruins={id:'ruins',name:'Forgotten Ruins · 遗忘遗迹',renderer:'ruins',width:1024,height:768,bounds:{x:16,y:32,width:992,height:720},trees:[],places,
 paths:[[[60,700],[180,690],[300,610],[300,470],[430,390],[520,300],[630,210],[820,210]],[[300,470],[180,470],[180,420]],[[430,390],[650,490],[860,500]],[[520,300],[430,290]],[[650,490],[700,570]]],
 collisions:[...places.map(p=>({x:p.x,y:p.y,w:p.w,h:p.h,kind:'relic'})),{x:70,y:170,w:230,h:35,kind:'wall'},{x:70,y:205,w:35,h:120,kind:'wall'},{x:520,y:600,w:35,h:90,kind:'wall'},{x:820,y:610,w:100,h:35,kind:'wall'}],
 spawns:{fromMeadow:{x:160,y:700}},defaultSpawn:'fromMeadow',exits:[{id:'ruins-return',name:'草甸的阳光 ↙',action:'返回',door:{x:60,y:700},to:'meadow',spawn:'fromRuins'}]};
