# Phase 05B 实际验收记录

日期：2026-10-29。基线 feature/phase05a-world-foundation / ceeb683，工作区干净，含 c5a0435 功能提交。基线16项单元测试和生产构建通过后，创建 feature/phase05b-memory-woods。本次只本地开发、测试和提交。

## 环境与运行

Windows PowerShell。npm.cmd 构建使用安装的 Node v26.13.0；默认工具 node 为 Codex 捆绑 v24.22.1，浏览器脚本使用该版本。最终单元测试也以 v26.13.0 复核。

本机开发：127.0.0.1:4200/Johnny-Town/；生产构建预览：127.0.0.1:4201/Johnny-Town/。两个服务均绑定127.0.0.1。浏览器为 Edge 156.0.4314.50、Chrome for Testing 156.0.8078.73，无头模式，采用隔离上下文，不改用户浏览器存档。

## 测试数量与结果

| 测试 | 实际数量 | 最终结果 | 证据 |
|---|---:|---|---|
| 核心/世界/森林单元 | 27 项（原16 + 新11） | 全通过 | phase05b-unit-results.txt |
| 新森林完整验收 | Edge 13组 + Chrome 13组 | 全通过 | phase05b-edge/results.json、phase05b-chrome/results.json |
| 原小镇浏览器回归 | 23项 | 全通过 | phase05b-regression/phase02-browser-results.json |
| 原移动速度回归 | 17组，含三建筑各5次弹窗 | 全通过，物理模长175，E监听1 | phase05b-regression/movement-speed-results.json |
| 原05A世界回归 | 13组 | 全通过，草甸往返及存档/碰撞/相机保留 | phase05b-regression/phase05a-browser-results.json |
| 原视觉/输入回归 | Edge 3种桌面尺寸、动画/Reduced Motion、8方向及焦点 | 全通过 | phase05b-regression/phase04-*.json |
| 原本地视频及隔离 | 12项 | 全通过 | phase05b-regression/phase05a-video-results.json |
| 生产构建与静态资源 | Vite build、test-static | 通过，精确/Johnny-Town/路径 | 本次构建输出及浏览器无资源失败 |

不同条目的粒度不同，未将测试组、方向采样和单条断言混算为一个总数。浏览器完整森林验收两种浏览器均独立执行，未只复用截图。

森林13组分别覆盖：

1. 无门槛快速导览：鼠标/I键、介绍/兴趣/项目/待补充说明、可选探索按钮、焦点恢复。
2. 初始日志五个神秘占位，不泄露故事正文，进度0/5。
3. 实际键盘从小镇中央沿北路进入森林，安全出生点稳定。
4. 实际WASD按“初始→岔路→工坊→古树→未来”顺序走访五处，摘要与可选展开均匹配内容配置，弹窗冻结移动。
5. 重复互动不重复记录；五条日志均可重读全文，进度5/5。
6. 刷新恢复森林安全入口和五条发现记录。
7. 休憩支路可到达，沿路实际走回西南出口，安全返回小镇。
8. 连续20次缓存切换，逐次比较监听、物理、显示对象与纹理数，故事记录保留。
9. 转场后石碑、古树、工坊、岩石和树干实际阻挡玩家。
10. 四边物理限制与摄像机夹紧，无地图外空白。
11. Reduced Motion、5种尺寸、键盘展开日志与Esc关闭。
12. 05A v1迁移、坏JSON/缺字段/无效出生点回退，fortune字节不变。
13. 森林短时渲染性能、JS/资源错误检查及生产媒体隔离。

主要路径单元测试每2px采样完整16×16玩家脚部，不只检查中心点；另以8px网格BFS确认所有地标与出口连通。浏览器路径验收始终使用真实DOM键盘，物理碰撞开启。body.reset仅用于独立碰撞/边界起点和切换压力测试，未冒充路径步行。

## 视觉检查

实际打开并检查了Edge森林入口、古树、快速导览截图；Chrome运行生成相同地点的独立截图。原草甸的规则十字路已被自然分岔主路、东南工坊支路和西侧小空地替代。100棵树含不同树冠与针叶树，搭配苔藓、蘑菇、花草、岩石、落叶及树桩。五处地标各有独立造型和文字标识，红色角色及浅色道路保持对比。

初看后调整古树叶簇和针叶树细节，最终两浏览器验收使用精修后的构建。初次导览截图捕捉到160ms面板动画中间帧，后续截图等待220ms以记录完成态，未将其当成稳定画面问题。

代表截图（均来自实际游戏）：

