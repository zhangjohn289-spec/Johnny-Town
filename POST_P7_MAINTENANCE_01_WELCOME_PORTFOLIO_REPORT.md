# Post-P7 Maintenance No.1 — Welcome & Personal Portfolio

Local review candidate. Project root: C:/Users/mi/Desktop/Johnny-Town. All paths below are relative to this root.

## Baseline and scope

- Starting branch: codex/p7e-no2-interaction-reachability.
- Starting HEAD: 774768f573f5e850f3e30b388cac548fd820dd8e; accepted No.2 implementation 6ff07f2edd44937252baadb36b2511ca1d54bee7 remains an ancestor.
- Development branch: codex/post-p7-welcome-portfolio.
- Tracked working tree was clean. Pre-existing untracked Phase05E/06F reports/logs were preserved and excluded from commits. The interrupted turn left no partial implementation.
- Local development/testing/commits only. No fetch, push, merge, deployment, visibility change, P7F or other maintenance work.

## Implementation and changed files

| File | Purpose |
|---|---|
| prototype/src/portfolio-content.json | Single bundled source for exact welcome + six approved Chinese chapters, English labels, original paragraphs/emphasis/lists. |
| prototype/src/portfolio-ui.js | Shared safe text/element renderer for both reading surfaces; native section selector; one chapter in DOM at a time. |
| prototype/src/welcome-store.js | Independent canonical true acknowledgement and in-page fallback, with injected storage for testing. |
| prototype/src/main.js | Instantiate welcome store once; offer welcome after existing scene setup; reuse existing input lock and openQuick. |
| prototype/src/ui.js | Reuse one native dialog; cleanup welcome before opening portfolio; focus and acknowledgement callbacks; no stacked modal layer. |
| prototype/src/story-ui.js | Remove obsolete short-summary renderer; journal/story renderers and their content remain unchanged. |
| prototype/src/style.css | Scoped reading typography, sticky chapter navigation, responsive surfaces and stable controls; no reading entrance fade. |
| prototype/index.html | Shared dialog control row with actions slot; footer I label now says self-introduction. Existing visible introduction button is reused. |
| prototype/import-approved-portfolio.mjs | One-time approved-text import utility, requiring an explicit local brief path; not used at runtime. |
| prototype/test-fixtures/approved-portfolio-hashes.json | Seven SHA256 digests extracted from the owner-approved text, before implementation. |
| prototype/test-welcome-portfolio.mjs | Content-integrity and independent welcome-state unit tests. |
| prototype/test-welcome-portfolio-browser.mjs | New/returning/blocked-storage journeys, exact DOM paragraphs and strong/list structure, six viewports. |
| prototype/test-portfolio-native-controls.mjs | Native keyboard chapter selection, actual world walk/transition after first welcome, native simulated touch reading. |
| prototype/test-returning-visitor.mjs | Explicit acknowledged-visitor fixture for existing regression processes only. |
| prototype/run-maintenance01-regression.mjs | One sequential broader browser run with evidence in this package. |
| prototype/test-woods-browser.mjs | Replace obsolete short-summary/650-character expectation with six chapter identities and approved AI-credit text; preserve navigation/focus/discovery assertions. |
| prototype/write-maintenance01-report.mjs | Build the final evidence/status report from actual result files. |
| logs/post-p7-maintenance01/ | Unit/build output, focused iterations, final browser results and screenshots. |

No dependencies, external fonts, runtime network content requests or new world assets were added. No separate desktop/mobile biography copy.

## Welcome state and first-visit flow

Key: **johnny-town.welcome.v1.seen**, canonical value **true** (string). Missing/malformed/unacknowledged value shows the letter independently of gameplay saves. A valid stored value suppresses automatic presentation. No world-save schema field was added.

Rendering and shouldShow checks do not write. Explicit primary/secondary/close/Escape dismissal acknowledges in the native close lifecycle. Primary finishes cleanup of the welcome before opening the full portfolio; secondary and ordinary welcome dismissal restore world focus. An already-read record is cached in page memory so transient later storage failure does not re-show it. Storage exceptions never prevent reading or exploration. If storage cannot persist, acknowledgement lasts only within the current page, including scene restart; reload may show welcome again.

The initial letter uses the exact approved title 欢迎来到 Johnny Town！ and all11 approved paragraph/list blocks. The primary action 查看自我介绍 and secondary 开始自由探索 are visible outside the scrolling letter. Esc/返回探索 are explicit acknowledgements; abandoning the page before acknowledgement does not create the flag.

