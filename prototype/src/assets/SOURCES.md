# 原创像素资源清单

所有 PNG 由 ../scripts/generate-art.mjs 的确定性绘制生成；没有下载第三方美术、字体或游戏贴图，没有外部图片 URL。
- ground.png：960×640 草地、花草、16×16 石板道路与围栏。
- home.png：212×200 木梁住宅、窗台花箱、瓦片与台阶。
- shrine.png：192×200 神社、鸟居、灯笼和赛钱箱。
- chest.png / chest-open.png：80×64 黄铜包边木箱的关闭和打开状态。
- tree.png：80×104 分层树冠与树干。
- player.png：128×192 图集，32×48 单帧，4 行方向×4 帧。

Vite imports 将它们打包为本地静态资产，小文件可能内联为 data URL。素材约 56 KB。
生成器使用 pngjs 编码 PNG，当前优先使用本机 Codex 捆绑包路径；其他开发机需将 require 路径改为已安装的 pngjs。生产应用不加载生成器，无 pngjs 运行依赖。
图像和可编辑绘制源码随项目 Git 提交保存。规格见仓库根目录 ART-SPEC.md。

Phase 04 使用 scripts/polish-art.mjs 生成精修版，新增 tree-b.png（80×104）。保留尺寸、透明度和统一像素密度，最终使用限色 PNG 存储。无第三方美术。
