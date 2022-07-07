class Set {
  constructor() {
    this.size = 0;
    this.queue = [];
  }
  add(val) {
    if (this.queue.indexOf(val) == -1) {
      this.queue.push(val);
      this.size += 1;
    }
    return this;
  }
  delete(val) {
    var index = this.queue.indexOf(val);
    if (index == -1) {
      return false;
    }
    this.queue.splice(index, 1);
    this.size -= 1;
  }
  has(val) {
    var index = this.queue.indexOf(val);
    if (index == -1) {
      return false;
    } else {
      return true;
    }
  }
  clear() {
    this.queue = [];
    this.size = 0;
  }
}
// var set = new Set();
// set.add(1);
// set.add(2).add(3); // Set(3) {1, 2, 3}
// console.log(set);
// set.delete(1); // return true  set: Set(2) {2, 3}

// // set.has(1); // false
// console.log(set.has(1));
// console.log(set.has(2));
// // set.has(2); // true
// // set.size(); //2
// set.clear(); //  Set(0) {size: 0}
// console.log(set);
// // set.size(); // 0
