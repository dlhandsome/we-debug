const path = require('path');

exports.getAbsolutePath = function (p) {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
};
