import {normalizeActivities,activityInfo} from './activities-data.js';
import {normalizeTrial,interactTrial} from './golden-trial.js';
import {normalizeSecrets,secretIds} from './ruins-data.js';
import {regions, safeSpawn} from './regions.js';
import {storyIds} from './story-content.js';

export const WORLD_KEY='johnny-town.world.v1';
export const WORLD_VERSION=2;
const initial=()=>({version:WORLD_VERSION,regionId:'town',spawnId:'start',discovered:['town'],progress:{transitions:0},stories:[],activities:normalizeActivities(),secrets:normalizeSecrets(),goldenTrial:normalizeTrial()});
export function normalizeWorld(value) {
  if (!value || ![1,WORLD_VERSION].includes(value.version) || !Object.hasOwn(regions,value.regionId) ||
      !Object.hasOwn(regions[value.regionId].spawns,value.spawnId) || !Array.isArray(value.discovered) ||
      !value.progress || !Number.isSafeInteger(value.progress.transitions) || value.progress.transitions<0) return initial();
  const checkpoint=safeSpawn(value.regionId,value.spawnId);
  const secretState=normalizeSecrets(value.secrets),goldenTrial=normalizeTrial(value.goldenTrial,secretState.golden);
  if(goldenTrial.stage===5)secretState.golden=true;
  return {version:WORLD_VERSION,regionId:checkpoint.regionId,spawnId:checkpoint.spawnId,
    discovered:[...new Set(['town',...value.discovered.filter(id => typeof id==='string'&&Object.hasOwn(regions,id)),value.regionId])],
    progress:{transitions:value.progress.transitions},activities:normalizeActivities(value.activities),secrets:secretState,goldenTrial,
    stories:value.version===1?[]:[...new Set((Array.isArray(value.stories)?value.stories:[]).filter(id=>storyIds.includes(id)))]};
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
    finishActivity(id){if(Object.hasOwn(activityInfo,id)&&!state.activities[id]){state.activities[id]=true;persist();}return snapshot();},
    secret(id){if(secretIds.includes(id)&&!state.secrets.found.includes(id)){state.secrets.found.push(id);persist();}return snapshot();},
    complete(flag){if(['golden','waited'].includes(flag)){state.secrets[flag]=true;if(flag==='golden')state.goldenTrial.stage=5;persist();}return snapshot();},
    interactGolden(id){
      const view=interactTrial(state.goldenTrial.stage,id);let changed=false;
      if(id==='golden'&&!state.secrets.found.includes('golden')){state.secrets.found.push('golden');changed=true;}
      if(view.advanced){state.goldenTrial.stage=view.stage;changed=true;}
      if(view.stage===5&&!state.secrets.golden){state.secrets.golden=true;changed=true;}
      if(changed)persist();return view;
    },
    discover(storyId) {
      if(storyIds.includes(storyId)&&!state.stories.includes(storyId)) {
        state.stories.push(storyId);persist();
      }
      return snapshot();
    },
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
