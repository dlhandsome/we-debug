# we-debug error plugin

## 安装

```bash
npm install @we-debug/plugin-error --save-dev
```

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'
import ErrorPlugin from '@we-debug/plugin-error'

weDebug.use(ErrorPlugin, { someOption })
```

## 配置项

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
badge | 徽章配置 | `Badge` | - | - |
copyRule | 拷贝错误信息表单规则配置 | `Rule` | - | - |
clearRule | 清空错误信息表单规则配置 | `Rule` | - | - |

## 参考

- [Badge](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreatebadgeparam)
- [Rule](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreateformruleparam)

