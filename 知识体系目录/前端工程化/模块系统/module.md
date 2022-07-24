## 模块化概述

### 什么是模块化

举个例子：

1. 我们房子内部结构包括了（厨房、卫生间、卧室、客厅等） 这每一个都可看做是一个模块(厨房里面的锅碗瓢盆是属于在厨房的) 这些模块共同组成房子
2. 写代码时候一个（layout 为例）页面包括了（顶部导航、侧边栏、内容、页脚）同样这些个独立的组件组成了一个 layout

所以理解模块化

- 将程序（某东西）分割成一个个互相有关系的模块，然后将模块可以链接组合起来
- 这些模块里面有自己的作用域，有自己的规范，自己逻辑
- 这些模块也可以暴露自己的变量给其他模块来使用

早期我们代码的写法

```js
  //1. js
  var a = 1

  //2.js
  var a = 2

  //main.html
  <script src='1.js'></script>
  <script src='2.js'></script>

  /*
    a等于多少那？
    其实会出现覆盖的问题 做不到每一个js都是独立的
  */
```

早期代码解法

```js
// 1.js
(function A() {
  var a = 1;
  return { a };
})();
// 2.js
(function B() {
  var a = 2;
  return { a };
})();
/*
  这里有一个问题就是虽然用自执行函数解决了命名冲突问题
    不优雅： 每一个代码都要用自执行函数来包裹
    不规范： 需要每一个代码编写人员来规范，存在模块的导出命名规范不统一
*/
```

## AMD、CMD、CommonJS、ES6 模块规范

### Commonjs 规范

- 是一种规范，
- node 是 commonjs 规范在服务端的实现
- browder 是 commonjs 规范在浏览器端的实现

#### node case

```js
// 1.js
var a = 1;
function fn() {}
exports.a = a;
exports.fn = fn;

// main.js
const res = require("1.js");
console.log("结果", res); // { a: 1, fn: [Function: fn] }
```

#### exports 说明

- exports 导出的是一个对象, 可以在这个对象上挂载多个属性
- mainJS 的 res 和 exports 是同一个引用
- res 是对 exports 的一个浅拷贝

#### module.exports 说明

- 在 commonjs 中其实是没有 module.exports
- node 中使用的是 Module 模块，每一个模块背后都是一个 var module = new Module()的实例,其实是 module.exports， 在模块中约等于是 var exports = module.exports
- 为了使用规范使用 exports(对 module.exports 对象的引用)require 的配套
- 在使用时候不能直接给 exports 和 module.exports 赋值，会切断引用链接

#### require 说明

- 每一个文件就是一个模块， 每一个 require('./1.js')是对每一个文件的全部引入
- 模块多次被 require 时候，会在第一次 require 后剩下都从缓存中获取

#### require 查找规则

- 内部

  ```js
  var p = require("path");
  var h = require("http");

  /*
    这些都是内部核心模块,不需要路径拼写直接用
  */
  ```

- 外部

  ```js
  var a = require("files/xx"); //按照路径
  var a = require("files/xx.js"); //按照路径
  /*
    会当做文件在本目录中查找
      有后缀名字，直接找就行
      没有后缀名字，按照js、json、node的后缀顺序查找
      
      如果没有找到就按照files目录下的index.js、index.json、index.node来查找index
  */

  var a = require("xx"); // xx不是路径 也不是内部核心模块
  /*
    会在当前package.json中查找， 找不到就上一层node_modules，层层到全局的node_modules中
    在package.json中按照main或者目录的默认index.js文件
  */
  ```

#### require 循环加载（node 官方示例）

```js
// a.js
console.log("a starting");
exports.done = false;
const b = require("./b.js");
console.log("in a, b.done = %j", b.done);
exports.done = true;
console.log("a done");

// b.js
console.log("b starting");
exports.done = false;
const a = require("./a.js");
console.log("in b, a.done = %j", a.done);
exports.done = true;
console.log("b done");

// main.js
console.log("main starting");
const a = require("./a.js");
const b = require("./b.js");
console.log("in main, a.done = %j, b.done = %j", a.done, b.done);

// 结果输出
/*
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
*/

// 结果步骤分析
/*
  1. mainjs开始执行   console.log("main starting");
  2. const a = require("./a.js");  console.log("a starting"); exports.done = false;   
      2.1 执行const b = require("./b.js"); 加载b脚本
  3. const b = require("./b.js");  console.log("b starting"); exports.done = false;
      3.1 执行const a = require("./a.js"); 加载a脚本 发现循环了就不在加载a了
      3.2 执行console.log("in b, a.done = %j", a.done);  
      3.3 console.log("b done");
  4. b执行完毕，回到a执行 console.log("in a, b.done = %j", b.done);
      4.1 console.log("a done");
  5. a执行完毕，回到main const b = require("./b.js"); 加载b脚本 已经加载了就不在加载b了
      5.1 console.log("in main, a.done = %j, b.done = %j", a.done, b.done);
*/
```

### Es6 模块

- es6 的规范完全胜任了浏览器、服务端, 成为了一个通用的规范
- es6 模块编译时候完成加载,确定模块依赖关系
- 在模块中 this 是 undefined

#### 语法

```js
  export
  import
  // 两个配套使用

//index.js 首先要暴露模块
export default index

//main.js中引入模块
import index from './index.js'



//也可以使用分别暴露的方式 暴露多了模块
//index.js
export const index1 = 'index1'
export const index2 = 'index2'

//main.js
import { index1 , index2 } from './index.js'

```

#### 和 commonjs 区别

- commonjs 模块输出的是一个值的拷贝，es6 模块输出的是值的引用
- commonjs 模块是在运行时加载，es6 模块是编译时加载
- commonjs 模块导出一个， es6 模块导出多个
- commonjs 模块中可以编写 if 判断语句， es6 模块静态语法只能写顶层
- commonjs this 是当前模块，es6this 是 undefined
