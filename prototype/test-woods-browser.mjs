import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {regions,isSafePosition} from './src/regions.js';
import {forestStories as stories} from './src/story-content.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXE?{executablePath:process.env.BROWSER_EXE}:{channel:'msedge'})});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const url=process.env.TOWN_URL||'http://127.0.0.1:4201/Johnny-Town/';
const dir=process.env.FOREST_LOG_DIR||'logs/phase05b-edge';fs.mkdirSync(dir,{recursive:true});
const results=[],errors=[],failed=[],metrics={transitions:[]};let activeCase;
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
const check=async(name,fn)=>{activeCase=name;await fn();results.push({name,pass:true});console.log('PASS',name);activeCase=null;};
const ready=id=>page.waitForFunction(id=>window.__town?.scene?.region?.id===id&&!__town.scene.transitioning&&__town.scene.player?.active,id);
const pos=()=>page.evaluate(()=>({x:__town.scene.player.x,y:__town.scene.player.y}));
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('johnny-town.world.v1')));
const close=async()=>{await page.keyboard.press('Escape');await page.waitForTimeout(100);};
const at=async(x,y)=>{await page.evaluate(({x,y})=>{const s=__town.scene;s.input.keyboard.resetKeys();s.player.body.reset(x,y);},{x,y});await page.waitForTimeout(120);};
// Real DOM keyboard input follows waypoints; physics and collision remain enabled.
async function walkTo(x,y){
 const pressed=new Set(),start=Date.now();
 try{
  while(true){
   const p=await pos(),dx=x-p.x,dy=y-p.y;
   if(Math.abs(dx)<7&&Math.abs(dy)<7)break;
   if(Date.now()-start>6500)throw Error('walk blocked: '+JSON.stringify({target:{x,y},position:p}));
   const wanted=new Set();if(Math.abs(dx)>=7)wanted.add(dx>0?'d':'a');if(Math.abs(dy)>=7)wanted.add(dy>0?'s':'w');
   for(const key of pressed)if(!wanted.has(key)){await page.keyboard.up(key);pressed.delete(key);}
   for(const key of wanted)if(!pressed.has(key)){await page.keyboard.down(key);pressed.add(key);}
   await page.waitForTimeout(35);
  }
 }finally{for(const key of pressed)await page.keyboard.up(key);}
 await page.waitForTimeout(80);
}
async function walk(points){for(const [x,y] of points)await walkTo(x,y);}
async function travel(to){
 const exit=await page.evaluate(to=>__town.scene.region.exits.find(e=>e.to===to),to);
 await at(exit.door.x,exit.door.y);const start=Date.now();await page.keyboard.press('e');await ready(to);
 await page.waitForFunction(()=>!__town.scene.cameras.main.fadeEffect.isRunning);metrics.transitions.push({to,ms:Date.now()-start});
}
const resources=()=>page.evaluate(()=>{const s=__town.scene;return {region:s.region.id,E:s.input.keyboard.listenerCount('keydown-E'),M:s.input.keyboard.listenerCount('keydown-M'),I:s.input.keyboard.listenerCount('keydown-I'),load:s.load.listenerCount('loaderror'),bodies:s.physics.world.bodies.size,staticBodies:s.physics.world.staticBodies.size,colliders:s.physics.world.colliders.getActive().length,children:s.children.length,textures:s.textures.getTextureKeys().length,shutdown:s.events.listenerCount('shutdown')};});
const sample=()=>page.evaluate(()=>new Promise(resolve=>{let frames=0,begin=performance.now();function tick(){if(++frames===120)resolve({raf:120000/(performance.now()-begin),phaser:__town.scene.game.loop.actualFps});else requestAnimationFrame(tick);}requestAnimationFrame(tick);}));
async function story(id){
 const content=stories.find(s=>s.id===id);
 await page.keyboard.press('e');await page.waitForTimeout(220);
 assert.equal(await page.locator('#title').innerText(),content.name);
 assert.ok((await page.locator('#body').innerText()).includes(content.summary));
 assert.equal(await page.locator('#body details').evaluate(e=>e.open),false);
 await page.locator('#body summary').focus();await page.keyboard.press('Enter');
 assert.ok((await page.locator('#body').innerText()).includes(content.detail[1]));
 await page.screenshot({path:dir+'/'+id+'-story.png'});
 const before=await pos();await page.keyboard.down('d');await page.waitForTimeout(100);await page.keyboard.up('d');assert.deepEqual(await pos(),before);
 await close();assert.ok((await state()).stories.includes(id));
}
try{
 await page.goto(url);await ready('town');
 await check('quick introduction is ungated, keyboard/mouse accessible and restores focus',async()=>{
  assert.equal(await page.locator('dialog[open]').count(),0);assert.equal((await state()).stories.length,0);
  await page.locator('#quick-intro').click();await page.waitForTimeout(220);
  assert.equal(await page.locator('#close').evaluate(e=>e===document.activeElement),true);
  // The owner replaced the former short summary with six approved full chapters.
  assert.equal(await page.locator('#portfolio-section option').count(),6);
  for(const [id,title] of [['about','关于我'],['interests','我的兴趣'],['projects','我的作品'],['skills','技能与经历'],['philosophy','我的想法'],['explore','探索我的世界']]){
   await page.locator('#portfolio-section').selectOption(id);assert.equal(await page.locator('#portfolio-heading').innerText(),title);
  }
  await page.locator('#portfolio-section').selectOption('skills');assert.ok((await page.locator('.portfolio-page').innerText()).includes('AI 编程工具'));
  await page.locator('#portfolio-section').selectOption('about');assert.ok((await page.locator('.portfolio-page').innerText()).includes('你好，Traveler！'));
  await page.screenshot({path:dir+'/quick-introduction.png'});
  await close();assert.equal(await page.locator('#quick-intro').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('i');await page.getByRole('button',{name:'返回探索',exact:true}).click();await page.waitForTimeout(100);
  assert.equal(await page.locator('dialog[open]').count(),0);assert.equal((await state()).stories.length,0);
 });
 await check('journal initially shows five mysterious entries without story spoilers',async()=>{
  await page.keyboard.press('m');assert.equal(await page.locator('.journal-locked').count(),13);
  assert.ok((await page.locator('.journal-progress').innerText()).includes('0 / 13'));
  for(const s of stories)assert.ok(!(await page.locator('#body').innerText()).includes(s.summary));await close();
 });
 await check('town northern route enters forest with a safe stable spawn',async()=>{
  await walk([[500,355],[500,200],[500,90]]);await page.keyboard.press('e');await ready('woods');await page.waitForTimeout(400);
  assert.deepEqual(await pos(),{x:160,y:620});await page.screenshot({path:dir+'/forest-entrance.png'});
 });
 await check('all five stories reached along main and branch paths with actual keyboard movement',async()=>{
  await walk([[220,610]]);await story('beginning');
  await walk([[250,590],[320,520],[400,460]]);await story('crossroads');
  // Take the workshop branch first: story order is deliberately not fixed.
  await walk([[460,510],[540,570],[620,610],[720,595]]);await story('workshop');
  await page.screenshot({path:dir+'/workshop-scene.png'});
  await walk([[620,610],[540,570],[460,510],[400,460],[500,420],[590,380],[690,365]]);await story('echoing-tree');
  await page.screenshot({path:dir+'/echoing-tree-scene.png'});
  await walk([[780,290],[840,230],[890,200]]);await story('unwritten');
  await page.screenshot({path:dir+'/unwritten-scene.png'});
  assert.deepEqual((await state()).stories,['beginning','crossroads','workshop','echoing-tree','unwritten']);
 });
 await check('repeat interaction is unique; journal rereads all entries without movement',async()=>{
  await page.keyboard.press('e');await page.waitForTimeout(100);await close();assert.equal((await state()).stories.length,5);
  await page.keyboard.press('m');assert.equal(await page.locator('.journal-locked').count(),8);assert.ok((await page.locator('.journal-progress').innerText()).includes('5 / 13'));
  for(const s of stories){await page.getByText('重读 · '+s.name,{exact:true}).click();assert.ok((await page.locator('#body').innerText()).includes(s.detail[1]));}
  await page.screenshot({path:dir+'/journal-complete.png'});await close();
 });
 await check('refresh restores safe forest entry and unlocked journal',async()=>{
  await page.reload();await ready('woods');assert.deepEqual(await pos(),{x:160,y:620});assert.equal((await state()).stories.length,5);
 });
 await check('optional quiet clearing and return route are reachable without story gates',async()=>{
  await walk([[250,590],[320,520],[250,464],[200,408],[160,352]]);await page.screenshot({path:dir+'/quiet-clearing.png'});
  await walk([[200,408],[250,464],[320,520],[250,590],[160,620],[48,640]]);await page.keyboard.press('e');await ready('town');await page.waitForTimeout(200);
  assert.deepEqual(await pos(),{x:500,y:185});assert.equal((await state()).stories.length,5);
 });
 await check('20 cached transitions preserve listeners, bodies, textures and story progress',async()=>{
  await travel('woods');await travel('town');const town=await resources();
  const cdp=await page.context().newCDPSession(page);await cdp.send('HeapProfiler.collectGarbage');metrics.heapBefore=(await cdp.send('Runtime.getHeapUsage')).usedSize;let woods;
  for(let i=0;i<10;i++){
   await travel('woods');const r=await resources();if(!woods)woods=r;else assert.deepEqual(r,woods);
   assert.equal(r.E,1);assert.equal(r.M,1);assert.equal(r.I,1);assert.equal(r.colliders,1);
   await travel('town');assert.deepEqual(await resources(),town);
  }
  await cdp.send('HeapProfiler.collectGarbage');metrics.heapAfter=(await cdp.send('Runtime.getHeapUsage')).usedSize;metrics.resources={town,woods};
  assert.ok(metrics.heapAfter-metrics.heapBefore<8*1024*1024);await cdp.detach();assert.equal((await state()).stories.length,5);
  await page.locator('#quick-intro').click();assert.equal(await page.locator('dialog[open]').count(),1);await close();
 });
 await check('forest landmark, tree and rock collisions remain solid after transitions',async()=>{
  await travel('woods');
  for(const [x,y,limit] of [[220,610,576],[690,365,316],[720,595,552],[296,380,344]]){
   await at(x,y);await page.keyboard.down('w');await page.waitForTimeout(700);await page.keyboard.up('w');assert.ok((await pos()).y>=limit-.1);
  }
  const tree=regions.woods.trees.find(([x,y])=>isSafePosition(regions.woods,{x,y:y+38}));
  await at(tree[0],tree[1]+38);await page.keyboard.down('w');await page.waitForTimeout(450);await page.keyboard.up('w');assert.ok((await pos()).y>=tree[1]+12-.1);
 });
 await check('camera clamps at all four forest edges without blank space',async()=>{
  const r=regions.woods;
  for(const edge of ['left','right','top','bottom']){
   let point;
   for(let n=32;n<736;n+=8){const p=edge==='left'?{x:24,y:n}:edge==='right'?{x:1000,y:n}:edge==='top'?{x:n,y:32}:{x:n,y:736};if(isSafePosition(r,p)){point=p;break;}}
   assert.ok(point);await at(point.x,point.y);const key={left:'a',right:'d',top:'w',bottom:'s'}[edge];await page.keyboard.down(key);await page.waitForTimeout(180);await page.keyboard.up(key);await page.waitForTimeout(600);
   const c=await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}));assert.ok(c.x>=0&&c.x<=64&&c.y>=0&&c.y<=128);
   assert.equal(edge==='left'||edge==='right'?c.x:c.y,{left:0,right:64,top:0,bottom:128}[edge]);
  }
 });
 await check('reduced motion, resized layouts and keyboard details remain usable',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await at(400,460);await page.keyboard.down('d');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>__town.scene.walker.anims.isPlaying),false);await page.keyboard.up('d');
  await travel('town');assert.equal(await page.evaluate(()=>__town.scene.cameras.main.fadeEffect.isRunning),false);await travel('woods');
  metrics.sizes=[];
  for(const [width,height] of [[1366,768],[1920,1080],[2560,1440],[400,800],[800,450]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(180);const box=await page.locator('canvas').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width);assert.ok(Math.abs(box.width/box.height-1.5)<.005);
   await page.locator('#quick-intro').click();assert.ok(await page.locator('#close').isVisible());await close();
   await page.keyboard.press('m');await page.getByText('重读 · 初始之地',{exact:true}).focus();await page.keyboard.press('Enter');assert.ok((await page.locator('#body').innerText()).includes(stories[0].detail[1]));await close();metrics.sizes.push({width,height,canvas:box});
   if(width===400)await page.screenshot({path:dir+'/narrow-readable.png'});
  }
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
 });
 await check('legacy and corrupted world saves migrate/recover without touching fortune',async()=>{
  const fortune=JSON.stringify({sentinel:'do not rewrite'});
  await page.evaluate(fortune=>{localStorage.setItem('johnny-town.fortune.v1',fortune);localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:1,regionId:'meadow',spawnId:'fromTown',discovered:['town','meadow'],progress:{transitions:9}}));},fortune);
  await page.reload();await ready('meadow');let s=await state();assert.equal(s.version,2);assert.equal(s.progress.transitions,9);assert.deepEqual(s.stories,[]);
  for(const raw of ['{broken','{}',JSON.stringify({version:2,regionId:'woods',spawnId:'missing'})]){
   await page.evaluate(raw=>localStorage.setItem('johnny-town.world.v1',raw),raw);await page.reload();await ready('town');assert.deepEqual((await state()).stories,[]);
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('johnny-town.fortune.v1')),fortune);
 });
 await check('forest performance and production resource isolation',async()=>{
  await travel('woods');metrics.fps=await sample();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const dist=fs.readdirSync('prototype/dist',{recursive:true}).filter(p=>fs.statSync('prototype/dist/'+p).isFile());
  assert.ok(dist.every(p=>!/\.(mp4|webm|mov|mkv)$/i.test(p)));
  for(const file of dist.filter(p=>/\.(js|html|css)$/.test(p)))assert.ok(!/__local-video|LOCAL_VIDEO_FILE|爷自愿的|C:\\Users|C:\/Users/.test(fs.readFileSync('prototype/dist/'+file,'utf8')));
 });
}catch(error){results.push({name:activeCase,pass:false,error:error.message});throw error;}
finally{
 fs.writeFileSync(dir+'/results.json',JSON.stringify({browser:await browser.version(),url,results,metrics,errors,failed},null,2));
 console.log(JSON.stringify({results,metrics,errors,failed},null,2));await browser.close();
}
