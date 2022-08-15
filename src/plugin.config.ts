/**
 * @description 插件配置
 */
const PLUGIN_CONFIG = {
  name: '不学习何以强国',
  namespace: 'http://tampermonkey.net/',
  version: '20220810',
  description:
    '有趣的 `学习强国` 油猴插件。读文章,看视频，做习题。问题反馈： https://github.com/Xu22Web/tech-study-js/issues 。',
  author: '原作者 techxuexi 荷包蛋。',
  match: [
    'https://www.xuexi.cn',
    'https://www.xuexi.cn/*',
    'https://pc.xuexi.cn/points/exam-practice.html',
    'https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*',
    'https://pc.xuexi.cn/points/exam-weekly-list.html',
    'https://pc.xuexi.cn/points/exam-paper-detail.html?id=*',
    'https://pc.xuexi.cn/points/exam-paper-list.html',
  ],
  require: [
    'https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js',
    'https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0',
    'https://at.alicdn.com/t/font_3029437_1ig5vp3wlvx.js',
  ],
  grant: [
    'GM_addStyle',
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM_openInTab',
  ],
};

export default PLUGIN_CONFIG;
