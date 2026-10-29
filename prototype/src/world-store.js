import {regions, safeSpawn} from './regions.js';

export const WORLD_KEY='johnny-town.world.v1';
export const WORLD_VERSION=1;
const initial=()=>({version:WORLD_VERSION,regionId:'town',spawnId:'start',discovered:['town'],progress:{transitions:0}});
export function normalizeWorld(value) {
  if (!value || value.version!==WORLD_VERSION || !Object.hasOwn(regions,value.regionId) ||
      !Object.hasOwn(regions[value.regionId].spawns,value.spawnId) || !Array.isArray(value.discovered) ||
      !value.progress || !Number.isSafeInteger(value.progress.transitions) || value.progress.transitions<0) return initial();
  const checkpoint=safeSpawn(value.regionId,value.spawnId);
  return {version:WORLD_VERSION,regionId:checkpoint.regionId,spawnId:checkpoint.spawnId,
    discovered:[...new Set(['town',...value.discovered.filter(id => Object.hasOwn(regions,id)),value.regionId])],
    progress:{transitions:value.progress.transitions}};
}

// The fortune key is deliberately never read, rewritten or removed here.
export function createWorldStore({storage=()=>globalThis.localStorage}={}) {
  let state=initial(), warning='';
  try {const raw=storage().getItem(WORLD_KEY); if(raw) state=normalizeWorld(JSON.parse(raw));}
  catch {warning='世界存档不可用，已从中心小镇安全起步。';}
  const snapshot=()=>structuredClone(state);
  const persist=()=>{try{storage().setItem(WORLD_KEY,JSON.stringify(state));}
    catch{warning='无法保存世界进度；本次探索仍可继续，刷新后可能回到小镇。';}};
  return {
    get warning(){return warning;}, read:snapshot,
    visit(regionId,spawnId) {
      const checkpoint=safeSpawn(regionId,spawnId);
      state=normalizeWorld({...state,regionId:checkpoint.regionId,spawnId:checkpoint.spawnId,
        discovered:[...state.discovered,checkpoint.regionId],
        progress:{transitions:Math.min(Number.MAX_SAFE_INTEGER,state.progress.transitions+1)}});
      persist(); return snapshot();
    },
    save:persist,
  };
}
