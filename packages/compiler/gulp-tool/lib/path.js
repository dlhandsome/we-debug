const path = require('path');

/** 获取绝对路径 */
const getAbsolutePath = (p, src) => (path.isAbsolute(p) ? p : path.resolve(src || process.cwd(), p));

/** 通过项目入口，获取app.json的绝对路径 */
const getAppJsonPath = projectDir => {
  const projectDirAbsolute = getAbsolutePath(projectDir);
  return path.format({ dir: projectDirAbsolute, name: 'app', ext: '.json' });
};

/** 获取组件绝对路径 */
const getAbsoluteComponentPath = (componentPath = '', baseDir = '') => {
  const isGlobalPath = componentPath[0] === '@';
  return isGlobalPath ? componentPath : getAbsolutePath(componentPath, baseDir);
};

module.exports = {
  getAbsolutePath,
  getAppJsonPath,
  getAbsoluteComponentPath
};
