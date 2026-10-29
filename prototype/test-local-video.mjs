import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage();
const url=process.env.DEV_URL||'http://127.0.0.1:4190/Johnny-Town/',results=[],errors=[];let metadata;
page.on('pageerror',e=>errors.push(e.message));
const check=(name,pass)=>{results.push({name,pass});assert.ok(pass,name);};
try{
 const response=await page.request.get(url+'__local-video',{headers:{Range:'bytes=0-31'}});
 check('dev endpoint streams MP4 byte ranges',response.status()===206&&(await response.body()).length===32&&response.headers()['content-type']==='video/mp4');
 const bad=await page.request.get(url+'__local-video',{headers:{Range:'bytes=999999999-'}});check('invalid seek returns 416',bad.status()===416);
 await page.goto(url);await page.waitForFunction(()=>window.__town?.scene?.player);
 await page.evaluate(()=>__town.scene.player.body.reset(732,520));await page.waitForTimeout(100);await page.keyboard.press('e');
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2,null,{timeout:20000});
 metadata=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,canPlayH264:v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),source:new URL(v.src).pathname}));
 check('browser decodes real video metadata and frames',metadata.duration>0&&metadata.width>0&&metadata.height>0);
 await page.getByRole('button',{name:'手动播放',exact:true}).click();await page.waitForTimeout(900);
 check('video time advances during playback',await page.locator('video').evaluate(v=>v.currentTime>.3&&!v.paused));
 const paused=await page.locator('video').evaluate(v=>{v.pause();return v.currentTime;});await page.waitForTimeout(250);
 check('pause stops playback clock',Math.abs(await page.locator('video').evaluate(v=>v.currentTime)-paused)<.05);
 await page.locator('video').evaluate(v=>{window.__closedVideo=v;v.currentTime=Math.min(30,v.duration/2);});
 await page.getByRole('button',{name:'手动播放',exact:true}).click();await page.waitForTimeout(500);
 check('seek and resume play',await page.locator('video').evaluate(v=>!v.paused&&v.currentTime>1));
 await page.keyboard.press('Escape');await page.waitForTimeout(200);
 check('Esc removes source and stops original video element',await page.evaluate(()=>!document.querySelector('video')&&__closedVideo.paused&&!__closedVideo.hasAttribute('src')));
 await page.keyboard.down('d');await page.waitForTimeout(100);check('keyboard resumes after video close',await page.evaluate(()=>__town.scene.player.body.velocity.length()===175));await page.keyboard.up('d');
 // Real network failure exercises error UI, without removing or changing the original file.
 await page.route('**/__local-video',route=>route.abort('failed'));
 await page.evaluate(()=>__town.scene.player.body.reset(732,520));await page.waitForTimeout(100);await page.keyboard.press('e');
 await page.waitForFunction(()=>document.querySelector('#body')?.textContent.includes('视频加载失败'),null,{timeout:2000}).catch(async error=>{console.log('ERROR UI:',await page.locator('#body').innerText());throw error;});
 check('load failure is explained',true);await page.keyboard.press('Escape');
 const prod=await page.request.get((process.env.TOWN_URL||'http://127.0.0.1:4191/Johnny-Town/')+'__local-video');
 check('production preview has no video streaming route',prod.headers()['content-type']!=='video/mp4');
 const files=fs.readdirSync('prototype/dist',{recursive:true}).filter(x=>fs.statSync('prototype/dist/'+x).isFile());
 check('production excludes media files and private endpoint or path',files.every(f=>!/\.(mp4|webm|mov|mkv)$/i.test(f))&&files.filter(f=>/\.(js|html|css)$/.test(f)).every(f=>!/__local-video|LOCAL_VIDEO_FILE|爷自愿的|C:\\Users|C:\/Users/.test(fs.readFileSync('prototype/dist/'+f,'utf8'))));
 check('no JavaScript exceptions',errors.length===0);
}finally{
 fs.writeFileSync((process.env.TEST_LOG_DIR||'logs')+'/phase05a-video-results.json',JSON.stringify({results,metadata,errors,browser:await browser.version()},null,2));console.log(JSON.stringify({results,metadata,errors},null,2));await browser.close();
}
