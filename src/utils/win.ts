import URL_CONFIG from '../config/url';

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
function closeWin(frame?: boolean, id?: string) {
  try {
    if (frame) {
      window.parent.postMessage({ id, closed: true }, URL_CONFIG.homeOrigin);
    } else {
      window.opener = window;
      const win = window.open('', '_self');
      win?.close();
      top?.close();
    }
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

export { openWin, closeWin, waitWinClose };
