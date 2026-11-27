import requestManage from './networkManage';
import { createRecord, finishRecord } from './record';

const Network = {};

const NETWORK_GROUP = 'Network';
const PRESERVE_LOG_CACHE_KEY = '__wedebug_network_preserve_log__';

/**
 * weDebug: weDebug 实例
 *
 * @class NetworkPlugin
 */
class NetworkPlugin {
  constructor(weDebug, options = {}) {
    this.weDebug = weDebug;
    this.options = options;
    this.recording = true;
    this._preserveLogCache = weDebug.createCache(PRESERVE_LOG_CACHE_KEY);
    this.preserveLog = !!this._preserveLogCache.get();

    requestManage.setMaxRecords(options.maxRecords);
  }

  /**
   * 创建界面
   *
   * @memberof NetworkPlugin
   */
  createUI() {
    const that = this;
    const { createFormRule, addFormRule, createNetworkView, addNetworkView } = that.weDebug;

    // 创建网络环境规则表单
    that._networkRule = createFormRule({
      title: '调试抓包',
      desc: '复制本页面所有请求的抓包信息',
      type: 'button',
      handler: {
        bindTap() {
          that.weDebug.silent(() =>
            wx.setClipboardData({
              data: JSON.stringify(requestManage.get(), null, 2)
            })
          );
        }
      }
    });

    // 添加表单到视图
    addFormRule([that._networkRule], {
      group: '系统'
    });

    if (!createNetworkView || !addNetworkView) {
      return;
    }

    that._networkView = createNetworkView({
      handler: {
        getRecords: () => requestManage.get(),
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

    addNetworkView(that._networkView, {
      group: { name: NETWORK_GROUP }
    });
  }

  clear() {
    requestManage.clear();
    this.notify();
  }

  notify() {
    this._networkView && this._networkView.emit();
  }

  /**
   * 劫持实现逻辑
   *
   * @returns
   * @memberof NetworkPlugin
   */
  createProxy() {
    const { event } = this.weDebug;

    event.on('network:request-start', network => {
      if (!this.recording) return;
      requestManage.add(createRecord(network));
      this.notify();
    });

    event.on('network:request-finished', network => {
      let record = requestManage.getById(network.id);
      if (!record) {
        // 录制暂停期间发起的请求不再记录
        if (!this.recording || network.id !== undefined) return;
        record = createRecord(network);
        requestManage.add(record);
      }
      finishRecord(record, network);
      this.notify();
    });

    wx.onAppRoute &&
      wx.onAppRoute(() => {
        // 路由信息更新时，未开启保留日志则清空请求队列
        if (!this.preserveLog) {
          this.clear();
        }
      });
  }
}

Network.install = function (weDebug, options = {}) {
  const ins = new NetworkPlugin(weDebug, options);

  ins.createUI();
  ins.createProxy();
};

export default Network;
