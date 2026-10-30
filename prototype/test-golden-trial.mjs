import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {lessons,interactTrial,normalizeTrial,stoneState} from './src/golden-trial.js';
import {createWorldStore,normalizeWorld,WORLD_KEY,WORLD_VERSION} from './src/world-store.js';
import {ruins} from './src/ruins-data.js';
const old={version:2,regionId:'ruins',spawnId:'fromMeadow',discovered:['town','woods','meadow','ruins'],progress:{transitions:17},stories:['beginning','workshop'],activities:{rhythm:true,gears:true},secrets:{found:['clock','golden'],golden:false,waited:true}};
const memory=seed=>{const data=new Map(seed===undefined?[]:[[WORLD_KEY,JSON.stringify(seed)]]);data.set('johnny-town.fortune.v1','untouched fortune');let writes=0;return {data,storage:()=>({getItem:k=>data.get(k),setItem:(k,v)=>{writes++;data.set(k,v);}}),get writes(){return writes;}};};
test('canonical five lines are exact and ordered',()=>assert.deepEqual(lessons,['别对我有太多期待','不要让肌肉察觉','相信回旋吧，只管相信就是了','献上敬意吧','绕远路就是我的捷径，我的捷径就是绕远路']));
test('deterministic five-stage sequence requires a final central interaction',()=>{
 let stage=0;const ids=['golden','rune-0','rune-1','rune-2','golden'];
 for(let i=0;i<ids.length;i++){const v=interactTrial(stage,ids[i]);assert.equal(v.stage,i+1);assert.equal(v.lesson,i);assert.equal(v.advanced,true);stage=v.stage;}
 assert.equal(stage,5);
});
test('every out-of-order stone at every stage cannot skip or reset progress',()=>{
 for(let stage=0;stage<=5;stage++)for(const id of ['golden','rune-0','rune-1','rune-2','unknown']){
  const v=interactTrial(stage,id),expected=stage<5&&id===['golden','rune-0','rune-1','rune-2','golden'][stage];
  assert.equal(v.stage,stage+Number(expected));assert.equal(v.advanced,expected);
  if(v.mode==='locked')assert.equal(v.lesson,null);
 }
});
test('dormant, awakened and completed rune states are distinct and monotonic',()=>{
 for(let i=0;i<3;i++){assert.equal(stoneState(0,'rune-'+i),'dormant');assert.equal(stoneState(i+1,'rune-'+i),'awakened');assert.equal(stoneState(i+2,'rune-'+i),'completed');}
 assert.equal(stoneState(4,'golden'),'awakened');assert.equal(stoneState(5,'golden'),'completed');
});
test('fresh visitor and pre-P7B P6/P7A saves retain existing data',()=>{
 assert.equal(createWorldStore({storage:memory().storage}).read().goldenTrial.stage,0);
 const actual=normalizeWorld(old);assert.equal(WORLD_VERSION,2);assert.equal(actual.goldenTrial.stage,0);
 for(const key of ['regionId','spawnId','discovered','progress','stories','activities','secrets'])assert.deepEqual(actual[key],old[key]);
 assert.equal(normalizeWorld({...old,version:1}).goldenTrial.stage,0);
});
for(let stage=0;stage<=5;stage++)test('restores intermediate/final stage '+stage+' across region visits and fresh store',()=>{
 const fixture={...old,goldenTrial:{stage},secrets:{...old.secrets,golden:stage===5}},m=memory(fixture),store=createWorldStore({storage:m.storage});
 store.visit('meadow','fromRuins');store.visit('ruins','fromMeadow');
 const saved=createWorldStore({storage:m.storage}).read();assert.equal(saved.goldenTrial.stage,stage);assert.deepEqual(saved.stories,old.stories);assert.deepEqual(saved.activities,old.activities);assert.ok(saved.secrets.waited);assert.equal(m.data.get('johnny-town.fortune.v1'),'untouched fortune');
});
test('progress immediately persists after each lesson and repeats do not write or duplicate',()=>{
 const m=memory(old),store=createWorldStore({storage:m.storage});
 for(const [i,id] of ['golden','rune-0','rune-1','rune-2','golden'].entries()){
  store.interactGolden(id);assert.equal(JSON.parse(m.data.get(WORLD_KEY)).goldenTrial.stage,i+1);
  const writes=m.writes;store.interactGolden(id);assert.equal(m.writes,writes);
 }
 assert.equal(store.read().secrets.found.filter(id=>id==='golden').length,1);assert.equal(store.read().secrets.golden,true);
 for(const id of ['golden','rune-0','rune-1','rune-2'])assert.notEqual(store.interactGolden(id).lesson,null);
});
test('legacy discovery retains its achievement without falsely completing five lessons',()=>{
 const s=normalizeWorld(old);assert.ok(s.secrets.found.includes('golden'));assert.equal(s.goldenTrial.stage,0);
});
test('legacy completed Golden Spin is grandfathered, never revoked',()=>{
 const fixture={...old,secrets:{...old.secrets,golden:true}},m=memory(fixture),store=createWorldStore({storage:m.storage});
 assert.equal(store.read().goldenTrial.stage,5);assert.equal(store.interactGolden('golden').lesson,4);assert.ok(store.read().secrets.golden);assert.deepEqual(store.read().secrets.found,old.secrets.found);
});
test('missing malformed partial hostile and contradictory stage fields sanitize safely',()=>{
 for(const value of [undefined,null,{},[],1,'2',{stage:NaN},{stage:Infinity},{stage:-1},{stage:6},{stage:1.5},{stage:'3'},{stage:true}]){
  const n=normalizeWorld({...old,goldenTrial:value});assert.equal(n.goldenTrial.stage,0);assert.deepEqual(n.secrets,old.secrets);assert.deepEqual(n.activities,old.activities);
 }
 assert.deepEqual(normalizeTrial({stage:2,garbage:true}),{stage:2});
 assert.equal(normalizeWorld({...old,goldenTrial:{stage:5}}).secrets.golden,true);
 assert.equal(normalizeWorld({...old,secrets:{...old.secrets,golden:true},goldenTrial:{stage:2}}).goldenTrial.stage,5);
});
test('denied storage and corrupted save still support the full trial without crashing',()=>{
 const store=createWorldStore({storage:()=>{throw Error('denied');}});
 for(const id of ['golden','rune-0','rune-1','rune-2','golden'])store.interactGolden(id);
 assert.equal(store.read().goldenTrial.stage,5);assert.ok(store.warning);
 const m=memory();m.data.set(WORLD_KEY,'{broken');assert.equal(createWorldStore({storage:m.storage}).read().goldenTrial.stage,0);
});
test('full published ruins geometry and interaction hotspots remain byte-equivalent',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(ruins)).digest('hex'),'732a5693aeedfd870c41667f9fc82b2b1086acc2dec8b5d3f24931cc2fae8c91');
});
