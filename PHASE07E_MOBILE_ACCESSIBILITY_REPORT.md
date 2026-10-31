# P7E — Mobile, Accessibility & UX Hardening

2026-10-31. Baseline branch `codex/p7d-npc-personal-storytelling`, accepted P7D commit `e55c6f8e31281d2b67cdd2d0729d8242e6cb08c5`. Development branch `codex/p7e-mobile-accessibility`. Local development only; no push, merge, fetch, deployment or P7F. Final local SHA is supplied in the delivery message (`git rev-parse HEAD`). Previously untracked unrelated release reports are preserved.

## Findings and corrections

Initial reproduction data/screenshots: `logs/p7e/before/`; issue inventory: `logs/p7e/issue-inventory.md`.

| Priority | Confirmed issue | Correction and verification |
| --- | --- | --- |
| P1 | Focusing a HUD button then holding D still moved Traveler at 175. Phaser also kept consuming native arrow-key defaults during HTML interaction. | Scene-owned keyboard focus ownership suppresses keyboard movement while operating HTML controls and releases global capture. Tab or a pointer click can focus the explicitly labelled game surface. Joystick input stays independent and normalized. |
| P1 | In 667×375/DPR2, the long introduction scrolled the entire dialog; sticky close overlaid a paragraph. Original panel client/scroll heights were 341/633px. | Reuse the existing activity/trial flex-layout principle for every modal: only body scrolls, header/close stay outside it. Final panel client/scroll heights are both 341px; body has a 178px viewport and 485px scroll content. Text is preserved. Native keyboard End and simulated finger scrolling work. |
| P1 | Locked journal text, 13px, had relatively low contrast. | Darken only `.journal-locked` from rgb(120,117,97) to rgb(98,98,79). Calculated solid-parchment contrast improves approximately 4.12:1 → 5.51:1. This is a local color calculation, not a WCAG certification. |
| P2 | Pale keyboard focus outline was weak against parchment. | Dialog-only dark outline; visible game-surface focus ring. Header treatment retained. |
| Deferred | Chest has a limited rear approach. | Real joystick route verifies supported front interaction and safe external-link UI without opening private media. Rear approach records no chest target. Radius, doors and collision are unchanged. |

No confirmed P0 blocker remains in the tested environment. The existing joystick already handled release/cancel/blur/resize; its implementation was not rewritten.

### Regression-driven refinement

The first focus patch exposed two omissions in the established Woods/activity tests: cached focus ownership could remain stale after a native dialog closed to document body, and “开始自由探索” returned focus to the HUD instead of the world. Both were corrected in production code, not by weakening tests. A scene-owned dialog-close listener now synchronizes focus ownership, and the explicit exploration action focuses the game. Ordinary dismissal still restores the prior trigger. Initial failing logs remain under `logs/p7e/woods/` and `activities/`; final results are separately under `final/`.

New test setup was also corrected to use a genuinely scrollable short viewport and to distinguish CDP touch cancellation from an individually dispatched pointer release. Attempts to force native capture-loss through Headless CDP did not reliably emit that event; final capture-loss checks explicitly dispatch the event and are labelled simulated. They are not claimed as physical/native capture-loss coverage.

## Files changed

- `prototype/src/input-focus.js`: event-driven, scene-owned focus ownership and capture synchronization; all listeners removed on shutdown.
- `prototype/src/main.js`: bind that helper after existing touch setup. Existing E/M/I shortcuts and interaction code remain unchanged.
- `prototype/src/player-controller.js`: suppress keyboard contribution when HTML owns focus; touch vector and original normalization/175 speed remain.
- `prototype/src/ui.js`: explicit free-exploration focus return; ordinary modal return behavior retained. No content changed.
- `prototype/index.html`: focusable, labelled game and scrollable dialogue body; existing movement instructions used as description.
- `prototype/src/style.css`: body-only modal scrolling, close/header separation, targeted contrast/focus styles.
- Seven focused Node/Playwright scripts: `test-input-focus.mjs`, `test-ux-audit.mjs`, `test-ux-hardening.mjs`, `test-ux-lifecycle.mjs`, `test-ux-performance.mjs`, `test-touch-journey.mjs`, `test-touch-rhythm.mjs`.
- This report and `logs/p7e/` evidence. No dependency, framework, artwork, narrative or save migration added.

