import test from 'node:test';
import assert from 'node:assert/strict';
import {regions,regionList,safeSpawn,isSafePosition} from './src/regions.js';
import {WORLD_KEY,createWorldStore,normalizeWorld} from './src/world-store.js';
import {parseRange} from './local-video.js';
import {attemptPlayback} from './src/media.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),data};};

test('every region spawn and destination is safe and outside its exit interaction range',()=>{
  for(const region of Object.values(regions)){
    for(const spawn of Object.values(region.spawns)){
      assert.ok(isSafePosition(region,spawn));
      for(const exit of region.exits) assert.ok(Math.hypot(exit.door.x-spawn.x,exit.door.y-spawn.y)>=75);
    }
    for(const exit of region.exits){assert.ok(regions[exit.to]);assert.ok(regions[exit.to].spawns[exit.spawn]);}
  }
});
test('collision geometry rejects solids, nonfinite coordinates and map edges',()=>{
  for(const r of Object.values(regions)){
    for(const w of r.collisions) assert.equal(isSafePosition(r,{x:w.x+w.w/2,y:w.y}),false);
    for(const p of [{x:0,y:0},{x:Infinity,y:40},{x:100,y:r.height}]) assert.equal(isSafePosition(r,p),false);
  }
});
test('Phase04 fortune-only storage migrates without modifying its existing bytes',()=>{
  const storage=memory(),fortune='{"date":"2026-10-29","fortuneId":"sample"}';
  storage.setItem('johnny-town.fortune.v1',fortune);
  const store=createWorldStore({storage:()=>storage});store.save();
  assert.equal(store.read().regionId,'town');assert.equal(storage.getItem('johnny-town.fortune.v1'),fortune);
});
test('round trips persist checkpoint, discoveries and transition count across instances',()=>{
  const storage=memory(),store=createWorldStore({storage:()=>storage});
  for(let i=0;i<10;i++){store.visit('meadow','fromTown');store.visit('town','fromMeadow');}
  const restored=createWorldStore({storage:()=>storage}).read();
  assert.equal(restored.progress.transitions,20);assert.deepEqual(restored.discovered,['town','meadow']);
  assert.equal(restored.spawnId,'fromMeadow');assert.deepEqual(safeSpawn(restored.regionId,restored.spawnId).position,{x:780,y:350});
});
test('corrupt, partial, unsupported or hostile saves safely fall back to town',()=>{
  for(const raw of ['{','null','[]','{}',JSON.stringify({version:99}),...['__proto__','constructor','meadow'].map(regionId=>JSON.stringify({version:1,regionId,spawnId:'constructor',discovered:[],progress:{transitions:0}}))]){
    const storage=memory();storage.setItem(WORLD_KEY,raw);
    assert.equal(createWorldStore({storage:()=>storage}).read().regionId,'town');
  }
});
test('valid schema is sanitized and arbitrary saved coordinates never spawn the player',()=>{
  const value=normalizeWorld({version:1,regionId:'meadow',spawnId:'fromTown',position:{x:100,y:130},discovered:['meadow','meadow','__proto__','woods'],progress:{transitions:2}});
  assert.deepEqual(value.discovered,['town','meadow']);assert.equal(value.position,undefined);
  assert.ok(isSafePosition(regions.meadow,safeSpawn(value.regionId,value.spawnId).position));
});
test('blocked storage keeps exploration alive in memory and reports the limitation',()=>{
  const store=createWorldStore({storage:()=>{throw new Error('blocked');}});
  store.visit('meadow','fromTown');assert.equal(store.read().regionId,'meadow');assert.ok(store.warning);
  const snapshot=store.read();snapshot.discovered.push('fake');assert.equal(store.read().discovered.includes('fake'),false);
});
test('future regions are navigation labels without executable exits',()=>{
  for(const future of regionList.filter(r=>!r.available)) for(const region of Object.values(regions)) assert.ok(!region.exits.some(e=>e.to===future.id));
});
test('video byte ranges support seeks and reject malformed or unsatisfiable ranges',()=>{
  assert.equal(parseRange(undefined,100),null);
  assert.deepEqual(parseRange('bytes=0-9',100),{start:0,end:9});
  assert.deepEqual(parseRange('bytes=90-',100),{start:90,end:99});
  assert.deepEqual(parseRange('bytes=-20',100),{start:80,end:99});
  assert.deepEqual(parseRange('bytes=0-1000',100),{start:0,end:99});
  for(const h of ['bytes=100-','bytes=9-2','bytes=-0','bytes=-','bytes=0-1,5-9','nope','bytes=999999999999999999-']) assert.equal(parseRange(h,100),false);
});
test('media network or decode failures never get mislabeled as autoplay restrictions',async()=>{
  for(const failOn of [1,2]) {
    let calls=0;
    const video={muted:false,error:null,async play(){calls++;if(calls===failOn)this.error={code:3};throw Error('play failed');}};
    const status={textContent:''};await attemptPlayback(video,status);
    assert.equal(calls,failOn);assert.ok(status.textContent.includes('视频加载失败'));
  }
});
