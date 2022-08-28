## 概述

promise 是一种异步解决方案, 相比传统的回调函数会更加合理，promise 可以想象成一个黑子容器，里面包括了未来要结束的事

## 特点

- 有三种状态，pedding、resolve、reject 一旦从 pedding 到 resolve 或者 reject 是不能回退的
- 状态的改变只有靠 resolve, reject 来改变，不受到其他因素影响

## 缺点

- promise 是无法取消的,一旦新建会立即执行
- promise 内部错误了不会抛出错误，
- 状态的改变无法跟踪

## code 示例

```js
var p = new Promise((resolve, reject) => {
  if (xx) {
    resolve();
  } else {
    reject();
  }
});
p.then(
  (d) => {
    console.log("sucess", d);
  },
  (err) => {
    console.log("error", err);
  }
);
/*
  1. promise是一个构造函数, 参数一个回调函数，回调函数中接收resolve,reject
  2. resolve为了让pending 变为 resolved
  3. reject为了让pending 变为 rejected
*/
```

## api

- constructor：回调函数

- 静态方法：all、 race、resolve、reject

- 原型方法：then catch
