import Debug from '@we-debug/core';
import { LOGO_BASE64 } from './logo';

const store = Debug.store;
const sys = store.sys.get();
const currentGroupCache = Debug.createCache('__wedebug_miniprogram_group_actived_key__', '');
const DEFAULT_GROUP = Debug.DEFAULT_GROUP;

const setGroup = () =>
  store.group.getKeys((next, prev) => {
    if (prev === '全部') {
      return 1;
    }
    if (next === '全部') {
      return -1;
    }
    if (prev === '未分类') {
      return -1;
    }
    if (next === '未分类') {
      return 1;
    }
  });

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
    jsonviews: store.jsonviews.get(),
    badges: store.badges.get(),
    modal: {
      logo: LOGO_BASE64,
      scrollHeight: ((sys.screenHeight * 3) / 5) * (750 / sys.screenWidth)
    },
    searchStr: '',
    group: {
      keys: setGroup(),
      actived: currentGroupCache.get() || DEFAULT_GROUP.ALL
    }
  },
  methods: {
    setSys() {
      this.setData({ sys: store.sys.get() });
    },
    setGroups() {
      this.setData({ 'group.keys': setGroup() });
    },
    getGroupStores() {
      return !store.group.get(currentGroupCache.get() || DEFAULT_GROUP.ALL)
        ? store.group.get(DEFAULT_GROUP.ALL).get()
        : store.group.get(currentGroupCache.get() || DEFAULT_GROUP.ALL).get();
    },
    setJsonViews() {
      const groupStores = this.getGroupStores();
      this.setData({
        jsonviews: groupStores.filter(i => i.isJsonView)
      });
    },
    setRules() {
      const groupStores = this.getGroupStores();
      this.setData({
        rules: groupStores.filter(i => !i.isJsonView)
      });
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
      if (searchStr === '') {
        // 此时搜索框内容清空，应该恢复当前分组的初始状态
        this.setRules();
        return;
      }

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
      // 设置当前分组 key 缓存
      currentGroupCache.set(group);

      this.setData({
        'group.actived': group
      });
      this.setRules();
    },
    addListeners() {
      store.event.on('rule:update', this.setRules.bind(this));
      store.event.on('jsonview:update', this.setJsonViews.bind(this));
      store.event.on('badge:update', this.setBadges.bind(this));
      store.event.on('group:update', this.setGroups.bind(this));
    },
    removeListeners() {
      store.event.off('rule:update', this.setRules.bind(this));
      store.event.on('jsonview:update', this.setJsonViews.bind(this));
      store.event.off('badge:update', this.setBadges.bind(this));
      store.event.off('group:update', this.setGroups.bind(this));
    }
  },
  lifetimes: {
    attached() {
      this.setSys();
      this.setGroups();
      this.setRules();
      this.setBadges();
      this.addListeners();
    },
    detached() {
      this.removeListeners();
    }
  }
});
