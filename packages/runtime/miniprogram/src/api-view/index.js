import Debug from '@we-debug/core';
import { formatTime, formatClock, stringify, truncate, toJsonPreview } from '../network-view/utils';
import { TYPE_FILTERS, DETAIL_TABS, toSummary, matchFilter, toCallCode } from './utils';

const store = Debug.store;
const { isFunc } = Debug.util;

const prefix = 'debug:apiview-';
const RENDER_THROTTLE = 200;

const getDetailKey = record => `${record.id}:${record.status}:${record.endTime}`;

const STATUS_LABEL = {
  pending: '(pending)',
  success: 'success',
  fail: 'fail',
  done: 'called（未传回调，无法获取结果）'
};

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
      failed: 0,
      finish: '0 ms'
    },
    selectedId: 0,
    activeTab: 'Overview',
    detail: null
  },

  observers: {
    'config.id'(id) {
      this.bindView(id);
    }
  },

  methods: {
    getView() {
      return store.apiviews.getById(this.properties.config.id);
    },

    callHandler(name, ...args) {
      const view = this.getView();
      const fn = view && view.handler && view.handler[name];
      return isFunc(fn) ? fn(...args) : undefined;
    },

    getRecords() {
      return this.callHandler('getRecords') || [];
    },

    getSelectedRecord() {
      return this.getRecords().find(r => r.id === this.data.selectedId);
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

      let failed = 0;
      let firstStart = 0;
      let lastEnd = 0;
      filtered.forEach(r => {
        if (r.status === 'fail') failed++;
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
          failed,
          finish: lastEnd && firstStart ? formatTime(lastEnd - firstStart) : '0 ms'
        }
      };

      if (selectedId) {
        const record = records.find(r => r.id === selectedId);
        if (!record) {
          nextData.selectedId = 0;
          nextData.detail = null;
        } else if (getDetailKey(record) !== this._detailKey) {
          // 详情未变化时不重新 setData，避免 json-view 被重置而丢失展开状态
          this._detailKey = getDetailKey(record);
          nextData.detail = this.toDetail(record);
        }
      }

      this.setData(nextData);
    },

    toDetail(record) {
      const paramsText = truncate(stringify(record.params));
      const resultText = truncate(stringify(record.result));
      const isPending = record.status === 'pending';

      return {
        id: record.id,
        name: 'wx.' + record.name,
        isError: record.status === 'fail',
        isPending,
        general: [
          { key: 'API', value: 'wx.' + record.name },
          { key: 'Status', value: STATUS_LABEL[record.status] || record.status },
          { key: 'Type', value: record.type },
          { key: 'Page', value: record.route || '-' },
          ...(record.errMsg ? [{ key: 'errMsg', value: record.errMsg }] : [])
        ],
        timing: [
          { key: 'Started at', value: formatClock(record.startTime) },
          { key: 'Finished at', value: formatClock(record.endTime) },
          { key: 'Duration', value: isPending ? 'Pending' : formatTime(record.duration) }
        ],
        initiator: record.initiator || [],
        paramsJson: toJsonPreview(record.params),
        paramsText: paramsText.text,
        paramsTruncated: paramsText.truncated,
        resultJson: toJsonPreview(record.result),
        resultText: resultText.text,
        resultTruncated: resultText.truncated,
        isDone: record.status === 'done'
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
      this._detailKey = getDetailKey(record);
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
      Debug.silent(() =>
        wx.setClipboardData({
          data,
          success: () => Debug.silent(() => wx.showToast({ title: '已复制', icon: 'none' }))
        })
      );
    },

    handleCopyCall() {
      const record = this.getSelectedRecord();
      record && this.copy(toCallCode(record));
    },

    handleCopyParams() {
      const record = this.getSelectedRecord();
      record && this.copy(stringify(record.params));
    },

    handleCopyResult() {
      const record = this.getSelectedRecord();
      record && this.copy(stringify(record.result));
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
