# Phase 07E No.2 — Interaction Reachability Report

Local owner acceptance candidate. Starting branch: codex/p7e-mobile-accessibility. Verified baseline/starting HEAD: 93fd79b0428abb0c9fac342eb6335bcb80f6fe7c. Development branch: codex/p7e-no2-interaction-reachability. Unrelated untracked Phase05E/06F files preserved. No fetch, push, merge, deployment, remote modification, or P7F work occurred.

Project root: C:/Users/mi/Desktop/Johnny-Town. All relative evidence/source paths below resolve under that root.

## Scope and complete inventory

Actual source registrations: **45 entries = 29 included non-building objects + 6 excluded buildings/doorways + 10 unchanged region transitions**. There are 31 region places, four dynamically constructed NPC targets, and ten exits. The two activities are appended from activities-data.js. No sprite pointer handlers or additional dynamic world-interaction registries were found; scenery without registration is decoration and excluded. HTML Quick Introduction/journal are separately regression tested, not world targets.

**26 corrected objects (22 fixtures and four NPCs); three rune objects pass without footprint changes; zero untested objects in the sampled automated matrix.** Six buildings are not included in shared footprint/occlusion adjustments. Forest workshop and Valley unfinished workshop are buildings; the sealed phase doorway is conservatively excluded even though it opens a joke panel. The open lake stage, forest arch landmark and upper-right mechanical blueprint installation are standalone fixtures, not enterable building entrances.

Ground rectangles below are logical physical footprints, not full visible roof/canopy extents. NPC rectangles describe the original 32×48 image. Complete per-entry source, approximate raised visual footprint, nearby collision rectangles, state conditions, anchors, radii and connected standing routes are in **logs/p7e-no2/inventory.json**. No claim that all pixels of large tree canopies are interactive.

| Region | Name / ID | Type | Footprint top-left and size | Original anchor / radius | Final pass / inaccessible samples | Disposition |
|---|---|---|---|---|---|---|
| town | 百宝箱 / `chest` | chest | (700, 445) 65×48 | (732, 520) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| town | 市政书记员 / `town-clerk` | npc | (324, 442) 32×48 | (340, 514) / 54 | 8 / 2 | Corrected; baseline misses: north, east |
| meadow | 旅行探险家 / `traveling-explorer` | npc | (414, 402) 32×48 | (430, 474) / 54 | 10 / 0 | Corrected; baseline misses: north, west, east |
| woods | 初始之地 / `beginning` | story | (198, 528) 44×48 | (220, 610) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| woods | 命运岔路 / `crossroads` | story | (374, 390) 36×32 | (400, 460) / 75 | 10 / 0 | Corrected; baseline misses: north |
| woods | 回响之树 / `echoing-tree` | story | (660, 260) 60×56 | (690, 365) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| woods | 未书写之路 / `unwritten` | story | (880, 140) 32×24 | (890, 200) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| woods | 森林档案员 / `forest-archivist` | npc | (484, 412) 32×48 | (500, 484) / 54 | 10 / 0 | Corrected; baseline misses: north, west, east |
| lake | 湖畔舞台 / `lake-stage` | story | (230, 200) 130×50 | (300, 290) / 75 | 8 / 2 | Corrected; baseline misses: north, west |
| lake | 节奏之石 / `rhythm-stones` | story | (160, 412) 80×28 | (200, 480) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| lake | 回声栈桥 / `echoing-pier` | story | (580, 500) 24×30 | (550, 590) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| lake | 指挥者之灯 / `conductors-lantern` | story | (832, 440) 24×36 | (850, 520) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| lake | 湖岸节奏练习 / `rhythm-practice` | activity | (320, 500) 48×32 | (344, 568) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| valley | 第一枚齿轮 / `first-gear` | story | (216, 470) 48×40 | (240, 550) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| valley | 宏大传动 / `great-transmission` | story | (716, 460) 88×62 | (760, 570) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| valley | 向天空的蓝图 / `skyward-blueprint` | story | (750, 170) 140×70 | (820, 280) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| valley | 恢复工坊动力 / `power-bench` | activity | (710, 300) 60×32 | (740, 370) / 75 | 10 / 0 | Corrected; baseline misses: north, west, east |
| valley | 机械学徒 / `mechanical-apprentice` | npc | (604, 532) 32×48 | (620, 604) / 54 | 10 / 0 | Corrected; baseline misses: north, west, east |
| ruins | 永远写不完的手稿 / `manuscript` | secret | (152, 575) 56×40 | (180, 640) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 黄金回旋之石 / `golden` | secret | (632, 375) 56×40 | (660, 440) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 绿皮工程师的遗产 / `engineer` | secret | (372, 375) 56×40 | (400, 440) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 绝对安全的宝箱 / `safe-chest` | secret | (832, 385) 56×40 | (860, 450) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 等待者之钟 / `clock` | secret | (152, 355) 56×40 | (180, 420) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 失败的飞行实验 / `flight` | secret | (402, 175) 56×40 | (430, 240) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 被封存的开发日志 / `logs` | secret | (332, 575) 56×40 | (360, 640) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 最后的纪念碑 / `memorial` | secret | (602, 85) 56×40 | (630, 150) / 75 | 10 / 0 | Corrected; baseline misses: north, east |
| ruins | 回旋符文 1 / `rune-0` | rune | (558, 500) 24×16 | (570, 530) / 75 | 10 / 0 | Unchanged; nearest target behavior retained |
| ruins | 回旋符文 2 / `rune-1` | rune | (688, 530) 24×16 | (700, 560) / 75 | 10 / 0 | Unchanged; nearest target behavior retained |
| ruins | 回旋符文 3 / `rune-2` | rune | (778, 490) 24×16 | (790, 520) / 75 | 10 / 0 | Unchanged; nearest target behavior retained |

