/**
 * @description 脚本配置
 */
const SCRIPT_CONFIG = {
  /**
   * @description 脚本名
   */
  name: '不学习何以强国',
  /**
   * @description 命名空间
   */
  namespace: 'http://tampermonkey.net/',
  /**
   * @description 版本
   */
  version: '20220826',
  /**
   * @description 脚本描述
   */
  description:
    '有趣的 `学习强国` 油猴插件。读文章,看视频，做习题。问题反馈： https://github.com/Xu22Web/tech-study-js/issues 。',
  /**
   * @description 作者
   */
  author: '原作者：techxuexi 荷包蛋。现作者：Noah',
  /**
   * @description 链接匹配
   */
  match: [
    'https://www.xuexi.cn',
    'https://www.xuexi.cn/*',
    'https://pc.xuexi.cn/points/exam-practice.html',
    'https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*',
    'https://pc.xuexi.cn/points/exam-weekly-list.html',
    'https://pc.xuexi.cn/points/exam-paper-detail.html?id=*',
    'https://pc.xuexi.cn/points/exam-paper-list.html',
  ],
  /**
   * @description 所需脚本
   */
  require: ['https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0'],
  /**
   * @description 权限
   */
  grant: [
    'GM_addStyle',
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM_openInTab',
  ],
};

export default SCRIPT_CONFIG;
