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
  percent,
  onchange,
  immutable,
}: {
  title: string;
  tip: string;
  checked: Ref<boolean>;
  percent: Ref<number>;
  onchange: (...args: any[]) => void;
  immutable: boolean;
}) {
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_task_item',
    },
    [
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_task_content',
        },
        [
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
                  style: watchEffectRef(() => `width: ${percent.value}%;`),
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
            onchange,
            disabled: immutable,
          }),
        ]
      ),
    ]
  );
}

export { TaskItem };
