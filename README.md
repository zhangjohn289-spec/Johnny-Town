# Johnny Town 第一阶段原型

当前可运行版本在 prototype/，采用 Phaser 3.90.0 + Vite 6.4.5。johnny-town/ 是保留的 AE 初始化目录，不是当前应用。

PowerShell：
```powershell
cd prototype
& 'C:\Program Files\nodejs\npm.cmd' ci
& 'C:\Program Files\nodejs\npm.cmd' run dev
& 'C:\Program Files\nodejs\npm.cmd' run build
& 'C:\Program Files\nodejs\npm.cmd' run preview
```
若 Node 不在 PATH，将 C:\Program Files\nodejs 加到当前会话 PATH 首位。

WASD/方向键移动，靠近地点按 E，Esc 或按钮关闭面板。仅桌面原型，神社与宝箱为占位面板。没有实现抽签、视频、音乐和手机控制。

src/config.js 保存地图地点参数，src/main.js 为地图与角色场景，src/ui.js 管理原生 dialog。使用 Arcade Physics 碰撞和归一化速度。所有美术由几何图形绘制，无外部美术资源。

## GitHub Pages
仓库根目录已准备手动触发的 .github/workflows/pages.yml。上传仓库后在 Settings → Pages 选择 GitHub Actions，再手动运行工作流。构建上传 prototype/dist，Vite base 为 ./，支持仓库子路径。尚未实际发布或验证公开 URL。

检查日志见 logs/environment-and-tests.md。浏览器自动检查脚本 prototype/test-browser.mjs 使用本机捆绑 Playwright 和 Edge，属于本环境验收脚本，其他机器需调整依赖路径。已有需求与 AE 目录均保留。
