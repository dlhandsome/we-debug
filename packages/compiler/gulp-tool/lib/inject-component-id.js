const lead = require('lead');
const $ = require('gogocode');
const pumpify = require('pumpify');
const through = require('through2');
const { md5 } = require('./md5');
const { getAppJsonPath, getAbsoluteComponentPath } = require('./path');
const { setAttributeToAST, getAttributeValueWithAST } = require('./gogocode');

const PLUGIN_NAME = 'we-debug-record-playback';
let componentsInAppJson = [];

module.exports = function (options = {}) {
  const { baseDir } = options || {};
  if (typeof baseDir !== 'string' || !baseDir) {
    throw new Error(`[${PLUGIN_NAME}]请传入正确的baseDir，用于标识遍历的根目录。`);
  }

  let isInit = false;

  /** 初始化，获取app.json路径和所有页面路径 */
  const init = () =>
    through.obj((file, encoding, callback) => {
      if (!isInit) {
        try {
          parseAppJsonComponents();
          injectComponentId();
        } catch (e) {
          throw new Error(`[${PLUGIN_NAME}]遍历文件失败，请检查设置是否正确。`);
        }
        isInit = true;
      }
      callback(null, file);
    });

  /** 解析app.json中引用的组件 */
  const parseAppJsonComponents = () => {
    const appJsonPath = getAppJsonPath(baseDir);

    componentsInAppJson = require(appJsonPath).usingComponents || [];
    Object.getOwnPropertyNames(componentsInAppJson).forEach(componentName => {
      componentsInAppJson[componentName] = getAbsoluteComponentPath(
        componentsInAppJson[componentName],
        appJsonPath.slice(0, appJsonPath.lastIndexOf('/'))
      );
    });
  };

  /** 解析页面/页面中引用的组件 */
  const parseChildComponents = path => {
    const usingComponents = require(`${path}.json`).usingComponents || {};
    const componentsInJson = {};
    Object.getOwnPropertyNames(usingComponents).forEach(componentName => {
      componentsInJson[componentName] = getAbsoluteComponentPath(
        usingComponents[componentName],
        path.slice(0, path.lastIndexOf('/'))
      );
    });
    return componentsInJson;
  };

  const injectComponentId = () =>
    through.obj((file, encoding, callback) => {
      if (file.extname === '.wxml') {
        const gogo = $.loadFile(file.path, { parseOptions: { language: 'html' } });
        const path = file.path.slice(0, -5);
        const usingComponents = {
          ...(parseChildComponents(path) || {}),
          ...componentsInAppJson
        };
        Object.getOwnPropertyNames(usingComponents).forEach(component =>
          gogo
            .replace(`<${component} $$$0 />`, `<${component} $$$0></${component}>`)
            .find(`<${component}></${component}>`)
            .each(item => {
              if (typeof getAttributeValueWithAST(item, 'id') === 'undefined') {
                const itemString = item.generate();
                const id = md5(itemString);
                setAttributeToAST(item, 'id', id);
              }
            })
        );
        const res = gogo.generate();
        // eslint-disable-next-line no-param-reassign
        file.contents = Buffer.from(res);
      }
      callback(null, file);
    });

  const pipeline = [init(), injectComponentId()];

  return lead(pumpify.obj(pipeline));
};
