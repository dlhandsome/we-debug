import { MySet } from '../base/set';
import { Store } from '../base/store';
import {
  compareFn
} from '../types';
import BaseManage from '../model/base';

export class Group extends Store {
  constructor() {
    super();
  }

  getKeys(sortFn?: compareFn) {
    // 可传入排序函数
    return Object.keys(this.store).sort(sortFn);
  }

  add<T extends BaseManage>(k: string, rule: T) {
    let rules = this.get(k);

    if (!rules) {
      this.set(k, new MySet());
    }

    // 查找是否有重复添加的规则
    const searchDuplicateRule = this.get(k).getById(rule.id);

    if (!searchDuplicateRule) {
      this.get(k).add(rule);
    }
  }

  update<T extends BaseManage>(k: string, rule: T) {
    this.get(k).update(rule);
  }

  remove<T extends BaseManage>(k: string, rule: T) {
    const rules = this.get(k)?.get();

    if (!rules) {
      return;
    }

    let i = rules.length;
    while (i--) {
      let tmp = rules[i];
      if (tmp.id === rule.id) {
        rules.splice(i, 1);
        break;
      }
    }
  }
}
