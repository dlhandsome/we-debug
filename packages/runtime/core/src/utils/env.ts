
let env: ENV_TYPE;

declare const qq: any;
declare const window: any;

export enum ENV_TYPE {
  WEAPP = 'WEAPP',
  WEB = 'WEB',
  QQ = 'QQ'
};

export function getEnv() {
  if (env) return env;
  if (typeof qq !== 'undefined' && qq.getSystemInfo) {
    env = ENV_TYPE.QQ;
    return ENV_TYPE.QQ;
  }
  if (typeof wx !== 'undefined' && wx.getSystemInfo as any) {
    env = ENV_TYPE.WEAPP;
    return ENV_TYPE.WEAPP;
  }
  if (typeof window !== 'undefined') {
    env = ENV_TYPE.WEB;
    return ENV_TYPE.WEB;
  }
  return 'Unknown environment';
}
