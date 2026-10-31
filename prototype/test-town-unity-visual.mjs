import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {regions} from './src/regions.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const pass=process.env.ART_PASS||'before',dir=`logs/p7c-r2/${pass}`;fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[];
try{for(const [view,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['landscape',844,390,true],['portrait',390,844,true]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'no-preference'});
 for(const id of view==='desktop'?Object.keys(regions):['town']){
  await page.goto('http://127.0.0.1:4501/Johnny-Town/');await page.waitForFunction(()=>window.__town);await page.evaluate(({id,spawn})=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:id,spawnId:spawn,discovered:['town',id],progress:{transitions:1}})),{id,spawn:regions[id].defaultSpawn});await page.reload();await page.waitForFunction(id=>window.__town?.scene.region.id===id,id);await page.waitForTimeout(2000);
  const row={id,view};
  if(id==='town'&&view==='desktop'){
   row.metrics={};for(const mode of ['no-preference','reduce']){await page.emulateMedia({reducedMotion:mode});await page.waitForFunction(reduced=>__town.scene.reduced===reduced,mode==='reduce');await page.waitForTimeout(1000);row.metrics[mode]=await page.evaluate(()=>new Promise(resolve=>{let previous;const times=[];function tick(t){if(previous!==undefined)times.push(t-previous);previous=t;if(times.length<240)requestAnimationFrame(tick);else{const sorted=times.slice().sort((a,b)=>a-b),s=__town.scene;resolve({median:sorted[120],p95:sorted[228],children:s.children.length,textures:s.textures.getTextureKeys().length,E:s.input.keyboard.listenerCount('keydown-E'),bodies:s.physics.world.bodies.size,static:s.physics.world.staticBodies.size,colliders:s.physics.world.colliders.getActive().length,reduced:s.reduced});}}requestAnimationFrame(tick);}));}await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.screenshot({path:`${dir}/${id}-${view}.png`});row.camera=await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}));results.push(row);console.log('PASS',id,view);
  if(id==='town'&&touch)for(const p of regions.town.places){await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),p.door);await page.waitForTimeout(1800);await page.screenshot({path:`${dir}/${p.id}-${view}.png`});}
 }await context.close();
}assert.deepEqual(errors,[]);}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify({results,errors,browser:browser.version()},null,2));await browser.close();}
