import { examPause, settings } from '../shared';
import { SettingType } from '../types';
import { watchEffect, watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 答题按钮
 */
function ExamBtn() {
  // 设置初始状态
  watchEffect(() => (examPause.value = !settings[SettingType.AUTO_ANSWER]));
  return createElementNode(
    'button',
    undefined,
    {
      class: watchEffectRef(
        () => `egg_exam_btn${examPause.value ? ' manual' : ''}`
      ),
      type: 'button',
      onclick(e: Event) {
        e.stopPropagation();
        examPause.value = !examPause.value;
      },
      onmousedown(e: Event) {
        e.stopPropagation();
      },
      onmousemove(e: Event) {
        e.stopPropagation();
      },
      onmouseup(e: Event) {
        e.stopPropagation();
      },
      onmouseenter(e: Event) {
        e.stopPropagation();
      },
      onmouseleave(e: Event) {
        e.stopPropagation();
      },
      onmouseover(e: Event) {
        e.stopPropagation();
      },
      ontouchstart(e: Event) {
        e.stopPropagation();
      },
      ontouchmove(e: Event) {
        e.stopPropagation();
      },
      ontouchend(e: Event) {
        e.stopPropagation();
      },
      oninput(e: Event) {
        e.stopPropagation();
      },
      onchange(e: Event) {
        e.stopPropagation();
      },
      onblur(e: Event) {
        e.stopPropagation();
      },
    },
    createTextNode(
      watchEffectRef(
        () => `${examPause.value ? '开启自动答题' : '关闭自动答题'}`
      )
    )
  );
}

export { ExamBtn };
