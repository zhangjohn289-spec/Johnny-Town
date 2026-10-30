import {natureRegions,naturePlan,windStep,quietPhase} from './nature-config.js';
const box=(g,c,x,y,w,h,a=1)=>g.fillStyle(c,a).fillRect(Math.round(x),Math.round(y),w,h);
const blades=[[0,6],[4,10],[8,7]];
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
    for(const [dx,base] of blades){const h=base+p.seed%3-1;box(ground,0x4d7249,p.x+dx,p.y-h+3,2,h);box(ground,c,p.x+dx+lean,p.y-h,2,4);}box(ground,0x6e8b50,p.x-2,p.y+1,14,2);
   }
   for(const p of plan.reeds){const lean=windStep(t,p.seed);for(const dx of [0,5,10]){box(ground,0x3d6a50,p.x+dx,p.y-15,1,18);box(ground,0x83955c,p.x+dx+lean,p.y-20,1,9);box(ground,0xb6a072,p.x+dx+lean,p.y-23,2,6);}}
   for(const p of plan.ripples){const phase=scene.reduced ? .25 : quietPhase(t,p.seed,7800);if(phase>.72)continue;const frame=Math.floor(phase*4),w=8+frame*4,a=scene.reduced ? .32 : Math.sin(phase/.72*Math.PI)*.38;
    box(water,0xa2c7bc,p.x-w/2,p.y,w,1,a);box(water,0x74aba9,p.x-w/2-2,p.y+2,3,1,a);box(water,0x74aba9,p.x+w/2-1,p.y+2,3,1,a);if(frame>0)box(water,0x74aba9,p.x-w/2+2,p.y+4,w-4,1,a*.6);
   }
   for(const p of plan.canopy){const step=windStep(t,p.seed);box(canopy,0x71935b,p.x+step,p.y,7,3);box(canopy,0x9fb16f,p.x+2+step,p.y,3,1);}
   if(!scene.reduced){
    for(const p of plan.leaves){const q=quietPhase(t,p.seed,18000);if(q>.24)continue;const x=p.x+Math.round(Math.sin(q*17)*7),y=p.y+Math.floor(q*150);box(ground,0xbcac72,x,y,3,1,.7);box(ground,0x8f9562,x+1,y+1,2,2,.6);}
    for(const p of plan.dust){const q=quietPhase(t,p.seed,17000);if(q>.3)continue;box(ground,0xc5c4a5,p.x+Math.floor(q*17),p.y-Math.floor(q*45),2,1,.28);}
   }
  },
  destroy(){if(disposed)return;disposed=true;for(const g of Object.values(layers))g.destroy();for(const p of Object.values(plan))p.length=0;},
 };
 scene.natureEffects=effects;const previous=scene.ambientUpdate;
 const update=time=>{if(disposed)return;previous?.(time);effects.update(time);};scene.ambientUpdate=update;
 scene.events.once('shutdown',()=>{effects.destroy();if(scene.ambientUpdate===update)scene.ambientUpdate=null;if(scene.natureEffects===effects)scene.natureEffects=null;});
}
