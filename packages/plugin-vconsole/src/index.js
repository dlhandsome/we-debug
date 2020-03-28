const vConsolePlugin = {};
/**
 * vConsole 插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */

vConsolePlugin.install = function (weDebug, options = {}) {
  const store = {
    vConsoleRuleState: weDebug.createCache('__vConsoleRuleState__')
  };

  const vConsoleRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '开启 vConsole 调试工具',
        desc: 'vConsole 是微信官方推出的调试工具',
        type: 'button',
        state: {
          disabled: false,
          checked: () => store.vConsoleRuleState.get()
        },
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              wx.setEnableDebug({
                enableDebug: state.checked
              });
            }
          }
        }
      },
      options
    )
  );

  weDebug.addFormRule([vConsoleRule]);
};

export default vConsolePlugin;
