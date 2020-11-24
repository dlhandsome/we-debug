const vConsolePlugin = {};
/**
 * vConsole 插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */

vConsolePlugin.install = function (weDebug, options = {}) {
  if (vConsolePlugin.installed) return;
  vConsolePlugin.installed = true;

  const ruleOption = options.rule || {};

  const store = {
    vConsoleRuleState: weDebug.createCache('__vConsoleRuleState__')
  };

  const vConsoleRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '开启 vConsole 调试工具',
        desc: 'vConsole 是微信官方推出的调试工具',
        type: 'switch',
        state: {
          disabled: false,
          checked: () => store.vConsoleRuleState.get()
        },
        handler: {
          bindChange(state) {
            if (!state.disabled) {
              store.vConsoleRuleState.set(state.checked);

              wx.setEnableDebug({
                enableDebug: state.checked
              });
            }
          }
        }
      },
      ruleOption
    )
  );

  weDebug.addFormRule([vConsoleRule]);
};

export default vConsolePlugin;
