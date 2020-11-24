import store from '../store/index';

export { createFormRule } from '../manage/index';

/**
 * 新增规则
 * @param {Rule} rule
 */
export function addFormRule(rule) {
  store.rules.add(rule);
}

/**
 * 移除规则
 * @param {*} rule
 */
export function removeFormRule(rule) {
  store.rules.remove(rule);
}

/**
 * 获取规则集合
 */
export function getFormRule() {
  return store.rules.get();
}
