import test from 'node:test';import assert from 'node:assert/strict';
import {chooseInteraction} from './src/npc-data.js';import {regions} from './src/regions.js';
import {included,approaches,buildings} from './reachability-test-helper.mjs';
test('all physically reachable surveyed approaches target the expected non-building object',()=>{
 for(const p of included){const r=regions[p.region],ns=included.filter(n=>n.region===r.id&&n.kind==='npc');for(const a of approaches(p).filter(a=>a.reachable))assert.equal(chooseInteraction([...r.places,...r.exits],ns,a.position,r.collisions)?.id,p.id,`${p.region}/${p.id}/${a.direction}`);}
});
test('building and doorway eligibility remains the legacy anchor radius',()=>{
 for(const r of Object.values(regions))for(const p of r.places.filter(p=>buildings.has(p.id)))for(const d of [0,74,75,90])assert.equal(chooseInteraction([p],[],{x:p.door.x+d,y:p.door.y},r.collisions)?.id,d<75?p.id:undefined);
});
test('nearer NPC wins over an overlapping eligible landmark; ties are deterministic',()=>{
 const p={id:'rune-0',door:{x:70,y:0}},n={id:'npc',kind:'npc',position:{x:0,y:0},door:{x:0,y:24},interactionRadius:54};assert.equal(chooseInteraction([p],[n],{x:0,y:12}),n);assert.equal(chooseInteraction([p,{...p,id:'rune-1'}],[],{x:70,y:0}),p);
});
test('meaningful barriers reject targets, own footprint does not block approach, distant targets rejected',()=>{
 const p={id:'safe-chest',x:100,y:100,w:56,h:40,door:{x:128,y:165}},own={x:100,y:100,w:56,h:40};
 assert.equal(chooseInteraction([p],[],{x:128,y:80},[own]),p);
 assert.equal(chooseInteraction([p],[],{x:128,y:70},[own,{x:90,y:90,w:80,h:5,kind:'wall'}]),undefined);
 assert.equal(chooseInteraction([p],[],{x:128,y:220},[own,{x:80,y:180,w:100,h:20,kind:'building'}]),undefined);
 assert.equal(chooseInteraction([p],[],{x:128,y:300},[own]),undefined);
});
