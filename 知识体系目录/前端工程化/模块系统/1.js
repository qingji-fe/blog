var a = 1;
function fn() {}
var obj = {
  key1: 123,
  key2: 456,
};

// exports.fn = fn;
// exports.obj = obj;

module.exports = {
  a,
  fn,
};

exports.obj = obj;
