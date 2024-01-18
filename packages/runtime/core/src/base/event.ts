import {
  isArr,
  isStr,
  isObj
} from '../utils/simple-type-function';
import {
  IEventFn,
  IEventFns,
  IEventKey,
} from '../types';

export class Event {
  private fns: IEventFns;

  constructor() {
    this.fns = {};
  }

  on(key: IEventKey, fn?: IEventFn) {
    if (isArr(key)) {
      key.forEach(item => {
        if (isStr(item)) {
          this.on(item, fn);
        } else if (isObj(item)) {
          this.on(item.event, item.fn);
        }
      });
    } else if (isStr(key) && fn){
      (this.fns[key as string] || (this.fns[key as string] = [])).push(fn);
    } else if (isObj(key)) {
      this.on(key.event, key.fn);
    }
  }

  off(key: IEventKey, fn?: IEventFn) {
    if (!key && !fn) {
      this.fns = Object.create(null);
      return this;
    }

    if (isArr(key)) {
      key.forEach(item => {
        if (isStr(item)) {
          this.off(item, fn);
        } else if (isObj(item)) {
          this.off(item.event, item.fn);
        }
      });
      return this;
    }
    if (!this.fns[key as string]) return this;

    if (!fn) {
      this.fns[key as string] = null;
    }

    if (fn && isStr(key)) {
      let fns = this.fns[key];
      let i = fns?.length;

      if (i && fns) {
        while (i--) {
          let tmp = fns[i];
          if (tmp === fn) {
            fns.splice(i, 1);
            break;
          }
        }
      }
    }
    return this;
  }

  emit(key: string, ...args: any[]) {
    const fns = this.fns[key];
    if (fns && fns.length) {
      return fns.map(fn => {
        return fn.apply(this, args);
      });
    } else {
      return [];
    }
  }
}
