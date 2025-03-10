import {
  IBaseModel
} from '../types';

export class MySet<T extends IBaseModel> {
  private arr: T[];

  constructor() {
    this.arr = [];
  }

  get() {
    return this.arr;
  }

  getById(id: number) {
    return this.arr.find(s => s.id === id);
  }

  add(s: T) {
    this.arr = this.arr.concat(s);
  }

  remove(s: T) {
    let i = this.arr.length;
    while (i--) {
      let tmp = this.arr[i];
      if (tmp.id === s.id) {
        this.arr.splice(i, 1);
        break;
      }
    }
  }

  update(s: T) {
    const index = this.arr.findIndex(item => item.id === s.id);
    if (index !== -1) {
      this.arr[index] = s;
    }
  }
}
