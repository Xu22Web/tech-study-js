import API_CONFIG from '../config/api';
import { log } from '../utils/log';
/* 答案 API */

/**
 * @description 获取答案
 */
async function getAnswer(question: string) {
  // 数据
  const data = {
    txt_name: md5(question),
    password: '',
  };
  try {
    const params = new URLSearchParams(data);
    // 请求
    const res = await fetch(API_CONFIG.answerSearch, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    // 请求成功
    if (res.ok) {
      const result = await res.json();
      const { data, status } = <
        {
          status: number;
          data: { txt_content: string; txt_name: string };
        }
      >result;
      if (status !== 0) {
        // 答案列表
        const answerList: { content: string; title: string }[] = JSON.parse(
          data.txt_content
        );
        // 答案
        const answers = answerList[0].content.split(/[;\s]/);
        return answers;
      }
    }
  } catch (error) {}
  return [];
}

/**
 * @description 保存答案
 */
async function saveAnswer(question: string, answer: string) {
  try {
    // 内容
    const content = JSON.stringify([{ title: md5(question), content: answer }]);
    // 数据
    const data = {
      txt_name: md5(question),
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
      return <object>data;
    }
  } catch (error) {}
}

export { getAnswer, saveAnswer };
