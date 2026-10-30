import test from 'node:test';import assert from 'node:assert/strict';import {stickVector,movementVector} from './src/touch-controls.js';
test('stick dead zone prevents drift and diagonals stay normalized',()=>{assert.deepEqual(stickVector(3,2),{x:0,y:0});assert.ok(Math.abs(Math.hypot(...Object.values(stickVector(25,25)))-1)<1e-10);});
test('hybrid input never exceeds base speed and opposites cancel',()=>{assert.equal(Math.hypot(...Object.values(movementVector(2,2))),1);assert.deepEqual(movementVector(0,0),{x:0,y:0});});
