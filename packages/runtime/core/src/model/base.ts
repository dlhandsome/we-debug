import {
  IBaseModelHandler,
  IBaseManageConstructorOption
} from '../types';
import store from '../store/index';

let _id = 1;

export default class BaseManage {
  public id: number;
  public handler: IBaseModelHandler;

  constructor(opt?: IBaseManageConstructorOption) {
    this.id = opt?.id || _id++;
    this.handler = opt?.handler || {};
  }

  get prefix(): void | string {
    throw new Error('you have to declare a prefix');
  }

  emit(opt = {}) {
    store.event.emit(this.prefix + ':emit', opt);
  }
}
