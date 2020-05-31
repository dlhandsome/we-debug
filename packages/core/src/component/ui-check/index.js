import Debug from '../../libs/index';
import { prefix, _closeBadge } from './plugin'

let _timer
let _pixelTimer
let _y = 0
// 屏幕安全区域
const safeArea = wx.getSystemInfoSync().safeArea
// 滑块容器的头尾预留高度
const reservedDistance = 150

Component({
  properties: {
    myProperty:{
      type:String,
      value:'',
      observer: function(){}
    },

  },
  data: {
    safeArea,
    url: '',
    moveArea: {
      // 滑块容器的头尾预留高度
      reservedDistance,
      top: -(safeArea.top + reservedDistance),
      left: safeArea.left,
      width: safeArea.width,
      height: safeArea.height + safeArea.top + reservedDistance * 2
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
    otherBadgesHandler ({ show = false } = {}) {
      const badges = Debug.getBadge()
      badges.forEach(badge => {
        badge.emit({
          show
        })
      })
    },
    imgLoad (e) {
      const { width, height } = e.detail
      const safeAreaWidth = this.data.safeArea.width
      const ratio = safeAreaWidth / width
      const moveViewHeight = height * ratio

      this.setData({
        'moveView.width': safeAreaWidth,
        'moveView.height': moveViewHeight
      })
    },
    slideChanging (e) {
      const opacity = e.detail.value
      this.setData({
        'moveView.opacity': opacity / 100
      })
      this.toggleOperationBar({ immediate: false })
    },
    showOperationBar () {
      this.setData({
        'operationBar.visible': true
      })
    },
    hideOperationBar () {
      this.setData({
        'operationBar.visible': false
      })
    },
    moveViewChange (e) {
      // 更新偏移量
      _y = e.detail.y
    },
    toggleOperationBar ({ immediate = true } = {}) {
      if (!this.data.operationBar.visible) {
        this.showOperationBar()
      } else {
        immediate && this.hideOperationBar()
      }
      clearTimeout(_timer)
      _timer = setTimeout(() => {
        this.hideOperationBar()
      }, 5000)
    },
    moveViewRising () {
      clearTimeout(_pixelTimer)
      this.setData({
        'moveView.y': --_y
      })
      this.toggleOperationBar({ immediate: false })
      // 60fps
      _pixelTimer = setTimeout(() => {
        this.moveViewRising()
      }, 16)
    },
    moveViewFalling () {
      clearTimeout(_pixelTimer)
      this.setData({
        'moveView.y': ++_y
      })
      this.toggleOperationBar({ immediate: false })
      // 60fps
      _pixelTimer = setTimeout(() => {
        this.moveViewFalling()
      }, 16)
    },
    increaseTouchstart () {
      this.moveViewRising()
    },
    increaseTouchend () {
      clearTimeout(_pixelTimer)
    },
    decreaseTouchstart () {
      this.moveViewFalling()
    },
    decreaseTouchend () {
      clearTimeout(_pixelTimer)
    }
  },
  ready (){
    const event = Debug.store.event
    event.on(prefix + 'upload:done', (url) => {
      this.setData({
        url
      })
      event.emit('debug:mask:hide-modal')
      this.otherBadgesHandler({ show: false })
      
      _closeBadge.emit({
        show: true,
        handler: {
          bindTap: () => {
            this.setData({ url: '' })
            this.otherBadgesHandler({ show: true })
            _closeBadge.emit({ show: false })
          }
        }
      })
    })
  },
});