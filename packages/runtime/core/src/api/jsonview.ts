import store from '../store/index';
import {
addJsonViewByGroup,
removeGroupJsonView,
updateJsonViewByGroup,
} from './group';
import {
  JsonView
} from '../model/index';
import {
  IAddJsonViewOption
} from '../types';

export { createJsonView } from '../model/index';

/**
 * 新增JsonView
 * @param {JsonView} jsonview
 */
export function addJsonView(jsonview: JsonView, options?: IAddJsonViewOption) {
  store.jsonviews.add(jsonview);
  const group = options?.group?.name;

  if (group) {
    addJsonViewByGroup(group, jsonview)
  }

  // 抛出 jsonview、group 更新事件
  store.event.emit('jsonview:update');
  store.event.emit('group:update');
}

/**
 * 更新JsonView
 * @param {JsonView} jsonview
 */
export function updateJsonView(jsonview: JsonView, options?: IAddJsonViewOption) {
  store.jsonviews.update(jsonview);
  const group = options?.group?.name;

  if (group) {
    updateJsonViewByGroup(group, jsonview);
  }

  // 抛出 jsonview、group 更新事件
  store.event.emit('jsonview:update');
  store.event.emit('group:update');
}

/**
 * 移除规则
 * @param {*} rule
 */
export function removeJsonView(jsonview: JsonView, options?: IAddJsonViewOption) {
  store.jsonviews.remove(jsonview);

  const group = options?.group?.name;

  if (group) {
    removeGroupJsonView(group, jsonview);
  }

  // 抛出 rule、group 更新事件
  store.event.emit('jsonview:update');
  store.event.emit('group:update');

}

/**
 * 获取规则集合
 */
export function getJsonView() {
  return store.jsonviews.get();
}
