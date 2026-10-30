import {npcs} from './npc-data.js';
export function createNPCs(scene){
 scene.npcs=npcs.filter(n=>n.region===scene.region.id).map(n=>({...n,kind:'npc',action:'交谈',door:{x:n.position.x,y:n.position.y+24}}));
 const visuals=scene.npcs.map(n=>{
  const {x,y}=n.position;scene.add.ellipse(x,y+1,22,7,0x263e32,.35).setDepth(y-1);
  const sprite=scene.add.image(x,y,n.sprite).setOrigin(.5,1).setDepth(y+1);
  const marker=scene.add.text(x,y-57,'…',{fontSize:'14px',color:'#f0d69c',backgroundColor:'#344b43',padding:{x:3,y:0}}).setOrigin(.5).setDepth(y+50);
  return {sprite,marker,n};
 });
 scene.updateNPCs=time=>{for(const {sprite,marker,n} of visuals){sprite.setY(n.position.y+(scene.reduced||scene.interacting?0:Math.floor(time/850)%2));marker.setVisible(Math.hypot(scene.player.x-n.door.x,scene.player.y-n.door.y)<130);}};
 scene.events.once('shutdown',()=>{scene.updateNPCs=null;scene.npcs=[];});
}
