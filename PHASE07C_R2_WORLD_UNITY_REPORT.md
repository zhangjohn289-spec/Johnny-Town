# P7C-R2 — Central Town and World Unity

2026-10-31. Local visual development only. Baseline commit: `025d3807b9f8b508dacfc46b93c39a286e3142ad`, branch `codex/p7c-r1-patch02a-drum-manuscript`. R2 branch: `codex/p7c-r2-town-world-unity`. R1 animation `5e3ddb3`, landmarks `74c587a`, and drum/manuscript correction `025d380` are retained. Existing unrelated untracked release documents were not edited or staged.

## A. Initial audit and plan

The existing Town already had clear home/shrine/chest identities, open roads, readable prompts and a functional civic building. Its weaker points were the highly regular square paving, repeated oval grass patches, noisy small roof marks, very simple municipal roof/gear emblem, inconsistent window framing, and relatively rough foliage compared with the accepted Woods. The proposal was to correct these in Town, preserve all geometry, and assess the other five regions before making any additional changes.

Actual baseline gameplay images and comparable isolated Town frame samples were captured before any R2 build at `logs/p7c-r2/before/`. Existing architecture uses shared PNG preload plus a Town-only `buildArt`, a procedural City Hall, and separate accepted renderers for the other regions. This patch keeps that architecture.

## B. Central Town implementation and review

- **Johnny's home:** deliberate roof courses and sparse joints replace noisy roof speckles; consistent timber supports, framed glass, visible plank entrance, flower boxes, gable window, foundation and doorstep shading. Existing origin/texture size and doorway alignment remain.
- **Shrine:** slate roof courses, clear eaves, red structural beams, restrained timber slats, rope/paper details and a readable offering box. Warm lantern cores receive only small static light accents. It retains its distinct shrine identity rather than being converted to European architecture.
- **City Hall:** slate roof, material courses, timber corners, framed windows, defined double door, stepped foundation, and a compact engraved civic seal replace the coarse early roof and floating-square gear emblem. Civic content, label and entrance remain unchanged.
- **Treasure chest:** reviewed and retained, including its existing closed/open textures and animation. It already has readable wood/brass identity; its surrounding paving now matches the remastered road. No radius or media changes.
- **Roads:** same three original road rectangles, widths and junctions. Larger staggered slabs, a restrained stone palette, subtle wear and clear grass borders replace the square-grid checkerboard. Northern stepping trail, exits and fence positions remain.
- **Landscaping:** low-contrast ground patches replace repeated oval shapes. Sparse maintained flower beds sit away from doors/roads/NPCs. Five existing trees retain their positions and sizes but use two cached, shaped foliage variants derived from the accepted leaf-mass helper. Bark and stepped root shadows provide material separation. Open space is deliberately retained.

No new Town ambient animation was added. The existing eight slow motes and Reduced Motion behavior remain unchanged. There is no new particle system, lighting engine, weather, day/night cycle or full-screen filter. The small shrine glow is static pixel art.

### Visual iteration

1. `pass1/`: complete architecture/ground pass, inspected in the actual browser. The initial selection made all tree crowns too similar and the paving still read as repetitive rectangular courses.
2. `after/`: introduced a second foliage shape, softened tree contact shadows, staggered the road joints and added a few grouped grass accents. The Town remains orderly and open. Final normal-scale screenshots and native comparisons were inspected again.
3. `mobile-detail/`: supplementary normal camera views after approaching **each** Town building, at tablet/phone landscape/portrait sizes. These check the building silhouettes rather than judging them only from the naturally cropped initial touch-camera view.

### Evidence

All paths below are under `logs/p7c-r2/`:

- Full Town before/after: `before/town-desktop.png`, `after/town-desktop.png`.
- Architectural comparisons: `comparisons/home.png`, `shrine.png`, `hall.png`, `chest.png`.
- Surface/landscape/light comparisons: `comparisons/road.png`, `vegetation.png`, `lighting.png`.
- Native comparisons show original on the left, final on the right, without enlargement.
- `after/town-tablet.png`, `town-landscape.png`, `town-portrait.png`: initial gameplay framing.
- `mobile-detail/<home|shrine|city-hall|chest>-<tablet|landscape|portrait>.png`: twelve building-approach images.
- `before/results.json` and `after/results.json`: all nine region/viewport camera records match. Each set contains six desktop regional views plus three additional Town viewports.

