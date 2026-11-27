// API 调用记录队列管理
const apiManage = {
  _queue: [],
  _maxRecords: 500,
  setMaxRecords(n) {
    if (n > 0) {
      this._maxRecords = n;
    }
  },
  get() {
    return this._queue;
  },
  getById(id) {
    return this._queue.find(item => item.id === id);
  },
  add(record) {
    this._queue.push(record);
    if (this._queue.length > this._maxRecords) {
      this._queue.splice(0, this._queue.length - this._maxRecords);
    }
  },
  clear() {
    this._queue = [];
  }
};

export default apiManage;
