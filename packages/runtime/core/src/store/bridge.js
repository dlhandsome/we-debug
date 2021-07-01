const _bridge = {};

function set(k, v) {
  _bridge[k] = v;
}

function get(k) {
  return typeof _bridge[k] === 'function' ? _bridge[k]() : _bridge[k];
}

function getAll() {
  Object.keys(_bridge).forEach(k => {
    _bridge[k] = typeof _bridge[k] === 'function' ? _bridge[k]() : _bridge[k];
  });
  return _bridge;
}

export default {
  get,
  set,
  getAll
};
