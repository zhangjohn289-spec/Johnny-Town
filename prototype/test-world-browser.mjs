import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXE?{executablePath:process.env.BROWSER_EXE}:{channel:'msedge'})});
const page=await browser.newPage({viewport:{width:1366,height:768}});
const url=process.env.TOWN_URL||'http://127.0.0.1:4191/Johnny-Town/';
const results=[],errors=[],failed=[],metrics={transitions:[]};
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()});});
const group=async(name,fn)=>{try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});throw e;}};
const ready=async(id)=>{await page.waitForFunction(id=>window.__town?.scene?.region?.id===id && !__town.scene.transitioning && __town.scene.player?.active,id);};
const at=async(x,y)=>{await page.evaluate(({x,y})=>{const s=__town.scene;s.input.keyboard.resetKeys();s.player.body.reset(x,y);},{x,y});await page.waitForTimeout(100);};
const pos=()=>page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y}));
const close=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(100);};
const resources=()=>page.evaluate(()=>{const s=__town.scene;return {region:s.region.id,E:s.input.keyboard.listenerCount('keydown-E'),M:s.input.keyboard.listenerCount('keydown-M'),load:s.load.listenerCount('loaderror'),bodies:s.physics.world.bodies.size,staticBodies:s.physics.world.staticBodies.size,colliders:s.physics.world.colliders.getActive().length,children:s.children.length,textures:s.textures.getTextureKeys().length,shutdown:s.events.listenerCount('shutdown')};});
async function travel(destination){
  const exit=await page.evaluate(()=>__town.scene.region.exits[0]);
  await at(exit.door.x,exit.door.y);
  const begin=Date.now();await page.keyboard.press('e');await ready(destination);
  await page.waitForFunction(()=>!__town.scene.cameras.main.fadeEffect.isRunning);
  metrics.transitions.push({destination,ms:Date.now()-begin});
}
try{
 await page.goto(url);await ready('town');
 await group('Phase04 visual texture cache and town framing',async()=>{
  assert.equal(await page.evaluate(()=>['ground','home','shrine','chest','tree','treeB','walker','chest-open'].every(k=>__town.scene.textures.exists(k))),true);
  assert.deepEqual(await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY})),{x:0,y:0});
  await page.screenshot({path:'logs/phase05a-town.png'});
 });
 await group('actual keyboard walking reaches both road exits without teleporting through walls',async()=>{
  await page.keyboard.down('d');await page.waitForTimeout(2300);await page.keyboard.up('d');
  assert.ok((await pos()).x>810);await page.keyboard.press('e');await ready('meadow');
  await page.waitForTimeout(200);await page.screenshot({path:'logs/phase05a-meadow-entry.png'});
  await page.keyboard.down('a');await page.waitForTimeout(500);await page.keyboard.up('a');
  await page.keyboard.press('e');await ready('town');await page.waitForTimeout(200);
  assert.deepEqual(await pos(),{x:780,y:350});
 });
 await group('existing fortune persists through travel and safe meadow entry',async()=>{
  await at(730,285);await page.keyboard.press('e');await page.getByRole('button',{name:'抽签',exact:true}).click();
  metrics.fortune=await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1'));await close();
  await travel('meadow');assert.deepEqual(await pos(),{x:145,y:384});
  await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>__town.scene.region.id),'meadow');
  assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),metrics.fortune);
 });
 await group('camera scroll and all four bounds with physical movement',async()=>{
  await at(750,400);await page.keyboard.down('d');await page.waitForTimeout(1600);await page.keyboard.up('d');
  let p=await pos();assert.ok(p.x<=1000&&p.x>=990);
  await page.waitForTimeout(250);
  let c=await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}));assert.equal(c.x,64);
  await page.keyboard.down('s');await page.waitForTimeout(2100);await page.keyboard.up('s');await page.waitForTimeout(250);
  p=await pos();assert.ok(p.y<=736&&p.y>=730);c=await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}));assert.equal(c.y,128);
  await page.screenshot({path:'logs/phase05a-meadow.png'});
  await at(30,40);await page.keyboard.down('a');await page.keyboard.down('w');await page.waitForTimeout(350);await page.keyboard.up('a');await page.keyboard.up('w');await page.waitForTimeout(700);
  p=await pos();assert.ok(p.x>=24&&p.y>=32);c=await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}));assert.deepEqual(c,{x:0,y:0});
 });
 await group('meadow trees and fences block movement; road stays traversable',async()=>{
  await at(100,180);await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');assert.ok((await pos()).y>=154);
  await at(390,300);await page.keyboard.down('w');await page.waitForTimeout(450);await page.keyboard.up('w');assert.ok((await pos()).y>=266);
  await at(300,384);await page.keyboard.down('d');await page.waitForTimeout(700);await page.keyboard.up('d');assert.ok((await pos()).x>400);
 });
 await group('refresh restores safe checkpoint, discoveries and fortune',async()=>{
  await page.reload();await ready('meadow');assert.deepEqual(await pos(),{x:145,y:384});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('johnny-town.world.v1')));assert.deepEqual(saved.discovered,['town','meadow']);
  assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),metrics.fortune);
 });
 await group('world navigation locks motion, restores focus, lists future regions without links',async()=>{
  await page.locator('#world-map').click();assert.ok((await page.locator('#body').innerText()).includes('当前位置'));
  assert.equal(await page.locator('#body li').count(),6);assert.equal(await page.locator('#body a').count(),0);
  const before=await pos();await page.keyboard.down('d');await page.waitForTimeout(200);await page.keyboard.up('d');assert.deepEqual(await pos(),before);
  await close();assert.equal(await page.locator('#world-map').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>__town.scene.player.body.velocity.length()),0);
  await page.keyboard.press('m');assert.equal(await page.locator('dialog[open]').count(),1);await close();
 });
 await group('20 cached transitions retain one set of bodies, colliders and listeners',async()=>{
  await travel('town');const town=await resources();const cdp=await page.context().newCDPSession(page);
  await cdp.send('HeapProfiler.collectGarbage');metrics.heapBefore=(await cdp.send('Runtime.getHeapUsage')).usedSize;
  let meadow;
  for(let i=0;i<10;i++){
   await travel('meadow');const r=await resources();if(!meadow)meadow=r;else assert.deepEqual(r,meadow);
   assert.equal(r.E,1);assert.equal(r.M,1);assert.equal(r.colliders,1);
   await travel('town');assert.deepEqual(await resources(),town);assert.deepEqual(await pos(),{x:780,y:350});
  }
  await cdp.send('HeapProfiler.collectGarbage');metrics.heapAfter=(await cdp.send('Runtime.getHeapUsage')).usedSize;
  metrics.resources={town,meadow};await cdp.detach();
  assert.ok(metrics.heapAfter-metrics.heapBefore<8*1024*1024,'retained heap growth above 8 MiB diagnostic threshold');
  assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),metrics.fortune);
 });
 await group('movement remains 175 px/s and diagonal normalized after repeated travel',async()=>{
  for(const keys of [['d'],['d','s']]){
   await at(470,355);for(const k of keys)await page.keyboard.down(k);await page.waitForTimeout(100);
   assert.ok(Math.abs(await page.evaluate(()=>__town.scene.player.body.velocity.length())-175)<.001);
   for(const k of keys)await page.keyboard.up(k);
  }
 });
 await group('reduced motion skips fades and walking animation on region change',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await travel('meadow');
  assert.equal(await page.evaluate(()=>__town.scene.reduced),true);assert.equal(await page.evaluate(()=>__town.scene.cameras.main.fadeEffect.isRunning),false);
  await page.keyboard.down('d');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>__town.scene.walker.anims.isPlaying),false);await page.keyboard.up('d');
  await page.emulateMedia({reducedMotion:'no-preference'});
 });
 await group('desktop and narrow viewports keep canvas ratio and closable readable navigation',async()=>{
  metrics.viewports=[];
  for(const [width,height] of [[1366,768],[1920,1080],[2560,1440],[400,800],[800,450]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(150);const box=await page.locator('canvas').boundingBox();
   assert.ok(box.width>0&&box.x>=0&&box.x+box.width<=width);assert.ok(Math.abs(box.width/box.height-1.5)<.005);
   await page.locator('#world-map').click();assert.ok(await page.locator('#close').isVisible());await close();assert.equal(await page.locator('dialog[open]').count(),0);
   metrics.viewports.push({width,height,canvas:box});
  }
  await page.setViewportSize({width:1366,height:768});
 });
 await group('legacy fortune-only and corrupted world saves recover in browser',async()=>{
  await page.evaluate(()=>localStorage.removeItem('johnny-town.world.v1'));await page.reload();await ready('town');
  assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),metrics.fortune);
  for(const raw of ['{broken','{}',JSON.stringify({version:1,regionId:'meadow',spawnId:'wall',discovered:[]})]){
   await page.evaluate(raw=>localStorage.setItem('johnny-town.world.v1',raw),raw);await page.reload();await ready('town');assert.deepEqual(await pos(),{x:470,y:355});
  }
 });
 await group('basic render performance and asset requests',async()=>{
  const sample=()=>page.evaluate(()=>new Promise(resolve=>{let n=0,start=performance.now();const tick=()=>{if(++n===120)resolve({raf:120000/(performance.now()-start),phaser:__town.scene.game.loop.actualFps});else requestAnimationFrame(tick);};requestAnimationFrame(tick);}));
  metrics.fps={town:await sample()};
  await travel('meadow');await at(500,384);await page.keyboard.down('d');metrics.fps.meadowMoving=await sample();await page.keyboard.up('d');
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 });
} finally {
 delete metrics.fortune;
 fs.writeFileSync('logs/phase05a-browser-results.json',JSON.stringify({browser:await browser.version(),url,results,metrics,errors,failed},null,2));
 console.log(JSON.stringify({results,metrics,errors,failed},null,2));await browser.close();
}
