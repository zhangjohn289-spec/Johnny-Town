export const townRecords=[
 ['P1','第一条路铺好，红色旅人开始散步。'],['P2','小屋、神社和宝箱开始迎接访客。'],
 ['P3','像素建筑换上新装，散步也更顺手。'],['P4','小镇迎来第一批公开访客。'],
 ['P5A','路标指向镇外，世界从此不止一张地图。'],['P5B','记忆森林在树影间收藏故事。'],
 ['P5C','旋律湖与机械谷开放，草甸长出蜿蜒小径。'],['P5D','遗忘遗迹留下九个等待发现的秘密。'],['P5E','远方的旅人也能沿着网址来到这里。'],
];
export const directory=[['Johnny Town','中心小镇，小屋、神社与市政厅在这里迎客。'],['Frontier Meadow','通往各地的明亮草甸，留意路边的石阶。'],['Memory Woods','循着林间小径寻找成长与探索的故事。'],['Melody Lake','湖岸舞台、节奏与回声。'],['Gear Valley','齿轮、工坊和未完成的奇想。'],['Forgotten Ruins','旧石墙深处收藏着秘密和一点预算问题。']];
export function renderCityHall(root){
 const add=(parent,tag,text)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};
 for(const [title,lines] of [['小镇档案 · Town Records',townRecords.map(([p,t])=>p+' — '+t)],['世界目录 · World Directory',directory.map(([p,t])=>p+' — '+t)],['镇长办公室 · Mayor’s Office',['Johnny, the Chief Mek','一位绿皮兽人工程师，热爱黄铜齿轮、机械发明与雄心勃勃的建设计划。','镇长：「俺寻思，这座镇子还能再扩建一点。」','财政处：「预算申请尚未通过。」']],['公告栏 · Notice Board',['Johnny Town 已开放探索。道路上的故事与秘密正在等待旅人；新的改进会在准备好时与大家见面。']]]){
  const section=document.createElement('section');root.append(section);add(section,'h3',title);for(const line of lines)add(section,'p',line);
 }
}
export function drawCityHall(scene,p){
 const g=scene.add.graphics().setDepth(p.y+p.h),box=(c,x,y,w,h)=>g.fillStyle(c).fillRect(x,y,w,h),{x,y,w,h}=p;
 box(0x52614b,x-8,y+h-8,w+20,18);box(0x928f79,x,y,w,h);box(0xc4b795,x+5,y+5,w-10,h-10);
 for(let i=0;i<w;i+=24){box(0x827b64,x+i,y+12,1,h-16);box(0xaaa185,x+i,y+35,22,2);}
 for(const a of [0,w-8])box(0x725c43,x+a,y,8,h);box(0x725c43,x,y+25,w,7);
 for(let i=0;i<5;i++){box(0x45665c,x-10+i*8,y-7-i*7,w+20-i*16,8);box(0x8b9b79,x-8+i*8,y-7-i*7,w+16-i*16,2);}
 box(0x39483d,x+w/2-18,y+h-48,36,48);box(0xb6a06c,x+w/2-22,y+h-52,44,5);box(0xd1b76c,x+w/2+10,y+h-22,4,4);
 for(const a of [18,w-46]){box(0x527c7a,x+a,y+39,28,22);box(0xe3d19e,x+a+12,y+39,3,22);box(0xe3d19e,x+a,y+49,28,3);}
 const cx=x+w/2,cy=y+12;g.lineStyle(4,0xc9a45b).strokeCircle(cx,cy,11);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(0xc9a45b,cx+Math.cos(a)*14-3,cy+Math.sin(a)*14-3,6,6);}
 scene.add.text(cx,y-65,'市政厅 · CITY HALL',{fontSize:'12px',color:'#fff0c6',backgroundColor:'#594934',padding:{x:6,y:4}}).setOrigin(.5).setDepth(1000);
}
