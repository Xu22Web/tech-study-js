import { getTaskList, getTodayScore, getTotalScore } from '../api/user';
import { mainStore } from '../store';
import { TaskType } from '../types';
import { sleep } from '../utils/utils';
import { log } from '../utils/log';

/**
 * @description 加载分数
 */
async function refreshScoreInfo() {
  log('加载分数...');
  // 获取总分
  const totalScore = await getTotalScore();
  // 获取当天总分
  const todayScore = await getTodayScore();
  if (Number.isInteger(totalScore) && Number.isInteger(todayScore)) {
    // 设置分数
    mainStore.totalScore.value = totalScore;
    mainStore.todayScore.value = todayScore;
  }
}

/**
 * @description 加载任务列表
 */
async function refreshTaskList() {
  log('加载任务进度...');
  // 原始任务进度
  const taskProgress = await getTaskList();
  if (taskProgress) {
    // 文章选读
    mainStore.tasks[TaskType.READ].currentScore = taskProgress[0].currentScore;
    mainStore.tasks[TaskType.READ].dayMaxScore = taskProgress[0].dayMaxScore;
    mainStore.tasks[TaskType.READ].need =
      taskProgress[0].dayMaxScore - taskProgress[0].currentScore;
    // 视听学习
    mainStore.tasks[TaskType.WATCH].currentScore =
      taskProgress[1].currentScore + taskProgress[2].currentScore;
    mainStore.tasks[TaskType.WATCH].dayMaxScore =
      taskProgress[1].dayMaxScore + taskProgress[2].dayMaxScore;
    mainStore.tasks[TaskType.WATCH].need =
      taskProgress[1].dayMaxScore +
      taskProgress[2].dayMaxScore -
      (taskProgress[1].currentScore + taskProgress[2].currentScore);
    // 每日答题
    mainStore.tasks[TaskType.PRACTICE].currentScore =
      taskProgress[5].currentScore;
    mainStore.tasks[TaskType.PRACTICE].dayMaxScore =
      taskProgress[5].dayMaxScore;
    mainStore.tasks[TaskType.PRACTICE].need =
      taskProgress[5].dayMaxScore - taskProgress[5].currentScore;
    // 专项练习
    mainStore.tasks[TaskType.PAPER].currentScore = taskProgress[4].currentScore;
    mainStore.tasks[TaskType.PAPER].dayMaxScore = taskProgress[4].dayMaxScore;
    mainStore.tasks[TaskType.PAPER].need =
      taskProgress[4].dayMaxScore - taskProgress[4].currentScore;
    // 更新数据
    for (const i in mainStore.tasks) {
      const { currentScore, dayMaxScore } = mainStore.tasks[i];
      // 进度
      let rate = Number(((100 * currentScore) / dayMaxScore).toFixed(2));
      // 修复专项练习成组做完, 进度条显示异常
      if (dayMaxScore <= currentScore) {
        rate = 100;
        mainStore.tasks[i].status = true;
      }
      // 百分比
      mainStore.tasks[i].percent.value = rate;
      // 分数
      mainStore.tasks[i].score.value = currentScore;
    }
    return;
  }
  // 再次请求
  await sleep(2000);
  await refreshTaskList();
}

export { refreshScoreInfo, refreshTaskList };

