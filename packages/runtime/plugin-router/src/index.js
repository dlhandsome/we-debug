import { getCurrentPage, getRouteSearch } from './utils';

const RoutePlugin = {};
let routePath = '复制当前页面路径到剪切板';
let routeSearch = '复制当前页面参数到剪切板';

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
        title: '页面路径',
        desc: () => routePath,
        state: {
          name: '复制'
        },
        type: 'button',
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              const page = getCurrentPage();
              if (page) {
                wx.setClipboardData({
                  data: page.route
                });
              }
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
        desc: () => routeSearch,
        type: 'button',
        state: {
          name: '复制'
        },
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              const page = getCurrentPage();
              if (page) {
                wx.setClipboardData({
                  data: getRouteSearch(page.options)
                });
              }
            }
          }
        }
      },
      queryRule
    )
  );

  // 调试面板弹出时，触发页面路径/参数查询更新
  weDebug.event.on('debug:mask:show-modal', () => {
    const page = getCurrentPage();

    if (page) {
      routePath = page.route;
      routeSearch = getRouteSearch(page.options);

      copyRouteRule.emit({
        desc: routePath
      });

      copyPageOptionRule.emit({
        desc: routeSearch
      });
    }
  });

  weDebug.addFormRule([copyRouteRule, copyPageOptionRule], {
    group: '系统'
  });
};

export default RoutePlugin;
