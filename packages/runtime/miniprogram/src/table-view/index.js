import Debug from '@we-debug/core';

const store = Debug.store;
const { isFunc } = Debug.util;

const prefix = 'debug:tableview-';

Component({
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },

  data: {
    prefix,
    searchText: '',
    showDrawer: false,
    selectedItem: null,
    filteredData: [],
    parsedData: [],
    dataSize: '0 KB'
  },

  observers: {
    'config.data': function (data) {
      this.onDataChange(data);
    }
  },

  methods: {
    onDataChange(data) {
      if (!Array.isArray(data)) {
        console.error('TableView: data must be an array');
        return;
      }

      // 计算数据大小
      const dataSize = this.calculateDataSize(data);
      this.setData({ dataSize });

      // 解析数据源中的每个对象
      const parsedData = data
        .map(item => {
          if (typeof item !== 'object' || item === null) {
            console.warn('TableView: invalid item in data array:', item);
            return null;
          }

          // 获取对象的第一个属性
          const key = Object.keys(item)[0];
          const value = item[key];

          // 确定值的类型
          let type = typeof value;
          if (Array.isArray(value)) {
            type = 'array';
          } else if (value === null) {
            type = 'null';
          } else if (type === 'object') {
            type = 'object';
          }

          // 序列化对象和数组类型的值
          let serializedValue = value;
          if (type === 'object' || type === 'array') {
            try {
              serializedValue = JSON.stringify(value, null, 2);
            } catch (e) {
              console.error('TableView: failed to serialize value:', e);
              serializedValue = String(value);
            }
          }

          return {
            key,
            value,
            type,
            serializedValue,
            highlight: false
          };
        })
        .filter(item => item !== null);

      this.setData({
        parsedData,
        filteredData: parsedData
      });
    },
    calculateDataSize(data) {
      try {
        const jsonString = JSON.stringify(data);
        const bytes = new TextEncoder().encode(jsonString).length;

        if (bytes < 1024) {
          return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
          return `${(bytes / 1024).toFixed(1)} KB`;
        } else {
          return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
      } catch (e) {
        console.error('TableView: failed to calculate data size:', e);
        return '0 B';
      }
    },

    handleSearch(e) {
      const searchText = e.detail.value.toLowerCase();
      this.setData({ searchText });

      const filteredData = this.data.parsedData.filter(item => {
        const keyMatch = item.key.toLowerCase().includes(searchText);
        const valueMatch = String(item.value).toLowerCase().includes(searchText);
        return keyMatch || valueMatch;
      });

      this.setData({ filteredData });
    },

    handleClear() {
      this.bindClearHandler();
      this.triggerEvent('clear');
    },

    handleRefresh() {
      this.bindRefreshHandler();
      this.triggerEvent('refresh');
    },

    handleValueClick(e) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        selectedItem: item,
        showDrawer: true
      });
    },

    handleCloseDrawer() {
      this.setData({
        showDrawer: false,
        selectedItem: null
      });
    },

    handleCopyValue() {
      const { selectedItem } = this.data;
      if (!selectedItem) return;

      // 获取要复制的值
      const valueToCopy =
        selectedItem.type === 'object' || selectedItem.type === 'array'
          ? selectedItem.serializedValue
          : String(selectedItem.value);

      // 复制到剪贴板
      wx.setClipboardData({
        data: valueToCopy,
        success: () => {
          wx.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          });
        },
        fail: err => {
          console.error('TableView: failed to copy value:', err);
          wx.showToast({
            title: '复制失败',
            icon: 'error',
            duration: 1500
          });
        }
      });
    },
    addListeners() {
      const prefix = this.data.prefix;
      store.event.on(prefix + ':emit', this.emit.bind(this));
    },
    removeListeners() {
      const prefix = this.data.prefix;
      store.event.off(prefix + ':emit', this.emit.bind(this));
    },
    emit(opt) {
      if (opt.data) {
        this.onDataChange(opt.data);
      }
    },
    bindClearHandler() {
      const handler = this.properties.config.handler;

      if (handler && handler.bindClear && isFunc(handler.bindClear)) {
        handler.bindClear.call(this);
      }
    },
    bindRefreshHandler() {
      const handler = this.properties.config.handler;

      if (handler && handler.bindRefresh && isFunc(handler.bindRefresh)) {
        handler.bindRefresh.call(this);
      }
    }
  },
  attached() {
    this.addListeners();
  },
  detached() {
    this.removeListeners();
  }
});
