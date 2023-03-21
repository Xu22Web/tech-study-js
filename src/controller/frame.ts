import URL_CONFIG from '../config/url';
import { frame, id, page, settings } from '../shared';
import { SettingType } from '../types';
import { $_ } from '../utils/element';
import { log } from '../utils/log';
import { generateMix } from '../utils/random';

/**
 * @description 初始化主页面
 */
function initMainListener() {
  // 监听关闭
  window.addEventListener('message', (msg: MessageEvent) => {
    const { data } = msg;
    if (data.id === id.value && data.closed) {
      // 关闭窗口
      closeFrame();
      return;
    }
  });
}

/**
 * @description 初始化子页面
 */
function initChildListener() {
  window.addEventListener('message', (msg: MessageEvent) => {
    const { data } = msg;
    if (data.id && !data.closed) {
      // 设置窗口id
      id.value = data.id;
      log(`初始化窗口 ID: ${id.value}`);
      return;
    }
  });
}

/**
 * @description 打开窗口
 * @param url
 * @returns
 */
async function openFrame(url: string, title?: string) {
  // 设置 URL
  frame.src = url;
  // 等待元素
  await $_('.egg_frame');
  if (frame.ele) {
    // id
    id.value = generateMix(10);
    // 打开
    frame.closed = false;
    // 设置标题
    frame.title = title || '';
    // 等待页面加载
    await waitFrameLoaded(frame.ele);
    // 发送窗口 ID
    frame.ele.contentWindow?.postMessage({ id: id.value, closed: false }, url);
    return true;
  }
  return false;
}

/**
 * @description 关闭窗口
 */
function closeFrame() {
  log(`关闭窗口 ID: ${id.value}`);
  // 窗口显示
  frame.show = false;
  // 关闭
  frame.closed = true;
  // 标题
  frame.title = '';
  // src
  frame.src = '';
}

/**
 * @description 关闭 frame
 */
function handleCloseFrame() {
  window.parent.postMessage(
    { id: id.value, closed: true },
    URL_CONFIG.homeOrigin
  );
}

/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose() {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      // 窗口关闭
      if (frame.closed) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });
}

// 等待窗口加载
function waitFrameLoaded(iframe: HTMLElement) {
  return new Promise((resolve) => {
    iframe.addEventListener('load', () => {
      resolve(true);
    });
  });
}

/**
 * @description 打开新窗口
 */
function openWin(url: string) {
  return GM_openInTab(url, {
    active: true,
    insert: true,
    setParent: true,
  });
}

/**
 * @description 关闭窗口
 */
function closeWin() {
  page.value && page.value.close();
}

/**
 * @description 关闭子窗口
 */
function handleCloseWin() {
  try {
    window.opener = window;
    const win = window.open('', '_self');
    win?.close();
    top?.close();
  } catch (e) {}
}

/**
 * @description 等待窗口关闭
 * @param newPage
 * @returns
 */
function waitWinClose(newPage: Tampermonkey.OpenTabObject) {
  return new Promise((resolve) => {
    newPage.onclose = () => {
      resolve(undefined);
    };
  });
}

/**
 * @description 关闭任务窗口
 */
function closeTaskWin() {
  // 同屏任务
  if (settings[SettingType.SAME_TAB] && id.value) {
    closeFrame();
    return;
  }
  // 非同屏任务
  closeWin();
}

/**
 * @description 关闭任务窗口
 */
function handleCloseTaskWin() {
  // 同屏任务
  if (settings[SettingType.SAME_TAB] && id.value) {
    handleCloseFrame();
    return;
  }
  // 子窗口
  handleCloseWin();
}

/**
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url: string, title?: string) {
  // 同屏任务
  if (settings[SettingType.SAME_TAB]) {
    // 窗口存在
    frame.exist = true;
    // 显示窗体
    frame.show = !settings[SettingType.SILENT_RUN];
    // 新窗口
    const res = await openFrame(url, title);
    if (res) {
      // 等待窗口关闭
      await waitFrameClose();
    }
    return;
  }
  // 子页面任务
  page.value = openWin(url);
  await waitWinClose(page.value);
}

export {
  openFrame,
  closeFrame,
  waitFrameClose,
  waitFrameLoaded,
  openWin,
  closeWin,
  waitWinClose,
  waitTaskWin,
  closeTaskWin,
  initMainListener,
  initChildListener,
  handleCloseTaskWin,
};
