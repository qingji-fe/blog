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
function forOf(iteratorObj, fn) {
  let iterator = iteratorObj[Symbol.iterator]()
  let i = iterator.next()
  while(!i.done) {
    fn(i.value)
  }
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
  values2() {
   
    myForOf(map, ([key, value]) => {
      console.log(key, value)
    })
   
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
