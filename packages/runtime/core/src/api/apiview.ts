import store from '../store/index';
import {
  addViewByGroup,
  removeGroupView,
  updateViewByGroup,
} from './group';
import {
  ApiView
} from '../model/index';
import {
  IAddApiViewOption
} from '../types';

export { createApiView } from '../model/index';

/**
 * 新增 ApiView
 * @param {ApiView} apiview
 */
export function addApiView(apiview: ApiView, options?: IAddApiViewOption) {
  store.apiviews.add(apiview);
  const group = options?.group?.name;

  if (group) {
    addViewByGroup(group, apiview);
  }

  store.event.emit('apiview:update');
  store.event.emit('group:update');
}

/**
 * 更新 ApiView
 * @param {ApiView} apiview
 */
export function updateApiView(apiview: ApiView, options?: IAddApiViewOption) {
  store.apiviews.update(apiview);
  const group = options?.group?.name;

  if (group) {
    updateViewByGroup(group, apiview);
  }

  store.event.emit('apiview:update');
  store.event.emit('group:update');
}

/**
 * 移除 ApiView
 * @param {ApiView} apiview
 */
export function removeApiView(apiview: ApiView, options?: IAddApiViewOption) {
  store.apiviews.remove(apiview);
  const group = options?.group?.name;

  if (group) {
    removeGroupView(group, apiview);
  }

  store.event.emit('apiview:update');
  store.event.emit('group:update');
}

/**
 * 获取 ApiView 集合
 */
export function getApiView() {
  return store.apiviews.get();
}
