import chiefMek from './assets/chief-mek.png';
import {drawCityHall} from './city-hall.js';
import treeB from './assets/tree-b.png';
import chestOpen from './assets/chest-open.png';
import ground from './assets/ground.png';
import home from './assets/home.png';
import shrine from './assets/shrine.png';
import chest from './assets/chest.png';
import tree from './assets/tree.png';
import player from './assets/player.png';
export function preloadArt(scene){for(const [key,url] of Object.entries({ground,home,shrine,chest,tree,treeB,chiefMek}))scene.load.image(key,url);scene.load.image('chest-open',chestOpen);scene.load.spritesheet('walker',player,{frameWidth:32,frameHeight:48});}
export function buildArt(scene,places){
 scene.add.image(0,0,'ground').setOrigin(0).setDepth(-100);
 scene.art={};
 for(const p of places){if(p.id==='city-hall'){drawCityHall(scene,p);continue;}const offset=p.id==='home'?{x:-16,y:-60}:p.id==='shrine'?{x:-16,y:-60}:{x:-5,y:-17};scene.art[p.id]=scene.add.image(p.x+offset.x,p.y+offset.y,p.id).setOrigin(0).setDepth(p.y+p.h);}
 const trees=scene.region.trees;
 for(const [i,[x,y]] of trees.entries()){scene.add.image(x-40,y-76,i%2?'treeB':'tree').setOrigin(0).setDepth(y+24);}
 const decor=scene.add.graphics().setDepth(1);
 // Small planters, rocks and barrels placed outside the connected roads.
 for(const [x,y] of [[335,245],[605,250],[615,480],[820,490]]){decor.fillStyle(0x604b35).fillRect(x,y,23,16);decor.fillStyle(0xb59059).fillRect(x+2,y+2,19,12);decor.fillStyle(0x496e42).fillRect(x-3,y-6,28,8);for(let i=0;i<4;i++){decor.fillStyle(i%2?0xe9cd87:0xd8957b).fillRect(x+i*6,y-8,3,4);}}
 scene.add.text(450,585,'慢慢走，奇怪的事会等你。',{fontSize:'12px',fontFamily:'monospace',color:'#e7dfb8',backgroundColor:'#4e6842',padding:{x:10,y:6}}).setOrigin(.5).setDepth(1000);
}
export function setupEnvironment(scene){
 const motes=scene.add.graphics().setDepth(900);scene.environment=motes;
 scene.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 scene.motionChange=()=>{scene.reduced=scene.reducedMotion.matches;};scene.motionChange();scene.reducedMotion.addEventListener('change',scene.motionChange);scene.events.once('shutdown',()=>scene.reducedMotion.removeEventListener('change',scene.motionChange));
}
export function animateArt(scene,time,x,y){
 scene.ambientUpdate?.(time);
 scene.player.setDepth(scene.player.y+16);scene.shadow.setPosition(scene.player.x,scene.player.y+14);
 const moving=!!(x||y);if(moving)scene.facing=Math.abs(x)>Math.abs(y)?(x<0?2:3):(y<0?1:0);
 if(moving&&!scene.reduced)scene.walker.play('walk-'+scene.facing,true);else{scene.walker.stop();scene.walker.setFrame(scene.facing*4);}
 const g=scene.environment;g.clear();if(!scene.reduced){for(let i=0;i<8;i++){const px=120+i*94+Math.floor(Math.sin(time/4000+i)*12),py=430+Math.floor(Math.sin(time/3200+i*2)*42);g.fillStyle(0xeadb91,.4).fillRect(px,py,2,2);}}
 for(const [id,image] of Object.entries(scene.art))image.setTint(scene.target?.id===id?0xffedc2:0xffffff);
}
