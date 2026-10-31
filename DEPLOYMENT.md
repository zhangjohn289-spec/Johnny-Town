# GitHub Pages 发布说明

用户报告 Phase 04 已公开上线；本次 Phase 05A 未重新进行公网验收。origin 保持 https://github.com/zhangjohn289-spec/Johnny-Town.git。Phase 05A 只允许本地开发和提交，不允许 push、merge 到 main 或部署。不得修改仓库可见性。

## 已准备
- Vite base=/Johnny-Town/（仓库名大小写一致），纯静态 dist，没有后端或运行时构建依赖。
- Pages 工作流仅 workflow_dispatch。默认 publish=false，只执行 npm ci、核心与世界存档测试、build 并上传产物。publish=true 才运行依赖 build 的 deploy job。
- 部署 job 使用 github-pages environment，pages:write / id-token:write 仅在该 job。
- 不会因 push 自动发布。建议仓库所有者为 github-pages 环境配置 required reviewers。
- AE 目录、node_modules、dist 被忽略，不上传引擎账户配置。已检查跟踪路径与常见凭据特征，未发现凭据文件；未声称这是全面安全审计。

## 获批后操作
1. 用户指定已有 GitHub 仓库 URL 及可见性；若要创建仓库，须明确同意其公开/私有选择。不要自动修改可见性。
2. 将已验证分支推送到该仓库并按其流程合并；Actions 的手动工作流通常需先存在于默认分支。
3. Settings → Pages → Source 选择 GitHub Actions；配置 github-pages 环境保护。
4. 首次手动运行时保留 publish=false 检查 CI。确认构建成功后，在已获公开部署批准的前提下勾选 publish=true。
5. 以实际 workflow 输出 page_url 验收，不能编造用户名或仓库 URL。复查加载、移动、建筑交互、抽签保存、刷新、媒体状态和 Console。

本地模拟 Pages 子路径的服务器：从项目根目录运行 node prototype/serve-pages-check.mjs，访问 http://127.0.0.1:4183/Johnny-Town/ 。它是本地验收工具，不是生产服务器。

官方工作流参考：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Phase 05A 本地媒体隔离
LOCAL_VIDEO_FILE 只能放在被忽略的 prototype/.env.local；不要放在公开变量 VITE_* 中。Vite build 不启用本地视频插件，不复制原文件。发布前运行 node prototype/test-static.mjs，检查 dist 无 MP4/私有路径，再审查暂存文件。当前公开播放器保留来源未确认提示，不能将本地测试通过视为分发许可。

本次仅更新 build job 的单元测试列表；workflow_dispatch、publish=false 默认值和 deploy 条件保持原样，未运行远端工作流。

## Phase 05B

本地分支 feature/phase05b-memory-woods 只用于开发、验收和本地提交。build job 增加 test-woods.mjs，发布门禁保持原样。未授权本阶段 push、merge 或部署。

世界存档同一键内由 version 1 升为2，迁移保留旧区域进度，新增故事发现记录；运势键不变。若未来需要回滚至05A，应先备份新版世界进度，05A不理解version=2，不能承诺旧代码读取新版故事。

## P7F 发布候选（当前）

P7F 仅在 codex/p7f-release-candidate 做本地准备；没有获得公开发布权限。当前 main 仍为旧版 Phase06F。最新候选、完整祖先链、测试及确切 SHA 见 P7F_FINAL_AUDIT_AND_RELEASE_CANDIDATE_REPORT.md；不要将历史阶段条目当作当前功能/媒体状态。

将来取得明确授权后：先重新检查远端分支是否变化，确认无分叉/未提交更改，再正常推送并将已验收候选整合到 main（禁止 force push）；保留现有手动 workflow_dispatch 和 publish=false 默认值，先做仅构建检查，单独获得发布授权后才能运行 publish=true。等待 deploy 成功后，以实际 page_url 在线验收首次确认、介绍、区域、声音与存档。P7F 本身不执行任何上述远端写入，也不改变 Pages Source、域名或仓库可见性。
