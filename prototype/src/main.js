import {createNPCs} from './npc-system.js';
import {chooseInteraction} from './npc-data.js';
import {bindTouchControls} from './touch-controls.js';
import {stoneState} from './golden-trial.js';
import './style.css';
import Phaser from 'phaser';
import {world} from './config.js';
import {show,showNavigation,showQuick,isOpen} from './ui.js';
import {preloadArt,animateArt} from './visuals.js';
import {regions,regionList,safeSpawn} from './regions.js';
import {createWorldStore} from './world-store.js';
import {createPlayer,lockInput,movePlayer} from './player-controller.js';
import {renderRegion} from './region-renderer.js';

const worldStore=createWorldStore();
const navigation=document.querySelector('#world-map');
const quickButton=document.querySelector('#quick-intro');
const hint=document.querySelector('#hint');

class WorldScene extends Phaser.Scene {
  constructor(){super('world');}
  preload(){
    preloadArt(this);
    const error=()=>{hint.textContent='素材加载失败，请刷新重试。';};
    this.load.on('loaderror',error);
    this.events.once('shutdown',()=>this.load.off('loaderror',error));
  }
  create(){
    const saved=worldStore.read();
    const checkpoint=safeSpawn(saved.regionId,saved.spawnId);
    this.region=regions[checkpoint.regionId];
    this.interacting=false; this.transitioning=false; this.target=null; this.ambientUpdate=null;
    this.ruinState=saved.secrets;this.goldenStage=saved.goldenTrial.stage;this.goldenCompletionAt=null;this.secretCounts={};this.waitStart=null;this.machineUntil=0;
    renderRegion(this);
    this.walls=this.physics.add.staticGroup();
    for(const w of this.region.collisions) this.walls.add(this.add.rectangle(w.x+w.w/2,w.y+w.h/2,w.w,w.h));
    createPlayer(this,checkpoint.position);
    createNPCs(this);
    bindTouchControls(this);
    const b=this.region.bounds;
    this.physics.world.setBounds(b.x,b.y,b.width,b.height);
    this.physics.add.collider(this.player,this.walls);
    const camera=this.cameras.main;
    camera.setBounds(0,0,this.region.width,this.region.height);
    camera.startFollow(this.player,true,0.12,0.12);
    camera.centerOn(this.player.x,this.player.y);
    if(!this.reduced) camera.fadeIn(140,36,55,45);
    this.ring=this.add.graphics().setDepth(999);
    const interact=event=>{if(!event.repeat) this.interact();};
    const map=event=>{if(!event?.repeat) this.openNavigation();};
    const quick=event=>{if(!event?.repeat) this.openQuick();};
    this.input.keyboard.enabled=true;
    this.input.keyboard.resetKeys();
    this.input.keyboard.on('keydown-E',interact);
    this.input.keyboard.on('keydown-M',map);
    this.input.keyboard.on('keydown-I',quick);
    navigation.addEventListener('click',map);
    quickButton.addEventListener('click',quick);
    this.events.once('shutdown',()=>{
      this.input.keyboard.off('keydown-E',interact);
      this.input.keyboard.off('keydown-M',map);
      this.input.keyboard.off('keydown-I',quick);
      navigation.removeEventListener('click',map);
      quickButton.removeEventListener('click',quick);
      this.input.keyboard.resetKeys();
    });
    document.querySelector('#region-name').textContent=this.region.name;
    worldStore.save();
    document.querySelector('#save-status').textContent=worldStore.warning;
    window.__town={scene:this,places:this.region.places};
  }
  openNavigation(){
    if(isOpen()||this.interacting) return;
    lockInput(this,true);
    showNavigation(regionList,worldStore.read(),()=>lockInput(this,false));
  }
  openQuick(){
    if(isOpen()||this.interacting)return;
    lockInput(this,true);
    showQuick(this.region.id,()=>lockInput(this,false));
  }
  interact(){
    if(!this.target||isOpen()||this.interacting) return;
    const target={...this.target};
    if(target.kind==='activity')target.onComplete=id=>{worldStore.finishActivity(id);document.querySelector('#save-status').textContent=worldStore.warning;};
    if(target.id==='golden'||target.kind==='rune'){
      target.trialView=worldStore.interactGolden(target.id);
      this.goldenStage=target.trialView.stage;this.ruinState=worldStore.read().secrets;
      document.querySelector('#save-status').textContent=worldStore.warning;
    }
    if(target.kind==='secret'&&target.id!=='golden'){
      target.state=target.id==='memorial'?worldStore.read():worldStore.secret(target.id);target.complete=()=>worldStore.secret(target.id);target.count=this.secretCounts[target.id]||0;this.secretCounts[target.id]=target.count+1;
      target.activate=()=>{this.machineUntil=this.time.now+2500;};
    }
    lockInput(this,true);
    if(target.to){this.travel(target);return;}
    if(target.kind==='story'){
      worldStore.discover(target.storyId);
      document.querySelector('#save-status').textContent=worldStore.warning;
    }
    const open=()=>show(target,()=>{
      lockInput(this,false);
      // Let the visitor see the brief spiral after reading the final lesson.
      // Only the advancing interaction carries 'complete'; rereads never replay.
      if(target.trialView?.mode==='complete'&&!this.reduced)this.goldenCompletionAt=this.time.now;
      this.art.chest?.setAngle(0).setTexture('chest');
    });
    if(target.id==='chest'&&!this.reduced) this.tweens.add({
      targets:this.art.chest,y:this.art.chest.y-5,duration:100,yoyo:true,repeat:1,
      onComplete:()=>{this.art.chest.setTexture('chest-open').setTint(0xffe399);open();},
    });
    else open();
  }
  travel(exit){
    this.transitioning=true;
    const finish=()=>{worldStore.visit(exit.to,exit.spawn);this.scene.restart();};
    if(this.reduced) finish();
    else {
      this.cameras.main.once('camerafadeoutcomplete',finish);
      this.cameras.main.fadeOut(140,36,55,45);
    }
  }
  update(time){
    if(this.region.id==='ruins'&&!this.ruinState.waited){
      const clock=this.region.places.find(p=>p.id==='clock');
      const near=Math.hypot(this.player.x-clock.door.x,this.player.y-clock.door.y)<65;
      if(!near||isOpen())this.waitStart=null;
      else {this.waitStart??=time;if(time-this.waitStart>=8000)this.ruinState=worldStore.complete('waited').secrets;}
    }
    this.updateNPCs?.(time);
    this.player.body.setVelocity(0);
    if(isOpen()||this.interacting){animateArt(this,time,0,0);return;}
    const {x,y}=movePlayer(this);
    this.target=chooseInteraction([...this.region.places,...this.region.exits],this.npcs,this.player);
    if(this.region.id==='ruins'&&(this.target?.id==='golden'||this.target?.kind==='rune')){
      const state=stoneState(this.goldenStage,this.target.id);
      this.target={...this.target,action:state==='completed'||state==='listening'?'重读':state==='awakened'||this.target.id==='golden'?'聆听':'查看'};
    }
    this.ring.clear();
    if(this.target) this.ring.lineStyle(2,0xffdf92).strokeRect(this.target.door.x-23,this.target.door.y-9,46,20);
    document.querySelector('#touch-interact').textContent=this.target?.action||'互动';
    hint.textContent=this.target ? `${this.target.name} — ${document.documentElement.classList.contains('touch-device')?'点右侧按钮':'按 E'} ${this.target.action}` : '沿着道路，随便逛逛。';
    if(this.region.id==='ruins'&&this.target?.id==='clock')hint.textContent=this.ruinState.waited?'Some things are worth waiting for. — E 查看':`静候钟声 · ${Math.min(8,Math.floor((time-(this.waitStart??time))/1000))} / 8 秒 · E 查看`;
    animateArt(this,time,x,y);
  }
}

const touchDevice=navigator.maxTouchPoints>0||matchMedia('(any-pointer: coarse)').matches;
document.documentElement.classList.toggle('touch-device',touchDevice);
if(touchDevice){document.querySelector('#quick-intro').textContent='认识 Johnny';document.querySelector('#world-map').textContent='探索日志';document.querySelector('#close').textContent='返回探索';}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:touchDevice?640:world.width,height:touchDevice?426:world.height,pixelArt:true,roundPixels:true,
  backgroundColor:'#80975b',physics:{default:'arcade',arcade:{debug:false}},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:WorldScene});
