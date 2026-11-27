// 请求队列管理
const requestManage = {
  _requestQueue: [],
  _maxRecords: 300,
  setMaxRecords(n) {
    if (n > 0) {
      this._maxRecords = n;
    }
  },
  get() {
    return this._requestQueue;
  },
  getById(id) {
    return this._requestQueue.find(item => item.id === id);
  },
  add(task) {
    this._requestQueue.push(task);
    if (this._requestQueue.length > this._maxRecords) {
      this._requestQueue.splice(0, this._requestQueue.length - this._maxRecords);
    }
  },
  update(id, patch) {
    const task = this.getById(id);
    if (task) {
      Object.assign(task, patch);
    }
    return task;
  },
  remove(task) {
    let i = this._requestQueue.length;
    while (i--) {
      let tmp = this._requestQueue[i];
      if (tmp === task) {
        this._requestQueue.splice(i, 1);
        break;
      }
    }
  },
  clear() {
    this._requestQueue = [];
  }
};

export default requestManage;
