import {createRequire} from 'node:module';import fs from 'node:fs';const require=createRequire(import.meta.url);const {PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const out=new URL('../src/assets/',import.meta.url);fs.mkdirSync(out,{recursive:true});
let im;const color=h=>[...h.match(/\w\w/g)].map(x=>parseInt(x,16));
function rect(x,y,w,h,c){const rgb=color(c);for(let j=Math.max(0,Math.floor(y));j<Math.min(im.height,y+h);j++)for(let i=Math.max(0,Math.floor(x));i<Math.min(im.width,x+w);i++){const n=(j*im.width+i)*4;im.data[n]=rgb[0];im.data[n+1]=rgb[1];im.data[n+2]=rgb[2];im.data[n+3]=255;}}
function line(x,y,x2,y2,c,t=1){const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)rect(Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c);}
function poly(points,c){const ys=points.map(p=>p[1]);for(let y=Math.min(...ys);y<=Math.max(...ys);y++){let xs=[];for(let i=0;i<points.length;i++){let a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.floor(xs[i+1]-xs[i])+1,1,c);}}
function asset(name,w,h,draw){im=new PNG({width:w,height:h});draw();fs.writeFileSync(new URL(name+'.png',out),PNG.sync.write(im));}
let seed=431;function rnd(n){seed=(seed*1664525+1013904223)>>>0;return seed%n;}


for(const role of ['clerk','apprentice','explorer','archivist'])asset('npc-'+role,32,48,()=>{
 const coat={clerk:'526d79',apprentice:'936b41',explorer:'a17d51',archivist:'536e51'}[role];
 poly([[10,18],[5,23],[4,34],[9,37],[11,43],[24,43],[26,34],[26,23],[21,18]],'283b33');
 poly([[10,19],[22,19],[25,26],[24,36],[9,36],[7,26]],coat);
 rect(5,25,5,10,'b7976c');rect(23,25,4,9,'dfbd8d');
 rect(10,38,6,7,'49493b');rect(18,38,6,7,'3c4136');rect(8,44,8,4,'263730');rect(18,44,8,4,'263730');
 poly([[10,6],[13,3],[22,5],[24,11],[22,18],[13,18],[9,13]],'4c4333');rect(11,8,12,9,'dfbe8d');rect(12,9,2,3,'3c4433');rect(19,9,2,3,'3c4433');rect(14,15,6,1,'a37c57');
 if(role==='clerk'){rect(8,5,17,4,'354d60');rect(10,3,13,3,'6e8790');rect(14,19,5,11,'e1d5b4');rect(16,21,2,7,'b09a59');rect(7,29,10,10,'ae8853');rect(8,30,8,7,'e4dbb7');rect(10,32,5,1,'7a8068');}
 if(role==='apprentice'){rect(10,6,14,5,'6f5d37');for(const x of [11,19]){rect(x,6,5,5,'c9a45d');rect(x+1,7,3,2,'74c7ca');}rect(11,24,11,13,'60503b');rect(8,34,17,4,'3c3b2e');rect(15,34,4,3,'c5a05a');rect(25,30,2,11,'b3b5a0');rect(24,28,4,4,'888e7d');}
 if(role==='explorer'){rect(5,8,22,3,'755b39');poly([[9,8],[11,2],[22,2],[24,8]],'a6915e');rect(10,7,14,2,'53654b');rect(12,18,10,4,'ae674d');rect(12,21,4,10,'bb7e55');rect(4,22,5,13,'706c45');rect(5,24,3,8,'a49865');}
 if(role==='archivist'){poly([[7,9],[12,2],[21,2],[26,11],[24,20],[21,18],[22,8],[11,8],[11,18],[7,20]],'637c58');poly([[10,22],[22,22],[27,42],[6,42]],'53654c');rect(12,23,2,17,'9d9a71');rect(13,28,11,12,'493c2b');rect(14,29,8,10,'d7cba5');rect(15,31,6,1,'8b8870');}
});
