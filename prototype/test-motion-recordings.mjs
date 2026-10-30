import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='logs/animation-remediation',out=root+'/recording-playback';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[];
try{
 for(const id of ['woods','lake','meadow','ruins']){
  const page=await browser.newPage({viewport:{width:960,height:640}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<style>body{margin:0;background:#000}video{display:block;width:960px;height:640px}</style><video muted playsinline></video>');
  const data=fs.readFileSync(`${root}/accepted-recordings/${id}-desktop/normal.webm`).toString('base64');
  await page.evaluate(async data=>{
   const video=document.querySelector('video');
   video.src=URL.createObjectURL(new Blob([Uint8Array.from(atob(data),c=>c.charCodeAt(0))],{type:'video/webm'}));
   await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(new Error('Recording decode failed'));});
   await video.play();
  },data);
  const frames=[];
  for(const target of [.5,3,6]){
   await page.waitForFunction(t=>document.querySelector('video').currentTime>=t,target);
   frames.push(await page.evaluate(()=>{const v=document.querySelector('video');return {time:v.currentTime,width:v.videoWidth,height:v.videoHeight,decoded:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames};}));
   await page.locator('video').screenshot({path:`${out}/${id}-${target}s.png`});
  }
  assert.ok(frames.every(f=>f.width===960&&f.height===640&&f.decoded>0));
  assert.ok(frames[2].decoded>60,'A recording must contain sustained decoded frames');
  results.push({id,pass:true,frames});console.log('PASS recording playback',id,frames[2]);
  await page.close();
 }
 assert.deepEqual(errors,[]);
}finally{
 fs.writeFileSync(`${out}/results.json`,JSON.stringify({results,errors,browser:browser.version()},null,2));
 await browser.close();
}
