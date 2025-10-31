import store from './store/index';
import * as util from './utils/simple-type-function';
import * as textEncoder from './utils/text-encoder';
import './api/network';
import { use } from './api/use';
import { init } from './api/init';
import { createCache } from './api/cache';
import { createBadge, getBadge, addBadge, removeBadge } from './api/badge';
import { createFormRule, getFormRule, addFormRule, removeFormRule } from './api/rule';
import { createJsonView, getJsonView, addJsonView, updateJsonView, removeJsonView } from './api/jsonview';
import { createTableView, getTableView, addTableView, updateTableView, removeTableView } from './api/tableview';
import { getGroupsAllKeys, addRuleByGroup, getRuleByGroup, removeGroupRule, addJsonViewByGroup, getJsonViewByGroup, removeGroupJsonView } from './api/group';
import { setBridgeInfo, getBridgeInfo } from './api/bridge';
import { ENV_TYPE, getEnv } from './utils/env';
import { DEFAULT_GROUP } from './config/group';
import { version } from './version';

const event = store.event;

export * from './types';

export {
  ENV_TYPE,
  DEFAULT_GROUP,
  getEnv,
  use,
  init,
  createCache,
  event,
  store,
  util,
  textEncoder,
  /** Badge 相关 API */
  createBadge,
  getBadge,
  addBadge,
  removeBadge,
  /** FormRule 相关 API */
  createFormRule,
  getFormRule,
  addFormRule,
  removeFormRule,
  /** JsonView 相关 API */
  createJsonView,
  getJsonView,
  addJsonView,
  updateJsonView,
  removeJsonView,
  /** TableView 相关 API */
  createTableView,
  getTableView,
  addTableView,
  updateTableView,
  removeTableView,
  getGroupsAllKeys,
  addRuleByGroup,
  getRuleByGroup,
  removeGroupRule,
  addJsonViewByGroup,
  getJsonViewByGroup,
  removeGroupJsonView,
  setBridgeInfo,
  getBridgeInfo,
  version
};

export default {
  ENV_TYPE,
  DEFAULT_GROUP,
  getEnv,
  use,
  init,
  createCache,
  event,
  store,
  util,
  textEncoder,
  createBadge,
  getBadge,
  addBadge,
  removeBadge,
  createFormRule,
  getFormRule,
  addFormRule,
  removeFormRule,
  createJsonView,
  getJsonView,
  addJsonView,
  updateJsonView,
  removeJsonView,
  createTableView,
  getTableView,
  addTableView,
  updateTableView,
  removeTableView,
  getGroupsAllKeys,
  addRuleByGroup,
  getRuleByGroup,
  removeGroupRule,
  addJsonViewByGroup,
  getJsonViewByGroup,
  removeGroupJsonView,
  setBridgeInfo,
  getBridgeInfo,
  version
};
