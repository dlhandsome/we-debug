## API

#### weDebug.use(plugin)

- **参数：**
  - `{Object | Function} plugin`

- **返回值：**
  - `{Object} weDebug`

- **用法：**

安装 we-debug 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 weDebug 作为参数传入。

该方法需要在调用 weDebug.init() 之前被调用。

当 install 方法被同一个插件多次调用，插件将只会被安装一次。

#### weDebug.init(params)

- **参数：**
  - `{Object} params`

- **返回值：**
  - `{Object} weDebug`

- **详细：**

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| plugins.error | 是否使用异常调试插件 | boolean | true |
| plugins.route | 是否使用路由调试插件 | boolean | true |


#### weDebug.createCache(name)

- **参数：**
  - `{String} name`

- **返回值：**
  - `{Object} Cache`

- **用法：**

用于创建缓存数据。

#### weDebug.event

- **类型：**`EventManage`

- **用法：**

事件管理器。调试工具在使用过程中可能会依赖部分事件。通过 `event` 属性，我们可以在插件、业务代码中发布或订阅事件：

```javascript
// 发布事件
Page({
  btnTap () {
    // 点击按钮唤出调试面板
    weDebug.event.emit('debug:mask:show-modal')
  }
})
```

#### weDebug.util

- **类型：**`Object`

- **用法：**

辅助函数，可用于插件开发。
  
```javascript
// 用于判断变量是否为指定类型
weDebug.util.isStr(v)
weDebug.util.isFunc(v)
weDebug.util.isArr(v)
weDebug.util.isUndefined(v)
weDebug.util.isObject(v)
weDebug.util.isObj(v)
// 空函数
weDebug.util.noop()
```

#### weDebug.createBadge(param)

- **参数：**
  - `{Object} param`

- **返回值：**
  - `{Object} weDebug`

- **用法：**

用于创建徽章实例。

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| position | 页面位置 | object | - |
| draggable | 是否可拖拽 | boolean | `false` |
| key | 名称 | string \| number | - |
| value | 值 | string \| number | - |
| color | 徽章颜色 | string | `brightgreen` |
| show | 是否展示 | boolean | `false` |

- **示例：**

``` javascript
// 组件创建
const envBadge = weDebug.createBadge({
  position: { top: 0, left: 0 },
  draggable: true // 可拖拽
  key: 'env',
  value: 'idc',
  show: true
})
// 添加到视图
weDebug.addBadge(envBadge)
```

#### weDebug.getBadge(id)

- **参数：**
  - `{number | undefined} id`

- **返回值：**
  - `{Array<Badge> | Badge}`

- **用法：**

用于获取视图中的徽章实例。当参数传入空时，返回所有的徽章实例；当参数传入某个徽章的 id 时，则返回该徽章的实例。


#### weDebug.addBadge(param)

- **参数：**
  - `{Array<Badge> | Badge} param`

- **返回值：**
  - `{weDebug}`

- **用法：**

添加徽章实例至视图。可传入一个或多个徽章实例。

#### weDebug.removeBadge(param)

- **参数：**
  - `{Array<Badge> | Badge} param`

- **返回值：**
  - `{weDebug}`

- **用法：**

将徽章实例从视图中移除。可传入一个或多个徽章实例。

#### weDebug.createFormRule(param)

- **参数：**
  - `{Object} param`

- **返回值：**
  - `{Object} weDebug`

- **用法：**

用于创建调试规则表单实例。

| 参数 | 说明 | 类型 | 默认值 |
| -- | -- | -- | -- |
| title | 功能名称 | string | - |
| desc | 功能描述 | string | - |
| meta | 元信息 | string \| number | - |
| type | 表单类型 | string | `switch` |
| state | 表单状态 | object | - |
| handler | 表单事件句柄 | function | - |

- **示例：**

``` javascript
// 创建规则
// 复制当前页面路由到剪贴板
const routeRule = new FormRule({
  title: '页面路由',
    desc: '复制当前页面路由到剪贴板',
    type: 'button',
    handler: {
      bindTap(state) {
        const pages = getCurrentPages(),
          route = pages[pages.length - 1].route
  
        wx.setClipboardData({
          data: JSON.stringify(route),
        })
      }
    }
})
// 添加到视图
weDebug.addFormRule(routeRule)
```

#### weDebug.getFormRule(id)

- **参数：**
  - `{number | undefined} id`

- **返回值：**
  - `{Array<Badge> | Badge}`

- **用法：**

用于获取视图中的调试规则实例。当参数传入空时，返回所有的调试规则实例；当参数传入某个徽章的 id 时，则返回该调试规则的实例。

#### weDebug.addFormRule(param)

- **参数：**
  - `{Array<FormRule> | FormRule} param`

- **返回值：**
  - `{weDebug}`

- **用法：**

添加调试规则实例至视图。可传入一个或多个调试规则实例。

#### weDebug.removeFormRule(param)

- **参数：**
  - `{Array<FormRule> | FormRule} param`

- **返回值：**
  - `{weDebug}`

- **用法：**

将调试规则实例实例从视图中移除。可传入一个或多个调试规则实例实例。
