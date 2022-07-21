class HashMap {
  constructor() {
    this.len = 8; // 桶的个数 初始化8个桶
    this.init();
  }
  init() {
    // 一个桶
    this.tong = new Array(this.len);
    for (let i = 0; i < this.tong.length; i++) {
      this.tong[i] = new Object();
      this.tong[i].next = null;
    }
  }
  has(key) {
    var hashVal = 0;
    if (typeof key === "string") {
      let strLen = key.length > 3 ? key.length : 3;
      for (let i = strLen - 3; i < strLen; i++) {
        hashVal += key[i] !== undefined ? key[i].charCodeAt() : 0;
      }
    } else if (typeof key == "object") {
      hashVal = 0;
    } else if (typeof key == "number") {
      hashVal = isNaN(key) ? 7 : key;
    } else {
      hashVal = 1;
    }
    return hashVal;
  }
  set(key, value) {
    var hash = this.has(key); // hash值
    let index = hash % this.len; // 获取这个key放在那个桶中
    let tongItem = this.tong[index];
    console.log("ggggg", this.tong, hash);

    let list = tongItem;
    while (list.next) {
      if (list.key === key) {
        list.value = value;
        return;
      } else {
        list = list.next;
      }
    }
    if (list?.key === key) {
      list.value = value;
      return list;
    } else {
      list.next = { key, value, next: null };
    }
    return list;
  }
  get(key) {
    var hash = this.has(key); // hash值
    let index = hash % this.len;
    let tongItem = this.tong[index]; // 直接获取具体第几个桶
    console.log("获取", this.tong, tongItem, hash % this.len);
    let list = tongItem;
    while (list) {
      if (list.key === key) {
        return list.value;
      } else {
        list = list.next;
      }
    }
    return;
  }
  delete(key) {
    var hash = this.has(key); // hash值
    let index = hash % this.len;
    let tongItem = this.tong[index]; // 直接获取具体第几个桶
    let list = tongItem;
    while (list) {
      if (list.next.key == key) {
        list.next = list.next.next;
        return true;
      } else {
        list = list.next;
      }
    }
  }
}

var m = new HashMap();
// m.set({ ddd: 34 }, 1);
m.set("ddd", 2);

// m.set("dddaf", 3);
// m.set("aaasadfra", 4);
// m.set("trew", 5);
// m.set("ajhtraaa", 6);
// m.set("oiuy", 7);
// m.set("sdfg", 8);

console.log("qqqqj", m);
// m.delete("ddd");
console.log("删除", m);
// console.log("qqqqjdddddddd", m.get("ddd"));
