import { MySet } from '../base/set';
import { Store } from '../base/store';
import {
  FormRule
} from '../model/rule';
import {
  compareFn
} from '../types';

export class Group extends Store {
  constructor() {
    super();
  }

  getKeys(sortFn?: compareFn) {
    // 可传入排序函数
    return Object.keys(this.store).sort(sortFn);
  }

  add(k: string, rule: FormRule) {
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

  remove(k: string, rule: FormRule) {
    const rules = this.get(k);

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
