# we-debug router plugin

we-debug 路由信息收集插件

## 安装

这是一个 we-debug 内置插件，开发者无需额外安装

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'

// 通过 init 方法初始化路由信息收集插件
weDebug.init({
  plugin: {
    router: {
      // 配置项
    }
  }
})
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
pathRule | 拷贝路径表单规则配置 | `Rule` | - | - |
queryRule | 拷贝路由参数表单规则配置 | `Rule` | - | - |

## 示例

```javascript
weDebug.init({
  plugin: {
    router: {
      pathRule: {
        // 设置拷贝异常信息规则标题
        title: '获取页面路径',
        desc: '点击右侧按钮复制页面路径到剪贴板'
      },
      queryRule: {
        // ...
      }
    }
  }
})
```

## 参考

- [Rule](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreateformruleparam)

