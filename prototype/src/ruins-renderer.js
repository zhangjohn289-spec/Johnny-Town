import {pathDistance} from './expansion-data.js';
export function renderRuins(s){
 s.art={};const r=s.region,g=s.add.graphics().setDepth(-100);
 const box=(c,x,y,w,h)=>g.fillStyle(c).fillRect(x,y,w,h);
 for(let y=0;y<768;y+=8)for(let x=0;x<1024;x+=8){
  const n=((x*73)^(y*137))>>>0,d=pathDistance(r.paths,x,y),patch=Math.sin(x/57)+Math.cos(y/83)+Math.sin((x-y)/109);
  box(patch>.7?0x536951:patch<-.7?0x374f47:0x455e4d,x,y,8,8);
  if(d<35){const slabX=Math.floor(x/16)*16,slabY=Math.floor(y/16)*16,seed=((slabX*31)^(slabY*17))>>>0;
   if(seed%13!==0){box([0x858b79,0x939580,0x757f71][seed%3],x,y,8,8);if(x%16===0)box(0x53665b,x,y,1,8);if(y%16===0)box(0xb0ad8e,x+1,y,7,1);if(seed%11===0&&x%16===0&&y%16===0)box(0x526a51,x+2,y+2,4,3);if(seed%7===0){box(0x505f55,x+3,y,1,4);box(0x505f55,x+4,y+4,3,1);}}
  }else if(n%31===0&&patch>-.3){box(0x67815c,x+1,y+3,5,2);box(0x79906a,x+2,y+1,2,4);}
 }
 for(const w of r.collisions.filter(w=>w.kind==='wall')){box(0x313e3e,w.x,w.y,w.w,w.h);for(let x=w.x;x<w.x+w.w;x+=24){box(0x818777,x,w.y-15,20,w.h);box(0x667e50,x,w.y-15,15,6);box(0xb1af90,x+2,w.y-14,13,2);box(0x4d5c50,x+9,w.y-3,1,13);}}
 // Moss, scattered chips and a quiet courtyard use deterministic placements.
 for(let i=0;i<70;i++){const x=40+(i*131)%940,y=40+(i*79)%680;if(pathDistance(r.paths,x,y)>40){box(0x73905f,x,y,9,4);box(0x93a181,x+3,y-3,5,3);}}
 for(let i=0;i<14;i++){const x=135+(i*37)%140,y=245+(i*23)%70;box(0x789660,x,y,9,5);box(0xc6c398,x+2,y-3,3,3);}
 // Broken columns mark the approach; small rubble stays decorative.
 for(const [i,[x,y]] of [[80,90],[340,110],[940,340],[90,550],[500,720]].entries()){
  const height=[42,30,51,35,25][i];box(0x2d443a,x-9,y+8,46,14);box(0x687766,x-5,y+4,34,12);box(0x949a82,x,y-height,24,height+5);box(0xb0b399,x+3,y-height,4,height);box(0x6d7c6a,x+18,y-height+5,5,height-5);box(0xadae90,x-3,y-height-5,17,7);box(0x75846d,x+14,y-height+1,13,6);box(0x455e4b,x+9,y-height+8,2,15);box(0x78925d,x-3,y+4,24,5);
  box(0x8a927c,x+30,y+9,14,8);box(0xb0ae8d,x+32,y+7,8,3);
 }
 // Fallen masonry and corroded conduits occupy the old open courtyard.
 for(let i=0;i<5;i++){box(0x6b7d68,120+i*23,275+(i%2)*4,20,18);box(0xa0a58b,122+i*23,276+(i%2)*4,16,4);}
 for(let x=125;x<275;x+=16){box(0x625f46,x,225,14,5);box(0x9c9160,x,225,11,1);}box(0x82976a,180,232,28,5);
 s.runeLights=[];const labels=[];
 for(const p of r.places){const a=s.add.graphics().setDepth(p.y+p.h),b=(c,x,y,w,h)=>a.fillStyle(c).fillRect(x,y,w,h),x=p.x,y=p.y;
 b(0x33473c,x-8,y+30,p.w+16,18);
 if(p.kind==='rune'){b(0x747969,x,y,p.w,p.h);const light=s.add.rectangle(x+12,y+7,12,5,0xc3b36d).setDepth(y+20);s.runeLights.push(light);}
 else if(['manuscript','logs'].includes(p.id)){b(0x69513d,x,y-20,56,60);for(let i=0;i<4;i++){b(0xae996b,x+3,y-15+i*14,50,3);b(i%2?0xb4b99c:0x698787,x+5+i*10,y-12,8,35);}if(p.id==='manuscript'){b(0xefe0b1,x+12,y-29,34,15);b(0x384b45,x+36,y-40,2,25);b(0xe2d8ad,x+5,y-22,15,10);b(0xd4c89f,x+30,y+20,19,8);b(0x897e62,x+15,y-23,12,1);}}
 else if(p.id==='engineer'){s.add.image(x-5,y-29,'chiefMek').setOrigin(0).setDepth(p.y+p.h+1);b(0x384c44,x+40,y+4,26,32);b(0xa18e5f,x+42,y,22,7);b(0x7b9388,x+44,y+11,16,14);a.lineStyle(3,0xc0a465).strokeCircle(x+52,y+17,6);b(0x6b7564,x+61,y-15,5,20);s.machine=a;}
 else if(p.id==='safe-chest'){b(0x3d4035,x-2,y-4,60,41);b(0x93663a,x,y,56,35);b(0xc7a45d,x+2,y-8,52,12);for(const dx of [7,42])b(0xf1d18a,x+dx,y-7,6,41);b(0x403c2b,x+23,y+10,12,14);b(0xf0d893,x+26,y+12,6,6);b(0x9ca078,x+3,y-8,12,3);}
 else if(p.id==='flight'){b(0x9ca890,x-18,y+6,90,8);b(0xb99b68,x+20,y-24,16,65);b(0x6d8d8b,x+7,y-10,40,17);for(let i=0;i<4;i++){b(0x5a6557,x-16+i*19,y+2,2,17);b(0xc3b17e,x-16+i*19,y+1,14,3);}b(0xa89259,x+15,y-28,26,4);b(0x434c42,x+26,y-37,4,23);b(0x8d8661,x-16,y+21,20,5);}
 else {b(0x858d80,x,y-25,56,65);b(0xa7ac94,x+5,y-25,46,8);if(p.id==='phase-door'){b(0x283b38,x+9,y-8,38,48);b(0xc3aa68,x+16,y-13,24,4);for(let i=0;i<4;i++){b(0x4d7062,x+12+i*8,y+3+i*3,4,4);b(0xbba471,x+9,y+7+i*8,38,2);}b(0xc6b687,x+23,y+7,9,9);}else if(p.id==='clock'){b(0x485448,x+10,y+22,36,5);b(0xbaa779,x+25,y+28,5,9);a.lineStyle(3,0xd0bf88).strokeCircle(x+28,y,19);a.lineBetween(x+28,y,x+28,y-14);a.lineBetween(x+28,y,x+40,y+5);}else if(p.id==='golden'){a.lineStyle(3,0xe8c168);for(let i=0;i<24;i++){const t=i*.6,t2=(i+1)*.6;a.lineBetween(x+28+Math.cos(t)*i,y+Math.sin(t)*i,x+28+Math.cos(t2)*(i+1),y+Math.sin(t2)*(i+1));}}else{b(0x405952,x+12,y-8,32,3);b(0x405952,x+17,y+3,22,3);b(0x687e67,x-7,y+39,70,7);b(0xb4b496,x-3,y+37,62,3);b(0xccbd83,x+25,y+16,6,5);}}
 if(p.kind==='secret'){for(let i=0;i<3;i++){b(0x69845d,x+i*17,y+35,12,4);b(0x3d5147,x+4+i*16,y+22,6,2);}}
 const label=s.add.text(p.door.x,p.door.y+24,p.kind==='rune'?String(p.index+1):p.id==='memorial'?'一块朴素的碑':p.name,{fontSize:'12px',color:'#f5e9bc',backgroundColor:'#344b43',padding:{x:4,y:3}}).setOrigin(.5).setDepth(1000);labels.push({label,p});if(p.kind==='secret')s.add.text(p.door.x,p.door.y+22,'◆',{fontSize:'8px',color:'#d3bd80'}).setOrigin(.5).setDepth(999);
 }
 s.ambientUpdate=time=>{for(const {label,p} of labels)label.setVisible(p.kind==='rune'||Math.hypot(s.player.x-p.door.x,s.player.y-p.door.y)<125);s.machine?.setAlpha(s.machineUntil>time&&!s.reduced?(Math.floor(time/150)%2?.65:1):1);s.runeLights.forEach((l,i)=>l.setFillStyle(s.ruinState?.golden||i<s.runeStep?0xffdf80:0x817c5a));};
}
