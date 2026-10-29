# main 上传前检查

确认 Phase 04 提交 fdd4b86 存在且为 main 的祖先。原 feature/phase03-visual-overhaul、feature/phase04-polish-release 和 master 分支保留；没有改写或删除旧提交。远端初始 ls-remote 与 fetch 未返回任何分支，因此从 fdd4b86 新建 main，无需覆盖远端历史。
origin：https://github.com/zhangjohn289-spec/Johnny-Town.git
本次只授权代码上传，未授权 Pages 公开部署。

.gitignore 补充本地状态、依赖、dist/build、缓存、环境变量、密钥/证书、账户凭据及未经授权的音视频扩展名。tracked ignored 文件检查为空，扫描全部本地提交未发现常见 token/私钥/AWS Key 模式或音视频/密钥文件。此为有限扫描，不是全面安全审计。开发诊断中仅有环境路径与性能日志，未找到账户令牌。AE 本地目录始终忽略，不上传。

Vite base 从 ./ 明确为 /Johnny-Town/；静态测试校验精确仓库路径及 JS/CSS 文件存在。6 项核心测试、生产构建通过；现有 Phaser 大包提示保留。
.github/workflows/pages.yml 保持不变，仅 workflow_dispatch，publish 默认 false。没有 push 触发器；上传不会自动构建或发布，未调用 workflow dispatch。

推送及 Actions 的最终状态以本次交付回复为准；该文件为推送前审查记录。
