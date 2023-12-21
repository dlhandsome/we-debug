import { noop } from '../base/utils';
import store from '../store/index';

/**
 * 查询所有分组
 * @param {*} fn
 * @returns
 */
export function getGroupsAllKeys(fn = noop) {
  return store.group.getKeys(fn);
}

export function addRuleByGroup(k, rule = {}) {
  return store.group.add(k, rule);
}

/**
 * 查询分类下所有规则
 * @param {*} k
 * @returns
 */
export function getRuleByGroup(k) {
  return store.group.get(k);
}

/**
 * 从分类中移除规则
 * @param {*} k
 * @param {*} rule
 * @returns
 */
export function removeGroupRule(k, rule = {}) {
  return store.group.remove(k, rule);
}
