/*
  1. 构造函数实现
  2. 原型then实现
  3. 支持promise内部的异步任务  使用成功、错误队列实现
  4. then的链式调用
      then返回一个新的promise，保存上一个的实例, 用上一个promise的结果来判断 
  5. 值的穿透
      当我传入到then的参数不是一个函数时候，then是无效的, 返回值用的是上一个promise的返回值
*/
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

class MyPromise {
  constructor(exector) {
    this.status = PENDING;
    this.value = undefined; // 方便this查看
    this.reason = undefined; // 方便this查看

    this.onFulfilledQueues = [];
    this.onRejectedQueues = [];

    const resolve = (value) => {
      // 调用成功
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledQueues.forEach((fn) => {
          fn(this.value);
        });
      }
    };
    const reject = (reason) => {
      // 调用错误
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedQueues.forEach((fn) => {
          fn(this.reason);
        });
      }
    };
    try {
      exector(resolve, reject);
    } catch (error) {
      reject(e);
    }
  }

  static all() {}
  static race() {}
  static resolve() {}
  static reject() {}
  // then(onFulfilled, onRejected) {
  //   setTimeout(() => {
  //     if (this.status === PENDING) {
  //       this.onFulfilledQueues.push(onFulfilled);
  //       this.onRejectedQueues.push(onRejected);
  //     } else if (this.status === FULFILLED) {
  //       onFulfilled(this.value);
  //     } else if (this.status === REJECTED) {
  //       onRejected(this.reason);
  //     }
  //   });
  // }
  then(onFulfilled, onRejected) {
    if(typeof onFulfilled !== 'function') {
      onFulfilled = function(value) {
        return value
      }
    }
    if(typeof onRejected !== 'function') {
      onRejected = reason => { throw new Error(reason instanceof Error ? reason.message:reason) }
    }
    var that = this;
    console.log("上一个的promise", this);
    return new MyPromise((resolve, reject) => {
      console.log("上一个的promise", that);
      if (that.status === PENDING) {
        that.onFulfilledQueues.push(() => {
          try {
            setTimeout(() => {
              // 上一个promise的返回值
              const preRes = onFulfilled(that.value);
              if (preRes instanceof MyPromise) {
                preRes.then(resolve, reject);
              } else {
                resolve(preRes);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
        that.onRejectedQueues.push(() => {
          try {
            setTimeout(() => {
              // 上一个promise的返回值
              const preReason = onRejected(that.reason);
              if (preReason instanceof MyPromise) {
                preReason.then(resolve, reject);
              } else {
                resolve(preReason);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      } else if (that.status === FULFILLED) {
        setTimeout(() => {
          try {
            const curRes = onFulfilled(that.value);
            curRes instanceof MyPromise
              ? curRes.then(resolve, reject)
              : resolve(curRes);
          } catch (e) {
            reject(e);
          }
        });
      } else if (that.status === REJECTED) {
        setTimeout(() => {
          try {
            const curRes = onRejected(that.reason);
            curRes instanceof MyPromise
              ? curRes.then(resolve, reject)
              : resolve(curRes);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
var a = new MyPromise((resolve, reject) => {
  // setTimeout(() => resolve(1), 1000);
  // setTimeout(() => reject(0), 1000);
  resolve(1);
});
// var a2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve(2222), 1000);
//   // setTimeout(() => reject(0), 1000);
//   // resolve(1);
// });
a.then(9).then(
  (d2) => {
    console.log("结果2222", d2);
  },
  (err2) => {
    console.log("错误2222", err2);
  }
);
