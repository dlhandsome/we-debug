const RoutePlugin = {};
/**
 * 路由调试插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */
RoutePlugin.install = function (weDebug, options = {}) {
  if (RoutePlugin.installed) return;
  RoutePlugin.installed = true;

  const pathRule = options.pathRule || {};
  const queryRule = options.queryRule || {};

  const copyRouteRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '页面路由',
        desc: '复制当前页面路由到剪切板',
        type: 'button',
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              const pages = getCurrentPages(),
                route = pages[pages.length - 1].route;

              wx.setClipboardData({
                data: JSON.stringify(route, null, 2)
              });
            }
          }
        }
      },
      pathRule
    )
  );

  const copyPageOptionRule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: '页面参数',
        desc: '复制当前页面参数到剪切板',
        type: 'button',
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              const pages = getCurrentPages(),
                ops = pages[pages.length - 1].options;

              wx.setClipboardData({
                data: JSON.stringify(ops, null, 2)
              });
            }
          }
        }
      },
      queryRule
    )
  );

  weDebug.addFormRule([copyRouteRule, copyPageOptionRule]);
};

export default RoutePlugin;
