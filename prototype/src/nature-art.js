// Original integer-pixel leaf masses: broad shade groups, sparse edge detail.
const box=(g,c,x,y,w,h)=>g.fillStyle(c).fillRect(Math.round(x),Math.round(y),w,h);
function oval(g,c,x,y,w,h){
 for(let row=0;row<h;row+=2){const q=(row+1-h/2)/(h/2),half=Math.sqrt(Math.max(0,1-q*q))*w/2;
  const left=Math.ceil((x+w/2-half)/2)*2,right=Math.floor((x+w/2+half)/2)*2;box(g,c,left,y+row,Math.max(2,right-left),2);
 }
}
export function leafMass(g,x,y,w,h,seed=0){
 const p=seed%2?[0x294b3a,0x3b6245,0x52794e,0x709256,0x98aa69]:[0x284b3b,0x376044,0x4b754d,0x668c54,0x91a569];
 // Overlapping lobes create a broken leafy edge, rather than a round coin.
 for(const [dx,dy,sw,sh] of [[0,.28,.56,.66],[.44,.22,.56,.70],[.17,0,.64,.74]])oval(g,p[0],x+w*dx,y+h*dy,w*sw,h*sh);
 for(const [dx,dy,sw,sh] of [[.04,.30,.51,.55],[.47,.26,.48,.56],[.21,.03,.56,.60],[.16,.25,.62,.58]]){
  const a=x+Math.round(w*dx),b=y+Math.round(h*dy),cw=Math.round(w*sw),ch=Math.round(h*sh);
  oval(g,p[1],a,b,cw,ch);oval(g,p[2],a+1,b,Math.max(5,cw-3),Math.max(4,ch-5));oval(g,p[3],a+3,b+1,Math.max(5,cw-12),Math.max(4,ch*.32));
 }
 // A handful of leaf-shaped highlights, not checkerboard noise.
 for(let i=0;i<Math.floor(w/7);i++){
  const a=x+8+(i*17+seed*3)%Math.max(1,w-18),b=y+7+(i*11+seed)%Math.max(1,Math.floor(h*.48));
  box(g,i%3?p[3]:p[4],a,b,4+i%3,2);if(i%3===0)box(g,p[4],a+2,b-1,2,1);
 }
}
export function ensureForestTrees(scene){
 for(let variant=0;variant<4;variant++){
  const key='nature-forest-tree-'+variant;if(scene.textures.exists(key))continue;
  const g=scene.make.graphics({add:false});
  box(g,0x2e4534,18,94,48,7);box(g,0x4c4131,33,54,14,44);box(g,0x8b724b,36,57,5,38);box(g,0xb09a64,36,77,2,12);
  box(g,0x4c4131,26,66,13,4);box(g,0x6b593c,28,64,9,3);box(g,0x3a5038,28,95,8,4);box(g,0x3a5038,45,95,10,4);
  if(variant===2){
   for(let i=0;i<4;i++){const w=22+i*14,top=2+i*15,h=25;for(let row=0;row<h;row+=2){const span=2+Math.floor(w*(row+2)/h/2)*2,left=40-span/2;box(g,0x294c3c,left,top+row,span,2);if(span>6)box(g,row>h-6?0x35573e:0x496f4b,left+2,top+row,span-4,2);if(row<15&&span>8)box(g,0x718e54,left+2,top+row,Math.max(2,Math.floor(span*.3)),1);}}
  }else{leafMass(g,variant===3?10:variant?3:7,variant===1?10:3,variant===3?60:variant?74:65,variant===1?56:65,variant+3);}
  g.generateTexture(key,80,104);g.destroy();scene.textures.get(key).setFilter(1);
 }
}
