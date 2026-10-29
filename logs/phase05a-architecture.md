# Phase 05A 架构记录

## 选择

采用一个 WorldScene，区域切换时 scene.restart()；用数据和小型渲染器区分区域，而不是为每张地图复制 Scene、玩家和弹窗控制。原场景规模较小，无需 ECS、路由库、插件系统或额外依赖。Phaser 管理的物理体、显示对象、补间及摄像机在 shutdown 时释放，纹理和全局动画缓存复用。

## 模块契约

regions.js 定义 id、name、renderer、width/height、bounds、trees、places、collisions、spawns、defaultSpawn、exits。矩形统一用左上角 x/y 和 w/h；交互点 door 与矩形分离。future regionList 仅用于列表，不创建入口或加载未来素材。

main.js 负责 WorldScene 生命周期和转场；player-controller.js 共用角色创建、输入锁、方向归一化与 175px/s 固定速度，交由 Arcade 自行积分，不重复乘 delta。visuals.js 保留原小镇美术与动画；region-renderer.js 绘制测试草甸和路标。

建筑与树木碰撞保持 Phase 04 原矩形。草甸使用相同树干形状，围栏由同一碰撞数据生成。每次 create 仅一个静态组、一个玩家刚体和一个 collider。bounds 与摄像机尺寸分离，角色脚部为 x±8 / y..y+16 的 16px 正方形。

## 切换顺序与资源所有权

1. 非重复 E 且有目标时清空按键、停止速度/动画并锁定输入。
2. 140ms 淡出（减少动态效果则直接执行）。
3. worldStore.visit 校验目的区域与安全出生点并保存；随后重启场景。
4. 新场景读取存档内存快照、渲染、建碰撞、创建玩家、设置摄像机和清空按键。
5. 140ms 淡入；在安全路口恢复探索。入口必须再次按 E，且出生点距返回入口至少 75px。

场景自己的 E/M 和 DOM 路书按钮监听器在 shutdown 显式解绑；matchMedia 的 change 监听也解绑。Loader 错误监听同样清理。原生 dialog 的关闭监听属于页面单例，地图不会复制 UI。转场与弹窗互斥；视频返回时 pause/remove src/load/remove，避免后台播放。动画仅在不存在对应 key 时创建。

## 摄像机与像素

逻辑视口仍 960×640，FIT 保持 3:2。camera.setBounds(0,0,width,height)，startFollow(player,true,0.12,0.12)，首次 centerOn；Phaser 的像素舍入与 CSS pixelated 保留。小镇与视口相等，因此零滚动；草甸边缘夹紧 0..64 / 0..128。视口缩放不改变速度或物理坐标。

## 存档契约

键 johnny-town.world.v1：

```json
{"version":1,"regionId":"meadow","spawnId":"fromTown","discovered":["town","meadow"],"progress":{"transitions":1}}
```

存储安全出生点标识，不保存任意精确坐标。safeSpawn 校验脚部 AABB、有限坐标、世界边界和全部碰撞体。无效出生点使用区域默认点；坏 schema / 不支持版本 / 未知区域则回到 town/start。发现列表去重并过滤未知 ID，探索计数要求非负安全整数。未来 schema 升级需显式增加迁移，不猜测旧格式。

Phase 04 没有世界存档，首次进入产生默认记录；fortune 键从不被世界模块读取、删除或覆写。JSON 解析和存储权限错误被捕获；页面内存继续运行。仅启动和跨区时保存，不做每帧写盘，也不保存墙内坐标。刷新返回入口是刻意的产品行为。

## 本地媒体边界

LOCAL_VIDEO_FILE 是服务器变量，不能使用 VITE_ 前缀。配置按 command 区分：build 永远定义开关 false；serve 才加载本地文件检查与 Range 流中间件。中间件只匹配固定 URL，不接受用户任意文件路径；仅 GET/HEAD，错误范围 416，连接关闭销毁文件流。客户端得到相对接口 URL，不得到绝对路径。构建产物扫描确认没有该 URL、路径、变量名或媒体文件。

保持开发 host=127.0.0.1；不把此本地媒体服务作为公开后端。公开来源依旧未启用，避免将本地可播放误当作可分发。

## 扩展方法

新增区域时登记区域数据和渲染分支，为每个出口登记另一端安全出生点；复用 WorldScene、player-controller、UI 和存档。新资源可按目的区域预加载，但本阶段只有共享的小型纹理集，未引入提前加载未来大地图的机制。未来新增世界存档字段需同时更新 normalizeWorld 与迁移测试。
