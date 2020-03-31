import { use } from './use.js';
import ErrorPlugin from '@we-debug/plugin-error';
import RouterPlugin from '@we-debug/plugin-router';
import merge from 'deepmerge';

/**
 * 初始化方法
 * @param {*} options
 */
export function init(options = {}) {
  options = merge(
    {
      plugin: {
        error: true,
        router: true
      }
    },
    options
  );

  if (options.plugin.error) use.call(this, ErrorPlugin, options.plugin.error || {});
  if (options.plugin.router) use.call(this, RouterPlugin, options.plugin.router || {});

  return this;
}
