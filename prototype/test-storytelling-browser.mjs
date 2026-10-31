import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {npcs} from './src/npc-data.js';import {npcNarratives,narrativeStart} from './src/npc-stories.js';import {regions} from './src/regions.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=process.env.QA_DIR||'logs/p7d/storytelling';fs.mkdirSync(dir,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[];
const variants={clerk:[{goldenTrial:{stage:5}},{discovered:['town','woods','meadow','lake']}],apprentice:[{activities:{gears:true}},{secrets:{found:['flight']}}],explorer:[{activities:{rhythm:true}},{discovered:['town','lake']}],archivist:[{stories:['beginning','crossroads','echoing-tree','workshop','unwritten']},{stories:['echoing-tree']}]};
try{for(const [view,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['landscape',844,390,true],['portrait',390,844,true]]){
 if(process.env.P7D_VIEWS&&!process.env.P7D_VIEWS.split(',').includes(view))continue;
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const n of npcs)for(const [i,progress] of [{},...variants[n.dialogueId]].entries()){
  await page.goto('http://127.0.0.1:4501/Johnny-Town/');await page.waitForFunction(()=>window.__town);
  await page.evaluate(({n,progress,spawn})=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:n.region,spawnId:spawn,discovered:['town',n.region],progress:{transitions:1},...progress})),{n,progress,spawn:regions[n.region].defaultSpawn});await page.reload();await page.waitForFunction(id=>window.__town?.scene.region.id===id,n.region);await page.evaluate(n=>__town.scene.player.body.reset(n.position.x,n.position.y+24),n);await page.waitForTimeout(400);
  const saved=await page.evaluate(()=>localStorage.getItem('johnny-town.world.v1'));
  for(const repeat of [false,true]){
   if(touch)await page.locator('#touch-interact').tap();else await page.keyboard.press('e');await page.waitForSelector('#panel[open]');
   const expected=narrativeStart(n.dialogueId,{progress,repeat}).lines;for(let j=0;j<expected.length;j++){assert.equal(await page.locator('.story-lead').innerText(),expected[j]);if(!repeat)await page.waitForTimeout(400);if(!repeat)await page.screenshot({path:dir+'/'+n.id+'-'+view+'-'+i+'-greeting-'+j+'.png'});if(j<expected.length-1)await page.getByRole('button',{name:'继续',exact:true}).click();}
   await page.getByRole('button',{name:npcNarratives[n.dialogueId].topics[1][0],exact:true}).click();await page.getByRole('button',{name:'继续',exact:true}).click();
   const panel=await page.locator('#panel').boundingBox();assert.ok(panel.y>=0&&panel.y+panel.height<=height+1);if(!repeat)await page.waitForTimeout(400);if(!repeat)await page.screenshot({path:`${dir}/${n.id}-${view}-${i}.png`});
   if(touch)await page.locator('#close').tap();else await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.world.v1')),saved);assert.equal(await page.evaluate(()=>__town.scene.player.body.velocity.length()),0);
  }results.push({npc:n.id,view,variant:i,pass:true});console.log('PASS',n.id,view,i);
 }await context.close();
}assert.deepEqual(errors,[]);}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify({results,errors},null,2));await browser.close();}
