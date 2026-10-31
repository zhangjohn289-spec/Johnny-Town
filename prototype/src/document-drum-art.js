// Static pixel silhouettes; no gameplay state, textures or update hooks.
export function drawDrum(g,x,y){
 const b=(c,a,d,w,h)=>g.fillStyle(c).fillRect(x+a,y+d,w,h);
 const ink=0x344b49,metal=0x8eaaa2,shine=0xd1d4b2;
 // One central metal stand with splayed tripod feet, never table legs.
 b(ink,22,22,5,17);b(metal,23,24,2,13);
 for(let i=0;i<5;i++){b(ink,22-i*3,35+i,4,2);b(ink,25+i*3,35+i,4,2);}
 b(metal,11,38,11,2);b(metal,27,38,11,2);b(ink,23,36,4,7);
 // Stepped cylindrical shell and curved lower hoop.
 b(ink,1,3,46,21);b(ink,5,24,38,4);b(0x744947,4,5,40,18);
 b(0xa86153,6,7,12,16);b(0x8e514b,18,7,16,17);b(0x5e4140,35,6,9,16);
 b(metal,4,21,40,3);b(shine,9,24,30,2);
 for(const a of [7,19,34]){b(ink,a,9,4,14);b(metal,a+1,9,2,13);b(shine,a,12,4,3);}
 b(ink,43,13,6,7);b(metal,45,13,3,5);
 // Pixel ellipse: dark hoop, inner metal rim and warm skin.
 for(const [a,d,w,h] of [[9,-5,30,2],[4,-3,40,3],[0,0,48,8],[4,8,40,3],[9,11,30,2]])b(ink,a,d,w,h);
 for(const [a,d,w,h] of [[10,-3,28,2],[5,-1,38,3],[3,2,42,5],[6,7,36,2],[11,9,26,2]])b(metal,a,d,w,h);
 for(const [a,d,w,h] of [[12,-1,24,2],[7,1,34,5],[12,6,24,2]])b(0xe4d6aa,a,d,w,h);
 b(0xf0e4bd,12,1,22,2);b(0xc3b38d,14,6,20,1);
 // Two resting sticks use only the upper portion of the playing surface.
 for(let i=0;i<6;i++){b(0x9b784c,10+i*3,-4+i,4,2);b(0xcbb080,12+i*3,-4+i,3,1);}
}
export function drawManuscript(g,x,y){
 const b=(c,a,d,w,h)=>g.fillStyle(c).fillRect(x+a,y+d,w,h);
 // Compact broken stone lectern below a dominant open-book silhouette.
 b(0x354c41,3,29,52,12);b(0x76836e,8,26,42,12);b(0xa2aa8c,10,26,37,3);
 b(0x526652,23,6,13,23);b(0x8b957a,24,8,7,19);b(0x536851,31,20,2,7);b(0x718653,7,35,12,4);
 // Leather cover and layered irregular parchment edges.
 b(0x4b4134,-2,-19,60,29);b(0x826647,0,-19,56,26);b(0xafa17b,1,6,25,3);b(0xafa17b,31,6,25,3);
 b(0xd3c49a,0,-22,24,27);b(0xd3c49a,32,-22,24,27);b(0xd3c49a,4,-25,16,4);b(0xd3c49a,36,-25,16,4);
 b(0xe0d2aa,3,-21,19,24);b(0xe0d2aa,34,-21,19,24);b(0xe0d2aa,7,-24,11,3);b(0xe0d2aa,38,-24,11,3);
 b(0xb2a17a,23,-20,4,26);b(0x756749,27,-18,2,25);b(0xb2a17a,29,-20,4,26);
 b(0xe8d9b2,4,-21,14,2);b(0xe8d9b2,37,-21,14,2);
 // Uneven handwritten strokes, no microtext or new story.
 for(const [a,d,w] of [[7,-15,10],[6,-10,13],[8,-5,9],[7,0,12],[37,-15,8],[36,-10,13],[38,-5,10],[36,0,11]])b(0x786b52,a,d,w,1);
 b(0x625b47,7,-17,5,2);b(0xab956e,1,-17,3,4);b(0xab956e,51,1,5,3);
 // A loose page emerges beneath the book, reinforcing the endless manuscript.
 b(0xb6a880,39,10,16,7);b(0xd8cba4,40,10,14,5);b(0x81745a,43,12,7,1);
}
