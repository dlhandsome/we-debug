import PluginError from 'plugin-error';
import { 
  IRegistration,
  IPackageOption,
  IAnyObject,
  IPlugin,
  PackageParam
} from './types';

const PLUGIN_NAME = '@we-debug/gulp-tool';

class Plugin implements IPlugin {
  /** 子插件生命周期 */
  lifecycles: IRegistration[] = [];
  /** 插件元信息 */
  meta: IAnyObject = {};

  getLifecycles() {
    return this.lifecycles;
  }

  register(options: IRegistration) {
    this.lifecycles.push(options);
  }

  execLifecycle(lifetime: keyof IRegistration, file: File) {
    this.lifecycles.forEach(i => {
      const lifecycle = i[lifetime];
      if (typeof lifecycle === 'function') {
        lifecycle.call(this, file);
      }
    });
  }

  loadPlugin(pkg: PackageParam) {
    if (typeof pkg === 'string') {
      return require(pkg);
    }

    if (typeof pkg === 'function') {
      return pkg;
    }
  }

  initPlugin(packges: IPackageOption[], meta: IAnyObject) {
    this.meta = meta;

    packges.map(p => {
      try {
        // 加载插件
        let fn = this.loadPlugin(p.package);
        fn.call(this, this, p.options);
      } catch (e) {
        throw new PluginError(PLUGIN_NAME, `load package ${p.package} error: ', ${e}`);
      }
    });
  }
}

export default new Plugin();
