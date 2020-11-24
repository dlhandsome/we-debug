# we-debug error plugin

we-debug 异常信息收集插件

## 安装

这是一个 we-debug 内置插件，开发者无需额外安装

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'

// 通过 init 方法初始化异常信息收集插件
weDebug.init({
  plugin: {
    error: {
      // 配置项
    }
  }
})
```

## 配置项

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
badge | 徽章配置 | `Badge` | - | - |
copyRule | 拷贝错误信息表单规则配置 | `Rule` | - | - |
clearRule | 清空错误信息表单规则配置 | `Rule` | - | - |

## 示例

```javascript
weDebug.init({
  plugin: {
    error: {
      badge: {
        // 设置错误徽章的位置
        position: {
          right: 0,
          top: 100
        }
      },
      copyRule: {
        // 设置拷贝异常信息规则标题
        title: '获取异常信息',
        desc: '点击右侧按钮复制异常信息到剪贴板'
      },
      clearRule: {
        // ...
      }
    }
  }
})
```

## 参考

- [Badge](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreatebadgeparam)
- [Rule](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreateformruleparam)

