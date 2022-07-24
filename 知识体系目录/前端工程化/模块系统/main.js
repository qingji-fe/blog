// var res = require("./1.js");
// // console.log("这时候的res", res);
// // res.a = "改变了";
// // res.obj["key1"] = 888;

// // console.log("查看现在对象", res);
// // var res2 = require("./1.js");
// // console.log("查看源对象", res2);

// console.log("这时候的res", res);

// res.a = "改变了";
// console.log("查看现在对象", res);

// var res2 = require("./1.js");
// console.log("查看源对象", res2);

console.log("main starting");
const a = require("./a.js");
const b = require("./b.js");
console.log("in main, a.done = %j, b.done = %j", a.done, b.done);

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
