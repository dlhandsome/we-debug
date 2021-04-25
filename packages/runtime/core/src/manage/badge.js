import { isUndefined, isNull } from '../base/utils';
import BaseManage from './base';

const valid = v => !isUndefined(v) && !isNull(v);

export class Badge extends BaseManage {
  constructor(opt = {}) {
    super(opt);
    this.key = valid(opt.key) ? opt.key : '';
    this.value = valid(opt.value) ? opt.value : '';
    this.color = opt.color || '';
    this.show = opt.show || false;
    this.draggable = opt.draggable;
    this.position = opt.position;
    this.styles = opt.styles || '';
  }

  get prefix() {
    return 'debug:badge-' + this.id;
  }
}

export function createBadge(opt = {}) {
  return new Badge(opt);
}
