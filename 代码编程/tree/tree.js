class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
function insertLeft(cur, val) {
  if (val != null) {
    cur.left = new TreeNode(val);
    return cur.left;
  }
}
function insertRight(cur, val) {
  if (val != null) {
    cur.right = new TreeNode(val);
    return cur.right;
  }
}
function build(nodes) {
  let root = new TreeNode(nodes[0]);
  let result = [];
  result.push(root);
  let i = 0;
  while (result.length) {
    let cur = result.shift();
    if (cur !== null) {
      if (i < nodes.length) {
        result.push(insertLeft(cur, nodes[i + 1]));
        result.push(insertRight(cur, nodes[i + 2]));
      }
      i += 2;
    }
  }
  return root;
}
let tree = build([1, 2, 3, 4, null, 6, null, null, 9]);

// 1.1 广度计算二叉树深度
function deepHeight(tree) {
  var maxHeight = 0;
  var queue = [];
  queue.push(tree);
  while (queue.length) {
    var queLen = queue.length;
    for (var i = 0; i < queLen; ++i) {
      var node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    maxHeight++;
  }
  return maxHeight;
}
// 1.2 深度自上而下递归计算二叉树深度
function deepHeight2(tree) {
  var maxHeight = 0;
  function loop(tree, deep) {
    if (tree == null) {
      return;
    }
    if (tree.left == null && tree.right == null) {
      maxHeight = Math.max(maxHeight, deep);
    }
    loop(tree.left, deep + 1);
    loop(tree.right, deep + 1);
  }
  if (tree === null) {
    return 0;
  }
  loop(tree, 1);
  return maxHeight;
}
// console.log("111", deepHeight2(tree));
// 1.3 深度自下而上递归计算二叉树深度
function deepHeight3(tree) {
  if (tree == null) {
    return 0;
  }
  const leftH = deepHeight3(tree.left);
  const rightH = deepHeight3(tree.right);
  console.log("leftHleftHleftHleftHleftH", leftH, rightH);
  return 1 + Math.max(leftH, rightH);
}
console.log("ddddd", deepHeight3(tree));
