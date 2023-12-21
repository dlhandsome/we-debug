export class MySet {
  constructor() {
    this.arr = [];
  }

  get() {
    return this.arr;
  }

  getById(id) {
    return this.arr.find(s => s.id === id);
  }

  add(s) {
    this.arr = this.arr.concat(s);
  }

  remove(s) {
    let i = this.arr.length;
    while (i--) {
      let tmp = this.arr[i];
      if (tmp === s) {
        this.arr.splice(i, 1);
        break;
      }
    }
  }
}
