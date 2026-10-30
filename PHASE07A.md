# P7A — Gear Valley: Clockwork Remaster

Local development and verification, 2026-10-30 (Asia/Hong_Kong).

Branch: `codex/p7a-clockwork-remaster`. Base: published `381f9a0917cf1aed7462d80380dd0a23e80c3fc4`.
No merge, push, workflow dispatch, dependency change or deployment performed.
Pre-existing untracked Phase 05E/06F reports and evidence remain untouched.

## Scope and implementation

Only Gear Valley's rendering changes. `region-renderer.js` adds an import and a
valley-only dispatch; all other regions retain their established renderers.
The complete serialized valley data (including paths, bounds, collisions,
spawns, exits and interaction records) retains its running-baseline SHA-256:
`a727da9931aee9f658326bba25b3bbf617592f2289db23551c7eca1394e0a877`.
The new test locks this baseline independently of rendering changes.

- `prototype/src/gear-art.js`: original raster gears, 12/18/24 teeth, continuous
  toothed outline with sloping flanks, rim, four/six spokes, hub and axle opening.
  Brass highlights, copper shadows and a dark outline are rasterized with binary
  alpha at native resolution. No external artwork or dependency is introduced.
- Three cached canvas atlases contain 192 frames each. Animation changes frames,
  never GPU sprite rotation; lighting remains in world space. Texture filtering
  is explicitly nearest-neighbor. No texture generation occurs during update.
- Pitch radii equal tooth counts. Paired centers are separated by summed pitch
  radii: 42px transmission, 30px blueprint, 24px puzzle display. External pairs
  counter-rotate; angular speed scales inversely with tooth count. `meshPhase`
  aligns tooth-to-gap contact. Time in milliseconds drives motion.
- `prototype/src/valley-renderer.js`: dedicated renderer with reusable plates,
  rivets, pipes, pressure gauges and lamps. Existing story installations and the
  puzzle workbench gain supports, shafts and industrial housings. The workshop
  gains a teal roof, copper chimney, lit windows and a blueprint workbench.
  Boiler details and spare parts occupy existing rock shelves, outside paths.
- A single scene-owned Graphics object draws restrained periodic chimney steam.
  Reduced Motion freezes gears and clears steam. No additional timer, event
  listener, physics body or independent animation loop is registered. Phaser
  destroys display objects on shutdown; three gear atlases and the background
  remain cached and are reused.

Gameplay, activity rules, NPC data, journal, store schema/migration, controls,
map data, HTML/CSS, Vite base and deployment workflow are unchanged. The old
generic landscape renderer is retained for unrelated regions and baseline
reference; Gear Valley now selects its dedicated renderer.

## Visual review and refinement

Screenshots are rendered by Edge 156.0.4314.50, using isolated test profiles,
at normal gameplay scale. They are not design mockups.

1. **Baseline** — `logs/phase07a/before-{desktop,tablet,mobile}.png`.
   The original has disc-like eight-square-tooth gears, flat blocks, weak
   mechanical connections and a sparse olive terrain treatment.
2. **Iteration 1** — `logs/phase07a/iteration1-*.png`.
   Replaced placeholder gears with raster gear assemblies; rebuilt workshop,
   transmission and blueprint station; added metal shading, pressure gauges,
   copper pipe route, lit windows and cobbled road texture. Actual screenshots
   exposed an undersized left gear, an unsupported roof cog and disconnected
   peripheral scenery.
3. **Iteration 2 / final** — `logs/phase07a/final-dev-*.png`.
   Enlarged the left installation to the large gear, added a roof-cog bearing
   plate, boiler bank, retaining-wall braces and spare-part crates. Additional
   details remain subordinate to the road, player and interactive landmarks.
   Viewed desktop, tablet, phone portrait and landscape; visited each of the
   five existing interactions to inspect close gameplay views. No new scenery
   blocks a route or introduces collision geometry.
4. **Transmission inspection** — `logs/phase07a/final/mesh-0.png` through
   `mesh-5.png`: six deterministic moments, 800ms apart, of the actual production
   scene. `mesh-inspection-3x.png` is a nearest-neighbor inspection crop. Checked
   tooth gaps, contact, spoke motion, fixed centers and consistent lighting.
   The pitch-contact silhouettes remain distinct without severe intersections.
   Motion is deliberately slow; individual pixel transitions remain visible.

