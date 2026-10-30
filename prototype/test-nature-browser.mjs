import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
import {regions} from './src/regions.js';import {effectCaps} from './src/nature-config.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),dir='logs/phase07c-r1/environment',results=[],errors=[],metrics={};fs.mkdirSync(dir,{recursive:true});page.on('pageerror',e=>errors.push(e.message));
const check=async(name,fn)=>{try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});throw e;}};
const ready=id=>page.waitForFunction(id=>window.__town?.scene.region.id===id&&!__town.scene.transitioning,id);
const at=async p=>{await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),p);await page.waitForTimeout(160);};
const state=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('johnny-town.world.v1'));return {stories:s.stories,secrets:s.secrets,activities:s.activities,goldenTrial:s.goldenTrial};});
const counts=()=>page.evaluate(()=>{const s=__town.scene;return {children:s.children.length,textures:s.textures.getTextureKeys().length,E:s.input.keyboard.listenerCount('keydown-E'),M:s.input.keyboard.listenerCount('keydown-M'),I:s.input.keyboard.listenerCount('keydown-I'),shutdown:s.events.listenerCount('shutdown'),bodies:s.physics.world.bodies.size,static:s.physics.world.staticBodies.size,colliders:s.physics.world.colliders.getActive().length,nature:s.natureEffects?.describe()||null};});
const program=()=>page.evaluate(()=>JSON.stringify(__town.scene.children.list.filter(o=>o.name?.startsWith('nature-')).map(o=>[o.name,o.depth,o.commandBuffer])));
async function travel(to){const e=await page.evaluate(to=>__town.scene.region.exits.find(e=>e.to===to),to);await at(e.door);await page.evaluate(()=>window.__priorNature=__town.scene.natureEffects);await page.keyboard.press('e');await ready(to);await page.waitForTimeout(180);const old=await page.evaluate(()=>{const old=window.__priorNature;if(!old)return null;old.update(999999);const result=old.describe();delete window.__priorNature;return result;});if(old)assert.equal(old.disposed,true);}
const points={woods:{x:500,y:420},lake:{x:200,y:560},meadow:{x:500,y:400},ruins:{x:500,y:400}};
try{
 await page.goto(process.env.TOWN_URL||'http://127.0.0.1:4401/Johnny-Town/');await ready('town');await page.evaluate(()=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:'town',spawnId:'start',discovered:['town','woods','meadow','lake','valley','ruins'],progress:{transitions:15},stories:['beginning','first-gear'],activities:{rhythm:true,gears:true},secrets:{found:['golden','clock'],golden:false,waited:true},goldenTrial:{stage:2}})));await page.reload();await ready('town');const progress=await state();
 for(const id of ['woods','lake','meadow','ruins'])await check(id+' actual ambient frames, reduced motion, input and layering',async()=>{
  if(id==='woods')await travel('woods');
  if(id==='lake'){await travel('town');await travel('meadow');await travel('lake');}
  if(id==='meadow')await travel('meadow');if(id==='ruins')await travel('ruins');
  await at(points[id]);assert.deepEqual(await page.evaluate(()=>__town.scene.region),regions[id]);
  const c=await counts();assert.equal(c.nature.graphics,4);for(const [k,n] of Object.entries(c.nature.counts))assert.ok(n<=effectCaps[k]);
  const initial=await program();await page.waitForFunction(initial=>JSON.stringify(__town.scene.children.list.filter(o=>o.name?.startsWith('nature-')).map(o=>[o.name,o.depth,o.commandBuffer]))!==initial,initial,{timeout:16000});
  const before=await counts();await page.keyboard.down('d');await page.waitForTimeout(180);assert.ok(Math.abs(await page.evaluate(()=>__town.scene.player.body.velocity.length())-175)<.01);await page.keyboard.up('d');
  await page.keyboard.press('i');assert.equal(await page.locator('#panel').evaluate(e=>e.open),true);await page.keyboard.down('d');await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>__town.scene.player.body.velocity.length()),0);await page.keyboard.up('d');await page.screenshot({path:dir+'/'+id+'-dialog.png'});await page.keyboard.press('Escape');
  assert.ok(await page.evaluate(()=>{const s=__town.scene;return s.children.list.filter(o=>o.name?.startsWith('nature-')).every(o=>o.depth<999)&&s.children.getByName('nature-ground').depth<s.player.depth;}));
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const still=await program();await page.waitForTimeout(600);assert.equal(await program(),still);await page.screenshot({path:dir+'/'+id+'-reduced.png'});assert.deepEqual(await counts(),before);await page.emulateMedia({reducedMotion:'no-preference'});assert.deepEqual(await state(),progress);
 });
 await check('thirty mixed-region transitions dispose effects and preserve bounded resources',async()=>{
  const cycle=['meadow','town','woods','town','meadow','lake','meadow','ruins','meadow','valley','meadow','town'];for(const id of cycle)await travel(id);
  const seen={};for(const id of [...cycle,...cycle,...cycle.slice(0,6)]){await travel(id);const c=await counts();if(seen[id])assert.deepEqual(c,seen[id]);else seen[id]=c;assert.equal(c.E,1);assert.equal(c.M,1);assert.equal(c.I,1);if(id==='town'||id==='valley')assert.equal(c.nature,null);assert.deepEqual(await state(),progress);}metrics.resources=seen;
 });
 await check('journal and persistent progress remain compatible after environmental changes',async()=>{
  await page.keyboard.press('m');await page.locator('[data-secret="golden"] summary').click();assert.ok((await page.locator('[data-secret="golden"]').innerText()).includes('2 / 5'));await page.keyboard.press('Escape');await page.reload();await page.waitForFunction(()=>window.__town);assert.deepEqual(await state(),progress);
 });
 await check('no browser runtime errors',async()=>assert.deepEqual(errors,[]));
}finally{fs.writeFileSync(dir+'/results.json',JSON.stringify({results,metrics,errors,browser:browser.version()},null,2));await browser.close();}
