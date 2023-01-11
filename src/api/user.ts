import API_CONFIG from '../config/api';

/**
 * @description 用户信息
*/
type UserInfo = {
  avatarMediaUrl?: string;
  nick: string;
};
/* 用户 API */

/**
 * @description 获取用户信息
 */
async function getUserInfo(): Promise<UserInfo | undefined> {
  try {
    const res = await fetch(API_CONFIG.userInfo, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      return data;
    }
  } catch (err) {}
}

/**
 * @description 获取总积分
 */
async function getTotalScore() {
  try {
    const res = await fetch(API_CONFIG.totalScore, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 总分
      const { score } = data;
      return score;
    }
  } catch (err) {}
}

/**
 * @description 获取当天总积分
 */
async function getTodayScore() {
  try {
    const res = await fetch(API_CONFIG.todayScore, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 当天总分
      const { score } = data;
      return score;
    }
  } catch (err) {}
}

/**
 * @description 获取任务列表
 */
async function getTaskList() {
  try {
    const res = await fetch(API_CONFIG.taskList, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 进度和当天总分
      const { taskProgress } = data;
      return taskProgress;
    }
  } catch (err) {}
}

export { getUserInfo, getTotalScore, getTodayScore, getTaskList };
