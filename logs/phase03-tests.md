# Phase 03 测试报告（2026-10-29）

- Phase 02 基线：5 个核心测试与构建通过。
- 最终构建：Vite 6.4.5 成功。JS 1504.38 KB，gzip 353.81 KB；比 Phase 02 gzip 346.46 KB 增约 7.35 KB（含小 PNG 内联）。CSS 2.06 KB，PNG 总共 55.98 KB。Phaser 整体引擎仍产生大包提示。
- 最终生产服务 4182：Edge 视觉测试通过，1366×768、1920×1080、2560×1440 都保持 3:2，一屏内可见。检查加载失败与运行异常均为零。实测角色行走动画开始、停止、减少动态效果停止帧动画通过。短采样 FPS 约 59.9。
- 功能回归：23 项通过，包含八方向按键、建筑与边界碰撞、介绍、抽签预先保存、动画中断恢复、刷新/新上下文持久化、存储异常、未配置媒体与面板互斥和控制恢复。
- 速度回归：17 组（基线、斜向、三种弹窗各 5 次），物理速度均为 175 px/s，E 监听器始终一个。实际位移误差在固定步长测量容差内。
- 核心测试：5 个全部通过，包含十万次概率抽样。签文、概率、存储和媒体模块未改动。
- 静态部署：node prototype/test-static.mjs 通过，资源由 Vite imports 打包，不依赖临时 URL。未公开发布，未验收公开 Pages URL。
- 实际截图：map-1366.png、map-1920.png、map-2560.png、home-near.png、shrine-near.png、chest-near.png、walking.png、home-panel.png、shrine-panel.png。
- 视觉人工检查查看了地图与介绍面板，修复了边框导致的画布纵横比偏差。PNG 仅在实际加载和截图检查后纳入交付。
- 浏览器回归脚本采用传送到交互范围的既有接口；没有宣称人工走完所有路线。独立 Chrome/Firefox 未安装，未测试。Rickroll 真视频仍未配置/验证。

可重跑：node --test prototype/test-core.mjs；设置 TOWN_URL 为预览地址后执行 test-phase03-visual.mjs、test-phase02-browser.mjs 和 test-movement-speed.mjs（都在 prototype/）。测试工具路径沿用本机 Playwright。