## Old saves, navigation and portfolio

The welcome flag is independent of johnny-town.world.v1 and johnny-town.fortune.v1. Browser checks cover an existing progressed version2 Ruins save (Golden stage5, activities, stories, discoveries, transitions and fortune retained) and a legacy version1 Woods save. Version1 continues through the existing unchanged normalizeWorld migration; comparing complete parsed state confirms no lost values. Clearing only the welcome key re-offers welcome without erasing progress. JSON property ordering may change through the existing normalizer; tests compare complete semantic data across reload, not serialized key order.

I and the existing visible 认识 Johnny button open the same portfolio in all six regions. No chapters depend on region, puzzles, discoveries or NPCs. Six chapters in approved order:

1. 关于我 / About Me
2. 我的兴趣 / Interests
3. 我的作品 / Projects
4. 技能与经历 / Skills & Experience
5. 我的想法 / Philosophy
6. 探索我的世界 / Explore My World

A labelled native select exposes direct navigation and selected chapter; sticky navigation remains available while #body scrolls. The chapter has semantic headings, original paragraphs, strong emphasis and lists. The existing stable close button and explicit 开始自由探索 remain outside the scroll area. Selection keeps control focus; ordinary close restores the invoking HUD/game focus, while explicit exploration focuses the world. Basic content remains usable offline after the existing assets have loaded; offline hard reload/service-worker support was not added or claimed.

## Readability and accessibility

Six focused configurations: desktop1440×1000 DPR1; small desktop960×540 DPR1; simulated phone390×844 DPR3; landscape667×375 DPR2; tablet768×1024 DPR2; tablet landscape1024×768 DPR2. Existing mobile regression additionally checks375×667 and844×390.

Reading body font16px, system Chinese-capable sans serif, line-height1.8–1.85; inherited parchment/timber styling, dark text, distinct headings/emphasis. All action controls≥44px in measured views. No horizontal overflow; body scroll does not overlap footer controls. Safe-area CSS is retained. After visual review the reading-only unfold fade was removed, so prose is opaque immediately; unrelated modal animations and world art were left intact.

A second visual refinement compacts the short-height chapter selector into one row and reduces only chapter-heading/subtitle spacing. Main Chinese prose stays16px. Compare native-controls/landscape-projects-top.png before this refinement with native-controls-final/landscape-projects-top.png after it; the final view exposes more useful content without shrinking body text.

Native dialog supplies modality/focus containment. Existing P7E input-focus and touch modules are byte-unchanged. While either panel is open, movement/E do not affect the world, touch scrolling leaves Traveler stationary, and section navigation does not move Traveler. Close cleanup resets held keys before unlocking. Primary welcome→portfolio uses one dialog and a close continuation, so no overlapping modal layers. Native Home/ArrowDown/End chapter navigation is separately exercised.

## Content integrity

The latest owner attachment is authoritative. The one-time importer normalizes CRLF only, extracts the approved welcome and Section9 text, and retains original heading/paragraph/list/emphasis text in JSON. Seven pinned source digests verify exact title/labels/body text and six-section order. Browser tests compare every rendered block, list entry and strong count to the pinned asset in every focused viewport. No summary replaces any chapter. AI-assisted-development credit, approved author name, Traveler distinction, humorous Bug/backflip references and full signature are retained. No invented personal details or additional identifying information was added.

## Verification results

- Unit tests: **104/104**, including six new content/state cases. logs/post-p7-maintenance01/unit-tests.txt.
- Focused browser journeys: **20/20**, zero page errors. focused-final/results.json.
- Native control/journey checks: **3/3**, zero page errors. native-controls-final/results.json.
- One complete broader browser run after implementation stabilized. Existing suites explicitly acknowledge only the new welcome flag in test setup; they do not alter world/fortune state. New-visitor tests run without that preload. Failed/affected suites, if any, are individually rerun and retained below; unchanged full suites are not repeated.

