import {buildArt,setupEnvironment} from './visuals.js';
import {renderWoods} from './woods-renderer.js';

function meadow(scene) {
  const {width,height,trees,collisions}=scene.region;
  scene.art={};
  // Reuse the town palette and 16 px grid. Deterministic detail, no per-frame map drawing.
  const ground=scene.add.graphics().setDepth(-100);
  ground.fillStyle(0x80975b).fillRect(0,0,width,height);
  for(let y=0;y<height;y+=16) for(let x=0;x<width;x+=16) {
    const seed=(x*7+y*11)%97;
    ground.fillStyle(seed%2?0x899e62:0x789052).fillRect(x+3,y+5,3,2);
    if(seed<6) ground.fillStyle(0xedd78f).fillRect(x+10,y+10,2,2);
  }
  ground.fillStyle(0xa48e58).fillRect(0,348,width,72).fillRect(488,180,64,440);
  ground.fillStyle(0xc6b079).fillRect(0,352,width,64).fillRect(492,184,56,432);
  for(let x=8;x<width;x+=32) ground.fillStyle(0xb5a06b).fillRect(x,366+(x%3)*12,12,4);
  for(const [i,[x,y]] of trees.entries()) scene.add.image(x-40,y-76,i%2?'treeB':'tree').setOrigin(0).setDepth(y+24);
  for(const wall of collisions.filter(w=>w.kind==='fence')) {
    const g=scene.add.graphics().setDepth(wall.y+wall.h);
    g.fillStyle(0x604b35).fillRect(wall.x,wall.y-12,wall.w,8).fillRect(wall.x,wall.y,wall.w,6);
    g.fillStyle(0xb59059);
    for(let x=wall.x;x<wall.x+wall.w;x+=32) g.fillRect(x,wall.y-20,8,36);
  }
  scene.add.text(520,230,'边境草甸\n未来故事的起点',{fontSize:'16px',fontFamily:'monospace',align:'center',color:'#fff0c6',backgroundColor:'#4e6842',padding:{x:12,y:8}}).setOrigin(.5).setDepth(1000);
  scene.add.text(520,580,'这里暂时没有任务。\n吹吹风，也算一种进度。',{fontSize:'12px',fontFamily:'monospace',align:'center',color:'#e7dfb8'}).setOrigin(.5).setDepth(1000);
}

export function renderRegion(scene) {
  if(scene.region.renderer==='town') {
    buildArt(scene,scene.region.places);
    const trail=scene.add.graphics().setDepth(-90);
    for(let y=80;y<270;y+=18) trail.fillStyle(0xc2b587).fillRect(485+(y%4),y,30,12);
  } else if(scene.region.renderer==='woods') renderWoods(scene);
  else meadow(scene);
  for(const p of scene.region.places.filter(p=>p.kind!=='story')) scene.add.text(p.door.x,p.id==='chest'?548:67,p.name,{fontSize:'16px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#594934',padding:{x:10,y:5}}).setOrigin(.5).setDepth(1000);
  for(const exit of scene.region.exits) {
    const {x,y}=exit.door;
    scene.add.graphics().setDepth(y-35).fillStyle(0x604b35).fillRect(x-3,y-63,6,36);
    scene.add.text(Math.max(60,x),Math.max(24,y-72),exit.name,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#594934',padding:{x:6,y:5}}).setOrigin(.5).setDepth(1000);
    scene.add.text(x,y+28,'E · '+exit.action,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#4e6842',padding:{x:5,y:3}}).setOrigin(.5).setDepth(1000);
  }
  setupEnvironment(scene);
}