## Excluded registrations

All retain the same coordinates, collision, anchor radius and entrance/transition behavior. Nearest-target arbitration can prefer a closer NPC; no building eligibility area changed. Six building-only eligibility tests at distances 0,74,75,90 preserve the strict old radius boundary.

| Region | Name / ID | Classification | Anchor |
|---|---|---|---|
| town | 市政厅 / `city-hall` | building-excluded | (224, 510) |
| town | Johnny 的小屋 / `home` | building-excluded | (220, 285) |
| town | 小神社 / `shrine` | building-excluded | (730, 285) |
| town | 边境草甸 → / `to-meadow` | transition-excluded | (885, 350) |
| town | 记忆森林 ↑ / `to-woods` | transition-excluded | (500, 90) |
| meadow | 苔痕石阶 ↑ / `to-ruins` | transition-excluded | (570, 140) |
| meadow | ← Johnny Town / `to-town` | transition-excluded | (50, 384) |
| meadow | 旋律湖 ↗ / `to-lake` | transition-excluded | (910, 250) |
| meadow | 机械谷 ↘ / `to-valley` | transition-excluded | (940, 620) |
| woods | 遗落工坊 / `workshop` | building-excluded | (720, 595) |
| woods | ← Johnny Town / `woods-to-town` | transition-excluded | (48, 640) |
| lake | ← 边境草甸 / `lake-return` | transition-excluded | (50, 600) |
| valley | 未完成的工坊 / `unfinished-ideas` | building-excluded | (520, 490) |
| valley | ← 边境草甸 / `valley-return` | transition-excluded | (50, 600) |
| ruins | 不存在的下一阶段 / `phase-door` | building-excluded | (820, 150) |
| ruins | 草甸的阳光 ↙ / `ruins-return` | transition-excluded | (60, 700) |

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

```
prototype/src/interaction-targeting.js
prototype/src/main.js
prototype/src/npc-data.js
```

Tests added: reachability-test-helper.mjs, test-interaction-targeting.mjs, test-interaction-reachability.mjs, test-reachability-journey.mjs, run-no2-regression.mjs. Existing test-npc.mjs updates the explicitly superseded fixture-before-NPC expectation; radius assertions remain. Four No.1 scripts accept QA_DIR to keep evidence separate. test-touch-journey now verifies the authorized rear-chest correction. test-world-browser returns focus to the game before measuring gameplay movement; no assertion/threshold weakened.

