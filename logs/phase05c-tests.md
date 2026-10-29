# Phase 05C 验收记录

日期：2026-10-30。Windows / PowerShell / Node 26.13.0；Vite 生产预览使用 http://127.0.0.1:4201/Johnny-Town/ 。基线为 c115d9d，开发分支 feature/phase05c-lake-valley。

## 最终测试结果

| 检查 | 实际结果 | 原始记录 |
| --- | --- | --- |
| Node 单元测试（core、world、woods、expansion） | 33/33，0失败 | phase05c-unit-results.txt |
| Phase 02 浏览器回归 | 23/23 | phase05c-regression/phase02-browser-results.json |
| 移动速度回归 | 17组通过，速度175，监听器1 | phase05c-regression/movement-speed-results.json |
| Phase 05A 区域回归 | 13/13 | phase05c-regression/phase05a-browser-results.json |
| 五处森林故事及05B回归 | 13/13 | phase05c-forest/results.json |
| Phase 05C Edge | 19/19，页面异常0 | phase05c-edge/results.json |
| Phase 05C Chrome | 19/19，页面异常0 | phase05c-chrome/results.json |
| 桌面尺寸和原动画回归 | 1366×768、1920×1080、2560×1440通过，错误0 | phase05c-regression/phase04-msedge-visual-results.json |
| 八方向和焦点回归 | 八方向速度均175，焦点检查通过 | phase05c-regression/phase04-inputs-edge.json |
| Vite生产构建与静态路径检查 | 通过；base为/Johnny-Town/ | npm run build、test-static.mjs |

最后六个浏览器功能套件共104组（不是104个互不重叠功能）；尺寸及输入记录单列。开始开发前，原27项单元与13组05B浏览器基线已通过，后者保存在phase05c-baseline/results.json。

构建JS约1536.97 kB、gzip369.09 kB；CSS4.73 kB、gzip1.83 kB；原图集25.71 kB。保留Phaser全量包超过500 kB的Vite警告，构建没有报错。没有新增运行依赖或外部素材下载。生产扫描未发现本地视频接口、私人视频路径或视频文件。

## 新区域验收方法

Edge 156.0.4314.50和Chrome 156.0.8078.73均在真实浏览器引擎的headless模式运行。通过Playwright发送WASD/E/I/M/Esc，实际走过草甸全部出口、旋律湖四处地点和机械谷四处地点；每处打开并展开故事。测试中的区域切换压力循环会将人物定位到出口，再按E；不能把这部分计为完整徒步旅行。

五个开放区域均能打开快速介绍和日志。新版日志包含13篇故事，旧五篇ID保留。单元覆盖V1迁移、损坏/不可用存储恢复、新旧V2兼容和重复记录去重；浏览器载入已有五篇故事的存档，发现八篇后刷新仍保留13篇，独立运势键内容保持原样。

地图连通测试按人物完整碰撞体检查所有出生点、故事点和出口。另在浏览器朝湖面及工坊持续移动，确认实际阻挡，摄像机仍处于地图范围。开启Reduced Motion后，旋转齿轮归零停止。

## 资源与性能

每个浏览器在预热各区域缓存后执行连续20次新区域往返，逐次比较同一区域资源计数。两浏览器计数一致：

| 区域 | E/M/I监听器 | 动态体 | 静态体 | 碰撞器 | 场景对象 |
| --- | --- | --- | --- | --- | --- |
| 草甸 | 各1 | 1 | 19 | 1 | 54 |
| 旋律湖 | 各1 | 1 | 35 | 1 | 58 |
| 机械谷 | 各1 | 1 | 10 | 1 | 36 |

纹理计数在湖/谷为17，草甸为18（区域标记纹理不同）；重复访问相同区域未累加。首次访问每个新区域会正常缓存一张地面纹理，因此测试预热后才检查稳定性。

短时帧率采样：Edge60、Chrome约59.98 FPS。转场测量包含淡出、场景建立和淡入，约286–337 ms。本结果未包含长时间堆内存剖析，不能据此声称所有设备稳定60 FPS或长期零泄漏。

## 实际截图检查

已打开并检查最终截图，而非仅检查生成成功：

- [草甸](phase05c-edge/meadow.png)：自然弯曲分路、花丛、多层草色、开放空地和三向指路牌。
- [湖岸与舞台](phase05c-edge/lake-stage-scene.png)：湖面、芦苇、睡莲、栈桥与舞台可辨，步行路线清楚。
- [机械谷](phase05c-edge/great-transmission-scene.png)：岩地、工坊、管道、大小齿轮和飞行蓝图具有不同于湖区的配色。
- [故事](phase05c-edge/lake-stage-story.png)、[快速介绍](phase05c-edge/lake-intro.png)、[日志](phase05c-edge/valley-journal.png)：正文与展开阅读保留，作者解释字段已移除；长日志可滚动。

过程中修正了湖岸逐行绘制造成的条带、工坊屋顶斜坡方向、传动齿轮遮挡，随后重新构建并完成两浏览器验收。视觉仍采用项目原有的原创程序像素绘制方式。

## 测试中遇到的问题

1. 首次基线浏览器连接失败：之前预览服务已退出；启动4201后通过。
2. first-run.json：测试寻路紧贴节奏石，键盘跟踪容差导致擦碰。增加寻路安全余量后实际步行通过，未放宽游戏碰撞。
3. cache-warmup-run.json：首次进入新区域增加缓存纹理，被测试误判为累积；先预热再比较，20次计数稳定。
4. motion-event-run.json：媒体偏好模拟完成时，浏览器matchMedia事件尚未派发；等待偏好与齿轮状态生效后通过。

这些中间失败记录保留在phase05c-edge，最终结果以results.json为准。

## 限制与交付范围

可选节奏/机械小游戏未实施。未重新验收私人MP4的完整播放；本阶段验证公开构建的安全回退及媒体错误分类等原有测试。没有公开媒体来源新增。Firefox、低端设备及长期内存压力测试未覆盖。

未发现阻止本阶段交付的问题，可以进入下一阶段规划和用户验收；本次没有开始05D、City Hall、合并main、推送或部署。GitHub Actions继续只接受手动触发，publish默认false。
