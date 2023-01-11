import { getTaskList, getTodayScore, getTotalScore } from '../api/user';
import { mainStore } from '../store';
import { TaskType } from '../types';
import { sleep } from '../utils';
import { $$ } from '../utils/element';
import { log } from '../utils/log';

/**
 * @description 刷新信息
 */
async function refreshInfo() {
  // 登录
  if (mainStore.login) {
    await refreshScoreInfo();
    await refreshTaskList();
  }
}

/**
 * @description 加载分数
 */
async function refreshScoreInfo() {
  log('加载分数...');
  // 获取总分
  const totalScore = await getTotalScore();
  // 获取当天总分
  const todayScore = await getTodayScore();
  // 总分
  const totalScoreSpan = $$<HTMLSpanElement>('.egg_totalscore span')[0];
  //  当天分数
  const todayScoreSpan = $$<HTMLSpanElement>('.egg_todayscore_btn span')[0];
  // 刷新分数
  if (totalScoreSpan && todayScoreSpan) {
    totalScoreSpan.innerText = totalScore;
    todayScoreSpan.innerText = todayScore;
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
    // 详情
    const details = $$('.egg_score_details .egg_score_detail');
    // 进度条对象
    const taskProgressList = $$('.egg_progress');
    // 更新数据
    for (const i in mainStore.tasks) {
      const { currentScore, dayMaxScore } = mainStore.tasks[i];
      // 进度
      let rate = (100 * currentScore) / dayMaxScore;
      // 修复专项练习成组做完, 进度条显示异常
      if (dayMaxScore <= currentScore) {
        rate = 100;
        mainStore.tasks[i].status = true;
      }
      if (rate >= 0) {
        // 进度条信息
        const progressInfo = taskProgressList[i];
        // 进度条
        const bar = $$('.egg_bar', progressInfo)[0];
        // 百分比
        const percent = $$('.egg_percent span', progressInfo)[0];
        if (bar && percent) {
          // 进度
          const progress = rate.toFixed(2);
          // 长度
          bar.style.width = `${progress}%`;
          // 文字
          percent.innerText = `${~~rate}`;
          // 进度
          mainStore.tasks[i].percent = Number(progress);
        }
        // 设置详情
        if (details[i]) {
          details[i].innerText = String(mainStore.tasks[i].currentScore);
        }
      }
    }
    return;
  }
  // 再次请求
  await sleep(2000);
  await refreshTaskList();
}

export { refreshInfo };
