# @we-debug/gulp-tool

## 安装

```
npm install @we-debug/gulp-tool -D
```

## 使用

```javascript
const gulp = require('gulp')
const weDebugTool = require('@we-debug/gulp-tool')

gulp.src('src/**/*.{json,wxml}')
  .pipe(weDebugTool())
  .pipe(gulp.dest('dist'))
```

## 配置项

参数 | 说明 |  类型 | 默认值 | 版本
-|-|-|-|-|
baseDir | 项目源码位置 | `string` | `src` | - |
wxml | we-debug wxml 模板 | `string` | `<we-debug />` | - |
compName | we-debug 全局组件名 | `string` | `we-debug` | - |
compPath | we-debug 全局组件位置 | `string` | `@we-debug/core/component/index/index` | - |