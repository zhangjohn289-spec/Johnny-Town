// Public portfolio themes come from story-content/activityInfo; character
// observations are fiction. No new biography, quests or persistent fields.
export const npcNarratives={
 clerk:{intro:'欢迎，Traveler。这里是 Johnny 的个人介绍网站；你现在站在它的街道上。',repeat:'又见面了。今天只随便走走也可以，不需要填写申请。',
  topics:[['这座小镇是谁建的？','绿皮工程师 Johnny Da Mek，我们叫他「最初的旅人」。你是今天来探索的 Traveler，不必成为他。','Johnny 喜欢编程、音乐和机械创造。把介绍做成能散步的世界，算是他的自我介绍方式。'],['我只有几分钟。','点「认识 Johnny」，或按 I，就能快速了解兴趣和这个项目；不必先完成探索。','有空再走一段。市政厅负责整理档案，至于镇长下一张图纸能不能塞进柜子——我们还在评估。']],
  contexts:[{id:'trial-complete',lines:['五道刻痕都亮了？那段旅程已经记进日志。恭喜，今天没有额外的验收表。']},{id:'many-regions',lines:['你已经走过好几个地方了。日志会替你记住发现，档案室暂时不用扩建。']} ]},
 apprentice:{intro:'先别碰那根轴——我正在看动力断在哪儿。大想法也得从一个能转的小零件开始。',repeat:'来，帮我看一眼这处连接。我现在比较擅长先找问题，再给图纸起名字。',
  topics:[['Johnny 喜欢造什么？','机械、自动化，还有 Minecraft Create 里的工程。最让我着迷的，是让一个零件真的带动下一个。','先搭出来，测试，再改。Johnny Town 也是这样一点点做起来的；图纸画得再远，螺丝还是得一颗颗拧。'],['有没有不太成功的实验？','遗迹里那架小实验飞机，起飞之后还会后空翻。我建议先把「稳定飞行」单独列一项。','它不是另一项大型飞行工厂构想。小飞机的教训已经够记一页了：先弄清为什么翻，再试下一次。']],
  contexts:[{id:'gears-complete',lines:['工坊的动力接通了！你也看到了吧，方向和连接都对上，整套机构才肯一起工作。']},{id:'flight-found',lines:['你见过遗迹里的小飞机了？那次后空翻是实验记录，不是我们偷偷加的飞行要求。']} ]},
 explorer:{intro:'你好！我刚在岔路口停了会儿。这里没有标准游览顺序，先走向让你好奇的地方吧。',repeat:'又碰上了！这次想换条路，还是回去看看上次没注意到的角落？',
  topics:[['你会推荐哪条路？','想听音乐的故事，去旋律湖；想看机械，去机械谷。镇北的森林适合慢慢读，遗迹留给愿意多看一眼的人。','Johnny 把不同兴趣放进了不同地方。我喜欢这种安排：好奇心选路，脚步不必替别人交作业。'],['探索一定要找齐所有东西吗？','不用。我也会在一条路上来回走，因为第二次的光和第一次不太一样。','最初的旅人留下了这个世界，后来的人各自发现一部分。只带走一个喜欢的想法，也算一趟好旅程。']],
  contexts:[{id:'rhythm-complete',lines:['你试过湖岸的节奏练习了？我喜欢那里的停顿；有时知道何时不敲，也是在听。']},{id:'lake-visited',lines:['你去过旋律湖了。那里的鼓、舞台和水声故事，让「喜欢音乐」不只是一行介绍。']} ]},
 archivist:{intro:'轻一点，这里的故事不赶时间。你想读一个人的兴趣，也可以先看看他把什么留在了路边。',repeat:'欢迎回来。旧故事还在原处；再读时，你带来的问题可能不同了。',
  topics:[['为什么把经历写成森林？','石碑、岔路和工坊是象征，不是一张履历表。它们讲探索、适应和动手创造，也给真实经历留一点呼吸的地方。','Johnny 喜欢编程、音乐和游戏。这些故事让兴趣彼此相连；具体的人生，当然不止几块路牌。'],['回响之树在记什么？','音乐和舞台，是这里的一条线索。Johnny 学过小军鼓，也打架子鼓，喜欢音乐剧、管弦与戏剧性音乐。','树记下的不是一份演出清单，而是反复练习以后，仍愿意再敲一次的心情。嗯，树并没有替谁参加考试。']],
  contexts:[{id:'forest-stories',lines:['森林的五处故事，你都读过了。可以从日志里重读；读完并不会把森林关上。']},{id:'echo-found',lines:['你读过回响之树了。声音散去以后，还愿意留在记忆里的东西，往往值得再听。']} ]},
};
export const contextMatches=(id,p={})=>({
 'trial-complete':p.goldenTrial?.stage===5,
 'many-regions':Array.isArray(p.discovered)&&new Set(p.discovered).size>=4,
 'gears-complete':p.activities?.gears===true,
 'flight-found':Array.isArray(p.secrets?.found)&&p.secrets.found.includes('flight'),
 'rhythm-complete':p.activities?.rhythm===true,
 'lake-visited':Array.isArray(p.discovered)&&p.discovered.includes('lake'),
 'forest-stories':['beginning','crossroads','echoing-tree','workshop','unwritten'].every(s=>Array.isArray(p.stories)&&p.stories.includes(s)),
 'echo-found':Array.isArray(p.stories)&&p.stories.includes('echoing-tree'),
}[id]===true);
export const dialogues=Object.fromEntries(Object.entries(npcNarratives).map(([id,n])=>[id,{start:{lines:[n.intro],choices:[{text:n.topics[0][0],to:'topic'},{text:n.topics[1][0],to:'other'},{text:'下次见。',to:null}]},topic:{lines:n.topics[0].slice(1)},other:{lines:n.topics[1].slice(1)}}]));
export function narrativeStart(id,{progress={},repeat=false}={}){
 if(!Object.hasOwn(npcNarratives,id))return null;
 const n=npcNarratives[id],context=n.contexts.find(c=>contextMatches(c.id,progress));
 return {...dialogues[id].start,lines:[repeat?n.repeat:n.intro,...(context?.lines||[])]};
}