All accepted region/landmark art, P7D dialogue text, NPC positions/sprites/idle, maps, topology, collision, spawns/exits, progression/schema, journal mechanics, five lesson texts, gear animation equations and rhythm sequence/scoring remain unchanged. No existing test threshold or gameplay test was edited.

## Actual input and player journeys

`journey/results.json`: **16 passed records**. On 844×390/DPR2, a fresh browser uses CDP-generated touch dragging on the actual joystick and taps only—no keyboard and no player teleport during the journey—to travel Town → Woods → Town → Meadow → Lake → Meadow → Valley → Meadow → Ruins → Meadow → Town, read all four NPCs, open the journal, and retain six discovered regions on reload. The existing test route helper plans the safe test path; no navigation system was added to the game. The chest front route also works; its recorded rear position (approximately 735,406) has no interaction target, as expected from the unchanged door radius. Side/back convenience remains deferred.

`touch-rhythm/results.json`: **3/3 full touch-only 16-note exercises** pass: 390×844/DPR3 normal, 844×390/DPR2 Reduced Motion, 1024×768/DPR2 normal. Each records exactly 16 click events and a 16/16 result, replay/exit and saved completion after reload. These cases start from an isolated Lake fixture; they do not pretend to be complete cross-world journeys. Existing desktop keyboard rhythm and touch cancellation tests also pass. The rhythm activity is intentionally silent; there is no implemented audio output to certify, and no Audio Pass or voice acting was added.

`final/golden/`: all five lessons, exact text, sequence, final animation/save/replay and touch approaches pass at desktop, phone portrait/landscape and tablet portrait. The tablet case switches to Reduced Motion for lesson five/completion and verifies the completion animation is suppressed while the finished information persists.

`final/narrative/`: **48/48 P7D text/state cases** pass across desktop, tablet landscape, phone landscape and portrait. Both optional topics, first/repeat and eight progress conditions remain available. Existing NPC tests additionally walk to each character, verify both branches, close/reopen and resume movement. Text was not shortened to make it fit.

## Verification matrix

P = passed the named tested scope. NT = not tested. This is a scenario matrix, **not** a claim that every DPR × state × mode × browser combination was executed. Where sizes/DPR differ between suites, the cell states its limited coverage; all unlisted cross-combinations remain NT.

| Scenario / actual dimensions | Movement | Interaction | Dialog | Journal | Puzzle | Rhythm | UI layout | Save/reload | Regions | Performance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop keyboard 1440×1000, DPR1, normal | P | P | P | P | P trial/gears | P keyboard completion | P | P | P six-region regressions | P isolated |
| Desktop touch emulation 1440×1000, DPR1 | P cardinal/diagonal/cancel | P HUD | P intro | P | NT | NT | P | NT | NT | NT |
| Phone portrait 390×844, DPR3, normal | P stress/10s continuous direction changes | P | P long intro/rhythm | P | NT at DPR3 | P full 16-note touch | P | P rhythm reload | NT at this exact DPR/size | P isolated |
| Phone portrait 390×844, DPR1 | P trial approach | P NPC/trial/gears | P full NPC/trial text | P trial journal | P all lessons/gears | P tap/cancel; full exercise separately at DPR3 | P | P trial reload | NT full journey at DPR1 | NT |
| Phone landscape 667×375, DPR2 | P | P HUD | P long scrolling | P | NT at 667×375 | NT at 667×375 | P | NT | NT | NT |
| Phone landscape 844×390, DPR2, normal | P physical joystick journey | P four NPCs/chest | P | P | NT exact DPR2 trial | Full touch run in reduced mode below | P | P | P six-region joystick journey | NT |
| Phone landscape 844×390, DPR1 | P trial approach | P trial/gears/NPC | P | P trial journal | P all lessons/gears | P existing tap/cancel | P | P trial reload | NT complete six-region route | NT |
| Tablet portrait 768×1024, DPR2 | P stress/rotation | P HUD | P intro scroll | P | NT at DPR2 | NT at DPR2 | P | NT | NT | NT |
| Tablet portrait 768×1024, DPR1 | P trial approach | P trial/gears | P long lessons | P | P full route, lesson five reduced | P existing tap/cancel | P | P trial reload | NT six-region journey | NT |
| Tablet landscape 1024×768, DPR2 | P stress/rotation | P HUD/rhythm | P | P | NT exact DPR2 trial | P full 16-note touch | P | P rhythm reload | NT | NT |
| Tablet landscape 1024×768, DPR1 | NT continuous motion | P NPC fixture interactions | P all P7D branches | NT | P mechanical browser checks use existing supported input | NT | P | P unchanged NPC save bytes | NT | NT |
| Reduced Motion representative scenarios | P existing movement/modal recovery checks | P | P Town/NPC/UI and trial | P existing journal checks, not all views | P trial completion/gears | P 844×390/DPR2 full touch | P sampled | P trial/rhythm | NT dedicated reduced-only six-region transition journey | P desktop/portrait |
| Fresh browser state | P | P | P | P | P | P | P | P | P | P |
| Existing save fixtures | P regressions | P | P contextual NPC | P | P legacy trial/gears | P existing flags | P sampled | P normalization/corrupt/old fixtures | P regressions | NT every legacy fixture |
| Real iPhone/iPad/Android, Safari/WebKit, separate Chrome | NT | NT | NT | NT | NT | NT | NT | NT | NT | NT |

