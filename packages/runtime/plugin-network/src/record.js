const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

function getHeader(headers, name) {
  if (!headers) return undefined;
  const lower = name.toLowerCase();
  const key = Object.keys(headers).find(k => k.toLowerCase() === lower);
  return key ? headers[key] : undefined;
}

function encodeQuery(data) {
  return Object.keys(data)
    .map(k => {
      const v = data[k];
      const value = typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
      return encodeURIComponent(k) + '=' + encodeURIComponent(value === undefined ? '' : value);
    })
    .join('&');
}

/**
 * 按 wx.request 的规则计算真实请求地址：GET 请求的 object data 会被拼接到 query 上
 */
function resolveUrl(api, option) {
  const url = option.url || '';
  const method = (option.method || 'GET').toUpperCase();
  if (api !== 'request' || method !== 'GET' || !isPlainObject(option.data)) {
    return url;
  }
  const query = encodeQuery(option.data);
  if (!query) return url;
  return url + (url.indexOf('?') > -1 ? '&' : '?') + query;
}

function byteLength(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) len += 1;
    else if (code < 0x800) len += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      len += 4;
      i++;
    } else len += 3;
  }
  return len;
}

function calcSize(api, response) {
  if (!response) return 0;
  const contentLength = Number(getHeader(response.header, 'Content-Length'));
  if (contentLength > 0) return contentLength;
  if (response.dataLength > 0) return response.dataLength;
  if (api === 'downloadFile') return 0;

  const data = response.data;
  if (data === undefined || data === null) return 0;
  if (typeof data === 'string') return byteLength(data);
  if (data instanceof ArrayBuffer) return data.byteLength;
  try {
    return byteLength(JSON.stringify(data));
  } catch (e) {
    return 0;
  }
}

function getRequestData(api, option) {
  if (api === 'uploadFile') {
    return {
      name: option.name,
      filePath: option.filePath,
      formData: option.formData || {}
    };
  }
  if (api === 'downloadFile') {
    return option.filePath ? { filePath: option.filePath } : undefined;
  }
  return option.data;
}

function getResponseData(api, response) {
  if (api === 'downloadFile') {
    return {
      tempFilePath: response.tempFilePath,
      filePath: response.filePath
    };
  }
  return response.data;
}

export function createRecord({ id, method: api, option = {}, startTime }) {
  return {
    id,
    api,
    url: resolveUrl(api, option),
    method: api === 'request' ? (option.method || 'GET').toUpperCase() : api === 'uploadFile' ? 'POST' : 'GET',
    status: 'pending',
    statusCode: 0,
    errMsg: '',
    requestHeaders: Object.assign({}, option.header),
    requestData: getRequestData(api, option),
    responseHeaders: {},
    responseData: undefined,
    size: 0,
    profile: null,
    startTime: startTime || Date.now(),
    endTime: 0,
    duration: 0
  };
}

export function finishRecord(record, { method: api, response, error, endTime }) {
  const end = endTime || Date.now();
  const patch = {
    endTime: end,
    duration: end - record.startTime
  };

  if (error) {
    Object.assign(patch, {
      status: 'fail',
      errMsg: (error && error.errMsg) || String(error)
    });
  } else if (response) {
    Object.assign(patch, {
      status: 'success',
      statusCode: response.statusCode || 0,
      errMsg: response.errMsg || '',
      responseHeaders: response.header || response.headers || {},
      responseData: getResponseData(api, response),
      size: calcSize(api, response),
      profile: response.profile || null
    });
  }

  return Object.assign(record, patch);
}