## Reachability and activation evidence

Player body is16×16 at offset(-8,0), world speed175. Test-only flood-fill/route helper uses original isSafePosition and extra6px clearance. Candidate cardinal sides and legacy anchors are rejected if the player intersects solids or cannot connect to the default spawn. Every final actual standing position is checked safe and reconnected to the region spawn.

**Final matrix: 286/286 reachable samples pass normal activation,4 intentionally inaccessible.** All29 objects have E and touch coverage, not direct handler calls. JSON logs record object, direction, candidate/actual position, connected path, prompt, target, dialog title, input and result. Broad matrix uses controlled repositioning followed by real keyboard movement or native CDP touch movement; it is not a claim of traversing every entire route.

Separate priority-journey uses actual joystick movement from saved safe spawn, with no player teleport, for all seven mandatory objects. It also approaches the overlapping Woods crossroads/NPC neighborhood. **13 journey records**, with repeat E and touch activation from identical standing positions, one modal open per input, expected title/prompt, and zero movement while panels are open. Saved spawn selection is setup, not a claimed physical journey from Town into every region. Existing regression journeys cover actual region transitions.

The priority route's initial final reload assertion found that its own addInitScript reseeded storage on every navigation. The seven actual interactions had passed, but that fixture erased their progress. Seeding is now guarded to run only for an empty context, with no production/save-code change. A second run exposed the test planner's grid snap plus6px clearance trapping a safe near-chest start in its inflated test obstacles; the script now makes one verified safe, actual joystick retreat before replanning if necessary. No player teleport or collision change is used. Original failed fixture evidence remains under priority-journey/ and priority-journey-final/; final verified results are under priority-journey-final2/. Five additional connected out-of-range E/tap rejection + reload records are included in its total.

Nearby target proof: at the Woods crossroads/NPC overlap the nearer archivist wins consistently, instead of the original unconditional landmark preference. Rune overlap samples that are nearer another rune are not misclassified as product failures. No target sprites/colliders were relocated.

Occlusion evidence includes explicit synthetic thin-wall/building fixtures, own-solid exceptions, distant rejection, and all actual safe world approaches. Actual inaccessible solid positions are never tested by teleporting inside them. Existing maps contain no separating close wall in the new32px edge shells of the seven priority objects; synthetic barrier tests cover that boundary rather than inventing a through-wall gameplay demonstration. Collision/map geometry hashes remain unchanged. This is sampled directional and geometry-based evidence, not exhaustive testing of every subpixel standing location.

## Final regression (one complete run; affected reruns only)

Unit tests: **98/98**, including four new targeting tests; logs/p7e-no2/unit-tests.txt.

| Browser suite | Exit | Passing result records / all records |
|---|---|---|
| world | 1 | 8 / 9 |
| woods | 0 | 13 / 13 |
| expansion | 0 | 19 / 19 |
| ruins | 0 | 17 / 17 |
| ruins-details | 0 | 3 / 3 |
| hall | 0 | 7 / 7 |
| mobile | 0 | 10 / 10 |
| npc | 0 | 9 / 9 |
| activities | 0 | 8 / 8 |
| gears | 1 | 1 / 2 |
| golden | 0 | 30 / 30 |
| nature | 0 | 7 / 7 |
| narrative | 0 | 48 / 48 |
| movement | 0 | 17 / 17 |
| hardening | 0 | 23 / 23 |
| lifecycle | 0 | 2 / 3 |
| rhythm | 0 | 3 / 3 |
| journey | 0 | 16 / 16 |
| world-rerun | 0 | 13 / 13 |
| gears-rerun | 0 | 13 / 13 |
| phase02 | 0 | 23 / 23 |

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

Final implementation/test/evidence local commit SHA: **6ff07f2edd44937252baadb36b2511ca1d54bee7**. This report is committed in a documentation-only follow-up so that it can name the reviewed implementation SHA without self-referencing its own hash. The final delivery HEAD SHA is recorded in the completion message; resolve it with git log -1 on codex/p7e-no2-interaction-reachability. Both commits are local. No remote operations occurred.
