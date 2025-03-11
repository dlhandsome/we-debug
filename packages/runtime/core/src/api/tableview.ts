import store from '../store/index';
import {
addViewByGroup,
removeGroupView,
updateViewByGroup,
} from './group';
import {
  TableView
} from '../model/index';
import {
  IAddTableViewOption
} from '../types';

export { createTableView } from '../model/index';

/**
 * TableView
 * @param {JsonView} jsonview
 */
export function addTableView(tableview: TableView, options?: IAddTableViewOption) {
  store.tableviews.add(tableview);
  const group = options?.group?.name;

  if (group) {
    addViewByGroup(group, tableview)
  }

  // 抛出 jsonview、group 更新事件
  store.event.emit('tableview:update');
  store.event.emit('group:update');
}

/**
 * 更新 TableView
 * @param {JsonView} jsonview
 */
export function updateTableView(tableview: TableView, options?: IAddTableViewOption) {
  store.tableviews.update(tableview);
  const group = options?.group?.name;

  if (group) {
    updateViewByGroup(group, tableview);
  }

  // 抛出 tableview 更新事件
  store.event.emit('tableview:update');
  store.event.emit('group:update');
}

/**
 * 移除规则
 * @param {*} rule
 */
export function removeTableView(tableview: TableView, options?: IAddTableViewOption) {
  store.tableviews.remove(tableview);

  const group = options?.group?.name;

  if (group) {
    removeGroupView(group, tableview);
  }

  // 抛出 tableview、group 更新事件
  store.event.emit('tableview:update');
  store.event.emit('group:update');

}

/**
 * 获取规则集合
 */
export function getTableView() {
  return store.tableviews.get();
}
