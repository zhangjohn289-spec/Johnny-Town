// Rebuild baseline first, then apply deterministic, editable detail passes.
import './generate-art.mjs';
import fs from 'node:fs';import {createRequire} from 'node:module';const require=createRequire(import.meta.url),{PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const dir=new URL('../src/assets/',import.meta.url);let im;let seed=9817;const rnd=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};const rgb=h=>h.match(/../g).map(v=>parseInt(v,16));
const get=(x,y)=>{if(x<0||y<0||x>=im.width||y>=im.height)return '';return [...im.data.subarray((y*im.width+x)*4,(y*im.width+x)*4+3)].map(v=>v.toString(16).padStart(2,'0')).join('');};
function dot(x,y,c,clip=false){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=im.width||y>=im.height)return;const i=(y*im.width+x)*4;if(clip&&!im.data[i+3])return;const v=rgb(c);im.data[i]=v[0];im.data[i+1]=v[1];im.data[i+2]=v[2];im.data[i+3]=255;}
function rect(x,y,w,h,c,clip=false){for(let j=0;j<h;j++)for(let i=0;i<w;i++)dot(x+i,y+j,c,clip);}
function pass(name,fn){im=PNG.sync.read(fs.readFileSync(new URL(name+'.png',dir)));fn();fs.writeFileSync(new URL(name+'.png',dir),PNG.sync.write(im));}
pass('ground',()=>{
 // Coherent soft-edged grass patches, not uniformly scattered static.
 for(let y=55;y<604;y++)for(let x=20;x<940;x++){const c=get(x,y);if(!['80975b','91a86b','768c50','859e60'].includes(c))continue;const n=Math.sin(x/47+y/37)+Math.sin(x/103-y/57);if(n>1.05)dot(x,y,rnd(29)===0?'93a868':'899f60');else if(n< -1.15)dot(x,y,rnd(31)===0?'788f50':'7a9252');}
 for(let k=0;k<1000;k++){const x=25+rnd(910),y=60+rnd(535),c=get(x,y);if(['c8bb96','cfc29f','bfb28f'].includes(c)){if(k%3===0){dot(x,y,'a59b80');dot(x+1,y+1,'afa589');dot(x+1,y+2,'b6aa88');}else rect(x,y,2,1,'ddd1ae');}else if(['899f60','7a9252','80975b'].includes(c)){rect(x,y,1,3,'536f40');rect(x-1,y+1,1,1,'adc179');}}
 // Worn grass along road edges; remain decorative and walkable.
 for(let k=0;k<140;k++){const x=55+rnd(845),y=k%2?299:400;rect(x,y,1+rnd(4),1+rnd(3),'7b9253');}
});
pass('home',()=>{for(let y=18;y<69;y+=7)for(let x=15;x<198;x+=14){if(['975b48','b27457','754738'].includes(get(x,y))){rect(x,y,8,1,'c48a62',true);rect(x+4,y+3,6,1,'88503f',true);}}for(const x of [22,100,180])for(let y=85;y<183;y+=13){rect(x+2,y,1,7,'a77c4c');rect(x+4,y+5,1,4,'503e2f');}rect(29,81,151,4,'b6a17a');rect(30,86,68,2,'d3c090');for(let k=0;k<90;k++){const x=30+rnd(147),y=91+rnd(89);if(get(x,y)==='e6d5a4')rect(x,y,3,1,k%2?'edddb2':'d9c799');}for(const x of [42,137]){rect(x+5,107,3,11,'f4efc7');rect(x+9,109,2,6,'e2e6be');rect(x-2,143,34,2,'4f452f');}rect(114,166,5,5,'4b3b2a');rect(114,166,3,3,'f3d88c');
 // Compact dormer with a small attic window.
 for(let y=24;y<42;y++)rect(91-(y-24),y,(y-24)*2+24,1,'543d2e');rect(88,40,43,22,'d9c18e');rect(99,41,20,17,'5f4831');rect(102,43,14,12,'819e94');rect(108,43,2,12,'d2be8a');rect(102,48,14,2,'d2be8a');rect(85,62,49,3,'4f3c2c');});
pass('shrine',()=>{for(let y=27;y<58;y+=6)for(let x=35;x<161;x+=9){if(['47514b','657065'].includes(get(x,y))){rect(x,y,5,1,'8b9582',true);rect(x+4,y+2,1,3,'343f39',true);}}for(const x of [29,155])for(let y=73;y<163;y+=11)rect(x+2,y,2,7,'e08e60');for(let x=38;x<155;x++){const y=77+Math.round(Math.sin((x-38)/117*Math.PI)*6);rect(x,y,1,2,'d2bc85');if(x%13===0)rect(x,y+3,4,7,'efe4bd');}rect(92,91,4,29,'d8bb77');rect(88,119,12,9,'b79557');rect(92,120,3,6,'f2d492');for(const x of [24,151]){rect(x+3,126,1,10,'fff3c2');rect(x+10,125,1,12,'c08d4f');}for(let x=82;x<111;x+=7)rect(x,150,2,11,'bd935a');rect(24,179,143,1,'d5bd8d');});
for(const name of ['chest','chest-open'])pass(name,()=>{for(let y=37;y<52;y+=7)for(let x=10;x<69;x+=9){if(get(x,y)==='92633a'||get(x,y)==='97683c'){rect(x,y,5,1,'c09254');dot(x+2,y+2,'60462c');}}for(const x of [14,58])for(const y of [20,42,50]){rect(x,y,3,2,'f6d994');dot(x+2,y+1,'887345');}rect(35,33,9,1,'ffe4a0');});
pass('tree',()=>{const snapshot=Buffer.from(im.data);for(let k=0;k<100;k++){const x=12+rnd(55),y=9+rnd(48);if(!['355b3b','527d43','71964f','87a65b','5f8748','648a49'].includes(get(x,y)))continue;const lit=(x+y)<65;for(let j=0;j<4;j++)for(let i=0;i<8;i++){if(Math.abs(i-3.5)+Math.abs(j-1.5)*2<5){const yy=y+j,xx=x+i;if(yy<60&&xx<72&&snapshot[(yy*im.width+xx)*4+3])dot(xx,yy,lit?(j<2?'9bb86a':'759b51'):(j<2?'5d8249':'41623c'),true);}}}for(let y=65;y<96;y+=6){rect(35,y,2,4,'c09b61');rect(42,y+2,2,5,'433c2b');}
 // Variant with an altered crown edge and a different leaf palette.
 const variant=new PNG({width:im.width,height:im.height});for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){const nx=y<64?x+Math.round(Math.sin(y/11)*3):x;if(nx>=0&&nx<im.width){const src=(y*im.width+x)*4,dst=(y*im.width+nx)*4;im.data.copy(variant.data,dst,src,src+4);}}fs.writeFileSync(new URL('tree-b.png',dir),PNG.sync.write(variant));});
console.log('Phase 04 detail passes complete.');
// Lossless palette PNG encoding for these small, deliberately limited palettes.
const sharp=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.png'))){const path=new URL(file,dir);const data=await sharp(fs.readFileSync(path)).png({palette:true,colours:256,dither:0,effort:10}).toBuffer();fs.writeFileSync(path,data);}

