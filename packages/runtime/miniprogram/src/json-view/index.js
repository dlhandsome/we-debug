Component({
  properties: {
    jsonData: {
      type: null,
      value: null,
      observer: function (newVal) {
        if (newVal) {
          const formatted = this.formatJson(newVal);
          this.setData({ formattedData: formatted });
          if (this.data.expandLevel >= 0) {
            this.updateExpandLevel(this.data.expandLevel);
          }
        }
      }
    },
    editable: {
      type: Boolean,
      value: false
    },
    expandLevel: {
      type: Number,
      value: -1, // -1 表示全部展开，0 表示全部折叠，正数表示展开的层级数
      observer: function (newVal) {
        if (this.data.formattedData.length > 0) {
          this.updateExpandLevel(newVal);
        }
      }
    }
  },

  data: {
    formattedData: [],
    editingIndex: -1,
    editValue: '',
    editKey: '',
    editType: 0,
    typeOptions: ['string', 'number', 'boolean', 'null'],
    scrollLeft: 0,
    touchStartX: 0,
    lastScrollLeft: 0,
    isDragging: false
  },

  methods: {
    updateExpandLevel(level) {
      const { formattedData } = this.data;
      const stack = [];

      // 首先重置所有项的状态
      formattedData.forEach(item => {
        item.hidden = false;
        if (item.isOpening) {
          item.collapsed = level >= 0 && item.level >= level;
        }
      });

      // 处理隐藏状态
      for (let i = 0; i < formattedData.length; i++) {
        const item = formattedData[i];

        // 处理开始括号
        if (item.isOpening) {
          if (item.collapsed) {
            stack.push({ level: item.level, index: i });
          }
          // 如果超出展开层级，隐藏该项
          if (level >= 0 && item.level > level) {
            item.hidden = true;
          }
          continue;
        }

        // 处理结束括号
        if (item.isClosing) {
          if (stack.length > 0 && item.level === stack[stack.length - 1].level) {
            stack.pop();
          }
          // 如果超出展开层级，隐藏该项
          if (level >= 0 && item.level > level) {
            item.hidden = true;
          }
          continue;
        }

        // 处理普通值
        if (!item.isOpening && !item.isClosing) {
          // 如果在任何折叠块内，隐藏该项
          if (stack.length > 0) {
            item.hidden = true;
            continue;
          }

          // 如果超出展开层级，隐藏该项
          if (level >= 0 && item.level > level) {
            item.hidden = true;
          }
        }
      }

      this.setData({ formattedData });
    },

    handleTouchStart(e) {
      this.setData({
        touchStartX: e.touches[0].clientX,
        lastScrollLeft: this.data.scrollLeft,
        isDragging: true
      });
    },

    handleTouchMove(e) {
      if (!this.data.isDragging) return;

      const deltaX = this.data.touchStartX - e.touches[0].clientX;
      const newScrollLeft = this.data.lastScrollLeft + deltaX;

      this.setData({
        scrollLeft: Math.max(0, newScrollLeft)
      });
    },

    handleTouchEnd() {
      this.setData({
        isDragging: false
      });
    },

    formatJson(data, level = 0, path = []) {
      const result = [];

      if (typeof data !== 'object' || data === null) {
        return result;
      }

      const isArray = Array.isArray(data);
      const entries = isArray ? data.map((val, idx) => [idx, val]) : Object.entries(data);

      // 添加开始的括号
      result.push({
        key: null,
        value: null,
        level,
        isArray,
        isOpening: true,
        isClosing: false,
        hasChildren: entries.length > 0,
        path: [...path],
        collapsed: false
      });

      entries.forEach(([key, value], index) => {
        const valueType = typeof value;
        const valueIsObject = valueType === 'object' && value !== null;
        const currentPath = [...path, key];

        if (!valueIsObject) {
          // 处理基本类型值
          result.push({
            key: isArray ? null : key,
            value: String(value),
            rawValue: value,
            type: valueType,
            level: level + 1,
            isLast: index === entries.length - 1,
            isArray: false,
            isOpening: false,
            isClosing: false,
            hasChildren: false,
            path: currentPath,
            hidden: false
          });
        } else {
          // 递归处理对象或数组
          const children = this.formatJson(value, level + 1, currentPath);
          if (children.length > 0) {
            // 如果是对象的属性，添加键名
            if (!isArray) {
              children[0].key = key;
            }
            result.push(...children);
          }
        }
      });

      // 添加结束的括号
      result.push({
        key: null,
        value: null,
        level,
        isArray,
        isOpening: false,
        isClosing: true,
        isLast: true,
        path: [...path],
        hidden: false
      });

      return result;
    },

    toggleCollapse(e) {
      const { index } = e.currentTarget.dataset;
      const { formattedData } = this.data;
      const currentItem = formattedData[index];

      if (!currentItem.hasChildren) return;

      // 切换当前项的折叠状态
      currentItem.collapsed = !currentItem.collapsed;

      let level = currentItem.level;
      let i = index + 1;
      let bracketCount = 1;

      // 保存子对象的状态
      const childStates = new Map();
      if (!currentItem.collapsed) {
        // 展开时，先保存所有子对象的状态
        while (i < formattedData.length && bracketCount > 0) {
          const item = formattedData[i];
          if (item.level === level) {
            if (item.isOpening) bracketCount++;
            if (item.isClosing) bracketCount--;
          }
          if (item.isOpening) {
            childStates.set(i, {
              collapsed: true, // 默认设置子对象为折叠状态
              hidden: item.hidden
            });
          }
          i++;
        }
      }

      // 重置计数器和索引
      i = index + 1;
      bracketCount = 1;

      while (i < formattedData.length && bracketCount > 0) {
        const item = formattedData[i];

        // 更新括号计数
        if (item.level === level) {
          if (item.isOpening) bracketCount++;
          if (item.isClosing) bracketCount--;
        }

        if (currentItem.collapsed) {
          // 折叠时：隐藏所有子项
          if (bracketCount > 0) {
            item.hidden = true;
          }
        } else {
          // 展开时的处理逻辑
          if (item.level === level + 1) {
            // 显示直接子级
            item.hidden = false;
            // 如果是对象或数组的开始，设置为折叠状态
            if (item.isOpening) {
              item.collapsed = true;
            }
          } else if (item.level > level + 1) {
            // 更深层级的项保持隐藏
            item.hidden = true;
          }

          // 如果是子对象的开始括号，恢复其状态
          if (item.isOpening) {
            const savedState = childStates.get(i);
            if (savedState) {
              item.collapsed = savedState.collapsed;
              // 如果子对象是折叠的，确保其结束括号可见
              if (item.collapsed) {
                let subLevel = item.level;
                let j = i + 1;
                let subBracketCount = 1;

                while (j < formattedData.length && subBracketCount > 0) {
                  const subItem = formattedData[j];
                  if (subItem.level === subLevel) {
                    if (subItem.isOpening) subBracketCount++;
                    if (subItem.isClosing) {
                      subBracketCount--;
                      // 确保结束括号可见
                      if (subBracketCount === 0) {
                        subItem.hidden = false;
                      }
                    }
                  }
                  // 折叠块内的其他项都隐藏
                  if (subBracketCount > 0) {
                    subItem.hidden = true;
                  }
                  j++;
                }
              }
            }
          }
        }

        i++;
      }

      // 确保当前对象的结束括号可见
      if (i < formattedData.length) {
        formattedData[i - 1].hidden = false;
      }

      this.setData({ formattedData });
    },

    startEdit(e) {
      if (!this.data.editable) return;

      const { index } = e.currentTarget.dataset;
      const item = this.data.formattedData[index];

      if (item.isOpening || item.isClosing) return;

      // 设置编辑类型
      let editType = 0; // 默认为字符串类型
      if (item.type === 'number') editType = 1;
      else if (item.type === 'boolean') editType = 2;
      else if (item.value === 'null') editType = 3;

      this.setData({
        editingIndex: index,
        editValue: item.rawValue !== undefined ? String(item.rawValue) : item.value,
        editKey: item.key || '',
        editType
      });
    },

    handleTypeChange(e) {
      const type = parseInt(e.detail.value);
      let value = this.data.editValue;

      // 根据选择的类型转换值的显示
      switch (type) {
        case 0: // string
          // 如果之前是布尔值，保持 "true" 或 "false"
          if (this.data.editType === 2) {
            value = value.toLowerCase();
          } else {
            value = String(value);
          }
          break;
        case 1: // number
          value = isNaN(Number(value)) ? '0' : String(Number(value));
          break;
        case 2: // boolean
          value = value === 'true' || value === '1' || value === 'yes' ? 'true' : 'false';
          break;
        case 3: // null
          value = 'null';
          break;
      }

      this.setData({
        editType: type,
        editValue: value
      });
    },

    handleKeyEdit(e) {
      this.setData({
        editKey: e.detail.value
      });
    },

    handleValueEdit(e) {
      this.setData({
        editValue: e.detail.value
      });
    },

    getFirstLevelPath(path) {
      return path[0];
    },

    collectChangedData(data, changedPaths) {
      const changes = {};
      const firstLevelChanges = new Set();

      // 收集所有变更的一级字段
      changedPaths.forEach(path => {
        const firstLevel = this.getFirstLevelPath(path);
        if (firstLevel !== undefined) {
          firstLevelChanges.add(firstLevel);
        }
      });

      // 获取变更字段的完整数据
      firstLevelChanges.forEach(field => {
        changes[field] = data[field];
      });

      return Object.entries(changes).map(([key, value]) => ({
        field: key,
        value: value
      }));
    },

    // 添加新方法：保存折叠状态
    saveCollapseState(formattedData) {
      const collapseState = new Map();

      formattedData.forEach((item, index) => {
        // 为每个项保存完整状态
        const pathKey = item.path.join('.');
        collapseState.set(pathKey + '_' + index, {
          collapsed: item.collapsed,
          hidden: item.hidden,
          level: item.level,
          isOpening: item.isOpening,
          isClosing: item.isClosing
        });
      });

      return collapseState;
    },

    // 添加新方法：恢复折叠状态
    restoreCollapseState(formattedData, collapseState) {
      formattedData.forEach((item, index) => {
        const pathKey = item.path.join('.');
        const savedState = collapseState.get(pathKey + '_' + index);

        if (savedState) {
          item.collapsed = savedState.collapsed;
          item.hidden = savedState.hidden;
        }
      });

      return formattedData;
    },

    saveEdit() {
      const { editingIndex, editValue, editKey, editType, formattedData } = this.data;
      if (editingIndex === -1) return;

      const item = formattedData[editingIndex];
      let newValue = editValue;

      // 保存当前的折叠状态
      const collapseState = this.saveCollapseState(formattedData);

      // 根据选择的类型转换值
      switch (editType) {
        case 1: // number
          newValue = Number(editValue);
          break;
        case 2: // boolean
          newValue = editValue.toLowerCase() === 'true';
          break;
        case 3: // null
          newValue = null;
          break;
        default: // string
          newValue = editValue;
      }

      // 更新数据
      const updatedData = this.updateJsonByPath(this.data.jsonData, item.path, newValue, editKey);

      // 收集变更数据
      const changedData = this.collectChangedData(updatedData, [item.path]);

      // 格式化新数据并恢复折叠状态
      const newFormattedData = this.formatJson(updatedData);
      const restoredData = this.restoreCollapseState(newFormattedData, collapseState);

      // 通知父组件数据已更新
      this.triggerEvent('change', {
        value: updatedData,
        changes: changedData
      });

      // 更新显示
      this.setData({
        editingIndex: -1,
        formattedData: restoredData
      });
    },

    cancelEdit() {
      this.setData({
        editingIndex: -1
      });
    },

    updateJsonByPath(data, path, value, newKey) {
      const result = JSON.parse(JSON.stringify(data));
      let current = result;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      const lastKey = path[path.length - 1];
      if (newKey && newKey !== lastKey) {
        // 如果键名改变了
        delete current[lastKey];
        current[newKey] = value;
      } else {
        current[lastKey] = value;
      }

      return result;
    },

    addItem(e) {
      const { index } = e.currentTarget.dataset;
      const item = this.data.formattedData[index];

      if (!item.isOpening) return;

      // 保存当前的折叠状态，使用不包含索引的路径作为key
      const collapseState = new Map();
      this.data.formattedData.forEach(item => {
        if (item.isOpening) {
          const pathKey = item.path.join('.');
          collapseState.set(pathKey, {
            collapsed: item.collapsed,
            hidden: item.hidden,
            level: item.level
          });
        }
      });

      const newData = JSON.parse(JSON.stringify(this.data.jsonData));
      let current = newData;

      // 定位到当前对象
      for (const key of item.path) {
        current = current[key];
      }

      // 添加新项
      const newKey = item.isArray ? current.length : 'newKey';
      if (item.isArray) {
        current.push(null);
      } else {
        current['newKey'] = null;
      }

      // 收集变更数据
      const changedData = this.collectChangedData(newData, [item.path]);

      // 格式化新数据
      const newFormattedData = this.formatJson(newData);

      // 恢复折叠状态
      newFormattedData.forEach(newItem => {
        if (newItem.isOpening) {
          const pathKey = newItem.path.join('.');
          const savedState = collapseState.get(pathKey);

          if (savedState) {
            // 恢复保存的状态
            newItem.collapsed = savedState.collapsed;

            // 如果是折叠状态，处理子项的隐藏状态
            if (newItem.collapsed) {
              let level = newItem.level;
              let i = newFormattedData.indexOf(newItem) + 1;
              let bracketCount = 1;

              while (i < newFormattedData.length && bracketCount > 0) {
                const child = newFormattedData[i];

                // 更新括号计数
                if (child.level === level) {
                  if (child.isOpening) bracketCount++;
                  if (child.isClosing) bracketCount--;
                }

                // 在折叠块内的项都要隐藏
                if (bracketCount > 0) {
                  child.hidden = true;
                }

                i++;
              }
            }
          }
        }
      });

      // 确保新项的父节点是展开的，并且新项可见
      const parentPath = item.path.join('.');
      newFormattedData.forEach((newItem, idx) => {
        if (newItem.isOpening && newItem.path.join('.') === parentPath) {
          newItem.collapsed = false;

          // 确保直接子项可见
          let i = idx + 1;
          let level = newItem.level;
          let bracketCount = 1;

          while (i < newFormattedData.length && bracketCount > 0) {
            const child = newFormattedData[i];

            // 更新括号计数
            if (child.level === level) {
              if (child.isOpening) bracketCount++;
              if (child.isClosing) bracketCount--;
            }

            // 显示直接子级
            if (child.level === level + 1) {
              child.hidden = false;
            }

            i++;
          }
        }
      });

      // 找到新添加的项并添加高亮
      const newItemPath = [...item.path, newKey];
      newFormattedData.forEach(item => {
        if (!item.isOpening && !item.isClosing && JSON.stringify(item.path) === JSON.stringify(newItemPath)) {
          item.highlight = true;
          // 3秒后取消高亮
          setTimeout(() => {
            item.highlight = false;
            this.setData({ formattedData: this.data.formattedData });
          }, 3000);
        }
      });

      // 通知更新
      this.triggerEvent('change', {
        value: newData,
        changes: changedData
      });

      this.setData({
        formattedData: newFormattedData
      });
    },

    deleteItem(e) {
      const { index } = e.currentTarget.dataset;
      const item = this.data.formattedData[index];

      if (item.isOpening || item.isClosing) return;

      // 保存当前的折叠状态
      const collapseState = this.saveCollapseState(this.data.formattedData);

      const newData = JSON.parse(JSON.stringify(this.data.jsonData));
      let current = newData;

      // 定位到父对象
      for (let i = 0; i < item.path.length - 1; i++) {
        current = current[item.path[i]];
      }

      const lastKey = item.path[item.path.length - 1];
      if (Array.isArray(current)) {
        current.splice(lastKey, 1);
      } else {
        delete current[lastKey];
      }

      // 收集变更数据
      const changedData = this.collectChangedData(newData, [item.path]);

      // 格式化新数据并恢复折叠状态
      const newFormattedData = this.formatJson(newData);
      const restoredData = this.restoreCollapseState(newFormattedData, collapseState);

      // 通知更新
      this.triggerEvent('change', {
        value: newData,
        changes: changedData
      });

      this.setData({
        formattedData: restoredData
      });
    }
  }
});
