import {
  IAnyObject,
  IPlugin,
  IPluginInitOptions
} from './types';

const APP_DATA_VIEW_CONFIG = {
  group: {
    name: 'AppData'
  }
};

const AppDataPlugin: IPlugin = {
  install () {}
};

// 获取当前页面实例
function getCurrentPage(): WechatMiniprogram.Page.Instance<any, any> | null {
  const pages = getCurrentPages();
  return pages.length > 0 ? pages[pages.length - 1] : null;
}

function getJsonView (weDebug: IAnyObject, page: WechatMiniprogram.Page.Instance<any, any> | null, options: IPluginInitOptions) {
  return weDebug.createJsonView({
    data: page?.data || {},
    editable: options.editable ?? true,
    expandLevel: options.expandLevel ?? 1,
    handler: {
      bindChange(data: { changes: { field: string, value: IAnyObject }[] }) {
        const changeData: IAnyObject = {};
        data.changes.forEach((change) => {
          changeData[change.field] = change.value;
        });
        page?.setData(changeData);
      }
    }
  })
}

AppDataPlugin.install = function (weDebug, options: IPluginInitOptions) {
  // 调试面板弹出时，触发规则更新
  const currentJsonView = getJsonView(weDebug, {}, options);
  weDebug.addJsonView(currentJsonView, APP_DATA_VIEW_CONFIG);

  weDebug.event.on('debug:mask:show-modal', () => {
    const page = getCurrentPage();
    if (!page) return;

    const newJsonView = getJsonView(weDebug, page, options);
    
    weDebug.updateJsonView({
      ...newJsonView,
      id: currentJsonView.id
    }, APP_DATA_VIEW_CONFIG);
  });
}

export default AppDataPlugin;
