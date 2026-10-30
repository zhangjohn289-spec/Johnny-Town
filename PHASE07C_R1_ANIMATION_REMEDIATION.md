# P7C-R1 Animation Remediation

Local corrective development, 2026-10-31. Branch: `codex/p7c-r1-animation-remediation`.
Verified starting HEAD: `d461b24788f46e6e7dbf61598a89aba36ae831e6` on `codex/p7c-r1-nature-ruins`.
No push, merge, deployment, R2, or deferred maintenance was performed. Pre-existing unrelated untracked reports remain untouched.

## Finding

The owner's observation was reproduced. The previous acceptance was insufficient: animation code and static screenshots did not establish perceptible motion.

The update callback was executing. Neither Reduced Motion nor a stopped update loop caused the reproduced problem. Inherited browser preference and scene state were both `false`; forcing `no-preference` did not rescue the original visuals.

At the starting commit:

- `nature-config.js:windStep` used a 15-second period, initially still for 11 seconds, and a one-world-pixel amplitude. Including intermediate rest states, about 86.7% of the cycle was stationary. Mobile projection made that displacement less than one CSS pixel.
- `nature-effects.js` moved only a 7 x 3 highlight on selected canopies; it did not animate a recognizable leaf silhouette. Only six trees were selected, mostly outside the central touch viewport. The portrait baseline contained only one complete canopy target.
- Meadow blades were 6–10 pixels tall, with only their tiny tips displaced. Lake waves were 8–16 pixels wide, one pixel thick, with maximum alpha .38. They changed, but were practically easy to miss.
- Ruins dust was 2 x 1 pixels at .28 alpha, absent for 70% of its 17-second cycle, and positioned mostly away from the ordinary courtyard view.

Evidence before editing: `logs/animation-remediation/before/`. These captures retain the original visuals, preference checks, stationary camera/player checks, temporal frames, and four desktop recordings.

## Repair and refinement

Only two production modules changed: `prototype/src/nature-config.js` and `prototype/src/nature-effects.js`.

| Region | Final normal-mode animation |
| --- | --- |
| Memory Woods | Fixed-root branches with three pointed pixel leaves, moving their silhouettes rather than only highlights. Up to 24 existing interior canopies receive patches; trunks and accepted tree textures stay fixed. Entry and central touch views both contain several complete targets. |
| Frontier Meadow | Selected 18–24-pixel stems bend from fixed roots. Three-pixel tip amplitude and staggered phases convey a breeze. Priority placements are visible near ordinary routes, retain clearance from NPCs, paths, collision geometry and interaction doors. Twelve clusters maximum. |
| Melody Lake | Eight local expanding broken rings, 12–36 pixels wide, with restrained drift and gradual alpha changes; separate drifting broken reflections provide a second water effect. Selected existing reeds also bend. Shoreline, water geometry, pier and interactions are unchanged. |
| Forgotten Ruins | Three sparse dust tracks in the existing courtyard; 2 x 2 particles, alpha .58, gentle ±8 horizontal / 26 vertical travel. No architectural additions or Golden Stones changes. |

Wind is absolute-time based: periods 6.2 / 6.55 / 6.9 seconds, staggered seed offsets, sine-shaped bend and return, a short rest, integer ±3 displacement. Unit coverage checks every sampled five-second window has meaningful movement and consecutive 17ms samples never jump several pixels.

Water cycles take 5.4–6.26 seconds, with independent reflection timing. Dust cycles take 7.6 seconds, active for 82% of a cycle. No full-surface texture movement, randomized flickering, new dependencies, or per-frame texture generation.

Meaningful visual iterations retained locally:

1. `pass1`: increased motion scale and implemented actual stems/leaves and complementary water effects. Native-size review found the first outlined leaf patches too blocky.
2. `accepted`: tapered and softened the leaves using the existing greens. The central view improved, but the initial selection still wasted targets on upper/border trees.
3. `accepted-final`: moved selection to existing interior canopies, with no tree relocation. Re-ran all 16 region/viewport temporal cases. `accepted-entry` separately verifies ordinary forest arrival on desktop and portrait; four full branch targets are visible in the portrait entry view.

Reviewed full gameplay frames and native-size temporal strips, including desktop forest, portrait forest entrance and lake, tablet grass, landscape lake and quiet ruins dust. Leaves change their silhouette/position; stems visibly change curvature; ring width and reflection position change. Camera/player remain fixed. The result is calm pixel-stepped motion, not a moving background or whole-tree shaking.

## Dynamic evidence

Final desktop recordings are real eight-second canvas recordings captured in Edge with `MediaRecorder` / VP8 at 30fps. Playback review revealed compression softness at the start of the initial 1.2Mbps recording; a dedicated `accepted-recordings` pass re-captures the same final implementation at a requested 8Mbps. No external/private media was used. Videos remain local and are intentionally ignored by the existing video exclusion rule; PNG/JSON evidence and the reproducible harness are committed.

