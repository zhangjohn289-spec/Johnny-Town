const fs=require('node:fs'),assert=require('node:assert/strict');
const {PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const root='logs/animation-remediation',rows=[];
function diff(a,b,r){let count=0;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const n=(y*a.width+x)*4;if(Math.max(Math.abs(a.data[n]-b.data[n]),Math.abs(a.data[n+1]-b.data[n+1]),Math.abs(a.data[n+2]-b.data[n+2]))>=24)count++;}return count;}
for(const view of ['desktop','portrait'])for(const id of ['woods','lake','meadow','ruins']){
 const paths=['before','accepted-final'].map(pass=>`${root}/${pass}/${id}-${view}`),data=paths.map(p=>JSON.parse(fs.readFileSync(p+'/analysis.json')));
 assert.deepEqual(data[0].camera,data[1].camera);assert.deepEqual(data[0].canvas,data[1].canvas);
 const frames=paths.map(p=>Array.from({length:9},(_,i)=>PNG.sync.read(fs.readFileSync(p+`/frame-${i}.png`))));
 const values=frames.map((images,pass)=>data[1].rois.map(r=>({i:r.i,maxSalientWithin5Seconds:Math.max(0,...images.slice(1).map((im,i)=>data[pass].frames[i+1].milliseconds<=5000?diff(images[0],im,r):0))})));
 rows.push({id,view,method:'Same projected ROI rectangles and stationary view in both runs; threshold 24 RGB levels; before/after each compared against its own first frame.',camera:data[1].camera,threshold:data[1].gates.threshold,before:values[0],after:values[1]});
}
fs.writeFileSync(root+'/same-roi-comparison.json',JSON.stringify(rows,null,2));
for(const row of rows)console.log(row.id,row.view,Math.max(...row.before.map(v=>v.maxSalientWithin5Seconds)),'->',Math.max(...row.after.map(v=>v.maxSalientWithin5Seconds)));
