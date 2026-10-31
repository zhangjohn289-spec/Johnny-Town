// Only objects with demonstrated side/rear failures in the No.2 survey.
// Doors, workshops, the sealed phase doorway and region exits retain their
// original anchor-only eligibility. No collision or save data is modified.
const footprints=new Set(['chest','beginning','crossroads','echoing-tree','unwritten',
 'lake-stage','rhythm-stones','echoing-pier','conductors-lantern','rhythm-practice',
 'first-gear','great-transmission','skyward-blueprint','power-bench',
 'manuscript','golden','engineer','safe-chest','clock','flight','logs','memorial']);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function footprint(p){
 if(p.kind==='npc'&&p.position)return {x:p.position.x-16,y:p.position.y-48,w:32,h:48};
 if(footprints.has(p.id)&&Number.isFinite(p.x))return p;
}
// Segment/rectangle intersection. Endpoints exactly on a boundary are allowed;
// the object being approached owns its own solid, so that solid is excluded.
function blocked(a,b,w){
 let lo=0,hi=1;
 for(const [v,d,min,max] of [[a.x,b.x-a.x,w.x+.01,w.x+w.w-.01],[a.y,b.y-a.y,w.y+.01,w.y+w.h-.01]]){
  if(Math.abs(d)<1e-8){if(v<min||v>max)return false;}
  else{let t0=(min-v)/d,t1=(max-v)/d;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);if(lo>hi)return false;}
 }
 return lo<=hi;
}
export function chooseInteraction(existing,npcs,position,collisions=[]){
 let best,bestDistance=Infinity;
 const consider=p=>{
  const legacy=Math.hypot(position.x-p.door.x,position.y-p.door.y),bounds=footprint(p);
  let distance=legacy;
  if(bounds){
   const feet={x:position.x,y:position.y+8},near={x:clamp(feet.x,bounds.x,bounds.x+bounds.w),y:clamp(feet.y,bounds.y,bounds.y+bounds.h)};
   const edge=Math.hypot(feet.x-near.x,feet.y-near.y);
   if(legacy>=(p.interactionRadius??75)&&edge>32)return;
   if(collisions.some(w=>!(w.x===bounds.x&&w.y===bounds.y&&w.w===bounds.w&&w.h===bounds.h)&&blocked(feet,near,w)))return;
   distance=Math.min(legacy,edge);
  }else if(legacy>=(p.interactionRadius??75))return;
  // One stable ordering for prompts, E and touch. Exact ties preserve source
  // registration order, rather than oscillating between nearby candidates.
  if(distance<bestDistance){best=p;bestDistance=distance;}
 };
 for(const p of existing)consider(p);
 for(const p of npcs)consider(p);
 return best;
}
