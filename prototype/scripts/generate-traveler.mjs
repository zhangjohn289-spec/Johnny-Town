import {createRequire} from 'node:module';import fs from 'node:fs';import {WALK_POSES,WALK_BLOCK} from '../src/traveler-animation.js';
const {PNG}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const image=new PNG({width:32*WALK_BLOCK,height:48*4});
function dot(x,y,color,size=1){const rgb=color.match(/../g).map(c=>parseInt(c,16));for(let j=0;j<size;j++)for(let i=0;i<size;i++){const p=((y+j)*image.width+x+i)*4;image.data.set([...rgb,255],p);}}
function line(ox,oy,a,b,c,d,color,width){const n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let i=0;i<=n;i++)dot(ox+Math.round(a+(c-a)*i/(n||1)),oy+Math.round(b+(d-b)*i/(n||1)),color,width);}
function pose(direction,frame,swing){const ox=frame*32,oy=direction*48;
 const seg=(a,b,c,d,far=false)=>{line(ox,oy,a,b,c,d,'6c3430',3);line(ox,oy,a,b,c,d,far?'b94340':'e44845',2);};
 const s=direction===2?-swing:swing,leftLift=Math.max(0,swing)*2,rightLift=Math.max(0,-swing)*2;
 if(direction<2){
  seg(15,31,12+s,36,true);seg(12+s,36,10+s*2,42-leftLift,true);
  seg(15,31,19-s,36);seg(19-s,36,21-s*2,42-rightLift);
  seg(15,23,10+s,26,true);seg(10+s,26,6+s,29+s*2,true);
  seg(15,23,20-s,26);seg(20-s,26,24-s,29-s*2);
 }else{
  seg(15,31,14+s*2,36,true);seg(14+s*2,36,13+s*4,42-leftLift,true);
  seg(15,31,17-s*2,36);seg(17-s*2,36,18-s*4,42-rightLift);
  seg(15,23,14-s*2,27,true);seg(14-s*2,27,13-s*4,30,true);
  seg(15,23,17+s*2,27);seg(17+s*2,27,18+s*4,30);
 }
 // Same hollow red head polygon as the accepted sprite; fixed in every frame.
 const ring=[[12,5],[10,7],[9,10],[10,14],[12,16],[18,16],[21,13],[21,9],[18,5]];
 for(let i=0;i<ring.length;i++)seg(...ring[i],...ring[(i+1)%ring.length]);
 seg(15,17,15,31);
}
for(let d=0;d<4;d++){
 pose(d,0,0);
 for(let level=0;level<3;level++)for(let i=0;i<WALK_POSES;i++)pose(d,1+level*WALK_POSES+i,Math.sin(i/WALK_POSES*Math.PI*2)*(1-level/3));
}
fs.writeFileSync(new URL('../src/assets/player-walk.png',import.meta.url),PNG.sync.write(image));
