# P7D — NPC & Personal Storytelling

2026-10-31. Branch: `codex/p7d-npc-personal-storytelling`. Baseline: `3d24e3a5e4543b319f39e3b26d2ce8b8be3ac5d4` (P7C-R2). R2 remained awaiting owner visual acceptance at the start of P7D; this branch preserves its complete commit and all artwork. P7D does not grant R2 acceptance or make conflicting visual changes. Its documented pre-existing gear-test quantization limitation remains separate; no unrelated test expectation was changed.

## Audit and narrative plan

Existing NPCs use `npc-data.js` (four fixed definitions and three-node dialogue graphs), `npc-system.js` (scene-local sprites/markers), `dialogue-ui.js` (one line per panel, two topic choices and an exit), and the established modal lock/focus controls. Previously all greetings were static, follow-up branches were general, and there were no progress-dependent or repeat greetings.

| NPC | Existing position / role | Original dialogue summary | P7D voice and portfolio theme |
| --- | --- | --- | --- |
| 市政书记员 / `town-clerk` | Town (340,490), door y514 | Archives, growing website, mayor and budgets | Polite, dry administrative humor; personal website orientation, optional fast introduction and Johnny Da Mek as First Traveler |
| 机械学徒 / `mechanical-apprentice` | Valley (620,580), door y604 | Machines, automation, revised drawings | Enthusiastic but practical; test connections, build/test/improve, distinguish the small backflipping aircraft from the larger factory idea |
| 旅行探险家 / `traveling-explorer` | Meadow (430,450), door y474 | Directions, secrets, freedom to choose | Friendly observer; choose an interest rather than a completion checklist, musical curiosity and personal discovery |
| 森林档案员 / `forest-archivist` | Woods (500,460), door y484 | Memory, stories, reflection | Patient, warm and quietly funny; symbolic forest rather than résumé, existing approved percussion/music interests |

Plan: one short first greeting, a session-only return greeting, two optional two-line topics, and at most one short progress response selected by deterministic priority. No conversation is mandatory, and no dialogue unlocks a quest or journal entry. The optional First Traveler framing is concentrated in selected lines; it is not repeated as a creation myth in every introduction.

## Architecture and state

Production changes:

- `prototype/src/npc-stories.js`: editable public narrative configuration, static-compatible dialogue graphs, pure progress predicates and start-node selection.
- `prototype/src/npc-data.js`: imports that configuration; the four NPC IDs, positions, names, sprites, radii and behaviors remain unchanged. Existing `dialogueNode(id,node)` behavior stays compatible; optional context only changes the start node.
- `prototype/src/main.js`: attaches a read-only `worldStore.read()` snapshot and repeat flag when an NPC interaction starts. A bounded Set of the four talked-to IDs lives only in the current page session.
- `prototype/src/dialogue-ui.js`: passes that optional context to the existing resolver. Existing buttons, line flow, modal close, focus and movement controls remain.

There are no new save fields, schema versions, storage keys, achievements, migrations, global listeners, timers, polling, network calls, assets or NPCs. Session return greetings survive region transitions but reset on reload. Progress responses are still selected from the saved world after reload. Merely talking never marks story discovery or activity completion.

### Context conditions, in priority order

| NPC | First condition | Fallback condition |
| --- | --- | --- |
| Clerk | `goldenTrial.stage === 5` | at least four distinct normalized `discovered` regions |
| Apprentice | `activities.gears === true` | `secrets.found` contains `flight` |
| Explorer | `activities.rhythm === true` | `discovered` contains `lake` |
| Archivist | `stories` contains all five forest IDs: beginning, crossroads, echoing-tree, workshop, unwritten | `stories` contains `echoing-tree` |

No matching condition gives only the first/repeat greeting. A matching response is a second greeting panel, followed by the same optional topics. The first satisfied condition wins; variants are not stacked into an exposition dump. Existing normalized snapshots are the sole progression source. Boolean activity flags and trial stage are checked strictly.

## Privacy and narrative review

Only approved project content was consulted: public profile and forest/lake/valley stories in `story-content.js`, music/engineering overview in `activities-data.js`, existing Ruins flight record, and the owner's P7D First Traveler framing. No private services, unrelated files or other conversations were searched. Music claims are limited to existing snare/drum-kit and musical/orchestral interests. No school chronology, contact details, family, private schedule, achievement or new real-world biographical claim was added.

