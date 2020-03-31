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

  if (options.plugins.error) use.call(this, ErrorPlugin, options.plugins.error.options || {});
  if (options.plugins.router) use.call(this, RouterPlugin, options.plugins.router.options || {});

  return this;
}
