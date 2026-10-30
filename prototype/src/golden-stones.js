import {stoneState} from './golden-trial.js';
const P={ink:0x293c38,shadow:0x45594f,stone:0x788375,face:0x929a86,edge:0xb6b69a,moss:0x667f55,gold:0xd8b56d,light:0xf0d397,dormant:0x596e60};
const rect=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
const glyphs=[['00100','00100','01100','01000','01000','11000','10000'],['10001','11001','01011','01010','01110','00100','00100'],['10001','11011','01010','11011','10001','11011','01010']];
function spiral(g,x,y,color){
 // Stepped, engraved two-turn spiral; no antialiased vector rotation.
 const points=new Set();for(let i=0;i<=160;i++){const t=i/160*Math.PI*4,r=1+i/160*16;points.add(`${Math.round(Math.cos(t)*r)},${Math.round(Math.sin(t)*r)}`);}
 for(const p of points){const [dx,dy]=p.split(',').map(Number);rect(g,P.shadow,x+dx+1,y+dy+1,2,2);}
 for(const p of points){const [dx,dy]=p.split(',').map(Number);rect(g,color,x+dx,y+dy,2,2);}
}
function central(g,p,stage){
 const x=p.x,y=p.y,complete=stage===5;
 rect(g,0x2c4439,x-7,y+31,70,14);rect(g,P.shadow,x-4,y+26,64,14);rect(g,P.edge,x-2,y+27,60,3);
 rect(g,P.ink,x,y-26,56,54);rect(g,P.stone,x+2,y-29,52,54);rect(g,P.face,x+6,y-31,44,51);rect(g,P.edge,x+6,y-31,42,3);rect(g,P.shadow,x+48,y-25,6,50);
 // Broken upper shoulder, vertical erosion and restrained moss at the foot.
 rect(g,P.shadow,x+38,y-31,7,4);rect(g,P.stone,x+43,y-34,7,6);rect(g,P.edge,x+44,y-34,5,1);
 rect(g,P.shadow,x+7,y-20,1,10);rect(g,P.shadow,x+8,y-10,3,1);rect(g,P.shadow,x+44,y+6,1,11);
 rect(g,P.moss,x-1,y+27,15,4);rect(g,P.moss,x+43,y+30,15,3);
 spiral(g,x+28,y-6,complete?P.light:stage?P.gold:0xb2a37a);
 for(let i=0;i<5;i++){rect(g,P.ink,x+10+i*8,y+20,5,4);rect(g,i<stage?P.gold:P.shadow,x+11+i*8,y+21,3,2);}
 if(complete){rect(g,P.gold,x+4,y-23,2,42);rect(g,P.light,x+5,y-23,1,38);rect(g,P.gold,x+50,y-23,2,42);for(const dx of [10,44]){rect(g,P.light,x+dx,y+8,2,2);rect(g,P.gold,x+dx-1,y+9,4,1);}}
}
function peripheral(g,p,state){
 const x=p.x,y=p.y,i=p.index,awake=state==='awakened',done=state==='completed',color=[0x9bbcb3,0xb7bd8c,0xa9a5c0][i];
 rect(g,0x2f473c,x-4,y+12,32,10);rect(g,P.shadow,x-3,y+9,30,9);rect(g,P.edge,x-2,y+9,27,2);
 rect(g,P.ink,x,y-13,24,24);rect(g,P.stone,x+2,y-16,20,26);rect(g,P.face,x+4,y-17-i%2,15,24);rect(g,P.edge,x+4,y-17-i%2,14,2);rect(g,P.shadow,x+19,y-12,3,22);
 rect(g,P.moss,x-2,y+12,8,3);rect(g,P.moss,x+19,y+13,7,3);
 const pattern=glyphs[i];for(let row=0;row<pattern.length;row++)for(let col=0;col<pattern[row].length;col++)if(pattern[row][col]==='1'){
  rect(g,P.shadow,x+8+col*2,y-11+row*2,2,2);
  rect(g,done?P.gold:awake?color:P.dormant,x+7+col*2,y-12+row*2,2,2);
 }
 // One/two/three cut marks identify the stone independently of rune color.
 for(let k=0;k<=i;k++)rect(g,done?P.gold:P.ink,x+7+k*4,y+5,2,3);
 if(done){rect(g,P.gold,x-1,y+9,26,2);rect(g,P.light,x+10,y-22,4,2);rect(g,P.gold,x+11,y-24,2,6);}
 if(awake){for(const dx of [0,22]){rect(g,color,x+dx,y-17,2,5);rect(g,color,x+dx,y-17,4,2);}}
}
export function createGoldenStones(scene){
 const stones=scene.region.places.filter(p=>p.id==='golden'||p.kind==='rune').map(p=>({p,g:scene.add.graphics().setName('trial-'+p.id).setDepth(p.y+p.h+1)}));
 const labels=stones.map(({p})=>({p,label:scene.add.text(p.door.x,p.door.y+24,'',{fontSize:'12px',fontFamily:'monospace',color:'#eee4bf',backgroundColor:'#30483f',padding:{x:4,y:3}}).setOrigin(.5).setDepth(1000)}));
 const light=scene.add.graphics().setName('trial-light').setDepth(891);let previous=-1;
 return time=>{
  const stage=scene.goldenStage;
  if(stage!==previous){
   for(const {p,g} of stones){g.clear();if(p.id==='golden')central(g,p,stage);else peripheral(g,p,stoneState(stage,p.id));}
   previous=stage;
  }
  for(const {p,label} of labels){
   const state=stoneState(stage,p.id),near=Math.hypot(scene.player.x-p.door.x,scene.player.y-p.door.y)<(state==='awakened'?200:125);
   label.setText(p.id==='golden'?`黄金回旋 · ${stage}/5`:`${p.index+1} · ${state==='completed'?'已铭刻':state==='awakened'?'已苏醒':'未苏醒'}`).setVisible(near);
  }
  light.clear();if(scene.reduced)return;
  // Integer steps, slow cadence, low opacity. No timers, textures or new
  // objects in update. Scene display-list shutdown owns all graphics/labels.
  for(const {p} of stones)if(stoneState(stage,p.id)==='awakened'){
   const a=.18+(.5+.5*Math.sin(time/1100))*.18;
   rect(light,P.light,p.x-4,p.y+(p.id==='golden'?30:13),p.w+8,2,a);
   rect(light,P.light,p.x+p.w/2-1,p.y-(p.id==='golden'?36:24),2,2,a);
  }
  if(scene.goldenCompletionAt!==null){
   const elapsed=time-scene.goldenCompletionAt;
   if(elapsed>=0&&elapsed<2200){const p=stones.find(o=>o.p.id==='golden').p,t=elapsed/2200;
    for(let i=0;i<5;i++){const a=t*Math.PI*2+i*Math.PI*2/5,r=18+t*14;rect(light,P.light,p.x+28+Math.round(Math.cos(a)*r),p.y-6+Math.round(Math.sin(a)*r),2,2,(1-t)*.65);}
   }
  }
 };
}
