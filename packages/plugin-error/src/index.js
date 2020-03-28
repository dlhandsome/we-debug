const ErrorPlugin = {};
/**
 * 异常调试插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */

const errManage = {
  _errStack: [],
  get() {
    return this._errStack;
  },
  add(e) {
    this._errStack.push(e);
  },
  clear() {
    this._errStack = [];
  }
};

ErrorPlugin.install = function (weDebug, options = {}) {
  const badgeOption = options.badge || {};
  const ruleOption = options.ruleOption || {};

  const errorBadge = weDebug.createBadge(
    Object.assign(
      {},
      {
        key: 'error',
        value: 0,
        color: 'red',
        show: () => true,
        draggable: true,
        position: {
          right: 0,
          top: 10
        }
      },
      badgeOption
    )
  );

  const copyErrStackRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '错误信息',
        desc: '复制当前错误信息到剪切板',
        type: 'button',
        state: {
          disabled: false
        },
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              wx.setClipboardData({
                data: JSON.stringify(errManage.get())
              });
            }
          }
        }
      },
      ruleOption
    )
  );

  weDebug.addBadge([errorBadge]);

  weDebug.addFormRule([copyErrStackRule]);

  wx.onError(err => {
    errManage.add(err);

    const errStack = errManage.get();
    const errLen = errStack.length;

    errorBadge.emit({
      value: errLen
    });

    copyErrStackRule.emit({
      meta: errLen
    });
  });
};

export default ErrorPlugin;
