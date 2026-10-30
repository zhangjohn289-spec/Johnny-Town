import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {valley} from './src/expansion-data.js';
import {GEAR_FRAMES,GEAR_SPECS,gearPixels,meshPhase,gearAngle,frameAt,ensureGearArt} from './src/gear-art.js';
test('P7A preserves the full published valley geometry, exits and interactive data',()=>{
 // Captured from the running 381f9a0 baseline before any rendering edits.
 assert.equal(createHash('sha256').update(JSON.stringify(valley)).digest('hex'),'a727da9931aee9f658326bba25b3bbf617592f2289db23551c7eca1394e0a877');
});
test('three original gear sizes have visible hubs, rims, spokes and transparent openings',()=>{
 for(const {teeth,pitch} of Object.values(GEAR_SPECS)){
  const {size,pixels}=gearPixels(teeth,0),c=size/2,alpha=(x,y)=>pixels[(y*size+x)*4+3];
  assert.equal(alpha(c,c),255);assert.equal(alpha(0,0),0);
  let solid=0,open=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(Math.hypot(x+.5-c,y+.5-c)<pitch*.6){if(alpha(x,y))solid++;else open++;}
  assert.ok(solid>30&&open>30);assert.equal(pixels.length,size*size*4);
 }
});
test('external meshes preserve opposed tooth phase and pitch-line speed over time',()=>{
 for(const [a,b] of [[24,18],[18,12],[12,12]])for(const axis of [0,.6]){
  const phase=meshPhase(a,b,axis);
  for(const t of [0,16,1000,23789,100000]){
   const aa=gearAngle(t,a),ab=gearAngle(t,b,phase,-1);
   assert.ok(Math.abs(a*aa+b*ab-(a+b)*axis-b*Math.PI+Math.PI)<1e-10);
   assert.ok(Math.abs((gearAngle(t+100,a)-aa)*a+(gearAngle(t+100,b,phase,-1)-ab)*b)<1e-10);
  }
 }
});
test('frame sampling wraps without discontinuity and animation is time based',()=>{
 assert.equal(frameAt(0),0);assert.equal(frameAt(Math.PI*2),0);assert.equal(frameAt(-Math.PI*2),0);
 assert.equal(frameAt(-Math.PI*2/GEAR_FRAMES),GEAR_FRAMES-1);
 assert.equal(gearAngle(5000,24),1.2);assert.equal(gearAngle(5000,12),2.4);
});
test('gear atlases are generated once and reused on scene restarts',()=>{
 const keys=new Set(),frames=[];let refreshes=0;
 const scene={textures:{exists:k=>keys.has(k),createCanvas(key){keys.add(key);return {context:{createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}},add:i=>frames.push(i),refresh:()=>refreshes++,setFilter(){}};}}};
 ensureGearArt(scene);ensureGearArt(scene);
 assert.equal(keys.size,3);assert.equal(frames.length,GEAR_FRAMES*3);assert.equal(refreshes,3);
});