Actual rendering engine: **Microsoft Edge 156.0.4314.50 (Chromium), headless Windows**. Native browser touch events are generated by CDP/Playwright, not physical fingers. Viewport rotation is `setViewportSize`, not a hardware orientation sensor. DPR1/2/3 were exercised. Safe-area CSS remains present, but real notch/browser-toolbar insets are not reproduced by these tests. No Safari/iPhone/iPad claim is made; no additional browser runtime was downloaded.

## Accessibility and input reliability

`hardening/results.json` has **18 functional checks plus five layout measurement records**, all passing. It covers native keyboard scrolling, explicit game focus, pointer-captured drag outside the stick, cardinal/diagonal input, multi-touch presence, noncontrolling-pointer release simulation, touchEnd/touchCancel, resize, synthetic blur/pagehide and simulated lost capture. A phone-portrait case keeps one control pointer down for ten seconds with forty direction changes, then verifies immediate stopping. Existing mixed keyboard/touch normalization remains 175.

Town and clerk idle are sampled in normal and Reduced Motion: normal idle shows two integer positions, reduced remains fixed; Town motes clear, and modal animation name becomes `none`. Existing nature tests verify all four accepted ambient systems change normally and freeze when reduced. Puzzle information remains visible; reduced completion is tested by the trial suite. No animation was disabled to improve performance.

Success/failure/availability already include text, numbers, symbols and status feedback; no core information requires hearing audio or subtle colors. Quick Introduction remains available through an always-present HTML button, I shortcut or touch, without completing activities. No personal-introduction rewrite was performed. Focusable scroll content lets keyboard users access long text; native dialog semantics remain. This is reasonable scoped accessibility hardening, **not certification of full screen-reader playability of a Phaser world or full WCAG compliance**.

## Lifecycle, backgrounding and performance

`lifecycle/results.json`: after ten warmup transitions, **30 measured active-input mixed-region transitions** keep per-region object/texture/physics counts stable. CDP event-listener inspection shows document focusin/focusout each one, game focus pointerdown one, stick handlers one each, touch-interact click one, and panel close two (existing UI plus scene-owned focus synchronization). Held CDP movement plus programmatic action click tests scene changes before the control pointer ends; new scene input is zero. This action-click component is explicitly simulated, separate from the pure touch-only journey.

The attempted headless tab switch did **not** produce a hidden page or trusted blur/visibility event. Therefore native browser backgrounding is **NT**, not counted as passed; the recorded active vector at that moment is not evidence of a hidden-page bug because the page stayed visible. Explicit simulated visibility loss did clear input. Physical background/restore, real individual-finger lift behavior and native capture-loss remain on the manual checklist. No long-duration heap/thermal claim is made; measured listeners/objects are bounded.

Performance uses an isolated rebuilt copy of the exact P7D commit (original JS `index-BD6pwxnq.js`) under ignored `prototype/tmp/p7e-before/`, not a modified live baseline. Final and baseline previews were measured sequentially in the same Edge environment, 240 rAF intervals after 1.7s settle per row. **No other test browser was running during the final performance run.**

| Town sample | P7D median/P95 ms | Final P7E median/P95 ms |
| --- | ---: | ---: |
| Desktop 1440×1000 DPR1 normal | 16.7 / 16.9 | 16.7 / 17.0 |
| Desktop reduced | 16.7 / 17.0 | 16.7 / 16.9 |
| Phone emulation 390×844 DPR3 normal | 16.7 / 17.0 | 16.7 / 17.0 |
| Phone emulation reduced | 16.7 / 16.9 | 16.7 / 17.0 |

