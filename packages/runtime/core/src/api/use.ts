import { IAnyObject } from '../types';
import { isFunc } from '../utils/simple-type-function';

interface IPluginInstance<T extends IAnyObject = IAnyObject> {
  install (weDebug: T, ...args: any[]): void;
}

const installedPlugins: IPluginInstance[] = [];

export function use(this: any, plugin: IPluginInstance, ...args: any[]) {
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }

  if (isFunc(plugin.install)) {
    plugin.install.apply(plugin, [this, ...args]);
  } else if (isFunc(plugin)) {
    plugin.apply(null, [this, ...args]);
  }
  installedPlugins.push(plugin);

  return this;
}
