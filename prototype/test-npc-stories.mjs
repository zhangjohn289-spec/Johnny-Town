import test from 'node:test';import assert from 'node:assert/strict';
import {npcNarratives,contextMatches,narrativeStart} from './src/npc-stories.js';
import {dialogueNode} from './src/npc-data.js';
const cases=[['clerk','trial-complete',{goldenTrial:{stage:5}}],['clerk','many-regions',{discovered:['town','woods','meadow','lake']}],['apprentice','gears-complete',{activities:{gears:true}}],['apprentice','flight-found',{secrets:{found:['flight']}}],['explorer','rhythm-complete',{activities:{rhythm:true}}],['explorer','lake-visited',{discovered:['lake']}],['archivist','forest-stories',{stories:['beginning','crossroads','echoing-tree','workshop','unwritten']}],['archivist','echo-found',{stories:['echoing-tree']}]];
test('all eight progress conditions are grounded, read-only and absent in fresh saves',()=>{
 for(const [npc,id,progress] of cases){const before=JSON.stringify(progress);assert.equal(contextMatches(id,{}),false);assert.equal(contextMatches(id,progress),true);assert.ok(narrativeStart(npc,{progress}).lines.includes(npcNarratives[npc].contexts.find(c=>c.id===id).lines[0]));assert.equal(JSON.stringify(progress),before);}
 assert.equal(contextMatches('many-regions',{discovered:['town','town','town','town']}),false);assert.equal(contextMatches('gears-complete',{activities:{gears:'true'}}),false);assert.equal(contextMatches('trial-complete',{goldenTrial:{stage:4}}),false);
});
test('greetings prioritize context, remain short and repeat without inventing progress',()=>{
 for(const [id,n] of Object.entries(npcNarratives)){assert.deepEqual(narrativeStart(id).lines,[n.intro]);assert.deepEqual(narrativeStart(id,{repeat:true}).lines,[n.repeat]);assert.ok(n.intro.length<85);for(const t of n.topics)assert.ok(t.slice(1).every(s=>s.length<100));}
 assert.equal(narrativeStart('clerk',{progress:{goldenTrial:{stage:5},discovered:['town','woods','meadow','lake']}}).lines[1],npcNarratives.clerk.contexts[0].lines[0]);
 assert.equal(narrativeStart('constructor'),null);assert.equal(dialogueNode('__proto__','start',{}),null);
});
