import BaseManage from './base';
import {
  IAnyObject,
  IJsonViewManagerConstructorOption
} from '../types';

export class JsonView extends BaseManage {
  // @ts-ignore
  private data: IAnyObject;
  // @ts-ignore
  private editable: boolean;
  // @ts-ignore
  // -1 表示全部展开，0 表示全部折叠，正数表示展开的层级数
  private expandLevel: number;

  constructor(opt?: IJsonViewManagerConstructorOption) {
    super(opt);
    this.data = opt?.data || {};
    this.editable = opt?.editable || false;
    this.expandLevel = opt?.expandLevel || -1;
  }

  get prefix() {
    return 'debug:jsonview-' + this.id;
  }
}

export function createJsonView(opt?: IJsonViewManagerConstructorOption) {
  return new JsonView(opt);
}
