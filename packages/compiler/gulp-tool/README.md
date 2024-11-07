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
filter | 页面过滤参数，可以是正则、字符串、函数或这三者组成的数组 | `reg` `string` `func` `array` | `''` | - |
compName | we-debug 全局组件名 | `string` | `we-debug` | - |
compPath | we-debug 全局组件位置，可填绝对路径/相对baseDir的路径 | `string` | `@we-debug/core/component/index/index` | - |
entryFile | we-debug 初始化文件位置，可填绝对路径/相对baseDir的路径 | `string` | `./we-debug/index.js` | - |
plugins | 插件配置 | `array<{ package: string, options: object }>` | `` | - |

## 插件
```@we-debug/gulp-tool``` 作为 ```we-debug``` 的一个编译增强型工具，可以帮助开发者在开发调试阶段提升效率，如果开发者希望在编译阶段做更多定制化操作，比如在 wxml 插入片段，给 json 新增字段等等，就需要用到插件能力了。

想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(options)自定义。

**gulpfile.js**

```javascript
const gulp = require('gulp')
const weDebug = require('@we-debug/gulp-tool')
const wedebugGulpXXX = require('wedebug-gulp-xxx')

gulp
  .src('dist/**/*.*')
  .pipe(
    weDebug({
      baseDir: 'dist',
      // 配置 we-debug gulp 第三方插件
      plugins: [
        {
          package: wedebugGulpXXX,
          options: { // 插件配置项，由第三方插件自由定义
            // xxx
          }
        }
      ]
    })
  )
```

## 开发插件

we-debug gulp 插件需要暴露一个函数，并且在函数中进行插件注册

```typescript

interface IMeta {
  baseDir: string;
  entryFile?: string;
}

interface ITool {
  meta: IMeta;
  register: (options: IRegistration) => void
}

interface PluginOption {
  [props: string]: any
}

type ProcessDefine = (file: File, encoding?: string) => File | void;

interface IRegistration {
  // 插件名称
  pluginName: string;
  // tool 初始化前执行
  beforeInit?: () => void;
  // tool 初始化时执行
  onInit?: () => void;
  // 检测到项目 wxml 文件后立即执行
  wxml?: ProcessDefine;
  // 插入 we-debug 片段之前执行
  beforeInsertWxml?: ProcessDefine;
  // 插入 we-debug 片段前执行
  afterInsertWxml?: ProcessDefine;
  // 检测到项目 json 文件后立即执行
  json?: ProcessDefine;
  // 检测到项目 js 文件后立即执行
  script?: ProcessDefine;
  // app.js 插入 we-debug import 片段前执行
  beforeInsertScript?: ProcessDefine;
  // app.js 插入 we-debug import 片段后执行
  afterInsertScript?: ProcessDefine;
}

export default function (tool: ITool, options: PluginOption = {}): void {
  // 注册插件
  tool.register({
    // ...
  })
}
```

