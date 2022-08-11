## 前言背景

- webpack 是目前前端工程化中必不可少的打包工具，webpack 最核心的是 Compiler 和 Compilation 两个对象
- 在整个 webpack 编译的过程中, 是通过 **Tapable** 实现了在编译过程中的一种发布订阅者模式的插件 Plugin 机制

## Api 介绍

- 同步钩子

  - SyncHook

    同步执行钩子

  - SyncBailHook

    阻止后续钩子执行（返回一个不为 undefined）

  - SyncWaterfallHook

    第一个钩子 return 作为下一个钩子的参数

  - SyncLoopHook

    循环执行钩子

- 异步钩子

  - AsyncParallelHook

    异步并行执行

  - AsyncParallelBailHook

    异步阻止其他执行（按照执行完毕时间）

  - AsyncSeriesHook

    异步串行执行

  - AsyncSeriesBailHook

    异步串行阻止其他

  - AsyncSeriesWaterfallHook

    串行执行前一个返回值，作为后一个的参数

## Api 示例

```js
import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} from "tapable";

// 1. 同步钩子hook
const hook1 = new SyncHook(); // 创建钩子对象

hook1.tap("a", () => {
  console.log("log1111");
});
hook1.tap("b", () => {
  console.log("log2222");
});
// hook1.call();

// 2.  同步钩子hook传递参数
const hook2 = new SyncHook(["parms"]); // 创建钩子对象

hook2.tap("a", (parms) => {
  console.log("log1111", parms);
});
hook2.tap("b", (parms) => {
  console.log("log2222", parms);
});
// hook2.call("a");

// 3.  同步钩子hook传递参数
const hook3 = new SyncBailHook(); // 创建钩子对象

hook3.tap("a", () => {
  console.log("log1111");
  return 1; // 这里return一个非undefined的值就不在执行下面注册的b  c了
});
hook3.tap("b", () => {
  console.log("log2222");
});
hook3.tap("c", () => {
  console.log("log3333");
});

// hook3.call();

// 4.  同步钩子hook传递参数
const hook4 = new SyncBailHook(["parms"]); // 创建钩子对象

hook4.tap("a", (parms) => {
  console.log("log1111", parms);
  return 1; // 这里return一个非undefined的值就不在执行下面注册的b  c了
});
hook4.tap("b", (parms) => {
  console.log("log2222", parms);
});
hook4.tap("c", (parms) => {
  console.log("log3333", parms);
});

// hook4.call("参数");

// 5.  同步钩子hook传递参数
const hook5 = new SyncWaterfallHook(["parms"]);
hook5.tap("a", (parms) => {
  console.log("log1111", parms);
  return `${parms}+1`;
});
hook5.tap("b", (parms) => {
  console.log("log2222", parms);
  return `${parms}+2`;
});
hook5.tap("c", (parms) => {
  console.log("log3333", parms);
});

// hook5.call("参数");

// 6.  同步钩子hook传递参数
let index = 0;
const hook6 = new SyncLoopHook(["parms"]);
hook6.tap("a", (parms) => {
  console.log("log1111", parms);
  if (index < 5) {
    index++;
    return 1;
  }
});

// hook6.call("参数");

// 7.  异步并行执行钩子hook
const hook7 = new AsyncParallelHook();
hook7.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback();
  }, 1000);
});
hook7.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 1000);
});

// hook7.callAsync(() => {
//   console.log("all完成");
// });

// 8. 异步并行执行钩子hook
const hook8 = new AsyncParallelBailHook();
hook8.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback("aaa");
  }, 1000);
});
hook8.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback("bbbb");
  }, 2000);
});
// hook8.callAsync((res) => {
//   console.log("all完成", res);
// });

// 9. 异步串行执行钩子hook
const hook9 = new AsyncSeriesHook();
hook9.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback();
  }, 1000);
});
hook9.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 2000);
});
// hook9.callAsync((res) => {
//   console.log("all完成", res);
// });

// 10. 异步串行执行钩子hook
const hook10 = new AsyncSeriesBailHook();
hook10.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback("000000");
  }, 1000);
});
hook10.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 2000);
});
// hook10.callAsync((res) => {
//   console.log("all完成", res);
// });

// 11. 异步串行执行钩子hook返回值透传
const hook11 = new AsyncSeriesWaterfallHook(["parms"]);
hook11.tapAsync("a", (parms, callback) => {
  setTimeout(() => {
    console.log("aaa", parms);
    callback();
  }, 1000);
});
hook11.tapAsync("b", (parms, callback) => {
  setTimeout(() => {
    console.log("bbbb", parms);
  }, 2000);
});
hook11.callAsync("参数", (res) => {
  console.log("all完成", res);
});
```

