# Johnny Town Phase 02

应用目录 prototype/，Phaser 3.90.0 + Vite 6.4.5，PC Only。AE 独立目录保持不变。

## 运行
PowerShell 当前会话将 C:\Program Files\nodejs 放入 PATH 首位，然后：
```powershell
cd prototype
npm.cmd ci
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
node --test test-core.mjs
```
当前预览：http://127.0.0.1:4180/ 。WASD/方向键移动，靠近地点按 E，Esc 或按钮关闭。

小屋完整介绍、神社 30 条原创签文和每日保存已可用。百宝箱播放器模块就绪，但尚未配置已确认的视频来源，**Phase 02 部分完成**。

模块：src/config.js 地点参数；main.js 地图移动；ui.js 弹窗与界面；fortunes.js 签文；fortune-store.js 日期、权重和持久化；media.js 媒体配置与播放降级。

## GitHub Pages
.github/workflows/pages.yml 仅手动触发，上传 prototype/dist。Vite base=./，构建资产使用相对路径，无后端和路由依赖。上传后在 Pages 设置选择 GitHub Actions，再手动运行。尚未公开发布。

开发说明与已知问题：PHASE02.md。测试结果：logs/phase02-tests.md。浏览器测试脚本依赖本机捆绑 Playwright 和 Edge，其他机器需调整 require 路径。没有新增依赖。

## Phase 03（当前版本）
正式像素场景、四方向火柴人动画、环境细节与统一 UI 已接入。美术规范见 ART-SPEC.md；开发和限制见 PHASE03.md；实测结果见 logs/phase03-tests.md。
生产预览：http://127.0.0.1:4182/ 。三种桌面尺寸已测试，移动、碰撞与每日签保持。小窗口显示扩大窗口/PC Only 提示。Rickroll 视频仍未配置。
PNG 生成器位于 prototype/scripts/generate-art.mjs，资源位于 prototype/src/assets/，无外部图像或字体依赖。没有公开发布。
