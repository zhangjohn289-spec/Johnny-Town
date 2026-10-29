// Public editorial data. Symbolic stories are fiction, not a school/work biography.
// Add concrete instruments, performances, dates or projects only after Johnny confirms them.
export const profile = {
  title:'你好，我是 Johnny。',
  introduction:'喜欢编程、音乐和游戏，也喜欢把好奇心变成可以亲手尝试的小东西。冷笑话是被动技能，探索是日常任务。',
  interests:['编程与互动体验','音乐与游戏','机械创造与 Minecraft 工程'],
  overview:[
    {title:'声音与创造',text:'音乐是兴趣方向之一；机械构想与 Minecraft 工程，则是把想法搭出来的另一种方式。森林用回响之树与遗落工坊讲述这些主题。'},
    {title:'关于这个小镇',text:'Johnny Town 是一座可以游玩的个人介绍网站，用 Phaser 3 和 Vite 构建。你可以拜访小屋、抽一支签，也可以走进森林，读几个关于探索的寓言。'},
  ],
};

export const forestStories = [
  {id:'beginning',name:'初始之地',english:'The Beginning',symbol:'01 · 晨光石碑',
    summary:'石碑没有刻下终点，只留了一处可以写名字的空白。林间的第一束光，对每个刚出发的人都一样。',
    detail:['旅人曾以为，地图的第一格会决定整条道路。后来才发现，起点只是鞋底沾上的第一点泥。','他把名字留在空白处，又在旁边画了一支箭。箭头很小，却朝向所有尚未走过的地方。']},
  {id:'crossroads',name:'命运岔路',english:'The Crossroads',symbol:'02 · 旅行路牌',
    summary:'路牌的字迹来自不同的旅人。没有两支箭指向同一个方向，却都被风吹得轻轻作响。',
    detail:['每到一处陌生的林地，旅人都要重新听懂风声。有时换一条路，也意味着换一种看世界的方法。','他没有把旧路从地图上擦掉。那些转弯，后来成了理解下一片森林的线索。']},
  {id:'echoing-tree',name:'回响之树',english:'The Echoing Tree',symbol:'03 · 林间小舞台',
    summary:'古树记得每一次轻轻敲响的节拍。声音散去以后，年轮还在悄悄接着唱。',
    detail:['旅人把一句旋律留在树下。经过许多季节，它没有变得更响，却变得更熟悉。','树根围成一座小小的舞台。这里不需要完美的开场，只需要愿意再试一次的勇气。']},
  {id:'workshop',name:'遗落工坊',english:'The Forgotten Workshop',symbol:'04 · 未完成的蓝图',
    summary:'齿轮还没咬合，蓝图已经画到了纸外。桌边留着一句话：先让它转一下，再问它有什么用。',
    detail:['旅人用方块搭过想象中的装置，也对着不肯运转的结构发过呆。失败没有把工坊关上，只让桌上多了几张草稿。','有些想法起初像玩笑。等第一个齿轮终于带动第二个，它们就有了继续被认真对待的理由。']},
  {id:'unwritten',name:'未书写之路',english:'The Unwritten Path',symbol:'05 · 留白的地图',
    summary:'最后一块路标上什么也没有。再往前，林间的光像一张尚未落笔的纸。',
    detail:['旅人曾想在出发前写好全部答案。可一路收集的，更多是值得留下的问题。','于是他合上写满旧路的地图，把空白的一页留在外面。下一步，还可以由自己选择。']},
];
export const newStories = [
{id:'lake-stage',region:'lake',name:'湖畔舞台',english:'The Lakeside Stage',symbol:'湖光 · 开场',summary:'空着的座位面朝湖水。旅人深吸一口气，第一次没有把声音留给自己。',detail:['他把同一句旋律练了许多遍，直到停顿也像呼吸一样自然。登台时，手还是微微发抖。','风没有替他唱完第一句。可第一句唱出以后，远处的水面便不再那么陌生。']},
{id:'rhythm-stones',region:'lake',name:'节奏之石',english:'The Rhythm Stones',symbol:'岸边 · 节拍',summary:'四块石头留下不同的回声。日复一日，轻轻的敲击也能把时间磨出形状。',detail:['起初，旅人总是追不上最后一拍。他放慢手势，让每一次落下都有自己的位置。','后来，节奏没有变简单。只是他学会了，在重复里听见细微的变化。']},
{id:'echoing-pier',region:'lake',name:'回声栈桥',english:'The Echoing Pier',symbol:'木桥 · 倾听',summary:'栈桥伸进水面的留白。这里没有新的乐章，只有旧旋律在不同的心情里重新响起。',detail:['旅人曾急着为每个声音找到名字。坐到桥边，他才听见木板的轻响、芦苇的摩擦，还有沉默的间隔。','同一段旋律，隔着一个季节再听，像一封终于读懂的旧信。']},
{id:'conductors-lantern',region:'lake',name:'指挥者之灯',english:'The Conductor’s Lantern',symbol:'晚风 · 合奏',summary:'灯光没有照向一个人，而是照亮了一圈等待回应的座位。',detail:['每盏小灯都有自己的亮度。旅人不再要求它们同时燃烧，只让彼此看见合适的入口。','当最轻的声音也拥有位置，湖畔便有了一首谁都无法独自完成的歌。']},
{id:'first-gear',region:'valley',name:'第一枚齿轮',english:'The First Gear',symbol:'山谷 · 好奇',summary:'一枚小齿轮躺在石台上。转动它以前，世界里还没有这个问题。',detail:['旅人想知道，圆轮为什么能带动另一只圆轮。他先用手试了一次，再把疑问画进纸里。','答案没有立即出现，桌面却从此变成了实验台。']},
{id:'unfinished-ideas',region:'valley',name:'未完成的工坊',english:'The Workshop of Unfinished Ideas',symbol:'工作台 · 修订',summary:'废纸筐旁边摆着一把椅子。这里的失败通常只坐一会儿，就又回到桌上。',detail:['第三张草图沿用了第一张的一条线，又删掉第二张最得意的部分。窗外的光换了方向，机器仍没有动。','旅人给草图留出新的边角。有些答案，要等下一次修改才肯露面。']},
{id:'great-transmission',region:'valley',name:'宏大传动',english:'The Great Transmission',symbol:'连杆 · 协作',summary:'最小的销钉藏在机器深处。没有人看见它，却没有一圈转动能绕过它。',detail:['旅人沿着转轴追踪力量的去处。从小轮到大轮，从连杆到风箱，每一次交接都改变着下一步。','他终于不再只看最耀眼的零件。让一台机器运转的，是那些准确而耐心的连接。']},
{id:'skyward-blueprint',region:'valley',name:'向天空的蓝图',english:'The Skyward Blueprint',symbol:'试飞架 · 想象',summary:'机翼只装好了一半，影子却已经越过山谷。',detail:['有人问它什么时候能飞。旅人指了指还空着的骨架，说今天先让这一根梁轻一点。','远大的想法没有替代细小的工作。它只是让每一次拧紧螺丝，都有了抬头的理由。']},
];
export const stories=[...forestStories,...newStories];
export const storyIds=stories.map(s=>s.id);
export const getStory=id=>stories.find(s=>s.id===id);
