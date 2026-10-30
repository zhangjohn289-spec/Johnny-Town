import {pathDistance,waterSpan} from './expansion-data.js';
export const natureRegions=Object.freeze(['woods','lake','meadow','ruins']);
export const effectCaps=Object.freeze({grass:12,canopy:6,reeds:6,ripples:8,leaves:2,dust:3});
// Absolute scene time, with long pauses and a maximum displacement of one pixel.
export function windStep(time,seed=0){
 const phase=((time+seed*1877)%15000+15000)%15000;
 return phase<11000?0:phase<12000?1:phase<13000?0:phase<14000?-1:0;
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
 if(r.id==='woods'||r.id==='meadow')for(let i=0;i<130;i++){
  const x=40+i*137%940,y=55+i*83%650,limit=r.id==='woods'?6:12;
  if(plan.grass.length<limit&&decorationSafe(r,x,y))plan.grass.push({x,y,seed:i});
 }
 if(r.id==='woods'){
  plan.canopy=r.trees.filter((p,i)=>i%13===2&&i%4!==0).slice(0,6).map(([x,y],i)=>({x:x-20,y:y-50,seed:i+3}));
  plan.leaves=[{x:270,y:420,seed:3},{x:560,y:280,seed:9}];
 }
 if(r.id==='lake'){
  for(let i=0;i<50&&plan.ripples.length<8;i++){const x=410+i*83%450,y=132+i*61%270;if(waterInterior(x,y,30))plan.ripples.push({x,y,seed:i});}
  for(const y of [176,272,352,416]){const s=waterSpan(y);for(const x of [s.x-12,s.x+s.w+12])if(plan.reeds.length<6&&[...r.places,...r.exits].every(p=>Math.hypot(x-p.door.x,y-p.door.y)>100)&&!(x<390&&y<280))plan.reeds.push({x,y,seed:y+x});}
 }
 if(r.id==='ruins')plan.dust=[{x:165,y:280,seed:2},{x:343,y:155,seed:7},{x:925,y:340,seed:12}];
 return plan;
}
