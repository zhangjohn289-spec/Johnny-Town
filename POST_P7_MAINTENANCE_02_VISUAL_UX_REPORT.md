# Post-P7 Maintenance No.2 — Visual & UX 验收报告

状态：本地实现与验证完成，等待所有者验收。项目根目录 `C:/Users/mi/Desktop/Johnny-Town`；下列证据路径相对此目录。

## 基线与版本保护

- 起始分支：`codex/post-p7-maintenance01-patch01`。
- 已核实完整 HEAD：`9918e65a999f8c036a6e72176a5b82442361e8df`，包含已验收 Maintenance No.1 与 Patch 01。
- 开发分支：`codex/post-p7-maintenance02-visual-ux`。
- 起始已跟踪工作区干净；既有未跟踪 Phase05E/06F 报告与日志保持原样，未纳入提交。
- 无远程操作；没有 fetch、push、merge、部署、仓库设置修改，也没有开始其他维护包或 P7F。

## A. Traveler 行走

### 诊断

旧图集为四方向各四帧、8fps。`scripts/generate-art.mjs` 中 `bob=f%2` 将头身整体在相邻帧间移动1像素；腿主要通过 `leg=[0,4,0,-4]` 做开合，侧身中性帧双腿融合成直线；方向变化时换动画重启至第一帧。原 `animateArt` 按两个轴的瞬时大小直接决定朝向，模拟摇杆在45°附近的微小数值变化会反复换轴。物理速度与向量归一化本身正确。

### 实现

- 保留原32×48画格、红色空心头部、身体原点及红/棕配色。新 `player-walk.png` 离线原创生成，旧 `player.png` 保留。
- 每方向12个周期姿态，以20fps播放，周期600ms；加入膝肘与交替抬脚，侧向手臂和腿反向运动，正面摆臂与抬腿协调。头身不再逐帧上下跳动。
- Phaser 原生 AnimationState 继续负责基于时间的循环；换方向携带原进度，不从首帧重开。
- 45°附近保留当前视觉轴，超过差值0.15再换轴；只决定画面朝向，不修改输入或移动向量。
- 三档预绘肢体幅度配合100ms起停过渡，停止时衰减至中性姿态；没有透明叠影、旋转贴图或逐帧纹理生成。
- Reduced Motion 使用静止朝向姿态，实际移动仍正常。

新增精确像素测试发现原图的透明像素含无效RGB背景值，以及颈部3处像素的叠画顺序差异。透明RGB按不可见处理；生成器随后按原图顺序校准颈部，最终所有姿态的头部可见像素与原图一致。没有通过改动期望图案来放行。

### 物理与视觉证据

`movePlayer()` 与基线逐字一致；碰撞体仍为16×16、offset(-8,0)，速度常量175、输入映射、世界边界、摄像机参数不变。组合测试在正常循环和受控30Hz中逐帧读取物理速度，水平/垂直/斜向均为175。短时位移采样约171.6–183.4 px/s，受固定步长和取样端点影响；未据此声称浮点计时得到精确175。既有17组交互前后速度回归也通过。

实际截图、逐帧图和录制覆盖 idle、向右、向下、斜向、转向和停止；逐帧图按此顺序分六行，每行六次采样。录制中各段会重置到同一路口以便复现，不是完整无传送世界游玩记录。

- 修改前：`logs/post-p7-maintenance02/before/movement-filmstrip.png`、`before/movement.webm`。
- 最终正常循环：`final/movement-filmstrip.png`、`final/movement.webm`。
- 受控30Hz：`final-30hz/movement-filmstrip.png`、`final-30hz/movement.webm`。
- 30Hz由测试临时停止默认循环并以Game.step驱动，实际约17–18次更新/550ms；不是物理30Hz显示设备测试。正常循环约34次更新/550ms。

已查看真实游戏场景与连续姿态图，确认头身稳定、侧身不再反复变成融合直腿、方向衔接及停止姿态更连贯。录像供所有者以正常速度最终判断自然度；单张截图和单元测试不能证明主观动画质量。

## B. 当前目标反馈

移除主循环里的黄色46×20 `strokeRect` 及旧 `ring` 图形。替代物为一个带深色边缘的静态奶油色像素箭头，放在对象侧面并指向对象；结合既有含对象名称的提示，识别不只依靠颜色。不包围互动范围，不增加点击区域，不使用闪烁、脉冲或后期着色器。

`createTargetHighlight` 直接接收原 `chooseInteraction` 最终解析的 `scene.target`，包括遗迹原有状态动作标签处理之后的目标。没有另一次最近对象扫描、距离比较或目标评分。NPC、图像、过程图形与出口标牌只在视觉锚点计算上区分。

标记每场景创建一次，仅目标ID改变时重绘图形指令；每帧不创建Graphics或生成纹理。空目标、弹窗与切区时隐藏；注册表移除后随原选择结果消失，选中图像销毁后不留标记。Phaser 场景关闭销毁旧图形。已有图像轻微选中色继续跟随相同目标，弹窗期间清除，避免视觉残留。

