## 概述

---

set 数据结构类似一个数组, 内部的成员都是唯一的, **不能重复**

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
set.size(); //2
set.clear(); //  Set(0) {size: 0}
set.size(); // 0
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

## 实现原理
