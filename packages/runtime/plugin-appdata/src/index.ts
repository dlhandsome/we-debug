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

function getJsonViewOption (page: WechatMiniprogram.Page.Instance<any, any> | null, options: IPluginInitOptions) {
  return {
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
  }
}

AppDataPlugin.install = function (weDebug, options: IPluginInitOptions) {
  // 调试面板弹出时，触发规则更新
  const jsonViewOptions = getJsonViewOption({}, options);
  let currentJsonView = weDebug.createJsonView(jsonViewOptions);
  weDebug.addJsonView(currentJsonView, APP_DATA_VIEW_CONFIG);

  weDebug.event.on('debug:mask:show-modal', () => {
    const page = getCurrentPage();
    if (!page) return;
    
    const newJsonViewOptions = getJsonViewOption(page, options);
    weDebug.updateJsonView(newJsonViewOptions, APP_DATA_VIEW_CONFIG);
  });
}

export default AppDataPlugin;
