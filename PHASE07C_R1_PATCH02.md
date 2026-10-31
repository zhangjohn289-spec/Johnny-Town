# P7C-R1 Patch 02 — six landmark graphics

Local art patch, 2026-10-31. Baseline branch `codex/p7c-r1-animation-remediation`, commit `5e3ddb304352317f4e30a9d5082be1a78369e921`. Development branch: `codex/p7c-r1-patch02-placeholder-art`. Existing unrelated untracked release documents are preserved.

## Inventory and identity

| Source-defined identity | Region / ID | Original placement and collider | Interaction door | Replacement |
| --- | --- | --- | --- | --- |
| 被封存的开发日志 | Ruins / `logs` | (332,575), 56×40 | (360,640) | Stone-supported archival rack, warm document layers, binding straps and red sealing clasp. No treasure chest lid or new narrative. |
| Unnamed decorative fallen masonry | Ruins / no interaction ID | Five decorative blocks starting (120,275), 23px spacing; no collider | None | Five irregular fragments with layered faces, cracks and restrained moss. Owner explicitly confirmed this group; it is not the Golden Stone or three trial runes. No altar, runes or new story were added. |
| 失败的飞行实验 | Ruins / `flight` | (402,175), 56×40 | (430,240) | Small top-down handmade aircraft: broad ribbed wings, tapered body, cockpit, nose engine/propeller, tailplane and supports. Represents the small backflipping experiment, not the flying factory. Decorative width remains within the previous ~90px wingspan. |
| 湖畔舞台 | Lake / `lake-stage` | (230,200), 130×50 | (300,290) | Raised plank platform, shaded apron, front steps, modest frame/curtains and microphone. Retains a compact lakeside performance identity. |
| 节奏之石 | Lake / `rhythm-stones` | (160,412), 80×28 | (200,480) | Four irregular standing stones with differentiated heights and engraved marks, grounded bases and light moss. The existing story specifically describes four stones; no wheat lore was invented. The separate `rhythm-practice` table is unchanged. |
| 指挥者之灯 | Lake / `conductors-lantern` | (832,440), 24×36 | (850,520) | Stable stone foot, wood/brass shaft, suspended framed lantern and restrained baton-like ornament. Static warm light; no new lighting or animation system. |

Source identities/content: `prototype/src/ruins-data.js`, `prototype/src/expansion-data.js`, `prototype/src/story-content.js`. All remain byte-for-byte unchanged. Original placeholder drawing lived in `ruins-renderer.js` / `landscape-renderer.js`.

## Implementation

- New `prototype/src/landmark-art.js` contains six static pixel-rectangle drawing routines with a restrained shared palette. No new assets, dependencies, objects, textures, listeners, timers or update callbacks are introduced by it.
- `prototype/src/ruins-renderer.js` delegates only the logs, aircraft and confirmed five decorative blocks to it. All other landmarks retain existing rendering.
- `prototype/src/landscape-renderer.js` delegates only stage, stones and lamp to it. Other Lake objects, Meadow and Valley remain unchanged.
- `prototype/test-landmark-visual.mjs` captures equivalent-camera gameplay views for six objects at four viewports. No new testing framework.

Names, pages, IDs, doors, colliders, maps, activation, persistence, NPCs, journal, rhythm rules, Golden Trial/stones and Pages settings are unchanged. Patch 01 `nature-config.js` and `nature-effects.js` are unchanged, with no parameter exceptions. Graphics use existing display depths and are drawn once on scene creation, not every frame.

## Visual evidence and review

`logs/patch02/before/` and `after/` each contain 24 full gameplay screenshots: six objects × desktop 1440×1000, tablet landscape 1024×768, phone landscape 844×390 and portrait 390×844. Each result records camera position; all 24 before/after camera records match exactly.

The initial baseline capture was interrupted by a production rebuild. It was fully repeated using an isolated copy of the baseline source with the two original renderers restored from commit `5e3ddb3`. Its rebuilt JS hash is the original `index-SAAdbnyJ.js`; the final patch is `index-SIImFiJE.js`. The complete baseline evidence replaces the interrupted pass. The isolated source/build under ignored `prototype/tmp/patch02-before/` is not committed or published.

Six native-size before/after crops (left original, right new) are in `logs/patch02/comparisons/`:

- `logs.png`, `fragments.png`, `flight.png`
- `stage.png`, `stones.png`, `lamp.png`

Each full normal-scale screenshot is `<id>-<viewport>.png` in before/after. `after/flight-desktop.png` also provides a Ruins overview; `after/stage-desktop.png` provides a Lake overview.

Inspected all six desktop comparisons and in-context views, plus portrait aircraft/stones/lamp, tablet archive and landscape stage/lamp. The aircraft now has readable wing/body/tail separation and a propulsion component; fine ribs become secondary on phones. Stone silhouettes survive touch scaling. Archive paper tones contrast with the surrounding ruin stone. Stage steps and microphone identify a performance space; the lantern has a structured hanging housing rather than a plain rectangular light. No labels or touch controls are covered by the replacements. The existing Ruins header wraps on narrow screens; UI changes are outside this patch.

Art remains intentionally compact and nearest-neighbor. These observations are a readiness recommendation for owner review, not a claim that automated tests or the developer can grant the owner's final visual acceptance.

## Verification

Evidence: `logs/patch02/`.

- Production build passed, `/Johnny-Town/` base unchanged. JS 1592.84kB / gzip 394.70kB; existing large Phaser chunk warning remains.
- Existing unit suite: 88/88 passed, including six-region accepted map hashes and nature lifecycle/motion tests (`unit-tests.txt`).
- Ruins browser regression: 17 checks, including logs/flight interactions, all other secrets, journal/save compatibility, routes, 20 warmed transitions and Reduced Motion.
- Golden Trial browser regression: 30 checks, including exact five-lesson progression, old saves, rereads, touch and bounded resources.
- Expansion browser regression: 19 checks, including all Lake stories, regional routes, collision and camera bounds, journal persistence and repeated transitions.
- Nature browser regression: 7 checks, including actual ambient frame changes in all four regions, Reduced Motion, movement/input/layering and 30 measured mixed-region transitions with disposal checks.
- Activities browser regression: 8/8 passed (real timed rhythm hits/misses/retry, gear activity and touch). NPC browser regression: 9/9 passed (branches, fallback, mobile and 20-transition cleanup).
- Combined established browser regression: **90/90 passed**, zero failing cases. Unit tests: **88/88**. Capture/performance checks are separate and not included in that regression count.
- Visual capture: 24 equivalent before/after view pairs. Desktop actual normal-motion performance capture also completed for all four target regions.

Performance sample (`performance/results.json`) was collected while regression browsers were also running: median frame interval 16.7ms in every region, P95 16.8–17.1ms, reported FPS 57.47–59.72. This is not an isolated benchmark. Lake/Ruins child counts remain 65/62 and texture counts 21/35, identical to Patch 01 samples. All added art is static; no per-frame rendering work or generated texture is added. Transition regression supplies the cleanup/resource-growth guard.

## Limits and release boundary

Actual Edge renderer and emulated touch viewports were used, not physical tablets/phones or Safari. The detailed aircraft ribs/seal are naturally less readable on small screens, but the major silhouettes remain visible. No new animation was intended or added to the six objects. Decorative masonry intentionally has no interaction, label or saved state.

No push, merge, deployment, P7C-R2, flying factory, or other deferred maintenance was performed. Private media is not included. The original unrelated untracked files remain outside this commit. Ready for the owner's focused six-object visual acceptance.
