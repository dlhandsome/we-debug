import {
  IAnyObject,
  IPlugin,
  IPluginInitOptions
} from './types';

const AppDataPlugin: IPlugin = {
  install () {}
};

// 获取当前页面实例
function getCurrentPage(): WechatMiniprogram.Page.Instance<any, any> | null {
  const pages = getCurrentPages();
  return pages.length > 0 ? pages[pages.length - 1] : null;
}

// 存储当前规则列表
let currentRule: any;

AppDataPlugin.install = function (weDebug, options:IPluginInitOptions) {
   // 调试面板弹出时，触发规则更新
   weDebug.event.on('debug:mask:show-modal', () => {
    const page = getCurrentPage();
    if (!page) return;
    const data = page.data || {};
    
    if (currentRule) {
      weDebug.removeJsonView(currentRule);
    }
    currentRule = weDebug.createJsonView({
      data,
      editable: options.editable ?? true,
      expandLevel: options.expandLevel ?? 1,
      handler: {
        bindChange(data: { changes: { field: string, value: IAnyObject }[] }) {
          const changeData: IAnyObject = {};
          data.changes.forEach((change) => {
            changeData[change.field] = change.value;
          });
          page.setData(changeData);
        }
      }
    });

    weDebug.addJsonView(currentRule, {
      group: {
        name: 'AppData',
      },
    });
  });
}

export default AppDataPlugin;