| Browser suite | Exit status | Passing/validated records / total |
|---|---|---|
| world | 0 | 13 / 13 |
| woods | 0 | 13 / 13 |
| expansion | 0 | 19 / 19 |
| ruins | 0 | 17 / 17 |
| ruins-details | 0 | 3 / 3 |
| hall | 0 | 7 / 7 |
| mobile | 0 | 10 / 10 |
| npc | 0 | 9 / 9 |
| activities | 0 | 8 / 8 |
| gears | 0 | 13 / 13 |
| golden | 0 | 30 / 30 |
| nature | 0 | 7 / 7 |
| narrative | 0 | 48 / 48 |
| movement | 0 | 17 / 17 |
| hardening | 0 | 23 / 23 |
| lifecycle | 0 | 2 / 3 |
| rhythm | 0 | 3 / 3 |
| journey | 0 | 16 / 16 |
| phase02 | 0 | 23 / 23 |

Movement records are assertion-validated175-speed/diagonal samples. Hardening23 records include18 functional checks + five layout measurements. Lifecycle2/3 means two passed assertions plus one explicit NT native-background observation; the headless page did not actually become hidden. Record totals are not represented as independent product features or physical-device tests.

The broader run completed once after onboarding/modal behavior stabilized. The final short-height change is scoped only to the new portfolio reading layout; the20 focused journeys and three native-control checks were then rerun against the final build. No world or shared non-reading dialog implementation changed after the broader run, so that unchanged full run was not repeated.

Focused iteration logs are retained: the initial DOM comparison included undefined properties in one side only; later test setup initially issued fresh keydown before the asynchronous native close event finished, and raw JSON comparison treated key ordering as state loss. Those harness issues were corrected without changing world/save/input code or weakening expected values. The final storage branch also waits for close completion before fresh movement. The reading fade removal is the substantive visual iteration. The obsolete Woods short-summary expectation changed because the owner expressly replaced that content; new checks cover all chapter identities and AI credit instead of shortening approved prose to fit the old limit.

Broader coverage includes region travel and scene cleanup; collision and boundary behavior; NPC dialogue and repeat/context; both chests; Golden lesson sequence/completion/save; rhythm and gear activities; journal; corrupt/old saves; shrine drawing; environment/reduced motion; P7E focus/input protections. P7E No.2 selector/data and the main world-interaction/update implementation remain unchanged, verified by source comparison and existing targeting unit tests. No yellow-rectangle/highlighting or walking-animation work was performed.

## Production build and evidence

Production build passes, existing /Johnny-Town/ base unchanged. Current assets: index-C69I0pAj.js (1,615.74kB, gzip407.48kB), index-B39ArMMK.css (12.91kB, gzip3.69kB), index.html3.16kB. Build log: logs/post-p7-maintenance01/build.txt. Existing Phaser large-chunk warning remains; no new dependency or deferred optimization was introduced. Content is bundled locally rather than requested from a remote source.

Representative inspected screenshots:

- focused-final/desktop-welcome.png — complete desktop letter with stable actions.
- focused-final/desktop-about.png — opaque portfolio, clear heading and original paragraphs.
- focused-final/landscape-welcome.png — compact667×375 letter with independently scrolling body.
- focused-final/phone-about.png — portrait typography/controls.
- native-controls-final/landscape-touch-reading.png — actual simulated touch scroll and sticky selector.
- native-controls-final/landscape-projects-top.png — chapter beginning at normal landscape scale.
- focused-final/returning-save-welcome.png — progressed returning visitor receiving welcome.
- focused-final/offline-reduced-portfolio.png — offline/reduced-motion reading.

Local preview: http://127.0.0.1:4501/Johnny-Town/. Additional existing production preview4201 serves the same build. No private video was copied, opened, or added to the build/evidence.

## Limitations and owner checks

Actual automated browser: installed Windows Edge Chromium156.0.4314.50 headless. Touch/phone/tablet/DPR are simulated. No physical iPhone/iPad/Android, separate Chrome, Safari/WebKit, actual notch/dynamic toolbar or assistive-screen-reader certification was performed. Owner should review those environments, native mobile select presentation, font preferences and real touch scrolling. No persistence across a reload is promised when storage is blocked. The six-section design intentionally shows one full approved chapter at a time, not all prose simultaneously.

No known unresolved failure in this package's tested functionality. Owner retains final acceptance. No next maintenance item or P7F has begun.

## Local commits and release boundary

Implementation/test/evidence commit: **6c67de98ac1666cd992755c72a6850849c20b0e2**. The report is committed in a documentation-only follow-up so it can cite the reviewed implementation SHA. Final delivery HEAD is supplied in the completion message (or git log -1 on codex/post-p7-welcome-portfolio). Both commits are local. Nothing was pushed, merged, deployed or published.
