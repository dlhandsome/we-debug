# we-debug api plugin

we-debug wx API 抓包插件，在调试面板中提供与 `Network` 面板风格一致的 `API` 面板

## 功能

- 自动劫持 `wx` 上的 API 并记录调用，包含异步（success/fail 回调或 Promise）与同步（`*Sync`）API
- 不记录 `on*` / `off*` / `create*` 类 API、`wx.request` / `wx.downloadFile` / `wx.uploadFile`（见 Network 面板）以及 we-debug 自身通过 `weDebug.silent(fn)` 发起的调用
- 调用列表：Name、Status、Type、Time，失败调用标红，底部汇总调用数、失败数与耗时
- 工具栏：开始/暂停录制、清空、API 名称过滤、Preserve log（切换页面时保留日志）
- 类型筛选：All / Async / Sync / Failed
- 调用详情：Overview（状态、所在页面、耗时、调用栈）、Params、Result（JSON 树）
- 支持复制调用代码、参数与结果

## 安装

`@we-debug/core` 已内置该插件，通过 init 方法初始化即可

```javascript
import weDebug from '@we-debug/core/libs/index'

weDebug.init({
  plugin: {
    api: {
      // ...
    }
  }
})
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
maxRecords | 最多保留的调用记录条数，超出后丢弃最早的记录 | `Number` | `500` | - |
include | 只劫持指定的 API，设置后忽略默认劫持范围 | `Array<String>` | - | - |
exclude | 额外不劫持的 API | `Array<String>` | `[]` | - |

## 示例

```javascript
weDebug.init({
  plugin: {
    api: {
      exclude: ['getStorageSync', 'setStorageSync']
    }
  }
})
```
