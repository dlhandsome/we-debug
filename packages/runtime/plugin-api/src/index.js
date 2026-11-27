import apiManage from './apiManage';
import { hookWxApi } from './hook';
import { createRecord, finishRecord } from './record';

const Api = {};

const API_GROUP = 'API';
const PRESERVE_LOG_CACHE_KEY = '__wedebug_api_preserve_log__';

/**
 * weDebug: weDebug 实例
 *
 * @class ApiPlugin
 */
class ApiPlugin {
  constructor(weDebug, options = {}) {
    this.weDebug = weDebug;
    this.options = options;
    this.recording = true;
    this._pending = {};
    this._preserveLogCache = weDebug.createCache(PRESERVE_LOG_CACHE_KEY);
    this.preserveLog = !!this._preserveLogCache.get();

    apiManage.setMaxRecords(options.maxRecords);
  }

  createUI() {
    const that = this;
    const { createApiView, addApiView } = that.weDebug;

    if (!createApiView || !addApiView) {
      return;
    }

    that._apiView = createApiView({
      handler: {
        getRecords: () => apiManage.get(),
        getState: () => ({
          recording: that.recording,
          preserveLog: that.preserveLog
        }),
        bindClear: () => that.clear(),
        bindRecordChange: recording => {
          that.recording = !!recording;
          that.notify();
        },
        bindPreserveLogChange: preserveLog => {
          that.preserveLog = !!preserveLog;
          that._preserveLogCache.set(that.preserveLog);
          that.notify();
        }
      }
    });

    addApiView(that._apiView, {
      group: { name: API_GROUP }
    });
  }

  clear() {
    apiManage.clear();
    this.notify();
  }

  notify() {
    this._apiView && this._apiView.emit();
  }

  /**
   * 劫持 wx API 并记录调用
   *
   * @memberof ApiPlugin
   */
  createProxy() {
    const { event } = this.weDebug;
    const { include, exclude } = this.options;

    hookWxApi({
      include,
      exclude,
      shouldRecord: () => this.recording && !(this.weDebug.isSilent && this.weDebug.isSilent()),
      onStart: call => event.emit('wxapi:call-start', call),
      onFinish: call => event.emit('wxapi:call-finished', call)
    });

    event.on('wxapi:call-start', call => {
      this._pending[call.id] = call;
      apiManage.add(createRecord(call));
      this.notify();
    });

    event.on('wxapi:call-finished', call => {
      const start = this._pending[call.id];
      delete this._pending[call.id];

      let record = apiManage.getById(call.id);
      if (!record) {
        // 路由切换清空了记录（如 navigateTo 自身），完成时重新补录
        if (!this.recording || !start) return;
        record = createRecord(start);
        apiManage.add(record);
      }
      finishRecord(record, call);
      this.notify();
    });

    wx.onAppRoute &&
      wx.onAppRoute(() => {
        if (!this.preserveLog) {
          this.clear();
        }
      });
  }
}

Api.install = function (weDebug, options = {}) {
  const ins = new ApiPlugin(weDebug, options);

  ins.createUI();
  ins.createProxy();
};

export default Api;
