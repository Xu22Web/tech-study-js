import {
  generateQRCode,
  getSign,
  loginWithQRCode,
  secureCheck,
} from '../api/login';
import API_CONFIG from '../config/api';
import { autoRefreshQRCodeInterval, maxRefreshCount } from '../config/task';
import {
  frame,
  login,
  loginQRCodeShow,
  pushToken,
  refreshCount,
  settings,
  taskConfig,
  taskStatus,
  todayScore,
  totalScore,
  userinfo,
} from '../shared';
import { SettingType, TaskStatusType } from '../types';
import { $$ } from '../utils/element';
import { log } from '../utils/log';
import {
  getHighlightHTML,
  getImgHTML,
  getProgressHTML,
  pushModal,
} from '../utils/push';
import { delCookie } from '../utils/utils';
import { closeFrame } from './frame';
import { createTip } from './tip';
import { refreshScoreInfo, refreshTaskList, refreshUserInfo } from './user';

/**
 * @description 二维码刷新定时器
 */
let refreshTimer = -1;
/**
 * @description 尝试登录
 */
let tryLoginTimer = -1;

/**
 * @description 生成二维码
 */
async function getQRCode() {
  log('正在生成登录二维码...');
  const qrCode = await generateQRCode();
  if (qrCode) {
    log('生成登录二维码成功!');
    // 链接
    const url = `https://login.xuexi.cn/login/qrcommit?showmenu=false&code=${qrCode}&appId=dingoankubyrfkttorhpou`;
    return {
      code: qrCode,
      src: `${API_CONFIG.qrcode}?data=${encodeURIComponent(url)}`,
      url,
    };
  }
  log('生成登录二维码失败!');
}

/**
 * @description 验证登录二维码
 * @param code
 * @returns
 */
async function checkQRCode(code: string) {
  log('尝试用二维码登录...');
  // 二维码登录
  const res = await loginWithQRCode(code);
  if (res) {
    const { data, code, success } = res;
    // 临时登录验证码
    if (success && data) {
      return data;
    }
    // 二维码失效
    if (code === '11019') {
      return;
    }
  }
  return new Promise<string | undefined>((resolve) => {
    // 清除定时
    clearTimeout(tryLoginTimer);
    // 设置定时
    tryLoginTimer = <number>(<unknown>setTimeout(async () => {
      resolve(await checkQRCode(code));
    }, 1000));
  });
}

/**
 * @description 尝试二维码登录
 */
async function tryLogin(checkCode: string) {
  log('正在获取签名...');
  // 获取签名
  const sign = await getSign();
  if (sign) {
    // 生成uuid
    const uuid = crypto.randomUUID();
    const [, code] = checkCode.split('=');
    const state = `${sign}${uuid}`;
    // 安全检查
    const res = await secureCheck({ code, state });
    return res;
  }
}

/**
 * @description 刷新登录二维码
 */
async function handleLogin() {
  // 清除刷新
  clearInterval(refreshTimer);
  // 每隔一段时间刷新
  refreshTimer = <number>(<unknown>setInterval(() => {
    // 刷新二维码
    handleLogin();
  }, autoRefreshQRCodeInterval));
  // 是否超出次数
  if (refreshCount.value >= maxRefreshCount) {
    createTip('超过最大重试次数, 登录失败!');
    // 重置刷新数
    refreshCount.value = 0;
    // 隐藏二维码
    loginQRCodeShow.value = false;
    // 远程推送
    if (settings[SettingType.REMOTE_PUSH]) {
      // 推送
      const res = await pushModal(
        {
          title: '登录推送',
          content: '超过最大重试次数, 登录失败!',
          type: 'fail',
        },
        pushToken.value
      );
      createTip(`登录推送${res ? '成功' : '失败'}!`);
    }
    return;
  }
  // 配置
  const imgWrap = $$('.egg_login_img_wrap')[0];
  // 图片
  const img = $$<HTMLImageElement>('.egg_login_img', imgWrap)[0];
  if (imgWrap && img) {
    // 刷新二维码
    log('刷新登录二维码!');
    // 刷新次数累加
    refreshCount.value++;
    // 获取二维码
    const qrCode = await getQRCode();
    if (qrCode) {
      // 获取连接
      const { src, code, url } = qrCode;
      // src
      img.src = src;
      // 开始登录
      loginQRCodeShow.value = true;
      // 远程推送
      if (settings[SettingType.REMOTE_PUSH]) {
        // img html
        const imgWrap = getImgHTML(src);
        // 跳转链接
        const aWrap = `
   <div>
      或在浏览器
      <a
        href="dtxuexi://appclient/page/study_feeds?url=${encodeURIComponent(
          url
        )}"
        style="text-decoration: none"
        >${getHighlightHTML('打开学习强国APP')}</a
      >
    </div>
  `;
        // 推送
        const res = await pushModal(
          {
            title: '登录推送',
            content: ['扫一扫, 登录学习强国!', aWrap, imgWrap],
            type: 'info',
          },
          pushToken.value
        );
        createTip(`登录推送${res ? '成功' : '失败'}!`);
      }
      // 获取验证码
      const checkCode = await checkQRCode(code);
      // 验证成功
      if (checkCode) {
        // 尝试登录
        const loginRes = await tryLogin(checkCode);
        if (loginRes) {
          // 清除刷新
          clearInterval(refreshTimer);
          // 二维码显示
          loginQRCodeShow.value = false;
          // 登录成功
          log('登录成功!');
          // 创建提示
          createTip('登录成功!');
          // 登录成功
          login.value = true;
          // 刷新用户信息
          await refreshUserInfo();
          // 刷新分数信息
          await refreshScoreInfo();
          // 刷新任务信息
          await refreshTaskList();
          // 远程推送
          if (settings[SettingType.REMOTE_PUSH]) {
            const res = await pushModal(
              {
                title: '登录推送',
                to: userinfo.nick,
                content: [
                  '学习强国, 登录成功!',
                  `当天积分:  ${getHighlightHTML(todayScore.value)} 分`,
                  `总积分: ${getHighlightHTML(totalScore.value)} 分`,
                  ...taskConfig.map((task) =>
                    getProgressHTML(task.title, task.currentScore,task.dayMaxScore)
                  ),
                ],
                type: 'success',
              },
              pushToken.value
            );
            createTip(`登录推送${res ? '成功' : '失败'}!`);
          }
        }
        return;
      }
      // 二维码失效
      log('登录二维码失效!');
      // 二维码失效刷新
      handleLogin();
    }
  }
}

/**
 * @description 退出登录
 */
function handleLogout() {
  // 删除token
  delCookie('token', '.xuexi.cn');
  // 关闭窗口
  closeFrame();
  frame.exist = false;
  // 退出登录
  login.value = false;
  // 清除用户信息
  userinfo.nick = '';
  userinfo.avatar = '';
  // 总分
  totalScore.value = 0;
  // 当天分数
  todayScore.value = 0;
  // 任务进度重置
  taskConfig.forEach((task) => {
    task.currentScore = 0;
  });
  taskStatus.value = TaskStatusType.LOADING;
  // 退出登录
  log('退出登录');
}

export { getQRCode, checkQRCode, tryLogin, handleLogin, handleLogout };
