# Phase 06A — 市政厅与宝箱外链

基线d05d483，本地分支feature/phase06a-city-hall。上一阶段未提交的logs/phase05e*资料完整保留且未纳入本次提交。

## 功能

市政厅在小镇西南、小屋南侧，建筑实体x140/y390、168×90，入口(224,510)，靠近按E。石材、木梁、绿色屋顶、黄铜齿轮标志，沿用程序像素绘制。四个栏目为小镇档案（P1–P5E）、世界目录（现有六区域，仅介绍）、镇长办公室（Johnny, the Chief Mek与预算对白）、公告栏。单一原生dialog，Esc退出并恢复移动。

原宝箱坐标、外观和提示保留。按E后显示外链入口，点击才打开https://www.bilibili.com/video/BV1GJ411x7h7/，采用target=_blank和rel=noopener noreferrer。提供只读可复制地址及拦截/加载失败时的手动访问提示。没有嵌入视频或自动访问站外页面，游戏留在原标签页。共享media.js与本地视频开发工具未删除，但中央宝箱已不调用它们。

存档模块、版本2、所有存储键及已有字段均未修改，市政厅不需要持久化。无新区域、NPC或后续阶段功能。

## 文件

- prototype/src/city-hall.js：建筑绘制与四栏目内容。
- prototype/src/chest-link.js：站外链接与可复制回退地址。
- config.js、visuals.js、ui.js：建筑注册、绘制和弹窗路由。
- test-phase06a.mjs、test-phase06a-browser.mjs：定向验收。
- test-phase02-browser.mjs：将已过时的宝箱播放器断言更新为规范外链断言，未重复执行全历史浏览器矩阵。

## 验收

- 原41项及新增3项单元：44/44，logs/phase06a-units.txt。
- Edge真实浏览器独立存储：7/7组，logs/phase06a/results.json。市政厅实走、四栏目、关闭/恢复移动、实体阻挡、原三个交互点和出口实走；宝箱无video/iframe，显式点击后新标签页URL正确；交互前后存档逐字节相等，刷新不丢失；运势保留，日志可读；六区域往返、I/M/Esc和1366×768面板边界通过，页面异常0。
- 外链新标签页采用网络拦截测试，验证导航行为而不播放远程视频；没有声称验收了Bilibili播放、登录、地区限制或第三方网络可用性。原生外链不可靠地回报拦截状态，因此始终提供可复制地址作为回退。
- 生产构建通过，/Johnny-Town/静态路径检查通过；无私人视频或本地视频接口进入产物。原Phaser大包提示保留。
- 实际打开检查hall.png、hall-panel.png，建筑可辨且不阻路，长面板可滚动；hall-small.png记录小桌面底部栏目。

首次浏览器连接因旧4201服务已退出而失败，启动生产预览后通过。没有发现需扩大改动范围的问题。未另测Chrome/Firefox或长期性能。

本阶段仅本地提交，未推送、部署或开始06B。本地预览http://127.0.0.1:4201/Johnny-Town/。
