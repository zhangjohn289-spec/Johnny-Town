import {pathDistance,waterSpan} from './expansion-data.js';
import {npcs} from './npc-data.js';
export const natureRegions=Object.freeze(['woods','lake','meadow','ruins']);
export const effectCaps=Object.freeze({grass:12,canopy:24,reeds:6,ripples:8,leaves:2,dust:3});
export const windPeriod=seed=>6200+(seed%3)*350;
// A gentle bend-and-return, followed by a short rest. Pixel-quantized at draw
// time, rather than a one-pixel change after eleven seconds of inactivity.
export function windStep(time,seed=0){
 const period=windPeriod(seed),phase=((time+seed*877)%period+period)%period/period;
 return phase>=.88?0:Math.round(Math.sin(phase/.88*Math.PI*2)*3);
}
export function quietPhase(time,seed,period){return ((time+seed*977)%period+period)%period/period;}
export function waterInterior(x,y,margin=16){
 const row=Math.floor((y-80)/16)*16+80,s=waterSpan(row);
 return !!s&&y>=96&&y<448&&x>=s.x+margin&&x<=s.x+s.w-margin&&!(y>=404&&x>516&&x<584);
}
export function decorationSafe(r,x,y){
 return x>32&&x<r.width-32&&y>48&&y<r.height-32&&pathDistance(r.paths,x,y)>43&&
  [...r.places,...r.exits].every(p=>Math.hypot(x-p.door.x,y-p.door.y)>85)&&
  !r.collisions.some(p=>x>p.x-12&&x<p.x+p.w+12&&y>p.y-18&&y<p.y+p.h+14);
}
export function naturePlan(r){
 const plan={grass:[],canopy:[],reeds:[],ripples:[],leaves:[],dust:[]};if(!natureRegions.includes(r.id))return plan;
 const addGrass=(x,y,seed)=>{if(decorationSafe(r,x,y)&&npcs.filter(n=>n.region===r.id).every(n=>Math.hypot(x-n.position.x,y-n.position.y)>80)&&plan.grass.every(p=>Math.hypot(x-p.x,y-p.y)>38))plan.grass.push({x,y,seed});};
 if(r.id==='meadow')for(const [i,[x,y]] of [[400,280],[680,420],[700,450],[270,300],[810,450],[350,580],[600,580]].entries())addGrass(x,y,i+21);
 if(r.id==='woods'||r.id==='meadow')for(let i=0;i<130;i++){
  const x=40+i*137%940,y=55+i*83%650,limit=r.id==='woods'?6:12;
  if(plan.grass.length<limit)addGrass(x,y,i);
 }
 if(r.id==='woods'){
  plan.canopy=r.trees.filter((p,i)=>i%4!==0&&p[0]>=50&&p[0]<=970&&p[1]>=130).filter((p,i)=>i%2===0).slice(0,24).map(([x,y],i)=>({x:x-31,y:y-50,seed:i+3}));
  plan.leaves=[{x:270,y:420,seed:3},{x:560,y:280,seed:9}];
 }
 if(r.id==='lake'){
  for(let i=0;i<50&&plan.ripples.length<8;i++){const x=410+i*83%450,y=132+i*61%270;if(waterInterior(x,y,30))plan.ripples.push({x,y,seed:i});}
  for(const y of [176,272,352,416]){const s=waterSpan(y);for(const x of [s.x-12,s.x+s.w+12])if(plan.reeds.length<6&&[...r.places,...r.exits].every(p=>Math.hypot(x-p.door.x,y-p.door.y)>100)&&!(x<390&&y<280))plan.reeds.push({x,y,seed:y+x});}
 }
 if(r.id==='ruins')plan.dust=[{x:565,y:350,seed:2},{x:830,y:365,seed:7},{x:465,y:560,seed:12}];
 return plan;
}
