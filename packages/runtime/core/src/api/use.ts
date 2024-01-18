import { IPluginInstance } from '../types';
import { isFunc } from '../utils/simple-type-function';

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
