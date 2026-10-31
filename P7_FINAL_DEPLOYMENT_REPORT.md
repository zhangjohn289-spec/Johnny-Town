# P7 Final Release — Production Handover

## A. Deployment Summary

**SUCCESS — 已发布，真实线上冒烟验证通过。**

- 公开地址：[Johnny Town](https://zhangjohn289-spec.github.io/Johnny-Town/)。
- Pages 部署成功时间：2026-10-31 15:52:50 UTC，即香港时间 **2026-10-31 23:52:50**。线上复核与交接于香港时间 2026-11-01 完成。
- 发布方式：原有 `.github/workflows/pages.yml`，手动触发一次，`ref=main`、`publish=true`。没有更改部署策略、域名、可见性、Pages 设置或默认 publish=false。
- [实际工作流 41216889802](https://github.com/zhangjohn289-spec/Johnny-Town/actions/runs/41216889802)：**completed / success**；build、deploy 均 success。
- Pages deployment ID：`7460824033`，对应下述生产 SHA，最新状态 success。

## B. Git Information

| 项目 | 精确引用 |
|---|---|
| 发布前 main / 旧生产 | `381f9a0917cf1aed7462d80380dd0a23e80c3fc4` |
| 已验收 RC | `bba81929571d92fe57afddcccc48aae7510b3c6e` |
| **实际部署的生产提交** | **`0dd02c4bd1174b8f4a6ca751f235f0f343075c7c`** |
| 候选分支 | `codex/p7f-release-candidate` |
| 生产分支 | `main` |
| 原 RC 标签 | `p7f-rc.1` → bba8192，保持不变 |
| 正式发布标签 | `p7-release-2026-10-31` → 0dd02c4，已正常推送 |

获取远端后确认没有新提交或分叉；旧 main 为候选祖先。比较 bba8192 与 0dd02c4，只有最终 P7F 审计报告不同，`prototype/` 和工作流无差异。选择 0dd02c4 可保留已验收应用和完整审计记录。

本地 main 普通 fast-forward 到 0dd02c4，再普通 push，服务端明确接受 `381f9a0..0dd02c4 main -> main`。没有 force push、重写历史、删除分支/标签或丢弃其他提交。原有无关未跟踪材料保留，未上传。

本报告及 README/部署说明的发布状态整理为**随后仅文档提交**，不改变应用或工作流、不再次触发部署。该文档 HEAD 在最终交付消息中列出；不得把它误称为本次 Actions 已部署的 SHA。正式标签固定实际部署提交，不随文档更新移动。

## C. Build and Publication

- 重新运行既有 Vite 生产构建，通过；沿用 `/Johnny-Town/` 基础路径。6 组 P7F 静态发布检查再次通过，未重复全套历史测试。
- 本地同一产物的 7 组冒烟检查通过。GitHub Actions 在干净环境执行原有 npm ci、测试和构建，再上传 Pages 产物并成功发布。
- 线上首页 HTTP 200，脚本引用为当前 `/Johnny-Town/assets/index-a_5HX04N.js`，简介元数据存在，实际欢迎信包含声音公告和确认门槛。
- 除首页独立版本核对外，线上 **14 个静态资源**与本地验收产物作内容比对，通过；二进制严格相同，文本只允许 CRLF/LF 行尾差异。资源包含 JS/CSS、纹理、favicon、七个 WAV、音频署名与完整框架许可。
- 产物不依赖 localhost，无私有视频、凭据、本地 Windows 路径或开发报告进入公开构建。游戏、文案、地图、七个音频和部署配置均未为此次发布修改。
- 原有大 JS 包警告仍在，不是构建失败。

### 有界传输问题记录

首次 git fetch 出现连接重置，以 HTTP/1.1 重试一次成功。第一次独立 Node HTTPS 预检超时后，命令仍继续执行了已授权的快进/普通推送；未在此时触发部署。随后用系统 HTTP 客户端确认 HTTPS 200、核实权限/域名/路径，并由仓库 API 检查 main 精确等于生产 SHA 后，才手动发布。

Pages API 的 html_url/environment_url 仍记录同域名 HTTP 地址；实际目标 HTTPS 已独立验证，未修改任何 Pages 配置或降级访问。

第一次线上自动检查在独立 API 下载客户端读取 `audio/lake.wav` 时超时（HTTP 200 已收到，未在 60 秒内收完）。未据此将站点判为损坏或重新部署。改用浏览器自身网络通道做一次有界复核，14 个资源与后续真实交互全部通过。没有无限重试、并发重推或重复触发工作流。

## D. Live Smoke Tests

环境：Windows Edge 156.0.4314.50，1440×1000 桌面和 375×667 **模拟触摸**，使用全新隔离上下文及一次性存档。没有清理或使用所有者真实浏览器保存数据。

| 真实线上检查 | 结果 |
|---|---|
| 首页/版本与静态资源完整性 | 通过 |
| 初访默认静音；声音公告；Escape 不绕过；勾选本身不保存，点击后确认 | 通过 |
| 175 px/s 移动、像素箭头、小屋 E 互动、六章入口及项目章节 | 通过 |
| 明确手动启用声音、音量修改与保存 | 通过 |
| 访问全部六区并返回 Town，三有声区各一个循环，三静音区无循环/无错误警告 | 通过 |
| 实际每日签，刷新保留世界/签文/确认/音量，欢迎信不重复，声音不自动重启 | 通过 |
| 窄屏触摸确认、介绍、声音设置与无明显横向溢出 | 通过 |

**最终线上 7/7 组通过，页面异常 0，本地资源 HTTP 错误 0。**本地也执行相同 7 类检查，不将两套相同覆盖夸大为 14 类独立功能。

区域路径：Town → Woods → Town → Meadow → Lake → Meadow → Valley → Meadow → Ruins → Meadow → Town。测试安排长距离位置使用安全坐标重置，再通过实际 E 出口切换；不是宣称逐米手动走遍地图。三处音轨均在浏览器实际加载/解码并播放，循环计数正确；未进行真人扬声器听音。

证据（本地保留，不属于 Pages 产物）：

- `logs/p7-release/build.txt`、`static-check.txt`、`git-release.json`
- `preflight-api.json`、`dispatch.json`、`workflow-status.json`、`deployment.json`
- `live-version.json`、`live-smoke.json`、`live-smoke.txt`、`local-smoke.json`
- `live-town.png`、`live-phone.png`、`final-remote.txt`

## E. Known Limitations

- 真实 iPhone/iPad、Safari、实体触屏、现场耳机/外放未在本次验证；模拟不能替代真机验收。
- 本次不重跑五课全流程、所有 NPC 分支、29 对象多方向审计或整个 P7F 套件。生产应用与已验收候选相同，P7F 的 102 单元/43 浏览器/6 静态组是历史依据；本次另有实际线上冒烟证据。
- 浏览器系统中断或刷新后可能需要重新点击启用声音，这是保留的安全默认行为。网络慢时音频可降级，文字与探索仍能使用。
- 既有开发者直接销毁整个 Phaser game、跳过场景 shutdown 后再 blur 的触控清理问题仍仅作为 P3 记录；普通线上路线未复现。既有控制台诊断入口未重构。
- 宝箱仍为明确点击的 Bilibili 站外链接；没有在本轮验证该平台真实视频播放、登录或地区限制，也没有将其媒体打包。

没有发现需要阻断或回滚的线上 P0/P1 问题。

## F. Rollback

旧生产参考：`381f9a0917cf1aed7462d80380dd0a23e80c3fc4`；原 Pages/Actions 发布策略不变。本次没有执行回滚。

若后续出现关键故障：先记录影响与当前远端 SHA，优先做最小可验证修复；需要回退时，在独立恢复分支准备普通 revert 提交，恢复旧生产应用状态并保留所有发布历史，检查是否有新远端工作需要保留，重新构建/冒烟，再通过原工作流发布该恢复提交。**不 reset 远端、不 force push、不移动已有发布标签。**存在冲突或回滚范围不明确时停止并交给所有者决定。

旧版本可能不理解 P7 新字段；回退前应导出/备份展示或测试存档，不能保证旧代码加载并再次保存后仍保留所有 P7 进度。优先修复可避免这种兼容风险。

## G. Showcase Notes — November 5

1. 地址：https://zhangjohn289-spec.github.io/Johnny-Town/ 。优先使用本轮验证过的桌面 Edge；实际展示设备应提前试用。
2. 用独立浏览器配置或新 InPrivate/无痕会话演示首访；关闭所有该会话的无痕窗口后再打开，可重新示范。不要清理常规窗口的个人日常存档。
3. 推荐 2–4 分钟：阅读并确认欢迎信 → 自我介绍「关于我/兴趣/项目」→ 小镇 NPC 或每日签 → 北侧记忆森林一个故事 → 返回 Town。不要用全地图跑图取代个人介绍。
4. 页眉声音入口 →「启用声音」，先用较低音量；森林、湖泊、机械谷各有环境音。被自动播放策略阻止时再次明确点击；无扬声器时保持静音，全部核心内容仍可展示。
5. 网络不稳时使用提前保存的同版 `prototype/dist` 和已验证的本地生产预览；提前打开页面。没有新增离线应用、追踪或外部服务。

发布和交接到此结束。未开始 P8、添加新内容或进行额外功能开发。
