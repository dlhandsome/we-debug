import requestManage from './networkManage';

const Network = {};

wx.onAppRoute &&
  wx.onAppRoute(() => {
    // 路由信息更新时，请求队列清空
    requestManage.clear();
  });

/**
 * weDebug: weDebug 实例
 *
 * @class NetworkPlugin
 */
class NetworkPlugin {
  constructor(weDebug) {
    this.weDebug = weDebug;
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
            data: JSON.stringify(requestManage.get(), null, 2)
          });
        }
      }
    });

    // 添加表单到视图
    addFormRule([that._networkRule], {
      group: '系统'
    });
  }
  /**
   * 劫持实现逻辑
   *
   * @returns
   * @memberof NetworkPlugin
   */
  createProxy() {
    this.weDebug.event.on('network:request-finished', (network) => {
      requestManage.add(network);
    });
  }
}

Network.install = function (weDebug, options = {}) {
  const ins = new NetworkPlugin(weDebug, options);

  ins.createUI();
  ins.createProxy();
};

export default Network;
