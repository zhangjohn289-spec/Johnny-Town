const {chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),pass=process.env.PASS||'before';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [name,width,height,touch] of [['desktop',1440,1000,false],['mobile',390,844,true]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch});
  await page.goto('http://127.0.0.1:4301/Johnny-Town/');await page.waitForFunction(()=>window.__town);
  await page.evaluate(()=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:'ruins',spawnId:'fromMeadow',discovered:['town','ruins'],progress:{transitions:1}})));
  await page.reload();await page.waitForFunction(()=>window.__town?.scene.region.id==='ruins');
  await page.evaluate(()=>__town.scene.player.body.reset(660,440));await page.waitForTimeout(650);
  await page.screenshot({path:`logs/phase07b/${pass}-${name}.png`});
  if(!touch&&pass==='before')fs.writeFileSync('logs/phase07b/baseline-map.json',JSON.stringify(await page.evaluate(()=>__town.scene.region),null,2));
  await page.close();
 }
}finally{await browser.close();}})();
