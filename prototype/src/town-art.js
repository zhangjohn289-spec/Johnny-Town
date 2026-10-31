import {leafMass} from './nature-art.js';
const P={ink:0x3d493b,wood:0x72533a,woodLight:0xb19061,stone:0x8d947a,cream:0xe0cfa2,shade:0xc1b28a,roof:0x985e49,roofLight:0xb97b59,green:0x526f59};
const rect=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
function frame(g,x,y,w,h){rect(g,P.wood,x,y,w,h);rect(g,0x5a8079,x+3,y+3,w-6,h-7);rect(g,0xc5d1ae,x+4,y+4,6,h/2-4);rect(g,P.woodLight,x+w/2-1,y+2,3,h-4);rect(g,P.woodLight,x+2,y+h/2,w-4,3);rect(g,0x443f31,x-2,y+h-2,w+4,4);}
function plinth(g,x,y,w){rect(g,0x42533d,x-5,y+3,w+14,9,.35);rect(g,0x747c64,x,y,w,7);rect(g,0xb4b18d,x+2,y,w-4,2);}
function home(g){
 plinth(g,14,186,184);rect(g,P.wood,16,65,180,123);rect(g,P.cream,23,70,165,113);rect(g,P.shade,163,70,25,113);
 for(let y=86;y<178;y+=17)for(let x=30;x<180;x+=37)rect(g,0xccbc91,x+(y%2?4:0),y,11,1);
 for(const x of [22,99,181]){rect(g,P.wood,x,76,6,108);rect(g,P.woodLight,x+1,78,1,99);}rect(g,P.wood,23,139,164,6);
 frame(g,42,102,30,34);frame(g,137,102,30,34);
 for(const x of [41,136]){rect(g,0x81593d,x,137,32,8);rect(g,0xb39566,x,137,32,2);for(let i=0;i<5;i++){rect(g,0x527047,x+i*6,133,5,5);rect(g,i%2?0xd7ac83:0xe7ce91,x+1+i*6,131,3,3);}}
 rect(g,0x43392d,86,144,42,44);rect(g,0x916a43,90,146,34,41);for(let x=97;x<124;x+=9)rect(g,0x654b32,x,147,1,39);rect(g,0xe0bc6b,115,164,3,3);rect(g,P.woodLight,85,143,44,3);
 // Horizontal roof courses clipped to a stepped gable silhouette.
 rect(g,0x584331,148,15,17,47);rect(g,0xa88b68,151,17,11,40);for(let y=23;y<54;y+=9)rect(g,0x78654d,152,y,10,1);
 for(let y=0;y<74;y+=2){const half=Math.floor(y*1.45);rect(g,0x4f3d30,103-half,y,half*2+1,2);if(y>5)rect(g,y%8<2?P.roofLight:P.roof,108-half,y,Math.max(1,half*2-9),2);}
 for(let y=17;y<68;y+=8){const half=Math.floor(y*1.45);for(let x=111-half;x<98+half;x+=20){rect(g,0x7a4c3a,x,y,1,5);rect(g,0xc18a62,x+2,y,12,1);}}
 rect(g,0x4c3c2d,0,73,212,5);rect(g,0xb79a68,11,78,190,3);
 rect(g,0x81583c,81,37,44,32);for(let k=0;k<5;k++)rect(g,0xa27b50,84+k*3,36-k*3,38-k*6,3);frame(g,98,45,20,18);
 plinth(g,79,189,58);rect(g,0xc3b68d,75,196,66,4);
}
function shrine(g){
 plinth(g,16,185,162);rect(g,0x663e30,16,65,160,121);rect(g,0xac5b42,23,67,147,115);rect(g,0x674833,36,83,121,77);
 for(let x=40;x<157;x+=10){rect(g,0x9d7951,x,86,3,67);rect(g,0xc1a171,x,86,1,60);}
 for(const x of [27,157]){rect(g,0x7d3e30,x,65,10,113);rect(g,0xd28a5c,x+2,67,3,107);}rect(g,0x4d3e30,20,162,154,8);rect(g,0xb19566,24,174,146,6);rect(g,0xd1b987,30,183,132,4);
 for(let y=22;y<66;y+=3){const width=108+Math.floor((y-22)*1.75);rect(g,0x354b43,96-width/2,y,width,3);rect(g,y%9<3?0x86927a:0x506b5e,98-width/2,y,width-4,2);for(let x=103-width/2;x<90+width/2;x+=15)rect(g,0x354c43,x,y,1,3);}
 rect(g,0x8c9b7c,41,20,110,3);rect(g,0x344b41,11,66,170,6);rect(g,0x87997a,14,65,164,2);
 rect(g,0x6e382b,0,92,192,10);rect(g,0xbe6548,0,91,192,4);rect(g,0xe39a67,5,91,182,1);
 for(let i=0;i<28;i++){const x=39+i*4,y=80+Math.round(Math.sin(i/27*Math.PI)*9);rect(g,0xdfc593,x,y,4,2);if(i%5===0){rect(g,0xe9dcb1,x,y+3,3,7);rect(g,0xe9dcb1,x+2,y+9,3,4);}}
 rect(g,0xc0a171,92,90,7,41);rect(g,0xe1cc9b,93,91,3,36);rect(g,0x795b3c,77,141,38,16);rect(g,0xb59b6a,75,140,42,3);for(let x=81;x<115;x+=7)rect(g,0xd4bb80,x,144,2,10);
 for(const x of [24,159]){rect(g,0xe7c479,x-4,116,20,32,.08);rect(g,0xe7c479,x-1,119,14,26,.1);rect(g,0x5b4931,x,119,12,26);rect(g,0xd0ab62,x+2,121,8,22);rect(g,0xf4db93,x+4,124,4,15);rect(g,0x695039,x-1,119,14,3);}
}
function ground(g){
 for(let y=0;y<640;y+=8)for(let x=0;x<960;x+=8){const n=((x*73)^(y*137))>>>0,v=Math.sin(x/110)+Math.cos(y/83);rect(g,v>.8?0x899e63:v<-.7?0x78915a:0x81995e,x,y,8,8);if(n%31===0)rect(g,0x98ab70,x+2,y+3,3,1);}
 // Preserve the exact original three road rectangles.
 for(const [x,y,w,h] of [[50,300,860,100],[195,250,50,100],[705,250,50,290]]){
  rect(g,0x758454,x-4,y-4,w+8,h+8);rect(g,0xa99e78,x,y,w,h);
  for(let yy=y;yy<y+h;yy+=16)for(let xx=x-((yy-y)/16%2)*16;xx<x+w;xx+=32){const n=((xx*31)^(yy*17))>>>0,left=Math.max(x,xx),right=Math.min(x+w,xx+31),rw=right-left,rh=Math.min(15,y+h-yy);if(rw<1)continue;rect(g,[0xc5b58b,0xccbd94,0xbfaf87][n%3],left,yy,rw,rh);rect(g,0xd7c9a3,left+2,yy+1,Math.max(1,rw-4),1);if(n%7===0&&rw>12){rect(g,0xb2a17b,left+4,yy+8,8,2);rect(g,0xb5a780,right-4,yy+2,3,1);}}
 }
 for(let x=24;x<940;x+=24){rect(g,0x715b3c,x,38,4,18);rect(g,0xb59b65,x+1,39,2,14);rect(g,0x9d8357,x,44,24,3);}
 // Sparse maintained flower beds, away from doors, roads and the town clerk.
 for(const [x,y,w] of [[111,275,69],[277,276,48],[626,275,63],[771,276,63],[91,565,145]]){rect(g,0x5b6442,x,y,w,10);rect(g,0x99855b,x,y+9,w,3);for(let a=4;a<w-4;a+=11){rect(g,0x4e7145,x+a,y+2,5,6);rect(g,a%2?0xd6a789:0xe4c891,x+a+1,y,3,3);}}
 for(const [x,y] of [[60,220],[95,232],[380,175],[405,195],[866,250],[850,460],[584,547],[543,555],[120,550],[483,572],[320,94],[595,142]]){
  for(let i=0;i<3;i++){rect(g,0x65844f,x+i*4,y-i%2*3,2,5+i%2*3);rect(g,0x9eb276,x+i*4,y-i%2*3,1,2);}rect(g,0x6c8550,x-2,y+6,15,2);
 }
 for(let x=20;x<940;x+=16){rect(g,0x6b7f4e,x,610,16,10);rect(g,0xa0ae78,x+2,609,9,2);}
}
function townTree(g,seed){
 rect(g,0x38523b,12,83,59,9,.2);rect(g,0x38523b,21,85,43,6,.25);rect(g,0x5c4934,34,52,13,40);rect(g,0x9a7950,36,54,4,36);rect(g,0x473f2e,44,60,3,31);rect(g,0x5c4934,29,55,8,16);rect(g,0x9a7950,30,57,2,10);leafMass(g,seed?1:4,seed?8:3,seed?77:73,seed?59:65,seed);rect(g,0x6c8751,25,88,25,4);rect(g,0xa0ac70,30,88,4,2);
}
export function prepareTownTextures(scene){
 const makers=[['town-r2-ground',960,640,ground],['town-r2-home',212,200,home],['town-r2-shrine',192,200,shrine],['town-r2-tree',80,100,g=>townTree(g,0)],['town-r2-treeB',80,100,g=>townTree(g,1)]];
 for(const [key,w,h,draw] of makers)if(!scene.textures.exists(key)){const g=scene.make.graphics({add:false});draw(g);g.generateTexture(key,w,h);g.destroy();}
}
export function drawTownHall(g,p){
 const {x,y,w,h}=p,b=(c,a,d,sw,sh)=>rect(g,c,x+a,y+d,sw,sh);
 b(0x43543e,-8,h-4,w+20,16);b(0x858c74,0,0,w,h);b(0xc5bc99,5,3,w-10,h-7);b(0xaaa583,w-23,4,17,h-9);
 for(let yy=9;yy<h-6;yy+=15)for(let xx=9;xx<w-12;xx+=31)b(0xb3aa88,xx,yy,16,1);
 for(const a of [5,w-12]){b(P.wood,a,0,7,h-3);b(P.woodLight,a+1,2,1,h-7);}b(P.wood,5,25,w-10,5);
 for(let yy=-40;yy<0;yy+=3){const inset=Math.max(0,Math.round((-yy-2)*.7));b(0x344a43,-8+inset,yy,w+16-inset*2,3);b(yy%9===0?0x86977a:0x557265,-6+inset,yy,w+12-inset*2,2);}
 b(P.woodLight,-8,-1,w+16,4);frame(g,x+19,y+40,28,25);frame(g,x+w-47,y+40,28,25);
 b(0x423c30,w/2-19,h-45,38,45);b(0x7e6546,w/2-15,h-41,30,40);b(0xb49a66,w/2-1,h-40,2,38);b(0xe0bd6e,w/2+10,h-20,3,3);b(P.woodLight,w/2-24,h-49,48,4);
 // A compact civic seal with an engraved gear, rather than floating teeth.
 b(0x544b37,w/2-14,-19,28,37);b(0xb39b62,w/2-12,-17,24,32);b(0x647561,w/2-9,-14,18,26);
 for(const [a,d,sw,sh] of [[-5,-9,10,2],[-8,-6,16,12],[-5,6,10,2]])b(0xd0b579,w/2+a,d,sw,sh);b(0x647561,w/2-4,-3,8,6);b(0xe2c887,w/2-1,-1,2,2);
 plinth(g,x-3,y+h-1,w+6);
}
