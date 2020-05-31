import Debug from '../../libs/index';

const store = Debug.store;
const { isFunc } = Debug.util;

const prefix = 'debug:badge-';

Component({
  _touch: null,
  _position: null,
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },
  observers: {
    'config.position'(p) {
      if (p) {
        const storePosition = this.getStorePosition();

        const l = p.left;
        const t = p.top;
        const r = p.right;
        const b = p.bottom;

        let left = isFunc(l) ? l() : l;

        let top = isFunc(t) ? t() : t;

        let right = isFunc(r) ? r() : r;

        let bottom = isFunc(b) ? b() : b;

        if (storePosition) {
          ({ left, top, right, bottom } = storePosition);
        }

        this.setInitPosition(left, top, right, bottom);
        this.setPosition(left, top, right, bottom);
      } else {
        this.getPosition();
      }
    },
    'config.draggable'(v) {
      if (v) {
        this.setData({ draggable: true });
      }
    },
    'config.id'(v) {
      this.setData({ prefix: prefix + v });
    },
    'config.key'(v) {
      this.setData({ key: v });
    },
    'config.value'(v) {
      this.setData({ value: v });
    },
    'config.color'(v) {
      if (v) {
        this.setData({ color: v });
      }
    },
    'config.show'(v) {
      const show = isFunc(v) ? v() : v;

      this.setData({ show });
    },
    'config.handler'(v) {
      this.setData({ handler: v });
    }
  },
  data: {
    prefix,
    show: false,
    key: '',
    value: '',
    color: 'brightgreen',
    position: null,
    // 是否允许拖动
    draggable: false,
    handler: null
  },
  externalClasses: ['my-class'],
  methods: {
    emit(opt) {
      this.setData(opt);
    },
    setStorePosition(left, top, right, bottom) {
      const position = this.getStorePosition() || {};
      Object.assign(position, {
        left,
        top,
        right,
        bottom
      });
    },
    getStorePosition() {
      const id = this.properties.config.id;
      const badgeStore = store.badges.getById(id);

      if (!badgeStore) {
        console.warn('badge have to added into badge groups\n' + 'you could use "Debug.addBadge(yourBadge)" method');
      }

      return (badgeStore && badgeStore.position) || null;
    },
    setInitPosition(left, top, right, bottom) {
      this._position = {
        left,
        top,
        right,
        bottom
      };
    },
    getInitPosition() {
      return this._position;
    },
    setInitTouch(t) {
      this._touch = t;
    },
    getInitTouch() {
      return this._touch;
    },
    setPosition(left, top, right, bottom) {
      this.setData({
        position: {
          left,
          top,
          right,
          bottom
        }
      });
    },
    getPosition() {
      const sys = store.sys.get();
      const { screenWidth, screenHeight } = sys;

      wx.createSelectorQuery()
        .in(this)
        .select('.badges')
        .boundingClientRect(res => {
          if (!res) {
            // 组件隐藏时res为空
            return;
          }
          let { left, top, bottom, right } = res;
          bottom = screenHeight - bottom;
          right = screenWidth - right;

          this.setInitPosition(left, top, bottom, right);
          this.setPosition(left, top, bottom, right);
        })
        .exec();
    },
    bindTouchStartHandler(e) {
      const prefix = this.data.prefix;

      store.event.emit(prefix + ':touchstart', e);
    },
    bindTouchMoveHandler(e) {
      const prefix = this.data.prefix;

      store.event.emit(prefix + ':touchmove', e);
    },
    bindTouchEndHandler(e) {
      const prefix = this.data.prefix;

      store.event.emit(prefix + ':touchend', e);
    },
    bindTouchCancelHandler(e) {
      const prefix = this.data.prefix;

      store.event.emit(prefix + ':touchcancel', e);
    },
    bindTouchStart(e) {
      if (!this.data.draggable) {
        return;
      }

      this.setInitTouch(e.changedTouches[0]);
    },
    bindTouchMove(e) {
      if (!this.data.draggable) {
        return;
      }

      const touch = e.changedTouches[0];
      const { left, top, right, bottom } = this.getInitPosition();
      const firstTimeTouch = this.getInitTouch();

      const movedX = touch.clientX - firstTimeTouch.clientX;
      const movedY = touch.clientY - firstTimeTouch.clientY;

      const newLeft = Math.floor(left + movedX);
      const newTop = Math.floor(top + movedY);
      const newRight = Math.floor(right - movedX);
      const newBottom = Math.floor(bottom - movedY);

      this.setPosition(newLeft, newTop, newRight, newBottom);
      this.setStorePosition(newLeft, newTop, newRight, newBottom);
    },
    bindTouchEnd() {
      if (!this.data.draggable) {
        return;
      }

      const { left, top, right, bottom } = this.getStorePosition();
      this.setInitPosition(left, top, right, bottom);
    },
    bindTouchCancel() {
      this.bindTouchEnd();
    },
    bindTapHandler() {
      const handler = this.data.handler;

      if (handler && handler.bindTap && isFunc(handler.bindTap)) {
        handler.bindTap.call(this);
      }
    },
    addListeners() {
      const prefix = this.data.prefix;

      store.event.on(prefix + ':emit', this.emit.bind(this));
      store.event.on(prefix + ':touchstart', this.bindTouchStart.bind(this));
      store.event.on(prefix + ':touchmove', this.bindTouchMove.bind(this));
      store.event.on(prefix + ':touchend', this.bindTouchEnd.bind(this));
      store.event.on(prefix + ':touchcancel', this.bindTouchCancel.bind(this));
    },
    removeListeners() {
      const prefix = this.data.prefix;

      store.event.off(prefix + ':emit', this.emit.bind(this));
      store.event.off(prefix + ':touchstart', this.bindTouchStart.bind(this));
      store.event.off(prefix + ':touchmove', this.bindTouchMove.bind(this));
      store.event.off(prefix + ':touchend', this.bindTouchEnd.bind(this));
      store.event.off(prefix + ':touchcancel', this.bindTouchCancel.bind(this));
    }
  },
  attached() {
    this.addListeners();
  },
  detached() {
    this.removeListeners();
  }
});
