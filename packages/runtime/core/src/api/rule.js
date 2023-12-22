import store from '../store/index';
import { addRuleByGroup } from './group';
import { DEFAULT_GROUP } from '../config/group';

export { createFormRule } from '../model/index';

/**
 * 新增规则
 * @param {Rule} rule
 */
export function addFormRule(rule, options = {}) {
  store.rules.add(rule);

  // 添加分组
  [DEFAULT_GROUP.ALL, DEFAULT_GROUP.SYSTEM]
    .concat(options.group || [])
    .concat(DEFAULT_GROUP.OTHER)
    .forEach(k => addRuleByGroup(k, rule));
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
