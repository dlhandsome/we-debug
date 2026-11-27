import BaseManage from './base';
import {
  IApiViewManagerConstructorOption,
  IApiViewHandler
} from '../types';

export class ApiView extends BaseManage {
  public handler: IApiViewHandler;
  // @ts-ignore 
  readonly isApiView: boolean = true;

  constructor(opt?: IApiViewManagerConstructorOption) {
    super(opt);
    this.handler = opt?.handler || {};
  }

  get prefix() {
    return 'debug:apiview-' + this.id;
  }
}

export function createApiView(opt?: IApiViewManagerConstructorOption) {
  return new ApiView(opt);
}
