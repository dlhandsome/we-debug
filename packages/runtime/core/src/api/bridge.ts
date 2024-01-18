import store from '../store/index';
import {
  WxKey,
  IAnyObject,
  GetBridgeInfoFunc
} from '../types';
import {
  isFunc
} from '../utils/simple-type-function';

const { bridge } = store;
const bridgeKey = '__WEDEBUG_BRIDGE__';

const bridgeApi: WxKey[] = ['navigateToMiniProgram'];

bridgeApi.forEach(method => {
  const bridgeFunc: any = wx[method];

  Object.defineProperty(wx, method, {
    get:
      () =>
      (opt: IAnyObject = {}) => {
        const out = Object.assign({}, opt);
        const bridgeInfo = bridge.getAll();

        if (!out.extraData) {
          out.extraData = {};
        }

        out.extraData[bridgeKey] = out.extraData[bridgeKey] || {};
        out.extraData[bridgeKey] = bridgeInfo;

        return isFunc(bridgeFunc) && bridgeFunc(out);
      }
  });
});

export function setBridgeInfo(key: string, value: any) {
  bridge.set(key, value);
}

export const getBridgeInfo: GetBridgeInfoFunc = (key, callback) => {
  if (getBridgeInfo.hasEventBind) return;
  getBridgeInfo.hasEventBind = true;
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
