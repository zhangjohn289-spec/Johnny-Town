# Johnny Town — Phase 05A

PC Only 的原创像素探索网站，Phaser 3.90.0 + Vite 6.4.5。本地开发分支为 `feature/phase05a-world-foundation`，继承 Phase 04 和首次上传提交，未合并 main、未推送或部署。

中心小镇保留原有建筑、美术、每日抽签、红色火柴人与播放器。现在可沿东侧路标前往 **Frontier Meadow / 边境草甸** 并返回，支持摄像机跟随、安全路口存档、区域发现和世界路书。四个未来正式区域仅显示“尚未建成”。

## 本地运行

```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
cd prototype
npm.cmd ci
npm.cmd run dev -- --port 4190 --strictPort
```

打开 http://127.0.0.1:4190/Johnny-Town/ 。WASD / 方向键移动，E 互动或跨区，M / 页眉按钮打开路书，Esc 返回探索。刷新回到当前区域的安全路口，不保存任意精确坐标。小屏幕可以阅读、滚动和关闭弹窗；游戏仍要求桌面键盘，不提供触屏摇杆。

```powershell
# 从项目根目录执行
node --test prototype/test-core.mjs prototype/test-world.mjs
npm.cmd --prefix prototype run build
node prototype/test-static.mjs
npm.cmd --prefix prototype run preview -- --port 4191 --strictPort
```

生产预览：http://127.0.0.1:4191/Johnny-Town/ 。浏览器测试命令和环境见 [测试记录](logs/phase05a-tests.md)。

## 本地视频

将 `prototype/.env.example` 复制为被忽略的 `.env.local`，设置 `LOCAL_VIDEO_FILE` 为本机 MP4 绝对路径并重启开发服务器。该文件由开发服务器直接读取，支持 Range/拖动播放；不要复制进 src、public 或 dist。默认仅绑定 127.0.0.1，不应将这个带本地媒体的开发服务暴露公网。

生产构建始终排除该配置与视频，保留来源未确认提示。当前未提供获得公开分发授权的媒体来源；本地播放验收不代表分发授权。

## 结构和文档

- `prototype/src/regions.js`：区域地图、障碍、出生点、出口和导航目录。
- `main.js` / `player-controller.js`：共享场景生命周期、区域切换、键盘与固定速度控制。
- `region-renderer.js` / `visuals.js`：草甸绘制及复用 Phase 04 原创贴图、动画。
- `world-store.js`：独立版本化世界存档；`fortune-store.js` / `fortunes.js` 保留原接口及存储键。
- `ui.js` / `media.js`：原生弹窗、世界路书与播放器；`prototype/local-video.js` 为开发专用视频中间件。
- [Phase 05A 功能说明](PHASE05A.md)、[架构记录](logs/phase05a-architecture.md)、[测试记录](logs/phase05a-tests.md)、[部署说明](DEPLOYMENT.md)。

美术来源、重建方式保留于 ART-SPEC.md、prototype/src/assets/SOURCES.md 和 prototype/scripts/。历史 Phase 02–04 文档保留为当时记录。

GitHub Actions 仍只接受手动运行，`publish` 默认 false；只有另行授权并显式设置 true 才可公开部署。本次没有触发 Actions 或修改线上版本。用户报告 Phase 04 已上线，本次未重新验证公网状态。
