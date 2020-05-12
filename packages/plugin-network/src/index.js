import requestManage from './networkManage';

const Network = {};
const _request = wx.request;

wx.onAppRoute(() => {
  // 路由信息更新时，请求队列清空
  requestManage.clear();
});

/**
 * weDebug: weDebug 实例
 * networkCallee: 网络请求方式
 *
 * @class NetworkPlugin
 */
class NetworkPlugin {
  constructor(weDebug, options = {}) {
    this.weDebug = weDebug;
    this.networkCallee = options.networkCallee || ['request', 'downloadFile', 'uploadFile'];

    this._store = {
      infoRuleState: weDebug.createCache('__infoRuleState__')
    };

    this._proxyRule = null;
  }

  /**
   * 创建界面
   *
   * @memberof NetworkPlugin
   */
  createUI() {
    const that = this;
    const { createFormRule, addFormRule } = that.weDebug;

    // 创建网络环境规则表单
    that._networkRule = createFormRule({
      title: '调试抓包',
      desc: '获取本页面所有请求的抓包信息',
      type: 'button',
      handler: {
        bindTap() {
          wx.setClipboardData({
            data: JSON.stringify(requestManage.get())
          });
        }
      }
    });

    // 添加表单到视图
    addFormRule([that._networkRule]);
  }
  /**
   * 劫持实现逻辑
   *
   * @returns
   * @memberof NetworkPlugin
   */
  createProxy() {
    this.networkCallee.forEach(method => {
      setTimeout(() => {
        Object.defineProperty(wx, method, {
          get: () => (opt = {}) => this.proxyHandler(method, opt)
        });
      });
    });
  }

  proxyHandler(method, opt = {}) {
    const that = this;
    const { isFunc } = that.weDebug.util;

    let out = Object.assign({}, opt);

    if (!out.header) {
      out.header = {};
    }

    if (!out.data) {
      out.data = {};
    }

    out.success = function (res) {
      requestManage.add({
        request: opt,
        response: res
      });

      isFunc(opt.success) && opt.success.apply(this, arguments);
    };

    out.fail = function (err) {
      requestManage.add({
        request: opt,
        response: err
      });

      isFunc(opt.fail) && opt.fail.apply(this, arguments);
    };

    return _request.call(this, out);
  }
}

Network.install = function (weDebug, options = {}) {
  const ins = new NetworkPlugin(weDebug, options);

  ins.createUI();
  ins.createProxy();
};

export default Network;
