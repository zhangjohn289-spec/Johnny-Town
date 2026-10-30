import {distanceToPaths,inClearing,woodsClearings} from './woods-data.js';
import {leafMass,ensureForestTrees} from './nature-art.js';

const rect=(g,c,x,y,w,h,alpha=1)=>g.fillStyle(c,alpha).fillRect(Math.round(x),Math.round(y),w,h);
function texture(scene,key,w,h,paint){
  if(!scene.textures.exists(key)){
    const g=scene.make.graphics({x:0,y:0,add:false});paint(g);g.generateTexture(key,w,h);g.destroy();
  }
  return key;
}
function leafCloud(g,x,y,w,h,seed=0){
  leafMass(g,x,y,w,h,seed);
}
function woodsTextures(scene){
 texture(scene,'woods-ground',1024,768,g=>{
  rect(g,0x3c573c,0,0,1024,768);
  for(let y=0;y<768;y+=8)for(let x=0;x<1024;x+=8){
   const n=(x*13+y*19+(x*y)%113)%89,d=distanceToPaths(x+4,y+4);
   const clearing=woodsClearings.some(c=>Math.hypot(x-c.x,y-c.y)<c.r);
   const edge=Math.min(x,y,1024-x,768-y)<32;
   const patch=Math.sin(x/97)+Math.cos(y/113)+Math.sin((x-y)/149);
   let color=edge?0x304c38:clearing?0x6d7e4c:patch>1?0x566e43:patch<-.6?0x3e5b3e:0x496640;
   if(d<31)color=d<23?(n<30?0xc5b27c:0xb5a471):0x8f8858;
   rect(g,color,x,y,8,8);
   if(n<6)rect(g,d<28?0xa29465:0x7b8e58,x+2,y+3,3,2);
   if(n===41&&d>35)rect(g,0xd7bf80,x+2,y+1,2,2);
  }
  // Fallen leaves, moss and occasional stepping stones follow the path edges.
  for(let y=32;y<736;y+=17)for(let x=24;x<1000;x+=19){
   const d=distanceToPaths(x,y),n=(x*7+y*13)%47;
   if(d>26&&d<45&&n<9){rect(g,n%2?0xa58d55:0xc7a16a,x,y,4,2);rect(g,0x677546,x+5,y+2,2,4);}
   if(d<18&&n<4){rect(g,0x8d9275,x,y,10,5);rect(g,0xc0be94,x+2,y,6,2);}
  }
  // Sunlit entrance, in small stepped patches rather than a screen-covering filter.
  for(let i=0;i<7;i++)rect(g,0xe6d68a,112+i*14,550+i*9,90-i*8,12,.09);
 });
 texture(scene,'woods-stone',96,112,g=>{
  rect(g,0x344a37,15,94,70,12,.6);rect(g,0x76806a,26,45,44,52);rect(g,0xa1a58b,30,35,36,58);
  rect(g,0xc5c4a0,34,31,28,9);rect(g,0x5a6856,27,90,44,8);rect(g,0xd0cba5,35,45,23,3);
  for(let i=0;i<3;i++)rect(g,0x6d7964,36,55+i*9,20-i*4,2);
  rect(g,0x819454,25,80,12,12);rect(g,0xa8ae64,25,80,8,3);rect(g,0x819454,60,67,9,20);
  rect(g,0xd4b86f,44,17,8,8);rect(g,0xf3df9c,46,15,4,12);
 });
 texture(scene,'woods-sign',96,120,g=>{
  rect(g,0x344a37,16,104,68,8,.5);rect(g,0x66533d,43,25,9,82);rect(g,0xa58a56,44,25,3,82);
  rect(g,0x614e37,14,35,66,23);rect(g,0xba9b65,12,33,64,19);rect(g,0xe1c68c,16,35,54,3);
  rect(g,0x614e37,24,64,66,20);rect(g,0x9c8858,23,62,65,18);
  for(let i=0;i<3;i++){rect(g,0x60563d,24+i*12,42,8,3);rect(g,0xe2ca8d,34+i*10,69,6,2);}
  rect(g,0x527b7b,12,29,10,17);rect(g,0xd8c29b,73,60,8,22);rect(g,0xbc7d56,56,25,10,8);
 });
 texture(scene,'woods-elder',240,240,g=>{
  rect(g,0x283e33,44,215,150,17,.6);
  rect(g,0x564a39,93,112,53,105);rect(g,0x86704a,104,106,33,111);rect(g,0xb09760,110,129,8,74);
  rect(g,0x66543c,74,202,90,15);rect(g,0x8d7850,82,202,24,8);rect(g,0x8d7850,139,197,30,12);
  for(let i=0;i<7;i++){rect(g,0x594b38,105+i*4,147+(i%3)*13,2,35);}
  rect(g,0x6b5c40,58,99,50,14);rect(g,0x6b5c40,133,79,54,15);
  leafCloud(g,13,54,130,88,3);leafCloud(g,100,28,122,94,8);leafCloud(g,52,6,126,103,15);
  leafCloud(g,33,31,144,80,21);leafCloud(g,136,59,88,70,4);
  // Original wooden note ornaments and hanging light beads.
  for(const [x,y] of [[57,137],[167,121],[187,146]]){
   rect(g,0xb8a374,x,y-24,1,24);rect(g,0xdcc989,x,y,3,18);rect(g,0xdcc989,x-5,y+14,7,5);rect(g,0xdcc989,x+2,y,8,3);
  }
  rect(g,0x3c5741,113,183,15,17);rect(g,0xdbca8d,118,187,5,5);
 });
 texture(scene,'woods-workshop',192,176,g=>{
  rect(g,0x314534,14,152,166,15,.55);
  rect(g,0x5b503b,26,55,140,96);rect(g,0x82704d,32,63,128,80);
  for(let x=36;x<162;x+=14){rect(g,0xa39060,x,66,8,70);rect(g,0x6c5d41,x+9,66,2,70);}
  rect(g,0x413e30,56,84,45,56);rect(g,0x323f35,112,83,31,29);rect(g,0xa49661,124,83,3,30);
  for(let i=0;i<5;i++){rect(g,0x344e39,18+i*2,33+i*7,154-i*3,8);for(let x=22;x<168;x+=17)rect(g,0x687f49,x+(i%2)*4,34+i*7,12,3);}
  rect(g,0x9d8553,18,69,154,5);rect(g,0x7f6b45,26,68,6,82);rect(g,0xc0a675,26,70,2,79);
  rect(g,0x66543a,57,121,110,12);rect(g,0xb49c64,55,116,112,7);rect(g,0x77603e,65,128,8,26);rect(g,0x77603e,150,128,8,26);
  rect(g,0x557980,88,106,45,16);rect(g,0xa1c5b4,91,109,37,1);rect(g,0xa1c5b4,98,112,20,1);rect(g,0xa1c5b4,100,109,1,11);
  for(const [x,y,r] of [[31,131,16],[157,87,13]]){
   rect(g,0x514a3a,x-r,y-r+4,r*2,r*2-8);rect(g,0xb39155,x-r+4,y-r,r*2-8,r*2);
   rect(g,0xd0b474,x-r+5,y-r+2,r*2-10,3);rect(g,0x514a3a,x-4,y-4,8,8);
   for(const [dx,dy] of [[-r-3,-3],[r-3,-3],[-3,-r-3],[-3,r-3]])rect(g,0xb39155,x+dx,y+dy,6,6);
  }
  rect(g,0x55713e,17,45,25,12);rect(g,0x759149,143,54,33,14);
 });
 texture(scene,'woods-arch',128,144,g=>{
  rect(g,0x344a37,16,127,100,10,.5);
  for(const x of [23,94]){rect(g,0x64694f,x,29,13,100);rect(g,0xa1a07b,x+3,32,4,92);}
  rect(g,0x7d8261,23,25,84,15);rect(g,0xb7b28a,30,20,70,8);
  leafCloud(g,8,3,60,48,2);leafCloud(g,73,0,50,50,3);
  rect(g,0xb4a270,49,70,29,26);rect(g,0xe1d5aa,51,69,25,22);rect(g,0x95865d,62,94,5,35);
  rect(g,0xc5b278,61,49,5,5);
 });
}

