# tech-study.js

### 原仓库：

> https://github.com/TechXueXi/techxuexi-js

### 描述 Description

有趣的 `学习强国` 油猴插件。

a flexible and light tampermonkey plugin for xuexiqingguo.

### 用法 Usage

1. 装个浏览器插件 tampermonkey （可以从这里下载 https://github.com/TechXueXi/Tampermonkey ，网上也很多教程）
2. 点击插件里添加按钮，去掉编辑框里原来的代码，复制 `tech-study.js` 脚本复制粘贴进编辑框保存。
3. 开启这个脚本，然后进入网页强国 `www.xuexi.cn` ，登录网页。

### 优化

1. 优化整体交互设计，新增一体式扫码登录
2. 新增用户信息显示，包括昵称、头像、总分以及当天分数
3. 新增任务进度显示，优化显示逻辑
4. 修复部分小 bug，优化答题逻辑

### 使用流程

1. 登录

![登录](./login.png)

2. 点击 `开始学习`，等待完成学习

3. 信息显示

![信息显示](./done.png)

### 已知问题

答题练习存在问题，因此增加了暂停答题，切换手动作答，后续优化提升
