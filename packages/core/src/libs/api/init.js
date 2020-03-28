import { use } from './use.js';
import ErrorPlugin from '@we-debug/plugin-error';
import RouterPlugin from '@we-debug/plugin-router';

/**
 * 初始化方法
 * @param {*} options
 */
export function init(options = {}) {
  if (!options.plugins) {
    options.plugins = {
      error: true,
      router: true
    };
  }

  if (options.plugins.error) use.call(this, ErrorPlugin, options.plugins.error.options || {});
  if (options.plugins.router) use.call(this, RouterPlugin, options.plugins.router.options || {});

  return this;
}
