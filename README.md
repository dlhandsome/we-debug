<div align="center">
<h1>we-debug</h1>

[![travis-ci](https://travis-ci.org/dlhandsome/we-debug.svg?branch=master)](https://www.travis-ci.org/dlhandsome/we-debug) [![npm-version](https://img.shields.io/npm/v/@we-debug/core.svg)](https://www.npmjs.com/package/@we-debug/core)

<p>一款灵活小巧的小程序调试工具 <a href="https://unpkg.com/we-cropper@1.2.0/docs/assets/online.jpg">在线体验</a></p>

<img src=https://user-images.githubusercontent.com/16918885/77829191-6e9d8100-715b-11ea-8776-dbe26431622a.gif width=150 />
</div>

## Install

- 通过 npm 安装（推荐）

```bash
npm install @we-debug/core --save
```

- 下载代码

克隆项目至本地，并将`dist`目录拷贝到自己的项目中

```bash
https://github.com/dlhandsome/we-debug.git
```

## Usage

1. 在 json 配置中添加 we-debug 组件声明

```json
{
  "usingComponents": {
    "we-debug": "@we-debug/core/index/index"
  }
}
```

2. 在页面 wxml 中创建 we-debug 组件

```html
<we-debug></we-debug>
```

3. 在 app.js 中初始化 we-debug

```javascript
const weDebug = require('@we-debug/core')

weDebug.init()
```

## Links

- [文档 · Document](https://dlhandsome.github.io/we-debug/#/)
- [开源协议 · The MIT License](http://opensource.org/licenses/MIT)

