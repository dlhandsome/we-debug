import {
  isStr,
  isObj,
  isArr,
  isEmptyArr
} from '../utils/simple-type-function';
import store from '../store/index';
import {
  addRuleByGroup
} from './group';
import {
  DEFAULT_GROUP
} from '../config/group';
import {
  FormRule
} from '../model/index';
import {
  IAddFormRuleOption
} from '../types';

export { createFormRule } from '../model/index';

/**
 * 新增规则
 * @param {Rule} rule
 */
export function addFormRule(rule: FormRule, options?: IAddFormRuleOption) {
  store.rules.add(rule);

  // 默认分组
  let defaultGroup = [DEFAULT_GROUP.ALL, DEFAULT_GROUP.OTHER];
  let customGroup = options?.group;
  // 添加分组
  if (isEmptyArr(customGroup)) {
    customGroup = defaultGroup;
  } else if (isArr(customGroup)) {
    customGroup = customGroup.includes(DEFAULT_GROUP.OTHER)
      ? Array.from(new Set(customGroup.concat(defaultGroup)))
      : Array.from(new Set(customGroup.concat(DEFAULT_GROUP.ALL)));
  } else if (isStr(customGroup)) {
    customGroup = Array.from(new Set([DEFAULT_GROUP.ALL, customGroup]));
  } else if (isObj(customGroup)) {
    if (customGroup.private) {
      customGroup = [customGroup.name];
    } else {
      customGroup = Array.from(new Set([DEFAULT_GROUP.ALL, customGroup.name]));
    }
  } else{
    customGroup = defaultGroup;
  }

  customGroup.forEach(k => addRuleByGroup(k, rule));
  // 抛出 rule、group 更新事件
  store.event.emit('rule:update');
  store.event.emit('group:update');
}

/**
 * 移除规则
 * @param {*} rule
 */
export function removeFormRule(rule: FormRule) {
  store.rules.remove(rule);
  // 抛出 rule、group 更新事件
  store.event.emit('rule:update');
  store.event.emit('group:update');

}

/**
 * 获取规则集合
 */
export function getFormRule() {
  return store.rules.get();
}
