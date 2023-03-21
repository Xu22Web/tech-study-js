import { Reactive, Ref, watchEffectRef, watchRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 设置任务项
 * @returns
 */
function TaskItem({
  title,
  tip,
  checked,
  onchange,
  onmousedown,
  onmousemove,
  onmouseup,
  percent,
  edit,
  drag,
  position,
  onMounted,
}: {
  title: string;
  tip: string;
  checked: Ref<boolean>;
  onchange: (e: Event) => void;
  onmousedown: (e: MouseEvent) => void;
  onmousemove: (e: MouseEvent) => void;
  onmouseup: (e: MouseEvent) => void;
  percent: Ref<number>;
  edit: Ref<boolean>;
  drag: Ref<boolean>;
  position: Reactive<{
    x: number;
    y: number;
  }>;
  onMounted: () => void;
}) {
  return createElementNode(
    'div',
    undefined,
    {
      class: watchRef(
        [drag, edit],
        () =>
          `egg_task_item${
            edit.value ? (drag.value ? ' edit drag' : ' edit') : ''
          }`
      ),
      onmousedown: watchRef(drag, () => (e) => {
        onmousedown(e);
        window.addEventListener('mousemove', onmousemove);
        const handleMouseUp = (e: MouseEvent) => {
          onmouseup(e);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('mousemove', onmousemove);
        };
        window.addEventListener('mouseup', handleMouseUp);
      }),
      style: watchRef(
        () => [drag.value, position.x, position.y],
        () => (drag.value ? `left: ${position.x}px;top: ${position.y}px;` : '')
      ),
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
            disabled: edit,
            checked,
            onchange,
          }),
        ]
      ),
    ],
    { onMounted }
  );
}

export { TaskItem };
