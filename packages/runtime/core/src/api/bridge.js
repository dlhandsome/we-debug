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

export function getBridgeInfo(key, callback) {
  if (getBridgeInfo._hasEventBind) return;
  getBridgeInfo._hasEventBind = true;
  wx.onAppShow(res => {
    const extraData = res.referrerInfo.extraData;
    const queryData = res.query;

    const bridgeInfoFromQuery =
      queryData &&
      queryData[bridgeKey] &&
      JSON.parse(decodeURIComponent(queryData[bridgeKey])) &&
      JSON.parse(decodeURIComponent(queryData[bridgeKey]))[key];
    const bridgeInfoFromExtra = extraData && extraData[bridgeKey] && extraData[bridgeKey][key];
    // query 优先
    const bridgeInfo = Object.assign({}, bridgeInfoFromExtra, bridgeInfoFromQuery);
    callback(bridgeInfo);
  });
}
