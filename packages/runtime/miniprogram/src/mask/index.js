import Debug from '@we-debug/core';

const store = Debug.store;

const animateDuration = 300;

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
    styles: {
      zIndex: 999991,
      customStyle: 'padding: 12px 24px 24px 24px;padding-bottom: constant(safe-area-inset-bottom);padding-bottom: env(safe-area-inset-bottom);'
    }
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
      this.setData({
        showMask: true
      });
    },
    closeMask() {
      setTimeout(() => {
        this.setData({
          showMask: false
        });
      }, animateDuration);
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
