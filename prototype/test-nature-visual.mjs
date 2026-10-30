import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {regions} from './src/regions.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const pass=process.env.CAPTURE_PASS||'accepted',dir=process.env.QA_DIR||`logs/phase07c-r1/${pass}`,url=process.env.TOWN_URL||'http://127.0.0.1:4401/Johnny-Town/';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],metrics={},errors=[];
const points={woods:{x:500,y:420},lake:{x:550,y:500},meadow:{x:500,y:400},ruins:{x:660,y:440}};
const geometry=Object.fromEntries(Object.entries(regions).map(([id,r])=>[id,createHash('sha256').update(JSON.stringify(r)).digest('hex')]));
try{
 for(const [name,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['landscape',844,390,true],['portrait',390,844,true]]){
  if(process.env.CAPTURE_VIEW&&process.env.CAPTURE_VIEW!==name)continue;
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});
  const page=await context.newPage();await page.emulateMedia({reducedMotion:'no-preference'});page.on('pageerror',e=>errors.push(e.message));
  for(const id of Object.keys(points)){
   if(process.env.CAPTURE_REGION&&process.env.CAPTURE_REGION!==id)continue;
   await page.goto(url);await page.waitForFunction(()=>window.__town);
   await page.evaluate(({id,spawn})=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:id,spawnId:spawn,discovered:['town',id],progress:{transitions:1},goldenTrial:{stage:0}})),{id,spawn:regions[id].defaultSpawn});
   await page.reload();await page.waitForFunction(id=>window.__town?.scene.region.id===id,id);
   await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),points[id]);await page.waitForTimeout(750);
   const canvas=await page.locator('canvas').boundingBox();assert.ok(canvas.x>=0&&canvas.y>=0&&canvas.x+canvas.width<=width+1&&canvas.y+canvas.height<=height+1);
   await page.screenshot({path:`${dir}/${id}-${name}.png`});
   if(name==='desktop'){
    metrics[id]=await page.evaluate(()=>new Promise(resolve=>{const times=[];let previous=performance.now();const sample=now=>{times.push(now-previous);previous=now;if(times.length<120)requestAnimationFrame(sample);else{const s=__town.scene,sorted=times.slice(1).sort((a,b)=>a-b);resolve({fps:s.game.loop.actualFps,frameMedian:sorted[Math.floor(sorted.length*.5)],frameP95:sorted[Math.floor(sorted.length*.95)],heap:performance.memory?.usedJSHeapSize,children:s.children.length,textures:s.textures.getTextureKeys().length,bodies:s.physics.world.bodies.size,static:s.physics.world.staticBodies.size,E:s.input.keyboard.listenerCount('keydown-E'),ambient:s.natureEffects?.describe?.()||null});}};requestAnimationFrame(sample);}));
    if(pass!=='before')for(let i=0;i<3;i++){await page.waitForTimeout(700);await page.screenshot({path:`${dir}/${id}-motion-${i}.png`});}
   }
   results.push({name:`${id} ${name} rendered at gameplay scale`,pass:true});console.log('PASS',id,name);
  }await context.close();
 }
 assert.deepEqual(errors,[]);
}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify({results,geometry,metrics,errors,browser:browser.version()},null,2));await browser.close();}
