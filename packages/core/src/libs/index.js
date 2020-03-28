import store from './store/index'
import * as util from './base/utils'

export { use } from './api/use'
export { init } from './api/init'
export { createCache } from './api/cache'
export {
  createBadge,
  getBadge,
  addBadge,
  removeBadge
} from './api/badge'
export {
  createFormRule,
  getFormRule,
  addFormRule,
  removeFormRule
} from './api/rule'

export default {
  use,
  init,
  createCache,
  event: store.event,
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
}