NPC observations are fictional resident voices. Johnny Da Mek is the green engineer/First Traveler; the visitor remains the current Traveler. The aircraft is explicitly the small experiment, separate from the larger flying-factory concept; no factory map is implied available. No deity, war, antagonist, required chronology or main quest was added. Existing I-key introduction, personal profile, journal content and lesson texts remain unchanged.

Reviewed all implemented lines together: Clerk uses concise practical guidance and paperwork humor; Apprentice notices mechanisms and experimental limits; Explorer offers permission to stop or choose; Archivist connects symbolic places to reflection and music. Initial greetings are one short panel; optional branch paragraphs remain below 100 Chinese characters each. Two topics and an exit remain sufficient—no larger conversation system was introduced.

## Browser evidence and verification

Evidence root: `logs/p7d/`.

- `storytelling/`: full four-viewport matrix, four NPCs × fresh/two contextual fixtures = 48 cases. Each case checks first and repeat conversation, exact selected text, unchanged save bytes, close/reopen and panel bounds. Screenshots contain optional deeper lines at real gameplay scale.
- `greetings/`: supplementary desktop and portrait captures of actual introductory and contextual panels, plus optional branches. File pattern: `<npc>-<view>-<variant>-greeting-<line>.png`; variants 0/1/2 are fresh/first-priority/second-priority fixture. These are captured from the actual game, not mockups.
- `npc/`: existing tests physically approach all four NPCs, read both topics, repeat, close, move again, exercise fallback/missing records, twenty region transitions and touch interactions.
- Established browser regression: **84/84 passed** — NPC 9, activities 8, mobile 10, Golden Trial 30, nature 7, gears 13, Town Hall 7. All completed on the first P7D run; the pre-existing R2 gear assertion finding is recorded separately in the R2 report, not hidden by a test modification.
- New unit and established suite: **92/92 passed** (`unit-tests.txt`). Targeted narrative matrix: **48/48 passed**; stable greeting screenshot supplement: **24/24 passed**, each including first and repeated interactions. All browser result error arrays are empty.
- Movement regression: **17/17 samples passed**, all sampled physics speeds exactly 175, input listener count one. NPC route tests also verify movement resumes after closing their panels.
- Nature lifecycle checks pass thirty measured mixed-region transitions with disposed old references, stable counts, preserved progression, normal ambient frame changes and Reduced Motion freezing. Existing NPC and trial suites independently check twenty transitions/reopens.
- Production build passed, `/Johnny-Town/` base unchanged; JS `index-BD6pwxnq.js`, 1603.01kB / gzip 401.16kB. Existing large Phaser chunk warning remains. No private media or debug dependencies were introduced.

New tests `test-npc-stories.mjs` exercise all eight existing-state predicates, strict completion checks, priority, no mutation, distinct repeat lines, short reading length and safe unknown IDs. `test-storytelling-browser.mjs` adds focused fixture/text assertions using the installed browser infrastructure; no new framework or dependency.

Keyboard E/continue/Esc and touch opening/closing remain functional. Existing NPC regression verifies movement resumes and world/fortune state does not change. Existing modal focus rules were not replaced. Browser review includes desktop, tablet landscape, phone landscape and portrait; actual physical devices and Safari were not tested. Some initial greeting screenshots were captured before the opening paint settled; the supplement was re-captured after a 400ms settle and those final stable panels were inspected. Final owner writing approval remains outstanding.

## Functional preservation and limits

R2 Town art, all R1 assets and nature motion, NPC sprites/positions/idle, player speed, maps/collisions/exits, saves, Golden Trial/five lessons, Gear Valley mechanisms and 16-note rhythm activity are unchanged. Dialogue reads snapshots only. Scene cleanup gains no new work; the return-greeting Set has at most four keys. No separate performance benchmark was necessary for static text selection on interaction; no per-frame work was added.

No push, merge, deployment, P7E or deferred maintenance was performed. The final local SHA is supplied in the delivery message. Existing unrelated untracked files are preserved. The following section is generated from the actual implemented configuration for complete owner review.

## Full implemented dialogue

### 市政书记员

初见：

> 欢迎，Traveler。这里是 Johnny 的个人介绍网站；你现在站在它的街道上。

重访（会话内）：

> 又见面了。今天只随便走走也可以，不需要填写申请。

可选话题「这座小镇是谁建的？」：