组合检查覆盖六个渲染场景里的13个代表对象：书记员、宝箱、小屋、森林石碑、草甸探险家、湖边鼓、齿轮、工作台、黄金石、符文、手稿、飞机和石门。各对象分别使用正常E和触屏按钮，验证 selected ID＝marker ID，实际弹窗标题也一致。另测森林路牌／档案员重叠位置，确认仍由既有选择器选中档案员。

未醒符文本来就能“查看”解释，属于可激活对象，标记不代表它已解锁推进试炼；没有为视觉而过滤或修改其条件。没有修改可达性、碰撞、半径、锚点、优先级、遮挡、E或触屏激活函数。

证据：`combined-final/results.json`、各对象截图、`combined-final/lifecycle.json`；源码保护记录为 `logs/post-p7-maintenance02/protection.json`。

## C. 可见文字检查

| 原文/项目 | 位置 | 判断 | 处理 | 实证 |
|---|---|---|---|---|
| PHASE 06 — COMING SOON. | ruins-ui.js / phase-door额外插入页 | 功能早已完成，属于过时开发预告 | 删除该额外页；原预算彩蛋、轮换文字及秘密状态不变 | before/phase-door-text.png、final/phase-door-text.png；E/触屏两次交互检查 |
| 钟旁“E 查看” | main.js / clock特定提示 | 在触屏模式仍显示键盘指令，已实际复现 | 电脑保留E；触屏显示“点右侧按钮 查看” | clock-before/results.json、clock-after/results.json，未等待/已等待×电脑/触屏4种组合 |
| 市政厅P1–P5E标签 | city-hall.js / 小镇档案 | 已完成项目的历史记录，不是Coming Soon | 保留 | 源码复核，数据未改 |
| 不存在的下一阶段、未完成的工坊、预算笑话 | 原故事及地点配置 | 已验收的叙事/幽默，不是开发占位 | 保留 | 配置和叙事文件无差异 |
| 欢迎信“世界仍在不断完善”等表述 | portfolio-content.json | 所有者批准原文 | 保留 | 原文摘要校验及源码保护 |

没有广泛重写文案，也没有加入新台词、剧情或介绍内容。

## D. 小型像素物件审查

重点查看遗迹“失败的飞行实验”：源码为顶部俯视双翼实验模型，有宽横翼、细长机身、尾翼、螺旋桨和起落结构。正常桌面缩放及模拟手机/横屏中均能识别这些结构，亮木色与遗迹深绿背景分离。

**No change necessary.** 保留已验收飞机图形与地图。它不是Minecraft空中工厂，没有飞艇替换或飞行器扩展。另抽查鼓、手稿、黄金石及齿轮与新标记共存情况，没有发现需要打开旧美术重制的理由。

证据：`before/ruins-flight.png`、`final/ruins-flight.png`、`combined-final/portrait-aircraft.png`、`combined-final/landscape-aircraft.png`。`landmark-art.js`及相关区域绘制文件未改。

## E. 设备、焦点与清理

实际环境：Windows、PowerShell、已安装 Edge Chromium156.0.4314.50无头浏览器。没有取得物理iPhone/iPad/Android或相应浏览器访问，也没有用户提供的可复现真机故障记录。因此没有推测性重写移动控制。

模拟视口包括桌面1440×1000、平板1024×768、手机390×844、小横屏667×375；既有移动回归另包含375×667、844×390、768×1024等尺寸。触屏使用Playwright/CDP模拟，未称为真机测试。已检查摇杆/斜向速度、选中目标按钮、介绍/欢迎重读、弹窗尺寸与关闭、Reduced Motion、布局变化及输入清空。

打开介绍或重读欢迎信会隐藏目标标记，E和移动不触发背后世界；关闭后依当前实际位置重新反馈，不恢复过期对象。组合用例连续22次Town/Meadow切换（前2次预热，后20次测量），每区域的对象、纹理、物理体与监听器计数稳定，始终只有一个目标标记，E/I监听器各一个。没有增加运行时定时器或全局输入监听器。

所有者真机复核清单：

1. 记录设备型号、浏览器及系统版本；竖屏/横屏切换，检查刘海、底部手势区和动态地址栏。
2. 连续拖动摇杆、斜向移动、抬手与多指操作，确认无卡键或重复互动。
3. 阅读六章、滚动欢迎信并反复重读，关闭后检查焦点和停止状态。
4. 与NPC、宝箱、石头互动，确认箭头指向对象与实际打开内容一致。
5. 切后台、锁屏再回来，检查输入清空与恢复；该行为未在真实移动设备上验证。
6. 正常速度查看新旧运动录像，再在游戏道路连续走/停/转向，确认个人观感；系统Reduced Motion下检查静止姿态仍清楚。

## 性能与资源

为避免套用历史60fps结论，从验收提交9918e65仅归档源码到忽略的 `prototype/tmp/maintenance02-baseline-9918/`，没有复制环境文件或私人媒体。在独立4522预览重建该基线（JS哈希与基线一致），与4501新版本在同一Edge环境顺序采样，每项预热1.5s再记录240个rAF间隔，没有其他浏览器测试并行运行。

