function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
let g = gen();
console.log(g.next()); // >  { value: 1, done: false }
console.log(g.next()); // >  { value: 2, done: false }
console.log(g.next()); // >  { value: 3, done: false }
console.log(g.next()); // >  { value: undefined, done: true }

// 经过babel编译后
/*
function gen() {
  return _regeneratorRuntime().wrap(function gen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
          _context.next = 4;
          return 2;

        case 4:
          _context.next = 6;
          return 3;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var g = gen();
console.log(g.next()); // >  { value: 1, done: false }

console.log(g.next()); // >  { value: 2, done: false }

console.log(g.next()); // >  { value: 3, done: false }

console.log(g.next()); // >  { value: undefined, done: true }
*/

var context = {
  // 存储上下文
  next: 0,
  prev: 0,
  done: false,
  stop: function stop() {
    this.done = true;
  },
};
function genRun(_context) {
  while (1) {
    switch ((_context.prev = _context.next)) {
      case 0:
        _context.next = 2;
        return "1";

      case 2:
        _context.next = 4;
        return "2";

      case 4:
        _context.next = 6;
        return "3";

      case 6:
      case "end":
        return _context.stop();
    }
  }
}

function generator() {
  // 定义一个gen函数
  return {
    next: function () {
      // 添加一个next对象返回 value  done两个key值
      return {
        value: context.done ? undefined : genRun(context),
        done: context.done,
      };
    },
  };
}

var g2 = generator();

console.log(g2.next()); // >  { value: 1, done: false }
console.log(g2.next()); // >  { value: 2, done: false }
console.log(g2.next()); // >  { value: 3, done: false }
console.log(g2.next()); // >  { value: undefined, done: true }