> 绿皮工程师 Johnny Da Mek，我们叫他「最初的旅人」。你是今天来探索的 Traveler，不必成为他。

> Johnny 喜欢编程、音乐和机械创造。把介绍做成能散步的世界，算是他的自我介绍方式。

可选话题「我只有几分钟。」：

> 点「认识 Johnny」，或按 I，就能快速了解兴趣和这个项目；不必先完成探索。

> 有空再走一段。市政厅负责整理档案，至于镇长下一张图纸能不能塞进柜子——我们还在评估。

条件回应 `trial-complete`：

> 五道刻痕都亮了？那段旅程已经记进日志。恭喜，今天没有额外的验收表。

条件回应 `many-regions`：

> 你已经走过好几个地方了。日志会替你记住发现，档案室暂时不用扩建。

退出选项：下次见。

### 机械学徒

初见：

> 先别碰那根轴——我正在看动力断在哪儿。大想法也得从一个能转的小零件开始。

重访（会话内）：

> 来，帮我看一眼这处连接。我现在比较擅长先找问题，再给图纸起名字。

可选话题「Johnny 喜欢造什么？」：

> 机械、自动化，还有 Minecraft Create 里的工程。最让我着迷的，是让一个零件真的带动下一个。

> 先搭出来，测试，再改。Johnny Town 也是这样一点点做起来的；图纸画得再远，螺丝还是得一颗颗拧。

可选话题「有没有不太成功的实验？」：

> 遗迹里那架小实验飞机，起飞之后还会后空翻。我建议先把「稳定飞行」单独列一项。

> 它不是另一项大型飞行工厂构想。小飞机的教训已经够记一页了：先弄清为什么翻，再试下一次。

条件回应 `gears-complete`：

> 工坊的动力接通了！你也看到了吧，方向和连接都对上，整套机构才肯一起工作。

条件回应 `flight-found`：

> 你见过遗迹里的小飞机了？那次后空翻是实验记录，不是我们偷偷加的飞行要求。

退出选项：下次见。

### 旅行探险家

初见：

> 你好！我刚在岔路口停了会儿。这里没有标准游览顺序，先走向让你好奇的地方吧。

重访（会话内）：

> 又碰上了！这次想换条路，还是回去看看上次没注意到的角落？

可选话题「你会推荐哪条路？」：

> 想听音乐的故事，去旋律湖；想看机械，去机械谷。镇北的森林适合慢慢读，遗迹留给愿意多看一眼的人。

> Johnny 把不同兴趣放进了不同地方。我喜欢这种安排：好奇心选路，脚步不必替别人交作业。

可选话题「探索一定要找齐所有东西吗？」：

> 不用。我也会在一条路上来回走，因为第二次的光和第一次不太一样。

> 最初的旅人留下了这个世界，后来的人各自发现一部分。只带走一个喜欢的想法，也算一趟好旅程。

条件回应 `rhythm-complete`：

> 你试过湖岸的节奏练习了？我喜欢那里的停顿；有时知道何时不敲，也是在听。

条件回应 `lake-visited`：

> 你去过旋律湖了。那里的鼓、舞台和水声故事，让「喜欢音乐」不只是一行介绍。

退出选项：下次见。

### 森林档案员

初见：

> 轻一点，这里的故事不赶时间。你想读一个人的兴趣，也可以先看看他把什么留在了路边。

重访（会话内）：

> 欢迎回来。旧故事还在原处；再读时，你带来的问题可能不同了。

可选话题「为什么把经历写成森林？」：

> 石碑、岔路和工坊是象征，不是一张履历表。它们讲探索、适应和动手创造，也给真实经历留一点呼吸的地方。

> Johnny 喜欢编程、音乐和游戏。这些故事让兴趣彼此相连；具体的人生，当然不止几块路牌。

可选话题「回响之树在记什么？」：

> 音乐和舞台，是这里的一条线索。Johnny 学过小军鼓，也打架子鼓，喜欢音乐剧、管弦与戏剧性音乐。

> 树记下的不是一份演出清单，而是反复练习以后，仍愿意再敲一次的心情。嗯，树并没有替谁参加考试。

条件回应 `forest-stories`：

> 森林的五处故事，你都读过了。可以从日志里重读；读完并不会把森林关上。

条件回应 `echo-found`：

> 你读过回响之树了。声音散去以后，还愿意留在记忆里的东西，往往值得再听。

退出选项：下次见。
