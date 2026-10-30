import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
import {lessons} from './src/golden-trial.js';import {normalizeWorld} from './src/world-store.js';import {regions,isSafePosition} from './src/regions.js';import {route} from './route-test-helper.mjs';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),dir=process.env.QA_DIR||'logs/phase07b/accepted',url=process.env.TOWN_URL||'http://127.0.0.1:4301/Johnny-Town/';fs.mkdirSync(dir,{recursive:true});
const results=[],errors=[],metrics={};
const check=async(name,fn)=>{try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});throw e;}};
const fixture={version:2,regionId:'ruins',spawnId:'fromMeadow',discovered:['town','meadow','ruins'],progress:{transitions:8},stories:['beginning'],activities:{rhythm:true,gears:true},secrets:{found:['clock'],golden:false,waited:true}};
const sequence=['golden','rune-0','rune-1','rune-2','golden'];
const ready=(page,id='ruins')=>page.waitForFunction(id=>window.__town?.scene.region.id===id&&!__town.scene.transitioning,id);
const state=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('johnny-town.world.v1')));
const at=async(page,p)=>{await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),p);await page.waitForTimeout(180);};
const close=async page=>{await page.keyboard.press('Escape');await page.waitForTimeout(80);};
const door=id=>regions.ruins.places.find(p=>p.id===id).door;
async function load(page,value){await page.goto(url);await page.waitForFunction(()=>window.__town);await page.evaluate(value=>{localStorage.removeItem('johnny-town.world.v1');if(value!==null)localStorage.setItem('johnny-town.world.v1',typeof value==='string'?value:JSON.stringify(value));localStorage.setItem('johnny-town.fortune.v1','keep fortune');},value);await page.reload();await ready(page,value===null?'town':typeof value==='string'?'town':'ruins');}
async function walk(page,target){
 const pos=()=>page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y}));
 for(const dest of route('ruins',await pos(),target).slice(1)){
  const start=Date.now(),keys=new Set();try{while(true){const p=await pos(),dx=dest.x-p.x,dy=dest.y-p.y;if(Math.abs(dx)<5&&Math.abs(dy)<5)break;if(Date.now()-start>6000)throw Error('Blocked path '+JSON.stringify({dest,p}));const wanted=new Set();if(Math.abs(dx)>=5)wanted.add(dx>0?'d':'a');if(Math.abs(dy)>=5)wanted.add(dy>0?'s':'w');for(const k of keys)if(!wanted.has(k)){await page.keyboard.up(k);keys.delete(k);}for(const k of wanted)if(!keys.has(k)){await page.keyboard.down(k);keys.add(k);}await page.waitForTimeout(25);}}finally{for(const k of keys)await page.keyboard.up(k);}
 }await page.waitForTimeout(150);
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 const fixtures=[['fresh',null],['old-P6',fixture],['P7A-achievements',{...fixture,secrets:{...fixture.secrets,found:['clock','golden']}}],...Array.from({length:5},(_,i)=>['lesson-'+(i+1),{...fixture,goldenTrial:{stage:i+1}}]),['legacy-completed',{...fixture,secrets:{...fixture.secrets,found:['clock','golden'],golden:true}}],['malformed-trial',{...fixture,goldenTrial:{stage:'4'}}],['partial-trial',{...fixture,goldenTrial:{}}],['corrupt','{broken']];
 for(const [name,value] of fixtures)await check('browser save fixture '+name,async()=>{
  await load(page,value);assert.deepEqual(await state(page),normalizeWorld(typeof value==='string'?null:value));assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),'keep fortune');
  if((await state(page)).goldenTrial.stage>0){const before=await state(page);await page.keyboard.press('m');assert.equal(await page.locator('[data-secret="golden"]').count(),1);await close(page);assert.deepEqual(await state(page),before);}
 });
 await load(page,fixture);
 await check('dormant stone reached by movement cannot skip central start',async()=>{await walk(page,door('rune-2'));await page.keyboard.press('e');assert.equal((await state(page)).goldenTrial.stage,0);assert.ok((await page.locator('#body').innerText()).includes('未醒'));await close(page);await walk(page,door('golden'));await page.screenshot({path:dir+'/desktop-dormant.png'});});
 for(const [i,id] of sequence.entries())await check('desktop physically walks lesson '+(i+1)+' and saves before close',async()=>{
  await walk(page,door(id));if(i===1)await page.screenshot({path:dir+'/desktop-awakened.png'});
  await page.keyboard.press('e');assert.equal(await page.locator('.lesson-line').innerText(),lessons[i]);assert.equal((await state(page)).goldenTrial.stage,i+1);assert.equal((await state(page)).secrets.golden,i===4);
  await page.screenshot({path:dir+`/desktop-lesson-${i+1}.png`});
  const position=await page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y}));await page.keyboard.down('d');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>__town.scene.player.body.velocity.length()),0);await page.keyboard.up('d');await page.keyboard.press('e');assert.deepEqual(await page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y})),position);assert.equal((await state(page)).goldenTrial.stage,i+1);
  await page.locator('#body summary').first().click();assert.ok((await page.locator('#body').innerText()).includes('石')||(await page.locator('#body').innerText()).includes('回声'));await close(page);
  if(i===1)await page.screenshot({path:dir+'/desktop-completed-rune.png'});
  if(i===4){
   const timestamp=await page.evaluate(()=>__town.scene.goldenCompletionAt);assert.equal(typeof timestamp,'number');await page.waitForTimeout(180);
   assert.ok(await page.evaluate(()=>__town.scene.children.getByName('trial-light').commandBuffer.length>0));await page.screenshot({path:dir+'/desktop-completion-animation.png'});
   await page.keyboard.press('e');await close(page);assert.equal(await page.evaluate(()=>__town.scene.goldenCompletionAt),timestamp);
   await page.waitForTimeout(2300);assert.equal(await page.evaluate(()=>__town.scene.children.getByName('trial-light').commandBuffer.length),0);
  }
  if(i===1){for(const to of ['meadow','ruins']){const e=await page.evaluate(to=>__town.scene.region.exits.find(e=>e.to===to),to);await at(page,e.door);await page.keyboard.press('e');await ready(page,to);await page.waitForTimeout(180);}assert.equal((await state(page)).goldenTrial.stage,2);}
  await page.reload();await ready(page);assert.equal((await state(page)).goldenTrial.stage,i+1);
 });
 await at(page,door('golden'));await page.waitForTimeout(550);await page.screenshot({path:dir+'/desktop-completed-central.png'});
 await check('completed peripheral stones reread their exact lessons without resetting progress',async()=>{const before=await state(page);for(let i=0;i<3;i++){await at(page,door('rune-'+i));assert.ok((await page.locator('#hint').innerText()).includes('重读'));await page.keyboard.press('e');assert.equal(await page.locator('.lesson-line').innerText(),lessons[i+1]);await close(page);}assert.deepEqual(await state(page),before);});
 await check('single journal entry rereads all five exact lessons without new progress',async()=>{
  await page.keyboard.press('m');assert.equal(await page.locator('[data-secret="golden"]').count(),1);await page.locator('[data-secret="golden"] summary').click();for(const text of lessons)assert.ok((await page.locator('[data-secret="golden"]').innerText()).includes(text));await page.locator('[data-secret="golden"]').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/desktop-journal.png'});await close(page);
 });
 const cdp=await page.context().newCDPSession(page);
 async function nativeListeners(){const counts={};for(const expression of ['window','document','document.querySelector("#touch-interact")']){const {result}=await cdp.send('Runtime.evaluate',{expression});const {listeners}=await cdp.send('DOMDebugger.getEventListeners',{objectId:result.objectId});counts[expression]=listeners.map(l=>l.type+':'+l.useCapture).sort();}return counts;}
 const counts=()=>page.evaluate(()=>{const s=__town.scene;return {E:s.input.keyboard.listenerCount('keydown-E'),M:s.input.keyboard.listenerCount('keydown-M'),I:s.input.keyboard.listenerCount('keydown-I'),children:s.children.length,textures:s.textures.getTextureKeys().length,bodies:s.physics.world.bodies.size,static:s.physics.world.staticBodies.size,colliders:s.physics.world.colliders.getActive().length};});
 await check('twenty rereads preserve completion and native input listener counts',async()=>{await at(page,door('golden'));const before=await state(page),listeners=await nativeListeners(),resources=await counts();for(let i=0;i<20;i++){await page.keyboard.press('e');assert.equal(await page.locator('.lesson-line').innerText(),lessons[4]);await close(page);}assert.deepEqual(await state(page),before);assert.deepEqual(await nativeListeners(),listeners);assert.deepEqual(await counts(),resources);});
 const travel=async to=>{const e=await page.evaluate(to=>__town.scene.region.exits.find(e=>e.to===to),to);await at(page,e.door);await page.keyboard.press('e');await ready(page,to);await page.waitForTimeout(170);};
 await check('twenty region transitions keep trial progress and resources bounded',async()=>{
  await travel('meadow');await travel('ruins');const seen={};const listeners=await nativeListeners();
  for(let i=0;i<10;i++)for(const id of ['meadow','ruins']){await travel(id);const c=await counts();if(seen[id])assert.deepEqual(c,seen[id]);else seen[id]=c;assert.equal(c.E,1);assert.equal(c.M,1);assert.equal(c.I,1);assert.equal((await state(page)).goldenTrial.stage,5);}
  assert.deepEqual(await nativeListeners(),listeners);metrics.resources=seen;
 });
 await check('persistent final art reduced-motion and completion replay stay stable',async()=>{
  await at(page,door('golden'));await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>__town.scene.children.getByName('trial-light').commandBuffer.length),0);await page.screenshot({path:dir+'/desktop-reduced.png'});
  await page.keyboard.press('e');assert.equal(await page.locator('.lesson-line').innerText(),lessons[4]);assert.equal(await page.evaluate(()=>__town.scene.goldenCompletionAt),null);await close(page);await page.emulateMedia({reducedMotion:'no-preference'});metrics.fps=await page.evaluate(()=>__town.scene.game.loop.actualFps);
 });
 await page.close();
 for(const [name,width,height] of [['mobile',390,844],['landscape',844,390],['tablet',768,1024]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true});page.on('pageerror',e=>errors.push(e.message));await load(page,fixture);const cdp=await page.context().newCDPSession(page);
  const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
  await check(name+' real browser touch approaches and completes every lesson',async()=>{
   for(const [i,id] of sequence.entries()){
    const d=door(id),start={x:d.x,y:d.y+30};assert.ok(isSafePosition(regions.ruins,start));await at(page,start);
    const stick=await page.locator('#stick').boundingBox(),x=stick.x+stick.width/2,y=stick.y+stick.height/2;
    await touch('touchStart',[{id:1,x,y}]);await touch('touchMove',[{id:1,x,y:y-26}]);await page.waitForTimeout(100);await touch('touchEnd',[]);await page.waitForTimeout(80);
    assert.ok(await page.evaluate(start=>__town.scene.player.y<start.y-5,start));
    if(name==='tablet'&&i===4)await page.emulateMedia({reducedMotion:'reduce'});
    const action=await page.locator('#touch-interact').boundingBox();await page.locator('#touch-interact').tap();assert.equal(await page.locator('.lesson-line').innerText(),lessons[i]);assert.equal((await state(page)).goldenTrial.stage,i+1);
    const panel=await page.locator('#panel').boundingBox();assert.ok(panel.x>=0&&panel.y>=0&&panel.y+panel.height<=height+1);
    const p=await page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y}));
    await touch('touchStart',[{id:2,x:action.x+action.width/2,y:action.y+action.height/2}]);await touch('touchEnd',[]);await page.waitForTimeout(100);assert.equal((await state(page)).goldenTrial.stage,i+1);assert.deepEqual(await page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y})),p);
    await page.locator('#body summary').first().tap();await page.locator('#body details').first().locator('p').scrollIntoViewIfNeeded();assert.equal(await page.locator('#body details').first().evaluate(e=>e.open),true);
    const clue=await page.locator('#body details').first().locator('p').boundingBox(),closeButton=await page.locator('#close').boundingBox();assert.ok(clue.y+clue.height<=closeButton.y+1,'clue must not overlap close button');
    if(i===0||i===4)await page.screenshot({path:dir+`/${name}-clue-${i+1}.png`});
    await page.screenshot({path:dir+`/${name}-lesson-${i+1}.png`});await page.locator('#close').tap();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>__town.scene.player.body.velocity.length()),0);assert.equal(await page.locator('.golden-panel').count(),0);
    if(name==='tablet'&&i===4){assert.equal(await page.evaluate(()=>__town.scene.goldenCompletionAt),null);assert.equal(await page.evaluate(()=>__town.scene.children.getByName('trial-light').commandBuffer.length),0);}
    if(i===1)await page.screenshot({path:dir+`/${name}-completed-rune.png`});
   }
  });
  await check(name+' completion scene journal refresh and touch recovery',async()=>{
   await page.screenshot({path:dir+`/${name}-completed-central.png`});await page.locator('#world-map').tap();await page.locator('[data-secret="golden"] summary').tap();assert.ok((await page.locator('[data-secret="golden"]').innerText()).includes(lessons[4]));await page.locator('[data-secret="golden"]').scrollIntoViewIfNeeded();await page.screenshot({path:dir+`/${name}-journal.png`});await page.locator('#close').tap();await page.reload();await ready(page);assert.equal((await state(page)).goldenTrial.stage,5);
   const s=await page.locator('#stick').boundingBox(),x=s.x+s.width/2,y=s.y+s.height/2,p=await page.evaluate(()=>__town.scene.player.x);await touch('touchStart',[{id:3,x,y}]);await touch('touchMove',[{id:3,x:x+24,y}]);await page.waitForTimeout(120);await touch('touchEnd',[]);assert.ok(await page.evaluate(p=>__town.scene.player.x>p+5,p));
  });await page.close();
 }
 await check('no browser runtime errors',async()=>assert.deepEqual(errors,[]));
}finally{fs.writeFileSync(dir+'/results.json',JSON.stringify({results,metrics,errors,browser:browser.version()},null,2));await browser.close();}
