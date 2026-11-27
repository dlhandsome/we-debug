import store from '../store/index';
import {
  addViewByGroup,
  removeGroupView,
  updateViewByGroup,
} from './group';
import {
  NetworkView
} from '../model/index';
import {
  IAddNetworkViewOption
} from '../types';

export { createNetworkView } from '../model/index';

/**
 * 新增 NetworkView
 * @param {NetworkView} networkview
 */
export function addNetworkView(networkview: NetworkView, options?: IAddNetworkViewOption) {
  store.networkviews.add(networkview);
  const group = options?.group?.name;

  if (group) {
    addViewByGroup(group, networkview);
  }

  store.event.emit('networkview:update');
  store.event.emit('group:update');
}

/**
 * 更新 NetworkView
 * @param {NetworkView} networkview
 */
export function updateNetworkView(networkview: NetworkView, options?: IAddNetworkViewOption) {
  store.networkviews.update(networkview);
  const group = options?.group?.name;

  if (group) {
    updateViewByGroup(group, networkview);
  }

  store.event.emit('networkview:update');
  store.event.emit('group:update');
}

/**
 * 移除 NetworkView
 * @param {NetworkView} networkview
 */
export function removeNetworkView(networkview: NetworkView, options?: IAddNetworkViewOption) {
  store.networkviews.remove(networkview);
  const group = options?.group?.name;

  if (group) {
    removeGroupView(group, networkview);
  }

  store.event.emit('networkview:update');
  store.event.emit('group:update');
}

/**
 * 获取 NetworkView 集合
 */
export function getNetworkView() {
  return store.networkviews.get();
}
