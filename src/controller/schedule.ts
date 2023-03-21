import { login, scheduleList } from '../shared';
import { log } from '../utils/log';
import { isLate, isNow } from '../utils/time';
import { handleLogin } from './login';
import { createTip } from './tip';

/**
 * @description 定时刷新定时器
 */
let scheduleTimer = -1;

/**
 * @description 刷新定时任务
 */
async function refreshScheduleTask() {
  // 清除定时刷新
  clearInterval(scheduleTimer);
  // 未登录
  if (!login.value) {
    // 剩余定时任务
    const restList = scheduleList.filter((s) => !isLate(s));
    // 存在剩余任务
    if (restList.length) {
      const rest = restList[0];
      log(`已设置 ${rest.time} 的定时任务!`);
      // 提示
      createTip(`已设置 ${rest.time} 的定时任务!`);
      // 时间
      let time = 0;
      // 刷新间隔
      const interval = 10;
      scheduleTimer = <number>(<unknown>setInterval(() => {
        if (!(time++ % interval)) {
          log('定时刷新正在运行...');
        }
        // 到达定时
        if (isNow(rest)) {
          clearInterval(scheduleTimer);
          log(`执行 ${rest.time} 的定时任务!`);
          // 提示
          createTip(`执行 ${rest.time} 的定时任务!`);
          // 登录
          handleLogin();
        }
      }, 1000));
    }
  }
}

/**
 * @description 清除定时
 */
function clearScheduleTask() {
  clearInterval(scheduleTimer);
}

export { refreshScheduleTask, clearScheduleTask };
