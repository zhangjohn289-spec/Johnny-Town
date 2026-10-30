import {pathDistance} from './expansion-data.js';
import {ensureGearArt,GEAR_SPECS,gearAngle,frameAt,meshPhase} from './gear-art.js';
const C={ink:0x292e2c,iron:0x434b48,edge:0x76817a,brass:0xc99853,light:0xf1ce85,copper:0xac6d48,shade:0x654735,teal:0x3e6a65};
const box=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
function rivets(g,x,y,w,h){for(const a of [x+4,x+w-6])for(const b of [y+4,y+h-6]){box(g,C.ink,a,b,3,3);box(g,C.light,a,b,2,1);}}
function panel(g,x,y,w,h){box(g,C.ink,x,y,w,h);box(g,C.iron,x+2,y+2,w-4,h-4);box(g,C.edge,x+2,y+2,w-4,2);box(g,0x343a36,x+3,y+h-6,w-6,4);rivets(g,x,y,w,h);}
function pipe(g,x,y,w,h){box(g,C.ink,x-1,y-1,w+2,h+2);box(g,C.shade,x,y,w,h);box(g,C.copper,x+1,y+1,Math.max(2,w-2),Math.max(2,h-2));box(g,C.light,x+1,y+1,w>h?w-2:1,w>h?1:h-2);}
function gauge(g,x,y){box(g,C.ink,x-7,y-7,14,14);box(g,C.brass,x-6,y-6,12,12);box(g,0xe2d7b0,x-4,y-4,8,8);box(g,C.shade,x,y-3,1,5);box(g,C.ink,x,y,4,1);}
function lamp(g,x,y){box(g,C.ink,x-4,y-3,9,14);box(g,C.brass,x-3,y-4,7,2);box(g,0xb8884c,x-2,y,5,7);box(g,0xffe9a3,x-1,y,3,5);box(g,C.ink,x-5,y+9,11,2);}
function label(scene,p){scene.add.text(p.door.x,p.door.y+27,p.name,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#453a30',padding:{x:7,y:4}}).setOrigin(.5).setDepth(1000);}
export function renderValley(scene){
 scene.art={};const r=scene.region,key='clockwork-valley-ground';ensureGearArt(scene);
 if(!scene.textures.exists(key)){
  const g=scene.make.graphics({add:false});
  for(let y=0;y<768;y+=8)for(let x=0;x<1024;x+=8){
   const n=((Math.imul(x+13,374761393)^Math.imul(y+7,668265263))>>>0)%101,d=pathDistance(r.paths,x,y),patch=Math.sin(x/91)+Math.cos(y/67)+Math.sin((x+y)/131);
   box(g,d<23?0xb29a70:d<31?0x696859:patch>0?0x747562:0x686c5c,x,y,8,8);
   if(d<22&&n<30){box(g,0x8f805f,x,y,7,1);box(g,0xc3ac7e,x+1,y+2,5,3);}
   else if(n<14)box(g,d<26?0xc4ae83:0x8b8c70,x+2,y+4,3,2);
  }
  // Existing bridge and pipe route remain at exactly their original coordinates.
  for(let y=505;y<555;y+=10){box(g,0x413c31,420,y,180,8);box(g,0xb09767,423,y,174,3);for(const x of [428,585])box(g,C.ink,x,y+4,3,2);}
  pipe(g,586,421,149,11);pipe(g,728,421,11,65);for(let x=594;x<730;x+=24){box(g,C.brass,x,420,3,13);box(g,C.light,x,420,3,2);}
  g.generateTexture(key,1024,768);g.destroy();
 }
 scene.add.image(0,0,key).setOrigin(0).setDepth(-100);
 const floor=scene.add.graphics().setDepth(1);
 for(let i=0;i<68;i++){const x=40+i*137%940,y=55+i*83%650;if(pathDistance(r.paths,x,y)<50)continue;box(floor,0x545e50,x,y,12,5);box(floor,0x8c8f73,x+2,y-2,7,3);}
 for(const [i,[x,y]] of r.trees.entries()){box(floor,0x394439,x-29,y+6,66,20,.4);scene.add.image(x-40,y-76,i%2?'treeB':'tree').setOrigin(0).setTint(0xc1c5a3).setDepth(y+24);}
 for(const w of r.collisions.filter(w=>w.kind==='rock')){
  const g=scene.add.graphics().setDepth(w.y+w.h);box(g,0x4b554c,w.x,w.y+8,w.w,w.h-8);box(g,0x92927b,w.x+7,w.y,w.w-14,12);
  for(let x=w.x+6;x<w.x+w.w-12;x+=24){box(g,0x7c8570,x,w.y-5,20,14);box(g,0xb2ad87,x+2,w.y-5,14,2);box(g,0x3c4940,x+6,w.y+20,2,Math.max(4,w.h-25));}
  // Retaining-wall braces sit on existing impassable rock, not on walkways.
  for(let x=w.x+18;x<w.x+w.w-12;x+=48){panel(g,x,w.y+12,8,Math.max(12,w.h-18));}
 }
 // A compact boiler bank occupies the existing north-west rock shelf.
 // Decorative only: it adds no invisible obstacles to the map.
 const boiler=scene.add.graphics().setDepth(164);
 for(const x of [138,194]){panel(boiler,x,104,40,43);box(boiler,C.copper,x+4,108,32,33);box(boiler,0xcd935d,x+6,110,5,29);for(const y of [111,134]){box(boiler,C.ink,x+2,y,36,4);box(boiler,C.brass,x+3,y,34,1);}gauge(boiler,x+21,122);pipe(boiler,x+15,94,9,10);}
 pipe(boiler,177,116,18,6);pipe(boiler,233,137,50,7);panel(boiler,275,129,30,26);gauge(boiler,290,140);
 // Spare parts stay tucked alongside the bottom retaining wall.
 const stores=scene.add.graphics().setDepth(710);
 for(const x of [637,667]){panel(stores,x,679,25,22);box(stores,C.shade,x+3,683,19,14);box(stores,C.brass,x+3,688,19,3);}
 const mechanisms=[],vents=[];
 function cog(name,x,y,direction=1,phase=0,depth=y+30){
  const image=scene.add.image(x,y,'clockwork-'+name,frameAt(phase)).setDepth(depth);
  mechanisms.push({image,teeth:GEAR_SPECS[name].teeth,direction,phase});return image;
 }
 for(const p of r.places){const g=scene.add.graphics().setDepth(p.y+p.h),x=p.x,y=p.y;
  box(floor,0x363d32,x-6,y+p.h-5,p.w+14,14,.45);
  if(p.id==='first-gear'){
   panel(g,x,y+12,48,28);box(g,C.brass,x+8,y+35,32,4);pipe(g,x+22,y-1,5,25);
   cog('large',x+24,y-2,1,0,y+39);gauge(g,x+8,y+26);
   box(g,C.brass,x+4,y+43,40,3);
  }else if(p.id==='unfinished-ideas'){
   box(g,C.ink,x-3,y-37,136,128);box(g,0x786449,x,y-33,130,120);
   for(let a=0;a<130;a+=16){box(g,0xa58658,x+a,y-30,4,115);box(g,0x453e32,x+a+5,y-30,2,115);}
   box(g,0x3a4038,x+38,y+6,48,77);box(g,0x222c29,x+43,y+11,38,72);box(g,0x65513b,x+46,y+13,3,67);
   for(const wx of [8,96]){panel(g,x+wx-2,y+3,28,35);box(g,0xd09a50,x+wx+2,y+7,20,25);box(g,0xffd782,x+wx+3,y+8,18,8);box(g,C.ink,x+wx+11,y+6,2,27);box(g,C.ink,x+wx+2,y+19,20,2);}
   for(let k=0;k<7;k++){box(g,C.ink,x+39-k*9,y-82+k*8,52+k*18,10);box(g,k%2?0x365c58:0x416e65,x+40-k*9,y-81+k*8,50+k*18,7);box(g,0x8caa8d,x+41-k*9,y-81+k*8,48+k*18,1);}
   box(g,C.brass,x-18,y-25,166,4);rivets(g,x-16,y-25,162,8);
   pipe(g,x+112,y-92,12,63);box(g,C.ink,x+108,y-96,20,6);pipe(g,x+124,y-50,12,113);gauge(g,x+130,y+14);vents.push([x+118,y-100]);
   panel(g,x+3,y+62,124,19);box(g,0xc5a873,x+1,y+59,128,5);box(g,0x345f68,x+47,y+53,47,8);
   for(let a=0;a<3;a++)box(g,0x9db9ad,x+51+a*4,y+55+a,30-a*7,1);
   lamp(g,x+32,y+11);lamp(g,x+91,y+11);
   panel(g,x+51,y-46,28,28);cog('small',x+65,y-32,1,0,y+91);
  }else if(p.id==='great-transmission'){
   panel(g,x,y,88,62);pipe(g,x+11,y+49,65,6);
   for(const dx of [22,64]){box(g,C.ink,x+dx-5,y+7,10,43);box(g,C.edge,x+dx-3,y+9,3,40);}
   cog('large',x+22,y+24,1,0,y+63);cog('medium',x+64,y+24,-1,meshPhase(24,18),y+63);
   for(const dx of [6,65]){panel(g,x+dx,y+57,17,7);box(g,C.brass,x+dx+3,y+59,11,2);}
   gauge(g,x+44,y+50);
  }else if(p.id==='skyward-blueprint'){
   panel(g,x-3,y+48,146,23);box(g,C.brass,x+1,y+47,138,3);
   for(const dx of [9,119]){panel(g,x+dx,y-10,12,60);pipe(g,x+dx+3,y-8,5,56);}
   box(g,C.ink,x+7,y-16,127,12);box(g,C.teal,x+9,y-14,123,7);rivets(g,x+7,y-16,127,12);
   pipe(g,x+66,y-42,6,50);panel(g,x+52,y-44,35,13);gauge(g,x+70,y-37);
   cog('medium',x+31,y+24,1,0,y+72);cog('small',x+61,y+24,-1,meshPhase(18,12),y+72);
   box(g,C.brass,x+92,y+8,4,39);box(g,C.light,x+88,y+8,24,3);box(g,C.teal,x+96,y+13,26,22);
   for(let a=0;a<4;a++)box(g,0xa5c5b1,x+99,y+16+a*4,18-a*3,1);
   panel(g,x+3,y+79,82,23);box(g,0x315861,x+6,y+82,76,17);for(let a=0;a<4;a++)box(g,0xa3c0ae,x+10,y+85+a*3,60-a*9,1);
  }else if(p.activityId==='gears'){
   panel(g,x,y+8,60,26);box(g,C.brass,x-5,y+6,70,5);for(const dx of [5,48])box(g,C.shade,x+dx,y+29,6,12);
   cog('small',x+14,y-6,1,0,y+35);cog('small',x+38,y-6,-1,meshPhase(12,12),y+35);
   pipe(g,x+51,y-22,5,26);gauge(g,x+53,y-23);
  }
  label(scene,p);
 }
 const steam=scene.add.graphics().setDepth(890);
 // Scene-owned graphics/images are destroyed by Phaser shutdown. No timer,
 // listener, physics body, or global animation registration is introduced.
 scene.ambientUpdate=time=>{
  for(const m of mechanisms)m.image.setFrame(frameAt(gearAngle(scene.reduced?0:time,m.teeth,m.phase,m.direction)));
  steam.clear();if(scene.reduced)return;
  for(const [x,y] of vents)for(let i=0;i<4;i++){
   const t=((time/1600+i*.18)%3);if(t>1)continue;
   const dx=Math.round(Math.sin(t*3+i)*3),rise=Math.round(t*24),s=3+Math.floor(t*5);
   box(steam,0xc0c4ac,x+dx-s/2,y-rise,s,s,.38*(1-t));
  }
 };
}
