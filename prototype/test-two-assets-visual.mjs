import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const pass=process.env.ART_PASS||'before',dir=`logs/patch02a/${pass}`;fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const targets=[['drum','lake',344,568],['manuscript','ruins',180,640]];
const results=[];
try{for(const [view,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['landscape',844,390,true],['portrait',390,844,true]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});const page=await context.newPage();await page.emulateMedia({reducedMotion:'reduce'});
 for(const [id,region,x,y] of targets){await page.goto(process.env.TOWN_URL||'http://127.0.0.1:4501/Johnny-Town/');await page.waitForFunction(()=>window.__town);await page.evaluate(region=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:region,spawnId:'fromMeadow',discovered:['town',region],progress:{transitions:1}})),region);await page.reload();await page.waitForFunction(region=>window.__town?.scene.region.id===region,region);await page.evaluate(({x,y})=>__town.scene.player.body.reset(x,y),{x,y});await page.waitForTimeout(1600);await page.screenshot({path:`${dir}/${id}-${view}.png`});results.push({id,view,camera:await page.evaluate(()=>({x:__town.scene.cameras.main.scrollX,y:__town.scene.cameras.main.scrollY}))});}
 await context.close();
}}finally{fs.writeFileSync(`${dir}/results.json`,JSON.stringify(results,null,2));await browser.close();}
