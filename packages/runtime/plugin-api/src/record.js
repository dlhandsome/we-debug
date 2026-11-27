const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

function sanitize(value) {
  if (typeof value === 'function') return `ƒ ${value.name || 'anonymous'}()`;
  if (isPlainObject(value)) {
    return Object.keys(value).reduce((obj, key) => {
      obj[key] = typeof value[key] === 'function' ? `ƒ ${key}()` : value[key];
      return obj;
    }, {});
  }
  return value;
}

function getParams(args = []) {
  if (args.length === 0) return undefined;
  if (args.length === 1) return sanitize(args[0]);
  return args.map(sanitize);
}

function getErrMsg(error) {
  if (!error) return '';
  if (error.errMsg) return error.errMsg;
  if (error.message) return error.message;
  return String(error);
}

export function createRecord({ id, name, sync, args, route, initiator, startTime }) {
  return {
    id,
    name,
    type: sync ? 'sync' : 'async',
    status: 'pending',
    params: getParams(args),
    multiArgs: !!args && args.length > 1,
    result: undefined,
    errMsg: '',
    route: route || '',
    initiator: initiator || [],
    startTime: startTime || Date.now(),
    endTime: 0,
    duration: 0
  };
}

export function finishRecord(record, { result, error, returned, endTime }) {
  const end = endTime || Date.now();
  const patch = {
    endTime: end,
    duration: end - record.startTime
  };

  if (error) {
    Object.assign(patch, {
      status: 'fail',
      errMsg: getErrMsg(error),
      result: error instanceof Error ? { errMsg: error.message, stack: error.stack } : error
    });
  } else if (returned && record.type === 'async' && result === undefined) {
    // 未传回调且没有返回 Promise，无法得知异步结果
    patch.status = 'done';
  } else {
    Object.assign(patch, {
      status: 'success',
      result,
      errMsg: (result && typeof result.errMsg === 'string' && result.errMsg) || ''
    });
    if (returned && record.type === 'async') {
      patch.type = 'sync';
    }
  }

  return Object.assign(record, patch);
}
