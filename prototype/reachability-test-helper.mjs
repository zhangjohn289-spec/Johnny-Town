import {regions,isSafePosition} from './src/regions.js';
import {npcs} from './src/npc-data.js';
import {route} from './route-test-helper.mjs';
export const buildings=new Set(['city-hall','home','shrine','workshop','unfinished-ideas','phase-door']);
export const inventory=Object.values(regions).flatMap(r=>[
 ...r.places.map(p=>({...p,region:r.id,category:buildings.has(p.id)?'building-excluded':'object',bounds:{x:p.x,y:p.y,w:p.w,h:p.h}})),
 ...npcs.filter(n=>n.region===r.id).map(n=>({...n,region:r.id,category:'npc',kind:'npc',door:{x:n.position.x,y:n.position.y+24},bounds:{x:n.position.x-16,y:n.position.y-48,w:32,h:48}})),
 ...r.exits.map(p=>({...p,region:r.id,category:'transition-excluded'}))]);
for(const p of inventory){
 p.source=p.category==='npc'?'src/npc-data.js + src/npc-system.js':p.region==='town'?'src/config.js':p.region==='woods'?'src/woods-data.js':p.region==='ruins'?'src/ruins-data.js':'src/expansion-data.js + src/activities-data.js';
 p.radius=p.interactionRadius??75;p.anchor=p.door;
 p.nearbyCollisions=regions[p.region].collisions.filter(w=>Math.hypot(w.x+w.w/2-p.door.x,w.y+w.h/2-p.door.y)<200);
 p.conditions=p.kind==='rune'||p.id==='golden'?'Always inspectable; current Golden Trial stage controls listening/reread, not registration':p.kind==='secret'?'Always inspectable; saved discovery/completion may vary dialog':p.kind==='npc'?'Always talkable; repeat/session and saved progress select existing dialogue':'Always registered; existing discovery/activity state preserved';
 p.input='Shared scene target → E key or touch-interact click → scene.interact';
 const woodsVisual={beginning:[172,476,96,112],crossroads:[344,311,96,120],'echoing-tree':[570,91,240,240],workshop:[620,392,192,176],unwritten:[832,29,128,144]};
 p.approximateVisualBounds=p.category==='npc'?p.bounds:p.id==='chest'?{x:695,y:428,w:80,h:64}:woodsVisual[p.id]?Object.fromEntries(['x','y','w','h'].map((k,i)=>[k,woodsVisual[p.id][i]])):p.bounds?{x:p.x-20,y:p.y-100,w:p.w+40,h:p.h+130}:null;
 p.visualBoundsNote=p.region==='woods'||p.category==='npc'||p.id==='chest'?'Image bounds from renderer/PNG dimensions':'Conservative approximate ornament envelope; labels/environment excluded, not a new activation area';
 p.approximateVisual=p.category==='npc'?'32×48 sprite, origin bottom center at position':p.region==='woods'?({beginning:'96×112 image at (172,476)',crossroads:'96×120 sign at (344,311)','echoing-tree':'240×240 elder canopy at (570,91)',workshop:'192×176 hut at (620,392)',unwritten:'128×144 arch at (832,29)'}[p.id]??'exit sign'):p.region==='town'&&p.id==='chest'?'Pixel chest image at (695,428); solid ground footprint 65×48':p.bounds?`Renderer ornament around ground footprint ${p.bounds.w}×${p.bounds.h}; raised artwork can extend north of solid`:'exit sign';
}
export const included=inventory.filter(p=>['object','npc'].includes(p.category));
export function approaches(p){const b=p.bounds;return [
 ['north',{x:b.x+b.w/2,y:b.y-20}],['south',{x:b.x+b.w/2,y:b.y+b.h+12}],
 ['west',{x:b.x-22,y:b.y+b.h/2-8}],['east',{x:b.x+b.w+22,y:b.y+b.h/2-8}],['legacy-anchor',p.door]
 ].map(([direction,position])=>{const r=regions[p.region];let reason='',path;try{if(!isSafePosition(r,position))throw Error('standing body intersects existing collision/bounds');path=route(r.id,r.spawns[r.defaultSpawn],position);}catch(e){reason=e.message;}return {direction,position,reachable:!reason,reason,path};});}
