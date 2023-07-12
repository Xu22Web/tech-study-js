import { log } from './log';

/* 工具函数 */

/**
 * @description 设置cookie
 * @param name
 * @param value
 * @param expires
 */
function setCookie(
  name: string,
  value: string,
  expires: number,
  domain: string
) {
  // 当前日期
  const date = new Date();
  // 过期日期
  date.setTime(date.getTime() + expires);
  // 设置cookie
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;domain=${domain}`;
}

/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name: string) {
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
 * @description 删除cookie
 * @param name
 */
function delCookie(name: string, domain: string) {
  // 存在cookie
  const value = getCookie(name);
  if (value !== null) {
    setCookie(name, '', -1, domain);
  }
}

/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce<T extends (...args: any) => any>(callback: T, delay: number) {
  let timer = -1;
  return function (this: any, ...args: Parameters<T>) {
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
function sleep(time: number) {
  // 延时
  let timeDelay = Number(time);
  if (!Number.isInteger(timeDelay)) {
    timeDelay = 1000;
  }
  timeDelay += Math.random() * 500 - 250;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, timeDelay);
  });
}

/**
 * @description 暂停学习锁
 */
function studyPauseLock(callback?: (msg: boolean) => void) {
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
            callback(true);
          }
          resolve(true);
          return;
        }
        if (callback && callback instanceof Function) {
          callback(false);
        }
        log('学习等待...');
      }, 500);
      return;
    }
    resolve(true);
  });
}

/**
 * @description 加载
 * @param match
 * @param callback
 */
function load(
  match: string | RegExp | ((href: string) => any) | boolean,
  callback: () => void
) {
  // 链接
  const { href } = window.location;
  window.addEventListener('load', () => {
    // 函数
    if (match instanceof Function) {
      match(href) && callback();
      return;
    }
    // 布尔
    if (typeof match === 'boolean') {
      match && callback();
      return;
    }
    // 字符正则
    if (href.match(match)) {
      callback();
      return;
    }
  });
}

export {
  debounce,
  delCookie,
  getCookie,
  hasMobile,
  load,
  setCookie,
  sleep,
  studyPauseLock,
};
