export function stickVector(dx,dy){const length=Math.hypot(dx,dy);if(length<8)return {x:0,y:0};return {x:dx/length,y:dy/length};}
export function movementVector(x,y){const length=Math.max(1,Math.hypot(x,y));return {x:x/length,y:y/length};}
export function bindTouchControls(scene){
 const stick=document.querySelector('#stick'),knob=document.querySelector('#stick-knob'),action=document.querySelector('#touch-interact');
 const listeners=[];let pointer=null;
 scene.touch={x:0,y:0};
 const listen=(node,name,fn)=>{node.addEventListener(name,fn);listeners.push(()=>node.removeEventListener(name,fn));};
 const reset=()=>{pointer=null;scene.touch={x:0,y:0};knob.style.transform='translate(0,0)';};
 scene.resetTouch=reset;
 const move=e=>{if(e.pointerId!==pointer)return;e.preventDefault();const b=stick.getBoundingClientRect(),dx=e.clientX-b.x-b.width/2,dy=e.clientY-b.y-b.height/2;scene.touch=stickVector(dx,dy);const r=Math.min(28,Math.hypot(dx,dy));knob.style.transform=`translate(${scene.touch.x*r}px,${scene.touch.y*r}px)`;};
 listen(stick,'pointerdown',e=>{if(pointer!==null||scene.interacting)return;e.preventDefault();pointer=e.pointerId;stick.setPointerCapture(pointer);move(e);});
 listen(stick,'pointermove',move);
 for(const event of ['pointerup','pointercancel','lostpointercapture'])listen(stick,event,e=>{if(e.pointerId===pointer)reset();});
 listen(action,'click',()=>scene.interact());
 const clear=()=>{reset();scene.input.keyboard.resetKeys();scene.player.body.setVelocity(0);};
 listen(window,'blur',clear);listen(window,'pagehide',clear);listen(document,'visibilitychange',()=>{if(document.hidden)clear();});listen(window,'resize',clear);
 scene.events.once('shutdown',()=>{reset();listeners.forEach(dispose=>dispose());});
}
