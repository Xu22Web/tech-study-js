import { Ref, ref, watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';
import { formatDateNum } from '../utils/time';
import { Select } from './Select';

/**
 * @description 时间输入
 * @returns
 */
function TimeInput({
  hour,
  minute,
  onchange,
}: {
  hour: Ref<number>;
  minute: Ref<number>;
  onchange?: (data: { hour: number; minute: number }) => void;
}) {
  // 小时
  const hours = new Array(24).fill(undefined).map((v, i) => ({
    value: i,
    label: formatDateNum(i),
  }));
  // 分钟
  const minutes = new Array(60).fill(undefined).map((v, i) => ({
    value: i,
    label: formatDateNum(i),
  }));
  const valueRef = watchEffectRef(() => {
    const h = hours.find((h) => h.value === hour.value);
    const min = minutes.find((min) => min.value === minute.value);
    return {
      hour: h ? h.value : -1,
      minute: min ? min.value : -1,
    };
  });
  return createElementNode('div', undefined, { class: 'egg_time_input' }, [
    createElementNode('div', undefined, { class: 'egg_hour_wrap' }, [
      Select({
        data: hours,
        placeholder: '00',
        maxlength: 2,
        value: hour,
        onchange({ value }) {
          valueRef.value.hour = value;
          onchange && onchange(valueRef.value);
        },
        onblur(res) {
          if (!res) {
            valueRef.value.hour = -1;
            onchange && onchange(valueRef.value);
          }
        },
      }),
    ]),
    createElementNode(
      'span',
      undefined,
      { class: 'egg_separator' },
      createTextNode(':')
    ),
    createElementNode('div', undefined, { class: 'egg_minute_wrap' }, [
      Select({
        data: minutes,
        placeholder: '00',
        maxlength: 2,
        value: minute,
        onchange({ value }) {
          valueRef.value.minute = value;
          onchange && onchange(valueRef.value);
        },
        onblur(res) {
          if (!res) {
            valueRef.value.minute = -1;
            onchange && onchange(valueRef.value);
          }
        },
      }),
    ]),
  ]);
}

export { TimeInput };
