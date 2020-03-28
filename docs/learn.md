### 背景

众所周知，**开发阶段**、**体验阶段** 是小程序研发过程中必不可少的环节，同时也是耗时最久的环节。两阶段中研发流程是否合理、配套设施是否健全，都会直接影响到小程序的迭代效率。

![小程序开发流程](https://user-images.githubusercontent.com/16918885/77831577-f9d24300-716a-11ea-8f71-5af9acd27e12.png)

#### 开发阶段

为了帮助开发者简单和高效地开发和调试微信小程序，官方推出了小程序开发者工具。

开发者工具功能十分丰富，可以满足我们本地开发的大部分需求，如：

- 模拟器
- 调试工具
- 自定义编译
- 特殊场景调试
- ...

这使得开发者在开发阶段效率得到质的飞跃。

#### 体验阶段

这个阶段小程序开发者会上传代码包至微信服务器，生成开发版或体验版小程序用于特性验证。体验者可能是不懂开发的产品经理、老板或者其它项目成员。

有时特性的表现不符合预期，体验者在反馈问题时，会通过简单的描述、截图或录屏反馈给小程序开发人员。在这个过程中，由于信息的不完备性，常常不得不让小程序开发者与体验者反复沟通确认细节，或开展想象力进行地毯式的问题排查，不可避免地耗费大量时间与精力。

#### 问题分析

对比开发阶段，体验阶段存在信息转化率低的问题：

开发阶段，小程序开发工具为开发者提供了丰富的调试信息，能够让开发者快速准确地实施本地的开发及问题定位。

![开发阶段信息转化率高](https://user-images.githubusercontent.com/16918885/77831733-d6f45e80-716b-11ea-9d39-99446844d9b0.png)

体验阶段，体验者由于专业背景或条件限制，往往只能给出问题描述、截图、录屏等基础信息，开发者自身需要对这些信息进行消化理解，并尝试“翻译”成所需的技术术语。

![体验阶段信息转化率低](https://user-images.githubusercontent.com/16918885/77831762-01461c00-716c-11ea-8830-bdb05828434a.png)

为了解决这类问题，`we-debug` 诞生了。

### 基础视图

在操作界面上，`we-debug` 设计了两个基础视图：

- 状态徽章
- 调试面板

![we-debug基础视图](https://user-images.githubusercontent.com/16918885/77830614-a3620600-7164-11ea-9a28-a72ed2588f35.png)

#### 状态徽章

徽章（Badge）一般由左半部分名称和右半部分的值组成。由于这类小图标不仅简洁美观，还包含了清晰易读的信息，在 GitHub 的各类开源库中被广泛使用：

在 `we-debug` 中，徽章被设计为小程序自定义组件。样式上，Badge 组件参考了 GitHub 徽章；功能上，组件除了基本的信息展示，还新增了初始位置、可拖拽等特性。

#### 调试面板

调试面板内，绝大多数调试功能以表单的呈现方式与体验人员交互，如：文字、`Switch`开关、`Button` 按钮等。能够让体验者弹高效地提取有效的调试信息。

### 事件通信

![事件通信](https://user-images.githubusercontent.com/16918885/77830749-a4dffe00-7165-11ea-983d-b33d604ca83b.png)


在小程序中，每个页面都是独立的一个实例，拥有各自独立的生命周期。

作为一个调试工具，必须是全局展示的。为保证每个页面中 `we-debug` 的数据及视图是同步的（如：徽章的位置信息、调试面板的 `Switch` 开关状态），我们在底层内置了一个“事件中心”，当体验者拖拽状态徽章、操作调试面板时，将触发订阅的相关事件，从而保持所有页面中调试 `we-debug` 数据、视图的同步更新。

### 插件

#### 内置功能插件

`we-debug` 将 视图组件、事件机制 封装为核心（core）模块。调试规则的设定及获取则由其插件机制来实现。

![小程序we-debug](https://user-images.githubusercontent.com/16918885/77830251-3ea5ac00-7162-11ea-99f5-f25d300e0c5b.png)

如下插件中，一部分调试信息可以单纯通过小程序端的 API 获取，具有一定的通用性，`we-debug` 对这些插件进行了内置：

- 获取小程序页面路径
- 获取小程序页面参数
- 获取小程序错误日志

#### 可选功能插件

通过全局方法 `weDebug.use()` 使用可选功能插件。它需要在你调用 `weDebug.init()` 初始化`we-debug` 配置前完成：

```javascript
weDebug.use(MyPlugin)

weDebug.init({
  // ...配置项
})
```

也可以传入一个可选的选项对象：

```javascript
weDebug.use(MyPlugin, { someOption: true })
```

#### 如何开发一个定制插件

插件中可以调用核心模块中提供的任意 API：

- use: 安装插件
- init: 初始化 `we-debug` 配置
- createCache: 创建缓存
- event: 事件实例
- store: 缓存数据
- util: 辅助函数
- createBadge: 创建徽章
- getBadge: 获取所有创建的徽章
- addBadge: 添加徽章到视图
- removeBadge: 移除徽章
- createFormRule: 创建调试规则
- getFormRule: 获取所有创建的调试规则
- addFormRule: 添加调试规则到视图
- removeFormRule: 移除调试规则

`we-debug` 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `weDebug` 本身，第二个参数是一个可选的选项对象：

```javascript
MyPlugin.install = function (weDebug, options) {
  if (MyPlugin.installed) return
  MyPlugin.installed = true
  // 编写插件逻辑
}
```

#### 参考案例

- [vConsole 插件](https://github.com/dlhandsome/we-debug/blob/master/packages/plugin-vconsole/src/index.js)