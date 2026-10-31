// Presentation only: consume the scene's already resolved target. No range,
// scoring, occlusion, state progression or additional input surface lives here.
export function targetMarkerPoint(target,art){
 if(!target)return null;
 if(art&&art.active===false)return null;
 if(target.kind==='npc')return {x:target.position.x+25,y:target.position.y-26};
 if(art?.active&&art.getBounds){const b=art.getBounds();return {x:b.right+8,y:b.y+b.height/2};}
 if(Number.isFinite(target.x))return {x:target.x+target.w+10,y:target.y+Math.min(18,target.h/2)};
 return {x:target.door.x+28,y:target.door.y-35};
}
export function createTargetHighlight(scene){
 const graphic=scene.add.graphics().setName('interaction-target-marker').setDepth(1002).setVisible(false);let id=null;
 return {
  get id(){return id;},graphic,
  update(target){
   if(scene.interacting||scene.transitioning)target=null;
   const point=targetMarkerPoint(target,scene.art?.[target?.id]);
   if(!point){id=null;graphic.setVisible(false);return;}
   if(id!==target.id){graphic.clear();
    // Stepped cream pointer with a dark edge, directed toward the object. Shape
    // and the existing named prompt communicate selection without color alone.
    for(const [x,y,w,h] of [[0,-7,4,2],[-2,-5,4,2],[-4,-3,4,2],[-6,-1,15,3],[-4,2,4,2],[-2,4,4,2],[0,6,4,2]])graphic.fillStyle(0x263d34).fillRect(x,y,w,h);
    for(const [x,y,w,h] of [[0,-5,2,2],[-2,-3,2,2],[-4,-1,11,3],[-2,2,2,2],[0,4,2,2]])graphic.fillStyle(0xffedbe).fillRect(x,y,w,h);id=target.id;
   }
   graphic.setPosition(Math.round(point.x),Math.round(point.y)).setVisible(true);
  },
 };
}
