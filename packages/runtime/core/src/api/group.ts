import {
  FormRule,
} from '../model/index';
import {
  compareFn,
} from '../types';
import store from '../store/index';

/**
 * 查询所有分组
 * @param {*} fn
 * @returns
 */
export function getGroupsAllKeys(fn?: compareFn) {
  return store.group.getKeys(fn);
}

export function addRuleByGroup(k: string, rule: FormRule) {
  return store.group.add(k, rule);
}

/**
 * 查询分类下所有规则
 * @param {*} k
 * @returns
 */
export function getRuleByGroup(k: string) {
  return store.group.get(k);
}

/**
 * 从分类中移除规则
 * @param {*} k
 * @param {*} rule
 * @returns
 */
export function removeGroupRule(k: string, rule: FormRule) {
  return store.group.remove(k, rule);
}
