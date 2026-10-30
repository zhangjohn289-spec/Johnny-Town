// Canonical user-supplied lines. Additional clues are original and map-specific.
export const lessons=[
 '别对我有太多期待',
 '不要让肌肉察觉',
 '相信回旋吧，只管相信就是了',
 '献上敬意吧',
 '绕远路就是我的捷径，我的捷径就是绕远路',
];
export const trialIds=['golden','rune-0','rune-1','rune-2','golden'];
export const trialClues=[
 '石上的回纹尚未苏醒。先听听中央黄金石的低语。',
 '向西南走，残墙北侧的第一枚低碑，刻着一道折痕。',
 '再往东南，石路转角的第二枚低碑，刻着两道折痕。',
 '沿路向东北，第三枚低碑在宝箱西南侧，刻着三道折痕。',
 '三处回声已经相连。回到西北方最初的黄金石，让这段绕行合拢。',
 '你又站在出发的地方。石上的五道刻痕，记得你走过的路。',
];
export function normalizeTrial(value,legacyComplete=false){
 const stage=Number.isInteger(value?.stage)&&value.stage>=0&&value.stage<=5?value.stage:0;
 return {stage:legacyComplete?5:stage};
}
export function stoneState(stage,id){
 if(id==='golden')return stage===5?'completed':stage===0?'dormant':stage===4?'awakened':'listening';
 const i=['rune-0','rune-1','rune-2'].indexOf(id);
 return i<0?'dormant':stage>i+1?'completed':stage===i+1?'awakened':'dormant';
}
export function interactTrial(stage,id){
 stage=normalizeTrial({stage}).stage;
 if(!trialIds.includes(id))return {stage,lesson:null,advanced:false,clue:trialClues[stage],mode:'locked'};
 const advanced=stage<5&&id===trialIds[stage];
 const next=stage+(advanced?1:0);
 const lesson=id==='golden'?(next===5?4:next>0?0:null):next>['rune-0','rune-1','rune-2'].indexOf(id)+1?['rune-0','rune-1','rune-2'].indexOf(id)+1:null;
 return {stage:next,lesson,advanced,mode:lesson===null?'locked':next===5&&advanced?'complete':advanced?'lesson':'reread',clue:lesson===null?'刻痕仍然安静。另一个地方的回声，还没有抵达这里。':trialClues[next]};
}