- phase05b-edge/forest-entrance.png：入口、主路、支路与森林密度。
- phase05b-edge/echoing-tree-scene.png：古树、小舞台、挂饰与角色层级。
- phase05b-edge/workshop-scene.png：工坊、蓝图、齿轮与支路。
- phase05b-edge/unwritten-scene.png：留白拱门与故事终点。
- phase05b-edge/quick-introduction.png：公开导览正文及探索指引。
- phase05b-edge/*-story.png：五篇故事展开状态。
- phase05b-edge/journal-complete.png：已发现故事重读。
- phase05b-edge/narrow-readable.png：400px宽度的可阅读界面。
- phase05b-chrome/：对应Chrome截图与完整JSON。

桌面1366×768、1920×1080、2560×1440比例检查通过；补充400×800、800×450的导览/日志关闭。额外实查1366×768导览打开后的scrollTop=0，标题仍在视野内。短屏允许页面/面板滚动，不宣称实现手机控制。

## 性能与资源清理

| 指标 | Edge | Chrome |
|---|---:|---:|
| 森林Phaser短采样FPS | 60.1875 | 60.0 |
| 120帧rAF平均FPS | 60.00 | 59.98 |
| 缓存切换含淡变与自动化开销 | 287–305ms | 287–333ms |
| Reduced Motion切换 | 24–25ms | 24–25ms |
| 20次切换前GC后JS堆 | 6,514,060字节 | 6,487,208字节 |
| 20次切换后GC后JS堆 | 7,027,304字节 | 7,007,884字节 |
| 堆增量 | 513,244字节，约0.49MiB | 520,676字节，约0.50MiB |

每次返回同一区域时计数稳定：E/M/I各1，loaderror 1，玩家刚体1，collider 1。森林静态体108、显示对象234、纹理24；已访问森林后的小镇静态体8、显示对象33、纹理22。文字纹理数量随区域不同，固定森林纹理只生成一次。没有发现重复绑定或资源数累积。

这些是短时、无头环境的筛查，不证明长时间零泄漏，也没有测GPU显存或低端设备。30–60秒快速了解是内容长度目标，未做真人阅读理解实验。

最终构建：JS 1,528.15kB / gzip 364.97kB，CSS 4.73kB / gzip 1.83kB，地面PNG25.71kB。相对05A约新增15kB JS / 7kB gzip，无新增生产依赖或下载素材。Phaser全量包仍触发Vite大包提示，不影响构建；未为消除提示扩展重构范围。

## 失败与修复

首次扩展后，旧test-world的“未知区域过滤”用woods作未知ID，因森林已经正式登记而失败（actual多出woods）。将该夹具换成仍未开放的lake，保留原断言目的；随后的27项单元测试全通过。没有通过删除碰撞或降低速度/资源断言绕过失败。

其余最终浏览器验收无JS异常、无必要资源请求失败，无未解决测试失败。

## 媒体、Git与范围

本地视频回归再次实际解码1920×1080、212.308833秒，Range、播放、暂停、跳转、Esc移除源及故障提示通过。未复制原文件。生产包扫描没有MP4/WebM/MOV/MKV、__local-video、LOCAL_VIDEO_FILE或私有路径。公开播放器仍保留未确认来源回退。

Git候选文件扫描未发现密钥特征、视频、.env.local、构建产物或缓存；本地配置和dist仍被忽略。工作流只把test-woods加入build测试，publish=false及手动触发保持不变。本次没有网络推送、合并main、部署或05C开发。

## 复现

从项目根目录，先按README启动4200开发和4201生产预览：

```powershell
$env:PATH='C:\Program Files\nodejs;'+$env:PATH
node --test prototype/test-core.mjs prototype/test-world.mjs prototype/test-woods.mjs
npm.cmd --prefix prototype run build
node prototype/test-static.mjs
$env:TOWN_URL='http://127.0.0.1:4201/Johnny-Town/'
$env:DEV_URL='http://127.0.0.1:4200/Johnny-Town/'
$env:TEST_LOG_DIR='logs/phase05b-regression'
New-Item -ItemType Directory -Force $env:TEST_LOG_DIR | Out-Null
node prototype/test-woods-browser.mjs
node prototype/test-phase02-browser.mjs
node prototype/test-movement-speed.mjs
node prototype/test-world-browser.mjs
node prototype/test-phase04-visual.mjs
node prototype/test-release-inputs.mjs
node prototype/test-local-video.mjs
# Chrome森林验收：BROWSER_EXE设为已安装的chrome.exe，FOREST_LOG_DIR设为logs/phase05b-chrome
```

新森林脚本可通过PLAYWRIGHT_MODULE指定Playwright模块路径，默认沿用本机已有安装；旧脚本仍采用本机路径，迁移开发机需调整。Firefox、长期/低端设备、真人可用性、具体个人作品/舞台资料与公开媒体授权未验收。不阻碍当前本地森林玩法，不能将它们宣称已经完成。
