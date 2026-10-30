# Phase 06E — 音乐与工程体验

基线897c9d0，分支feature/phase06e-experiences。原P5E未提交资料保留，P6A–P6D代码均存在。本阶段只有两个体验、两个入口和日志完成记录，无新区域或NPC。

## 入口与玩法

旋律湖南岸、舞台与栈桥之间新增小军鼓练习架，交互点(344,568)。E或触摸互动打开；开始后四拍预备，16个原创音符，包含均匀拍、半拍与休止，约19.6秒。空格或大按钮敲击，±260ms判定，重复按住不重复命中；命中、漏拍和稍偏有即时反馈。无需声音，不设通关分数，完成一轮即记完成。结果附项目提供的真实兴趣：多年小军鼓、架子鼓、音乐剧和管弦/戏剧性音乐；不关联实际演奏水平。

机械谷工坊东北侧新增齿轮台，交互点(740,370)，与学徒、蓝图和原地标错开。输入轴固定顺时针，四枚外齿轮必须逐枚反向，才把动力送到工坊。每个大齿轮按钮切换顺/逆方向；有开始、重置、测试、重试和退出。测试时仅连续有效段被点亮，冲突处提示检查相邻方向。所有16种配置仅一个解，遵守外齿轮啮合反转规则，不做物理模拟。成功后介绍Johnny的机械、Create大型工程、自动化、动力传递和反复修改兴趣。按钮为原生键盘/鼠标/触摸控件。

两入口均经完整玩家碰撞体连通性检查，距旧触发点超过75像素，原出口和地标未移动；新增入口实体不阻断旧路线。原湖谷故事浏览器脚本只将故事读取循环明确限定kind=story，未删除旧故事断言。

## 架构与存档

activities-data.js定义入口、兴趣文本、原创节奏、判定和齿轮纯函数。activity-ui.js挂载自包含弹窗，main.js只注入完成回调，ui.js沿用原单一dialog和lockInput。无音频、外部依赖或新增图片包。

performance.now为节奏时间源，requestAnimationFrame只负责更新呈现；不按帧累计时间。window.blur或document.hidden取消当前轮，不偷偷计漏拍。退出时取消动画帧并移除键盘、失焦和隐藏监听器。Space仅在运行时阻止滚动，忽略repeat。状态提示仅文字变化时更新。移动与世界E/M/I由原弹窗输入锁隔离；Esc与返回探索可随时退出。

体验面板采用局部activity-panel样式，关闭按钮在滚动内容外；横屏不会盖住敲击按钮，退出时移除样式类，不改变普通对话。视觉为彩色音符格、鼓架及原创黄铜SVG齿轮，动画不是必须。

世界存储键与version 2保留，仅增加activities:{rhythm:false,gears:false}兼容字段。旧V1/V2缺少字段自动补默认，严格布尔清理；只在完成后幂等保存，不保存分数、当前拍数或齿轮配置。原stories、secrets、区域与fortune键不变。M日志增加「互动体验」，显示完成状态和兴趣简介，不给谜题答案。

## 文件

新增src/activities-data.js、src/activity-ui.js、test-activities.mjs、test-activities-browser.mjs。扩展expansion-data.js、landscape-renderer.js、main.js、ui.js、world-store.js、story-ui.js、style.css。旧test-phase06a.mjs的存档预期增加默认activities，test-expansion-browser.mjs限定原故事循环。素材来源记录与本报告同属本地提交。

## 实际测试

| 检查 | 通过数 | 证据 |
| --- | --- | --- |
| 全部原50项及新增6项单元 | 56/56 | logs/phase06e-units.txt |
| 双体验桌面/手机/平板 | 8/8 | logs/phase06e/results.json |
| 手机完整16音符与刷新 | 1组 | logs/phase06e-mobile-completion.json |
| P6D四NPC/分支/清理 | 9/9 | logs/phase06e-npc/results.json |
| 旧触摸/六区域/存档 | 10/10 | logs/phase06e-mobile/results.json |
| 市政厅/宝箱/运势 | 7/7 | logs/phase06e-hall/results.json |
| 遗迹条件/碰撞/机器 | 3/3 | logs/phase06e-ruins-details.json |

浏览器合计38组，不重复计算复验。所有功能套件页面异常0。用Edge真实引擎，移动为触摸模拟844×390、390×844、768×1024，既有移动回归另覆盖其余尺寸。

桌面真实计时完成一轮，主动留4次漏拍，12/16结果正确；不是加速或直接写完成。验证早拍、失焦取消不记完成、重试、退出恢复移动；手机横屏完整真实触摸16/16并刷新保留标记。齿轮初始错误、重置、正确解、重试、手机触摸成功均通过。两入口已实际WASD步行到达。

旧V2故事、遗迹秘密和完成状态与独立运势字节均保留；新完成跨区、刷新保持。日志两条完成项显示正确。五次开始/退出后的场景计数稳定，无新增物理体或相机变化。NPC、旧地标与切区最终只做一次定向回归，没有重复整套历史矩阵。

生产构建和/Johnny-Town/静态路径检查通过；约1569kB JS/gzip385.5kB，原Phaser大包提示保留。没有版权音频或私人媒体。

已实际打开检查rhythm-location、gears-location、rhythm-desktop、gears-desktop、rhythm-844、gears-390和journal截图。场景入口清楚、像素比例正常、两体验手机控件可读；最终横屏敲击和关闭按钮无重叠。

## 发现并处理

初次手机检查在触摸后的渲染帧更新前读命中样式，改为等待真实hit元素，初始记录保留在initial-results.json。独立复现确认输入已收到「合拍」。视觉检查另发现旧粘性关闭按钮盖住敲击按钮，已改为体验专用flex布局、内部内容滚动和外部关闭按钮，并复验按钮边界及完整手机流程。

## 限制

无声视觉节奏，未加入可选音效。齿轮为方向约束谜题，不是机械仿真。真实Android/iOS、Safari/Firefox、设备音视频延迟和长期压力未验证。失焦取消经过模拟blur验证，真实手机后台切换仍应真机复核；document.hidden使用同一取消逻辑。没有跨设备存档同步。没有推送、部署或P7功能；公开站点仍是旧发布版本。
