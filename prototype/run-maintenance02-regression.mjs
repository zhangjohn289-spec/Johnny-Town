import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const results=[];for(const [name,file] of [['world','world-browser'],['mobile','mobile-browser'],['speed','movement-speed'],['reading','welcome-replay-patch']]){
 const dir=`logs/post-p7-maintenance02/regression/${name}`;fs.mkdirSync(dir,{recursive:true});
 const r=spawnSync(process.execPath,[...(name==='reading'?[]:['--import','./prototype/test-returning-visitor.mjs']),`prototype/test-${file}.mjs`],{encoding:'utf8',env:{...process.env,QA_DIR:dir,TEST_LOG_DIR:dir,TOWN_URL:'http://127.0.0.1:4501/Johnny-Town/'},timeout:300000});
 fs.writeFileSync(`${dir}/console.txt`,(r.stdout||'')+(r.stderr||''));results.push({suite:name,exit:r.status,error:r.error?.message});fs.writeFileSync('logs/post-p7-maintenance02/regression/summary.json',JSON.stringify(results,null,2));console.log(name,r.status);
}if(results.some(r=>r.exit!==0))process.exitCode=1;
