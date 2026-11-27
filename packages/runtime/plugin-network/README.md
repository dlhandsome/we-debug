# we-debug network plugin

we-debug 网络抓包插件，在调试面板中提供 Chrome DevTools 风格的 `Network` 面板

## 功能

- 自动记录 `wx.request` / `wx.downloadFile` / `wx.uploadFile` 请求
- 请求列表：Name、Status、Method、Size、Time，失败或 4xx/5xx 请求标红，底部汇总请求数、传输大小与耗时
- 工具栏：开始/暂停录制、清空、URL 关键字过滤、Preserve log（切换页面时保留日志）
- 类型筛选：All / Fetch/XHR / Download / Upload
- 请求详情：Headers、Payload、Preview（JSON 树）、Response、Timing（有 `profile` 时展示各阶段耗时）
- 支持复制 URL、复制为 cURL、复制请求体与响应体
- 「系统」分组下的「调试抓包」按钮可一键复制当前所有请求记录

## 安装

这是一个 we-debug 内置插件，开发者无需额外安装

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'

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
maxRecords | 最多保留的请求记录条数，超出后丢弃最早的记录 | `Number` | `300` | - |

## 示例

```javascript
weDebug.init({
  plugin: {
    network: {
      maxRecords: 500
    }
  }
})
```
