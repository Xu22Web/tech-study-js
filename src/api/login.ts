import API_CONFIG from '../config/api';

/**
 * @description 生成二维码
 */
async function generateQRCode() {
  try {
    // 推送
    const res = await fetch(API_CONFIG.generateQRCode, {
      method: 'GET',
      mode: 'cors',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return <string>data.result;
      }
    }
  } catch (error) {}
}

/**
 * @description 用二维码登录
 */
async function loginWithQRCode(qrCode: string) {
  try {
    const params = new URLSearchParams({
      qrCode,
      goto: 'https://oa.xuexi.cn',
      pdmToken: '',
    });
    // 推送
    const res = await fetch(API_CONFIG.loginWithQRCode, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: params.toString(),
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return <{ data: string; code: string; success: boolean }>data;
    }
  } catch (error) {}
}

/**
 * @description 签名
 */
async function getSign() {
  try {
    // 推送
    const res = await fetch(API_CONFIG.sign, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      if (data.ok) {
        return <string>data.data.sign;
      }
    }
  } catch (error) {}
}

/**
 * @description 安全检查
 * @param data
 */
async function secureCheck(data: { code: string; state: string }) {
  try {
    const params = new URLSearchParams(data);
    const url = `${API_CONFIG.secureCheck}?${params}`;
    // 推送
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return <boolean>data.success;
    }
  } catch (error) {}
  return false;
}

export { generateQRCode, loginWithQRCode, getSign, secureCheck };
