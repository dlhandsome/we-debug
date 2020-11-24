const path = require('path');

exports.belongsPage = function (fullPath, pages = []) {
  const file = path.parse(fullPath);
  return pages.indexOf(path.join(file.dir, file.name)) > -1;
};

exports.belongsApp = function (fullPath, projectDir) {
  const file = path.parse(fullPath);
  const app = path.format({ dir: projectDir, name: 'app' });
  return app === path.join(file.dir, file.name);
};
