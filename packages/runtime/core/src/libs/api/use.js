import { isFunc } from '../base/utils';

const installedPlugins = [];

export function use(plugin = {}, ...args) {
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }
  args.unshift(this);
  if (isFunc(plugin.install)) {
    plugin.install.apply(plugin, args);
  } else if (isFunc(plugin)) {
    plugin.apply(null, args);
  }
  installedPlugins.push(plugin);

  return this;
}
