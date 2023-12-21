import store from './store/index';
import * as util from './base/utils';

import { use } from './api/use';
import { init } from './api/init';
import { createCache } from './api/cache';
import { createBadge, getBadge, addBadge, removeBadge } from './api/badge';
import { createFormRule, getFormRule, addFormRule, removeFormRule } from './api/rule';
import { getGroupsAllKeys, addRuleByGroup, getRuleByGroup, removeGroupRule } from './api/group';
import { setBridgeInfo, getBridgeInfo } from './api/bridge';
import { ENV_TYPE, getEnv } from './utils/env';
import { version } from './version';

const event = store.event;

export {
  ENV_TYPE,
  getEnv,
  use,
  init,
  createCache,
  event,
  store,
  util,
  createBadge,
  getBadge,
  addBadge,
  removeBadge,
  createFormRule,
  getFormRule,
  addFormRule,
  removeFormRule,
  getGroupsAllKeys,
  addRuleByGroup,
  getRuleByGroup,
  removeGroupRule,
  setBridgeInfo,
  getBridgeInfo,
  version
};

export default {
  ENV_TYPE,
  getEnv,
  use,
  init,
  createCache,
  event,
  store,
  util,
  createBadge,
  getBadge,
  addBadge,
  removeBadge,
  createFormRule,
  getFormRule,
  addFormRule,
  removeFormRule,
  getGroupsAllKeys,
  addRuleByGroup,
  getRuleByGroup,
  removeGroupRule,
  setBridgeInfo,
  getBridgeInfo,
  version
};
