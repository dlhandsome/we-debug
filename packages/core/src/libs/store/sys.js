let _sys;

function set(sys) {
  _sys = sys;
}

function get() {
  if (!_sys) _sys = wx.getSystemInfoSync();
  return _sys;
}

export default {
  get,
  set
};
