# we-debug navigate plugin

## 安装

```bash
npm install @we-debug/plugin-navigate --save-dev
```

## 使用

```javascript
import weDebug from '@we-debug/core/libs/index'
import NavigatePlugin from '@we-debug/plugin-navigate'

weDebug.use(NavigatePlugin, [
  {
    title: 'A页面跳转',
    name: '前往',
    desc: '点击右侧按钮前往A页面',
    url: '/pages/mypage/a/index?foo=bar'
  },
  {
    title: 'B页面跳转',
    name: '前往',
    desc: '点击右侧按钮前往B页面',
    url: '/pages/mypage/b/index?foo=bar'
  }
])
```

## 配置

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
title | 菜单标题 | `String` | - | - |
name | 按钮文案 | `String` | `前往` | - |
desc | 菜单描述 | `String` | - | - |
url | 跳转的链接地址 | `String` | - | - |

