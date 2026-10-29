import Phaser from 'phaser';
import {places,world} from './config.js';
import {show,isOpen} from './ui.js';
class Town extends Phaser.Scene{
create(){
 const g=this.add.graphics();g.fillStyle(0x78975b).fillRect(0,0,960,640);
 for(let y=16;y<640;y+=32)for(let x=16;x<960;x+=32){g.fillStyle((x+y)%3?0x819f62:0x6d8e51).fillRect(x,y,3,4);}
 g.fillStyle(0xc8b98c).fillRect(50,300,860,100).fillRect(195,250,50,100).fillRect(705,250,50,290);
 for(let x=55;x<905;x+=32){g.lineStyle(1,0xb4a579).strokeRect(x,306,28,40).strokeRect(x,350,28,40);}
 this.walls=this.physics.add.staticGroup();
 this.labels=[];
 for(const p of places){
  g.fillStyle(0x314c3d,.3).fillRect(p.x+9,p.y+12,p.w,p.h);
  g.fillStyle(p.color).fillRect(p.x,p.y,p.w,p.h);g.lineStyle(4,0x594b3a).strokeRect(p.x,p.y,p.w,p.h);
  if(p.id!=='chest'){g.fillStyle(p.id==='home'?0x785b54:0x9d433a).fillTriangle(p.x-15,p.y+20,p.x+p.w/2,p.y-50,p.x+p.w+15,p.y+20);g.fillStyle(0x493d35).fillRect(p.door.x-17,p.y+p.h-46,34,46);g.fillStyle(0xf2d697).fillRect(p.x+22,p.y+40,27,28);}
  else{g.lineStyle(5,0x685034).lineBetween(p.x,p.y+18,p.x+p.w,p.y+18);g.fillStyle(0xffdf75).fillRect(p.x+28,p.y+17,10,14);}
  const wall=this.add.rectangle(p.x+p.w/2,p.y+p.h/2,p.w,p.h);this.walls.add(wall);
  this.labels.push(this.add.text(p.door.x,p.id==='chest'?555:76,p.name,{fontSize:'18px',color:'#fff3ce',backgroundColor:'#354d3c',padding:{x:10,y:6}}).setOrigin(.5));
 }
 for(const [x,y] of [[70,120],[440,120],[890,170],[80,500],[430,520]]){g.fillStyle(0x65543d).fillRect(x-6,y,12,30);g.fillStyle(0x3d6946).fillRect(x-23,y-40,46,52);const tree=this.add.rectangle(x,y,38,48);this.walls.add(tree);}
 this.player=this.add.container(470,355);const ink=this.add.graphics();ink.lineStyle(3,0xe33e45,1);ink.strokeCircle(0,-23,8);ink.lineBetween(0,-15,0,4);ink.lineBetween(-10,-7,10,-7);ink.lineBetween(0,4,-8,15);ink.lineBetween(0,4,8,15);this.player.add(ink);this.physics.add.existing(this.player);this.player.body.setSize(16,16).setOffset(-8,0).setCollideWorldBounds(true);this.physics.world.setBounds(20,35,920,580);this.physics.add.collider(this.player,this.walls);
 this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E');this.input.keyboard.on('keydown-E',event=>{if(!event.repeat&&this.target&&!isOpen()){this.player.body.setVelocity(0);this.input.keyboard.resetKeys();this.input.keyboard.enabled=false;show(this.target,()=>{this.input.keyboard.resetKeys();this.input.keyboard.enabled=true;});}});this.game.events.on('blur',()=>this.input.keyboard.resetKeys());
 this.ring=this.add.graphics();window.__town={scene:this,places};
}
update(){const k=this.keys,b=this.player.body;b.setVelocity(0);if(isOpen())return;let x=Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown),y=Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown);const n=Math.hypot(x,y)||1;b.setVelocity(x/n*world.speed,y/n*world.speed);this.target=places.map(p=>({p,d:Phaser.Math.Distance.Between(this.player.x,this.player.y,p.door.x,p.door.y)})).filter(v=>v.d<75).sort((a,b)=>a.d-b.d)[0]?.p;this.ring.clear();if(this.target){this.ring.lineStyle(3,0xffe28b).strokeCircle(this.target.door.x,this.target.door.y,24);}document.querySelector('#hint').textContent=this.target?`${this.target.name} — 按 E ${this.target.action}`:'沿着道路，随便逛逛。';}
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:world.width,height:world.height,pixelArt:true,backgroundColor:'#78975b',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Town});

