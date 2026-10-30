import {pathDistance} from './expansion-data.js';
export function renderRuins(s){
 s.art={};const r=s.region,g=s.add.graphics().setDepth(-100);
 const box=(c,x,y,w,h)=>g.fillStyle(c).fillRect(x,y,w,h);
 for(let y=0;y<768;y+=16)for(let x=0;x<1024;x+=16){const n=(x*17+y*31)%71,d=pathDistance(r.paths,x,y);box(d<32?(n<30?0x999482:0x858b7c):Math.sin(x/80)+Math.cos(y/95)>0?0x485f52:0x526b58,x,y,16,16);if(d<32){box(0x687466,x,y,15,1);box(0x687466,x,y,1,15);}else if(n<20)box(0x7c9470,x+3,y+6,6,3);}
 for(const w of r.collisions.filter(w=>w.kind==='wall')){box(0x313e3e,w.x,w.y,w.w,w.h);for(let x=w.x;x<w.x+w.w;x+=24){box(0x818777,x,w.y-15,20,w.h);box(0x667e50,x,w.y-15,15,6);}}
 // Moss, scattered chips and a quiet courtyard use deterministic placements.
 for(let i=0;i<70;i++){const x=40+(i*131)%940,y=40+(i*79)%680;if(pathDistance(r.paths,x,y)>40){box(0x73905f,x,y,9,4);box(0x93a181,x+3,y-3,5,3);}}
 for(let i=0;i<14;i++){const x=135+(i*37)%140,y=245+(i*23)%70;box(0x789660,x,y,9,5);box(0xc6c398,x+2,y-3,3,3);}
 // Broken columns mark the approach; small rubble stays decorative.
 for(const [x,y] of [[80,90],[340,110],[940,340],[90,550],[500,720]]){box(0x33483e,x-8,y+8,45,12);box(0x89917f,x,y-45,24,60);box(0xa8aa90,x-5,y-45,34,8);box(0x668350,x,y+2,24,10);}
 s.runeLights=[];
 for(const p of r.places){const a=s.add.graphics().setDepth(p.y+p.h),b=(c,x,y,w,h)=>a.fillStyle(c).fillRect(x,y,w,h),x=p.x,y=p.y;
 b(0x33473c,x-8,y+30,p.w+16,18);
 if(p.kind==='rune'){b(0x747969,x,y,p.w,p.h);const light=s.add.rectangle(x+12,y+7,12,5,0xc3b36d).setDepth(y+20);s.runeLights.push(light);}
 else if(['manuscript','logs'].includes(p.id)){b(0x69513d,x,y-20,56,60);for(let i=0;i<4;i++){b(0xae996b,x+3,y-15+i*14,50,3);b(i%2?0xb4b99c:0x698787,x+5+i*10,y-12,8,35);}if(p.id==='manuscript'){b(0xefe0b1,x+12,y-29,34,15);b(0x384b45,x+36,y-40,2,25);}}
 else if(p.id==='engineer'){b(0x5b984b,x,y-25,25,65);b(0x84b35b,x-6,y-35,35,22);b(0x968873,x+30,y,30,35);s.machine=a;}
 else if(p.id==='safe-chest'){b(0x9e723e,x,y,56,35);b(0xe6c36b,x,y,56,8);b(0xf1dd8c,x+24,y,8,35);}
 else if(p.id==='flight'){b(0x9ca890,x-18,y+6,90,8);b(0xb99b68,x+20,y-24,16,65);b(0x6d8d8b,x+7,y-10,40,17);}
 else {b(0x858d80,x,y-25,56,65);b(0xa7ac94,x+5,y-25,46,8);if(p.id==='phase-door'){b(0x283b38,x+9,y-8,38,48);b(0xc3aa68,x+16,y-13,24,4);}else if(p.id==='clock'){a.lineStyle(3,0xd0bf88).strokeCircle(x+28,y,19);a.lineBetween(x+28,y,x+28,y-14);a.lineBetween(x+28,y,x+40,y+5);}else if(p.id==='golden'){a.lineStyle(3,0xe8c168);for(let i=0;i<24;i++){const t=i*.6,t2=(i+1)*.6;a.lineBetween(x+28+Math.cos(t)*i,y+Math.sin(t)*i,x+28+Math.cos(t2)*(i+1),y+Math.sin(t2)*(i+1));}}else{b(0x405952,x+12,y-8,32,3);b(0x405952,x+17,y+3,22,3);}}
 if(p.kind==='secret'){for(let i=0;i<3;i++){b(0x69845d,x+i*17,y+35,12,4);b(0x3d5147,x+4+i*16,y+22,6,2);}}
 s.add.text(p.door.x,p.door.y+24,p.kind==='rune'?String(p.index+1):p.id==='memorial'?'一块朴素的碑':p.name,{fontSize:'12px',color:'#f5e9bc',backgroundColor:'#344b43',padding:{x:4,y:3}}).setOrigin(.5).setDepth(1000);
 }
 s.ambientUpdate=time=>{s.machine?.setAlpha(s.machineUntil>time&&!s.reduced?(Math.floor(time/150)%2?.65:1):1);s.runeLights.forEach((l,i)=>l.setFillStyle(s.ruinState?.golden||i<s.runeStep?0xffdf80:0x817c5a));};
}
