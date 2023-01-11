import { getTaskList, getTodayScore, getTotalScore } from '../api/user';
import { refreshLoginQRCode } from '../controller/login';
import { mainStore } from '../store';
import { SettingType, TaskType } from '../types';
import { $$ } from './element';
import { openFrame, setFrameVisible, waitFrameClose } from './frame';
import { log } from './log';
import { isLate, isNow } from './time';
import { createTip } from './tip';
import { openWin, waitWinClose } from './win';

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
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url: string, title?: string) {
  if (mainStore.settings[SettingType.SAME_TAB]) {
    // 显示窗体
    setFrameVisible(!mainStore.settings[SettingType.SILENT_RUN]);
    const newFrame = await openFrame(url, title);
    if (newFrame) {
      // id
      const { id } = newFrame;
      // 等待窗口关闭
      await waitFrameClose(id);
    }
  } else {
    // 页面
    const newPage = openWin(url);
    await waitWinClose(newPage);
  }
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

/**
 * @description 获取video标签
 */
function getVideoTag() {
  let iframe = $$<HTMLIFrameElement>('iframe')[0];
  let video: HTMLVideoElement | undefined;
  let pauseButton: HTMLButtonElement | undefined;
  const u = navigator.userAgent;
  if (u.indexOf('Mac') > -1) {
    // Mac
    if (iframe && iframe.innerHTML) {
      // 如果有iframe, 说明外面的video标签是假的
      video = iframe.contentWindow?.document.getElementsByTagName('video')[0];
      pauseButton = <HTMLButtonElement>(
        iframe.contentWindow?.document.getElementsByClassName(
          'prism-play-btn'
        )[0]
      );
    } else {
      // 否则这个video标签是真的
      video = $$<HTMLVideoElement>('video')[0];
      pauseButton = $$<HTMLButtonElement>('.prism-play-btn')[0];
    }
    return {
      video: video,
      pauseButton: pauseButton,
    };
  } else {
    if (iframe) {
      // 如果有iframe, 说明外面的video标签是假的
      video = <HTMLVideoElement>(
        iframe.contentWindow?.document.getElementsByTagName('video')[0]
      );
      pauseButton = <HTMLButtonElement>(
        iframe.contentWindow?.document.getElementsByClassName(
          'prism-play-btn'
        )[0]
      );
    } else {
      // 否则这个video标签是真的
      video = $$<HTMLVideoElement>('video')[0];
      pauseButton = $$<HTMLButtonElement>('.prism-play-btn')[0];
    }
    return {
      video: video,
      pauseButton: pauseButton,
    };
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
  waitTaskWin,
  getVideoTag,
};
