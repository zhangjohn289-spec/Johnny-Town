# Post-P7 Audio Pass — 本地实现与验证报告

状态：已完成本地音频接入和技术验证，等待所有者试听与真实设备验收。
工作日期：2026-10-31。本报告不代表发布授权或所有者已接受音色。

## 1. 起点与范围

- 起始分支：`codex/post-p7-maintenance02-visual-ux`。
- 起始 HEAD：`242678878f5b6bb70b19d234f19b658ea3cc73bc`；其中 Maintenance No.2 实现为 `27d0663d6288681eb753f17396b91f2dcffbb929`。
- 新本地分支：`codex/post-p7-audio-pass`。
- 实现/测试提交：见本报告末尾的提交记录。
- 开始时已跟踪文件干净。原有 PHASE06F 报告和 phase05e/phase06f-stageb 未跟踪文件保留，未纳入提交。
- 现有 Phaser 3.90 + Vite 6.4.5、单一 WorldScene 重启切区、原生 dialog、独立世界/抽签/欢迎信存储已核实。原仓库没有环境音资产或共用音频系统；旧视频降级代码未修改。
- 只新增音频和小型控制入口。没有音乐系统、语音、新玩法、场景美术或部署更改。

## 2. 功能与使用

页眉新增「声音：已静音」入口，启用后显示「声音：已开启」，刷新后为「声音：待启用」。点击打开沿用原有焦点与输入隔离的「小镇声音」弹窗：

- 原生按钮「启用声音 / 静音」，键盘 Enter/Space 或触摸均可。
- 有标签的 0–100% 原生音量滑杆，支持方向键与触摸拖动；音量为零有文字状态。
- 返回探索沿用现有关闭/焦点规则；没有额外快捷键、重复退出按钮或遮挡游戏的大按钮。
- 初次访问不播放、不请求音频文件。只有点击启用才调用浏览器 AudioContext.resume 并异步加载声音。
- 独立键 `johnny-town.audio.v1` 存 `{version:1,enabled,volume}`，默认关闭、音量 50%。读取严格校验、损坏时安全默认、禁用存储时退回会话设置并提示。
- 保留开启偏好与音量，但每次页面刷新仍要求一次明确启用，防止自动播放。浏览器中断 AudioContext 后同样需要再次启用。不会后台循环重试。

## 3. 素材与声音设计

外部素材均为发布者明确标注的 **CC0 1.0**；无需署名，仍保留作者与出处。无私人媒体、视频提取音轨、商业音乐、可识别旋律或人声。

