export class Store {
  constructor() {
    this.store = {};
  }

  set(k, v) {
    this.store[k] = v;
  }

  get(k) {
    return typeof this.store[k] === 'function' ? this.store[k]() : this.store[k];
  }

  getAll() {
    Object.keys(this.store).forEach(k => {
      this.store[k] = typeof this.store[k] === 'function' ? this.store[k]() : this.store[k];
    });
    return this.store;
  }
}
