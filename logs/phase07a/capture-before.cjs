const {chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),pass=process.env.PASS||'before';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[];
 try{for(const [name,width,height,touch] of [['desktop',1440,1000,false],['tablet',1024,768,true],['mobile',390,844,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});
  await context.addInitScript(()=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:'valley',spawnId:'fromMeadow',discovered:['town','meadow','valley'],progress:{transitions:2},stories:[]})));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4202/Johnny-Town/');
  await page.waitForFunction(()=>window.__town?.scene.region.id==='valley');
  await page.evaluate(()=>__town.scene.player.body.reset(540,470));await page.waitForTimeout(600);
  await page.screenshot({path:`logs/phase07a/${pass}-${name}.png`});
  results.push({name,width,height,errors,scene:await page.evaluate(()=>{const s=__town.scene;return {region:s.region,canvas:{width:s.game.canvas.width,height:s.game.canvas.height},children:s.children.length,textures:s.textures.getTextureKeys().length};})});
  await context.close();
 }}finally{fs.writeFileSync(`logs/phase07a/${pass}.json`,JSON.stringify({browser:browser.version(),results},null,2));await browser.close();}
})();
