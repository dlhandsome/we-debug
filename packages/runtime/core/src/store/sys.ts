import { silent } from '../utils/silent';

let _sys: WechatMiniprogram.SystemInfo;

function set(sys: WechatMiniprogram.SystemInfo) {
  _sys = sys;
}

function get() {
  if (!_sys) _sys = silent(() => wx.getSystemInfoSync());
  return _sys;
}

export default {
  get,
  set
};
