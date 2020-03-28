import { CacheData } from '../base/cache'

/**
 * 创建缓存
 * @param {*} cacheKey
 */
export function createCache(cacheKey) {
  let v = null
  try {
    v = wx.getStorageSync(cacheKey)
  } catch (e) {}

  return new CacheData(cacheKey, v)
}
