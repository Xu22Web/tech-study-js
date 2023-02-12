import { Ref, ref, watchEffect, watchEffectRef } from '../utils/composition';
import { $$, createElementNode, createTextNode } from '../utils/element';
import { formatDateNum } from '../utils/time';

/**
 * @description 时间输入
 * @returns
 */
function TimeInput({
  hour,
  minute,
}: {
  hour: Ref<number>;
  minute: Ref<number>;
}) {
  // 小时
  const hours = new Array(24).fill(undefined).map((h, i) => ({
    value: i,
    label: formatDateNum(i),
    active: ref(false),
    ele: ref<HTMLElement | null>(null),
  }));
  // 分钟
  const minutes = new Array(60).fill(undefined).map((min, i) => ({
    value: i,
    label: formatDateNum(i),
    active: ref(false),
    ele: ref<HTMLElement | null>(null),
  }));
  // 聚焦小时
  const focusHour = ref(false);
  // 聚焦分钟
  const focusMinute = ref(false);

  // 根据小时筛选
  watchEffect(() => {
    const list = $$('.egg_hour_wrap .egg_list')[0];
    if (list) {
      const index = hours.findIndex(
        (h) => !!(hour.value && h.label.includes(String(hour.value)))
      );
      hours.forEach((h, i) => {
        if (index + 1) {
          h.active.value = i === index;
          h.active.value && (list.scrollTop = h.ele.value?.offsetTop || 0);
        } else {
          h.active.value = false;
          list.scrollTop = 0;
        }
      });
    }
  });
  //  根据分钟筛选
  watchEffect(() => {
    const list = $$('.egg_minute_wrap .egg_list')[0];
    if (list) {
      const index = minutes.findIndex(
        (min) => !!(minute.value && min.label.includes(String(minute.value)))
      );
      minutes.forEach((min, i) => {
        if (index + 1) {
          min.active.value = i === index;
          min.active.value && (list.scrollTop = min.ele.value?.offsetTop || 0);
        } else {
          min.active.value = false;
          list.scrollTop = 0;
        }
      });
    }
  });
  return createElementNode('div', undefined, { class: 'egg_time_input' }, [
    createElementNode('div', undefined, { class: 'egg_hour_wrap' }, [
      createElementNode('input', undefined, {
        placeholder: '12',
        class: 'egg_hour',
        type: 'text',
        maxlength: '2',
        onfocus: () => {
          focusHour.value = true;
        },
        oninput: (e: Event) => {
          const h = (<HTMLInputElement>e.target).value.trim();
          if (/^([0-9]|[01][0-9]|[2][0-3])$/.test(h)) {
            hour.value = Number(h);
          }
        },
        onblur: (e: Event) => {
          const input = <HTMLInputElement>e.target;
          const h = input.value.trim();
          hour.value = /^([0-9]|[01][0-9]|[2][0-3])$/.test(h) ? Number(h) : -1;
          if (hour.value === -1) {
            input.value = '';
          }
          setTimeout(() => {
            // 失去焦点
            focusHour.value = false;
          }, 100);
        },
      }),
      createElementNode(
        'div',
        undefined,
        {
          class: watchEffectRef(
            focusHour,
            () => `egg_list${focusHour.value ? '' : ' hide'}`
          ),
        },
        hours.map((v) =>
          createElementNode(
            'div',
            undefined,
            {
              class: watchEffectRef(
                v.active,
                () => `egg_time${v.active.value ? ' focus' : ''}`
              ),
              onclick: () => {
                const input = $$<HTMLInputElement>('.egg_hour')[0];
                hour.value = v.value;
                input.value = v.label;
              },
              ref: v.ele,
            },
            createTextNode(v.label)
          )
        )
      ),
    ]),
    createElementNode('span', undefined, undefined, createTextNode(':')),
    createElementNode('div', undefined, { class: 'egg_minute_wrap' }, [
      createElementNode('input', undefined, {
        placeholder: '00',
        class: 'egg_minute',
        type: 'text',
        maxlength: '2',
        onfocus: () => {
          focusMinute.value = true;
        },
        oninput: (e: Event) => {
          const min = (<HTMLInputElement>e.target).value.trim();
          if (/^([0-9]|[0-5][0-9])$/.test(min)) {
            minute.value = Number(min);
          }
        },
        onblur: (e: Event) => {
          const input = <HTMLInputElement>e.target;
          const min = input.value.trim();
          minute.value = /^([0-9]|[0-5][0-9])$/.test(min) ? Number(min) : -1;
          if (minute.value === -1) {
            input.value = '';
          }
          setTimeout(() => {
            // 失去焦点
            focusMinute.value = false;
          }, 100);
        },
      }),
      createElementNode(
        'div',
        undefined,
        {
          class: watchEffectRef(
            focusMinute,
            () => `egg_list${focusMinute.value ? '' : ' hide'}`
          ),
        },
        minutes.map((v) =>
          createElementNode(
            'div',
            undefined,
            {
              class: watchEffectRef(
                v.active,
                () => `egg_time${v.active.value ? ' focus' : ''}`
              ),
              onclick: () => {
                const input = $$<HTMLInputElement>('.egg_minute')[0];
                minute.value = v.value;
                input.value = v.label;
              },
              ref: v.ele,
            },
            createTextNode(v.label)
          )
        )
      ),
    ]),
  ]);
}

export { TimeInput };