The before / iteration 1 / final-dev screenshots share the same development
server setup, viewport and player position for fair comparisons. Independently,
`logs/phase07a/final/` contains production-preview screenshots at 1440×1000,
1024×768, 390×844 and 844×390, including each story and puzzle site. Existing
development/production stylesheet-order differences affect outer presentation;
P7A does not change those styles or use that difference as a claimed improvement.

## Verification results

| Check | Passed | Evidence |
| --- | ---: | --- |
| All existing unit suites plus gear/geometry tests | 61/61 | `logs/phase07a/unit-tests.txt` |
| Existing region paths, story interactions, journal, persistence, collision/camera and 20 transitions | 19/19 | `logs/phase07a/expansion/results.json` |
| Existing rhythm and gear puzzle: failure, reset, solution, retry, progress and touch | 8/8 | `logs/phase07a/activities/results.json` |
| NPC dialogue including mechanical apprentice, cleanup and touch | 9/9 | `logs/phase07a/npc/results.json` |
| Mobile/tablet viewports, touch cancel, shrine/chest, old save and refresh | 10/10 | `logs/phase07a/mobile/results.json` |
| P7A gameplay screenshots, five interactions per viewport, actual atlas filtering/ratio, Reduced Motion | 13/13 | `logs/phase07a/final/results.json` |
| Movement measurements: baseline, diagonal, 5× each original modal | 17 samples | `logs/phase07a/movement-speed-results.json` |
| Production build and Pages asset-path check | Pass | `/Johnny-Town/assets/...` |

There are **59 browser checks** in the five suites above; movement samples are
reported separately rather than inflating that count. All recorded page-error
arrays are empty. All movement samples have minimum/maximum physical speed
175px/s and exactly one E listener. Old saves are synthetic fixtures, not private
visitor data. Existing unit suites cover V1/V2 migration, corrupt saves and
blocked storage; browser tests cover older V2 progress, journal and reload.

After 20 transitions, repeated visits retain stable per-region object, texture,
body and listener counts. Valley: 50 children, 27 cached textures in the
cross-region test, 1 dynamic body, 11 static bodies, 1 collider, and one each of
E/M/I listeners. First direct-entry baseline/final child counts are 42/50; the
increase is bounded scenery, not accumulating objects. Frame-rate sample:
59.8 FPS in the test environment. This is a short sample, not a hardware benchmark.

Raw RGBA gear-atlas storage is 5,529,600 bytes (about 5.27 MiB), excluding canvas
and renderer overhead. Atlases are generated once per game instance; the cache
test confirms exactly three atlas builds across repeated setup calls.
The final production bundle is approximately 1,576.9kB / 388.6kB gzip, with no
new downloaded art or dependencies. Vite retains the existing >500kB bundle
warning, primarily Phaser; P7A does not restructure unrelated application code.
Production isolation tests confirm no private media or development serving
configuration enters the build.

## Reproduce

From the project root, prepend Node's installed directory to PATH if necessary:

```powershell
$env:PATH='C:\Program Files\nodejs;'+$env:PATH
npm.cmd --prefix prototype run build
npm.cmd --prefix prototype run preview -- --port 4201 --strictPort
# Separate terminal, project root:
node prototype/test-gear-valley-browser.mjs
node --test prototype/test-gear-art.mjs
node prototype/test-static.mjs
```

The browser harness uses the same installed Playwright runtime as the existing
project tests. Optional variables: `TOWN_URL`, `QA_DIR`, `BROWSER_CHANNEL`.
The evidence-only `logs/phase07a/capture-before.cjs` captures a named comparison
pass from port 4202 (`PASS` defaults to `before`; use a new name to preserve it).

## Limits and release boundary

- Phone and tablet checks use Chromium touch emulation, not physical devices.
  Edge was available; Chrome was not present at either standard installation
  location. Safari/iOS rendering and low-end device performance are unverified.
- Portrait gameplay retains the established small canvas and surrounding space;
  tiny rim/rivet details are less legible there. Landscape/tablet show more
  detail. P7A preserves the existing camera scale and mobile-control layout.
- Gears use stylized pixel tooth flanks, not engineering-grade involute geometry.
  Rotational sampling is discrete, intentionally preserving crisp pixel edges.
- The first sandboxed Edge launch failed before the page opened; a subsequent
  launch could not reach the sandboxed preview. Running the local-only server
  and test browser in the same permitted environment resolved setup. No game
  functionality was modified to bypass a failing test.
- This is a local P7A result. No remote operations, merge, publishing or P7B work
  were performed. Existing private media stays in the ignored local environment;
  no video was copied into code, assets, evidence or production output.
