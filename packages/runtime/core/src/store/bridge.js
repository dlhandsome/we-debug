const _bridge = {};

function set(k, v) {
  _bridge[k] = v;
}

function get(k) {
  return _bridge[k];
}

function getAll() {
  return _bridge;
}

export default {
  get,
  set,
  getAll
};
