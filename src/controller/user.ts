import {
  getTaskList,
  getTodayScore,
  getTotalScore,
  getUserInfo,
} from '../api/user';
import { login, taskConfig, todayScore, totalScore, userinfo } from '../shared';
import { TaskType } from '../types';
import { log } from '../utils/log';
import { sleep } from '../utils/utils';

/**
 * @description 刷新用户信息
 */
async function refreshUserInfo() {
  // 未登录
  if (!login.value) {
    throw new Error('用户未登录!');
  }
  // 已存在信息
  if (userinfo.nick) {
    return true;
  }
  log('加载用户信息...');
  // 获取用户信息
  const res = await getUserInfo();
  if (res) {
    const { avatarMediaUrl = '', nick: nickRes } = res;
    if (nickRes) {
      // 设置昵称
      userinfo.nick = nickRes;
      // 设置头像
      userinfo.avatar = avatarMediaUrl;
      return true;
    }
  }
  log('加载用户信息失败!');
  return false;
}

/**
 * @description 刷新分数信息
 */
async function refreshScoreInfo() {
  // 未登录
  if (!login.value) {
    throw new Error('用户未登录!');
  }
  log('加载分数信息...');
  // 获取总分
  const totalScoreRes = await getTotalScore();
  // 获取当天总分
  const todayScoreRes = await getTodayScore();
  // 整数值
  if (Number.isInteger(totalScoreRes) && Number.isInteger(todayScoreRes)) {
    // 设置分数
    totalScore.value = totalScoreRes;
    todayScore.value = todayScoreRes;
    return true;
  }
  log('加载分数信息失败!');
  return false;
}

/**
 * @description 刷新任务列表
 */
async function refreshTaskList(): Promise<boolean> {
  // 未登录
  if (!login.value) {
    throw new Error('用户未登录!');
  }
  log('加载任务进度...');
  // 原始任务进度
  const taskProgress = await getTaskList();
  if (taskProgress) {
    // 登录
    taskConfig[TaskType.LOGIN].currentScore = taskProgress[2].currentScore;
    taskConfig[TaskType.LOGIN].dayMaxScore = taskProgress[2].dayMaxScore;
    taskConfig[TaskType.LOGIN].need =
      taskProgress[2].dayMaxScore - taskProgress[2].currentScore;
    // 文章选读
    taskConfig[TaskType.READ].currentScore = taskProgress[0].currentScore;
    taskConfig[TaskType.READ].dayMaxScore = taskProgress[0].dayMaxScore;
    taskConfig[TaskType.READ].need =
      taskProgress[0].dayMaxScore - taskProgress[0].currentScore;
    // 视听学习
    taskConfig[TaskType.WATCH].currentScore = taskProgress[1].currentScore;
    taskConfig[TaskType.WATCH].dayMaxScore = taskProgress[1].dayMaxScore;
    taskConfig[TaskType.WATCH].need =
      taskProgress[1].dayMaxScore - taskProgress[1].currentScore;
    // 每日答题
    taskConfig[TaskType.PRACTICE].currentScore = taskProgress[3].currentScore;
    taskConfig[TaskType.PRACTICE].dayMaxScore = taskProgress[3].dayMaxScore;
    taskConfig[TaskType.PRACTICE].need = taskProgress[3].dayMaxScore;
    // 更新数据
    for (const i in taskConfig) {
      const { currentScore, dayMaxScore } = taskConfig[i];
      // 进度
      const rate = Number(((100 * currentScore) / dayMaxScore).toFixed(1));
      // 百分比
      taskConfig[i].percent = rate;
      // 分数
      taskConfig[i].score = currentScore;
      // 完成状态
      taskConfig[i].status = rate === 100;
    }
    return true;
  }
  // 重试
  await sleep(2000);
  return refreshTaskList();
}

export { refreshUserInfo, refreshScoreInfo, refreshTaskList };
