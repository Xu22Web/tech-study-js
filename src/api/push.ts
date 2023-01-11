import API_CONFIG from '../config/api';
/* 推送 API */

/**
 * @description 推送
 */
async function pushPlus(
  token: string,
  title: string,
  content: string,
  template: string,
  toToken?: string
) {
  try {
    // 参数体
    const body: {
      token: string;
      title: string;
      content: string;
      template: string;
      to?: string;
    } = {
      token,
      title,
      content,
      template,
    };
    // 好友令牌
    if (toToken) {
      body.to = toToken;
    }
    // 推送
    const res = await fetch(API_CONFIG.push, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {}
}

export { pushPlus };
