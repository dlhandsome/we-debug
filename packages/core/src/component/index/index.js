import Debug from '../../libs/index';

const store = Debug.store;

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
        this.setData({ rules: v });
      }
    },
    'config.badges'(v) {
      if (v) {
        this.setData({ badges: v });
      }
    }
  },
  data: {
    sys: store.sys.get(),
    rules: store.rules.get(),
    badges: store.badges.get()
  }
});
