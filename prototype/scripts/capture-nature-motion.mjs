import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';import {regions} from '../src/regions.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),dir=path.resolve('logs/phase07c-r1/motion');fs.mkdirSync(dir,{recursive:true});
const points={woods:{x:500,y:420},lake:{x:550,y:500},meadow:{x:500,y:400},ruins:{x:660,y:440}},files=[];
try{for(const [id,p] of Object.entries(points)){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(({id,spawn})=>{if(location.origin==='http://127.0.0.1:4401')localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:id,spawnId:spawn,discovered:['town',id],progress:{transitions:1}}));},{id,spawn:regions[id].defaultSpawn});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4401/Johnny-Town/');await page.waitForFunction(id=>window.__town?.scene.region.id===id,id);await page.evaluate(p=>__town.scene.player.body.reset(p.x,p.y),p);await page.waitForTimeout(800);
 // Record the actual game canvas with the browser's built-in encoder. No
 // external ffmpeg installation, synthetic time or gameplay hook is needed.
 const video=await page.evaluate(()=>new Promise((resolve,reject)=>{
  const canvas=document.querySelector('canvas'),mimeType='video/webm;codecs=vp8';
  if(!globalThis.MediaRecorder||!canvas.captureStream||!MediaRecorder.isTypeSupported(mimeType)){reject(Error('Canvas recording unsupported'));return;}
  const stream=canvas.captureStream(30),chunks=[],recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:600000});
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>{stream.getTracks().forEach(t=>t.stop());reject(Error('Browser recording failed'));};
  recorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());resolve({bytes:Array.from(new Uint8Array(await new Blob(chunks,{type:mimeType}).arrayBuffer())),width:canvas.width,height:canvas.height});};
  recorder.start();setTimeout(()=>recorder.stop(),16000);
 }));
 const target=path.join(dir,id+'.webm');fs.writeFileSync(target,Buffer.from(video.bytes));await context.close();files.push({id,file:target,bytes:fs.statSync(target).size,width:video.width,height:video.height,requestedSeconds:16});console.log('Recorded',id);
}}finally{fs.writeFileSync(path.join(dir,'recordings.json'),JSON.stringify(files,null,2));await browser.close();}
