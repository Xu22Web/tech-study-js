import { Ref, watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 设置任务项
 * @returns
 */
function TaskItem({
  title,
  tip,
  checked,
  onChange,
  percent,
}: {
  title: string;
  tip: string;
  checked: boolean;
  onChange: (e: Event) => void;
  percent: Ref<number>;
}) {
  return createElementNode('div', undefined, { class: 'egg_setting_item' }, [
    createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
      createElementNode(
        'label',
        undefined,
        { class: 'egg_task_title' },
        createTextNode(title)
      ),
      createElementNode('div', undefined, { class: 'egg_progress' }, [
        createElementNode(
          'div',
          undefined,
          { class: 'egg_track' },
          createElementNode('div', undefined, {
            class: 'egg_bar',
            style: watchEffectRef(percent, () => `width: ${percent.value}%;`),
          })
        ),
        createElementNode('div', undefined, { class: 'egg_percent' }, [
          createElementNode('span', undefined, undefined, [
            createTextNode(percent),
          ]),
          createTextNode('%'),
        ]),
      ]),
    ]),
    createElementNode('input', undefined, {
      title: tip,
      class: 'egg_switch',
      type: 'checkbox',
      checked,
      onChange,
    }),
  ]);
}

export { TaskItem };