| 输入来源 | 作者 / 许可 | 本地衍生用途 |
|---|---|---|
| [wind1](https://opengameart.org/content/wind1) | Luke.RUSTLTD，CC0；原作者用 PureData 合成 | 六区域的柔和风底 |
| [Birds and Wind — Ambient](https://opengameart.org/content/birds-and-wind-ambient-birds-wind-and-synth) | Spring Spring，CC0；页面另列鸟声贡献者 isaiah658、syncopika、pauliuw | Town / Woods / Meadow 的自然细节；仅取无配乐 Ambient 版本 |
| [Water Waves](https://opengameart.org/content/water-waves) | transitking，qubodup 提交，CC0 | Lake 柔化水声 |

许可链接：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。具体下载 URL、映射、再生成方法见 `prototype/public/audio/README.md`。
网页浏览工具部分返回 403，但直接下载取得合法 RIFF / FLAC / Ogg 二进制并成功解码。Kenney Interface Sounds 下载返回 HTML，已弃用，没有当作音频纳入。

| 新文件（`prototype/public/audio/`） | 内容 |
|---|---|
| `town.wav` | 温和风底、少量自然环境 |
| `woods.wav` | 较明显的林间自然声、轻风 |
| `meadow.wav` | 开阔风声为主、极轻自然声 |
| `lake.wav` | 小波浪录音与微风 |
| `valley.wav` | 风底、原创低频机械持续音与轻金属滴答 |
| `ruins.wav` | 空旷风底、低音量原创共鸣，无惊吓音 |
| `open.wav` / `close.wav` | 同一原创温和短音家族中的开/关提示 |
| `confirm.wav` | 原创完成提示；小游戏完成、Golden Spin 最终完成面板 |
| `fortune.wav` | 原创抽签短音，仅实际抽签时触发 |

原创合成贡献亦以 CC0 提供。没有将“六个不同真实地点的录音”作为宣传：这些是选取录音与合成源后进行的克制混音。

全部 mono PCM16 / 22050 Hz。六条环境音各 18 秒、793,844 字节；四条提示音 0.10–0.38 秒。总计 **4,799,402 字节（约 4.58 MiB）**。采用 WAV 是为避免新编码依赖及移动端格式差异；若以后需要压缩，应在真实 Safari 验证后另行处理。当前首次静音下载为零；启用时约 811 KiB（当前区域加四条短音），其他区域按需下载。六区域缓存解码音频约 9.1 MiB，另有很小的提示音缓存，数量固定。

离线工具 `prototype/scripts/generate-audio.mjs` 用本机现有 Edge 解码，滤波/DC 消除/限制峰值/重叠拼接后生成文件；不参与普通构建，也不在游戏内持续合成。短水声录音的内部重复接缝也做了重叠处理。

原始输入 SHA256（原始大文件仅在忽略的临时目录，不提交）：

```
wind.bin   A2856F794FBF77E05F8241DC4ADEADE7F62FA21C3C9DC49F7725B6C6218060C3
water.bin  0BD84B2061A82C234470BD4E16EFC6AB24851928D3F93E1757BFEA048B2D7A33
forest.ogg 28F99F536A0772D80052F03BCB22C9ED8FD7C6E4DB7F2E8356EFCF26A8E24F01
```

新增文件校验清单：`logs/post-p7-audio/asset-manifest.json`。峰值、DC、循环边界通过数值检查；实际听感、耳机/手机扬声器平衡仍待所有者试听，不能用输出非零或波形检查代替。

## 4. 架构与生命周期

- `audio-manager.js`：一个 game 所有的控制器，复用 Phaser SoundManager、声音实例、增益与 AudioCache。直接使用它已有的 AudioContext 解码，以便明确管理按需请求和失败，不创建第二个音频引擎。
- 第一次明确启用才加载当前环境音及四个效果。每个资源最多一个在途请求；超时 8 秒；HTTP、解码、播放、存储和浏览器拒绝均不会阻断 UI。失败键只在另一次明确启用后重试。
- 所有声音共用音量偏好；环境音/效果有克制的内部增益。提示音 90 ms 节流、最多三个短音实例，结束即移除；快速连锁弹窗跳转省掉中间关闭音，不在每个按键或音量调整上播放提示。
- 切区设置新的音频意图，旧环境 450 ms 淡出到零并销毁后，新环境才启动并 450 ms 淡入。最多一个环境循环，绝不为做交叉淡化而保留两个循环。异步旧区域请求完成后不会在错误区域启动。
- Scene shutdown 撤销区域意图；后续 create 复用同一控制器。淡化 RAF 只在需要时运行，稳定播放无新增每帧工作。
- 静音、音量零和页面隐藏立即停掉实例；页面恢复仅在上下文仍运行且仍获本次启用时恢复。上下文 suspend/interrupted/closed 时清除启用状态，等待用户再次点击。没有轮询式 resume。
- Game destroy 撤销请求、RAF、可见性/上下文监听器及订阅。兼容 Phaser 比本控制器更早销毁声音实例的顺序。
- 音效钩子只附加反馈：不改变抽签存储顺序/延迟、小游戏完成条件、Golden Spin 状态推进或任何文案。

## 5. 修改清单与保护检查

新增：`src/audio-manager.js`、`src/audio-store.js`、`src/audio-ui.js`、`scripts/generate-audio.mjs`、`public/audio/` 十个声音与素材说明、三个 `test-audio*.mjs` 文件、本报告和 `logs/post-p7-audio/` 证据。

小范围修改：`src/main.js`（生命周期、菜单入口、完成反馈），`src/ui.js`（复用弹窗、开关/抽签反馈），`index.html`（声音入口），`src/style.css`（控制与窄屏排列），`.gitignore`（只逐个放行十个已检查 WAV）。

与基线比较无修改：player-controller、traveler-animation、target-highlight、npc-data、touch-controls、input-focus、world-store、portfolio-content、regions、Vite 配置、依赖清单与锁文件。175 px/s、12-pose 动画、碰撞、选取规则、欢迎文案/六章顺序、存档与 `/Johnny-Town/` 基础路径均保留。
生产目录检查仅含现有页面/纹理/脚本及上述已检查音频，无私人视频或音轨。其他目录的媒体仍被忽略；未扩大为通配音频许可。

## 6. 验证结果

本地生产预览：`http://127.0.0.1:4501/Johnny-Town/`；使用已有公共构建预览服务，未启动私人媒体开发服务。

| 检查 | 结果 | 证据 |
|---|---:|---|
| 音频单元/波形检查 | 12 / 12 | `unit-tests.txt`、`test-audio.mjs` |
| 相关已有单元：抽签/媒体降级、世界与旧存档、焦点、批准文案 | 24 / 24 | 同上，总计 36 / 36 |
| 音频浏览器功能组 | 12 / 12 | `browser-results.json`、`audio-tests.txt` |
| 追加生命周期、触摸与帧采样 | 7 / 7 | `lifecycle-results.json`、`lifecycle-tests.txt` |
| 已有欢迎信/replay/V1/V2/退出按钮回归 | 13 / 13 | `welcome/results.json` |
| 已有焦点与五种触屏布局回归 | 23 / 23 记录 | `focus/results.json`；含 18 功能组、5 布局记录 |
| 生产构建 | 通过 | `build.txt` |
| 最终差异空白检查 | 通过 | `git diff --check` |

合计 **36 个单元测试通过；55 条浏览器检查记录通过（其中 5 条为布局记录）**。没有用重复运行次数累加通过数。测试环境：Windows，Edge 156.0.4314.50 Chromium headless；不是实际手机/平板或 Safari。

针对性证据：

- 首访欢迎信自动打开但声音静默、无音频下载；明确操作后 WebAudio 分析器检测到非零输出，静音后输出为零。
- 实际键盘/触摸点击启用、方向键调整滑杆、手机模拟触摸拖动均通过；模态内按移动/E 不会穿透，关闭无按键残留。
- 连续 10 次开关阅读面板，每次至多一个开、一个关提示，结束只剩环境音。
- 通过真实 E 退出点连续 20 次切区，覆盖六区；每次稳定态一个环境循环、一个声音实例，E/M 各一个监听；重复回到 Town 子对象数 39、shutdown 监听数 20 保持一致；解码键最多 10。
- 抽签一次只播放一次抽签提示，重读不重抽；保存值保持；移动检查为 175。
- 刷新后世界/签文/欢迎状态及音量保留，但不自动播放；音频数据未写入世界存档。
- 404、拒绝 resume、不支持 WebAudio、禁用存储、真实 context suspend 与用户点击恢复、合成 visibilitychange、正常 scene shutdown 后整机销毁均通过。
- 同一 Woods 场景各 120 rAF 帧采样（舍弃前 5 帧）：开声/静音中位数均约 **16.7 ms**，P95 均约 **16.9 ms**。仅代表此本机浏览器采样，不等同真实低端设备性能承诺。

过程中修正：短水声内部接缝；浏览器断言等待完整淡入；Phaser 先销毁声音的清理顺序。失败后已针对性重验，未执行无关全世界/五课/29 对象审计。

## 7. 画面与可访问性检查

已查看实际截图，页眉声音入口、按钮、标签、滑杆与唯一返回按钮可见；小横屏正文可在既有滚动区阅读，没有固定浮层遮挡操作。触控入口至少 44 px，键盘焦点使用原生与既有样式，Reduced Motion 回归通过。

- `logs/post-p7-audio/desktop-audio-settings.png`
- `logs/post-p7-audio/phone-audio-settings.png`（375×667 模拟）
- `logs/post-p7-audio/landscape-audio-settings.png`（667×375 模拟）
- `logs/post-p7-audio/tablet-audio-settings.png`（820×1180 模拟）

## 8. 已知限制与未运行项目

1. 没有真实 iPhone/iPad、Mobile Safari、实体触屏/耳机/扬声器或 Chrome 本体检查；Edge 是 Chromium 证据，不能代替这些设备。页面隐藏使用合成 document.hidden 事件验证；真实系统来电/锁屏/音频路由中断未验。
2. 音色舒适度、自然声循环是否耐听、机械/共鸣音能否长期舒适聆听，尚未经过所有者主观试听。这是待验收项，不宣称已达到专业声音设计标准。
3. 开声偏好刷新后仍需点击启用；系统音频中断后可能也需再次启用。采用保守策略，避免不请自来的声音。
4. 未新增背景音乐或语音；没有为每个 NPC 选项、每次敲击或齿轮切换添加噪音。完成、开关与抽签反馈已接入。
5. 未运行无关 Gear Valley 美术、Golden Spin 全五课、29 对象可达性或完整六区审计；规则与数据均未改，使用已有证据加相关单元/20 次音频切区检查。
6. 整个 Phaser 主包仍有既有 >500 kB 提示。音频模块约增加几 KiB 压缩脚本，未增加依赖；本包不做无关分包改造。
7. 发现既有开发接口限制：若在控制台直接 `game.destroy(true)`，跳过/未等待场景 shutdown，随后触发 blur/pagehide，原 `touch-controls.js` 的窗口监听器可能访问已销毁的 player.body。堆栈定位为其 `clear`，此模块与基线逐字相同。未扩展修复；正常区域切换以及等待 scene shutdown 后的音频销毁验证通过。音频自身对 Phaser 提前销毁声音已作防护并有独立回归。

## 9. 所有者手动验收

1. 打开本地预览，确认欢迎信和静音游戏均正常；点页眉声音入口，启用，先用约 30–50% 音量。
2. 拖动音量、静音/再启用，确认低音量舒适且无突发声音；刷新应显示待启用并保留音量。
3. 依次访问 Town、Woods、Meadow、Lake、Valley、Ruins，听每条约 18–36 秒，重点评估重复感、鸟声密度、风/水高频、机械持续音与遗迹共鸣是否干扰阅读。
4. 开关自我介绍/日志，抽一次当日签；确认反馈轻柔、没有重复音，静音时所有内容仍能理解与使用。
5. 手机/平板真机验证滑杆、滚动、横竖屏，切后台/锁屏/恢复，再点启用；确认权限失败时仍能阅读和探索。
6. 用耳机与外放各试听一次。音色或音量平衡需调整时，仅在这个音频范围内另行反馈，不自动推进下一任务。

## 10. 本地提交与发布边界

实现提交：`d6fceb738de675cbade878526941abf6d5c42e37` — `feat(audio): add opt-in regional ambience and restrained UI feedback`。

本报告随后以单独文档提交记录上述实现 SHA；最终 HEAD 由交付消息给出，避免提交在自己的内容中引用尚未生成的哈希。

**没有 fetch、push、merge、部署、远程工作流触发或 GitHub Pages 设置修改。未开始 P7F 或下一个工作包。原有无关未跟踪文件保留。等待所有者验收。**
