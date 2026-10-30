// Original pixel gears. Frames bake world-space lighting into integer pixels;
// sprites never rotate, avoiding shimmering outlines from GPU texture rotation.
export const GEAR_FRAMES=192;
export const GEAR_SPECS={small:{teeth:12,pitch:12},medium:{teeth:18,pitch:18},large:{teeth:24,pitch:24}};
const metal=[[55,37,29],[100,62,37],[153,99,48],[198,145,67],[235,189,105],[255,223,150]];
export function meshPhase(a,b,axis=0,phase=0){return axis+Math.PI-(Math.PI-a*(axis-phase))/b;}
export function gearAngle(time,teeth,phase=0,direction=1){return phase+time*.00024*24/teeth*direction;}
export function frameAt(angle){return ((Math.round(angle/(Math.PI*2)*GEAR_FRAMES)%GEAR_FRAMES)+GEAR_FRAMES)%GEAR_FRAMES;}
export function gearPixels(teeth,angle){
 const pitch=teeth,size=(pitch+6)*2,c=size/2,pixels=new Uint8ClampedArray(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const dx=x+.5-c,dy=y+.5-c,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx),local=a-angle;
  const t=((local*teeth/(2*Math.PI)%1)+1)%1,q=Math.abs(t-.5)*2;
  // Flat root, sloping flanks, flat tooth tip: one continuous cut profile.
  const outer=pitch-2+(q<.32?0:q>.68?3.6:(q-.32)/.36*3.6);
  if(r>outer)continue;
  const hub=pitch*.23,inner=pitch*.63,rim=pitch-3.1;
  const spoke=Math.abs(Math.sin(local*(teeth===12?2:3)))*r<1.55;
  if(r>hub+1.1&&r<inner&&!spoke)continue;
  let level=3;
  if(outer-r<1.1||r<1.6)level=0;
  else if(r<hub){level=r>hub-1.1?0:r<hub-2.4?2:4;}
  else if(r<inner+1&&r>inner-1&&!spoke)level=0;
  else if(r>rim&&r<rim+1.1)level=1;
  else{
   const light=(-dx*.6-dy*.8)/Math.max(r,1);
   level=light>.42?4:light<-.35?2:3;
   if(outer-r<2.2)level=light>0?5:1;
   if(r>hub&&r<hub+1.5)level=5;
   if(r>inner+1&&r<inner+2)level=light>0?5:1;
  }
  const color=metal[level],i=(y*size+x)*4;
  pixels.set([...color,255],i);
 }
 return {size,pixels};
}
export function ensureGearArt(scene){
 for(const [name,{teeth}] of Object.entries(GEAR_SPECS)){
  const key='clockwork-'+name;if(scene.textures.exists(key))continue;
  const size=(teeth+6)*2,texture=scene.textures.createCanvas(key,size*16,size*12),ctx=texture.context;
  for(let i=0;i<GEAR_FRAMES;i++){
   const {pixels}=gearPixels(teeth,i/GEAR_FRAMES*Math.PI*2);
   const data=ctx.createImageData(size,size);data.data.set(pixels);
   ctx.putImageData(data,(i%16)*size,Math.floor(i/16)*size);
   texture.add(i,0,(i%16)*size,Math.floor(i/16)*size,size,size);
  }
  texture.refresh();texture.setFilter(1); // Phaser.Textures.FilterMode.NEAREST
 }
}
