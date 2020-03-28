<div align="center">
<h1>we-debug</h1>

[![Build Status](https://travis-ci.com/dlhandsome/we-debug.svg?token=PfDv3SxcBYsJDq3kuspS&branch=master)](https://travis-ci.com/dlhandsome/we-debug) [![npm-version](https://img.shields.io/npm/v/@we-debug/core.svg)](https://www.npmjs.com/package/@we-debug/core)

<img src=https://user-images.githubusercontent.com/16918885/77829191-6e9d8100-715b-11ea-8776-dbe26431622a.gif width=150 />
</div>

## 简介

`we-debug` 是一款灵活、易于拓展的小程序端调试工具。

## 安装

- 通过 npm 安装（推荐）

```bash
npm install @we-debug/core --save
```

- 下载代码

克隆项目至本地，并将`dist`目录拷贝到自己的项目中

```bash
https://github.com/dlhandsome/we-debug.git
```

## 使用

1. 在 json 配置中添加 we-debug 组件声明

```json
{
  "usingComponents": {
    "we-debug": "@we-debug/core/component/index/index"
  }
}
```

2. 在页面 wxml 中创建 we-debug 组件

```html
<we-debug></we-debug>
```

3. 在 app.js 中初始化 we-debug 相关配置

```javascript
const weDebug = require('@we-debug/core/libs/index')

weDebug.init()
```

