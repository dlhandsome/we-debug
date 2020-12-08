import { isArr, isStr, isObj } from './utils';

export class Event {
  constructor() {
    this._fns = {};
  }

  on(key, fn) {
    if (isArr(key)) {
      key.forEach(item => {
        if (isStr(item)) {
          this.on(item, fn);
        } else if (isObj(item)) {
          this.on(item.event, item.fn);
        }
      });
    } else {
      (this._fns[key] || (this._fns[key] = [])).push(fn);
    }
  }

  off(key, fn) {
    if (!key && !fn) {
      this._fns = Object.create(null);
      return this;
    }

    if (isArr(key)) {
      key.forEach(item => {
        if (isStr(item)) {
          this.off(item, fn);
        } else if (isObj(item)) {
          this.off(item.key, item.fn);
        }
      });
      return this;
    }
    if (!this._fns[key]) return this;

    if (!fn) {
      this._fns[key] = null;
    }

    if (fn) {
      let fns = this._fns[key];
      let i = fns.length;
      while (i--) {
        let tmp = fns[i];
        if (tmp === fn || tmp.fn === fn) {
          fns.splice(i, 1);
          break;
        }
      }
    }
  }

  emit(key, ...args) {
    const fns = this._fns[key];
    if (fns && fns.length) {
      return fns.map(fn => {
        return fn.apply(this, args);
      });
    }
  }
}
