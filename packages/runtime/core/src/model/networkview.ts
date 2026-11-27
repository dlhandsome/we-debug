import BaseManage from './base';
import {
  INetworkViewManagerConstructorOption,
  INetworkViewHandler
} from '../types';

export class NetworkView extends BaseManage {
  public handler: INetworkViewHandler;
  // @ts-ignore 
  readonly isNetworkView: boolean = true;

  constructor(opt?: INetworkViewManagerConstructorOption) {
    super(opt);
    this.handler = opt?.handler || {};
  }

  get prefix() {
    return 'debug:networkview-' + this.id;
  }
}

export function createNetworkView(opt?: INetworkViewManagerConstructorOption) {
  return new NetworkView(opt);
}
