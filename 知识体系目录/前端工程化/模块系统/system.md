## 实际 case

### 加载 js 脚本

```js
<script>console.log("111")</script>
```

### 加载 es6 模块

```js
<script type="module">
  import('./system-es6.js') .then((module) => {console.log("module", module)});
</script>
```

> import() 方法也只是一个草案，有些浏览器也不是完全兼容

## 加载模块的原理

利用 script 加载 这个在 webpack 系列中会详细讲

## systemjs

### 概述

- 是一个通用的动态模块加载器，它能在浏览器上动态加载模块

### 如何使用

```js
// 通过imports导入需要的模块
<script type="systemjs-importmap">
  {
    "imports": {
      "lodash": "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js"
    }
  }
</script>

```
