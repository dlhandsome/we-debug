const isFunc = v => typeof v === 'function';
const isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';

// 事件监听、实例创建类 API 不是一次性调用，不适合按调用记录
const SKIP_PATTERN = /^(on|off|create)[A-Z]/;
// 网络请求已由 Network 面板负责；canIUse / nextTick 调用频繁且无调试价值
const DEFAULT_EXCLUDE = ['request', 'downloadFile', 'uploadFile', 'canIUse', 'nextTick'];

// 调用栈中 getInitiator 与 hook 包装函数自身占用的帧数
const HOOK_FRAMES = 2;
const MAX_INITIATOR_FRAMES = 8;

let callId = 0;

/**
 * 解析调用栈，返回发起调用的业务代码帧
 */
function getInitiator() {
  const stack = new Error().stack || '';
  return stack
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !/^Error\b/.test(line))
    .slice(HOOK_FRAMES, HOOK_FRAMES + MAX_INITIATOR_FRAMES);
}

function getCurrentRoute() {
  try {
    const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
    const page = pages[pages.length - 1];
    return (page && (page.route || page.__route__)) || '';
  } catch (e) {
    return '';
  }
}

function getApiNames(include, exclude) {
  if (Array.isArray(include) && include.length) {
    return include.filter(name => isFunc(wx[name]));
  }
  const excluded = DEFAULT_EXCLUDE.concat(Array.isArray(exclude) ? exclude : []);
  return Object.keys(wx).filter(name => {
    if (SKIP_PATTERN.test(name) || excluded.indexOf(name) > -1) return false;
    try {
      return isFunc(wx[name]);
    } catch (e) {
      return false;
    }
  });
}

function wrap(name, raw, { shouldRecord, onStart, onFinish }) {
  const isSync = /Sync$/.test(name);

  return function (...args) {
    if (!shouldRecord()) {
      return raw.apply(this, args);
    }

    const id = ++callId;
    let finished = false;
    const finish = payload => {
      if (finished) return;
      finished = true;
      onFinish(Object.assign({ id, name, endTime: Date.now() }, payload));
    };

    onStart({
      id,
      name,
      sync: isSync,
      args,
      route: getCurrentRoute(),
      initiator: getInitiator(),
      startTime: Date.now()
    });

    const opt = args[0];
    const hasCallback =
      !isSync && isPlainObject(opt) && (isFunc(opt.success) || isFunc(opt.fail) || isFunc(opt.complete));

    if (hasCallback) {
      const out = Object.assign({}, opt);
      out.success = function (...res) {
        finish({ result: res[0] });
        isFunc(opt.success) && opt.success.apply(this, res);
      };
      out.fail = function (...res) {
        finish({ error: res[0] });
        isFunc(opt.fail) && opt.fail.apply(this, res);
      };
      return raw.apply(this, [out].concat(args.slice(1)));
    }

    let ret;
    try {
      ret = raw.apply(this, args);
    } catch (e) {
      finish({ error: e });
      throw e;
    }

    if (!isSync && ret && isFunc(ret.then)) {
      ret.then(
        res => finish({ result: res }),
        err => finish({ error: err })
      );
    } else {
      finish({ result: ret, returned: true });
    }
    return ret;
  };
}

/**
 * 劫持 wx 上的 API，返回实际劫持的 API 名称列表
 */
export function hookWxApi({ include, exclude, shouldRecord, onStart, onFinish }) {
  const hooked = [];
  getApiNames(include, exclude).forEach(name => {
    const raw = wx[name];
    try {
      Object.defineProperty(wx, name, {
        value: wrap(name, raw, { shouldRecord, onStart, onFinish }),
        writable: true,
        configurable: true,
        enumerable: true
      });
      hooked.push(name);
    } catch (e) {
      // 不可配置的属性跳过
    }
  });
  return hooked;
}
