import BaseManage from './base';
import {
  IAnyObject,
  ITableViewManagerConstructorOption
} from '../types';

export class TableView extends BaseManage {
  // @ts-ignore
  private data: IAnyObject;
  // @ts-ignore 
  readonly isTableView: boolean = true;

  constructor(opt?: ITableViewManagerConstructorOption) {
    super(opt);
    this.data = opt?.data || {};
  }

  get prefix() {
    return 'debug:tableview-' + this.id;
  }
}

export function createTableView(opt?: ITableViewManagerConstructorOption) {
  return new TableView(opt);
}
