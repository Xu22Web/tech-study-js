import API_CONFIG from '../config/api';
/* 答案 API */

/**
 * @description 获取答案
 */
async function getAnswer(question: string) {
  // 数据
  const data = {
    question,
  };
  try {
    // 请求
    const res = await fetch(API_CONFIG.answerSearch, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // 请求成功
    if (res.ok) {
      const data: {
        errno: number;
        data: { answers: string[] };
      } = await res.json();
      // 状态
      const { errno } = data;
      if (errno !== -1) {
        // 答案
        const { answers } = data.data;
        return answers;
      }
    }
  } catch (error) {}
  return [];
}

/**
 * @description 保存答案
 */
async function saveAnswer(key, value) {
  try {
    // 内容
    const content = JSON.stringify([{ title: key, content: value }]);
    // 数据
    const data = {
      txt_name: key,
      txt_content: content,
      password: '',
      v_id: '',
    };
    const params = new URLSearchParams(data);
    // 请求
    const res = await fetch(API_CONFIG.answerSave, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {}
}

export { getAnswer, saveAnswer };
