## 概述

- 类似对象的一种数据结构
- 键（key）是不限制类型的
- 类似的（value-value）的对应而非（key-value）的对应

## api

---

### 初始化

```js
var map = new Map();
console.log(map); //Map(0) {size: 0}
```

### 操作方法

```javascript
var map = new Map();
map.set("key", 1); // Map(1) {'key' => 1}
map.get("key"); // 1
map.get("key1"); //undefined
map.size; // 1
map.delete("key"); // true
map.delete("key1"); // false
map.size; //0
map.clear(); // undefined
map.has("key"); // false
```

### 遍历方法

```javascript
var map = new Map();
map.set("key1", 1);
map.set("key2", 2);
map.set("key3", 3);

//  下面👇🏻是返回迭代器
map.keys(); // MapIterator {'key1', 'key2', 'key3'}
map.values(); // MapIterator {1, 2, 3}
map.entries(); // MapIterator {'key1' => 1, 'key2' => 2, 'key3' => 3}
map.forEach((i) => {
  console.log(i); //1 2 3
});
```

## 使用场景

- if else 写法优化(策略模式)
- key（键）不确定类型

```js
// 原始写法
function test(count) {
  if (count === 1) {
    //xxx
  } else if (count === 2) {
    //xxx
  } else if (count === 3) {
    //xxx
  } else if (count === 4) {
    //xxx
  } else if (count === 5) {
    //xxx
  }
  // ....
}

// 使用map优化

const actions = new Map([
  [
    { status: 1 },
    () => {
      //xxx
    },
  ],
  [
    { status: 2 },
    () => {
      //xxxx
    },
  ],
]);
function testmap(status) {
  let actionFilter = [...actions].filter(([key, value]) => {
    return key.status == status;
  });
  actionFilter.forEach(([key, value]) => value.call(this));
}
// testmap(1)
// testmap(2)

// 来源：https://juejin.cn/post/6844903705058213896
```

## 实现原理

- v1(基础 api 实现)使用非底层的（顺序表的 array）

```js
function defaultToString(key) {
  if (key === null) {
    return "NULL";
  } else if (key === undefined) {
    return "UNDEFINED";
  } else if (
    Object.prototype.toString.call(key) === "[object Object]" ||
    Object.prototype.toString.call(key) === "[object Array]"
  ) {
    return JSON.stringify(key);
  }
  return key.toString();
}
class Map {
  constructor() {
    this.size = 0;
    this.queue = {};
  }
  has(key) {
    return this.queue[defaultToString(key)] !== undefined;
  }
  set(key, value) {
    if (!this.has(key)) {
      this.queue[defaultToString(key)] = value;
      this.size++;
    }
    return this;
  }
  get(key) {
    return this.queue[defaultToString(key)];
  }
  delete(key) {
    if (this.has(key)) {
      delete this.queue[key];
      this.size--;
    }
    return this;
  }
  clear() {
    this.size = 0;
    this.queue = {};
  }
  keys() {
    let keys = [];
    for (let key in this.queue) {
      if (this.has(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
  values() {
    let values = [];
    for (let key in this.queue) {
      if (this.has(key)) {
        values.push(this.queue[key]);
      }
    }
    return values;
  }
}

var map = new Map();
map.set("sss", 1);
map.set("sss111111", 1);
map.set([12, 3, 4], 1);
// map.has("sss");
// map.get("sss");

console.log("mapmapmapmap", map, map.has("sss"), map.get("sss"));
map.delete("sss111111");

console.log("mapmapmapmap", map, map.has("sss"), map.get("sss"));
```

- v2 基于底层

  ###
