# P7F — Final Audit & Release Candidate

## A. Executive Summary

**本地 RC 通过；本轮未发现未解决的 P0/P1 发布阻塞。尚未公开发布。**

已核实并纳入全部已验收 P7 与维护成果。102 个相关单元测试、43 个浏览器场景、6 组静态发布检查通过；生产构建成功。候选适合提交所有者作 November 5, 2026 展示前的最终验收。

本次仅修正元数据/图标、过时运行文档及公开产物的说明/许可打包。`prototype/src/` 与起始已验收提交完全一致；没有改动玩法、文案、音频、输入、地图或存档逻辑。真实 iPhone/iPad/Safari 与现场网络、外放试听仍需所有者确认。通过本地预览不等于完成线上验收。

RC 提交：`bba81929571d92fe57afddcccc48aae7510b3c6e`。固定本地标签：`p7f-rc.1`；报告整理提交另列于交付消息。

## B. Repository Integration

起始分支 `codex/post-p7-audio-patch01`，HEAD `f6b46b79dbd1530fde8fed73c93399ce268da5fe`。已跟踪文件干净；此前无关 PHASE06F 报告及 phase05e/phase06f-stageb 未跟踪文件原样保留，不纳入 P7F。

新建本地分支 **`codex/p7f-release-candidate`**，基于上述完整基线。通过实际 merge-base / is-ancestor 检查，以下十五个分支 tip 均已在同一条祖先链中；**无需整合缺失提交，没有执行合并、cherry-pick 或冲突解决。**

| 来源分支（省略 `codex/`） | tip | 包含/冲突 | 验证 |
|---|---|---|---|
| p7a-clockwork-remaster | e06cd4c | 已包含 / 无 | 祖先检查 |
| p7b-golden-spin | 099875f | 已包含 / 无 | 祖先 + 当前五课测试 |
| p7c-r1-nature-ruins | d461b24 | 已包含 / 无 | 祖先 + 当前场景截图 |
| p7c-r1-animation-remediation | 5e3ddb3 | 已包含 / 无 | 祖先；渲染源码未变 |
| p7c-r1-patch02-placeholder-art | 74c587a | 已包含 / 无 | 祖先 + 遗迹/湖泊截图 |
| p7c-r1-patch02a-drum-manuscript | 025d380 | 已包含 / 无 | 祖先 + 鼓架/手稿既有美术保留 |
| p7c-r2-town-world-unity | 3d24e3a | 已包含 / 无 | 祖先 + Town 截图 |
| p7d-npc-personal-storytelling | e55c6f8 | 已包含 / 无 | 祖先 + NPC 单元/实际对话 |
| p7e-mobile-accessibility | 93fd79b | 已包含 / 无 | 祖先 + 六种布局 |
| p7e-no2-interaction-reachability | 774768f | 已包含 / 无 | 祖先 + 选取单元/实际 E 与触摸 |
| post-p7-welcome-portfolio | c8971c1 | 已包含 / 无 | 祖先 + 批准文案哈希/六章 |
| post-p7-maintenance01-patch01 | 9918e65 | 已包含 / 无 | 祖先 + 重读/往返 |
| post-p7-maintenance02-visual-ux | 2426788 | 已包含 / 无 | 祖先 + 12 pose/175/箭头检查 |
| post-p7-audio-pass | e541c1c | 已包含 / 无 | 祖先 + 音频单元/生命周期 |
| post-p7-audio-patch01 | f6b46b7 | 已包含 / 无 | 祖先 + 独立确认/三轨矩阵 |

共同祖先和当前本地 main 均为 **`381f9a0917cf1aed7462d80380dd0a23e80c3fc4`**。起始候选比 main 多 22 个提交。只读 `git ls-remote` 确认远端 main 也为该旧提交；未更新本地远端引用或合并 main。

