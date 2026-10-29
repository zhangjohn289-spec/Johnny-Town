# GitHub Pages 发布说明

本项目尚未公开部署，无公网 URL。origin 已配置为 https://github.com/zhangjohn289-spec/Johnny-Town.git；本次只授权上传代码。依任务第 12.2 节，必须先取得用户对目标仓库及公开发布的明确批准，不更改仓库可见性。

## 已准备
- Vite base=/Johnny-Town/（仓库名大小写一致），纯静态 dist，没有后端或运行时构建依赖。
- Pages 工作流仅 workflow_dispatch。默认 publish=false，只执行 npm ci、核心测试、build 并上传产物。publish=true 才运行依赖 build 的 deploy job。
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
