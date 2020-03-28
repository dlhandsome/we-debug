const RoutePlugin = {}
/**
 * 路由调试插件
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */
RoutePlugin.install = function (weDebug, options = {}) {

  const pathRule = options.pathRule || {}
  const queryRule = options.queryRule || {}
  
  const copyRouteRule = Debug.createFormRule(Object.assign({}, {
    title: '页面路由',
    desc: '复制当前页面路由到剪切板',
    type: 'button',
    handler: {
      bindTap(state) {
        const pages = getCurrentPages(),
          route = pages[pages.length - 1].route
  
        wx.setClipboardData({
          data: JSON.stringify(route),
        })
      }
    },
  }, pathRule))
  
  const copyPageOptionRule = Debug.createFormRule(Object.assign({}, {
    title: '页面参数',
    desc: '复制当前页面参数到剪切板',
    type: 'button',
    handler: {
      bindTap(state) {
        const pages = getCurrentPages(),
          ops = pages[pages.length - 1].options
      
        wx.setClipboardData({
          data: JSON.stringify(ops),
        })
      }
    },
  }, queryRule))

  weDebug.addFormRule([
    copyRouteRule,
    copyPageOptionRule
  ])
}

export default RoutePlugin
