const MAX_TEXT_LENGTH = 100 * 1024;

export const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'request', label: 'Fetch/XHR' },
  { key: 'downloadFile', label: 'Download' },
  { key: 'uploadFile', label: 'Upload' }
];

export const DETAIL_TABS = ['Headers', 'Payload', 'Preview', 'Response', 'Timing'];

const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

export function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1000) return bytes + ' B';
  if (bytes < 1000 * 1000) return (bytes / 1000).toFixed(1) + ' kB';
  return (bytes / (1000 * 1000)).toFixed(1) + ' MB';
}

export function formatTime(ms) {
  if (ms < 1000) return Math.round(ms) + ' ms';
  return (ms / 1000).toFixed(2) + ' s';
}

function pad(n, len = 2) {
  let s = String(n);
  while (s.length < len) s = '0' + s;
  return s;
}

export function formatClock(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

export function parseUrl(url = '') {
  const match = url.match(/^([a-z][a-z0-9+.-]*:)?\/\/([^/?#]*)([^?#]*)(\?[^#]*)?/i);
  if (!match) {
    return { origin: '', host: '', path: url, query: '' };
  }
  const [, protocol = '', host = '', path = '', query = ''] = match;
  return { origin: protocol + '//' + host, host, path: path || '/', query };
}

export function parseQuery(query = '') {
  return query
    .replace(/^\?/, '')
    .split('&')
    .filter(Boolean)
    .map(pair => {
      const i = pair.indexOf('=');
      const key = i > -1 ? pair.slice(0, i) : pair;
      const value = i > -1 ? pair.slice(i + 1) : '';
      const decode = s => {
        try {
          return decodeURIComponent(s.replace(/\+/g, ' '));
        } catch (e) {
          return s;
        }
      };
      return { key: decode(key), value: decode(value) };
    });
}

function getStatus(record) {
  if (record.status === 'pending') return { text: '(pending)', isError: false };
  if (record.status === 'fail') return { text: '(failed)', isError: true };
  return { text: String(record.statusCode), isError: record.statusCode >= 400 };
}

export function toSummary(record) {
  const { host, path, query } = parseUrl(record.url);
  const segments = path.split('/').filter(Boolean);
  const name = (segments.length ? segments[segments.length - 1] : host || record.url) + query;
  const dir = host + '/' + segments.slice(0, -1).join('/');
  const status = getStatus(record);

  return {
    id: record.id,
    name,
    dir,
    method: record.method,
    api: record.api,
    statusText: status.text,
    isError: status.isError,
    isPending: record.status === 'pending',
    size: record.status === 'success' ? formatSize(record.size) : '-',
    time: record.status === 'pending' ? 'Pending' : formatTime(record.duration)
  };
}

export function matchFilter(record, type, keyword) {
  if (type !== 'all' && record.api !== type) return false;
  if (!keyword) return true;
  return record.url.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
}

export function toKeyValueList(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj).map(key => {
    const v = obj[key];
    return { key, value: typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v) };
  });
}

export function stringify(data) {
  if (data === undefined || data === null) return '';
  if (typeof data === 'string') return data;
  if (data instanceof ArrayBuffer) return `[ArrayBuffer ${data.byteLength} bytes]`;
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
}

export function truncate(text) {
  if (text.length <= MAX_TEXT_LENGTH) return { text, truncated: false };
  return { text: text.slice(0, MAX_TEXT_LENGTH), truncated: true };
}

/**
 * 返回可交给 json-view 渲染的对象，非 JSON 内容返回 null
 */
export function toJsonPreview(data) {
  if (data && typeof data === 'object' && !(data instanceof ArrayBuffer)) return data;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (/^[[{]/.test(trimmed)) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

function getHeader(headers, name) {
  if (!headers) return undefined;
  const lower = name.toLowerCase();
  const key = Object.keys(headers).find(k => k.toLowerCase() === lower);
  return key ? headers[key] : undefined;
}

function shellQuote(str) {
  return `'${String(str).replace(/'/g, `'\\''`)}'`;
}

export function toCurl(record) {
  const parts = [`curl ${shellQuote(record.url)}`];

  if (record.api === 'request' && record.method !== 'GET') {
    parts.push(`-X ${shellQuote(record.method)}`);
  }

  Object.keys(record.requestHeaders || {}).forEach(key => {
    parts.push(`-H ${shellQuote(key + ': ' + record.requestHeaders[key])}`);
  });

  const data = record.requestData;
  if (record.api === 'uploadFile' && data) {
    Object.keys(data.formData || {}).forEach(key => {
      parts.push(`-F ${shellQuote(key + '=' + data.formData[key])}`);
    });
    parts.push(`-F ${shellQuote(data.name + '=@' + data.filePath)}`);
  } else if (record.api === 'request' && record.method !== 'GET' && data !== undefined) {
    const contentType = String(getHeader(record.requestHeaders, 'Content-Type') || '');
    let body;
    if (typeof data === 'string') {
      body = data;
    } else if (isPlainObject(data) && contentType.indexOf('x-www-form-urlencoded') > -1) {
      body = Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');
    } else {
      try {
        body = JSON.stringify(data);
      } catch (e) {
        body = String(data);
      }
    }
    if (body) parts.push(`--data-raw ${shellQuote(body)}`);
  }

  return parts.join(' \\\n  ');
}

const TIMING_PHASES = [
  { label: 'DNS Lookup', start: 'domainLookupStart', end: 'domainLookupEnd', color: '#009688' },
  { label: 'Initial connection', start: 'connectStart', end: 'connectEnd', color: '#ff9800' },
  { label: 'SSL', start: 'SSLconnectionStart', end: 'SSLconnectionEnd', color: '#9c27b0' },
  { label: 'Waiting for server response', start: 'requestStart', end: 'responseStart', color: '#4caf50' },
  { label: 'Content Download', start: 'responseStart', end: 'responseEnd', color: '#2196f3' }
];

/**
 * 根据 wx.request 返回的 profile 计算各阶段耗时
 */
export function toTimingPhases(profile) {
  if (!profile) return [];
  const base = profile.redirectStart || profile.fetchStart || profile.domainLookupStart || profile.requestStart;
  const total = (profile.responseEnd || 0) - base;
  if (!base || total <= 0) return [];

  return TIMING_PHASES.map(phase => {
    const start = profile[phase.start];
    const end = profile[phase.end];
    if (!start || !end || end < start) return null;
    return {
      label: phase.label,
      color: phase.color,
      duration: formatTime(end - start),
      left: (((start - base) / total) * 100).toFixed(2),
      width: Math.max(((end - start) / total) * 100, 0.5).toFixed(2)
    };
  }).filter(Boolean);
}

export function toProfileList(profile) {
  if (!profile) return [];
  const keys = [
    'protocol',
    'estimate_nettype',
    'httpRttEstimate',
    'transportRttEstimate',
    'rtt',
    'peerIP',
    'port',
    'socketReused',
    'sendBytesCount',
    'receivedBytedCount'
  ];
  return keys
    .filter(k => profile[k] !== undefined && profile[k] !== '')
    .map(k => ({ key: k, value: String(profile[k]) }));
}
