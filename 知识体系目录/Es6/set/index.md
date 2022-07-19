## 概述

---

- set 数据结构类似一个数组
- 内部的成员都是唯一的, **不能重复**
- 有顺序的
- Set 本身是一个构造函数
- 可以接受一个 iterable 可迭代的对象(数组、 类数组、字符串)

## api

---

### 初始化

```javascript
var set = new Set();
var set2 = new Set([1, 2, 3, 1, 2, 3]);
console.log(set2); // Set(3) {1, 2, 3}
```

> - Set 是一个构造函数
> - Set 也可以传入一个数组（具有可迭代属性的数据结构）来初始化

### 操作方法

```javascript
var set = new Set();
set.add(1);
set.add(2).add(3); // Set(3) {1, 2, 3}
set.delete(1); // return true  set: Set(2) {2, 3}
set.has(1); // false
set.has(2); // true
set.size; //2
set.clear(); //  Set(0) {size: 0}
set.size; // 0
```

### 遍历方法

```javascript
var set = new Set();
set.add(1);
set.add(2).add(3); // Set(3) {1, 2, 3}
set.forEach((val) => {
  console.log(val); // 1 2 3
});
set.keys(); // SetIterator {1, 2, 3}
set.values(); // SetIterator {1, 2, 3}
set.entries(); // SetIterator {1 => 1, 2 => 2, 3 => 3}
```

> - forEach()没有返回值 遍历每一个元素
> - keys() 返回键 key 的 **Iterator 遍历器**
> - values() 返回键 value 的 **Iterator 遍历器**
> - entries()返回键 key=>value 的 **Iterator 遍历器**

## 常见使用场景

- 去重

```javascript
var arr = [1, 2, 3, 1, 2, 3];
var set = new Set(arr); //Set(3) {1, 2, 3}
var res = [...set]; // [1, 2, 3]
var res2 = Array.from(set); // [1, 2, 3]
```

- 交集

```javascript
var set1 = new Set([1, 2, 3]);
var set2 = new Set([2, 3, 4]);
var ret = new Set(
  [...set1].filter((i) => {
    return set2.has(i);
  })
);
var res = [...set]; // [2, 3]
```

- 并集

```javascript
var set1 = new Set([1, 2, 3]);
var set2 = new Set([2, 3, 4]);
var ret = new Set([...set1, ...set2]); // Set(4) {1, 2, 3, 4}
var res = [...set]; // [1, 2, 3, 4]
```

## 实现原理

- v1 基础属性方法

```javascript
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

var set = new Set();
set.add(1);
set.add(2).add(3); // Set(3) {1, 2, 3}
console.log(set);
set.delete(1); // return true  set: Set(2) {2, 3}

// set.has(1); // false
console.log(set.has(1));
console.log(set.has(2));
// set.has(2); // true
// set.size(); //2
set.clear(); //  Set(0) {size: 0}
console.log(set);
// set.size(); // 0
```

- v2 遍历方法

```javascript
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
  delete(val) {}
  has(val) {}
  clear() {}
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
```

- v3 接受迭代对象( 数组暴力解法)

```javascript
class Set {
  constructor(data) {
    this.size = 0;
    this.queue = [];
    data.forEach((item) => {
      this.add(item);
    });
  }
  add(val) {
    if (this.queue.indexOf(val) == -1) {
      this.queue.push(val);
      this.size += 1;
    }
    return this;
  }
  delete(val) {}
  has(val) {}
  clear() {}
  forEach(callback) {}
  values() {}
}

var set = new Set([1, 2, 3]); //Set {size: 3, queue: Array(3)}
```

> 直接遍历 data 暴力遍历执行 this.add

- v4 接受迭代对象(迭代对象)

```javascript
function actionAdd(data, callback) {
  let iterable, res;
  iterable = data[Symbol.iterator]();
  res = iterable.next();

  while (!res.done) {
    callback(res.value);
    res = iterable.next();
  }
}
class Set {
  constructor(data) {
    this.size = 0;
    this.queue = [];
    actionAdd(data, (item) => {
      this.add(item);
    });
  }

  add(val) {
    if (this.queue.indexOf(val) == -1) {
      this.queue.push(val);
      this.size += 1;
    }
    return this;
  }
  delete(val) {}
  has(val) {}
  clear() {}
  forEach(callback) {}
  values() {}
}

var set = new Set([1, 2, 3]); //Set {size: 3, queue: Array(3)}
```

## 小结

我是庆忌，本着基础进阶的初心，持续输出干货
欢迎来 star, 也欢迎来交流
