import test from 'node:test';import assert from 'node:assert/strict';import {uiHasFocus,bindFocusControls} from './src/input-focus.js';import {movePlayer} from './src/player-controller.js';
test('focus control is scene-owned, resets held keys and restores native key capture',()=>{
 const prior=globalThis.document,doc=new EventTarget(),game=new EventTarget(),panel=new EventTarget();let ui=false,open=false,focus=0,resets=0,capture=true,shutdown;
 game.focus=()=>focus++;doc.activeElement={closest:()=>ui?{}:null};doc.querySelector=s=>s==='#game'?game:s==='#panel'?panel:open?{}:null;globalThis.document=doc;
 const s={input:{keyboard:{resetKeys(){resets++;},disableGlobalCapture(){capture=false;},enableGlobalCapture(){capture=true;}}},player:{body:{setVelocity(){}}},events:{once(name,fn){assert.equal(name,'shutdown');shutdown=fn;}}};
 try{bindFocusControls(s);assert.equal(uiHasFocus(),false);ui=true;doc.dispatchEvent(new Event('focusin'));assert.equal(s.uiOwnsKeyboard,true);assert.equal(capture,false);ui=false;open=true;doc.dispatchEvent(new Event('focusout'));assert.equal(capture,false);open=false;panel.dispatchEvent(new Event('close'));assert.equal(s.uiOwnsKeyboard,false);assert.equal(capture,true);game.dispatchEvent(new Event('pointerdown'));assert.equal(focus,1);shutdown();const before=resets;doc.dispatchEvent(new Event('focusin'));panel.dispatchEvent(new Event('close'));game.dispatchEvent(new Event('pointerdown'));assert.equal(resets,before);assert.equal(focus,1);}finally{globalThis.document=prior;}
});
test('UI focus suppresses keyboard movement while joystick still has normalized 175 speed',()=>{
 const off={isDown:false},s={uiOwnsKeyboard:true,touch:{x:0,y:0},keys:Object.fromEntries(['A','D','S','W','LEFT','RIGHT','UP','DOWN'].map(k=>[k,k==='D'?{isDown:true}:off])),player:{body:{setVelocity(x,y){this.v={x,y};}}}};
 movePlayer(s);assert.deepEqual(s.player.body.v,{x:0,y:0});s.touch={x:1,y:1};movePlayer(s);assert.ok(Math.abs(Math.hypot(...Object.values(s.player.body.v))-175)<1e-8);s.touch={x:0,y:0};s.uiOwnsKeyboard=false;movePlayer(s);assert.deepEqual(s.player.body.v,{x:175,y:0});
});
