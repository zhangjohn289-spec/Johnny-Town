# Johnny Town

Johnny Town 是以可探索的像素世界呈现的个人介绍网站，基于 Phaser 3.90.0、Vite 6.4.5 和 JavaScript。核心入口是六章自我介绍；六区域自由探索、NPC、故事、每日签、五课回旋和两项小体验是可选内容。

**P7 正式版已发布**：[打开 Johnny Town](https://zhangjohn289-spec.github.io/Johnny-Town/)。2026-10-31 部署的生产提交为 `0dd02c4bd1174b8f4a6ca751f235f0f343075c7c`，标签 `p7-release-2026-10-31`。已整合 P7A–P7E 及全部已验收维护；本次交接文档提交与应用部署提交分开记录。详见 [最终发布报告](P7_FINAL_DEPLOYMENT_REPORT.md) 和 [P7F 审计](P7F_FINAL_AUDIT_AND_RELEASE_CANDIDATE_REPORT.md)。

## 本地生产预览

在仓库根目录执行（Windows 的执行策略限制可用 npm.cmd）：

```powershell
npm.cmd --prefix prototype ci
npm.cmd --prefix prototype run build
npm.cmd --prefix prototype run preview -- --port 4501 --strictPort
```

访问 http://127.0.0.1:4501/Johnny-Town/ 。其他系统使用 npm 即可。最终公开产物是 prototype/dist；不需要 Node 服务端或后端数据库。

## 操作与阅读

- 电脑：WASD / 方向键移动，E 互动，I 自我介绍，M 探索日志。
- 手机/平板：左侧虚拟摇杆移动，右侧按钮互动；页眉可打开介绍、日志、声音。
- 首次阅读欢迎信后，勾选确认并点击「开始自由探索」。提前查看介绍会返回欢迎信；已确认访客可在介绍底部重读。
- 普通面板使用「返回探索」或 Esc；未确认的欢迎信不能用 Esc 绕过。
- 声音默认关闭，页眉声音入口打开「小镇声音」设置。仅记忆森林、旋律湖、机械谷有环境音；其他区域有意静音。刷新/系统中断后可能需要再次点击启用。

## 区域、存储与素材

Town 北侧到 Woods，东侧到 Meadow；草甸连接 Lake、Valley、Ruins。全部区域可返回。刷新恢复区域的安全入口及进度，不承诺精确恢复角色最后坐标。

世界存档保留 V1→V2 迁移，签文、欢迎 seen、独立阅读确认和音频偏好各用独立键；禁用存储时支持会话探索，刷新后无法保证保留。测试使用独立临时浏览器，不清理用户真实存档。

原作者六章文案位于 prototype/src/portfolio-content.json。地图/交互注册、叙事和持久化均保留现有独立模块。原创美术来源见 prototype/src/assets/SOURCES.md；音频来源见 [音频素材说明](prototype/AUDIO_ASSETS.md)，公开署名见 prototype/public/audio/CREDITS.txt。

## 验证与发布边界

P7F 测试命令、结果、已知限制、展示路线见最终报告。测试中的手机/平板模拟不代表实体 iPhone/iPad 或 Safari 验证。

GitHub Pages base 为 /Johnny-Town/。现有 Actions 仅手动触发，publish 默认 false；需要所有者额外明确批准后才可推送/整合 main，并手动使用 publish=true 发布。详见 [部署说明](DEPLOYMENT.md)。

## 私人媒体隔离

不要把本地视频、音轨、凭据或个人配置放进 src/public/dist。现有宝箱只在明确点击后打开站外 Bilibili 链接，游戏不内嵌或自动播放外部视频。生产构建没有本地视频接口；开发用 LOCAL_VIDEO_FILE（如有）必须保持在被忽略的本地配置中，不能设为 VITE_ 公开变量。

历史阶段报告与截图保留，用于追溯，不代表当前功能清单。
