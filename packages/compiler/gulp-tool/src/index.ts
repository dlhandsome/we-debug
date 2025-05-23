import path from 'path';
import lead from 'lead';
import pumpify from 'pumpify';
import through from 'through2';
import PluginError from 'plugin-error';
import {
  lookupPages
} from './lookup';
import {
  belongsPage,
  belongsApp
} from './belongs';
import {
  getAbsolutePath
} from './path';
import plugin from './plugin';
import {
  PLUGIN_NAME
} from './constants';
import {
  FilterOption,
  ICompilerOption
} from './types';

let pages: string[] = [];
let hasInit = false;

function mpGlobalComp(options: ICompilerOption = {}) {
  //
  let baseDir = options.baseDir || 'src';
  const wxmlRaw = options.wxml || ((props) => `<we-debug useCustomMask="{{${props.useCustomMask}}}" />`);
  const filter = options.filter || '';
  let compName = options.compName || 'we-debug';
  let compPath = options.compPath || '@we-debug/miniprogram/index/index';
  let entryFile = options.entryFile || 'we-debug/index.js';
  const plugins = options.plugins || [];

  baseDir = getAbsolutePath(baseDir);
  const isModule = compPath.indexOf('@we-debug/core') === 0;

  if (!isModule && path.isAbsolute(compPath)) {
    compPath = path.relative(baseDir, compPath);
  }

  if (path.isAbsolute(entryFile)) {
    entryFile = path.relative(baseDir, entryFile);
  }

  /**
   * 初始化设置
   */
  function init() {
    // @ts-ignore
    return through.obj((file, encoding, callback) => {
      if (!hasInit) {
        // 执行 beforeInit 插件钩子
        plugin.execLifecycle('beforeInit', file);

        try {
          pages = lookupPages(baseDir);
          plugin.initPlugin(plugins, { ...options, pages });
        } catch (e) {
          throw new PluginError(PLUGIN_NAME, 'look up pages failed, please check your configure');
        }
        hasInit = true;
        // 执行 onInit 插件钩子
        plugin.execLifecycle('onInit', file);
      }
      callback(null, file);
    });
  }

  /**
   * 解析 wxml
   */
  function parseWxml() {
    // @ts-ignore
    return through.obj((file, encoding, callback) => {
      if (file.isNull()) return callback(null, file);

      // 如果不是 wxml 文件, 则跳过
      if (file.extname !== '.wxml') return callback(null, file);
      // 执行 wxml 插件钩子
      plugin.execLifecycle('wxml', file);

      // 如果命中filter，则跳过
      if (filter) {
        const pathStr = file.path.split(path.sep).join('/'); // 兼容不同操作系统的路径分隔符
        if (Array.isArray(filter)) {
          const result = filter.some(item => {
            return isDoFilter(item, pathStr);
          });
          if (result) return callback(null, file);
        } else {
          if (isDoFilter(filter, pathStr)) return callback(null, file);
        }
      }

      // 如果属于 Page
      if (belongsPage(file.path, pages)) {
        // 插入 we-debug 片段之前执行
        plugin.execLifecycle('beforeInsertWxml', file);
        let code = file.contents.toString();
        let injectWxml = typeof wxmlRaw === 'function'
            ? wxmlRaw({
              useCustomMask: code.indexOf('<page-container') > -1
            })
            : wxmlRaw;

        code += injectWxml;

        file.contents = Buffer.from(code);
        // 插入 we-debug 片段之后执行
        plugin.execLifecycle('afterInsertWxml', file);
      }

      callback(null, file);
    });
  }

  /**
   * 是否需要过滤
   * @returns [Boolean] true-需要过滤；false-不需要过滤
   */
  function isDoFilter(filter: FilterOption, path: string) {
    return (
      (typeof filter === 'function' && !filter(path)) ||
      (typeof filter === 'string' && path.indexOf(filter) >= 0) ||
      (filter instanceof RegExp && filter.test(path))
    );
  }

  /**
   * 处理 json
   */
  function parseJson() {
    // @ts-ignore
    return through.obj((file, encoding, callback) => {
      if (file.isNull()) return callback(null, file);

      // 如果不是 wxml 文件, 则跳过
      if (file.extname !== '.json') return callback(null, file);
      // 检测到项目 json 文件后立即执行
      plugin.execLifecycle('json', file);

      // 如果是 app.json
      if (belongsApp(file.path, baseDir)) {
        let code = file.contents.toString();

        try {
          const json = JSON.parse(code);

          if (!json.usingComponents) {
            json.usingComponents = {};
          }
          json.usingComponents[compName] = compPath;

          code = JSON.stringify(json, null, 2);
        } catch (e) {
          throw new PluginError(PLUGIN_NAME, e);
        }

        file.contents = Buffer.from(code);
      }

      callback(null, file);
    });
  }

  /**
   * 处理 js
   */
  function parseScript() {
    // @ts-ignore
    return through.obj((file, encoding, callback) => {
      if (file.isNull()) return callback(null, file);

      // 如果不是 JS 文件, 则跳过
      if (file.extname !== '.js') return callback(null, file);
      // 检测到项目 js 文件后立即执行
      plugin.execLifecycle('script', file);

      // 如果是 app.js
      if (belongsApp(file.path, baseDir) || file.relative === 'app.js') {
        // app.js 插入 we-debug import 片段前执行
        plugin.execLifecycle('beforeInsertScript', file);
        let code = file.contents.toString();

        code = `require('${entryFile}')\n` + code;
        file.contents = Buffer.from(code);
        // app.js 插入 we-debug import 片段后执行
        plugin.execLifecycle('afterInsertScript', file);
      }

      callback(null, file);
    });
  }

  const pipeline = [init(), parseWxml(), parseJson(), parseScript()];

  return lead(new pumpify.obj(pipeline));
}

module.exports = mpGlobalComp;
