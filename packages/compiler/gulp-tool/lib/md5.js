const crypto = require('crypto');

const md5 = (src) => {
  if (typeof src !== 'string') {
    return '';
  }
  const hash = crypto.createHash('md5');
  return hash.update(src).digest('hex');
};

module.exports = {
  md5,
};
