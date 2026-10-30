const {chromium}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:1440,height:1000}}),samples=[];try{
 await p.goto('http://127.0.0.1:4301/Johnny-Town/');await p.waitForFunction(()=>window.__town);
 await p.evaluate(()=>localStorage.setItem('johnny-town.world.v1',JSON.stringify({version:2,regionId:'ruins',spawnId:'fromMeadow',discovered:['town','ruins'],progress:{transitions:1},goldenTrial:{stage:4},secrets:{found:['golden'],golden:false,waited:false}})));
 await p.reload();await p.waitForFunction(()=>window.__town?.scene.region.id==='ruins');await p.evaluate(()=>__town.scene.player.body.reset(660,440));await p.waitForTimeout(650);
 await p.screenshot({path:'logs/phase07b/return-awakened-central.png'});await p.keyboard.press('e');await p.waitForTimeout(100);await p.keyboard.press('Escape');let last=0;
 for(const time of [150,700,1400,2600]){await p.waitForTimeout(time-last);last=time;await p.screenshot({path:`logs/phase07b/completion-${time}.png`});samples.push(await p.evaluate(()=>({time:__town.scene.time.now-__town.scene.goldenCompletionAt,commands:__town.scene.children.getByName('trial-light').commandBuffer.length,stage:__town.scene.goldenStage})));}
 fs.writeFileSync('logs/phase07b/animation-samples.json',JSON.stringify(samples,null,2));
}finally{await b.close();}})();
