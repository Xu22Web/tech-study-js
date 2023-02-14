import URL_CONFIG from '../config/url';
import { mainStore } from '../store';
import { SettingType } from '../types';
import { $$ } from '../utils/element';
import { generateMix } from '../utils/random';

/**
 * @description 打开窗口
 * @param url
 * @returns
 */
async function openFrame(url: string, title?: string) {
  const conn = $$('.egg_frame_wrap')[0];
  if (conn) {
    // 窗口
    const frame = $$<HTMLIFrameElement>('.egg_frame', conn)[0];
    // id
    const id = generateMix(10);
    // 打开
    mainStore.closed = false;
    // 设置标题
    mainStore.frameTile.value = title || '';
    // 设置 URL
    frame.src = url;
    // 等待页面加载
    await waitFrameLoaded(frame);
    // 发送窗口 ID
    frame.contentWindow?.postMessage({ id, closed: false }, url);
    return {
      id,
      frame,
    };
  }
}

/**
 * @description 关闭窗口
 */
function closeFrame() {
  const conn = $$('.egg_frame_wrap')[0];
  const frameBtn = $$('.egg_frame_show_btn')[0];
  if (conn && frameBtn) {
    // 窗口
    const frame = $$<HTMLIFrameElement>('.egg_frame', conn)[0];
    // 窗口显示
    mainStore.frameShow.value = false;
    // 关闭
    mainStore.closed = true;
    // 标题
    mainStore.frameTile.value = '';
    // src
    frame.src = 'about:blank';
  }
}

/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose(id: string) {
  // 监听关闭
  window.addEventListener('message', (msg: MessageEvent) => {
    const { data } = msg;
    if (data.id === id && data.closed) {
      // 关闭窗口
      closeFrame();
    }
  });
  return new Promise((resolve) => {
    // 关闭
    setInterval(() => {
      // 窗口关闭
      if (mainStore.closed) {
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
 * @description 关闭子窗口
 */
function closeWin() {
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
function waitWinClose(newPage) {
  return new Promise((resolve) => {
    const doing = setInterval(() => {
      if (newPage.closed) {
        clearInterval(doing); // 停止定时器
        resolve('done');
      }
    }, 1000);
  });
}

/**
 * @description 关闭任务窗口
 */
function closeTaskWin(id?: string) {
  // 同屏任务
  if (mainStore.settings[SettingType.SAME_TAB]) {
    window.parent.postMessage({ id, closed: true }, URL_CONFIG.homeOrigin);
    return;
  }
  // 子窗口
  closeWin();
}

/**
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url: string, title?: string) {
  if (mainStore.settings[SettingType.SAME_TAB]) {
    // 窗口存在
    mainStore.frameExist.value = true;
    // 显示窗体
    mainStore.frameShow.value = !mainStore.settings[SettingType.SILENT_RUN];
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

export {
  openFrame,
  closeFrame,
  waitFrameClose,
  waitFrameLoaded,
  closeTaskWin,
  waitTaskWin,
};
