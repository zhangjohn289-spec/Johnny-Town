import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
import {regions} from './src/regions.js';import {naturePlan} from './src/nature-config.js';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),{PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const pass=process.env.MOTION_PASS||'accepted-final',root=`logs/animation-remediation/${pass}`,url=process.env.TOWN_URL||'http://127.0.0.1:4501/Johnny-Town/';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[];
const points={woods:{x:500,y:420},lake:{x:550,y:500},meadow:{x:500,y:400},ruins:{x:660,y:440}};
if(process.env.MOTION_SITE==='entry')points.woods={x:160,y:620};
const viewports=[['desktop',1440,1000,false],['tablet',1024,768,true],['landscape',844,390,true],['portrait',390,844,true]];
function rois(id,camera,canvas){const p=naturePlan(regions[id]),source=id==='woods'?p.canopy:id==='lake'?p.ripples:id==='meadow'?p.grass:p.dust;
 const size=id==='woods'?{dx:-8,dy:-12,w:52,h:40}:id==='lake'?{dx:-35,dy:-12,w:70,h:38}:id==='meadow'?{dx:-12,dy:-30,w:48,h:42}:{dx:-10,dy:-36,w:48,h:54};
 return source.map((p,i)=>{const px=Math.round(canvas.x+(p.x+size.dx-camera.x)*canvas.width/camera.width),py=Math.round(canvas.y+(p.y+size.dy-camera.y)*canvas.height/camera.height),w=Math.round(size.w*canvas.width/camera.width),h=Math.round(size.h*canvas.height/camera.height),x=Math.max(Math.ceil(canvas.x),px),y=Math.max(Math.ceil(canvas.y),py),right=Math.min(Math.floor(canvas.x+canvas.width),px+w),bottom=Math.min(Math.floor(canvas.y+canvas.height),py+h);return {i,world:p,x,y,w:right-x,h:bottom-y};}).filter(r=>r.w>=6&&r.h>=6);
}
function difference(a,b,r){let changed=0,salient=0;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const i=(y*a.width+x)*4,d=Math.max(Math.abs(a.data[i]-b.data[i]),Math.abs(a.data[i+1]-b.data[i+1]),Math.abs(a.data[i+2]-b.data[i+2]));if(d>3)changed++;if(d>=24)salient++;}return {changed,salient};}
try{for(const [view,width,height,touch] of viewports){
 if(process.env.MOTION_VIEWS&&!process.env.MOTION_VIEWS.split(',').includes(view))continue;
 for(const id of Object.keys(points)){
  if(process.env.MOTION_REGIONS&&!process.env.MOTION_REGIONS.split(',').includes(id))continue;
  const dir=`${root}/${id}-${view}`;fs.mkdirSync(dir,{recursive:true});const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});
  await context.addInitScript(({id,spawn,origin})=>{if(location.origin===origin)localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:id,spawnId:spawn,discovered:['town',id],progress:{transitions:1},goldenTrial:{stage:0}}));},{id,spawn:regions[id].defaultSpawn,origin:new URL(url).origin});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(id=>window.__town?.scene.region.id===id,id);
  const inherited=await page.evaluate(()=>({media:matchMedia('(prefers-reduced-motion: reduce)').matches,scene:__town.scene.reduced}));await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!__town.scene.reduced);const normal=await page.evaluate(()=>({media:matchMedia('(prefers-reduced-motion: reduce)').matches,scene:__town.scene.reduced}));assert.deepEqual(normal,{media:false,scene:false});
  await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),points[id]);await page.waitForTimeout(2200);
  const position=()=>page.evaluate(()=>{const s=__town.scene,c=s.cameras.main;return {player:{x:s.player.x,y:s.player.y},camera:{x:c.scrollX,y:c.scrollY,width:c.width,height:c.height},time:s.time.now};});
  const start=await position(),canvas=await page.locator('canvas').boundingBox(),areas=rois(id,start.camera,canvas),images=[],frames=[];
  if(view==='desktop')await page.evaluate(()=>{const stream=document.querySelector('canvas').captureStream(30),chunks=[],rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8',videoBitsPerSecond:8000000});window.__motionRecording=new Promise(resolve=>{rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())));};});rec.start();setTimeout(()=>rec.stop(),8000);});
  for(let i=0;i<9;i++){if(i)await page.waitForTimeout(500);const state=await position();assert.equal(state.player.x,start.player.x);assert.equal(state.player.y,start.player.y);assert.ok(Math.abs(state.camera.x-start.camera.x)<.01&&Math.abs(state.camera.y-start.camera.y)<.01);const bytes=await page.screenshot({path:`${dir}/frame-${i}.png`});images.push(PNG.sync.read(bytes));frames.push({i,milliseconds:state.time-start.time});}
  const comparisons=areas.map(r=>({...r,changes:images.slice(1).map((im,i)=>({...difference(images[i],im,r),milliseconds:frames[i+1].milliseconds})),fromFirst:images.slice(1).map((im,i)=>({...difference(images[0],im,r),milliseconds:frames[i+1].milliseconds}))}));
  // Native-size crops supplement full-frame pictures; no enlargement is used.
  const best=[...comparisons].sort((a,b)=>Math.max(...b.fromFirst.map(v=>v.salient))-Math.max(...a.fromFirst.map(v=>v.salient)))[0];
  if(best){const r={x:Math.max(Math.round(canvas.x),best.x-50),y:Math.max(Math.round(canvas.y),best.y-35),w:Math.min(200,Math.round(canvas.width)-1),h:Math.min(130,Math.round(canvas.height)-1)},sheet=new PNG({width:r.w*3,height:r.h});r.x=Math.min(r.x,images[0].width-r.w);r.y=Math.min(r.y,images[0].height-r.h);for(const [panel,frame] of [0,4,8].entries())for(let y=0;y<r.h;y++){const from=((r.y+y)*images[frame].width+r.x)*4,to=(y*sheet.width+panel*r.w)*4;images[frame].data.copy(sheet.data,to,from,from+r.w*4);}fs.writeFileSync(`${dir}/native-roi-sequence.png`,PNG.sync.write(sheet));}
  if(view==='desktop'){const video=await page.evaluate(()=>window.__motionRecording);fs.writeFileSync(`${dir}/normal.webm`,Buffer.from(video));}
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>__town.scene.reduced);await page.waitForTimeout(100);const reduced=[];for(let i=0;i<3;i++){if(i)await page.waitForTimeout(500);reduced.push(PNG.sync.read(await page.screenshot({path:`${dir}/reduced-${i}.png`})) );}
  const reducedDiff=areas.map(r=>({i:r.i,...difference(reduced[0],reduced[2],r)}));
  const threshold=id==='ruins'?(touch?2:4):touch?(id==='woods'?14:12):(id==='woods'?60:50),required=id==='woods'?3:id==='ruins'?1:2,visibleChanges=comparisons.filter(r=>r.fromFirst.some(v=>v.milliseconds<=5000&&v.salient>=threshold)).length;
  const reducedMode=await page.evaluate(()=>({media:matchMedia('(prefers-reduced-motion: reduce)').matches,scene:__town.scene.reduced}));assert.deepEqual(reducedMode,{media:true,scene:true});
  const row={id,view,inherited,normal,stationary:true,camera:start.camera,canvas,frames,rois:comparisons,gates:{threshold,required,visibleChanges},reduced:{...reducedMode,differences:reducedDiff}};fs.writeFileSync(`${dir}/analysis.json`,JSON.stringify(row,null,2));results.push(row);console.log(id,view,'visible ROIs',areas.length,'salient max',Math.max(0,...comparisons.flatMap(r=>r.fromFirst.map(v=>v.salient))));
  if(pass.startsWith('accepted')){assert.ok(visibleChanges>=required,`${id}/${view}: insufficient local motion within five seconds (${visibleChanges}/${required})`);assert.ok(reducedDiff.every(r=>r.changed===0),'Reduced-motion ROIs must stay static');}
  await context.close();
 }
}assert.deepEqual(errors,[]);}finally{fs.writeFileSync(`${root}/results.json`,JSON.stringify({results,errors,browser:browser.version()},null,2));await browser.close();}
