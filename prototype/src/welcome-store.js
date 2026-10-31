export const WELCOME_KEY='johnny-town.welcome.v1.seen';
export const WELCOME_ACK_KEY='johnny-town.welcome.acknowledged.v1';
// Legacy seen state is preserved, never migrated into explicit confirmation.
// Memory confirmation allows this session to continue if storage is denied.
export function createWelcomeStore({storage=()=>globalThis.localStorage}={}){
 let acknowledged=false,persistent=true;
 const isAcknowledged=()=>{if(acknowledged)return true;try{acknowledged=storage().getItem(WELCOME_ACK_KEY)==='true';}catch{persistent=false;}return acknowledged;};
 return {
  shouldShow:()=>!isAcknowledged(),isAcknowledged,get persistent(){return persistent;},
  acknowledge(){acknowledged=true;for(const key of [WELCOME_ACK_KEY,WELCOME_KEY])try{storage().setItem(key,'true');}catch{persistent=false;}},
 };
}
