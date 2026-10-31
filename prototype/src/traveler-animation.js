export const WALK_POSES=12;
export const WALK_BLOCK=1+WALK_POSES*3;
export function visualFacing(previous,x,y){
 if(!x&&!y)return previous;
 const ax=Math.abs(x),ay=Math.abs(y);
 // Retain the current axis near 45 degrees instead of flipping with joystick
 // floating-point noise. This affects artwork only, never movement vectors.
 const horizontal=ax>ay+.15||(Math.abs(ax-ay)<=.15&&previous>=2);
 return horizontal?(x<0?2:3):(y<0?1:0);
}
export function poseFrame(facing,pose,blend){
 if(blend<1/6)return facing*WALK_BLOCK;
 const level=blend<.5?2:blend<5/6?1:0;
 return facing*WALK_BLOCK+1+level*WALK_POSES+pose;
}
export function resetWalk(scene){
 scene.walker.stop().setFrame(scene.facing*WALK_BLOCK);
 scene.walkVisual={time:scene.time?.now??0,blend:0,pose:0};
}
export function animateTraveler(scene,time,x,y){
 const s=scene.walkVisual??={time,blend:0,pose:0},dt=Math.max(0,Math.min(100,time-s.time));s.time=time;
 const moving=!!(x||y);scene.facing=visualFacing(scene.facing,x,y);
 if(scene.reduced){scene.walker.stop().setFrame(scene.facing*WALK_BLOCK);s.blend=0;return;}
 if(moving){
  const key='walk-'+scene.facing,anims=scene.walker.anims;
  if(!anims.isPlaying||anims.currentAnim?.key!==key){
   const progress=anims.currentFrame?anims.getProgress():0;
   scene.walker.play(key,true);anims.setProgress(progress);
  }
  s.pose=(anims.currentFrame?.index??1)-1;s.blend=Math.min(1,s.blend+dt/100);
 }else{scene.walker.stop();s.blend=Math.max(0,s.blend-dt/100);}
 // Phaser owns the time-based cycle. The atlas's lower-amplitude versions
 // blend starts/stops without alpha blur or moving the torso/physics body.
 scene.walker.setFrame(poseFrame(scene.facing,s.pose,s.blend));
}
