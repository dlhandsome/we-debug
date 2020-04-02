# we-debug launcher plugin

## 安装

```bash
npm install @we-debug/plugin-launcher --save-dev
```

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'
import LauncherPlugin from '@we-debug/plugin-launcher'

weDebug.use(LauncherPlugin, { someOption })
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
show	 | 是否展示 | boolean | `true` | - |
draggable | 是否可拖拽 | boolean | `true` | - |
key | 名称 | string \| number | `debug` | - |
value | 值 | string \| number | `调试胶囊` | - |
color | 启动器颜色 | string | `brightgreen` | - |
position | 位置信息 | object | `{ right: 10, bottom: 20 }` | - |
