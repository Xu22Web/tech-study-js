import { $$ } from './element';
import { generateMix } from './random';

/**
 * @description 打开窗口
 * @param url
 * @returns
 */
async function openFrame(url: string, title?: string) {
  const conn = $$('.egg_frame_wrap')[0];
  if (conn) {
    // 标题
    const frameTitle = $$('.egg_frame_title', conn)[0];
    // 窗口
    const frame = $$<HTMLIFrameElement>('.egg_frame', conn)[0];
    // 打开
    closed = false;
    // id
    const id = generateMix(10);
    // 设置标题
    frameTitle.innerText = title || '';
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
 * @description 改变窗口可见性
 */
function setFrameVisible(show: boolean) {
  const conn = $$('.egg_frame_wrap')[0];
  const frameBtn = $$('.egg_frame_show_btn')[0];
  if (conn && frameBtn) {
    conn.classList.toggle('hide', !show);
    frameBtn.classList.toggle('hide', show);
  }
}

/**
 * @description 关闭窗口
 */
function closeFrame() {
  const conn = $$('.egg_frame_wrap')[0];
  const frameBtn = $$('.egg_frame_show_btn')[0];
  if (conn && frameBtn) {
    // 隐藏窗口
    conn.classList.add('hide');
    // 隐藏按钮
    frameBtn.classList.add('hide');
    // 标题
    const frameTitle = $$('.egg_frame_title', conn)[0];
    // 窗口
    const frame = $$<HTMLIFrameElement>('.egg_frame', conn)[0];
    // 关闭
    closed = true;
    frame.src = '';
    frameTitle.innerText = '';
  }
}

/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose(id: string) {
  return new Promise((resolve) => {
    window.addEventListener('message', (msg: MessageEvent) => {
      const { data } = msg;
      if (data.id === id && data.closed) {
        resolve(true);
      }
    });
    setInterval(() => {
      if (closed) {
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

export {
  openFrame,
  closeFrame,
  waitFrameClose,
  waitFrameLoaded,
  setFrameVisible,
};
