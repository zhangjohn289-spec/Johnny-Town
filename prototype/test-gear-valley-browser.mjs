import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=process.env.QA_DIR||'logs/phase07a/final';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true}),results=[],errors=[];
const check=async(name,fn)=>{try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});throw e;}};
try{
 for(const [name,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['mobile',390,844,true],['landscape',844,390,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});
  await context.addInitScript(()=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:'valley',spawnId:'fromMeadow',discovered:['town','meadow','valley'],progress:{transitions:2},stories:[]})));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TOWN_URL||'http://127.0.0.1:4201/Johnny-Town/');await page.waitForFunction(()=>window.__town?.scene.region.id==='valley');
  const at=async(x,y)=>{await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),{x,y});await page.waitForTimeout(550);};
  await check(name+' normal gameplay scene and all five existing interactions',async()=>{
   await at(540,470);await page.screenshot({path:`${dir}/${name}-overview.png`});
   const canvas=await page.locator('canvas').boundingBox();assert.ok(canvas.x>=0&&canvas.y>=0&&canvas.x+canvas.width<=width+1&&canvas.y+canvas.height<=height+1);
   for(const id of ['first-gear','unfinished-ideas','great-transmission','skyward-blueprint','gear-experience']){
    const p=await page.evaluate(id=>__town.scene.region.places.find(p=>p.id===id||p.activityId===id)?.door,id==='gear-experience'?'gears':id);
    assert.ok(p);await at(p.x,p.y);await page.screenshot({path:`${dir}/${name}-${id}.png`});
    await page.keyboard.press('e');await page.waitForTimeout(100);assert.equal(await page.locator('#panel').evaluate(p=>p.open),true);await page.keyboard.press('Escape');
   }
  });
  await check(name+' fixed-position nearest pixel gears animate without sprite wobble',async()=>{
   const sample=()=>page.evaluate(()=>__town.scene.children.list.filter(o=>o.texture?.key?.startsWith('clockwork-')&&o.texture.key!=='clockwork-valley-ground').map(o=>({x:o.x,y:o.y,rotation:o.rotation,frame:o.frame.name,filter:o.texture.source[0].scaleMode})));
   const a=await sample();await page.waitForTimeout(900);const b=await sample();assert.equal(a.length,8);assert.ok(b.some((o,i)=>o.frame!==a[i].frame));
   assert.deepEqual(a.map(({frame,...o})=>o),b.map(({frame,...o})=>o));assert.ok(a.every(o=>o.rotation===0&&o.filter===1));
   const delta=x=>{const i=a.findIndex(o=>o.x===x&&o.y===484);return ((Number(b[i].frame)-Number(a[i].frame)+288)%192)-96;};
   const large=delta(738),medium=delta(780);assert.ok(large>0&&medium<0);assert.ok(Math.abs(large*24+medium*18)<=21);
  });
  await check(name+' reduced motion freezes all mechanical frames and steam',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
   const sample=()=>page.evaluate(()=>__town.scene.children.list.filter(o=>o.texture?.key?.startsWith('clockwork-')).map(o=>o.frame.name));
   const a=await sample();await page.waitForTimeout(400);assert.deepEqual(await sample(),a);
   assert.equal(await page.evaluate(()=>__town.scene.children.list.find(o=>o.type==='Graphics'&&o.depth===890).commandBuffer.length),0);
   await page.emulateMedia({reducedMotion:'no-preference'});
  });
  if(name==='desktop'){
   await at(760,570);
   // Pause scene updates only for deterministic visual inspection of the
   // actual production sprites at six moments of the same mechanism cycle.
   await page.evaluate(()=>__town.scene.scene.pause());
   for(let i=0;i<6;i++){await page.evaluate(t=>__town.scene.ambientUpdate(t),i*800);await page.waitForTimeout(50);await page.screenshot({path:`${dir}/mesh-${i}.png`});}
   await page.evaluate(()=>__town.scene.scene.resume());
  }
  await context.close();
 }
 await check('no browser runtime errors across all views',async()=>assert.deepEqual(errors,[]));
}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify({results,errors,browser:browser.version()},null,2));await browser.close();}