Town building frames and entrances remain distinguishable at normal scale. Grass/flowers stay secondary to buildings and Traveler. The clerk, signs and interaction prompts remain visible. Touch controls remain outside the game canvas; building approaches confirm recognizability while the existing camera follows/clamps normally. Pixel edges remain crisp under the unchanged Phaser `pixelArt:true`, `roundPixels:true` setup. Artistic acceptance belongs to the owner, not the test suite.

## C. Six-region unity audit

Representative current gameplay images are `after/<region>-desktop.png`.

| Region | Pixel/material/palette/density/light observations | Action |
| --- | --- | --- |
| Town | Warm plaster/wood, slate/vermilion roof variation, restrained green landscaping. New leaf masses now share the Woods shading language; planted repetition suits an inhabited hub. Paving is intentionally more orderly than wilderness dirt. | Primary remaster above. |
| Memory Woods | Layered dark-to-light foliage, bark and warm trail contrasts; dense perimeter, readable story clearings. Pixel leaf motion and static trunks remain distinctive. Canopy/player/label layering remains readable. | No changes. Accepted forest density and material treatment are coherent. |
| Frontier Meadow | Airy open grass, flowers, bright dirt and small rocks; broader negative space appropriately differs from forest. Taller grass provides readable wind targets. Existing wood shares dark supports and warm highlights. | No changes. Sparse density is intentional, not an unfinished Town mismatch. |
| Melody Lake | Cool water, subdued bank greens, warm timber/lanterns, and the accepted drum/stone/stage silhouettes. Water reflections provide quiet motion, with readable shore routes. | No changes. Accepted musical landmarks and water palette are preserved. |
| Gear Valley | Brass/copper highlights, dark iron housings, timber workshop and teal roofs. High mechanical detail is concentrated in assemblies, not the entire ground. Nearest-neighbor precomputed gear frames retain a different, justified texture density. | No changes. Industrial material/lighting contrasts are intentional. |
| Forgotten Ruins | Weathered desaturated stone/moss, subdued courtyard, warm parchment and restrained brass/seals. Open manuscript and experimental aircraft retain accepted silhouettes; trial runes and particles remain distinct from UI. | No changes. Ruin cracks, low light and quiet density are appropriate. |

**Exact production changes outside Town: none.** No defect justified reopening the five accepted regional renderers. Unity is achieved by bringing Town material shading, foliage shape and pixel treatment into the existing language, not by recoloring or redrawing the other regions. Shared nature-art, original PNGs, player/NPC designs, palettes and all R1 animation parameters remain unchanged. Different tree species, wood aging and regional detail densities are intentional; consistency does not require identical props.

Existing edge-of-camera sign clipping and narrow-screen header wrapping can occur in the established camera/UI arrangement. Approaching the target reveals the full local scene. This patch does not restructure HUD, camera or information hierarchy to hide those pre-existing limitations.

## D. Engineering and preservation

Production changes are limited to:

1. `prototype/src/town-art.js`: focused static drawing helpers; five cached Town-only textures and City Hall drawing.
2. `prototype/src/visuals.js`: Town `buildArt` selects these textures; existing offsets, scene art IDs, tree placement, environment setup and animation code remain.
3. `prototype/src/city-hall.js`: only the drawing body delegates to the helper. All records/directory/office/notice text remains unchanged.

Home/shrine image dimensions remain 212×200 / 192×200; Town trees remain 80×100; ground remains 960×640. Chest keys remain `chest` / `chest-open`, preserving the existing interaction animation. No assets are regenerated every frame. Generated textures persist in Phaser's texture cache and are reused; temporary Graphics are explicitly destroyed. There are no new permanent display objects, event listeners, timers or animation callbacks.

Verified against `025d380`: region/config/collision data, dimensions, spawns, exits, controller, speed, NPC positions/dialogue, story and activity content, saves/schema, journal, Golden Trial/lessons/stones, gear renderer/mechanisms, rhythm activity, R1 nature modules, all accepted landmark renderers, Vite base and deployment workflow remain unchanged. Original PNG assets are retained as recoverable originals. No extra dependency or private media was introduced.

New tests: `test-town-art.mjs` checks exactly five cached allocations, no repeated generation across thirty calls, destruction of temporary drawing objects, finite/in-map Town Hall commands and unchanged data. `test-town-unity-visual.mjs` supplies actual screenshots and isolated metrics. Existing tests were not loosened.