## 实现原理

### 简单实现下 V1

```js
class SyncHook {
  constructor(args = []) {
    this.taps = [];
  }
  tap(name, fn) s{
    this.taps.push(fn);
  }
  call(...args) {
    for (let i = 0; i < this.taps.length; i++) {
      this.taps[i](...args);
    }
  }
}
var hook = new SyncHook();
hook.tap("a", (parms) => {
  console.log("log1111", parms);
});
hook.tap("b", (parms) => {
  console.log("log2222", parms);
});

hook.call("参数");





class SyncBailHook {
  constructor(args = []) {
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call(...args) {
    for (let i = 0; i < this.taps.length; i++) {
      const res = this.taps[i](...args);
      if (res !== undefined) {
        return res;
      }
    }
  }
}
var hook2 = new EasySyncBailHook();
hook2.tap("a", (parms) => {
  console.log("log1111", parms);
  return 1;
});
hook2.tap("b", (parms) => {
  console.log("log2222", parms);
});

hook2.call("参数");

```

- 基本是一个标准的发布订阅模式实现方式,但是也存在些问题

- tap 是一样的, call 方法 90%的相似, 代码冗余

### 简单实现下 V2

> 抽取通用基类

```js
class Hook {
  constructor(args = []) {
    this.args = args;
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
}
function SyncHook(args = []) {
  var hook = new Hook(args)
  return hook
}
SyncHook.prototype.call = fucntion() {

}
// 子类中实现自己的call
```

```js
// 基类做通用的call
const CALL_DELEGATE = function (...args) {
  this.call = this.createCall();
  return this.call(...args);
};
class Hook {
  constructor(args = []) {
    this.args = args;
    this.taps = [];
    this.call = CALL_DELEGATE;
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  createCall() {
    return this.callInterface({
      //通过接口调用子类的 返回真正子类使用的call
      taps: this.taps,
      args: this.args,
    });
  }
}
function SyncHook(args = []) {
  const hook = new Hook(args);
  hook.constructor = SyncHook;
  hook.callInterface = function (options) {
    const { taps } = options;
    const call = function (...args) {
      for (let i = 0; i < taps.length; i++) {
        this.taps[i](...args);
      }
    };

    return call;
  };
  return hook;
}
SyncHook.prototype = null;
// 子类中使用callInterface接口
```

- 每一个子类基于 callInterfase 接口实现了几乎相同的代码段

### 简单实现下 V3

```js
class HookCodeFactory {
  constructor() {
    this.options = undefined;
    this._args = undefined;
  }
  init(options) {
    this.options = options;
    this._args = options.args.slice();
  }

  setup(instance, options) {
    instance._x = options.taps.map((t) => t);
  }

  create(options) {
    console.log("规范热", options);
    this.init(options);
    const { taps } = options;
    let code = "";
    let fn;
    for (let i = 0; i < taps.length; i++) {
      code += `
             var _fn${i} = _x[${i}];
             _fn${i}(${this._args.join(",")});
         `;
    }
    const allCodes =
      `
     "use strict";
     var _x = this._x;
 ` + code;

    fn = new Function(this._args.join(","), allCodes);
    return fn;
  }
}
const factory = new HookCodeFactory();
const COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};

function SyncHook(args = []) {
  const hook = new Hook(args);
  hook.constructor = SyncHook;
  hook.callInterface = COMPILE;
  return hook;
}
SyncHook.prototype = null;
```

- 创建通用的代码段工厂

## 小结

### case 点

- tapable 是一个典型的发布订阅模式
- 对外提供了 4 个同步钩子 5 个异步(串行、并行)钩子
- 使用上
  - 先去实例化一个 hook 类
  - 在 hook 类上注册（tap）一些回调函数
  - 通过 hook 的分发（call）来触发执行回调函数
  - 在过程中可以添加拦截器
- 源码中存在的重复代码做了优雅的处理

### 实现

[参考](https://github.com/qingji-fe/tools/blob/main/easy-tapable/src/index.js)

[源码](https://github.com/webpack/tapable/blob/master/lib/Hook.js)
