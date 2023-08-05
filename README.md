配合这个链接看代码
http://caibaojian.com/vue-design/art/81vue-lexical-analysis.html
## rollup

```shell
pnpm i 
  rollup # 打包工具
  @rollup/plugin-alias  # 配置别名
  @babel/preset-env # babel 将高级语法转成低级语法
  @babel/core # babel核心包
  rollup-plugin-babel # babel与rollup连接
  rollup-plugin-serve # 实现静态服务
  cross-env # 设置环境变量
  rollup-plugin-typescript2 # 编译TS文件
  typescript 
  @types/node
  tslib  #  TypeScript 的运行时库
  eslint 
  jest # 单元测试 还需要安装下面两个   
  @babel/preset-typescript # 在babel配置文件presets数组中添加
  ts-jest # TypeScript 预处理器，支持 Jest 的源映射，允许您使用 Jest 来测试用 TypeScript 编写的项目
-D
```


```shell
# 初始化typescript
npx tsc --init

# eslint
cxz@chenxingzhideMacBook-Pro vue2 % npx eslint --init
Need to install the following packages:
  eslint@8.44.0
Ok to proceed? (y) y
You can also run this command directly using 'npm init @eslint/config'.
Need to install the following packages:
  @eslint/create-config@0.4.5
Ok to proceed? (y) y
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · prompt
✔ What format do you want your config file to be in? · JavaScript
✔ What style of indentation do you use? · 4
✔ What quotes do you use for strings? · single
✔ What line endings do you use? · windows
✔ Do you require semicolons? · No / Yes
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · pnpm


## vscode 配置
```

## rollup

``` ts
// 增加rollup.config.ts
import ts from 'rollup-plugin-typescript2';
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/my-library.js',
      format: 'esm',
    },
    {
      file: 'dist/my-library.cjs.js',
      format: 'cjs',
    },
  ],
  plugins: [ts()],
};
```