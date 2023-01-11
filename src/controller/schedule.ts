import { mainStore } from '../store';
import { log } from '../utils/log';
import { isLate, isNow } from '../utils/time';
import { createTip } from '../utils/tip';
import { refreshLoginQRCode } from './login';

/**
 * @description 刷新定时任务
 */
async function refreshScheduleTask() {
  // 清除定时刷新
  clearInterval(mainStore.scheduleTimer);
  // 未登录
  if (!mainStore.login) {
    // 剩余定时任务
    const restList = mainStore.scheduleList.filter((s) => !isLate(s));
    // 刷新间隔
    const interval = 10;
    // 存在剩余任务
    if (restList.length) {
      const rest = restList[0];
      log(`已设置 ${rest.time} 的定时任务!`);
      createTip(`已设置 ${rest.time} 的定时任务!`);
      let time = 0;
      mainStore.scheduleTimer = setInterval(() => {
        if (!(time++ % interval)) {
          log('定时刷新正在运行...');
        }
        if (isNow(rest)) {
          clearInterval(mainStore.scheduleTimer);
          log(`执行 ${rest.time} 的定时任务!`);
          createTip(`执行 ${rest.time} 的定时任务!`);
          // 加载二维码
          refreshLoginQRCode();
        }
      }, 1000);
      return;
    }
    // 无剩余任务
    if (mainStore.scheduleList.length) {
      // 最新
      const lastest = mainStore.scheduleList[0];
      log(`已设置 ${lastest.time} 的定时任务!`);
      createTip(`已设置 ${lastest.time} 的定时任务!`);
      let time = 0;
      mainStore.scheduleTimer = setInterval(() => {
        if (!(time++ % interval)) {
          log('定时刷新正在运行...');
        }
        if (isNow(lastest)) {
          clearInterval(mainStore.scheduleTimer);
          log(`执行 ${lastest.time} 的定时任务!`);
          createTip(`执行 ${lastest.time} 的定时任务!`);
          // 加载二维码
          refreshLoginQRCode();
        }
      }, 1000);
    }
  }
}

export { refreshScheduleTask };
