import store from '../store/index';
import { noop } from '../base/utils';

let _id = 1;

export default class BaseManage {
  constructor(opt) {
    this.id = opt.id || _id++;
    this.handler = opt.handler || noop;
  }

  get prefix() {
    throw new Error('you have to declare a prefix');
  }

  emit(opt = {}) {
    store.event.emit(this.prefix + ':emit', opt);
  }
}
