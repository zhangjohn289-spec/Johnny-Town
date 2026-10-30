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

## Phase 05B · Memory Woods

woods-data.js / woods-renderer.js 定义原创森林地图和像素绘制：蜿蜒小径、树林、针叶树、晨光石碑、旅行路牌、回响古树、齿轮工坊、留白路标及休憩树桩。复用本目录的原创 tree / tree-b 纹理，配合程序绘制的像素细节。森林地面与五处地标首次进入时缓存为 Phaser 纹理，不依赖外部图片、字体、音频或授权游戏素材。

叙事文案在 story-content.js，均为本项目原创象征性文本。没有使用或发布私人 MP4，也没有将外部游戏贴图嵌入地图。

## Phase 05C

草甸、旋律湖与机械谷使用expansion-data.js中的确定性布局和landscape-renderer.js原创像素绘制；复用既有原创树纹理。地面在本机Phaser中生成并缓存，不下载外部素材。新增故事为原创中文短篇，没有使用版权音乐或外部游戏素材。私人MP4不进入生产构建。

Phase 05D：遗迹地面、石柱、符文、书桌、模型和石门均由ruins-renderer.js原创绘制；未复制外部游戏贴图或加入外部媒体。彩蛋文字采用本阶段任务书指定文本。
