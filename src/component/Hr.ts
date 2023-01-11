import { createElementNode, createTextNode } from '../utils/element';

/**
 * @description 分隔符
 * @returns
 */
function Hr({ text }: { text: string }) {
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_hr_wrap',
    },
    [
      createElementNode('div', undefined, { class: 'egg_hr' }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_hr_title' },
        createTextNode(text)
      ),
      createElementNode('div', undefined, { class: 'egg_hr' }),
    ]
  );
}

export { Hr };
