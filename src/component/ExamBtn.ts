import { mainStore } from '../store';
import { watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 答题按钮
 */
function ExamBtn() {
  return createElementNode(
    'button',
    undefined,
    {
      class: watchEffectRef(
        mainStore.examPause,
        () => `egg_exam_btn${mainStore.examPause.value ? ' manual' : ''}`
      ),
      type: 'button',
      onclick: () => {
        mainStore.examPause.value = !mainStore.examPause.value;
      },
    },
    createTextNode(
      watchEffectRef(
        mainStore.examPause,
        () => `${mainStore.examPause.value ? '开启自动答题' : '关闭自动答题'}`
      )
    )
  );
}

export { ExamBtn };
