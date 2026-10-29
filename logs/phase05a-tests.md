# Phase 05A 实际测试记录

日期：2026-10-29。起点为干净的 main / fdad768，包含 Phase 04 提交 fdd4b86。基线 6 项核心测试和生产构建通过后才开始修改。

## 环境与本地运行

Windows / PowerShell。构建使用 C:/Program Files/nodejs 下的 Node v26.13.0、npm.cmd 11.20.0。普通工具 Shell 的 node 默认指向 Codex 捆绑 Node v24.22.1，因此浏览器测试及最初单元测试实际运行于 v24.22.1；没有把默认 Shell 当成用户 PowerShell 的 PATH。终验另以安装的 v26.13.0 运行单元测试。

开发：http://127.0.0.1:4190/Johnny-Town/ （仅本机，含原文件视频流）。
生产预览：http://127.0.0.1:4191/Johnny-Town/ （本地静态构建，无视频接口）。
浏览器：Microsoft Edge（版本记录于 phase05a-browser-results.json）及已有 Chrome for Testing；无头模式。新增/历史浏览器脚本沿用本机安装的 Playwright 路径，另一台电脑需替换 require 路径或配置对应依赖。未执行公网访问、push、merge 或 Actions。

## 最终通过的测试

| 测试 | 数量/覆盖 | 结果与证据 |
|---|---|---|
| Node 核心 + 世界单元 | 16 项（原 6 + 新 10） | 全通过；日期变化、概率、运势持久化、存储异常、媒体降级取消、碰撞安全出生点、迁移、损坏/schema、发现状态、Range、媒体错误提示 |
| 原 Phase 02 浏览器回归 | 23 项 | 全通过；phase05a-regression/phase02-browser-results.json |
| 弹窗移动速度回归 | 17 组，含 15 次三建筑交互 | 全通过；物理模长始终 175，E 监听 1；phase05a-regression/movement-speed-results.json |
| 世界浏览器验收 | 13 组 | 全通过；phase05a-browser-results.json |
| 本地视频与生产隔离 | 12 项 | 全通过；phase05a-video-results.json |
| Edge / Chrome 视觉 | 各 3 种桌面尺寸及动画、减少动态效果、资源/JS 检查 | 全通过；phase05a-regression/phase04-*-visual-results.json |
| Edge / Chrome 输入 | 各 8 个轴向/斜向及弹窗焦点 | 全通过；phase05a-regression/phase04-inputs-*.json |
| 生产构建与子路径 | Vite build + test-static | 通过；精确 /Johnny-Town/assets/ 引用有效，浏览器正常加载/刷新 |

分组粒度不同，不将表中各类断言混为一个“总测试数”。世界 13 组包括：小镇原纹理及零滚动；实际键盘沿路往返；抽签跨区保持；四向世界边缘及摄像机；树/围栏/通路碰撞；刷新恢复；导航输入锁和焦点；20 次重复切换资源计数；速度与斜向；减少动态效果；5 尺寸；旧数据/坏存档；性能与资源错误。

桌面尺寸 1366×768、1920×1080、2560×1440；补充 400×800、800×450 的阅读和弹窗关闭。矮屏允许页面滚动；不声称实现移动操控。原视觉回归截图单独输出至 phase05a-regression，未覆盖 Phase 02–04 历史验收资料。

## 实际性能

最终世界测试：小镇 Phaser 60.1875 FPS / rAF 60.40；草甸移动中 Phaser 60.1055 FPS / rAF 60.11（各约 120 帧短采样）。
缓存切换含淡出/淡入及自动化调度为 286–303ms；减少动态效果切换为 24ms。原始逐次数据保存在 JSON。

20 次切换前后主动 GC 的 JS used heap：6,566,752 → 7,023,560 字节，增量 456,808 字节（约 0.44 MiB）。每次返回同一区域时计数完全一致：E/M 各 1，loaderror 1，玩家刚体 1，collider 1；小镇静态体 8 / 显示对象 29，草甸静态体 11 / 显示对象 32。纹理数按区域动态文本数量不同，但同区域稳定。

这只是短时回归和明显泄漏筛查，不能证明无限次切换无泄漏；未做 GPU/CPU 分析、长时间或低端设备测试。内存阈值仅用于捕捉明显回归。墙钟位移采样约 175–182px/s（受自动化与固定物理步计时边界影响），逐帧物理速度始终 175；动画播放速率独立。

生产 JS 1513.11kB / gzip 358.01kB；CSS 3.63kB / gzip 1.49kB；地面 PNG 25.71kB。相对 Phase 04 增量主要为世界逻辑；Phaser 全量包仍触发 Vite 大于 500kB 的提示，不影响构建。本次未增加依赖或未来正式地图资源。

## 视频结果与修复记录

原文件存在、可读，大小 75,234,071 字节；Edge 实际解码为 1920×1080、时长 212.308833 秒。验证了 Range 206、坏范围 416、播放时钟推进、暂停时钟停止、跳转续播、Esc 后原元素 paused 且 src 移除、键盘恢复。无头环境验证解码和播放状态，不代表人工听感验收。

首次网络失败模拟未通过：等待“视频加载失败”超时，实际文本是“自动播放受限，请点击手动播放”。复现确认媒体 error 事件先设置加载失败，但异步 play 拒绝又覆盖提示。修复 attemptPlayback：真实 video.error 优先于自动播放降级，并为第一次/静音重试两条失败路径加单元回归。最终浏览器网络失败模拟通过。初次部分结果保留 phase05a-video-initial-results.json；本节记录其超时，不能将初次 8 项成功误认为整套成功。

生产文件扫描无 MP4/WebM/MOV/MKV、无本地视频端点、变量名或私有路径。生产预览访问该端点返回 HTML fallback，而非 video/mp4；产品仍显示来源未确认。没有复制原 MP4、截取视频画面、Git LFS 或上传。本地 .env.local 由 Git 忽略。

## 复现命令

先按 README 启动两个本地服务器；从项目根目录执行：

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
node --test prototype/test-core.mjs prototype/test-world.mjs
npm.cmd --prefix prototype run build
node prototype/test-static.mjs
$env:TOWN_URL = 'http://127.0.0.1:4191/Johnny-Town/'
$env:TEST_LOG_DIR = 'logs/phase05a-regression'
New-Item -ItemType Directory -Force -Path $env:TEST_LOG_DIR | Out-Null
node prototype/test-phase02-browser.mjs
node prototype/test-movement-speed.mjs
node prototype/test-phase04-visual.mjs
node prototype/test-release-inputs.mjs
node prototype/test-world-browser.mjs
node prototype/test-local-video.mjs
```

旧测试默认 Edge；通过 BROWSER_EXE 指向已有 Chrome 并设 BROWSER_CHANNEL=chrome 复核视觉/焦点。测试操作的是隔离浏览器上下文，不改用户日常浏览器存档。

## 发布与已知限制

Git 忽略规则保留，暂存前检查未纳入 .env.local、node_modules、dist、缓存、密钥或视频。工作流仅新增世界单元测试到 build job，手动触发与 publish=false 默认值、deploy 条件完全保留。

Firefox 未测试；浏览器脚本目前需要本机 Playwright 路径。正式四区域未开发，公开视频来源和许可仍待确认；无手机控制。当前公开站点状态仅来自用户描述，本次未重新公网验收。Phase 05B 应先准备内容/地图设计，再按区域数据契约扩展；资源规模增大时再评估按需加载。
