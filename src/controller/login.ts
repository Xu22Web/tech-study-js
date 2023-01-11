import {
  generateQRCode,
  getSign,
  loginWithQRCode,
  secureCheck,
} from '../api/login';
import API_CONFIG from '../config/api';
import { maxRefreshCount } from '../config/task';
import { mainStore } from '../store';
import { SettingType } from '../types';
import { $$ } from '../utils/element';
import { log } from '../utils/log';
import { getHighlightHTML, getImgHTML, pushModal } from '../utils/push';
import { createTip } from '../utils/tip';

/**
 * @description 生成二维码
 */
async function getQRCode() {
  log('生成登录二维码!');
  const qrCode = await generateQRCode();
  if (qrCode) {
    // 链接
    const url = `https://login.xuexi.cn/login/qrcommit?showmenu=false&code=${qrCode}&appId=dingoankubyrfkttorhpou`;
    return {
      code: qrCode,
      src: `${API_CONFIG.qrcode}?data=${encodeURIComponent(url)}`,
      url,
    };
  }
}

/**
 * @description 验证登录二维码
 * @param code
 * @returns
 */
function checkQRCode(code: string) {
  return new Promise<string>((resolve) => {
    // 清除定时器
    clearInterval(mainStore.loginTimer);
    // 重新设置
    mainStore.loginTimer = setInterval(async () => {
      log('尝试用二维码登录...');
      const res = await loginWithQRCode(code);
      if (res) {
        const { data, code, success } = res;
        // 二维码失效
        if (code === '11019') {
          clearInterval(mainStore.loginTimer);
          resolve('');
          return;
        }
        // 临时登录验证码
        if (success && data) {
          clearInterval(mainStore.loginTimer);
          resolve(data);
        }
      }
    }, 2000);
  });
}

/**
 * @description 尝试二维码登录
 */
async function tryLogin(qrCode: string, checkCode: string) {
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
async function refreshLoginQRCode() {
  // 清除刷新
  clearInterval(mainStore.refreshTimer);
  // 是否超出次数
  if (mainStore.refreshCount >= maxRefreshCount) {
    createTip('超过最大重试次数, 登录失败!');
    // 重置刷新数
    mainStore.refreshCount = 0;
    // 隐藏二维码
    setLoginVisible(false);
    // 远程推送
    if (mainStore.settings[SettingType.REMOTE_PUSH]) {
      // 推送
      const res = await pushModal(
        {
          title: '登录推送',
          content: '超过最大重试次数, 登录失败!',
          type: 'fail',
        },
        mainStore.pushToken
      );
      createTip(`登录推送${res ? '成功' : '失败'}!`);
    }
    return;
  }
  // 配置
  const imgWrap = $$('.egg_login_img_wrap')[0];
  // 图片
  const img = $$<HTMLImageElement>('.egg_login_img_wrap .egg_login_img')[0];
  if (imgWrap && img) {
    // 刷新二维码
    log('刷新登录二维码!');
    // 刷新次数累加
    mainStore.refreshCount++;
    // 获取二维码
    const qrCode = await getQRCode();
    if (qrCode) {
      // 获取连接
      const { src, code, url } = qrCode;
      // src
      img.src = src;
      // 显示二维码
      setLoginVisible(true);
      // 远程推送
      if (mainStore.settings[SettingType.REMOTE_PUSH]) {
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
          mainStore.pushToken
        );
        createTip(`登录推送${res ? '成功' : '失败'}!`);
      }
      // 获取验证码
      const checkCode = await checkQRCode(code);
      // 验证成功
      if (checkCode) {
        // 尝试登录
        const loginStatus = await tryLogin(code, checkCode);
        if (loginStatus) {
          // 登录成功
          log('登录成功!');
          // 创建提示
          const tip = await createTip('登录成功, 即将刷新页面!', 5);
          // 等待倒计时结束
          await tip.waitCountDown();
          // 远程推送
          if (mainStore.settings[SettingType.REMOTE_PUSH]) {
            const res = await pushModal(
              {
                title: '登录推送',
                content: '学习强国, 登录成功!',
                type: 'success',
              },
              mainStore.pushToken
            );
            createTip(`登录推送${res ? '成功' : '失败'}!`);
          }
          window.location.reload();
        }
        return;
      }
      // 二维码失效
      log('登录二维码失效!');
      // 二维码失效刷新
      refreshLoginQRCode();
    }
  }
}

/**
 * @description 设置登录二维码可见
 * @param show
 */
async function setLoginVisible(show: boolean) {
  const imgWrap = $$('.egg_login_img_wrap')[0];
  if (imgWrap) {
    imgWrap.classList.toggle('active', show);
  }
}

export {
  getQRCode,
  checkQRCode,
  tryLogin,
  refreshLoginQRCode,
  setLoginVisible,
};
