import { createTip } from '../controller/tip';
import { mainStore } from '../store';
import { $$ } from './element';
import { log } from './log';

/* 工具函数 */
/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
  // 获取当前所有cookie
  const strCookies = document.cookie;
  // 截取变成cookie数组
  const cookieText = strCookies.split(';');
  // 循环每个cookie
  for (const i in cookieText) {
    // 将cookie截取成两部分
    const item = cookieText[i].split('=');
    // 判断cookie的name 是否相等
    if (item[0].trim() === name) {
      return item[1].trim();
    }
  }
  return null;
}

/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce(callback, delay) {
  let timer = -1;
  return function (this: any, ...args) {
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = <any>setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

/**
 * @description 判断是否为移动端
 * @returns
 */
function hasMobile() {
  let isMobile = false;
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    log('移动端');
    isMobile = true;
  }
  if (document.body.clientWidth < 800) {
    log('小尺寸设备端');
    isMobile = true;
  }
  return isMobile;
}

/**
 * @description 等待时间
 * @param time
 * @returns
 */
function sleep(time) {
  if (!Number.isInteger(time)) {
    time = 1000;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, time);
  });
}

/**
 * @description 暂停锁
 */
function pauseLock(callback?: (msg: string) => void) {
  return new Promise((resolve) => {
    // 学习暂停
    const pauseStudy = <boolean>(GM_getValue('pauseStudy') || false);
    if (pauseStudy) {
      pauseExam(pauseStudy);
    }
    if (mainStore.pause) {
      const doing = setInterval(() => {
        if (!mainStore.pause) {
          // 停止定时器
          clearInterval(doing);
          log('答题等待结束!');
          if (callback && callback instanceof Function) {
            callback('done');
          }
          resolve('done');
          return;
        }
        if (callback && callback instanceof Function) {
          callback('pending');
        }
        log('答题等待...');
      }, 500);
      return;
    }
    resolve('done');
  });
}

/**
 * @description 暂停学习锁
 */
function pauseStudyLock(callback?: (msg: string) => void) {
  return new Promise((resolve) => {
    // 暂停
    const pauseStudy = GM_getValue('pauseStudy') || false;
    if (pauseStudy) {
      const doing = setInterval(() => {
        // 暂停
        const pauseStudy = GM_getValue('pauseStudy') || false;
        if (!pauseStudy) {
          // 停止定时器
          clearInterval(doing);
          log('学习等待结束!');
          if (callback && callback instanceof Function) {
            callback('done');
          }
          resolve('done');
          return;
        }
        if (callback && callback instanceof Function) {
          callback('pending');
        }
        log('学习等待...');
      }, 500);
      return;
    }
    resolve('done');
  });
}

/**
 * @description 暂停答题
 */
function pauseExam(flag: boolean) {
  // 按钮
  const ExamBtn = $$<HTMLButtonElement>('.egg_exam_btn')[0];
  if (ExamBtn) {
    if (flag) {
      // 创建提示
      createTip('已暂停, 手动开启自动答题! ', 10);
    } else {
      // 创建提示
      createTip('已开启, 自动答题!');
    }
    mainStore.pause = flag;
    ExamBtn.innerText = '开启自动答题';
    ExamBtn.classList.add('manual');
  }
}

export {
  debounce,
  sleep,
  hasMobile,
  getCookie,
  pauseLock,
  pauseStudyLock,
  pauseExam,
};
