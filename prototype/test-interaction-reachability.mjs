import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {inventory,included,approaches} from './reachability-test-helper.mjs';import {regions,isSafePosition} from './src/regions.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const pass=process.env.REACH_PASS||'before',dir=`logs/p7e-no2/${pass}`;fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/inventory.json`,JSON.stringify(inventory,null,2));
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[];
try{for(const input of ['keyboard','touch'])for(const region of Object.values(regions)){
 const context=await browser.newContext({viewport:input==='touch'?{width:844,height:390}:{width:1440,height:1000},hasTouch:input==='touch',isMobile:input==='touch',deviceScaleFactor:input==='touch'?2:1,reducedMotion:'reduce'});
 await context.addInitScript(({id,spawn})=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:id,spawnId:spawn,discovered:['town',id],progress:{transitions:0},stories:[]})),{id:region.id,spawn:region.defaultSpawn});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.TOWN_URL||'http://127.0.0.1:4501/Johnny-Town/');await page.waitForFunction(id=>window.__town?.scene.region.id===id,region.id);const cdp=await context.newCDPSession(page);
 const objects=included.filter(p=>p.region===region.id).sort((a,b)=>Number(['chest','safe-chest','golden'].includes(b.id)||b.kind==='npc')-Number(['chest','safe-chest','golden'].includes(a.id)||a.kind==='npc'));
 for(const object of objects)for(const a of approaches(object)){
  const record={region:region.id,id:object.id,input,direction:a.direction,position:a.position,reachable:a.reachable,reason:a.reason,route:a.path,setup:'reposition to verified connected walkable candidate; real movement pulse then normal E/tap'};
  if(!a.reachable){record.result='inaccessible';results.push(record);continue;}
  const start={x:a.position.x-12,y:a.position.y};if(!isSafePosition(region,start))start.x=a.position.x;
  record.movementStart=start;
  await page.evaluate(p=>{const s=__town.scene;s.player.body.reset(p.x,p.y);document.querySelector('#game').focus();},start);
  // A short real physics movement pulse at every sampled candidate, followed by
  // validation of the actual final body and its route from the region spawn.
  if(input==='touch'){const box=await page.locator('#stick').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:box.x+box.width/2+25,y:box.y+box.height/2}]});await page.waitForTimeout(35);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await page.keyboard.down('d');await page.waitForTimeout(35);await page.keyboard.up('d');}await page.waitForTimeout(70);
  const sample=await page.evaluate(()=>({position:{x:__town.scene.player.x,y:__town.scene.player.y},target:__town.scene.target?.id,prompt:document.querySelector('#hint').textContent}));
  record.actualPosition=sample.position;record.actualTarget=sample.target??null;record.prompt=sample.prompt;
  assert.ok(isSafePosition(region,sample.position),JSON.stringify(record));
  // Reachability uses the original collision geometry, not interaction radius.
  const {route}=await import('./route-test-helper.mjs');record.finalRoute=route(region.id,region.spawns[region.defaultSpawn],sample.position);
  if(sample.target!==object.id){record.result='target-mismatch';if(['north','west'].includes(a.direction))await page.screenshot({path:`${dir}/${input}-${object.id}-${a.direction}.png`});results.push(record);continue;}
  if(input==='touch')await page.locator('#touch-interact').tap();else await page.keyboard.press('e');
  await page.waitForSelector('#panel[open]');record.title=await page.locator('#title').textContent();record.result=record.title===object.name?'pass':'wrong-dialog';assert.equal(record.result,'pass');
  if(a.direction==='north'||a.direction==='legacy-anchor')await page.screenshot({path:`${dir}/${input}-${object.id}-${a.direction}.png`});
  if(input==='touch')await page.locator('#close').tap();else await page.keyboard.press('Escape');await page.waitForTimeout(30);results.push(record);
 }
 await context.close();console.log(pass,input,region.id,'done');
}assert.deepEqual(errors,[]);if(pass!=='before')assert.equal(results.filter(r=>r.result==='target-mismatch').length,0);
}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify({results,errors},null,2));console.log('summary',results.reduce((a,r)=>(a[r.result]=(a[r.result]||0)+1,a),{}));await browser.close();}
