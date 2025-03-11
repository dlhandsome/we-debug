import {
  FormRule,
  JsonView,
} from '../model/index';
import {
  compareFn,
} from '../types';
import store from '../store/index';
import BaseManage from '../model/base';

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
 * 添加视图容器到分组
 * @param k 
 * @param someModel 
 * @returns 
 */
export function addViewByGroup<T extends BaseManage>(k: string, someView: T) {
  return store.group.add(k, someView);
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
 * 更新分组内视图
 * @param k 
 * @param jsonview 
 * @returns 
 */
export function updateViewByGroup<T extends BaseManage>(k: string, someView: T) {
  return store.group.update(k, someView);
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
 *  查询分类下所有视图容器
 * @param k 
 * @returns 
 */
export function getViewByGroup(k: string) {
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

/**
 * 从分类中移除视图容器
 * @param k 
 * @param jsonview 
 * @returns 
 */
export function removeGroupView<T extends BaseManage>(k: string, someView: T) {
  return store.group.remove(k, someView);
}
