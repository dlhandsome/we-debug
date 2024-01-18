import { IAnyObject } from "../types";

export class Store {
  protected store: IAnyObject;

  constructor() {
    this.store = {};
  }

  set(k: string, v: any) {
    this.store[k] = v;
  }

  get(k: string) {
    return typeof this.store[k] === 'function' ? this.store[k]() : this.store[k];
  }

  getAll() {
    Object.keys(this.store).forEach(k => {
      this.store[k] = typeof this.store[k] === 'function' ? this.store[k]() : this.store[k];
    });
    return this.store;
  }
}
