const fs = require('fs')
const path = require('path');

const {
  parse
} = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core');



// var exports = {};
// (function (exports, code) {
//   eval(code)
// })(exports, code);

// 分析单个模块（文件） =》 把import语句进行转换
function getModuleInfo(file) {
  //  读取文件
  const body = fs.readFileSync(file, 'utf-8');


  //  => ast
  const ast = parse(body, {
    sourceType: "module"
  });


  // 收集依赖
  const deps = {}

  traverse(ast, {
    ImportDeclaration({
      node
    }) {
      //  计算绝对路径
      const dirname = path.dirname(file);
      const abspath = './' + path.join(dirname, node.source.value)

      // 存到依赖里
      deps[node.source.value] = abspath;
    }
  })

  // es6 => es5

  // const output = generateor(ast, null, body)
  const {
    code
  } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })

  const moduleInfo = {
    file,
    deps,
    code
  }
  return moduleInfo;
}

// 递归分析依赖
const getDeps = (arr, {
  deps
}) => {
  if (deps) {

    Object.keys(deps).forEach(item => {
      const info = getModuleInfo(item);
      console.log(info, 'info');
      arr.push(info);
      getDeps(arr, item)
    })
  }
}

// 模块解析
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry]; // 存放所有依赖
  const depsGraph = {}; // 依赖图
  getDeps(temp, entry); // 递归收集所有依赖

  temp.forEach(info => {
    depsGraph[info.file] = {
      deps: info.deps,
      code: info.code
    }
  })
  return depsGraph;
}
const f = parseModules('./index.js');
console.log(f);