# Johnny Town — Phase 04

PC Only 的原创像素小镇个人网站，Phaser 3.90.0 + Vite 6.4.5。当前分支 feature/phase04-polish-release。

已完成：小屋介绍、每日抽签、原创像素地图、四方向红色空心圆头火柴人动画、碰撞、弹窗控制、画质精修及 Edge/Chrome 实测。Rickroll 官方候选嵌入返回150，产品保留媒体未就绪提示。**当前 Phase 04 部分完成：本地验收和发布准备完成，尚未公开部署/公网验收。**

## 本地运行
```powershell
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
cd prototype
npm.cmd ci
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
node --test test-core.mjs
```
WASD/方向键移动，E互动，Esc或按钮返回。生产预览 http://127.0.0.1:4182/ ，子路径静态验收 http://127.0.0.1:4183/Johnny-Town/ 。小窗口显示PC Only/扩大窗口提示，不提供手机控制。

## 结构与资源
prototype/src/main.js 场景与输入；visuals.js 美术与动画；ui.js 弹窗；fortune-store.js 日期和持久化；fortunes.js 30条签文；media.js 媒体配置与降级；assets/ 原创PNG；style.css 界面。
prototype/scripts/polish-art.mjs 调用基础绘制器并加入精修/PNG压缩，可重建精修资源；依赖本机 pngjs/sharp 工具路径。生产包不依赖绘制器或临时图片URL。美术规格见 ART-SPEC.md，来源见 assets/SOURCES.md。

## 验收与发布
6项核心测试、Edge与官方Chrome for Testing的视觉/交互/速度/焦点测试通过；Firefox未测试。详细结果、限制与真实截图见 PHASE04.md、logs/phase04-tests.md 和 logs/phase04-screenshots/。
Pages工作流默认只构建，公开部署必须明确批准后手动开启publish。目前没有Git远端，也没有公网URL。步骤见 DEPLOYMENT.md。
历史开发说明保留 PHASE02.md、PHASE03.md。AE独立目录不参与当前应用，未修改。
