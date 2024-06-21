import {
  IPlugin,
  IFormRuleState,
  IPluginInitOption
} from './types';

const ErrorPlugin: IPlugin = {
  install () {}
};

/**
 * 异常调试插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */

const errManage = {
  _errStack: [] as string[],
  get() {
    return this._errStack;
  },
  add(e: WechatMiniprogram.Error) {
    this._errStack.push(e);
  },
  clear() {
    this._errStack = [];
  }
};

ErrorPlugin.install = function (weDebug, options: IPluginInitOption = {}) {
  if (ErrorPlugin.installed) return;
  ErrorPlugin.installed = true;

  const badgeOption = options.badge || {};
  const copyOption = options.copyRule || {};
  const clearOption = options.clearRule || {};

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
        title: '获取错误信息',
        desc: '复制错误信息到剪切板',
        type: 'button',
        state: {
          disabled: false
        },
        handler: {
          bindTap(state: IFormRuleState) {
            if (!state.disabled) {
              wx.setClipboardData({
                data: JSON.stringify(errManage.get(), null, 2)
              });
            }
          }
        }
      },
      copyOption
    )
  );

  const clearErrStackRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '清空错误信息',
        desc: '',
        type: 'button',
        state: {
          name: '清空',
          disabled: false
        },
        handler: {
          bindTap(state: IFormRuleState) {
            if (!state.disabled) {
              errManage.clear();
              updateState();
            }
          }
        }
      },
      clearOption
    )
  );

  weDebug.addBadge([errorBadge]);

  weDebug.addFormRule([copyErrStackRule, clearErrStackRule], {
    group: '系统'
  });

  function updateState() {
    const errStack = errManage.get();
    const errLen = errStack.length;

    errorBadge.emit({
      value: errLen
    });

    copyErrStackRule.emit({
      meta: errLen
    });
  }
  // 小程序插件不支持
  wx.onError &&
    wx.onError(err => {
      errManage.add(err);
      updateState();
    });

  (wx as any).onAppRoute &&
  (wx as any).onAppRoute(() => {
      updateState();
    });
};

export default ErrorPlugin;

export * from './types';
