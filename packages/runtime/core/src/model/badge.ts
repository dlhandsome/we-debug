import {
  isUndefined,
  isNull
} from '../utils/simple-type-function';
import BaseManage from './base';
import {
  IBadgeManageConstructorOption
} from '../types';

const valid = (v: unknown) => !isUndefined(v) && !isNull(v);

export class Badge extends BaseManage {
  // @ts-ignore
  private key: string;
  // @ts-ignore
  private value: string | number;
  // @ts-ignore
  private color: string;
  // @ts-ignore
  private show: boolean;
  // @ts-ignore
  private draggable: boolean;
  // @ts-ignore
  private position: { left?: number; top?: number; right?: number; bottom?: number };
  // @ts-ignore
  private styles: string;
  // @ts-ignore
  private textOnly: boolean;

  constructor(opt: IBadgeManageConstructorOption) {
    super(opt);
    this.key = valid(opt.key) ? opt.key : '';
    this.value = valid(opt.value) ? opt.value : '';
    this.color = opt.color || '';
    this.show = opt.show || false;
    this.draggable = opt.draggable;
    this.position = opt.position;
    this.styles = opt.styles || '';
    this.textOnly = opt.textOnly || false;
  }

  get prefix() {
    return 'debug:badge-' + this.id;
  }
}

export function createBadge(opt: IBadgeManageConstructorOption) {
  return new Badge(opt);
}
