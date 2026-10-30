const fs=require('node:fs');
const {PNG}=require('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const output=new PNG({width:330*3,height:249*2});
for(let i=0;i<6;i++){
 const im=PNG.sync.read(fs.readFileSync(`logs/phase07a/final/mesh-${i}.png`));
 for(let y=0;y<83;y++)for(let x=0;x<110;x++)for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
  const src=((509+y)*im.width+895+x)*4,dst=(((Math.floor(i/3)*249+y*3+dy)*output.width)+(i%3*330+x*3+dx))*4;
  output.data.set(im.data.subarray(src,src+4),dst);
 }
}
fs.writeFileSync('logs/phase07a/mesh-inspection-3x.png',PNG.sync.write(output));
