const path = require('path');
const { getAbsolutePath } = require('./path');

exports.lookupPages = function (projectDir) {
  let pages = [];
  let subpackages = [];

  projectDir = getAbsolutePath(projectDir);
  const appPath = path.format({ dir: projectDir, name: 'app', ext: '.json' });

  try {
    const appJson = require(appPath);

    pages = appJson.pages;
    subpackages = appJson.subpackages || [];

    pages = pages.map(p => {
      return path.resolve(projectDir, p);
    });

    subpackages.forEach(sub => {
      sub.pages.forEach(p => {
        let relativePath = path.join(sub.root, p);

        pages.push(path.resolve(projectDir, relativePath));
      });
    });
  } catch (err) {
    throw new Error(err);
  }

  return pages;
};
