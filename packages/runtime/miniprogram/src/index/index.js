import Debug from '@we-debug/core';

const store = Debug.store;
const sys = store.sys.get();
const currentGroupCache = Debug.createCache('__wedebug_miniprogram_group_actived_key__', '');
const DEFAULT_GROUP = Debug.DEFAULT_GROUP;

Component({
  options: {
    multipleSlots: true
  },
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
    },
    'config.modal'(v) {
      if (v) {
        this.setData({ modal: v });
      }
    },
    'config.group'(v) {
      if (Array.isArray(v.keys)) {
        this.setData({ 'group.keys': v.keys });
      }
      if (v.actived) {
        this.setData({ 'group.actived': v.actived });
      }
    }
  },
  data: {
    sys: store.sys.get(),
    rules: store.rules.get(),
    badges: store.badges.get(),
    modal: {
      logo: '../icon/logo.png',
      scrollHeight: ((sys.screenHeight * 3) / 5) * (750 / sys.screenWidth)
    },
    searchStr: '',
    group: {
      keys: store.group.getKeys(),
      actived: currentGroupCache.get() || DEFAULT_GROUP
    }
  },
  methods: {
    setSys() {
      this.setData({ sys: store.sys.get() });
    },
    setRules() {
      this.setData({ rules: store.group.get(currentGroupCache.get() || DEFAULT_GROUP).get() });
    },
    setBadges() {
      this.setData({ badges: store.badges.get() });
    },
    setSearch(searchStr) {
      this.setData({
        searchStr
      });
    },
    setfilterRule(searchStr) {
      const rules = store.rules.get();
      const filterRules = rules.filter(i => i.title.indexOf(searchStr) > -1);

      this.setData({
        rules: filterRules
      });
    },
    searchInputHandler(e) {
      const searchStr = e.detail.value;

      this.setSearch(searchStr);
      this.setfilterRule(searchStr);
    },
    searchCleanHandler() {
      this.setSearch('');
      this.setRules();
    },
    groupTapHandler(e) {
      const group = e.currentTarget.dataset.item;
      const rules = store.group.get(group).get();

      this.setData({
        'group.actived': group,
        rules
      });
      // 设置当前分组 key 缓存
      currentGroupCache.set(group);
    }
  },
  lifetimes: {
    attached() {
      this.setSys();
      this.setRules();
      this.setBadges();
    }
  }
});
