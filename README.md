# Johnny Town — Phase 05B / Memory Woods

Phaser 3.90.0 + Vite 6.4.5 的 PC Only 像素探索个人网站。当前本地开发分支为 feature/phase05b-memory-woods，基于已验收的 Phase 05A。未推送、合并 main 或公开部署。

**快速了解是基础功能，深入探索是可选体验。** 页眉“认识 Johnny [I]”无需解锁即可打开简短介绍、兴趣和项目概览；愿意探索的访客可从小镇北侧走入记忆森林。

## 本地运行

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
cd prototype
npm.cmd ci
npm.cmd run dev -- --port 4200 --strictPort
```

访问 http://127.0.0.1:4200/Johnny-Town/ 。WASD / 方向键移动，E 互动/跨区，I 快速导览，M 探索日志，Esc 关闭。小镇北侧为森林入口，东侧仍可前往测试草甸；森林西南路标返回小镇。

记忆森林有五处原创象征性故事、蜿蜒主路、工坊支路和休憩空地。互动后自动记入日志，可随时重读，故事顺序不限。文案均为可编辑配置，没有编造具体学校、家庭、演出或获奖经历。

```powershell
# 从项目根目录运行
node --test prototype/test-core.mjs prototype/test-world.mjs prototype/test-woods.mjs
npm.cmd --prefix prototype run build
node prototype/test-static.mjs
npm.cmd --prefix prototype run preview -- --port 4201 --strictPort
```

生产预览：http://127.0.0.1:4201/Johnny-Town/ 。原小屋、每日抽签、宝箱、红色火柴人与键盘弹窗保留。页面刷新恢复当前区域安全入口和探索进度。小屏可阅读并关闭面板，不提供手机虚拟摇杆。

## 可编辑内容与结构

- `prototype/src/story-content.js`：快速介绍、公开兴趣、五篇故事；具体舞台/作品信息待本人补充。
- `woods-data.js` / `woods-renderer.js`：森林地图、路径、地标、碰撞及原创像素绘制。
- `story-ui.js` / `ui.js`：摘要、可选展开、快速导览与日志；单一原生 dialog。
- `regions.js` / `region-renderer.js`：区域注册、出口和渲染入口。
- `main.js` / `player-controller.js`：复用的场景、输入、移动和转场。
- `world-store.js`：version 1→2 迁移，区域与故事存档；原 fortune-store.js 和运势存储键不变。

说明：[Phase 05B](PHASE05B.md) · [测试记录](logs/phase05b-tests.md) · [架构记录](logs/phase05b-architecture.md) · [部署说明](DEPLOYMENT.md)。历史阶段文档与截图均保留。

## 本地媒体与发布

本地可在被忽略的 prototype/.env.local 设置 LOCAL_VIDEO_FILE，直接流式读取原 MP4。开发服务仅绑定 127.0.0.1。不要将媒体复制进 src/public/dist，也不要将路径设为 VITE_ 变量。生产构建不包含本地媒体、接口或私有路径；公开播放器保持未确认来源回退。

GitHub Actions 仍仅手动运行，publish 默认 false。本次只增加森林单元测试到 build 步骤，没有触发远端任务、推送、部署或继续 05C。
