/**
 * @description api配置
 */
const API_CONFIG = {
  // 用户信息
  userInfo: 'https://pc-api.xuexi.cn/open/api/user/info',
  // 总分
  totalScore: 'https://pc-proxy-api.xuexi.cn/delegate/score/get',
  // 当天分数
  todayScore: 'https://pc-proxy-api.xuexi.cn/delegate/score/today/query',
  // 任务列表
  taskList:
    'https://pc-proxy-api.xuexi.cn/delegate/score/days/listScoreProgress?sence=score&deviceType=2',
  // 新闻数据
  todayNews: [
    'https://www.xuexi.cn/lgdata/35il6fpn0ohq.json',
    'https://www.xuexi.cn/lgdata/1ap1igfgdn2.json',
    'https://www.xuexi.cn/lgdata/vdppiu92n1.json',
    'https://www.xuexi.cn/lgdata/152mdtl3qn1.json',
  ],
  // 视频数据
  todayVideos: [
    'https://www.xuexi.cn/lgdata/525pi8vcj24p.json',
    'https://www.xuexi.cn/lgdata/11vku6vt6rgom.json',
    'https://www.xuexi.cn/lgdata/2qfjjjrprmdh.json',
    'https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json',
    'https://www.xuexi.cn/lgdata/591ht3bc22pi.json',
    'https://www.xuexi.cn/lgdata/1742g60067k.json',
    'https://www.xuexi.cn/lgdata/1novbsbi47k.json',
  ],
  // 专项练习列表
  paperList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list',
  // 文本服务器保存答案
  answerSave: 'https://a6.qikekeji.com/txt/data/save',
  // 文本服务器获取答案
  answerSearch: 'https://a6.qikekeji.com/txt/data/detail',
  // 推送
  push: 'https://www.pushplus.plus/send',
  // 生成二维码
  generateQRCode: 'https://login.xuexi.cn/user/qrcode/generate',
  //二维码登录
  loginWithQRCode: 'https://login.xuexi.cn/login/login_with_qr',
  // 签名
  sign: 'https://pc-api.xuexi.cn/open/api/sns/sign',
  // 安全检查
  secureCheck: 'https://pc-api.xuexi.cn/login/secure_check',
  // 二维码
  qrcode: 'https://api.qrserver.com/v1/create-qr-code',
};
export default API_CONFIG;
