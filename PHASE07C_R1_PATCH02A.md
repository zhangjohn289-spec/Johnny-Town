# P7C-R1 Patch 02A — drum and manuscript

2026-10-31, local corrective art only. Baseline: Patch 02 `74c587ae1fc1f2e8a6d9c50f5d6c5ac93b80f182`; branch `codex/p7c-r1-patch02a-drum-manuscript`. Patch 01 `5e3ddb3` is retained. No push, merge, deployment or R2.

## Correct source identities

- **湖岸节奏练习**, `rhythm-practice`, `activityId: rhythm`: `activities-data.js`, Lake (320,500), 48×32 collider, interaction (344,568). This is the drum for the existing rhythm activity. It is not `rhythm-stones` / 节奏之石. The old renderer used a rectangular pale top, box shell and two wooden legs, producing a table silhouette.
- **永远写不完的手稿**, `manuscript`: `ruins-data.js`, Ruins (152,575), 56×40 collider, interaction (180,640). Its three existing pages joke about an unfinished report increasing from 847 to 1,204 pages. It is not `logs` / 被封存的开发日志. The old shelf/frame dominated the paper silhouette. Names, exact pages and interaction behavior are unchanged.

Patch 02 had changed the separate stone and archive, leaving these two actual rejected objects unchanged. This correction targets the exact two rendering branches above. No owner reference images were attached to this message beyond the task text; fresh screenshots of the actual baseline were used.

## Graphics changes

`prototype/src/document-drum-art.js` adds two static drawing helpers:

- Drum: stepped pixel ellipse, contrasting metal rim and warm skin; rounded cylindrical red-brown shell, lower hoop and restrained metal lugs; narrow central stand and splayed tripod feet. A resting stick does not cover the main drumhead. No wooden furniture legs.
- Manuscript: dominant two-page aged parchment silhouette, center binding/fold, layered page edges, irregular corners and short ink strokes. A small stone lectern is secondary. A loose page suggests the existing endless-document theme without adding narrative.

`landscape-renderer.js` replaces only the rhythm activity drawing with `drawDrum`; `ruins-renderer.js` replaces only the `manuscript` drawing with `drawManuscript`. Both reuse their existing Graphics objects and depths. No textures, timers, event listeners or per-frame animation work are added.

Patch 02 `landmark-art.js` is unchanged. All six prior Patch 02 renderings, including the distinct stone and archive, remain untouched. Region data/collisions, doors, note sequence, timing, input, scoring, UI feedback, saved state, narrative, Golden Trial and environmental animation modules are unchanged.

## Visual evidence

`logs/patch02a/before/` and `after/`: two assets × four viewports = eight matched before/after pairs. Desktop 1440×1000; tablet landscape 1024×768; phone landscape 844×390; portrait 390×844. Capture results record the camera; all eight camera records match. Reduced Motion is explicitly enabled for static art comparison, independently of normal-motion regression.

- `comparisons/drum.png`: native-size crop, left before / right after.
- `comparisons/manuscript.png`: native-size crop, left before / right after.
- `after/drum-desktop.png`, `after/manuscript-desktop.png`: full normal gameplay context.
- `after/<drum|manuscript>-<tablet|landscape|portrait>.png`: responsive views.
- `activities/rhythm-desktop.png`, `activities/rhythm-result.png`: active existing rhythm UI and completed result.
- `ruins/manuscript-scene.png` and `ruins/manuscript-panel.png`: existing manuscript interaction evidence.

Reviewed the normal-size desktop and mobile gameplay images and native crops. The drum's ellipse, cylindrical shell and metal stand now read separately; the manuscript reads as an open book before the supporting stone. Neither sprite covers the interaction prompt or touch controls. Fine ink/lug details are secondary and naturally diminish on phones. No enlarged preview was required to establish the main silhouettes. Ready for owner visual review, not automatic owner acceptance.

## Verification

- Production build passed, final JS `index-CDmFoY4H.js`, 1594.27kB / gzip 395.32kB. Existing large Phaser chunk warning persists. `/Johnny-Town/` configuration unchanged.
- Existing unit suite: **88/88 passed** (`unit-tests.txt`), including accepted geometry hashes and nature lifecycle checks.
- Existing activity browser suite exercises the exact 16-note sequence with actual keyboard hits/misses, result/retry, cancel/blur, reopening cleanup, touch hits at three sizes and region transitions. The activity source explicitly says sound is unnecessary and has no AudioContext/audio playback; silence is existing behavior, not a new failure. No audio feature was added or claimed tested by listening.
- Existing Ruins suite checks manuscript access and all exact existing pages, repeated reading, secrets, journal/save compatibility, collision/routes and warmed transitions.
- Existing Golden Trial suite checks all five lessons, replay, migration, mobile/tablet completion and resource bounds.
- Existing nature suite checks actual normal-motion commands, Reduced Motion, input/layering, disposed references and 30 mixed-region transitions. Patch 01 timing/placement/rendering modules are byte-for-byte unchanged.
- Final browser regression: **62/62 passed** — activities 8, Ruins 17, Golden Trial 30, nature 7. Zero browser runtime errors. Raw results are in the named directories. Capture checks are separate from this count. No new testing framework; `test-two-assets-visual.mjs` reuses the established capture approach.

## Limits and safety

Actual Edge rendering and simulated touch viewports, not physical mobile devices or Safari. Existing Ruins header wrapping at narrow sizes is unchanged and outside scope. User's unrelated untracked documents remain untouched. No personal video or media asset was introduced. Only two graphics were corrected; final visual approval belongs to the owner.
