import {renderRuins} from './ruins-renderer.js';
import {renderLandscape} from './landscape-renderer.js';
import {buildArt,setupEnvironment} from './visuals.js';
import {renderWoods} from './woods-renderer.js';

export function renderRegion(scene) {
  if(scene.region.renderer==='town') {
    buildArt(scene,scene.region.places);
    const trail=scene.add.graphics().setDepth(-90);
    for(let y=80;y<270;y+=18) trail.fillStyle(0xc2b587).fillRect(485+(y%4),y,30,12);
  } else if(scene.region.renderer==='woods') renderWoods(scene);
  else if(scene.region.renderer==='ruins') renderRuins(scene);
  else renderLandscape(scene);
  for(const p of scene.region.places.filter(p=>!p.kind)) scene.add.text(p.door.x,p.id==='chest'?548:67,p.name,{fontSize:'16px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#594934',padding:{x:10,y:5}}).setOrigin(.5).setDepth(1000);
  for(const exit of scene.region.exits) {
    const {x,y}=exit.door;
    scene.add.graphics().setDepth(y-35).fillStyle(0x604b35).fillRect(x-3,y-63,6,36);
    scene.add.text(Math.max(60,x),Math.max(24,y-72),exit.name,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#594934',padding:{x:6,y:5}}).setOrigin(.5).setDepth(1000);
    scene.add.text(x,y+28,'E · '+exit.action,{fontSize:'12px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#4e6842',padding:{x:5,y:3}}).setOrigin(.5).setDepth(1000);
  }
  setupEnvironment(scene);
}
