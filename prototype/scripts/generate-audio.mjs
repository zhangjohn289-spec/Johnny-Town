// Offline preparation only. Sources, hashes and licenses: public/audio/README.md.
// Uses installed Playwright via PLAYWRIGHT_MODULE; no runtime dependency added.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const input=path.resolve(process.argv[2]||'prototype/tmp/audio-sources');
const output=new URL('../public/audio/',import.meta.url);fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage(),sources={};
 for(const [name,file] of Object.entries({water:'water.bin',forest:'forest.ogg'})){
  sources[name]=await page.evaluate(async b64=>{
   const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
   const ctx=new OfflineAudioContext(1,1,22050),decoded=await ctx.decodeAudioData(bytes.buffer);
   const render=new OfflineAudioContext(1,Math.ceil(decoded.duration*22050),22050);
   const source=render.createBufferSource();source.buffer=decoded;source.connect(render.destination);source.start();
   return Array.from((await render.startRendering()).getChannelData(0));
  },fs.readFileSync(path.join(input,file)).toString('base64'));
 }
 const rate=22050,TAU=Math.PI*2;
 // Low-pass / DC rejection, peak-normalized source preparation; no clipping.
 function soften(a,cutoff=2500){let low=0,dc=0;const c=1-Math.exp(-TAU*cutoff/rate);const out=a.map(v=>{low+=c*(v-low);dc+=.002*(low-dc);return low-dc;});const peak=out.reduce((m,v)=>Math.max(m,Math.abs(v)),.001);return out.map(v=>v/peak);}
 const forest=soften(sources.forest,4800),water=soften(sources.water,3100);
 // Retain sparse foreground woodland calls, not the recording's windy bed.
 // Two gentle high-pass stages reject low-frequency air movement. A smooth
 // foreground expander silences the remaining continuous bed between calls.
 function woodland(a){
  const c=1-Math.exp(-TAU*1100/rate);let low1=0,low2=0;
  const filtered=a.map(v=>{low1+=c*(v-low1);const high=v-low1;low2+=c*(high-low2);return high-low2;});
  const size=441,levels=[];
  for(let i=0;i<filtered.length;i+=size){let energy=0;for(let j=i;j<Math.min(i+size,filtered.length);j++)energy+=filtered[j]**2;levels.push(Math.sqrt(energy/size));}
  const sorted=[...levels].sort((a,b)=>a-b),threshold=sorted[Math.floor(sorted.length*.65)]*1.8;
  let gain=0;const result=filtered.map((v,i)=>{const target=Math.min(1,Math.max(0,(levels[Math.floor(i/size)]-threshold)/Math.max(.00001,threshold)));gain+=(target-gain)*(target>gain?.003:.0003);return v*gain;});
  console.log('woodland foreground threshold',threshold.toFixed(6),'active frames',levels.filter(v=>v>threshold).length+'/'+levels.length);
  return result;
 }
 // Overlap the ends of a longer source section to avoid a reset/click at wrap.
 function loop(a,seconds,offset=0){
  const n=seconds*rate,cross=Math.min(2*rate,Math.floor(a.length/4));
  // Short wave recordings must also join smoothly *inside* the longer loop.
  if(a.length<n+cross){const period=a.length-cross,b=a.slice(0,period);for(let i=0;i<cross;i++){const t=i/cross;b[i]=a[period+i]*(1-t)+b[i]*t;}a=Array.from({length:n+cross+1},(_,i)=>b[i%period]);}
  const start=Math.floor(offset*rate)%Math.max(1,a.length-n-cross),o=Array.from({length:n},(_,i)=>a[start+i]);
  for(let i=0;i<cross;i++){const t=i/cross;o[i]=a[start+n+i]*(1-t)+o[i]*t;}return o;
 }
 const trees=loop(woodland(forest),18,30),waterLoop=loop(water,18);
 let seed=719;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296*2-1;};
 function write(name,a){const peak=a.reduce((m,v)=>Math.max(m,Math.abs(v)),0);if(peak>.95)throw Error('clipping '+name);const b=Buffer.alloc(44+a.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);a.forEach((v,i)=>b.writeInt16LE(Math.round(v*32767),44+2*i));fs.writeFileSync(new URL(name+'.wav',output),b);console.log(name,`${(a.length/rate).toFixed(2)}s`,b.length,'peak',peak.toFixed(4));}
 for(const id of ['woods','lake','valley']){
  const a=trees.map((bird,i)=>{const t=i/rate;
   if(id==='woods')return bird*.32;
   if(id==='lake')return waterLoop[i]*.24;
   const phase=t%1.5,tick=phase<.13?Math.sin(TAU*710*phase)*Math.exp(-phase*55)*.035:0;
   return Math.sin(TAU*72*t)*.021*(.8+.2*Math.sin(TAU*t/3))+tick;
  });write(id,a);
 }
 // Original short, warm UI family. Smooth attack/release; no sampled music.
 for(const [name,hz,duration] of [['open',440,.12],['close',330,.10],['confirm',660,.22],['fortune',880,.38]]){
  const a=Array.from({length:Math.ceil(duration*rate)},(_,i)=>{const t=i/rate,envelope=Math.min(1,t/.008)*Math.pow(1-t/duration,2);return envelope*(Math.sin(TAU*hz*t)*.14+Math.sin(TAU*hz*2*t)*.025+(name==='fortune'?random()*.018*Math.exp(-t*30):0));});write(name,a);
 }
}finally{await browser.close();}
