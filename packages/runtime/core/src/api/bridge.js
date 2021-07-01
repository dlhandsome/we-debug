import bridge from '../store/bridge';

const bridgeKey = '__WEDEBUG_BRIDGE__';

const bridgeApi = ['navigateToMiniProgram'];

bridgeApi.forEach(method => {
  const bridgeFunc = wx[method];

  Object.defineProperty(wx, method, {
    get:
      () =>
      (opt = {}) => {
        const out = Object.assign({}, opt);
        const bridgeInfo = bridge.getAll();

        if (!out.extraData) {
          out.extraData = {};
        }

        out.extraData[bridgeKey] = out.extraData[bridgeKey] || {};
        out.extraData[bridgeKey] = bridgeInfo;

        return bridgeFunc(out);
      }
  });
});

export function setBridgeInfo(key, value) {
  bridge.set(key, value);
}

export function getBridgeInfo(key) {
  const enterOptions = wx.getEnterOptionsSync();
  const extraData = enterOptions.referrerInfo.extraData;

  return extraData && extraData[bridgeKey] && extraData[bridgeKey][key];
}
