# @we-debug/gulp-tool

we-debug 全局组件注入插件。

## 简介

we-debug 组件需要在每个小程序页面引入，对于一些大型的小程序，动辄上百个页面，手工植入是令人崩溃的。

对此，我们提供了一个 gulp 插件来帮助你完成这些事情：

- `app.json` 中声明全局组件
- 解析所有的小程序页面，并在每个页面 wxml 文件中追加组件 wxml 代码
- `app.js` 注入 `we-debug` 初始化文件调用代码

## 安装

```
npm install @we-debug/gulp-tool gulp-mp-npm -D
```

> 由于 we-debug 组件为 NPM 组件包，这里需要搭配 `gulp-mp-npm` 插件。

## 使用

```javascript
const gulp = require('gulp')
const weDebug = require('@we-debug/gulp-tool')
const mpNpm = require('gulp-mp-npm')

gulp
  .src('dist/**/*.*')
  .pipe(
    weDebug({
      baseDir: 'dist'
    })
  )
  .pipe(npm())
  .pipe(gulp.dest('dist'))
```

## 配置项

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
baseDir | 项目源码位置 | `string` | `src` | - |
wxml | we-debug wxml 模板 | `string` | `<we-debug />` | - |
filter | 页面过滤参数，可以是正则、字符串、函数或这三者组成的数组 | `reg &#124;string &#124;func &#124;array` | `''` | - |
compName | we-debug 全局组件名 | `string` | `we-debug` | - |
compPath | we-debug 全局组件位置，可填绝对路径/相对baseDir的路径 | `string` | `@we-debug/core/component/index/index` | - |
entryFile | we-debug 初始化文件位置，可填绝对路径/相对baseDir的路径 | `string` | `./we-debug/index.js` | - |
