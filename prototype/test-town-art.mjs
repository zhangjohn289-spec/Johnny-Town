import test from 'node:test';import assert from 'node:assert/strict';
import {prepareTownTextures,drawTownHall} from './src/town-art.js';
import {regions} from './src/regions.js';
test('town art caches exactly five textures and releases all temporary Graphics',()=>{
 const keys=new Set(),generated=[],destroyed=[];let allocations=0;
 const scene={textures:{exists:key=>keys.has(key)},make:{graphics({add}){assert.equal(add,false);allocations++;const g={fillStyle(){return this;},fillRect(...args){assert.ok(args.every(Number.isFinite));return this;},generateTexture(key,w,h){assert.ok(!keys.has(key));keys.add(key);generated.push([key,w,h]);},destroy(){destroyed.push(g);}};return g;}}};
 const before=JSON.stringify(regions);prepareTownTextures(scene);assert.equal(generated.length,5);assert.equal(allocations,5);assert.equal(destroyed.length,5);
 for(let i=0;i<30;i++)prepareTownTextures(scene);assert.equal(allocations,5);assert.equal(destroyed.length,5);assert.equal(JSON.stringify(regions),before);
 assert.deepEqual(generated.map(v=>v.slice(1)),[[960,640],[212,200],[192,200],[80,100],[80,100]]);
});
test('town hall art uses only finite static drawing commands and does not mutate its interaction data',()=>{
 const p=regions.town.places.find(p=>p.id==='city-hall'),before=JSON.stringify(p),commands=[];
 const g={fillStyle(){return this;},fillRect(...v){assert.ok(v.every(Number.isFinite));commands.push(v);return this;}};
 drawTownHall(g,p);assert.ok(commands.length>0);assert.ok(commands.every(([x,y,w,h])=>w>0&&h>0&&x>=0&&y>=0&&x+w<=960&&y+h<=640));assert.equal(JSON.stringify(p),before);
});
