import BaseManage from './base';
import {
  FormRuleType,
  IAnyObject,
  IFormRuleManageConstructorOption
} from '../types';

export class FormRule extends BaseManage {
  // @ts-ignore
  private title: string;
  // @ts-ignore
  private desc: string;
  // @ts-ignore
  private meta: string | number;
  // @ts-ignore
  private type: FormRuleType;
  // @ts-ignore
  private state: IAnyObject;

  constructor(opt: IFormRuleManageConstructorOption) {
    super(opt);
    this.title = opt.title || '';
    this.desc = opt.desc || '';
    this.meta = opt.meta || '';
    this.type = opt.type || '';
    this.state = opt.state || {};
  }

  get prefix() {
    return 'debug:rule-' + this.id;
  }
}

export function createFormRule(opt: IFormRuleManageConstructorOption) {
  return new FormRule(opt);
}
