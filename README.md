# tech-study.js

### 原仓库：

> https://github.com/TechXueXi/techxuexi-js

### 描述 Description

有趣的 `学习强国` 油猴插件。

a flexible and light tampermonkey plugin for xuexiqiangguo.

### 用法 Usage

1. 装个浏览器插件 tampermonkey （可以从这里下载 https://github.com/TechXueXi/Tampermonkey ，网上也很多教程）
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

1. 答题练习时，若发生错误，因此增加了暂停答题，切换手动作答，完毕后，自动提交题库。

2. 答题练习时，若提示答案或题库答案与实际答案不符，答错后，自动提交题库。

3. 由于官网支持的学习项目限制，不包含 APP 的订阅、发表观点等模块。

### 关于开发

- 脚本配置

  `src/plugin.config.ts`

- CSS 文件

  `src/css/index.css`

- 脚本内容

  `src/tech-study.ts`

- 编译

  ```
  # 编译生成 'tech-study.js'
  pnpm dev
  ```

- 功能

  ```
  # 包含`?raw`结尾的`import`语句
  import var from 'module?raw';
  ```

  1. 模块`module`文本赋值到`var`

  2. 此类型`import`语句不会被编译到结果
