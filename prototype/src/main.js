import './style.css';
import Phaser from 'phaser';
import {places,world} from './config.js';
import {show,isOpen} from './ui.js';
import {preloadArt,buildArt,animateArt} from './visuals.js';
class Town extends Phaser.Scene{
preload(){preloadArt(this);this.load.on('loaderror',()=>{document.querySelector('#hint').textContent='素材加载失败，请刷新重试。';});}
create(){
 buildArt(this,places);
 this.walls=this.physics.add.staticGroup();
 for(const p of places){const wall=this.add.rectangle(p.x+p.w/2,p.y+p.h/2,p.w,p.h);this.walls.add(wall);this.add.text(p.door.x,p.id==='chest'?548:67,p.name,{fontSize:'16px',fontFamily:'monospace',color:'#fff0c6',backgroundColor:'#594934',padding:{x:10,y:5}}).setOrigin(.5).setDepth(1000);}
 for(const [x,y] of [[70,120],[440,120],[890,170],[80,500],[430,520]]){const tree=this.add.rectangle(x,y,38,48);this.walls.add(tree);}
 this.shadow=this.add.ellipse(470,369,22,8,0x384c30,.4).setDepth(2);
 this.player=this.add.container(470,355);this.walker=this.add.sprite(-16,-29,'walker').setOrigin(0);this.player.add(this.walker);this.facing=0;
 for(let d=0;d<4;d++)if(!this.anims.exists('walk-'+d))this.anims.create({key:'walk-'+d,frames:this.anims.generateFrameNumbers('walker',{start:d*4,end:d*4+3}),frameRate:8,repeat:-1});
 this.physics.add.existing(this.player);this.player.body.setSize(16,16).setOffset(-8,0).setCollideWorldBounds(true);this.physics.world.setBounds(20,35,920,580);this.physics.add.collider(this.player,this.walls);
 this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E');
 const interact=event=>{if(!event.repeat&&this.target&&!isOpen()&&!this.interacting){this.player.body.setVelocity(0);this.walker.stop();this.walker.setFrame(this.facing*4);this.input.keyboard.resetKeys();this.input.keyboard.enabled=false;const target=this.target;const open=()=>{show(target,()=>{this.input.keyboard.resetKeys();this.input.keyboard.enabled=true;this.interacting=false;this.art.chest.setAngle(0).setTexture('chest');});};this.interacting=true;if(target.id==='chest'&&!this.reduced){this.tweens.add({targets:this.art.chest,y:this.art.chest.y-5,duration:100,yoyo:true,repeat:1,onComplete:()=>{this.art.chest.setTexture('chest-open').setTint(0xffe399);open();}});}else open();}};
 this.input.keyboard.on('keydown-E',interact);this.events.once('shutdown',()=>this.input.keyboard.off('keydown-E',interact));
 this.ring=this.add.graphics().setDepth(999);window.__town={scene:this,places};
}
update(time){const k=this.keys,b=this.player.body;b.setVelocity(0);if(isOpen()||this.interacting){animateArt(this,time,0,0);return;}let x=Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown),y=Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown);const n=Math.hypot(x,y)||1;b.setVelocity(x/n*world.speed,y/n*world.speed);this.target=places.map(p=>({p,d:Phaser.Math.Distance.Between(this.player.x,this.player.y,p.door.x,p.door.y)})).filter(v=>v.d<75).sort((a,b)=>a.d-b.d)[0]?.p;this.ring.clear();if(this.target)this.ring.lineStyle(2,0xffdf92).strokeRect(this.target.door.x-23,this.target.door.y-9,46,20);document.querySelector('#hint').textContent=this.target?`${this.target.name} — 按 E ${this.target.action}`:'沿着道路，随便逛逛。';animateArt(this,time,x,y);}
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:world.width,height:world.height,pixelArt:true,roundPixels:true,backgroundColor:'#80975b',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Town});
