import {
  FormRule,
  JsonView,
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

/**
 * 给 rule 添加分组
 * @param k 
 * @param rule 
 * @returns 
 */
export function addRuleByGroup(k: string, rule: FormRule) {
  return store.group.add(k, rule);
}

/**
 * 给 jsonview 添加分组
 * @param k 
 * @param jsonview 
 * @returns 
 */
export function addJsonViewByGroup(k: string, jsonview: JsonView) {
  return store.group.add(k, jsonview);
}

/**
 * 给 jsonview 更新分组内数据
 * @param k 
 * @param jsonview 
 * @returns 
 */
export function updateJsonViewByGroup(k: string, jsonview: JsonView) {
  return store.group.update(k, jsonview);
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
 * 查询分类下所有 jsonview
 * @param k 
 * @returns 
 */
export function getJsonViewByGroup(k: string) {
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

/**
 * 从分类中移除 jsonview
 * @param k 
 * @param jsonview 
 * @returns 
 */
export function removeGroupJsonView(k: string, jsonview: JsonView) {
  return store.group.remove(k, jsonview);
}
