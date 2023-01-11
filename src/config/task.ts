/* task·配置 */
/**
 * @description 专项答题开启逆序答题: false: 顺序答题; true: 逆序答题
 */
const examPaperReverse = true;
/**
 * @description 单次最大新闻数
 */
const maxNewsNum = 6;
/**
 * @description 单次最大视频数
 */
const maxVideoNum = 6;
/**
 * @description 二维码最大刷新次数
 */
const maxRefreshCount = 10;
/**
 * @description 二维码自动刷新间隔
 */
const autoRefreshQRCodeInterval = 100000;

export {
  examPaperReverse,
  maxNewsNum,
  maxVideoNum,
  maxRefreshCount,
  autoRefreshQRCodeInterval,
};
