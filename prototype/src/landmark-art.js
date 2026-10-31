// Static local Graphics commands only. World data and interaction anchors are
// owned by the existing regions; this module never changes them.
export function landmark(g,id,x,y){
 const b=(c,a,d,w,h)=>g.fillStyle(c).fillRect(x+a,y+d,w,h);
 const ink=0x34463e,shade=0x667668,stone=0x929b84,edge=0xb7b79a,wood=0x78583e,brass=0xbb9959,paper=0xd8c99d;
 if(id==='logs'){
  b(ink,-3,28,62,13);b(shade,0,25,56,12);b(edge,3,25,48,3);
  b(ink,2,-26,52,53);b(wood,5,-23,46,47);b(0xaa8760,7,-23,42,4);
  for(let i=0;i<3;i++){const a=9+i*2,d=-16+i*12;b(0x514b39,a,d+7,37,5);b(paper,a,d,35,8);b(0xf0dfb3,a+2,d,31,2);b(0x9d916e,a+26,d+3,6,1);}
  for(const a of [14,38]){b(0x594333,a,-20,5,43);b(brass,a,-20,2,41);}
  b(0x704636,23,-2,13,12);b(0xaa5444,25,-1,9,8);b(0xe0ab6f,28,1,3,3);
  b(0x667d50,0,26,13,4);b(0x7d915b,3,24,7,3);
 }else if(id==='flight'){
  // Top-down biplane: tapered fuselage, broad fabric wings, tail and propeller.
  b(ink,-15,27,86,7);b(0x544a38,18,-30,22,66);b(wood,21,-27,16,60);
  b(0xa98c5d,-15,-7,86,17);b(ink,-16,8,88,3);b(0xd0b77f,-12,-7,80,3);
  for(const a of [-9,3,15,38,50,62]){b(0x876947,a,-4,2,11);b(0xe0ca95,a+2,-3,7,1);}
  b(0x8d6b43,22,7,14,24);b(brass,24,8,3,23);b(0x3c5553,24,-1,11,12);b(0x8ca79a,26,0,7,2);
  b(ink,22,-24,15,13);b(brass,24,-23,11,11);b(0xe0c58a,26,-22,6,3);
  b(ink,27,-38,4,19);b(0xbfa779,8,-33,43,4);b(0xead19a,9,-33,17,1);b(0x665b43,29,-32,20,2);
  b(0xbba271,9,27,40,8);b(0xe0c78c,12,27,33,2);b(0x54746f,27,25,6,13);
  for(const a of [-5,56]){b(ink,a,4,3,21);b(brass,a+1,6,1,15);}b(0x41473d,19,31,5,6);b(0x41473d,38,31,5,6);
 }else if(id==='rhythm-stones'){
  // The existing story explicitly describes four stones, not a single altar.
  for(let i=0;i<4;i++){const a=i*20,h=[27,35,30,23][i];b(ink,a,17,19,9);b(shade,a+1,13,17,9);b(ink,a+2,18-h,15,h);b(stone,a+4,15-h,12,h);b(edge,a+5,15-h,9,3);b(shade,a+13,20-h,3,h-5);b(0x526c5d,a+7,23-h,2,8);b(0xc1ba8e,a+8,24-h,2,5);b(0x718454,a+1,19,8,3);}
 }else if(id==='conductors-lantern'){
  b(ink,-5,27,35,10);b(shade,-2,24,29,9);b(edge,1,24,23,2);b(ink,7,-37,10,63);b(wood,9,-35,6,60);b(brass,10,-34,2,57);
  b(brass,12,-62,3,25);b(brass,14,-63,14,3);b(0xe0c785,17,-62,7,1);b(brass,26,-61,3,12);
  b(ink,12,-51,31,5);b(ink,17,-56,21,6);b(brass,19,-55,17,3);b(ink,14,-46,27,25);b(0xb08c51,16,-44,23,21);b(0xf0d18a,19,-42,17,16);b(0xffe9ad,22,-40,9,12);b(brass,26,-43,2,19);b(ink,12,-24,31,4);b(brass,20,-20,15,3);
  b(brass,1,-20,8,3);b(brass,1,-23,2,4);b(0xe0c785,-1,-27,4,5);
 }else if(id==='lake-stage'){
  b(ink,0,5,130,45);b(wood,2,2,126,40);b(0xc0a276,3,0,124,4);
  for(let a=4;a<126;a+=10){b(0xa78960,a,5,8,30);b(0xd1b684,a,5,7,1);b(0x886a4d,a+2,22,4,1);}
  b(0x513f30,2,37,126,10);b(0xba905e,4,37,122,3);for(const a of [8,119]){b(ink,a,40,5,10);b(brass,a+1,41,2,2);}
  for(let k=0;k<3;k++){b(0x624e39,35-k*8,48+k*9,60+k*16,9);b(0xbca174,35-k*8,48+k*9,60+k*16,3);}
  for(const a of [2,122]){b(ink,a,-40,7,43);b(wood,a+1,-38,5,40);b(brass,a+1,-40,5,3);}
  b(wood,5,-40,120,6);b(0xc29e67,7,-40,116,2);
  for(const a of [10,110]){b(0x8b5554,a,-33,12,24);b(0xb57969,a,-33,3,21);b(brass,a,-12,12,3);}
  b(ink,64,-17,3,35);b(ink,55,17,21,3);b(0xb8c1a6,64,-17,6,3);b(wood,95,0,15,22);b(0xd2b88a,96,0,13,3);
 }else if(id==='fragments'){
  for(const [a,d,w,h] of [[0,3,17,17],[22,-2,22,24],[49,5,16,14],[70,0,21,20],[94,7,18,13]]){b(ink,a,d+3,w,h);b(shade,a+2,d,w-3,h);b(stone,a+3,d-3,w-6,8);b(edge,a+4,d-3,w-9,2);b(0x4e6354,a+8,d+4,2,7);b(0x4e6354,a+10,d+10,4,1);b(0x6e8455,a,d+h-1,8,3);}
 }
}
