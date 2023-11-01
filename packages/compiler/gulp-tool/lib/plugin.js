const PluginError = require('plugin-error');

const PLUGIN_NAME = '@we-debug/gulp-tool';

class Plugin {
  /** 子插件生命周期 */
  lifecycles = [];
  /** 插件元信息 */
  meta = {};

  getLifecycles() {
    return this.lifecycles;
  }

  register(options) {
    this.lifecycles.push(options);
  }

  execLifecycle(lifetime, file) {
    this.lifecycles.forEach(i => {
      if (typeof i[lifetime] === 'function') {
        i[lifetime].call(this, file);
      }
    });
  }

  loadPlugin(pkg) {
    const pkgType = typeof pkg;

    switch (pkgType) {
      case 'function':
        // 函数直接返回
        return pkg;
      case 'string':
        // 字符串识别为 npm 包
        return require(pkg);
    }
  }

  initPlugin(packges, meta) {
    this.meta = meta;

    packges.map(p => {
      try {
        // 加载插件
        let fn = this.loadPlugin(p.package);
        fn.call(this, this, p.options);
      } catch (e) {
        throw new PluginError(
          PLUGIN_NAME,
          `load package ${p.package} error: ', ${e}`
        );
      }
    });
  }
}

module.exports = new Plugin();
