import { MySet } from '../base/set';
import { Store } from '../base/store';
import { noop } from '../base/utils';

export class Group extends Store {
  constructor(opt = {}) {
    super(opt);
  }

  getKeys(sortFn = noop) {
    // 可传入排序函数
    return Object.keys(this.store).sort(sortFn);
  }

  add(k, rule = {}) {
    let rules = this.get(k);

    if (!rules) {
      rules = new MySet();
    }

    // 查找是否有重复添加的规则
    const searchDuplicateRule = rules.getById(rule.id);

    if (!searchDuplicateRule) {
      rules.add(rule);
    }
  }

  remove(k, rule = {}) {
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
