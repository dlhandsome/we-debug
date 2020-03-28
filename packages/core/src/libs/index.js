import store from './store/index';
import * as util from './base/utils';

import { use } from './api/use';
import { init } from './api/init';
import { createCache } from './api/cache';
import { createBadge, getBadge, addBadge, removeBadge } from './api/badge';
import { createFormRule, getFormRule, addFormRule, removeFormRule } from './api/rule';

const event = store.event;

export {
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
  removeFormRule
};

export default {
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
  removeFormRule
};
