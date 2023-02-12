import { mainStore } from '../store';
import { log } from '../utils/log';
import { isLate, isNow } from '../utils/time';
import { refreshLoginQRCode } from './login';
import { createTip } from './tip';

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
      mainStore.scheduleTimer = setInterval(() => {
        if (!(time++ % interval)) {
          log('定时刷新正在运行...');
        }
        // 到达定时
        if (isNow(rest)) {
          clearInterval(mainStore.scheduleTimer);
          log(`执行 ${rest.time} 的定时任务!`);
          // 提示
          createTip(`执行 ${rest.time} 的定时任务!`);
          // 加载二维码
          refreshLoginQRCode();
        }
      }, 1000);
    }
  }
}

export { refreshScheduleTask };
