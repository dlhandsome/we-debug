Component({
  properties: {
    data: {
      type: Array,
      value: []
    }
  },

  data: {
    searchText: '',
    showDrawer: false,
    selectedItem: null,
    filteredData: [],
    parsedData: [],
    dataSize: '0 KB'
  },

  observers: {
    data: function (data) {
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
    }
  },

  methods: {
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
      this.setData({
        searchText: '',
        filteredData: this.data.parsedData,
        dataSize: '0 B'
      });
    },

    handleRefresh() {
      // 重新解析数据
      const parsedData = this.data.data.map(item => {
        const key = Object.keys(item)[0];
        const value = item[key];

        let type = typeof value;
        if (Array.isArray(value)) {
          type = 'array';
        } else if (value === null) {
          type = 'null';
        } else if (type === 'object') {
          type = 'object';
        }

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
          highlight: true
        };
      });

      // 更新数据大小
      const dataSize = this.calculateDataSize(this.data.data);

      this.setData({
        parsedData,
        filteredData: parsedData,
        dataSize
      });

      // 3秒后移除高亮效果
      setTimeout(() => {
        const filteredData = this.data.filteredData.map(item => ({
          ...item,
          highlight: false
        }));
        this.setData({ filteredData });
      }, 3000);
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
    }
  }
});