| Region | Final recording | Visible target |
| --- | --- | --- |
| Woods | `logs/animation-remediation/accepted-recordings/woods-desktop/normal.webm` | Small green leaf clusters on several fixed canopies |
| Lake | `logs/animation-remediation/accepted-recordings/lake-desktop/normal.webm` | Expanding water arcs and sliding broken reflections |
| Meadow | `logs/animation-remediation/accepted-recordings/meadow-desktop/normal.webm` | Tall local grass stems bending in different phases |
| Ruins | `logs/animation-remediation/accepted-recordings/ruins-desktop/normal.webm` | Sparse pale dust around the courtyard |

For the before version, replace `accepted-recordings` with `before`. The extra forest entry recording is `logs/animation-remediation/accepted-entry/woods-desktop/normal.webm`.

Every final region/viewport directory also contains nine full-page temporal frames, three Reduced Motion frames, `native-roi-sequence.png` (unscaled crops of frames 0/4/8), and `analysis.json` with timestamps, projected element rectangles, camera, canvas dimensions, preference state and comparisons. Raw PNG frames are lossless; lossy recordings supplement them.

The higher-quality re-recording pass also passed all four normal/reduced temporal checks. `test-motion-recordings.mjs` then decoded and played all four delivered clips, checking sustained frame delivery and capturing actual playback at approximately .5, 3 and 6 seconds. **4/4 playback checks passed**; results and decoded images are in `logs/animation-remediation/recording-playback/`. Reviewed decoded forest, meadow and lake frames as well as the lossless source strips. Playback diagnostics under screenshot instrumentation report 0–20 dropped frames at the six-second samples; these are not used as game performance measurements. This is not a zero-drop video-playback certification.

### Same-location comparison

`logs/animation-remediation/same-roi-comparison.json` applies the **same final effect rectangles** to original and final temporal frames with matching camera/canvas positions. Each version is compared to its own first frame, so static redesign differences cannot inflate temporal motion. Counts below are the maximum salient changed pixels within one intended effect rectangle, not whole-screen differences.

| Region | Desktop before → after | Portrait before → after |
| --- | ---: | ---: |
| Woods | 0 → 316 | 0 → 97 |
| Lake | 26 → 221 | 7 → 68 |
| Meadow | 31 → 274 | 8 → 84 |
| Ruins | 0 → 14 | 0 → 7 |

These counts are an invisibility regression guard, **not proof of human perception**. Native-scale temporal image inspection supplies the qualitative review; the owner should make the final dynamic visual acceptance from the running preview/recordings.

The temporal harness requires multiple separate local targets to change within five seconds: at least three canopy patches, two water/grass patches, and one quieter dust target. All final cases meet this guard at the first sampled interval (roughly .60–.77 seconds); this is sampling evidence, not a measured human recognition time.

## Motion modes and viewport coverage

`prototype/test-motion-perception.mjs` independently tests:

- Normal: `page.emulateMedia({reducedMotion:'no-preference'})`, then asserts both `matchMedia('(prefers-reduced-motion: reduce)').matches` and `scene.reduced` are false.
- Reduced: explicitly emulates `reduce`, waits until the actual scene flag is true, then captures three frames. The intended effect rectangles have **zero changed pixels**. Dust/leaves are suppressed and other ambient shapes freeze; the complete static environment remains.
- Inherited setting is recorded before emulation in each isolated context. It was false in this environment, including the original baseline.
- Every frame asserts identical player coordinates and camera drift below .01 world pixels. Comparisons use only projected environmental ROIs, clipped to the canvas, excluding unrelated page/UI animation.

Final matrix: desktop 1440 x 1000, tablet 1024 x 768, phone landscape 844 x 390, phone portrait 390 x 844. **16/16 normal plus 16/16 reduced cases passed**, with an extra **2 normal + 2 reduced** forest-entry cases. No browser runtime errors. Touch controls and important interface elements remain unobscured.

## Verification and resource lifecycle

Production build passed; generated JS is `index-SAAdbnyJ.js`. Both local previews 4201 and 4501 were verified to serve this final bundle under `/Johnny-Town/`. Vite base and deployment configuration are unchanged. No private-media endpoint/path is included in the public production output (existing isolation checks pass).

Unit suite: **88/88 passed**, including all six map-data hashes against the accepted baseline, bounded effect plans, water safety footprint, five-second wind changes, entry/central canopy coverage, Reduced Motion, ambient callback composition and shutdown disposal. The former test requiring >80% wind stillness was replaced because that assertion enforced the diagnosed invisibility.

Final browser regression results live under `logs/animation-remediation/regression-final/`:

