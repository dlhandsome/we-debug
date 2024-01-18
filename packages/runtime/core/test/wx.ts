import { IAnyObject } from "../src/types";

let _storage: IAnyObject = {};

(global as any).wx = {
  onAppRoute(cb: () => void) {
    cb();
  },
  onError(cb: (e: Error) => void) {
    const e = new Error('wx.onError');

    setTimeout(() => {
      cb(e);
    }, 500);
  },
  setStorage(obj: { key: string; value: any }) {
    _storage[obj.key] = obj.value;
  },
  getStorage(key: string) {
    return _storage[key];
  },
  getSystemInfoSync() {
    return {
      model: 'iPhone X',
      pixelRatio: 3,
      windowWidth: 375,
      windowHeight: 724,
      system: 'iOS 10.0.1',
      language: 'zh',
      version: '7.0.4',
      screenWidth: 375,
      screenHeight: 812,
      SDKVersion: '2.9.3',
      brand: 'devtools',
      fontSizeSetting: 16,
      benchmarkLevel: 1,
      batteryLevel: 100,
      statusBarHeight: 44,
      safeArea: { right: 375, bottom: 812, left: 0, top: 44, width: 375, height: 768 },
      platform: 'devtools',
      devicePixelRatio: 3
    };
  }
};
