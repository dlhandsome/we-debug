import {
  use
} from './use';
import ErrorPlugin from '@we-debug/plugin-error';
import RouterPlugin from '@we-debug/plugin-router';
import LauncherPlugin from '@we-debug/plugin-launcher';
import networkPlugin from '@we-debug/plugin-network';
import uiCheckPlugin from '@we-debug/plugin-ui-check/plugin';
import AppdataPlugin from '@we-debug/plugin-appdata';
import merge from 'deepmerge';
import {
  IWedebugInitOption
} from '../types';

/**
 * 初始化方法
 * 
 * @param {*} options
 */
export function init(this: any, options?: IWedebugInitOption) {
  const opt = merge(
    {
      launcher: true,
      plugin: {
        network: true,
        error: true,
        router: true,
        uiCheck: true,
        appData: true,
      }
    },
    options || {}
  );

  if (opt.launcher) use.call(this, LauncherPlugin, opt.launcher || {});
  if (opt.plugin.appData) use.call(this, AppdataPlugin, opt.plugin.appData || {});
  if (opt.plugin.network) use.call(this, networkPlugin, opt.plugin.network || {});
  if (opt.plugin.error) use.call(this, ErrorPlugin, opt.plugin.error || {});
  if (opt.plugin.router) use.call(this, RouterPlugin, opt.plugin.router || {});
  if (opt.plugin.uiCheck) use.call(this, uiCheckPlugin, opt.plugin.uiCheck || {});

  return this;
}
