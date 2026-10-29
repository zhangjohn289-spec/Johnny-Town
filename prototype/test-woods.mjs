import test from 'node:test';
import assert from 'node:assert/strict';
import {regions,isSafePosition} from './src/regions.js';
import {woodsPaths} from './src/woods-data.js';
import {forestStories as stories,storyIds,profile} from './src/story-content.js';
import {createWorldStore,normalizeWorld,WORLD_KEY,WORLD_VERSION} from './src/world-store.js';
const memory=()=>{const map=new Map();let writes=0;return {getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes++;map.set(k,v);},get writes(){return writes;}};};
const old={version:1,regionId:'meadow',spawnId:'fromTown',discovered:['town','meadow'],progress:{transitions:8}};
test('05A v1 migrates region, checkpoint, discoveries and counters to v2',()=>{
 const value=normalizeWorld(old);assert.equal(value.version,WORLD_VERSION);assert.equal(value.regionId,'meadow');assert.equal(value.spawnId,'fromTown');assert.deepEqual(value.discovered,old.discovered);assert.equal(value.progress.transitions,8);assert.deepEqual(value.stories,[]);
});
test('migration writes same key and never touches fortune bytes',()=>{
 const storage=memory();storage.setItem(WORLD_KEY,JSON.stringify(old));storage.setItem('johnny-town.fortune.v1','untouched');
 const store=createWorldStore({storage:()=>storage});store.save();assert.equal(JSON.parse(storage.getItem(WORLD_KEY)).version,2);assert.equal(storage.getItem('johnny-town.fortune.v1'),'untouched');
});
test('discovery works in arbitrary order, persists immediately and is idempotent',()=>{
 const storage=memory(),store=createWorldStore({storage:()=>storage});
 for(const id of [...storyIds].reverse())store.discover(id);
 const writes=storage.writes;for(const id of storyIds)store.discover(id);store.discover('__proto__');
 assert.equal(storage.writes,writes);assert.deepEqual(store.read().stories,[...storyIds].reverse());
 assert.deepEqual(createWorldStore({storage:()=>storage}).read().stories,store.read().stories);
});
test('story progress survives repeated region visits and safe checkpoint restoration',()=>{
 const storage=memory(),store=createWorldStore({storage:()=>storage});store.discover('workshop');
 for(let i=0;i<10;i++){store.visit('woods','fromTown');store.visit('town','fromWoods');}
 const state=createWorldStore({storage:()=>storage}).read();assert.deepEqual(state.stories,['workshop']);assert.equal(state.progress.transitions,20);assert.equal(state.spawnId,'fromWoods');
});
test('invalid or partial story data is sanitized without losing a valid world checkpoint',()=>{
 for(const value of [null,{},'bad',undefined])assert.deepEqual(normalizeWorld({...old,version:2,stories:value}).stories,[]);
 const value=normalizeWorld({...old,version:2,stories:['beginning','beginning',{},'unknown','workshop']});assert.deepEqual(value.stories,['beginning','workshop']);assert.equal(value.regionId,'meadow');
});
test('corrupted and unsupported save versions recover to town without phantom discoveries',()=>{
 for(const raw of ['{',JSON.stringify({...old,version:999}),JSON.stringify({version:2,stories:storyIds})]){
  const storage=memory();storage.setItem(WORLD_KEY,raw);const state=createWorldStore({storage:()=>storage}).read();assert.equal(state.regionId,'town');assert.deepEqual(state.stories,[]);
 }
});
test('blocked storage still supports unique journal entries in memory',()=>{
 const store=createWorldStore({storage:()=>{throw Error('denied');}});store.discover('unwritten');store.discover('unwritten');assert.deepEqual(store.read().stories,['unwritten']);assert.ok(store.warning);
});
test('five story records match interactive geometry and have optional short detail',()=>{
 assert.equal(stories.length,5);assert.equal(new Set(storyIds).size,13);
 for(const story of stories){const p=regions.woods.places.find(p=>p.storyId===story.id);assert.ok(p);assert.ok(isSafePosition(regions.woods,p.door));assert.ok(story.summary.length<100);assert.equal(story.detail.length,2);assert.equal(story.connection,undefined);}
});
test('every main/branch path center stays clear for the full 16px player body',()=>{
 for(const path of woodsPaths)for(let i=1;i<path.length;i++){
  const [ax,ay]=path[i-1],[bx,by]=path[i],length=Math.hypot(bx-ax,by-ay);
  for(let d=0;d<=length;d+=2)assert.ok(isSafePosition(regions.woods,{x:ax+(bx-ax)*d/length,y:ay+(by-ay)*d/length}),`blocked at path ${i}, ${d}`);
 }
});
test('all five destinations and exit are in one reachable free-space component',()=>{
 const r=regions.woods,step=8,start={x:160,y:624},queue=[start],seen=new Set(['160,624']);
 for(let i=0;i<queue.length;i++)for(const [dx,dy] of [[8,0],[-8,0],[0,8],[0,-8]]){
  const p={x:queue[i].x+dx,y:queue[i].y+dy},key=p.x+','+p.y;
  if(!seen.has(key)&&isSafePosition(r,p)){seen.add(key);queue.push(p);}
 }
 for(const p of [...r.places,...r.exits])assert.ok(queue.some(n=>Math.hypot(n.x-p.door.x,n.y-p.door.y)<step),'unreachable '+p.id);
});
test('quick introduction is concise, includes project and interests, with editorial limits',()=>{
 assert.ok(profile.interests.length>=3);assert.ok(profile.overview.some(s=>s.text.includes('Johnny Town')));assert.equal(profile.editorialNote,undefined);
 assert.ok(JSON.stringify(profile).length<800);
});
