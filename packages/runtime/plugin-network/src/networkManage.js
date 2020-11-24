// 请求队列管理
const requestManage = {
  _requestQueue: [],
  get() {
    return this._requestQueue;
  },
  add(task) {
    this._requestQueue.push(task);
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
