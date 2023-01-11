/**
 * @description 格式化日期时间数字
 * @param num
 * @returns
 */
function formatDateNum(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}
/**
 * @description 格式化日期时间
 * @param time
 * @returns
 * @example
 * formatDate() -> "20220901"
 * formatDate(new Date()) -> "20220901"
 * formatDate(Date.now()) -> "20220901"
 */
function formatDate(time: Date | string | number = Date.now()) {
  const date = new Date(time);
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  // 日期
  const dateText = [y, m, d].map(formatDateNum).join('');
  return dateText;
}
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
  version: 'v1.4.8',
  /**
   * @description 脚本描述
   */
  description:
    '有趣的 `学习强国` 油猴插件。读文章,看视频，做习题。问题反馈： https://github.com/Xu22Web/tech-study-js/issues 。',
  /**
   * @description 作者
   */
  author: '原作者：techxuexi 荷包蛋。现作者：Xu22Web',
  /**
   * @description 链接匹配
   */
  match: [
    'https://www.xuexi.cn/*',
    'https://pc.xuexi.cn/points/exam-practice.html',
    'https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*',
    'https://pc.xuexi.cn/points/exam-paper-detail.html?id=*',
    'https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn',
  ],
  /**
   * @description 所需脚本
   */
  require: ['https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0'],
  /**
   * @description 脚本注入的时间
   */
  'run-at': 'document-start',
  /**
   * @description 权限
   */
  grant: [
    'GM_addStyle',
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM_openInTab',
    'unsafeWindow',
  ],
  updateURL:
    'https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js',
  downloadURL:
    'https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js',
  supportURL: 'https://github.com/Xu22Web',
};

export default SCRIPT_CONFIG;
