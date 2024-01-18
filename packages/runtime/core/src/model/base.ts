import store from '../store/index';
import {
  noop
} from '../utils/simple-type-function';
import {
  IBaseManageConstructorOption
} from '../types';

let _id = 1;

export default class BaseManage {
  public id: number;
  public handler: (...args: any[]) => any;

  constructor(opt?: IBaseManageConstructorOption) {
    this.id = opt?.id || _id++;
    this.handler = opt?.handler || noop;
  }

  get prefix(): void | string {
    throw new Error('you have to declare a prefix');
  }

  emit(opt = {}) {
    store.event.emit(this.prefix + ':emit', opt);
  }
}
