import {PLAYER_SPEED} from './regions.js';

export function createPlayer(scene, position) {
  scene.shadow=scene.add.ellipse(position.x,position.y+14,22,8,0x384c30,.4).setDepth(2);
  scene.player=scene.add.container(position.x,position.y);
  scene.walker=scene.add.sprite(-16,-29,'walker').setOrigin(0);
  scene.player.add(scene.walker); scene.facing=0;
  for(let d=0;d<4;d++) if(!scene.anims.exists('walk-'+d)) scene.anims.create({
    key:'walk-'+d,frames:scene.anims.generateFrameNumbers('walker',{start:d*4,end:d*4+3}),frameRate:8,repeat:-1,
  });
  scene.physics.add.existing(scene.player);
  scene.player.body.setSize(16,16).setOffset(-8,0).setCollideWorldBounds(true);
  scene.keys=scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,M,I');
}

export function lockInput(scene, locked) {
  scene.player.body.setVelocity(0);
  scene.walker.stop().setFrame(scene.facing*4);
  scene.input.keyboard.resetKeys();
  scene.input.keyboard.enabled=!locked;
  scene.interacting=locked;
}

export function movePlayer(scene) {
  const k=scene.keys;
  const x=Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown);
  const y=Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown);
  const length=Math.hypot(x,y)||1;
  // Arcade integrates pixels/second with its own fixed step; never multiply by delta again.
  scene.player.body.setVelocity(x/length*PLAYER_SPEED,y/length*PLAYER_SPEED);
  return {x,y};
}
