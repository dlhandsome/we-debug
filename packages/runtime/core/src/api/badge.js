import store from '../store/index';

export { createBadge } from '../model/index';

/**
 * 新增状态角标对象
 * @param {Badge} badges
 */
export function addBadge(badges) {
  store.badges.add(badges);
}

/**
 * 移除状态角标对象
 * @param {*} badges
 */
export function removeBadge(badges) {
  store.badges.remove(badges);
}

/**
 * 获取状态角标对象集合
 */
export function getBadge() {
  return store.badges.get();
}