export function renderWoods(scene){
 const r=scene.region;scene.art={};woodsTextures(scene);ensureForestTrees(scene);
 scene.add.image(0,0,'woods-ground').setOrigin(0).setDepth(-100);
 const floor=scene.add.graphics().setDepth(1);
 // Forest floor clusters stay off the routes and clearings. None secretly add collision.
 for(let i=0;i<110;i++){
  const x=24+(i*137)%976,y=40+(i*79)%690;
  if(distanceToPaths(x,y)<39||inClearing(x,y,-6))continue;
  const c=i%3?0x749255:0x3b6248;
  rect(floor,0x304b37,x-4,y+4,21,7,.45);rect(floor,c,x,y,12,8);rect(floor,0x95a567,x+3,y-3,6,5);
  if(i%6===0){rect(floor,0xd2af77,x+10,y+3,4,3);rect(floor,0xf1d798,x+12,y,3,3);}
  if(i%9===0){rect(floor,0xb77b59,x-7,y+3,5,3);rect(floor,0xe6cc9a,x-5,y+6,2,3);}
 }
 for(const [i,[x,y]] of r.trees.entries()){
  rect(floor,0x263e31,x-29,y-5,61,22,.4);
  scene.add.image(x-40,y-76,'nature-forest-tree-'+(i%4===0?2:i%7===0?3:i%2)).setOrigin(0).setDepth(y+12);
 }
 for(const w of r.collisions.filter(w=>w.kind==='rock')){
  const g=scene.add.graphics().setDepth(w.y+w.h);rect(g,0x374d3b,w.x-3,w.y+15,w.w+9,12,.5);
  rect(g,0x777f67,w.x,w.y+4,w.w,w.h-4);rect(g,0xa5aa89,w.x+5,w.y,w.w-12,10);rect(g,0x5a7450,w.x,w.y+17,12,8);
 }
 const objects=[['beginning','woods-stone',220,576,96,100],['crossroads','woods-sign',392,422,96,111],['echoing-tree','woods-elder',690,316,240,225],['workshop','woods-workshop',716,552,192,160],['unwritten','woods-arch',896,164,128,135]];
 for(const [id,key,x,bottom,w,foot] of objects){scene.art[id]=scene.add.image(x-w/2,bottom-foot,key).setOrigin(0).setDepth(bottom);}
 // A tiny empty stage: music is suggested visually, without unsolicited audio.
 rect(floor,0x665a3e,635,330,110,16);for(let x=638;x<742;x+=12)rect(floor,0xa39560,x,330,9,11);
 // Optional quiet clearing off the main route.
 const stump=scene.add.graphics().setDepth(359);rect(stump,0x674f36,143,330,33,28);rect(stump,0xb39662,140,326,38,10);rect(stump,0xe0c690,147,328,23,5);rect(stump,0x7c9160,138,346,10,14);
 scene.add.text(160,380,'停一下，也算向前。',{fontSize:'11px',fontFamily:'monospace',color:'#d5d5a6',backgroundColor:'#3c573c',padding:{x:4,y:4}}).setOrigin(.5).setDepth(1000);
 for(const p of r.places){
  scene.add.text(p.door.x,p.door.y+29,p.name,{fontSize:'12px',fontFamily:'monospace',color:'#f5e7af',backgroundColor:'#344f3c',padding:{x:6,y:4}}).setOrigin(.5).setDepth(1000);
  rect(floor,0xd6c58a,p.door.x-3,p.door.y+12,6,3);
 }
 scene.add.text(260,674,'MEMORY WOODS',{fontSize:'16px',fontFamily:'monospace',color:'#e2d39d',letterSpacing:3}).setOrigin(.5).setDepth(1000);
 scene.add.text(260,698,'五处故事 · 随意走走 · I 快速认识 Johnny',{fontSize:'11px',fontFamily:'monospace',color:'#d1cfa1'}).setOrigin(.5).setDepth(1000);
}
