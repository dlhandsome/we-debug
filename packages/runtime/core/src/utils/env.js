export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  QQ: 'QQ'
};

let _env = null;

export function getEnv() {
  if (_env) return _env;
  if (typeof qq !== 'undefined' && qq.getSystemInfo) {
    _env = ENV_TYPE.QQ;
    return ENV_TYPE.QQ;
  }
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    _env = ENV_TYPE.WEAPP;
    return ENV_TYPE.WEAPP;
  }
  if (typeof window !== 'undefined') {
    _env = ENV_TYPE.WEB;
    return ENV_TYPE.WEB;
  }
  return 'Unknown environment';
}
