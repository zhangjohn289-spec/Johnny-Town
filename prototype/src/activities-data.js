export const activityInfo={
 rhythm:{name:'湖岸节奏练习',region:'lake',interest:'Johnny 学习小军鼓已有数年，也打架子鼓，喜欢音乐剧、管弦与戏剧性音乐。节奏是探索创造力与专注的一种方式。'},
 gears:{name:'恢复工坊动力',region:'valley',interest:'Johnny 喜欢机械系统、自动化和动力传递，也在 Minecraft Create 中尝试大型工程。反复试验、修改与排查，是把想法变成系统的一部分。'},
};
export const activityPlaces=[
 {id:'rhythm-practice',activityId:'rhythm',kind:'activity',name:activityInfo.rhythm.name,region:'lake',action:'练习',x:320,y:500,w:48,h:32,door:{x:344,y:568}},
 {id:'power-bench',activityId:'gears',kind:'activity',name:activityInfo.gears.name,region:'valley',action:'试一试',x:710,y:300,w:60,h:32,door:{x:740,y:370}},
];
export const normalizeActivities=v=>({rhythm:v?.rhythm===true,gears:v?.gears===true});
export const RHYTHM_NOTES=[0,1,2,2.5,4,5,6,6.5,8,9,10,10.5,12,13,14,15].map(n=>4000+n*1000);
export const HIT_WINDOW=260;
export function hitNote(notes,time){let best=-1,distance=Infinity;for(let i=0;i<RHYTHM_NOTES.length;i++){const d=Math.abs(RHYTHM_NOTES[i]-time);if(notes[i]==='pending'&&d<=HIT_WINDOW&&d<distance){best=i;distance=d;}}return best;}
export function gearPower(directions){let previous=1;return directions.map((d,i)=>{if(previous===0||d!==-previous){previous=0;return false;}previous=d;return true;});}
