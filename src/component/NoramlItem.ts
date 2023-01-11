import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 设置普通项
 * @returns
 */
function NomalItem({
  title,
  tip,
  checked,
  onChange,
}: {
  title: string;
  tip: string;
  checked: boolean;
  onChange: (e: Event) => void;
}) {
  return createElementNode('div', undefined, { class: 'egg_setting_item' }, [
    createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
      createElementNode('label', undefined, { class: 'egg_task_title' }, [
        createTextNode(title),
        createElementNode(
          'span',
          undefined,
          {
            class: 'egg_detail',
            title: tip,
          },
          createTextNode('i')
        ),
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

export { NomalItem };
