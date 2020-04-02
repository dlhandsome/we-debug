# we-debug launcher plugin

we-debug 启动器插件

## 安装

这是一个 we-debug 内置插件，开发者无需额外安装

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'

// 通过 init 方法初始化启动器
weDebug.init({
  launcher : { 
    // 启动器配置
  }
})
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
