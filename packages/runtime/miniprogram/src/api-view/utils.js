import { formatTime } from '../network-view/utils';

const SUMMARY_LENGTH = 80;

export const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'async', label: 'Async' },
  { key: 'sync', label: 'Sync' },
  { key: 'fail', label: 'Failed' }
];

export const DETAIL_TABS = ['Overview', 'Params', 'Result'];

const STATUS_TEXT = {
  pending: '(pending)',
  success: 'ok',
  fail: 'fail',
  done: '-'
};

const CALLBACK_PLACEHOLDER = /^ƒ \S*\(\)$/;
const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

/**
 * 去掉参数中 success/fail/complete 等回调函数的占位符
 */
function omitCallbacks(value) {
  if (!isPlainObject(value)) return value;
  return Object.keys(value).reduce((obj, key) => {
    const v = value[key];
    if (!(typeof v === 'string' && CALLBACK_PLACEHOLDER.test(v))) obj[key] = v;
    return obj;
  }, {});
}

function toArgs(record) {
  if (record.params === undefined) return [];
  return (record.multiArgs ? record.params : [record.params]).map(omitCallbacks);
}

function toInline(data) {
  if (data === undefined) return '';
  let text;
  try {
    text = typeof data === 'string' ? data : JSON.stringify(data);
  } catch (e) {
    text = String(data);
  }
  return text && text.length > SUMMARY_LENGTH ? text.slice(0, SUMMARY_LENGTH) + '…' : text || '';
}

export function toSummary(record) {
  return {
    id: record.id,
    name: record.name,
    dir:
      toArgs(record)
        .map(toInline)
        .join(', ')
        .replace(/^\{\}$/, '') || record.route,
    statusText: STATUS_TEXT[record.status] || record.status,
    type: record.type,
    isError: record.status === 'fail',
    isPending: record.status === 'pending',
    time: record.status === 'pending' ? 'Pending' : formatTime(record.duration)
  };
}

export function matchFilter(record, type, keyword) {
  if (type === 'fail' && record.status !== 'fail') return false;
  if ((type === 'sync' || type === 'async') && record.type !== type) return false;
  if (!keyword) return true;
  return record.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
}

/**
 * 生成可直接粘贴到控制台复现的调用代码
 */
export function toCallCode(record) {
  const argsText = toArgs(record)
    .map(arg => {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    })
    .join(', ');
  return `wx.${record.name}(${argsText})`;
}
