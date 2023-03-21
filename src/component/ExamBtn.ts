import { examPause } from '../shared';
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
        () => `egg_exam_btn${examPause.value ? ' manual' : ''}`
      ),
      type: 'button',
      onclick: () => {
        examPause.value = !examPause.value;
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
