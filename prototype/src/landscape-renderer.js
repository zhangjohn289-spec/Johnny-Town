import {pathDistance,waterSpan} from './expansion-data.js';
const box=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
function gear(scene,x,y,r){const g=scene.add.graphics({x,y}).setDepth(y+30);g.fillStyle(0x5e5649).fillCircle(0,0,r);g.fillStyle(0xc19a59).fillCircle(0,0,r-4);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(g,0xc19a59,Math.cos(a)*r-5,Math.sin(a)*r-5,10,10);}g.fillStyle(0x4b514b).fillCircle(0,0,6);return g;}
export function renderLandscape(scene){
 const r=scene.region,id=r.id,isLake=id==='lake',isValley=id==='valley';scene.art={};const key=id+'-landscape';
 if(!scene.textures.exists(key)){
  const g=scene.make.graphics({add:false});
  for(let y=0;y<768;y+=8)for(let x=0;x<1024;x+=8){
   const n=((Math.imul(x+13,374761393)^Math.imul(y+7,668265263))>>>0)%101;
   const patch=Math.sin(x/91)+Math.cos(y/67)+Math.sin((x+y)/131),d=pathDistance(r.paths,x,y);
   let c=isValley?(patch>0?0x8a8973:0x797d6a):isLake?(patch>0?0x6c9167:0x779970):(patch>0?0x8eaa64:0x7e9d59);
   if(d<31)c=isValley?(d<23?0xb4a27b:0x6e705e):(d<23?0xd0bd88:0xa1a16b);
   box(g,c,x,y,8,8);if(n<13)box(g,d<26?0xae9f74:isValley?0x98977e:0xa4b77a,x+2,y+4,3,2);
   if(!isValley&&d>44&&n<9&&Math.sin(x/83)*Math.cos(y/91)>.25){box(g,0x64834c,x+3,y+1,1,5);box(g,n%2?0xf5dc9b:0xd6a5aa,x+1,y,4,2);}
  }
  if(isLake){
   for(let y=80;y<460;y+=16){const v=waterSpan(y);if(v)box(g,0xb5bc8a,v.x-8,y-2,v.w+16,20);}
   for(let y=80;y<460;y+=16){const v=waterSpan(y);if(!v)continue;box(g,y<192?0x438f9c:y>368?0x48939b:0x3d8492,v.x,y,v.w,16);box(g,0x5b9eaa,v.x,y,5,16);box(g,0x72adae,v.x+v.w-5,y,5,16);
    for(let x=v.x+20;x<v.x+v.w-20;x+=31){const n=(x*7+y*13)%53;if(n<18)box(g,n<5?0xa3cfca:0x65a9b2,x,y+(n%11),8+n%13,2);}
   }
  }
  if(isLake)for(const [x,y] of [[470,180],[790,340],[735,150],[450,350]]){box(g,0x376b57,x,y,20,8);box(g,0x77aa72,x+3,y-3,13,7);box(g,0xe9c3af,x+8,y-6,5,4);}
  if(isLake){for(let y=416;y<565;y+=9){box(g,0x655139,528,y,44,8);box(g,0xb99b66,530,y,40,5);}for(const x of [524,574])box(g,0x796343,x,410,5,161);}
  if(isValley){for(let y=505;y<555;y+=10){box(g,0x574e40,420,y,180,8);box(g,0xb7a17b,423,y,174,3);}for(let x=586;x<735;x+=16){box(g,0x4b5651,x,421,15,11);box(g,0xb0b3a0,x,422,13,3);}box(g,0x57635c,728,421,11,65);}
  g.generateTexture(key,1024,768);g.destroy();
 }
 scene.add.image(0,0,key).setOrigin(0).setDepth(-100);const decor=scene.add.graphics().setDepth(1);
 for(const [i,[x,y]] of r.trees.entries()){box(decor,0x40533b,x-29,y+6,66,20,.3);scene.add.image(x-40,y-76,i%2?'treeB':'tree').setOrigin(0).setTint(isLake?0xb4d0a5:0xffffff).setDepth(y+24);}
 for(let i=0;i<90;i++){const x=40+(i*137)%940,y=55+(i*83)%650;if(pathDistance(r.paths,x,y)<50)continue;const span=isLake?waterSpan(y):null;if(span&&x>span.x-15&&x<span.x+span.w+15)continue;box(decor,isValley?0x6a7063:0x567e4b,x,y,14,8);box(decor,isValley?0xabad91:0x9db477,x+3,y-3,8,5);}
 if(isLake){for(let y=120;y<430;y+=29){const s=waterSpan(y);for(const x of [s.x-15,s.x+s.w+10]){box(decor,0x496e4a,x,y-10,2,21);box(decor,0x6b8952,x+5,y-16,2,27);box(decor,0xbca275,x+5,y-17,3,6);}}}
 for(const w of r.collisions.filter(w=>w.kind==='fence'||w.kind==='rock')){const g=scene.add.graphics().setDepth(w.y+w.h);if(w.kind==='fence'){box(g,0x725b3c,w.x,w.y-7,w.w,6);box(g,0xb79b68,w.x,w.y-9,w.w,3);for(let x=w.x;x<w.x+w.w;x+=32)box(g,0x987c50,x,w.y-18,6,34);}else{box(g,0x535e55,w.x,w.y+8,w.w,w.h-8);box(g,0xa3a38a,w.x+8,w.y,w.w-16,12);for(let a=0;a<w.w-12;a+=24){box(g,0x8c9781,w.x+a+4,w.y-6-(a%3)*3,20,12);box(g,0xb3b69a,w.x+a+6,w.y-6-(a%3)*3,13,3);}for(let x=w.x+12;x<w.x+w.w-10;x+=21)box(g,0x777e6d,x,w.y+16,3,w.h-22);}}
 const gears=[];
 for(const p of r.places){const g=scene.add.graphics().setDepth(p.y+p.h),x=p.x,y=p.y;
  if(p.id==='lake-stage'){
   for(let k=0;k<3;k++){box(g,0x60735b,x-25,y+60+k*18,130,7);box(g,0xb7b78c,x-25-k*12,y+58+k*18,180+k*24,3);}
   box(g,0x72573b,x,y,p.w,p.h);for(let a=0;a<p.w;a+=12)box(g,0xb9a273,x+a,y+4,9,p.h-8);
   box(g,0x876244,x-8,y-65,7,105);box(g,0x876244,x+p.w,y-65,7,105);box(g,0xb77b65,x-8,y-65,p.w+15,13);box(g,0x9b5860,x,y-50,17,48);box(g,0x9b5860,x+p.w-17,y-50,17,48);
  }else if(p.id==='rhythm-stones'){for(let i=0;i<4;i++){box(g,0x536b65,x+i*21,y+7,17,21);box(g,0xc1c5a1,x+i*21+2,y,13,13);box(g,0x6c8278,x+i*21+7,y+3,2,5);}}
  else if(p.id==='conductors-lantern'){box(g,0x69593c,x+9,y-50,6,85);box(g,0x47594d,x-7,y-61,38,8);box(g,0xd3b66e,x,y-53,24,27);box(g,0xffe7a1,x+4,y-48,16,18);box(g,0x5a6653,x-4,y-27,32,5);}
  else if(p.id==='echoing-pier'){box(g,0x755a3e,x,y-16,6,46);box(g,0xd8c496,x-4,y-26,29,18);}
  else if(p.id==='first-gear'){box(g,0x5b6257,x,y+20,48,20);gears.push(gear(scene,x+24,y,22));}
  else if(p.id==='unfinished-ideas'){
   box(g,0x555c50,x,y-34,p.w,p.h+34);for(let a=0;a<p.w;a+=12)box(g,0xa19268,x+a+2,y-25,8,p.h+20);
   for(let k=0;k<6;k++){box(g,0x466e69,x+35-k*10,y-76+k*8,60+k*20,9);box(g,0x78958a,x+37-k*10,y-75+k*8,56+k*20,2);}
   box(g,0x343e38,x+35,y+4,55,75);box(g,0x547e7b,x+7,y+5,22,28);box(g,0xc0b891,x+17,y+5,2,28);box(g,0xc0b891,x+7,y+18,22,2);box(g,0xba9c69,x+8,y+60,115,12);box(g,0x527d88,x+52,y+52,45,12);box(g,0xb9d4cb,x+58,y+54,32,1);box(g,0x6e7062,x+100,y-90,17,61);
  }else if(p.id==='great-transmission'){box(g,0x555e53,x,y,88,62);box(g,0xadb199,x+6,y+6,76,4);gears.push(gear(scene,x+24,y+26,20).setDepth(y+63),gear(scene,x+63,y+37,15).setDepth(y+64));for(let a=0;a<3;a++)box(g,0xb79559,x+5+a*25,y+67,18,8);}
  else {box(g,0x776749,x-12,y+56,166,14);box(g,0xc4ba96,x+55,y+15,12,55);for(let k=0;k<5;k++){box(g,0xc8c4a3,x+5+k*15,y+12+k*6,15,5);box(g,0x718d8b,x+66+k*13,y+36-k*6,12,3);}box(g,0x456d7a,x+10,y+77,80,24);for(let a=0;a<4;a++)box(g,0xc0d2bd,x+15,y+81+a*4,65-a*9,1);}
  scene.add.text(p.door.x,p.door.y+27,p.name,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:isValley?'#514d3e':'#355e54',padding:{x:7,y:4}}).setOrigin(.5).setDepth(1000);
 }
 scene.ambientUpdate=time=>gears.forEach((g,i)=>g.setRotation(scene.reduced?0:time*.00025*(i%2?-1:1)));
 if(id==='meadow'){scene.add.text(550,680,'风从花间经过，路向远处伸展。',{fontSize:'13px',fontFamily:'monospace',color:'#f3e3b2',backgroundColor:'#617c49',padding:{x:8,y:5}}).setOrigin(.5).setDepth(1000);}
}
