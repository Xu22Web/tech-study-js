import { ref, watchEffectRef } from '../utils/composition';
import { $$, createElementNode, createTextNode } from '../utils/element';

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
  // 延迟
  const delayCount = ref(delay);
  // 文字
  const textContent = ref(text);
  // 倒计时
  const countdown = createElementNode(
    'span',
    undefined,
    {
      class: 'egg_countdown',
    },
    createTextNode(watchEffectRef(delayCount, () => `${delayCount.value}s`))
  );
  // 文本
  const span = createElementNode(
    'span',
    undefined,
    {
      class: 'egg_text',
    },
    createTextNode(textContent)
  );
  // 销毁
  let destroyed = false;
  // 倒计时结束
  let done = false;
  // 倒计时
  const countDown = async () => {
    // 回调
    if (callback) {
      await callback(delayCount.value, operate);
    }
    // 倒计时结束
    if (!delayCount.value) {
      done = true;
      // 隐藏
      operate.hide();
      return;
    }
    delayCount.value--;
    setTimeout(countDown, 1000);
  };
  //显示
  const show = ref(false);
  // 创建提示
  const tipInfo: HTMLElement = createElementNode(
    'div',
    undefined,
    {
      class: watchEffectRef(
        show,
        () => `egg_tip${show.value ? ' active' : ''}`
      ),
    },
    [span, countdown]
  );
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
        show.value = false;
      }
    },
    show() {
      if (!destroyed) {
        show.value = true;
      }
    },
    setText(text: string) {
      textContent.value = text;
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
