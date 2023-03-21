import { Ref, watchEffectRef, watchRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';

function Tip({
  text,
  count,
  show,
  delayShow,
  countShow,
  callback,
}: {
  text: Ref<string>;
  count: Ref<number>;
  show: Ref<boolean>;
  delayShow: Ref<boolean>;
  countShow: Ref<boolean>;
  callback: (count: number) => void;
}) {
  return createElementNode(
    'div',
    undefined,
    {
      class: watchRef(
        [show, delayShow],
        () =>
          `egg_tip${
            show.value ? (delayShow.value ? ' active delay' : ' active') : ''
          }`
      ),
    },
    [
      createElementNode(
        'span',
        undefined,
        {
          class: 'egg_text',
        },
        createTextNode(text)
      ),
      watchEffectRef(() =>
        countShow.value
          ? createElementNode(
              'span',
              undefined,
              {
                class: 'egg_countdown',
              },
              createTextNode(watchEffectRef(() => `${count.value}s`))
            )
          : undefined
      ),
    ],
    {
      onMounted() {
        // 倒计时
        const countDown = async () => {
          // 倒计时回调
          await callback(count.value);
          // 倒计时结束
          if (!count.value) {
            show.value = false;
            return;
          }
          count.value--;
          setTimeout(countDown, 1000);
        };
        countDown();
      },
    }
  );
}

export { Tip };