No meaningful steady-state interval regression observed. This is frame-delivery cadence, not actual mobile hardware performance or isolated GPU cost. Town retains 39 display children, 28 textures, one dynamic body, nine static bodies and one E listener. Focus checks are event-driven; no polling loop or new animation timer was introduced. Raw metrics: `performance/results.json`.

## Final regression and build

- **94/94 unit tests**: established suites plus focused input-ownership/cleanup checks.
- **133/133 final established browser checks** under `final/`: Golden 30, gears 13, Woods 13, expansion 19, Ruins 17, Town Hall 7, mobile 10, NPC 9, activities 8, nature 7. The known gear quantization assertion did not fail this final run; its thresholds and functioning mechanisms remain unchanged.
- **48/48 P7D narrative cases** under `final/narrative/`.
- **17/17 movement samples** under `final/movement-speed-results.json`, sampled speed exactly 175.
- **18 focused hardening checks**, five layout records, **3 full-touch rhythm completions**, **16 touch-journey records**, **2 lifecycle checks**; native headless background observation separately marked NT.
- Production build passed, base `/Johnny-Town/` unchanged. Final JS `index-BxB2dTFJ.js`, CSS `index-CMFOfEJZ.css`; JS 1604.10kB / gzip 401.58kB. Existing large Phaser chunk warning remains. No private media, credentials or local private-video endpoint is added to public output.

### Actual evidence paths

All paths below are under `logs/p7e/`:

- Before/after bug: `before/landscape-intro.png`, `after/landscape-intro.png`, respective `results.json`.
- Mobile Town/journal/scrolling: `hardening/phone-portrait-town.png`, `phone-landscape-intro-scroll.png`, `phone-portrait-journal.png`.
- Keyboard scrolling and reduced UI: `hardening/keyboard-scroll.png`, `reduced-motion-dialog.png`.
- NPC: `final/narrative/forest-archivist-portrait-0.png` and other NPC/view/variant images.
- Long trial: `final/golden/mobile-lesson-5.png`, `landscape-clue-5.png`, `tablet-lesson-5.png`.
- Touch rhythm: `touch-rhythm/portrait-playing.png`, `landscape-result.png`, `tablet-result.png`.
- Gear interaction/puzzle: `final/activities/gears-390.png`, `final/gears/` screenshots.
- Six-region journey and supported chest route: `journey/six-region-journal.png`, `chest-supported-route.png`.

## Owner real-device checklist

Use a separately authorized local preview or an already available build; this phase does not publish one. On an actual phone/tablet, record browser/OS, orientation and zoom:

1. Move cardinally/diagonally for at least 30 seconds; drag off-stick, lift the controlling finger, then restart. Repeat while another finger taps interaction. No continued drift.
2. Rotate while holding the stick; release/restart. Controls/camera must remain usable and motion must stop on rotation.
3. Background/restore, lock/unlock and change browser tabs while moving. Confirm no old direction resumes. This is an important unverified native scenario.
4. Test portrait/landscape with browser toolbar shown/hidden and a notched safe area. Scroll all introduction/journal text; close must remain separate and tappable.
5. Read both topics and reopen all four NPCs; check text, focus return and motion recovery.
6. Complete the five trial lessons with touch, open long clues, dismiss and refresh after completion.
7. Finish all sixteen rhythm taps, replay/cancel, close and move again; no audio is required. Try the gear activity and supported front chest route.
8. Enable OS Reduced Motion, reload and inspect foliage/water/grass/motes/NPC/completion/UI. Important information must remain available.
9. On a desktop or attached keyboard, Tab through the HUD to the game, open/close dialogs and scroll their content. UI focus must not move Traveler; “开始自由探索” must return to gameplay.
10. Optionally use VoiceOver/TalkBack/NVDA to check the HTML Quick Introduction/dialog text route. Full nonvisual map traversal is not claimed.

Remaining limits: actual Safari/WebKit/Chrome/physical devices, real backgrounding and notch behavior need owner verification. The chest rear-direction convenience issue, audio pass and all deferred content/character work remain unchanged. No P7F or release actions were begun. Ready for owner acceptance within the accurately stated test coverage.
