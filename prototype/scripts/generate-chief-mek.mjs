import {createRequire} from 'node:module';import fs from 'node:fs';const require=createRequire(import.meta.url);const {PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const out=new URL('../src/assets/',import.meta.url);fs.mkdirSync(out,{recursive:true});
let im;const color=h=>[...h.match(/\w\w/g)].map(x=>parseInt(x,16));
function rect(x,y,w,h,c){const rgb=color(c);for(let j=Math.max(0,Math.floor(y));j<Math.min(im.height,y+h);j++)for(let i=Math.max(0,Math.floor(x));i<Math.min(im.width,x+w);i++){const n=(j*im.width+i)*4;im.data[n]=rgb[0];im.data[n+1]=rgb[1];im.data[n+2]=rgb[2];im.data[n+3]=255;}}
function line(x,y,x2,y2,c,t=1){const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)rect(Math.round(x+(x2-x)*i/(n||1)),Math.round(y+(y2-y)*i/(n||1)),t,t,c);}
function poly(points,c){const ys=points.map(p=>p[1]);for(let y=Math.min(...ys);y<=Math.max(...ys);y++){let xs=[];for(let i=0;i<points.length;i++){let a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.floor(xs[i+1]-xs[i])+1,1,c);}}
function asset(name,w,h,draw){im=new PNG({width:w,height:h});draw();fs.writeFileSync(new URL(name+'.png',out),PNG.sync.write(im));}
let seed=431;function rnd(n){seed=(seed*1664525+1013904223)>>>0;return seed%n;}

asset('chief-mek',48,64,()=>{
// Clustered silhouette: ears, broad shoulders, jaw and heavy boots.
poly([[12,20],[5,24],[2,38],[7,45],[14,43],[14,55],[33,55],[34,43],[41,44],[46,36],[42,25],[35,20]],'243a30');
poly([[5,27],[12,23],[17,28],[14,41],[7,41],[4,36]],'5d8a45');poly([[31,27],[37,23],[43,29],[44,36],[38,41],[32,39]],'71964c');
rect(8,27,6,6,'8bab58');rect(36,28,6,6,'90ac5a');
poly([[12,7],[16,4],[31,4],[36,10],[35,22],[31,27],[17,27],[12,20]],'2f4c32');
poly([[14,9],[19,6],[30,7],[33,11],[33,22],[29,25],[18,24],[14,19]],'779d4d');
poly([[7,11],[14,12],[14,18],[9,16]],'87a658');poly([[33,12],[41,9],[38,17],[33,18]],'668e45');
rect(14,10,20,7,'584d35');rect(15,10,8,7,'be9b53');rect(26,10,8,7,'be9b53');rect(17,11,4,4,'57bcc4');rect(28,11,4,4,'79d8dc');rect(18,11,2,1,'c7f4e1');rect(29,11,2,1,'c7f4e1');
rect(21,17,7,3,'547438');rect(18,22,12,2,'34442c');poly([[16,20],[19,25],[20,19]],'e5dab2');poly([[29,20],[30,25],[33,19]],'f1e4bd');
rect(15,28,18,24,'483c2d');rect(17,28,14,22,'6e5136');rect(18,31,12,10,'876445');rect(20,33,8,1,'ad8756');rect(13,44,22,5,'302e27');rect(21,44,7,5,'bd9851');rect(23,45,3,3,'514b34');
rect(10,42,4,10,'c7a05b');rect(9,40,6,4,'8c9b91');rect(33,40,3,12,'d3ad61');rect(32,39,6,4,'8a8d78');
rect(14,52,9,8,'3c3930');rect(26,52,8,8,'484035');rect(11,57,12,6,'282e29');rect(26,57,13,6,'282e29');rect(12,58,9,2,'71654b');rect(28,58,9,2,'71654b');
rect(32,28,5,6,'c1a05c');rect(33,29,3,3,'4a5d46');rect(17,28,2,15,'ad8756');
});