| Suite | Passed |
| --- | ---: |
| Golden Trial five-lesson progression / rereads / saves / touch | 30 |
| Memory Woods stories, routes, camera, collisions, introduction, journal, saves | 13 |
| World expansion / Meadow / Lake / Valley routes and stories | 19 |
| Forgotten Ruins Easter eggs / compatibility / routes | 17 |
| P7A gear art, mechanisms and all four viewport modes | 13 |
| Rhythm and gear activities including real timed hits and touch | 8 |
| City Hall, treasure chest, shrine, saves and town routes | 7 |
| Mobile control and popup regressions | 10 |
| NPC branches, fallback, touch and lifecycle | 9 |
| Nature effects, Reduced Motion, layering, lifecycle and progress | 7 |
| **Total** | **133** |

Movement regression separately passed **17/17 samples** (baseline, diagonal, five repetitions each for home/shrine/chest). All sampled physics speeds are exactly 175 and E listener count remains one; pause and resume checks pass. Evidence: `logs/animation-remediation/movement-speed-results.json`.

Thirty measured mixed-region transitions, after cache warmup, preserve per-region child/texture/body/collider/listener counts. E/M/I each have one handler. Each old nature reference is explicitly checked as disposed, and invoking its update after shutdown is harmless. Target regions retain exactly four Graphics objects; Town and Valley retain none. P7A/P7B and NPC suites independently repeat twenty transitions/rereads. No new timers, animation loops, textures or listeners were introduced by the repair.

### Performance

After all concurrent regression browsers exited, the final build was sampled separately in Edge 156.0.4314.50 at desktop gameplay scale, explicitly in normal motion mode. Each region uses 120 requestAnimationFrame samples after settling, without video recording. Evidence: `logs/animation-remediation/performance/results.json`. Comparison is with the **historical** accepted P7C-R1 capture at `logs/phase07c-r1/accepted/results.json`, using the same browser version and capture procedure; this is not a simultaneous controlled hardware benchmark.

| Region | Historical → final FPS | Historical → final P95 frame interval (ms) | Final children / textures |
| --- | ---: | ---: | ---: |
| Woods | 59.81 → 59.25 | 17.0 → 17.1 | 241 / 34 |
| Lake | 59.81 → 59.63 | 17.1 → 17.2 | 65 / 21 |
| Meadow | 59.58 → 59.63 | 17.2 → 17.0 | 64 / 24 |
| Ruins | 59.30 → 59.58 | 16.9 → 17.0 | 62 / 35 |

All median intervals remain 16.7ms. No meaningful frame-interval regression was observed in this sample; this measures delivery cadence, not isolated GPU/CPU render cost. Children, texture, physics-body and E-listener counts exactly match the historical region samples. Forest foliage draw commands increased from 6 tiny highlight patches to 24 leaf clusters inside the same Graphics layer. Heap snapshots vary with garbage collection and are not treated as proof of memory improvement. The warmed transition assertions supply the resource-growth check.

## Files and scope protection

- `prototype/src/nature-config.js`: localized effect placement, caps, wind timing.
- `prototype/src/nature-effects.js`: bending stems, leaf silhouettes, water and dust commands; existing lifecycle preserved.
- `prototype/test-nature.mjs`: stronger timing/footprint/viewport regression checks.
- `prototype/test-motion-perception.mjs`: temporal captures, true recordings, ROI comparison and mode assertions.
- `prototype/test-motion-recordings.mjs`: decode/playback verification of the four delivered recordings, with timestamped video playback frames.
- `prototype/test-nature-browser.mjs`: output-directory override only.
- `prototype/test-nature-visual.mjs`: output-directory override and explicit normal-motion capture.
- `logs/animation-remediation/`: before/iteration/final evidence, comparisons, test logs, performance data.
- This corrective report.

Verified unchanged from `d461b24`: map data, world store, player controller, touch controls, NPC data, UI/dialog/journal, static nature art, Woods/Lake/Meadow/Ruins renderers, gear art and Valley renderer, Golden Trial and Stones, Vite config and Pages workflow. Existing unrelated untracked documents were not staged or edited.

## Limits and acceptance recommendation

Actual Edge rendering, keyboard interaction and emulated touch/viewports were exercised. Physical phones/tablets, Safari, and a separate Chrome installation were not tested. Motion remains intentionally stepped and localized; not every tree or grass tile moves. Ruins dust is deliberately much quieter. Static images cannot communicate playback smoothness; the local recordings and preview are supplied for the owner's review.

The production bundle retains the existing large Phaser chunk warning; no dependency or deployment changes were made. Local recordings contain only the game's generated canvas and are not part of the production build.

The corrected version is ready for the owner's **dynamic visual re-acceptance**, not a claim that the owner has already accepted it. P7C-R2 and all explicitly deferred items remain untouched.
