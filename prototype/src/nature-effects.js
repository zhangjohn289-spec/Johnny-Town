import {natureRegions,naturePlan,windStep,quietPhase} from './nature-config.js';
const box=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
const blades=[[0,18],[6,24],[12,20]];
function stem(g,color,x,y,h,lean){
 for(let row=0;row<h;row+=2){const bend=Math.round(lean*(1-row/h)**1.6);box(g,color,x+bend,y-h+row,2,2);}
}
function leaf(g,x,y,lean){
 // Fixed branch root, moving leaf silhouettes; the underlying tree and trunk
 // remain untouched. These are foliage masses, not displaced highlight dots.
 stem(g,0x35573e,x+24,y+20,14,lean);
 for(const [dx,dy] of [[0,7],[10,0],[15,12]]){
  const px=x+dx+lean,py=y+dy;box(g,0x35573e,px+4,py,4,1);box(g,0x35573e,px+2,py+1,8,2);box(g,0x35573e,px,py+3,12,3);box(g,0x35573e,px+2,py+6,8,2);box(g,0x35573e,px+4,py+8,4,1);box(g,0x52794e,px+2,py+2,8,4);box(g,0x709256,px+3,py+2,6,2);box(g,0x98aa69,px+4,py+2,3,1);
 }
}
export function attachNature(scene){
 scene.natureEffects=null;if(!natureRegions.includes(scene.region.id))return;
 const plan=naturePlan(scene.region),id=scene.region.id;
 const layers={ground:scene.add.graphics().setName('nature-ground').setDepth(3),water:scene.add.graphics().setName('nature-water').setDepth(-60),canopy:scene.add.graphics().setName('nature-canopy').setDepth(850),sun:scene.add.graphics().setName('nature-sun').setDepth(-80)};
 // Static stepped patches of filtered sunlight remain in Reduced Motion.
 if(id==='woods')for(const [x,y] of [[173,572],[647,348],[161,348]])for(let i=0;i<4;i++)box(layers.sun,0xf2df9b,x-34+i*8,y-16+i*7,82-i*13,7,.09);
 let disposed=false;
 const effects={
  describe:()=>({region:id,disposed,graphics:disposed?0:4,counts:Object.fromEntries(Object.entries(plan).map(([k,v])=>[k,v.length]))}),
  update(time){
   if(disposed)return;const t=scene.reduced?0:time,{ground,water,canopy}=layers;ground.clear();water.clear();canopy.clear();
   for(const p of plan.grass){const lean=windStep(t,p.seed),c=id==='woods'?0x7e985e:p.seed%3===0?0xbab47a:0xa0b76a;
    for(const [dx,base] of blades){const h=base+p.seed%3-1;stem(ground,0x4d7249,p.x+dx,p.y,h,lean);stem(ground,c,p.x+dx+1,p.y-2,h-3,lean);box(ground,c,p.x+dx+lean-1,p.y-h,4,4);}box(ground,0x6e8b50,p.x-2,p.y+1,19,2);
   }
   for(const p of plan.reeds){const lean=windStep(t,p.seed);for(const dx of [0,5,10]){stem(ground,0x3d6a50,p.x+dx,p.y+3,24,lean);box(ground,0x83955c,p.x+dx+lean,p.y-21,2,5);box(ground,0xb6a072,p.x+dx+lean,p.y-24,3,6);}}
   for(const p of plan.ripples){const period=5400+(p.seed%3)*430,phase=scene.reduced ? .3 : quietPhase(t,p.seed,period),dx=scene.reduced?0:Math.round(Math.sin(t/1900+p.seed)*5),dy=Math.round(phase*3),w=12+Math.round(phase*12)*2;
    const a=scene.reduced ? .45 : Math.sin(Math.min(1,phase/.9)*Math.PI)*.72;
    box(water,0xb7d8cf,p.x+dx-w/2,p.y+dy,w,2,a);box(water,0x8dbdb8,p.x+dx-w/2-2,p.y+dy+2,3,3,a);box(water,0x8dbdb8,p.x+dx+w/2-1,p.y+dy+2,3,3,a);box(water,0x8dbdb8,p.x+dx-w/2+3,p.y+dy+6,w-6,1,a*.75);
    // A separate drifting broken reflection complements the expanding rings.
    const drift=scene.reduced?0:Math.round(Math.sin(t/2400+p.seed)*7);box(water,0x9bc8c2,p.x+drift-9,p.y+14,15,2,.48);box(water,0x73aaa8,p.x+drift+4,p.y+17,9,1,.4);
   }
   for(const p of plan.canopy)leaf(canopy,p.x,p.y,windStep(t,p.seed));
   if(!scene.reduced){
    for(const p of plan.leaves){const q=quietPhase(t,p.seed,18000);if(q>.24)continue;const x=p.x+Math.round(Math.sin(q*17)*7),y=p.y+Math.floor(q*150);box(ground,0xbcac72,x,y,3,1,.7);box(ground,0x8f9562,x+1,y+1,2,2,.6);}
    for(const p of plan.dust){const q=quietPhase(t,p.seed,7600);if(q>.82)continue;const x=p.x+Math.round(Math.sin(q*3+p.seed)*8),y=p.y-Math.round(q*26);box(ground,0xd6d2af,x,y,2,2,.58);box(ground,0xb5b99a,x-2,y+4,1,2,.3);}
   }
  },
  destroy(){if(disposed)return;disposed=true;for(const g of Object.values(layers))g.destroy();for(const p of Object.values(plan))p.length=0;},
 };
 scene.natureEffects=effects;const previous=scene.ambientUpdate;
 const update=time=>{if(disposed)return;previous?.(time);effects.update(time);};scene.ambientUpdate=update;
 scene.events.once('shutdown',()=>{effects.destroy();if(scene.ambientUpdate===update)scene.ambientUpdate=null;if(scene.natureEffects===effects)scene.natureEffects=null;});
}