GitHub 只读查询显示最近一次[旧 main Actions](https://github.com/zhangjohn289-spec/Johnny-Town/actions/runs/41013976826)的 build/deploy 均成功。这不是 P7F 的 CI 或部署证据。旧公开 URL `https://zhangjohn289-spec.github.io/Johnny-Town/` 本轮只读 HTTP 200，标题正确；**不包含本候选的新验收结论**。

证据：`logs/p7f/integration.json`、`remote-readonly.json`、`external-links.json`。

## C. Functional Audit

| 区域 | 当前候选实测 | 持续环境音 |
|---|---|---|
| Town | 首次出生/确认、六章介绍、重读、NPC、小屋、抽签、声音入口、往返 | 无 |
| Woods | 出入、键盘沿安全路线接近初始之地并记录、档案员对话、场景/道路可辨 | 森林细节 |
| Meadow | 出入、探险家、通往四区的实际 E 出口、当前箭头与提示 | 无 |
| Lake | 出入、湖畔舞台、节奏练习启动/关闭及清理、水体/鼓架画面 | 水声 |
| Valley | 出入、四齿轮正确传动完成并保存、工坊与齿轮画面 | 机械音 |
| Ruins | 出入、飞行实验互动/小飞机画面、五课进度/重读/日志/刷新 | 无 |

**完整访客流程：**新上下文 → 欢迎信 → 提前查看介绍后返回欢迎信 → 勾选（此时不保存）→ 点击开始 → 六章 → Town NPC/抽签 → 手动启用声音、调整音量 → 森林故事/NPC → Meadow → Lake → Valley → Ruins → Town → 多次重读与声音切换 → 刷新验证保存。

为控制测试时间，长距离入口与部分地标用安全 `body.reset` 安排位置，再用实际 E / DOM 操作验证；森林故事接近采用实际键盘寻路，独立 Golden 套件还实际步行五课。不是声称全部地标的每条路线都在本轮手工走完。地图/碰撞/选取源码未变，既有 P7E No.2 的 29 对象审计作为历史基线，当前又测了代表性 NPC、地标、建筑与触摸一致性。

### 移动与交互

- 当前水平/垂直/斜向速度均 175 px/s；小屋建筑碰撞生效，既有安全出生点/边界单元通过。
- 12 pose、20 fps 行走资源/方向连续性和启停单元通过；源码、纹理、玩家控制器与已验收版相同，没有重制动画。
- 选中 ID 与静态像素箭头 ID 一致；E 与触摸都打开同一目标；面板打开/无目标/美术对象 inactive 时箭头隐藏；跨区维持一个箭头对象，无黄色大矩形回归。
- 当前四名 NPC 的相关数据单元通过，实际访问书记员、档案员、探险家；工坊活动正确完成，节奏练习可开始/取消。
- Golden 套件验证五课推进、完成/重读、日志、刷新和模拟触屏；没有新增课文或改变解锁条件。

### 欢迎信、介绍和存储

- 独立 `johnny-town.welcome.acknowledged.v1` 保留；旧 seen 不能替代明确确认。
- 未确认时按钮禁用、Escape 不能绕过；提前阅读介绍只有返回欢迎信的路线。勾选不写确认，成功点击才写。已确认重读预选，返回不清空确认。
- 六章顺序、完整批准文案哈希、声音公告/真实「小镇声音」位置文案均通过。没有重写作者介绍。
- V1/V2、损坏/部分/未知版本、存储不可用等相关单元与 Golden 浏览器存档夹具通过。当前完整路线刷新保留故事、签文、工坊、回旋、确认和音量，且不自动播放。
- 现有保存的是**区域安全入口检查点**，不是精确的最后像素坐标；本轮未引入新格式，也没有使用或清理所有者真实浏览器存档。

### 声音

保持 Woods / Lake / Valley 三轨及 Town / Meadow / Ruins 有意静音。七个 WAV 与已验收 Patch 01 **逐字节一致**，没有新音源或持续风轨。默认静音、显式启用、音量保存、刷新不自动启动保持不变。

本轮代表性实际切区、静音/再启用、面板音、抽签/完成钩子、错误/中断/降级单元均通过。没有对已接受音色再次重设计；真实扬声器与 Safari 限制仍须现场确认。

## D. Compatibility and Performance

环境：Windows / Node v26.13.0 / Edge 156.0.4314.50 Chromium headless；完整版本在 `logs/p7f/environment.json`。CI 配置使用 Node 22，本轮没有运行远端 CI 或在本机另装 Node 22。

当前布局检查：1440×1000 桌面、800×640 窄桌面、1180×820 平板横屏、820×1180 平板竖屏、375×667 手机竖屏、667×320 短横屏。确认无横向溢出，画布/面板在视口内，介绍/重读/音量可访问；模拟触摸拖动及同目标互动通过，松开后停止。

手机/平板均为 Playwright/CDP **模拟**；不是实体 iPhone/iPad 或 Safari。未取得这些真实设备证据，不宣称普遍移动端兼容。极短横屏的长说明在正文区滚动，关闭按钮仍可见；按钮不必同时塞进同一屏。

### 生命周期与性能数据

- 一次完整多区路线加 8 次热态往返，共 **18 次实际 E 区域切换**，包含重复欢迎信、声音设置、阅读和活动关闭；无页面异常或失败本地资源请求。
- 热态 Town 每轮相同：39 子对象、44 纹理键、1 动态体、9 静态体、1 collider、1 marker；E/I/M 各 1 监听，0 持续声音。window/document 原生监听的类型/数量前后相同。
- GC 后 JS heap 端点约 9,172,816 → 9,517,120 bytes，增加约 0.33 MiB；没有对象计数或监听持续增长迹象。一次短测不能证明长期或原生音频内存完全无泄漏，不作这类保证。
- 180 rAF 样本（舍弃前五帧）：中位约 **16.7 ms**，P95 **17.1 ms**。历史同机维护记录约 16.7/16.9 ms，作为参考而非严格同负载 A/B；不据此宣称优化或普遍帧率保证。
- 本地新浏览器从导航到 game ready 约 **963 ms**；这是本地资源启动，不是公网慢网指标。

已查看六区及代表性 UI 的实际截图。初次 UI 截图捕获淡入中间帧，已用 opacity=1 的稳态截图替换，没有修改既有动画。

## E. Defect Register

| ID | 发现/复现条件 | 级别与影响 | 处理与理由 |
|---|---|---|---|
| F01 | README 仍写 Phase05D、PC Only、无虚拟摇杆 | P2；错误运行/交付说明 | 已更新为当前候选及操作/存储/发布边界 |
| F02 | 生产 HTML 没有 favicon、简介元数据 | P3；浏览器标识/分享简介缺失 | 增加既有 Traveler 意象的小图标与简介；无界面重设计 |
| F03 | public/audio/README 含离线生成器等内部说明，随 dist 输出 | P2；多余开发材料公开 | 移到 prototype/AUDIO_ASSETS.md；公开仅留简短 CREDITS.txt |
| F04 | 产物只有框架嵌入片段，没有单独完整许可文档 | P2；分发许可信息不完整 | 增加 Phaser/eventemitter3 原始 MIT 全文；音频 CC0 署名保留 |
| F05 | 控制台直接 game.destroy，跳过/未等待 scene shutdown，再触发 blur | P3；已知开发接口特殊清理问题 | 延后。正常导航/blur/pagehide/reload 均通过；应用源码无普通 UI 调用 game.destroy 的路径，非已证实发布阻塞 |
| F06 | window.__town 可从开发者控制台读取场景/本地状态 | P3；既有测试诊断入口 | 延后。没有面向普通访客的调试浮层、远程权限或凭据；控制台操作只影响该客户端。未为移除此入口重构测试/运行架构 |

没有把不存在真实设备证据、轻微堆变化或站外平台依赖虚构成已复现的 P0/P1 缺陷。公开文案中的财政/下一阶段预算笑话属于批准创作，不是过期 Phase06 广告，予以保留。

## F. Security, Assets, and Production Build

最终构建通过，15 个产物文件，共 **4,155,574 原始字节**。完整路径/大小/SHA256 见 `logs/p7f/production-manifest.json`。最终产物只有页面、JS/CSS、纹理、favicon、七个已批准 WAV、音频署名和框架许可。

- `/Johnny-Town/` 大小写准确；HTML 引用的脚本、样式和 favicon 都存在；六区运行和音频请求通过该路径成功。无运行后端要求。
- 无内部报告、日志、临时文件、源码映射、视频、本地视频接口、绝对 C:\\Users 路径或 localhost 端点进入 dist。私人媒体和配置的忽略规则仍有效。
- 本轮跟踪路径/产物模式扫描未发现凭据文件或令牌形状。不是对整个 Git 历史和所有未知秘密作全面安全担保。
- npm 当前审计元数据为 **0 已知漏洞**，版本/锁文件未更新；这不等于不存在未知漏洞。
- 原创像素素材来源说明保留。音频源为既有已核实 CC0 的自然录音/水声及原创合成；没有重新分发视频或商业音乐。框架 MIT 全文随构建输出，Vite 仍为原有构建工具。
- 没有外部字体/CDN/分析/跟踪服务。缺字/字体差异使用系统字体降级；不依赖远程字体加载。
- Bilibili 明确点击外链页面本轮 HTTP 200，标题对应原链接；没有验证该平台的视频播放、登录或地区限制。游戏不内嵌/自动播放该视频，有原有新标签页/复制地址降级。
- 既有 JS 主包 >500 kB 的提示仍在；未为压低警告改造渲染/分包或引入新依赖。

部署工作流、publish=false 默认值、Pages 权限、Vite base、仓库域名配置均**未修改**。

## G. Tests

| 本轮执行 | 结果 | 证据 |
|---|---:|---|
| 14 个相关单元文件：core/world/woods/expansion/ruins/golden/npc-stories/activities/phase06a/interaction/input-focus/maintenance02/audio/welcome | **102 / 102** | unit-tests.txt |
| 当前完整访客路线、移动/箭头、六区、生命周期、保存、六种布局 | **13 / 13 场景** | journey-results.json / journey-tests.txt |
| 既有 Golden 浏览器套件：夹具、桌面步行五课、完成/重读、手机/横屏/平板模拟五课 | **30 / 30 场景** | golden/results.json / golden-tests.txt |
| 祖先、部署门禁、产物/元数据、音频字节、许可/敏感模式 | **6 / 6 组** | static-results.json / static-tests.txt |
| npm advisory 查询 | 0 已知漏洞 | dependency-audit.json |
| 生产构建与差异检查 | 通过 | build.txt / git diff --check |

合计 102 单元 + 43 浏览器场景 + 6 静态组；不把截图重拍、重复运行或一组中每个断言再累加。所有浏览器在临时独立上下文使用合成存档，未触碰所有者真实 Edge 保存数据。

有一个测试同步问题：原生对话框跳转在 close 事件后完成，初次立即读标题得到前一页；加入等待实际 portfolio-panel 后通过。没有因此修改游戏或重复全部单元套件。补充许可/公开文档修正后重建最终产物，核心游戏字节仍未变。

没有重复完整历史美术、29 对象多方向浏览器矩阵、所有小游戏计时场景或大量压力循环。源码完整性、历史已验收证据、当前代表性场景及五课测试共同覆盖本次风险。真实 Safari/设备、真实公网候选部署、实际音频外放与长时间演示负载尚未验。

## H. Release Candidate

- 分支：`codex/p7f-release-candidate`；固定本地标签：`p7f-rc.1`。
- RC 确切 SHA：`bba81929571d92fe57afddcccc48aae7510b3c6e`。
- 工作区：RC 提交后已跟踪文件干净，原有无关未跟踪材料保留；本报告随后单独提交，不改变运行代码或构建。最终文档 HEAD 在交付消息中记录。
- 运行代码、全部资源与上述构建清单相符；本地运行 `npm.cmd --prefix prototype run preview -- --port 4501 --strictPort`，访问 `http://127.0.0.1:4501/Johnny-Town/`。若需要重建，先 `npm.cmd --prefix prototype ci`，再 `npm.cmd --prefix prototype run build`。

### 仅供以后获授权的 Pages 发布计划

1. 所有者完成下方验收，明确批准推送/整合与公开发布的范围和目标 SHA。
2. 重新读取远端状态，确认 main 仍可安全整合候选；若远端发生分叉先处理，不覆盖历史、不 force push。
3. 正常推送已审核候选；按获批范围将其整合到 main。当前祖先关系可快进，但发布时必须重新验证。
4. 沿用现有手动 Actions，先以 **publish=false** 验证远端 Node22 构建；未经发布授权不勾选 true。
5. 获批后对同一已验收 SHA 手动运行 **publish=true**，等待 deploy 成功；不改 Pages Source、域名或可见性。
6. 使用该次真实 page_url 在线复查首次确认、介绍、六区代表路线、声音、刷新存档。此前只读的旧线上版本不能代替这一步。

**本阶段没有执行上述远端写操作：没有 push/tag push/merge main/部署、工作流触发或 Pages 设置变更。**

## I. Showcase Preparation — November 5, 2026

推荐 3–5 分钟路线：欢迎信明确确认 → I 打开介绍，重点读「关于我 / 兴趣 / 项目」→ Town 一段 NPC 或每日签 → 北侧 Woods 的初始之地/档案员 → 可选手动开启森林声音 → 返回 Town。先展示网站主人的内容，不要求观众完成世界或谜题。

有余裕可追加 Meadow→Valley 工坊体验；五课回旋可作为第二段探索，不宜代替个人介绍的开场。

- 网络临时故障：展示机提前保存本次 dist 并运行已验证的本地预览，提前打开已加载页面；没有为此新增离线应用或缓存系统。远程访客仍需可用网络。
- 浏览器拒绝音频/无扬声器：保持静音展示；所有介绍、谜题和状态都有视觉信息。需要声音时只在用户点击后再次启用。
- 低性能设备：使用较小桌面窗口、系统 Reduced Motion，减少同时开启的标签；不要在现场重新生成素材或运行开发测试。
- 现场前先验证投影文字、学校网络、实际 Safari/手机和声音音量。公开候选尚未上线，必须先完成后续发布授权和线上验收，不能把旧页面当作最终展示版。

## J. Owner Acceptance Checklist

- [ ] 从新访客状态读信、先看介绍再返回、明确确认；重载不再强制，重读仍正常。
- [ ] 用展示设备确认六章中文可读、鼠标/键盘与一台真实手机的滚动/操作舒适。
- [ ] 走一次上述短路线，确认姓名/经历/作者声音和目前已批准内容仍符合预期。
- [ ] 外放或耳机试听 Woods/Lake/Valley，确认静音三区与小音效；无法出声时仍能完整展示。
- [ ] 确认本地 RC SHA/tag，随后另行明确是否授权推送、整合 main 和 publish=true。

P7F 在此停止。没有开始 P8 或任何其他工作包。
