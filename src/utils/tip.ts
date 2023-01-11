import { $$, createElementNode, createTextNode } from './element';

/**
 * @description 创建学习提示
 */
function createTip(
  text: string,
  delay: number = 2,
  callback?: (current: number, operate: object) => any
) {
  const tipWrap = $$('.egg_tip_wrap')[0];
  // 提前去除
  const tips = $$<HTMLElement & { destroy: () => void }>('.egg_tip');
  if (tips.length) {
    tips.forEach((t) => t.destroy());
  }
  // 倒计时
  const countdown = createElementNode(
    'span',
    undefined,
    {
      class: 'egg_countdown',
    },
    createTextNode(`${delay}s`)
  );
  // 文本
  const span = createElementNode(
    'span',
    {
      innerText: text,
    },
    {
      class: 'egg_text',
    }
  );
  // 销毁
  let destroyed = false;
  // 倒计时结束
  let done = false;
  // 倒计时
  const countDown = async () => {
    countdown.innerText = `${delay}s`;
    // 回调
    if (callback) {
      await callback(delay, operate);
    }
    // 倒计时结束
    if (!delay) {
      done = true;
      // 隐藏
      operate.hide();
      return;
    }
    delay--;
    setTimeout(countDown, 1000);
  };
  // 操作
  const operate = {
    async destroy() {
      if (!destroyed) {
        // 隐藏
        operate.hide();
        destroyed = true;
        setTimeout(() => {
          tipInfo.remove();
        }, 300);
      }
    },
    hide() {
      if (!destroyed) {
        tipInfo.classList.remove('active');
      }
    },
    show() {
      if (!destroyed) {
        setTimeout(() => {
          tipInfo.classList.add('active');
        }, 300);
      }
    },
    setText(text: string) {
      span.innerText = text;
    },
    waitCountDown() {
      return new Promise((resolve) => {
        // 计时器
        const timer = setInterval(() => {
          // 结束
          if (done) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      });
    },
  };
  // 创建提示
  const tipInfo: HTMLElement = createElementNode(
    'div',
    undefined,
    {
      class: 'egg_tip',
    },
    [span, countdown]
  );
  Object.assign(tipInfo, operate);
  // 插入节点
  tipWrap.append(tipInfo);
  // 显示
  operate.show();
  // 倒计时
  countDown();
  return operate;
}

export { createTip };
