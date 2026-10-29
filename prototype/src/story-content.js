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
  editorialNote:'这里仅展示概括性兴趣。具体音乐舞台经历与作品清单待本人补充；森林故事是象征性创作，不代表真实履历。',
};

export const stories = [
  {id:'beginning',name:'初始之地',english:'The Beginning',symbol:'01 · 晨光石碑',
    summary:'石碑没有刻下终点，只留了一处可以写名字的空白。林间的第一束光，对每个刚出发的人都一样。',
    detail:['旅人曾以为，地图的第一格会决定整条道路。后来才发现，起点只是鞋底沾上的第一点泥。','他把名字留在空白处，又在旁边画了一支箭。箭头很小，却朝向所有尚未走过的地方。'],
    connection:'关于起点与成长的寓言。这里不记录具体学校、住址或家庭经历。'},
  {id:'crossroads',name:'命运岔路',english:'The Crossroads',symbol:'02 · 旅行路牌',
    summary:'路牌的字迹来自不同的旅人。没有两支箭指向同一个方向，却都被风吹得轻轻作响。',
    detail:['每到一处陌生的林地，旅人都要重新听懂风声。有时换一条路，也意味着换一种看世界的方法。','他没有把旧路从地图上擦掉。那些转弯，后来成了理解下一片森林的线索。'],
    connection:'关于适应与选择的象征故事，不对应未经确认的学校或文化履历。'},
  {id:'echoing-tree',name:'回响之树',english:'The Echoing Tree',symbol:'03 · 林间小舞台',
    summary:'古树记得每一次轻轻敲响的节拍。声音散去以后，年轮还在悄悄接着唱。',
    detail:['旅人把一句旋律留在树下。经过许多季节，它没有变得更响，却变得更熟悉。','树根围成一座小小的舞台。这里不需要完美的开场，只需要愿意再试一次的勇气。'],
    connection:'音乐兴趣的寓言。具体乐器、演出和获奖经历待本人确认，未在此编造。'},
  {id:'workshop',name:'遗落工坊',english:'The Forgotten Workshop',symbol:'04 · 未完成的蓝图',
    summary:'齿轮还没咬合，蓝图已经画到了纸外。桌边留着一句话：先让它转一下，再问它有什么用。',
    detail:['旅人用方块搭过想象中的装置，也对着不肯运转的结构发过呆。失败没有把工坊关上，只让桌上多了几张草稿。','有些想法起初像玩笑。等第一个齿轮终于带动第二个，它们就有了继续被认真对待的理由。'],
    connection:'机械创造、Minecraft 工程与技术探索的主题故事，不宣称具体完成作品或专业资历。'},
  {id:'unwritten',name:'未书写之路',english:'The Unwritten Path',symbol:'05 · 留白的地图',
    summary:'最后一块路标上什么也没有。再往前，林间的光像一张尚未落笔的纸。',
    detail:['旅人曾想在出发前写好全部答案。可一路收集的，更多是值得留下的问题。','于是他合上写满旧路的地图，把空白的一页留在外面。下一步，还可以由自己选择。'],
    connection:'开放未来的象征。此处是本阶段的观景终点，没有未完成的传送入口。'},
];
export const storyIds=stories.map(s=>s.id);
export const getStory=id=>stories.find(s=>s.id===id);
