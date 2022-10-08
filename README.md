# tech-study-js

### 原仓库：

> https://github.com/TechXueXi/techxuexi-js

### 描述 Description

- 灵活且貌似轻量的 `学习强国` 油猴插件。

- 如果感觉功能不强大，去看看 [Node.js 版](https://github.com/Xu22Web/tech-study-node 'Node.js 版') `https://github.com/Xu22Web/tech-study-node`

### 用法 Usage

1. 装个浏览器插件 tampermonkey （下载：https://github.com/TechXueXi/Tampermonkey ）

2. 点击插件里添加按钮，去掉编辑框里原来的代码，复制 `tech-study.js` 脚本复制粘贴进编辑框保存。

3. 开启这个脚本，然后进入网页强国 `www.xuexi.cn` ，登录网页。

### 优化 Promote

1. 优化整体交互设计，新增一体式扫码登录

2. 新增用户信息显示，包括昵称、头像、总分以及当天分数

3. 新增任务进度显示，优化显示逻辑

4. 修复部分小 bug，优化答题逻辑

### 使用流程 Process

1. 登录

![登录](./login.png)

2. 点击 `开始学习`，等待完成学习

3. 完成学习

![完成学习](./done.png)

### 更新与维护 Update and Maintenance

1. 更新提示弹窗界面，优化动画效果。

2. 新增答题配置：`随机作答`以及`答错暂停`。

3. 功能面板分区配置，部分配置可查看详情。

4. 答题存在滑动验证问题，暂时无法解决。

5. 发布基于 Node.js 以及 puppeteer 的全套解决方案，[Node.js 版](https://github.com/Xu22Web/tech-study-node) 解决了滑动验证问题等问题，实现全自动化。

### 公告 announcement

- **现征集在线题库，特此公告**

  > 不知道大家有没有发现，在新版的脚本中，我将原本混乱的搜题`API`，替换成了自行整合的搜题`API`

  由于以下原因:

  1. 答题需要收集和优化题库，方便搜题请求

  2. 便于其他方式的调用，目前，搜题`API`的题库有`5`个

  存在的问题:

  1. 题量有限

  2. 准确度欠佳

- 如果大家发现新的题库或者对于题库有何建议，可以去下面的仓库反馈

- 关于题库: [answer-search-bank](https://github.com/Xu22Web/answer-search-bank) `https://github.com/Xu22Web/answer-search-bank`

最后，希望在大家的帮助下，提供更高质量、更优质的脚本！

### 关于开发 Development

- 脚本配置

  1. 脚本配置 `src/config/script.ts`

  2. API 配置 `src/config/api.ts`

  3. URL 配置 `src/config/url.ts`

  4. 编译配置 `src/config/compile.ts`

- CSS 文件

  `src/css/index.css`

  - 根据功能特性（i）

    ```js
    // 将文件'./css/index.css'文本内容赋值到'css'
    import css from './css/index.css?raw';
    ```

  - 根据 Tampermonkey API 函数

    ```js
    // 嵌入样式
    GM_addStyle(css);
    ```

- 脚本内容

  `src/tech-study.ts`

- 编译

  ```
  # 编译生成 'tech-study.js'
  pnpm build
  ```

  即

  ```
   ✔ 完成编译:tech-study.ts -> tech-study.js!
   ✔ 完成编译:./config/url.ts -> tech-study.js!
   ✔ 完成编译:./config/api.ts -> tech-study.js!
   ✔ 完成编译:./utils/index.ts -> tech-study.js!
   ✔ 导出文件:../tech-study.js!
  ```

- 功能特性（基于`TypeScript Compiler API`）

  1. 包含`?raw`结尾的`import`语句

     ```
     import var from 'file?raw';
     ```

     1. 文件`file`文本内容赋值到`var`

     2. 此类型`import`语句不会被编译到结果

  2. 普通的`import`语句

     ```
     import { funName } from 'file';
     ```

     1. 文件`file`文本插入到主文件一起导出，相当于合并多个`*.ts`文件导出为一个`*.js`文件

     2. 此类型`import`语句不会被编译到结果
