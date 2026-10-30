import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {regions} from './src/regions.js';import {natureRegions,effectCaps,naturePlan,windStep,windPeriod,waterInterior,decorationSafe} from './src/nature-config.js';import {attachNature} from './src/nature-effects.js';
const hashes={town:'06570304c1f7bc1a3434432bf9e2fd13d1c6a5fe2fbff5c4148ce7ca991c079d',meadow:'13a0499f755d80ec3a3eeb873c2d151c526444334dc929f3b13a64663903fedd',woods:'33ecf18300622e07f4d6bc4536108a80bbd2c32caf55e1fd77c1d1154cf8737a',lake:'9b3fdf7ad70d8e6cefee530d45d474d12b3116dfdfc5160b1d7794bcb7488b0e',valley:'a727da9931aee9f658326bba25b3bbf617592f2289db23551c7eca1394e0a877',ruins:'732a5693aeedfd870c41667f9fc82b2b1086acc2dec8b5d3f24931cc2fae8c91'};
function scene(id){const graphics=[],handlers=[];let baseCalls=0;const s={region:regions[id],reduced:false,ambientUpdate:()=>baseCalls++,add:{graphics(){const g={commands:[],name:'',depth:0,destroyed:false,setName(v){this.name=v;return this;},setDepth(v){this.depth=v;return this;},fillStyle(...v){this.style=v;return this;},fillRect(...v){this.commands.push([...this.style,...v]);return this;},clear(){this.commands=[];return this;},destroy(){this.destroyed=true;this.commands=[];}};graphics.push(g);return g;}},events:{once(event,fn){assert.equal(event,'shutdown');handlers.push(fn);}}};return {s,graphics,handlers,calls:()=>baseCalls};}
test('all six registered maps match the accepted P7B baseline',()=>{for(const [id,r] of Object.entries(regions))assert.equal(createHash('sha256').update(JSON.stringify(r)).digest('hex'),hashes[id]);});
test('deterministic region plans are bounded and do not mutate map data',()=>{
 const before=JSON.stringify(regions);for(const r of Object.values(regions)){const p=naturePlan(r);assert.deepEqual(p,naturePlan(r));for(const [kind,list] of Object.entries(p))assert.ok(list.length<=effectCaps[kind]);for(const v of p.grass)assert.ok(decorationSafe(r,v.x,v.y));}assert.equal(JSON.stringify(regions),before);
});
test('forest entry and central normal touch views each contain several complete animated foliage targets',()=>{
 const p=naturePlan(regions.woods).canopy;for(const [x,y] of [[0,342],[180,207]])assert.ok(p.filter(v=>v.x>=x&&v.x+30<=x+640&&v.y>=y&&v.y+22<=y+426).length>=3);
});
test('every ripple footprint stays inside water and away from the walkable pier',()=>{
 for(const p of naturePlan(regions.lake).ripples)for(const dx of [-25,0,25])for(const dy of [0,18])assert.ok(waterInterior(p.x+dx,p.y+dy,0));
 assert.equal(waterInterior(550,430),false);assert.equal(waterInterior(50,600),false);
});
test('wind bends within five seconds, has staggered rests and never jumps several pixels per frame',()=>{
 let still=0;for(let t=0;t<15000;t+=10){const a=windStep(t,2);assert.ok(Number.isInteger(a)&&Math.abs(a)<=3);if(a===0)still++;assert.equal(a,windStep(t+windPeriod(2),2));assert.ok(Math.abs(a-windStep(t+17,2))<=1);}assert.ok(still/1500>.1&&still/1500<.5);
 for(const seed of [0,1,7,21])for(let start=0;start<14000;start+=250){const values=Array.from({length:51},(_,i)=>windStep(start+i*100,seed));assert.ok(Math.max(...values)-Math.min(...values)>=3);}
 assert.notDeepEqual(Array.from({length:20},(_,i)=>windStep(i*250,0)),Array.from({length:20},(_,i)=>windStep(i*250,1)));
});
for(const id of natureRegions)test(id+' uses fixed scene resources, composes existing animation and freezes in Reduced Motion',()=>{
 const {s,graphics,handlers,calls}=scene(id),before=JSON.stringify(s.region);attachNature(s);const fx=s.natureEffects,update=s.ambientUpdate;
 assert.equal(graphics.length,4);assert.equal(handlers.length,1);
 for(let t=0;t<50000;t+=97)update(t);assert.equal(graphics.length,4);assert.ok(calls()>500);
 assert.ok(graphics.find(g=>g.name==='nature-ground').depth<48);assert.ok(graphics.find(g=>g.name==='nature-water').depth<0);assert.ok(graphics.every(g=>g.depth<999));
 s.reduced=true;update(60000);const frozen=JSON.stringify(graphics.map(g=>g.commands));update(90000);assert.equal(JSON.stringify(graphics.map(g=>g.commands)),frozen);assert.equal(JSON.stringify(s.region),before);
 if(id==='woods')assert.ok(graphics.find(g=>g.name==='nature-sun').commands.length>0);
 const n=calls();handlers[0]();assert.equal(s.natureEffects,null);assert.equal(s.ambientUpdate,null);assert.ok(graphics.every(g=>g.destroyed));assert.ok(fx.describe().disposed);fx.destroy();update(100000);assert.equal(calls(),n);
});
test('Town and Gear Valley keep their existing ambient callback without new objects or listeners',()=>{
 for(const id of ['town','valley']){const {s,graphics,handlers}=scene(id),previous=s.ambientUpdate;attachNature(s);assert.equal(s.natureEffects,null);assert.equal(s.ambientUpdate,previous);assert.equal(graphics.length,0);assert.equal(handlers.length,0);}
});
