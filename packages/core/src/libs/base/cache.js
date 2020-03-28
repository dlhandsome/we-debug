export const getStorage = function() {
  if (wx.getStorageSync) {
    let rst
    try {
      rst = wx.getStorageSync.apply(wx, arguments)
    } catch (e) {
      console.error(e)
    }
    return rst
  }
}

export const setStorage = function(key, value) {
  wx.setStorage({
    key: key,
    data: value,
    fail(e) {
      console.log(e)
    },
  })
}

export class CacheData {
  constructor(storageKey, defaultValue, expired) {
    this._key = storageKey
    this.set(defaultValue, expired)
  }

  get() {
    if (this._expired) {
      if (new Date().getTime() - this._expired > 0) {
        return
      }
    }
    return this._value || (this._value = getStorage(this._key))
  }

  set(val, expired) {
    this._expired = expired || 0
    this._value = val
    setStorage(this._key, this._value)
  }
}
