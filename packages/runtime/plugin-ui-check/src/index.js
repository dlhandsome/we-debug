import { Debug, prefix, closeBadge } from './plugin';
import { MoveAreaHelper } from './utils';

let _timer;
let _pixelTimer;
let _y = 0;
let _maHelper;
// 滑块容器的头尾预留高度
const reservedDistance = 150;

Component({
  properties: {},
  data: {
    safeArea: null,
    url: '',
    moveArea: {
      // 滑块容器的头尾预留高度
      reservedDistance,
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    moveView: {
      y: _y,
      width: 0,
      height: 0,
      opacity: 0.3,
      direction: 'vertical'
    },
    operationBar: {
      visible: false,
      slider: {
        min: 0,
        max: 100,
        blockColor: 'rgba(255,255,255,0.09)',
        activeColor: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.25)'
      }
    }
  },
  methods: {
    badges({ show = false } = {}) {
      const badges = Debug.getBadge();
      badges
        .filter(badge => badge !== closeBadge)
        .forEach(badge => {
          badge.emit({ show });
        });
    },
    closeBadge({ show = false } = {}) {
      closeBadge.emit({ show });
    },
    getMaHelper() {
      if (!_maHelper) {
        _maHelper = new MoveAreaHelper(Debug);
      }
      return _maHelper;
    },
    initSafeArea() {
      const maHelper = this.getMaHelper();
      const { safeArea } = maHelper.systemInfo;

      this.setData({ safeArea });
    },
    initMoveArea() {
      const maHelper = this.getMaHelper();

      this.setData({
        // 滑块容器的头尾预留高度
        reservedDistance,
        top: maHelper.getTop(reservedDistance),
        left: maHelper.getLeft(),
        width: maHelper.getWidth(),
        height: maHelper.getHeight(reservedDistance)
      });
    },
    imgLoad(e) {
      const maHelper = this.getMaHelper();

      const { width, height } = e.detail;
      const safeAreaWidth = this.data.safeArea.width;
      const ratio = safeAreaWidth / width;
      const moveViewHeight = height * ratio;

      const deltaHeight = moveViewHeight - maHelper.systemInfo.windowHeight;
      const newReservedDistance = deltaHeight > reservedDistance ? deltaHeight : reservedDistance;

      this.setData({
        'moveView.width': safeAreaWidth,
        'moveView.height': moveViewHeight,
        'moveArea.top': maHelper.getTop(newReservedDistance),
        'moveArea.height': maHelper.getHeight(newReservedDistance)
      });
    },
    removeImg() {
      this.setData({ url: '' });
    },
    addImg(url) {
      this.setData({ url });
    },
    slideChanging(e) {
      const opacity = e.detail.value;
      this.setData({
        'moveView.opacity': opacity / 100
      });
      this.toggleOperationBar({ immediate: false });
    },
    showOperationBar() {
      this.setData({
        'operationBar.visible': true
      });
    },
    hideOperationBar() {
      this.setData({
        'operationBar.visible': false
      });
    },
    moveViewChange(e) {
      // 更新偏移量
      _y = e.detail.y;
    },
    toggleOperationBar({ immediate = true } = {}) {
      if (!this.data.operationBar.visible) {
        this.showOperationBar();
      } else {
        immediate && this.hideOperationBar();
      }
      clearTimeout(_timer);
      _timer = setTimeout(() => {
        this.hideOperationBar();
      }, 5000);
    },
    moveViewRising() {
      clearTimeout(_pixelTimer);
      this.setData({
        'moveView.y': --_y
      });
      this.toggleOperationBar({ immediate: false });
      // 60fps
      _pixelTimer = setTimeout(() => {
        this.moveViewRising();
      }, 16);
    },
    moveViewFalling() {
      clearTimeout(_pixelTimer);
      this.setData({
        'moveView.y': ++_y
      });
      this.toggleOperationBar({ immediate: false });
      // 60fps
      _pixelTimer = setTimeout(() => {
        this.moveViewFalling();
      }, 16);
    },
    increaseTouchstart() {
      this.moveViewRising();
    },
    increaseTouchend() {
      clearTimeout(_pixelTimer);
    },
    decreaseTouchstart() {
      this.moveViewFalling();
    },
    decreaseTouchend() {
      clearTimeout(_pixelTimer);
    },
    init(url) {
      this.initSafeArea();
      this.initMoveArea();
      this.addImg(url);
      this.badges({ show: false });
      this.closeBadge({ show: true });
      Debug.store.event.emit('debug:mask:hide-modal');
    },
    destory() {
      this.removeImg();
      this.badges({ show: true });
      this.closeBadge({ show: false });
    },
    addListeners() {
      Debug.store.event.on(prefix + 'init', this.init.bind(this));
      Debug.store.event.on(prefix + 'destory', this.destory.bind(this));
    },

    removeListeners() {
      Debug.store.event.off(prefix + 'init', this.init.bind(this));
      Debug.store.event.off(prefix + 'destory', this.destory.bind(this));
    }
  },
  attached() {
    this.addListeners();
  },
  detached() {
    this.removeListeners();
  }
});
