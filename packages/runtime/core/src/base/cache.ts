export const getStorage = function (key: string) {
  if (wx.getStorageSync) {
    let rst;
    try {
      rst = wx.getStorageSync(key);
    } catch (e) {
      console.error(e);
    }
    return rst;
  }
};

export const setStorage = function (key: string, value: any) {
  wx.setStorage({
    key: key,
    data: value,
    fail(e) {
      console.log(e);
    }
  });
};

export class CacheData {
  private key: string;
  private value: any;
  private expired: number;

  constructor(storageKey: string, defaultValue: any, expired?: number) {
    this.key = storageKey;
    this.set(defaultValue, expired);
  }

  get() {
    if (this.expired) {
      if (new Date().getTime() - this.expired > 0) {
        return;
      }
    }
    return this.value || (this.value = getStorage(this.key));
  }

  set(val: any, expired?: number) {
    this.expired = expired || 0;
    this.value = val;
    setStorage(this.key, this.value);
  }
}
