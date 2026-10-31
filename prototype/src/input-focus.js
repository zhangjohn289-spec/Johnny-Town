export function uiHasFocus(doc=globalThis.document){
 return !!doc?.activeElement?.closest?.('button,a,input,select,textarea,summary,[contenteditable]:not([contenteditable="false"]),[role="button"]');
}
// HTML controls own their keys; focusable world surface restores game control.
// Event-driven and scene-owned, not a new input loop.
export function bindFocusControls(scene){
 const game=document.querySelector('#game'),panel=document.querySelector('#panel'),keyboard=scene.input.keyboard;
 const sync=()=>{
  scene.uiOwnsKeyboard=uiHasFocus()||!!document.querySelector('dialog[open]');
  keyboard.resetKeys();scene.player.body.setVelocity(0);
  if(scene.uiOwnsKeyboard)keyboard.disableGlobalCapture();else keyboard.enableGlobalCapture();
 };
 const focusWorld=()=>game.focus({preventScroll:true});
 document.addEventListener('focusin',sync);document.addEventListener('focusout',sync);panel?.addEventListener('close',sync);game.addEventListener('pointerdown',focusWorld);sync();
 scene.events.once('shutdown',()=>{document.removeEventListener('focusin',sync);document.removeEventListener('focusout',sync);panel?.removeEventListener('close',sync);game.removeEventListener('pointerdown',focusWorld);keyboard.enableGlobalCapture();scene.uiOwnsKeyboard=false;});
}
