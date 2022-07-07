var makeIterator = function (array, iterator) {
  var nextIndex = 0;

  // new Set(new Set()) 会调用这里
  var obj = {
    next: function () {
      return nextIndex < array.length
        ? { value: iterator(array[nextIndex++]), done: false }
        : { value: void 0, done: true };
    },
  };

  // [...set.keys()] 会调用这里
  obj[Symbol.iterator] = function () {
    return obj;
  };

  return obj;
};

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
  forEach(callback) {
    for (var i = 0; i < this.queue.length; i++) {
      callback.call(this, this.queue[i], this.queue[i]);
    }
  }
  values() {
    function callback(val) {
      console.log("log", val);
    }
    var that = this;
    var nextIndex = 0;
    var interatorObj = {
      next: function () {
        return nextIndex < that.queue.length
          ? { value: callback(that.queue[nextIndex++]), done: false }
          : { value: undefined, done: true };
      },
    };

    // 模拟一个可迭代的对象
    interatorObj[Symbol.iterator] = function () {
      return interatorObj;
    };
    return interatorObj;
  }
}

var set = new Set();
set.add(1);
set.add(2).add(3); // Set(3) {1, 2, 3}

// set.forEach((val, key) => {
//   console.log("res", val, key);
// });
var a = set.values();
a.next();
a.next();
