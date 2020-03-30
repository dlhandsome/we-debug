# we-debug vConsole plugin

## 安装

```bash
npm install @we-debug/plugin-vconsole --save-dev
```

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'
import RouterPlugin from '@we-debug/plugin-vconsole'

weDebug.use(RouterPlugin, { someOption })
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
rule | 拷贝路径表单规则配置 | `Rule` | - | - |

## 参考

- [Rule](https://dlhandsome.github.io/we-debug/#/api?id=wedebugcreateformruleparam)

