
// 等于eval
function createFunction (code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err, code });
    return () => {};
  }
}

function createCompileToFunctionFn(compileFn) {
  const cache =  Object.create(null);
  return function compileToFunctions(templateStr, compilerOptions/* optional */, vm/* optional */) {
    compilerOptions = Object.assign({}, compilerOptions);
    // 1. 读取缓存中的CompileFunctionResult对象
    const key = compilerOptions.delimiters ? String(compilerOptions.delimiters) + templateStr : templateStr;
    if(cache[key]) {
      return cache[key];
    }
    // 2. 把模板编译为编译对象（render, staticRenderFns）,字符串形式的js代码
    const compiled = compile(templateStr, compilerOptions);

    if(compiled.tips?.length) {
      if(compilerOptions.outputSoutceRange) {
        compiled.tips.forEach(e => tip(e.msg, vm));
      } else {
        compiled.tips.forEach(msg => tip(msg, vm));
      }
    }

    const res = {};
    const fnGenErrors = {};
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.startcRenderFns.map(code => {
      return createFunction(code, fnGenErrors);
    });
    return (cache[key] = res);
  };
}


// baseCompilerOptions + CompilerOptions = baseCompileFn的参数
function createCompilerCreator(baseCompileFn) {
  // baseCompilerOptions 平台参数
  return function createCompiler(baseCompilerOptions) {
    // 用户传入的参数
    function compile(templateStr, CompilerOptions) {
      // 把平台options当成原型
      const finalOptions = Object.create(baseCompilerOptions);
      const errrors = [];
      const tips = [];

    }
    return {
      compile,
      // createCompileToFunctionFn 模板编译入口
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}

const createCompiler =  createCompilerCreator(
  function baseCompile(templateStr, compilerOptions) {
  // 把模板转换成ast抽象语法树
    const ast = parse(templateStr.trim(), compilerOptions);
    if(compilerOptions.optimize !== false) {
    // 优化抽象语法树
      optimize(ast, compilerOptions);
    }
    //
    const code = generate(ast, compilerOptions);
    return {
      ast,
      // 渲染函数
      render: code.render,
      // 静态玄谈函数， 生成静态VNode树
      staticRenderFns: code.staticRenderFns
    };
  }
);

function createCompiler(options) {

}

const { compile, compileToFunctions } = createCompiler({
  expectHTML: true,

});
export { compile, compileToFunctions };
