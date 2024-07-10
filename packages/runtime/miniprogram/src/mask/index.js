import Debug from '@we-debug/core';

const store = Debug.store;

const animateDuration = 300;
const animateClassName = {
  fadeIn: 'fadeIn',
  fadeOut: 'fadeOut',
  slideInUp: 'slideInUp',
  slideOutDown: 'slideOutDown'
};

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    show(v) {
      v ? this.showMaskHandler() : this.closeMaskHandler();
    }
  },
  data: {
    // 是否展示浮层
    showMask: false,
    // 动画类
    animateClassName: {
      mask: animateClassName.fadeIn,
      modal: animateClassName.slideInUp
    },
    styles: {
      zIndex: 999991,
      customStyle:
        'padding: 12px 24px 24px 24px;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);'
    },
    // eslint-disable-next-line no-undef
    useCustomMask: __wxConfig.tabBar && __wxConfig.tabBar.custom
  },
  externalClasses: ['my-class'],
  methods: {
    noop() {},
    showMaskHandler() {
      store.event.emit('debug:mask:show-modal');
    },
    closeMaskHandler() {
      store.event.emit('debug:mask:hide-modal');
    },
    showMask() {
      if (!this.isComponentInCurrentPage()) {
        return;
      }
      this.setData({
        showMask: true
      });
    },
    closeMask() {
      if (!this.isComponentInCurrentPage()) {
        return;
      }
      setTimeout(() => {
        this.setData({
          showMask: false
        });
      }, animateDuration);
    },
    /** 当前组件是否在当前页面中 */
    isComponentInCurrentPage() {
      const currentPageUniqueId = this.getPageUniqueId(this.getCurrentPage());
      let parent = this.selectOwnerComponent();
      while (parent) {
        if (currentPageUniqueId === this.getPageUniqueId(parent)) {
          return true;
        }
        parent = parent && parent.selectOwnerComponent();
      }
      return false;
    },
    /** 获取当前页面实例 */
    getCurrentPage() {
      // 不支持getCurrentPages的，直接忽略上报
      if (typeof getCurrentPages !== 'function') {
        return null;
      }

      const pages = getCurrentPages();
      if (pages.length === 0) {
        return null;
      }

      return pages[pages.length - 1];
    },
    /** 获取当前页面的uniqueId */
    getPageUniqueId(page) {
      const defaultValue = '';

      const getPageUniqueId = page => {
        if (!page) {
          return defaultValue;
        }
        if (typeof page.getPageId === 'function') {
          return page.getPageId();
        }
        return page.__wxExparserNodeId__ || page.__wxWebviewId__ || page.route || page.__route__ || defaultValue;
      };
      // 如果传入page，则以page为准，如果未传入，则以当前页面为准
      const uniqueId = getPageUniqueId(page);
      if (uniqueId) {
        return uniqueId;
      }

      // 不支持getCurrentPages的，返回默认值
      if (typeof getCurrentPages !== 'function') {
        return defaultValue;
      }

      const pages = getCurrentPages();
      if (pages.length === 0) {
        return defaultValue;
      }

      return getPageUniqueId(pages[pages.length - 1]);
    },
    addListeners() {
      store.event.on('debug:mask:show-modal', this.showMask.bind(this));
      store.event.on('debug:mask:hide-modal', this.closeMask.bind(this));
    },
    removeListeners() {
      store.event.off('debug:mask:show-modal', this.showMask.bind(this));
      store.event.off('debug:mask:hide-modal', this.showMask.bind(this));
    }
  },
  attached() {
    this.addListeners();
  },
  detached() {
    this.removeListeners();
  }
});
