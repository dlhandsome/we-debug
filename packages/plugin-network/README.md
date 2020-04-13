# we-debug network plugin

we-debug 网络相关插件

## 安装

这是一个 we-debug 内置插件，开发者无需额外安装

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'

// 通过 init 方法初始化路由信息收集插件
weDebug.init({
  plugin: {
    network: {
      // 配置项
    }
  }
})
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
networkCallee | 网络调用方法 | `Array` | `['request', 'downloadFile', 'uploadFile']` | - |

## 示例

```javascript
weDebug.init()
```
