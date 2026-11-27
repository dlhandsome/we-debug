import { CacheData } from '../base/cache';
import { silent } from '../utils/silent';

/**
 * 创建缓存
 * @param {*} cacheKey
 */
export function createCache(cacheKey: string) {
  let v = null;
  try {
    v = silent(() => wx.getStorageSync(cacheKey));
  } catch (e) {}

  return new CacheData(cacheKey, v);
}
