import {
  IAnyObject,
  IPlugin,
} from './types';


const AppDataPlugin: IPlugin = {
  install () {}
};

// 配置常量
const CONFIG = {
  GROUP_NAME: 'Storage',
  TOAST_MESSAGES: {
    CLEAR_SUCCESS: '清除成功',
    REFRESH_SUCCESS: '刷新成功'
  }
} as const;

// 存储视图配置
const STORAGE_VIEW_CONFIG = {
  group: {
    name: CONFIG.GROUP_NAME
  }
};

// 类型定义
interface StorageItem {
  [key: string]: any;
}

interface TableViewHandler {
  bindClear: () => void;
  bindRefresh: () => void;
}

/**
 * 获取本地存储数据
 * @returns StorageItem[] 存储数据数组
 */
function getStorageItems(): StorageItem[] {
  try {
    const { keys } = wx.getStorageInfoSync();
    return [
      ...keys.map((key) => ({
        [key]: wx.getStorageSync(key)
      }))
    ];
  } catch (error) {
    console.error('Failed to get storage items:', error);
    return [];
  }
}

/**
 * 创建表格视图处理器
 * @param refreshCallback 刷新回调函数
 * @returns TableViewHandler
 */
function createTableViewHandler(refreshCallback: () => void): TableViewHandler {
  return {
    async bindClear() {
      try {
        wx.clearStorageSync();
        refreshCallback();
        wx.showToast({ 
          title: CONFIG.TOAST_MESSAGES.CLEAR_SUCCESS, 
          icon: 'none' 
        });
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    },
    async bindRefresh() {
      try {
        refreshCallback();
        wx.showToast({ 
          title: CONFIG.TOAST_MESSAGES.REFRESH_SUCCESS, 
          icon: 'none' 
        });
      } catch (error) {
        console.error('Failed to refresh storage view:', error);
      }
    }
  };
}

/**
 * 创建表格视图
 * @param weDebug WeDebug实例
 * @param storageItems 存储数据
 * @returns 表格视图实例
 */
function createTableView(weDebug: IAnyObject, storageItems: StorageItem[]) {
  return weDebug.createTableView({
    data: storageItems,
    handler: createTableViewHandler(() => refreshTableView(weDebug))
  });
}

// 存储当前表格视图实例
let currentTableView: any = null;

/**
 * 刷新表格视图
 */
function refreshTableView(weDebug: IAnyObject) {
  if (!currentTableView) return;

  const storageItems = getStorageItems();
  const newTableView = createTableView(weDebug, storageItems);
  
  weDebug.updateTableView({
    ...newTableView,
    id: currentTableView.id
  }, STORAGE_VIEW_CONFIG);
}

/**
 * 初始化存储调试功能
 */
function initStorageDebug(weDebug: IAnyObject) {
  const storageItems = getStorageItems();
  currentTableView = createTableView(weDebug, storageItems);
  
  weDebug.addTableView(currentTableView, STORAGE_VIEW_CONFIG);
}

// 注册调试插件

AppDataPlugin.install = function (weDebug) {
  initStorageDebug(weDebug);

  // 监听调试面板显示事件
  weDebug.event.on('debug:mask:show-modal', () => {
    refreshTableView(weDebug);
  });
}

export default AppDataPlugin;
