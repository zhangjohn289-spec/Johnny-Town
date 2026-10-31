import fs from 'node:fs';import {performance} from 'node:perf_hooks';import {execFileSync} from 'node:child_process';
import {inventory,included,buildings,approaches} from './reachability-test-helper.mjs';import {chooseInteraction} from './src/npc-data.js';import {regions} from './src/regions.js';
const root='logs/p7e-no2',read=p=>JSON.parse(fs.readFileSync(`${root}/${p}`));
const implementationSHA=execFileSync('git',['log','-1','--format=%H','--','prototype/src/interaction-targeting.js'],{encoding:'utf8'}).trim()||'pending implementation commit';
fs.writeFileSync(`${root}/inventory.json`,JSON.stringify(inventory.map(p=>({...p,approaches:p.bounds?approaches(p):[]})),null,2));
const final=read('final/results.json'),before=read('before/results.json'),phase02=read('regression/phase02/phase02-browser-results.json'),summary=[...read('regression/summary.json'),...read('followup-summary.json').filter(r=>r.suite!=='priority-journey'),{suite:'phase02',exitCode:phase02.results.every(r=>r.pass)&&phase02.errors.length===0?0:1}];
const details=summary.map(s=>{const folder=`${root}/regression/${s.suite}`,f=s.suite.startsWith('world')?'phase05a-browser-results.json':s.suite==='movement'?'movement-speed-results.json':s.suite==='phase02'?'phase02-browser-results.json':'results.json';let d;try{d=JSON.parse(fs.readFileSync(`${folder}/${f}`));}catch{return {...s,records:0,passes:0};}const records=Array.isArray(d)?d:d.results;return {...s,records:records.length,passes:s.suite==='movement'&&s.exitCode===0?records.length:records.filter(r=>r.pass===true).length};});
fs.writeFileSync(`${root}/regression/counts.json`,JSON.stringify(details,null,2));
const effective=[...new Map(details.map(r=>[r.suite.replace('-rerun',''),r])).values()];
if(effective.some(r=>r.exitCode!==0)||final.results.some(r=>!['pass','inaccessible'].includes(r.result)))throw Error('Final verification contains unresolved failures');
fs.writeFileSync(`${root}/final-status.json`,JSON.stringify({branch:'codex/p7e-no2-interaction-reachability',baseline:'93fd79b0428abb0c9fac342eb6335bcb80f6fe7c',inventory:45,buildingsExcluded:6,exitsUnchanged:10,objectsAudited:29,corrected:26,unchangedFootprints:3,activationPasses:286,intentionallyInaccessibleSamples:4,unitTests:98,regressionSuites:effective.length,regressionPassingRecords:effective.reduce((n,r)=>n+r.passes,0),initialWorldAndGearFailuresRetained:true,finalAffectedRerunsPass:true,physicalDevices:'not tested',ownerAcceptance:'pending',remoteOperations:false},null,2));
if(!fs.existsSync(`${root}/selection-benchmark.json`)){const bench=[];for(const r of Object.values(regions)){const ns=included.filter(n=>n.region===r.id&&n.kind==='npc'),all=[...r.places,...r.exits];const t=performance.now();for(let i=0;i<50000;i++)chooseInteraction(all,ns,{x:32+i*13%940,y:48+i*7%650},r.collisions);bench.push({region:r.id,calls:50000,milliseconds:performance.now()-t});}fs.writeFileSync(`${root}/selection-benchmark.json`,JSON.stringify(bench,null,2));}
const unchanged=execFileSync('git',['diff','--name-only','93fd79b','--','prototype/src','prototype/index.html','prototype/vite.config.js','.github','prototype/package.json','prototype/package-lock.json'],{encoding:'utf8'}).trim();
const fmt=p=>`(${Math.round(p.x)}, ${Math.round(p.y)})`,cell=s=>String(s).replaceAll('|','/');
const rows=included.map(p=>{const res=final.results.filter(r=>r.id===p.id),b=before.results.filter(r=>r.id===p.id&&r.result==='target-mismatch');return `| ${p.region} | ${p.name} / \`${p.id}\` | ${p.kind??'chest'} | ${fmt(p.bounds)} ${p.bounds.w}×${p.bounds.h} | ${fmt(p.door)} / ${p.radius} | ${res.filter(r=>r.result==='pass').length} / ${res.filter(r=>r.result==='inaccessible').length} | ${p.kind==='rune'?'Unchanged; nearest target behavior retained':`Corrected; baseline misses: ${b.map(r=>r.direction).filter((v,i,a)=>a.indexOf(v)===i).join(', ')}`} |`;}).join('\n');
const excluded=inventory.filter(p=>p.category.endsWith('excluded')).map(p=>`| ${p.region} | ${p.name} / \`${p.id}\` | ${p.category} | ${fmt(p.door)} |`).join('\n');
const regression=details.map(s=>`| ${s.suite} | ${s.exitCode} | ${s.passes} / ${s.records} |`).join('\n');
const priority=read('priority-journey-final2/results.json');
const report=`# Phase 07E No.2 — Interaction Reachability Report

Local owner acceptance candidate. Starting branch: codex/p7e-mobile-accessibility. Verified baseline/starting HEAD: 93fd79b0428abb0c9fac342eb6335bcb80f6fe7c. Development branch: codex/p7e-no2-interaction-reachability. Unrelated untracked Phase05E/06F files preserved. No fetch, push, merge, deployment, remote modification, or P7F work occurred.

Project root: C:/Users/mi/Desktop/Johnny-Town. All relative evidence/source paths below resolve under that root.

## Scope and complete inventory

Actual source registrations: **45 entries = 29 included non-building objects + 6 excluded buildings/doorways + 10 unchanged region transitions**. There are 31 region places, four dynamically constructed NPC targets, and ten exits. The two activities are appended from activities-data.js. No sprite pointer handlers or additional dynamic world-interaction registries were found; scenery without registration is decoration and excluded. HTML Quick Introduction/journal are separately regression tested, not world targets.

**26 corrected objects (22 fixtures and four NPCs); three rune objects pass without footprint changes; zero untested objects in the sampled automated matrix.** Six buildings are not included in shared footprint/occlusion adjustments. Forest workshop and Valley unfinished workshop are buildings; the sealed phase doorway is conservatively excluded even though it opens a joke panel. The open lake stage, forest arch landmark and upper-right mechanical blueprint installation are standalone fixtures, not enterable building entrances.

Ground rectangles below are logical physical footprints, not full visible roof/canopy extents. NPC rectangles describe the original 32×48 image. Complete per-entry source, approximate raised visual footprint, nearby collision rectangles, state conditions, anchors, radii and connected standing routes are in **logs/p7e-no2/inventory.json**. No claim that all pixels of large tree canopies are interactive.

| Region | Name / ID | Type | Footprint top-left and size | Original anchor / radius | Final pass / inaccessible samples | Disposition |
|---|---|---|---|---|---|---|
${rows}

## Excluded registrations

All retain the same coordinates, collision, anchor radius and entrance/transition behavior. Nearest-target arbitration can prefer a closer NPC; no building eligibility area changed. Six building-only eligibility tests at distances 0,74,75,90 preserve the strict old radius boundary.

| Region | Name / ID | Classification | Anchor |
|---|---|---|---|
${excluded}

## Baseline evidence and diagnosis

Original selection is in baseline src/npc-data.js:10–13: center-to-door distance, 75 default / 54 NPC, and every eligible existing fixture wins over every NPC. NPC construction in src/npc-system.js:3 offsets the anchor 24px south of the feet. Scene rendering places sprites independently of those anchors. Normal north/side positions can therefore miss while southern positions work.

Original browser matrix: 157 dialog activations, 129 target mismatches, four inaccessible samples. These are raw observations, **not 129 separate product defects**: the first script pulsed outward from the candidate, and some rune/east failures legitimately selected a nearer object or left the old radius. Each of the 26 corrected objects has independently confirmed north-approach misses, supported by original screenshots and connected safe positions. The three runes pass their canonical reachable samples and were not enlarged. No blanket radius multiplier was applied.

An initial post-fix run is retained under after/: 270 pass,16 mismatches,4 inaccessible. It exposed test movement overshoot: the touch pulse moved from edge distance22 to33.67, beyond the deliberately bounded32. The test now starts 12px before the standing candidate and uses actual controls toward it. Runtime bounds were not increased to satisfy that test. Exact final positions and routes are retained, including legitimate target competition.

Priority objects: Town chest and safe-chest both now open from accessible north/rear, sides and original front; golden central stone has the same identity/location and trial conditions. Clerk north/east, apprentice/explorer/archivist north/sides now talk naturally. Clerk west intersects City Hall collision and remains intentionally inaccessible. Lake stage east intersects lake collision and remains inaccessible. The four inaccessible records are those two approaches × two input methods.

Additional affected fixtures are listed individually above. Root causes: anchor/footprint mismatch and exclusive fixture-before-NPC priority. No coordinate scale, facing-rule, listener duplication or inactive-registration defect was found. Unawakened runes intentionally remain inspectable; filtering them would break existing explanatory panels.

## Minimal implementation

- src/interaction-targeting.js: explicit allowlist of22 demonstrated fixture failures; four NPC bounds derive from unchanged sprite position. Add32px maximum edge proximity around the logical ground rectangle / NPC image, retaining legacy front eligibility. Compare one stable distance order for all eligible candidates. Exact ties keep registration order. No new facing rule or selection UI.
- Existing collision rectangles provide short segment/rectangle barrier checks for corrected candidates only. The target's exact own solid is excluded. Other walls, water, trees and buildings remain barriers. Buildings/doorways/exits and the three runes retain legacy anchor eligibility. No map pathfinding or navigation cache runs in production.
- src/npc-data.js re-exports the shared selector; NPC data/dialogue unchanged. src/main.js:138 passes existing collision data to that selector. Prompt, E and touch still consume the same scene target and existing scene.interact method.
- No new runtime dependencies, global listeners, timers, assets, save fields, player motion code or collision data.

Production baseline diff (plus the newly added src/interaction-targeting.js helper):

\`\`\`
${unchanged}
\`\`\`

Tests added: reachability-test-helper.mjs, test-interaction-targeting.mjs, test-interaction-reachability.mjs, test-reachability-journey.mjs, run-no2-regression.mjs. Existing test-npc.mjs updates the explicitly superseded fixture-before-NPC expectation; radius assertions remain. Four No.1 scripts accept QA_DIR to keep evidence separate. test-touch-journey now verifies the authorized rear-chest correction. test-world-browser returns focus to the game before measuring gameplay movement; no assertion/threshold weakened.

## Reachability and activation evidence

Player body is16×16 at offset(-8,0), world speed175. Test-only flood-fill/route helper uses original isSafePosition and extra6px clearance. Candidate cardinal sides and legacy anchors are rejected if the player intersects solids or cannot connect to the default spawn. Every final actual standing position is checked safe and reconnected to the region spawn.

**Final matrix: 286/286 reachable samples pass normal activation,4 intentionally inaccessible.** All29 objects have E and touch coverage, not direct handler calls. JSON logs record object, direction, candidate/actual position, connected path, prompt, target, dialog title, input and result. Broad matrix uses controlled repositioning followed by real keyboard movement or native CDP touch movement; it is not a claim of traversing every entire route.

Separate priority-journey uses actual joystick movement from saved safe spawn, with no player teleport, for all seven mandatory objects. It also approaches the overlapping Woods crossroads/NPC neighborhood. **${priority.results.filter(r=>r.pass).length} journey records**, with repeat E and touch activation from identical standing positions, one modal open per input, expected title/prompt, and zero movement while panels are open. Saved spawn selection is setup, not a claimed physical journey from Town into every region. Existing regression journeys cover actual region transitions.

The priority route's initial final reload assertion found that its own addInitScript reseeded storage on every navigation. The seven actual interactions had passed, but that fixture erased their progress. Seeding is now guarded to run only for an empty context, with no production/save-code change. A second run exposed the test planner's grid snap plus6px clearance trapping a safe near-chest start in its inflated test obstacles; the script now makes one verified safe, actual joystick retreat before replanning if necessary. No player teleport or collision change is used. Original failed fixture evidence remains under priority-journey/ and priority-journey-final/; final verified results are under priority-journey-final2/. Five additional connected out-of-range E/tap rejection + reload records are included in its total.

Nearby target proof: at the Woods crossroads/NPC overlap the nearer archivist wins consistently, instead of the original unconditional landmark preference. Rune overlap samples that are nearer another rune are not misclassified as product failures. No target sprites/colliders were relocated.

Occlusion evidence includes explicit synthetic thin-wall/building fixtures, own-solid exceptions, distant rejection, and all actual safe world approaches. Actual inaccessible solid positions are never tested by teleporting inside them. Existing maps contain no separating close wall in the new32px edge shells of the seven priority objects; synthetic barrier tests cover that boundary rather than inventing a through-wall gameplay demonstration. Collision/map geometry hashes remain unchanged. This is sampled directional and geometry-based evidence, not exhaustive testing of every subpixel standing location.

## Final regression (one complete run; affected reruns only)

Unit tests: **98/98**, including four new targeting tests; logs/p7e-no2/unit-tests.txt.

| Browser suite | Exit | Passing result records / all records |
|---|---|---|
${regression}

The final World and Gear reruns both pass13/13. Movement has17 assertion-validated measurements rather than per-record pass flags. Hardening's23 records include18 functional checks and five layout measurements; lifecycle's third record is an NT backgrounding observation. Counts are reported without treating these as independent product features.

The old World test initially measured movement while an HTML HUD button retained focus, contradicting accepted No.1 input isolation. Its original failing JSON/console are retained. Only setup was corrected to focus #game; the full affected World suite was rerun separately. No production change followed. Woods originally wrote its historic folder because it uses FOREST_LOG_DIR rather than QA_DIR; new output was copied to this package and historic tracked evidence restored. The runner now supplies both variables. No unchanged full regression was repeated.

The initial gear-art browser sample failed its existing residual≤21 assertion. Accepted gear rendering files are byte-unchanged. Offline diagnostic (gear-sampling-diagnostic.json) demonstrates that independently rounded192-frame gears can yield7 and−8 frame deltas in a900ms interval, weighted residual24, despite exact continuous24:18 angular velocity. 4,011/30,000 phase starts exhibit this quantization case. This establishes a pre-existing timing-sensitive assertion; it does not retroactively turn the browser failure into a pass. Original failure retained; only the affected gear suite rerun, with its original assertions/thresholds unchanged. See rerun results below rather than assuming success.

Coverage includes six regions/connections; building dialogs and fortune; NPC context/repeat narratives; five Golden lessons/order/final animation/save reload; rhythm and gear activities; journal; old/corrupt saves; environment animation; speed175/diagonal normalization; No.1 focus ownership/scroll/explicit exploration; mobile controls; warmed scene resource/listener checks. See actual individual suite JSON for precise counts; records are not all independent test cases. Lifecycle headless native backgrounding remains an explicit NT observation, not a passed physical-device test.

## Build, performance, privacy and visual checks

Production build succeeds with /Johnny-Town/ unchanged; final output/log in logs/p7e-no2/build.txt. Existing Phaser large-chunk warning remains; no new dependency added. Public build contains no local-video route, credentials or private media. No Bilibili external video was opened or downloaded. Development-only MP4 was never copied into evidence/build. Local preview used production-only serve4511 during audit; normal previews4201/4501 serve the same final dist.

Selection microbenchmark: logs/p7e-no2/selection-benchmark.json (50,000 calls per region, development machine only). Runtime checks scan existing collision data only for nearby corrected candidates; there is no runtime flood-fill, raycasting plugin, graph rebuild, scene object or listener added. Existing warmed lifecycle tests verify bounded scene resources; no physical mobile battery/thermal/long-duration performance claim.

Before/final screenshots inspected for clerk and chest rear approaches: original visible nearby Traveler has no interaction; corrected normal controls open the expected original dialog. Additional golden/safe-chest/NPC images and all accepted art regression snapshots are under logs/p7e-no2/. Artwork and environment animations were not edited.

## Limitations and owner review

Automated real browser: installed Windows Edge Chromium headless, desktop1440×1000 and simulated landscape844×390 DPR2 for the full matrix; established regression includes portrait/tablet and reduced motion. No physical phone/tablet, Safari/WebKit or separate Chrome was tested. These remain manual compatibility review, **not untested object logic**. Full-matrix routes are verified geometrically with final real movement; only the separate seven-priority journey traverses full approach paths without repositioning. Diagonal/corner/subpixel approaches are sampled through existing regression rather than exhaustively enumerated.

No remaining demonstrated reachability failure in the tested scope. Owner retains acceptance authority. Do not begin P7F.

## Local commit

Final implementation/test/evidence local commit SHA: **${implementationSHA}**. This report is committed in a documentation-only follow-up so that it can name the reviewed implementation SHA without self-referencing its own hash. The final delivery HEAD SHA is recorded in the completion message; resolve it with git log -1 on codex/p7e-no2-interaction-reachability. Both commits are local. No remote operations occurred.
`;
fs.writeFileSync('PHASE07E_NO2_INTERACTION_REACHABILITY_REPORT.md',report);