| 场景 | 基线 median / P95 ms | 新渲染 median / P95 ms |
|---|---|---|
| 桌面 | 16.7 / 16.9 | 16.7 / 16.8 |
| 模拟手机 | 16.7 / 16.9 | 16.7 / 17.0 |
| Reduced Motion | 16.7 / 17.1 | 16.7 / 17.0 |

这是帧交付节奏对比，不是物理手机GPU、功耗或散热结论。未观察到明显回退。Town前后均39个显示对象、28个纹理、1动态/9静态物理体、E监听器1个。图集原始RGBA面积从128×192增至1184×192，预生成PNG约66kB，只有一张缓存纹理；没有逐帧生成。性能采样使用稳定动画/标记实现；其后只按原图校准了颈部3像素覆盖顺序和触屏钟提示，未改变渲染工作量或循环逻辑。

证据：`performance/results.json`、`baseline-build.txt`、`combined-final/lifecycle.json`。

## 验证结果与范围

- 既有104项单元检查通过。新增6项视觉单元最终通过：方向迟滞、图集头部像素稳定及原图一致、转向进度、30/60Hz起停、索引范围、视觉标记位置和缓存行为。首次全单元记录为109/110，精确颈部像素检查失败；按原图修复后只复跑受影响6项，均通过。没有隐藏该失败或修改形状期望来放行。见 `unit-final.txt`、`targeted-unit-accepted.txt`。
- 组合浏览器：**14/14**，页面错误0，见 `combined-final/results.json`。
- 对已改变的共享视觉执行一次有限既有回归：World **13/13**、Mobile **10/10**、移动速度 **17组验证**、欢迎/重读及按钮 **13/13**；页面错误0。见 `regression/summary.json` 及分组结果。
- 钟提示定向复验 **4/4种组合**，没有重跑整套世界回归。
- 正常/30Hz录像及逐帧图已生成并检查；剩余主观自然度由所有者观看验证。

没有重跑全五课试炼、全Gear Valley时钟传动审计、29对象浏览器可达性审计、六区美术重构检查或六章正文全浏览器重验。保护源码和先前验收证据继续适用。

首轮组合脚本包含一次不必要的完整Graphics跨进程序列化，在清理检查前终止并移除；最终脚本只读ID/计数，随后14项完整通过。基线录像初次因Playwright可选FFmpeg不存在而未生成；改用浏览器原生canvas.captureStream/MediaRecorder成功记录，无下载、无新增依赖。期间一次自动审批超时未执行命令，后续正常完成，没有遗留受阻操作。

## 修改文件

| 文件 | 变动 |
|---|---|
| prototype/src/main.js | 用最终target驱动标记、弹窗时隐藏；钟的触屏操作提示 |
| prototype/src/target-highlight.js | 单个静态像素箭头及视觉锚点，无选择算法或输入处理 |
| prototype/src/traveler-animation.js | 视觉朝向、原生动画相位衔接、起停图集映射 |
| prototype/src/player-controller.js | 仅视觉帧范围/播放率及视觉重置调用；movePlayer和物理不变 |
| prototype/src/visuals.js | 新图集、动画调用、弹窗期间清除已有选中色 |
| prototype/src/assets/player-walk.png | 新生成步态图集；原player.png保留 |
| prototype/scripts/generate-traveler.mjs | 可复现的原创像素图集生成器 |
| prototype/src/assets/SOURCES.md | 新图集来源与生成说明 |
| prototype/src/ruins-ui.js | 删除过时Coming Soon额外页 |
| prototype/test-maintenance02.mjs | 新增6项定向单元检查 |
| prototype/test-maintenance02-browser.mjs | 组合、身份、生命周期、受控帧率与模拟触屏 |
| prototype/test-maintenance02-clock.mjs | 钟提示前后定向复验 |
| prototype/test-maintenance02-performance.mjs | 同环境前后帧交付测量 |
| prototype/capture-maintenance02.mjs | 截图、实际画布录像和逐帧图 |
| prototype/run-maintenance02-regression.mjs | 四组有限回归，非全面玩法审计 |
| logs/post-p7-maintenance02/ | 原始、迭代与最终证据；录像仅游戏画布内容 |

## 最终构建、限制与交付

生产构建通过；base仍为 **/Johnny-Town/**，Actions/部署配置未改。最终JS `index-dOvlYIF7.js`约1,616.44kB（gzip407.17kB），图集 `player-walk-BYuAlWDv.png`约65.98kB，CSS沿用原文件。原有Phaser大包警告保留，没有借此扩展优化任务。构建扫描无本地视频路由/私人路径，未复制私人视频。

已验证范围内没有未解决的功能失败。真实移动设备、Safari、真实安全区、后台恢复、辅助技术和主观步态自然度仍需所有者确认；不声称全设备或完整无障碍认证。

本地预览：<http://127.0.0.1:4501/Johnny-Town/>。最终验收权属于所有者，未代表所有者宣布通过。

实现／测试／证据提交：**27d0663d6288681eb753f17396b91f2dcffbb929**。报告以随后独立本地文档提交收录，以便引用实现SHA；最终HEAD见交付消息。没有远程修改、合并、发布或下一阶段工作。
