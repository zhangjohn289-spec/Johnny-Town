// Geometry is independent of Phaser: renderer and reachability tests share this source.
export const woodsPaths = [
  [[48,640],[160,620],[250,590],[320,520],[400,460],[500,420],[590,380],[690,365],[780,290],[840,230],[890,200],[944,144]],
  [[400,460],[460,510],[540,570],[620,610],[720,595],[816,552]],
  [[320,520],[250,464],[200,408],[160,352]],
];
export const woodsClearings=[{x:220,y:580,r:70},{x:400,y:460,r:76},{x:690,y:330,r:100},{x:720,y:565,r:90},{x:890,y:190,r:65},{x:160,y:350,r:42}];
export function distanceToPaths(x,y) {
  let distance=Infinity;
  for(const path of woodsPaths) for(let i=1;i<path.length;i++) {
    const [ax,ay]=path[i-1],[bx,by]=path[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-t*dx,y-ay-t*dy));
  }
  return distance;
}
export const inClearing=(x,y,margin=0)=>woodsClearings.some(c=>Math.hypot(x-c.x,y-c.y)<c.r+margin);
const places=[
  {id:'beginning',kind:'story',storyId:'beginning',name:'初始之地',action:'阅读',door:{x:220,y:610},x:198,y:528,w:44,h:48},
  {id:'crossroads',kind:'story',storyId:'crossroads',name:'命运岔路',action:'阅读',door:{x:400,y:460},x:374,y:390,w:36,h:32},
  {id:'echoing-tree',kind:'story',storyId:'echoing-tree',name:'回响之树',action:'聆听',door:{x:690,y:365},x:660,y:260,w:60,h:56},
  {id:'workshop',kind:'story',storyId:'workshop',name:'遗落工坊',action:'查看',door:{x:720,y:595},x:650,y:480,w:132,h:72},
  {id:'unwritten',kind:'story',storyId:'unwritten',name:'未书写之路',action:'阅读',door:{x:890,y:200},x:880,y:140,w:32,h:24},
];
const trees=[];
for(let row=0;row<12;row++) for(let col=0;col<17;col++) {
  const x=24+col*62+((row*13+col*7)%19)-9, y=68+row*62+((row*7+col*17)%23)-11;
  if(x>1010||y>750)continue;
  if(distanceToPaths(x,y)<72||distanceToPaths(x,y-42)<58||inClearing(x,y,34)||inClearing(x,y-35,18))continue;
  trees.push([x,y]);
}
const rocks=[{x:280,y:320,w:32,h:24,kind:'rock'},{x:540,y:220,w:40,h:24,kind:'rock'},{x:876,y:450,w:32,h:24,kind:'rock'}];
export const woods={
  id:'woods',name:'Memory Woods · 记忆森林',renderer:'woods',width:1024,height:768,
  bounds:{x:16,y:32,width:992,height:720}, trees,places,paths:woodsPaths,
  collisions:[...places.map(p=>({x:p.x,y:p.y,w:p.w,h:p.h,kind:'landmark'})),...trees.map(([x,y])=>({x:x-14,y:y-12,w:28,h:24,kind:'tree'})),...rocks],
  spawns:{fromTown:{x:160,y:620}},defaultSpawn:'fromTown',
  exits:[{id:'woods-to-town',name:'← Johnny Town',action:'返回',door:{x:48,y:640},to:'town',spawn:'fromWoods'}],
};