## E. Performance and lifecycle

Comparable **local pre-R2 and final** Town samples were collected separately, before any concurrent heavy browser regression. Edge 156.0.4314.50, same 1440×1000 viewport; 240 requestAnimationFrame intervals per mode after settling. Normal and Reduced Motion were explicitly emulated and scene flags asserted. No video recording was running during these samples.

| Town sample | Before median / P95 ms | Final median / P95 ms |
| --- | ---: | ---: |
| Normal motion | 16.7 / 16.9 | 16.7 / 16.8 |
| Reduced Motion | 16.7 / 16.9 | 16.7 / 16.9 |

No meaningful steady-state frame-interval regression was observed. These are frame-delivery measurements, not a universal FPS/GPU-cost guarantee or cold-start benchmark. Display children remain **39**, dynamic body **1**, static bodies **9**, collider **1**, E listener **1**. Texture keys increase **23 → 28** from the five intentional caches (about 2.84MB raw RGBA before renderer overhead). They are bounded, not regenerated during transitions. Cache warmup is included before transition-growth assertions.

Nature regression performs thirty measured mixed-region transitions and verifies old effect references are disposed, counts repeat per region, E/M/I listeners stay singular and progress remains. Woods, NPC, trial and other suites independently perform twenty-transition/reopen tests. No lifecycle regressions were observed.

## F. Verification results

- **90/90 unit tests passed:** 88 established checks plus two focused Town-art checks. Includes accepted six-region map hashes.
- **133/133 final established browser regression cases passed:** Town Hall 7, Golden Trial 30, gear browser 13 (`gears-final/`), Woods 13, expansion 19, Ruins 17, mobile 10, activities 8, NPC 9, nature 7.
- **17/17 movement samples passed:** baseline, diagonal, five interactions each for home/shrine/chest. All sampled physics speeds are exactly 175 and input listeners remain singular. Pause/recovery behavior passes.
- **R1 real temporal recheck:** `logs/animation-remediation/accepted-r2/` contains desktop and portrait captures for all four R1 regions: **8 normal + 8 Reduced Motion cases passed**. Stationary player/camera, projected environmental ROIs, nine timestamped frames, lossless native strips and actual desktop recordings. Normal local effects remain detectable within five seconds; Reduced Motion ROIs have zero changes. Reviewed the strips at native scale. No new Town motion needs a separate recording.
- Final visual capture: nine consistent before/after region/viewport pairs, seven native comparisons, and twelve building-approach views. Supplementary mobile-detail capture results also have zero runtime errors.
- Production build passed: `/Johnny-Town/` unchanged, final JS `index-DaVc4-Hh.js`, 1599.44kB / gzip 398.95kB. Existing large Phaser chunk warning remains. No build/deploy configuration change.
- Actual Edge rendering, keyboard, emulated touch and viewport checks; physical mobile devices and Safari were not tested. Rhythm activity remains the existing silent visual 16-note exercise; no audio feature was introduced.

### Investigated initial gear-test failure

The first gear browser run failed the tablet weighted frame-difference assertion `abs(large*24+medium*18)<=21`. Both gear rendering and the existing test are byte-for-byte unchanged. The test samples two independently rounded endpoints: each endpoint can contribute rounding error, so a difference can exceed the single-endpoint bound of 21 even with exact time-based gear ratios. A deterministic example from the existing equations (time 34→934ms) gives frame differences 7/-8 and weighted difference 24. Evidence: `gear-test-investigation.json` and the retained first run in `gears/`.

One complete rerun of the **unmodified** test, using the original threshold, passed 13/13 across all four viewports (`gears-final/`). No gameplay or threshold was changed to obtain a pass. The initial failure is not concealed in the final count; this pre-existing test has a quantization-sensitive assertion, documented as a remaining test limitation rather than silently repaired in this art round.

## G. Local delivery

Evidence: `logs/p7c-r2/`, plus `logs/animation-remediation/accepted-r2/`. Videos remain local under the existing ignored-media rule; PNG/JSON evidence is committed. The final local SHA is supplied with the delivery message (`git rev-parse HEAD`). No remote operation, push, merge, deployment, P7D or post-P7 maintenance was performed. Ready for the owner's visual acceptance of R2; this report does not grant acceptance on the owner's behalf.
