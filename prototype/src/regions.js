import {ruins} from './ruins-data.js';
import {lake,valley,meadowPaths} from './expansion-data.js';
import {places} from './config.js';
import {woods} from './woods-data.js';

export const TILE_SIZE = 16;
export const PLAYER_SPEED = 175;
export const BODY_SIZE = 16;
const treeWalls = trees => trees.map(([x, y]) => ({x: x - 19, y: y - 24, w: 38, h: 48, kind: 'tree'}));
const townTrees = [[70,120],[440,120],[890,170],[80,500],[430,520]];
const meadowTrees = [[100,130],[260,180],[440,130],[730,160],[910,120],[100,640],[300,620],[660,640],[890,620],[190,100],[240,110],[590,100],[800,95],[180,680],[470,680],[520,710],[820,700]];
const meadowFences = [{x:340,y:250,w:160,h:16,kind:'fence'}, {x:600,y:500,w:176,h:16,kind:'fence'}];

// All rectangles use top-left coordinates; interaction points are independent of solids.
export const regions = {
  town: {
    id:'town', name:'Johnny Town · 中心小镇', renderer:'town', width:960, height:640,
    bounds:{x:20,y:35,width:920,height:580}, trees:townTrees, places,
    collisions:[...places.map(p => ({x:p.x,y:p.y,w:p.w,h:p.h,kind:'building'})), ...treeWalls(townTrees)],
    spawns:{start:{x:470,y:355}, fromMeadow:{x:780,y:350},fromWoods:{x:500,y:185}}, defaultSpawn:'start',
    exits:[{id:'to-meadow',name:'边境草甸 →',action:'出发',door:{x:885,y:350},to:'meadow',spawn:'fromTown'},
      {id:'to-woods',name:'记忆森林 ↑',action:'进入',door:{x:500,y:90},to:'woods',spawn:'fromTown'}],
  },
  meadow: {
    id:'meadow', name:'Frontier Meadow · 边境草甸', renderer:'meadow', width:64*TILE_SIZE, height:48*TILE_SIZE,
    bounds:{x:16,y:32,width:992,height:720}, trees:meadowTrees, places:[],
    collisions:[...treeWalls(meadowTrees), ...meadowFences],
    paths:meadowPaths, spawns:{fromTown:{x:145,y:384},fromRuins:{x:570,y:240},fromLake:{x:800,y:250},fromValley:{x:800,y:620}}, defaultSpawn:'fromTown',
    exits:[{id:'to-ruins',name:'苔痕石阶 ↑',action:'探索',door:{x:570,y:140},to:'ruins',spawn:'fromMeadow'},{id:'to-town',name:'← Johnny Town',action:'返回',door:{x:50,y:384},to:'town',spawn:'fromMeadow'},{id:'to-lake',name:'旋律湖 ↗',action:'前往',door:{x:910,y:250},to:'lake',spawn:'fromMeadow'},{id:'to-valley',name:'机械谷 ↘',action:'前往',door:{x:940,y:620},to:'valley',spawn:'fromMeadow'}],
  },
  woods, lake, valley, ruins,
};

export const regionList = [
  ...Object.values(regions).map(({id,name}) => ({id,name,available:true})),
];

export function isSafePosition(region, point) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
  const left=point.x-BODY_SIZE/2, right=point.x+BODY_SIZE/2, top=point.y, bottom=point.y+BODY_SIZE;
  const b=region.bounds;
  return left>=b.x && right<=b.x+b.width && top>=b.y && bottom<=b.y+b.height &&
    !region.collisions.some(w => left<w.x+w.w && right>w.x && top<w.y+w.h && bottom>w.y);
}

export function safeSpawn(regionId, spawnId) {
  const region=Object.hasOwn(regions,regionId) ? regions[regionId] : regions.town;
  const id=Object.hasOwn(region.spawns,spawnId)&&isSafePosition(region,region.spawns[spawnId]) ? spawnId : region.defaultSpawn;
  if (!isSafePosition(region,region.spawns[id])) throw new Error('Region has no safe default spawn: '+region.id);
  return {regionId:region.id,spawnId:id,position:{...region.spawns[id]}};
}
