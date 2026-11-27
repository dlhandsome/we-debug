import Debug from '@we-debug/core';
import {
  TYPE_FILTERS,
  DETAIL_TABS,
  formatSize,
  formatTime,
  formatClock,
  parseUrl,
  parseQuery,
  toSummary,
  matchFilter,
  toKeyValueList,
  stringify,
  truncate,
  toJsonPreview,
  toCurl,
  toTimingPhases,
  toProfileList
} from './utils';

const store = Debug.store;
const { isFunc } = Debug.util;

const prefix = 'debug:networkview-';
const RENDER_THROTTLE = 200;

Component({
  properties: {
    config: {
      type: Object,
      value: {}
    }
  },

  data: {
    typeFilters: TYPE_FILTERS,
    detailTabs: DETAIL_TABS,
    activeType: 'all',
    keyword: '',
    recording: true,
    preserveLog: false,
    list: [],
    summary: {
      count: 0,
      total: 0,
      transferred: '0 B',
      finish: '0 ms'
    },
    selectedId: 0,
    activeTab: 'Headers',
    detail: null
  },

  observers: {
    'config.id'(id) {
      this.bindView(id);
    }
  },

  methods: {
    getView() {
      return store.networkviews.getById(this.properties.config.id);
    },

    callHandler(name, ...args) {
      const view = this.getView();
      const fn = view && view.handler && view.handler[name];
      return isFunc(fn) ? fn(...args) : undefined;
    },

    getRecords() {
      return this.callHandler('getRecords') || [];
    },

    bindView(id) {
      this.unbindView();
      if (!id) return;
      this._eventKey = prefix + id + ':emit';
      this._onEmit = () => this.scheduleRender();
      store.event.on(this._eventKey, this._onEmit);
      this.render();
    },

    unbindView() {
      if (this._eventKey && this._onEmit) {
        store.event.off(this._eventKey, this._onEmit);
      }
      this._eventKey = null;
      this._onEmit = null;
    },

    scheduleRender() {
      if (!this._visible) {
        this._dirty = true;
        return;
      }
      if (this._renderTimer) return;
      this._renderTimer = setTimeout(() => {
        this._renderTimer = null;
        this.render();
      }, RENDER_THROTTLE);
    },

    render() {
      this._dirty = false;
      const records = this.getRecords();
      const state = this.callHandler('getState') || {};
      const { activeType, keyword, selectedId } = this.data;
      const filtered = records.filter(r => matchFilter(r, activeType, keyword));

      let transferred = 0;
      let firstStart = 0;
      let lastEnd = 0;
      filtered.forEach(r => {
        transferred += r.size || 0;
        if (!firstStart || r.startTime < firstStart) firstStart = r.startTime;
        if (r.endTime > lastEnd) lastEnd = r.endTime;
      });

      const nextData = {
        recording: state.recording !== false,
        preserveLog: !!state.preserveLog,
        list: filtered.map(toSummary),
        summary: {
          count: filtered.length,
          total: records.length,
          transferred: formatSize(transferred),
          finish: lastEnd && firstStart ? formatTime(lastEnd - firstStart) : '0 ms'
        }
      };

      if (selectedId) {
        const record = records.find(r => r.id === selectedId);
        nextData.detail = record ? this.toDetail(record) : null;
        if (!record) nextData.selectedId = 0;
      }

      this.setData(nextData);
    },

    toDetail(record) {
      const { query } = parseUrl(record.url);
      const requestText = truncate(stringify(record.requestData));
      const responseText = truncate(stringify(record.responseData));
      const requestJson = toJsonPreview(record.requestData);
      const responseJson = toJsonPreview(record.responseData);
      const statusText =
        record.status === 'pending'
          ? '(pending)'
          : record.status === 'fail'
          ? `(failed) ${record.errMsg}`
          : String(record.statusCode);

      return {
        id: record.id,
        name: toSummary(record).name,
        general: [
          { key: 'Request URL', value: record.url },
          { key: 'Request Method', value: record.method },
          { key: 'Status Code', value: statusText },
          { key: 'API', value: 'wx.' + record.api }
        ],
        isError: record.status === 'fail' || record.statusCode >= 400,
        responseHeaders: toKeyValueList(record.responseHeaders),
        requestHeaders: toKeyValueList(record.requestHeaders),
        queryParams: parseQuery(query),
        hasPayload: !!requestText.text,
        requestJson,
        requestText: requestText.text,
        requestTruncated: requestText.truncated,
        isPending: record.status === 'pending',
        responseJson,
        responseText: responseText.text,
        responseTruncated: responseText.truncated,
        errMsg: record.errMsg,
        timing: {
          startTime: formatClock(record.startTime),
          endTime: formatClock(record.endTime),
          duration: record.status === 'pending' ? 'Pending' : formatTime(record.duration),
          size: formatSize(record.size),
          phases: toTimingPhases(record.profile),
          profile: toProfileList(record.profile)
        }
      };
    },

    handleToggleRecord() {
      this.callHandler('bindRecordChange', !this.data.recording);
      this.render();
    },

    handleClear() {
      this.callHandler('bindClear');
      this.setData({ selectedId: 0, detail: null });
      this.render();
    },

    handleTogglePreserveLog() {
      this.callHandler('bindPreserveLogChange', !this.data.preserveLog);
      this.render();
    },

    handleSearch(e) {
      this.setData({ keyword: e.detail.value });
      this.render();
    },

    handleTypeTap(e) {
      this.setData({ activeType: e.currentTarget.dataset.type });
      this.render();
    },

    handleRowTap(e) {
      const id = e.currentTarget.dataset.id;
      const record = this.getRecords().find(r => r.id === id);
      if (!record) return;
      this.setData({
        selectedId: id,
        detail: this.toDetail(record)
      });
    },

    handleCloseDetail() {
      this.setData({ selectedId: 0, detail: null });
    },

    handleTabTap(e) {
      this.setData({ activeTab: e.currentTarget.dataset.tab });
    },

    copy(data) {
      wx.setClipboardData({
        data,
        success: () => wx.showToast({ title: '已复制', icon: 'none' })
      });
    },

    handleCopyUrl() {
      const record = this.getRecords().find(r => r.id === this.data.selectedId);
      record && this.copy(record.url);
    },

    handleCopyCurl() {
      const record = this.getRecords().find(r => r.id === this.data.selectedId);
      record && this.copy(toCurl(record));
    },

    handleCopyResponse() {
      const record = this.getRecords().find(r => r.id === this.data.selectedId);
      record && this.copy(stringify(record.responseData));
    },

    handleCopyPayload() {
      const record = this.getRecords().find(r => r.id === this.data.selectedId);
      record && this.copy(stringify(record.requestData));
    },

    onMaskShow() {
      this._visible = true;
      if (this._dirty) this.render();
    },

    onMaskHide() {
      this._visible = false;
    }
  },

  lifetimes: {
    attached() {
      this._visible = true;
      this._onMaskShow = this.onMaskShow.bind(this);
      this._onMaskHide = this.onMaskHide.bind(this);
      store.event.on('debug:mask:show-modal', this._onMaskShow);
      store.event.on('debug:mask:hide-modal', this._onMaskHide);
      if (!this._eventKey && this.properties.config.id) {
        this.bindView(this.properties.config.id);
      } else if (this._dirty) {
        this.render();
      }
    },
    detached() {
      this.unbindView();
      store.event.off('debug:mask:show-modal', this._onMaskShow);
      store.event.off('debug:mask:hide-modal', this._onMaskHide);
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
  }
});
