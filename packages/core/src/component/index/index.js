import Debug from '../../libs/index'

const store = Debug.store

const debugBadge = Debug.createBadge({
  key: 'debug',
  value: '调试胶囊',
  show: true,
  draggable: true,
  position: {
    right: 10,
    bottom: 20
  },
  handler: {
    bindTap () {
      store.event.emit('debug:mask:show-modal')
    }
  }
})

Debug.addBadge(debugBadge)

Component({
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },
  observers: {
    'config.rules'(v) {
      if (v) {
        this.setData({ rules: v })
      }
    },
    'config.badges'(v) {
      if (v) {
        this.setData({ badges: v })
      }
    }
  },
  data: {
    sys: store.sys.get(),
    rules: store.rules.get(),
    badges: store.badges.get(),
    debugBadge,
  }
})
