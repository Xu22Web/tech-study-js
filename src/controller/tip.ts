import { Tip } from '../component/Tip';
import { ref } from '../utils/composition';
import { $$, mountElement } from '../utils/element';

/**
 * @description 创建学习提示
 */
function createTip(
  text: string,
  delay: number = 2,
  countShow: boolean = false,
  callback?: (current: number) => any
) {
  const tipWrap = $$('.egg_tip_wrap')[0];
  // 提前去除
  const tips = $$<HTMLElement & { delay: () => void }>('.egg_tip');
  if (tips.length) {
    tips.forEach((t) => t.delay());
  }
  // 延迟
  const delayCount = ref(delay);
  // 文字
  const textContent = ref(text);
  //显示
  const show = ref(false);
  // 延迟显示
  const delayShow = ref(false);
  // 销毁
  let destroyed = false;
  // 倒计时结束
  let done = false;
  // 提示
  const tip = Tip({
    text: textContent,
    count: delayCount,
    show,
    delayShow,
    countShow: ref(countShow),
    callback: async (count) => {
      callback && (await callback(count));
      // 恢复显示
      if (delayShow.value && count === delay) {
        delayShow.value = false;
      }
      // 倒计时结束
      if (count <= 0) {
        done = true;
        operate.destroy();
      }
    },
  });
  // 操作
  const operate = {
    destroy() {
      if (!destroyed) {
        // 隐藏
        operate.hide();
        // 销毁
        destroyed = true;
        return new Promise((resolve) => {
          setTimeout(() => {
            tip.ele.remove();
            resolve(undefined);
          }, 300);
        });
      }
    },
    hide() {
      if (!destroyed) {
        show.value = false;
      }
    },
    show() {
      if (!destroyed) {
        return new Promise((resolve) => {
          setTimeout(() => {
            show.value = true;
            resolve(undefined);
          }, 300);
        });
      }
    },
    setText(text: string) {
      if (!destroyed) {
        textContent.value = text;
      }
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
    delay() {
      if (!destroyed) {
        delayShow.value = true;
        delayCount.value += 2;
      }
    },
  };
  Object.assign(tip.ele, operate);
  // 插入节点
  mountElement(tip, tipWrap);
  // 显示
  operate.show();
  return operate;
}

export { createTip };
