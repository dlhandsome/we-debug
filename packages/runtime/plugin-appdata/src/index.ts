import {
  showToast,
  showModal,
  showActionSheet,
  setClipboardData } from './utils';
import {
  IPlugin,
  IPluginInitOptions,
  ActionHandlers
} from './types';

const AppDataPlugin: IPlugin = {
  install () {}
};

// 定义操作类型
enum ActionType {
  COPY = '复制',
  EDIT = '编辑',
  CLEAR = '清空',
}

// 获取当前页面实例
function getCurrentPage(): WechatMiniprogram.Page.Instance<any, any> | null {
  const pages = getCurrentPages();
  return pages.length > 0 ? pages[pages.length - 1] : null;
}

// 处理数据操作的动作映射
const actionHandlers: ActionHandlers = {
  [ActionType.COPY]: async (data) => {
    try {
      await setClipboardData(data.value);
      await showToast({ title: '复制成功', icon: 'none' });
    } catch (error) {
      console.error('Copy failed:', error);
    }
    return false;
  },
  [ActionType.EDIT]: async ({ page, key }) => {
    try {
      const res = await showModal({
        title: '编辑',
        editable: true,
        placeholderText: '请输入新的值',
        confirmText: '确定',
        cancelText: '取消',
      });

      if (res.confirm && res.content) {
        const newValue = typeof page.data[key] === 'number'
          ? Number(res.content)
          : res.content;

        await page.setData({ [key]: newValue });
        return true; // 表示数据已更新
      }
    } catch (error) {
      console.error('Edit failed:', error);
    }
    return false;
  },
  [ActionType.CLEAR]: async ({ page, key }) => {
    try {
      await page.setData({ [key]: undefined });
      return true; // 表示数据已更新
    } catch (error) {
      console.error('Clear failed:', error);
      return false;
    }
  },
};

// 获取可用的操作列表
function getAvailableActions(value: any): ActionType[] {
  return typeof value === 'string' || typeof value === 'number'
    ? [ActionType.COPY, ActionType.EDIT, ActionType.CLEAR]
    : [ActionType.COPY, ActionType.CLEAR];
}

// 创建调试规则
function createDebugRule(weDebug: any, key: string, value: any, page: WechatMiniprogram.Page.Instance<any, any>) {
  const itemList = getAvailableActions(value);
  const stringValue = JSON.stringify(value);

  return weDebug.createFormRule({
    title: key || '',
    desc: stringValue,
    state: { name: '操作' },
    handler: {
      bindTap: async () => {
        try {
          const res = await showActionSheet({
            itemList,
            alertText: '缓存操作',
          });

          const actionType = itemList[res.tapIndex] as ActionType;
          const handler = actionHandlers[actionType];
          
          if (handler) {
            const needsRefresh = await handler({
              page,
              key,
              value: stringValue
            });
            if (needsRefresh) {
              refreshRules(weDebug);
            }
          }
        } catch (error) {
          console.error('Action failed:', error);
        }
      },
    },
  });
}

// 获取当前页面的所有调试规则
function getCurrentRules(weDebug: any): any[] {
  const page = getCurrentPage();
  if (!page) return [];

  const data = page.data || {};
  return Object.keys(data).map(key => 
    createDebugRule(weDebug, key, data[key], page)
  );
}

// 存储当前规则列表
let currentRules: any[] = [];

// 刷新调试规则
function refreshRules(weDebug: any): void {
  // 移除旧规则
  currentRules.forEach(rule => {
    weDebug.removeGroupRule('AppData', rule);
  });

  // 添加新规则
  currentRules = getCurrentRules(weDebug);
  weDebug.addFormRule(currentRules, {
    group: {
      name: 'AppData',
      private: true,
    },
  });
}

AppDataPlugin.install = function (weDebug, options:IPluginInitOptions) {
  if (!Array.isArray(options)) options = [options];
  
   // 调试面板弹出时，触发规则更新
   weDebug.event.on('debug:mask:show-modal', () => {
    refreshRules(weDebug);
  });
}

export default AppDataPlugin;
