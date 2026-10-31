# Maintenance No.1 — Patch 01 验收报告

项目目录：`C:/Users/mi/Desktop/Johnny-Town`。以下证据路径均相对此目录。

## 基线与分支

- 起始分支：`codex/post-p7-welcome-portfolio`。
- 已核实起始 HEAD：`c8971c147fe4186c340d69352d7892eb80069b4f`。
- 补丁分支：`codex/post-p7-maintenance01-patch01`。
- 开始时已跟踪工作区干净，没有中断遗留修改。原有 Phase05E/06F 未跟踪报告与日志未改动、未纳入提交。

## 入口与实现

入口位于现有“认识 Johnny / I”自我介绍面板底部，文字为 **重新阅读欢迎信**。该按钮与返回按钮位于正文滚动区之外；手机无需键盘即可访问，电脑可用鼠标或 Tab/Enter。没有增加悬浮按钮、设置系统或键盘快捷键。

自动欢迎与手动重读共用 `WorldScene.openWelcome()`、既有 `showWelcome()`、`renderWelcome()` 和原始内容配置。手动入口不检查首次访问条件，通过既有关闭清理回调切换同一个原生 dialog。没有第二份欢迎信组件或内容资产。

首次访问检查仍只由原来的 `welcomeStore.shouldShow()` 决定；持久化键 **johnny-town.welcome.v1.seen**、值 `true` 和存储异常降级逻辑均未修改。渲染/重读打开不写标记；主动选择操作或 Esc 关闭时继续使用既有确认逻辑。已确认标记不被清空。重读前后位置、世界进度、成就与签文不变。

## 按钮合并与焦点

| 面板 | 实际操作按钮 |
|---|---|
| 首次／重读欢迎信 | 查看自我介绍；开始自由探索 |
| 六章自我介绍 | 重新阅读欢迎信；返回探索 |
| 普通阅读面板 | 共享的返回探索；保留各面板真正不同的功能操作 |

重复来源是专用渲染器额外生成退出按钮，同时共享 dialog 又带一个关闭按钮。现在删除专用退出按钮的创建，由共享 `#close` 统一承担当次面板的退出职责。没有通过 CSS 隐藏重复按钮，DOM/Tab 顺序中也没有遗留副本。

欢迎信的共享关闭按钮标为“开始自由探索”，初始聚焦它；另一按钮“查看自我介绍”在旧面板清理完成后打开六章介绍并聚焦其关闭控件。自我介绍的显式“返回探索”恢复游戏焦点并清空按键；欢迎信退出同样恢复游戏。普通面板及 Esc 保持适当的原有关闭/触发器焦点行为。NPC 对话选择、抽签按钮等不同功能没有删除。

## 修改文件

- `prototype/src/main.js`：共用欢迎入口，自我介绍提供重读回调；世界互动/update 与 Phaser 配置未改。
- `prototype/src/ui.js`：共享关闭按钮按面板类型标记；重读关闭续接；自我介绍显式返回恢复游戏焦点。
- `prototype/src/portfolio-ui.js`：去除两处专用退出按钮；新增一个重读按钮。
- `prototype/test-welcome-replay-patch.mjs`：补丁专项浏览器测试。
- `prototype/test-ux-hardening.mjs`：更新被本补丁取代的退出名称/显式返回焦点预期，并等待原生关闭生命周期完成。
- `prototype/test-welcome-portfolio-browser.mjs`：更新自我介绍退出名称/焦点预期；欢迎信操作名称保留。
- `prototype/test-woods-browser.mjs`：只更新自我介绍退出按钮名称；本次没有运行整套森林玩法测试。
- `logs/post-p7-maintenance01-patch01/`：构建、测试、源码保护记录及截图。

无 CSS、HTML、依赖、批准文案、欢迎状态存储、存档 schema、地图、碰撞或其他游戏机制改动。`protection.json` 记录了受保护文件无差异，以及从 `WorldScene.interact()` 开始的全部互动、更新和游戏配置代码与基线完全一致。

## 实测结果

| 检查 | 结果 | 证据 |
|---|---|---|
| 内容完整性、欢迎状态、焦点／输入单元测试 | 8/8 | unit-tests.txt |
| 补丁专项 | 13/13，页面错误 0 | focused/results.json |
| 相关焦点／触屏回归 | 23/23 记录，页面错误 0 | focus-regression-final/results.json |
| 原有欢迎／介绍 UI 回归 | 20/20，页面错误 0 | onboarding-regression/results.json |
| 生产构建 | 通过 | build.txt |

23 条焦点记录包含 18 项功能检查和 5 条布局测量，不将它们混称为 23 项独立功能。初次焦点回归在原生关闭事件结束前读取焦点，失败记录保留在 `focus-regression/`；增加正确的关闭完成等待后，仅重跑相关用例，未改输入实现或放宽断言。

专项覆盖：1440×1000 桌面、375×667 窄手机、667×375 小横屏；鼠标/键盘与模拟触屏；首次确认、重载不自动显示、两轮手动重读、欢迎信两个操作、六章内容及强调、完整原文与首次欢迎 HTML 一致、V1/V2 完整存档语义保持、按住移动键退出后停止、正常恢复 175 速度、Tab/Enter/Esc、滚动不移动 Traveler，以及 Reduced Motion。

普通面板只在中心小镇抽查小屋、市政厅、神社、宝箱、书记员和日志，使用正常 E/关闭控件；验证保留抽签和 NPC 的三个选择。没有开展全面六区域玩法审计、Gear Valley 视觉复测、五课试炼或 29 对象可达性审计。未改系统沿用已验收证据和受保护源码比对。

构建保留 `/Johnny-Town/` base。产物：`index-CnPdH4uF.js` 1,615.96 kB（gzip 407.52 kB）、原 CSS `index-B39ArMMK.css`。保留原有 Phaser 大包提示，没有为本补丁引入依赖或优化重构。

## 视觉证据与限制

已实际查看以下浏览器截图，确认欢迎信只显示两个操作，自我介绍提供重读和一个返回操作：

- `logs/post-p7-maintenance01-patch01/focused/desktop-replay.png`
- `logs/post-p7-maintenance01-patch01/focused/phone-portfolio.png`
- `logs/post-p7-maintenance01-patch01/focused/landscape-first-welcome.png`

实际自动化浏览器：Windows Edge Chromium 156.0.4314.50，无头模式。触屏为 Playwright/CDP 模拟；没有声称真机 iPhone/iPad/Android、Safari 或单独 Chrome 验证。没有发现本补丁范围内尚未解决的功能问题；真机与辅助技术体验仍由所有者人工复核。

本地预览：<http://127.0.0.1:4501/Johnny-Town/>。

## 本地提交与发布边界

实现／测试／证据提交：**514f37236ac27b5b4c8b5f7abaf59d916126ae86**。报告随后以单独本地文档提交收录，以便引用准确的实现 SHA；最终 HEAD 在交付消息中提供。

没有 push、fetch、merge、部署或任何远程修改。没有开始 Maintenance No.2、P7F 或其他工作包。最终验收权保留给项目所有者。
