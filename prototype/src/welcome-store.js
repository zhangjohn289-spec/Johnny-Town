export const WELCOME_KEY='johnny-town.welcome.v1.seen';
// Separate from world/fortune progress. Memory acknowledgement prevents repeat
// prompts on scene restart when storage is blocked; reload persistence then
// cannot be promised. Rendering alone never writes this key.
export function createWelcomeStore({storage=()=>globalThis.localStorage}={}){
 let acknowledged=false;
 return {
  shouldShow(){if(acknowledged)return false;try{acknowledged=storage().getItem(WELCOME_KEY)==='true';return !acknowledged;}catch{return true;}},
  acknowledge(){acknowledged=true;try{storage().setItem(WELCOME_KEY,'true');}catch{/* Exploration remains available without storage. */}},
 };
}
