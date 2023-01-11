import { $$, createElementNode, createTextNode } from '../utils/element';
import { formatDateNum } from '../utils/time';

/**
 * @description 时间输入
 * @returns
 */
function TimeInput({
  onchange,
  onblur,
}: {
  onchange?: (e: { hour: string; minute: string; valid: boolean }) => void;
  onblur?: (e: { hour: string; minute: string; valid: boolean }) => void;
}) {
  let hour: string = '';
  let minute: string = '';
  return createElementNode('div', undefined, { class: 'egg_time_input' }, [
    createElementNode('div', undefined, { class: 'egg_hour_wrap' }, [
      createElementNode('input', undefined, {
        placeholder: '12',
        class: 'egg_hour',
        type: 'text',
        maxlength: '2',
        onfocus: () => {
          // 显示列表
          const list = $$('.egg_hour_wrap .egg_list')[0];
          list.classList.remove('hide');
          // 显示正在选择
          const times = $$('.egg_hour_wrap .egg_time');
          const time = times.find(
            (time) => hour && time.textContent?.includes(hour)
          );
          if (time) {
            list.scrollTop = time.offsetTop;
          }
          times.forEach((t) => t.classList.toggle('focus', t === time));
        },
        oninput: (e: Event) => {
          const h = (<HTMLInputElement>e.target).value.trim();
          if (/^[0-9]$/.test(h)) {
            hour = formatDateNum(Number(h));
          } else {
            hour = h;
          }
          const times = $$('.egg_hour_wrap .egg_time');
          const list = $$('.egg_hour_wrap .egg_list')[0];
          const time = times.find(
            (time) => hour && time.textContent?.includes(hour)
          );
          if (time) {
            list.scrollTop = time.offsetTop;
          }
          times.forEach((t) => t.classList.toggle('focus', t === time));
          // 更改事件
          onchange &&
            onchange({
              hour,
              minute,
              valid:
                /^([01][0-9]|[2][0-3])$/.test(hour) &&
                /^[0-5][0-9]$/.test(minute),
            });
        },
        onblur: (e: Event) => {
          const h = (<HTMLInputElement>e.target).value.trim();
          if (h && !/^([01][0-9]|[2][0-3])$/.test(h)) {
            if (/^[0-9]$/.test(h)) {
              (<HTMLInputElement>e.target).value = hour;
            } else {
              // 默认值
              (<HTMLInputElement>e.target).value = '';
              hour = '';
              // 移除样式
              const times = $$('.egg_hour_wrap .egg_time');
              times.forEach((t) => t.classList.remove('focus'));
              // 更改事件
              onchange &&
                onchange({
                  hour,
                  minute,
                  valid:
                    /^([01][0-9]|[2][0-3])$/.test(hour) &&
                    /^[0-5][0-9]$/.test(minute),
                });
            }
          }
          // 隐藏列表
          const list = $$('.egg_hour_wrap .egg_list')[0];
          setTimeout(() => {
            list.classList.add('hide');
          }, 100);
          // 失去焦点
          onblur &&
            onblur({
              hour,
              minute,
              valid:
                /^([01][0-9]|[2][0-3])$/.test(hour) &&
                /^[0-5][0-9]$/.test(minute),
            });
        },
      }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_list hide' },
        new Array(24).fill(undefined).map((v, i) =>
          createElementNode(
            'div',
            undefined,
            {
              class: 'egg_time',
              onclick: (e: Event) => {
                const time = <HTMLElement>e.target;
                const list = $$('.egg_hour_wrap .egg_list')[0];
                const input = $$<HTMLInputElement>('.egg_hour')[0];
                hour = time.textContent || '';
                input.value = hour;
                list.scrollTop = time.offsetTop;
                // 更改事件
                onchange &&
                  onchange({
                    hour,
                    minute,
                    valid:
                      /^([01][0-9]|[2][0-3])$/.test(hour) &&
                      /^[0-5][0-9]$/.test(minute),
                  });
              },
            },
            createTextNode(formatDateNum(i))
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
          // 显示列表
          const list = $$('.egg_minute_wrap .egg_list')[0];
          list.classList.remove('hide');
          // 显示正在选择
          const times = $$('.egg_minute_wrap .egg_time');
          const time = times.find(
            (time) => minute && time.textContent?.includes(minute)
          );
          if (time) {
            list.scrollTop = time.offsetTop;
          }
          times.forEach((t) => t.classList.toggle('focus', t === time));
        },
        oninput: (e: Event) => {
          const min = (<HTMLInputElement>e.target).value.trim();
          if (/^[0-9]$/.test(min)) {
            minute = formatDateNum(Number(min));
          } else {
            minute = min;
          }
          const times = $$('.egg_minute_wrap .egg_time');
          const list = $$('.egg_minute_wrap .egg_list')[0];
          const time = times.find(
            (time) => minute && time.textContent?.includes(minute)
          );
          if (time) {
            list.scrollTop = time.offsetTop;
          }
          times.forEach((t) => t.classList.toggle('focus', t === time));
          // 更改事件
          onchange &&
            onchange({
              hour,
              minute,
              valid:
                /^([01][0-9]|[2][0-3])$/.test(hour) &&
                /^[0-5][0-9]$/.test(minute),
            });
        },
        onblur: (e: Event) => {
          const min = (<HTMLInputElement>e.target).value.trim();
          if (min && !/^[0-5][0-9]$/.test(min)) {
            if (/^[0-9]$/.test(min)) {
              (<HTMLInputElement>e.target).value = minute;
            } else {
              // 默认值
              (<HTMLInputElement>e.target).value = '';
              minute = '';
              // 移除样式
              const times = $$('.egg_minute_wrap .egg_time');
              times.forEach((t) => t.classList.remove('focus'));
              // 更改事件
              onchange &&
                onchange({
                  hour,
                  minute,
                  valid:
                    /^([01][0-9]|[2][0-3])$/.test(hour) &&
                    /^[0-5][0-9]$/.test(minute),
                });
            }
          }
          // 隐藏列表
          const list = $$('.egg_minute_wrap .egg_list')[0];
          setTimeout(() => {
            list.classList.add('hide');
          }, 100);
          // 失去焦点
          onblur &&
            onblur({
              hour,
              minute,
              valid:
                /^([01][0-9]|[2][0-3])$/.test(hour) &&
                /^[0-5][0-9]$/.test(minute),
            });
        },
      }),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_list hide' },
        new Array(60).fill(undefined).map((v, i) =>
          createElementNode(
            'div',
            undefined,
            {
              class: 'egg_time',
              onclick: (e: Event) => {
                const times = $$('.egg_minute_wrap .egg_time');
                const time = <HTMLElement>e.target;
                const list = $$('.egg_minute_wrap .egg_list')[0];
                const input = $$<HTMLInputElement>('.egg_minute')[0];
                minute = time.textContent || '';
                input.value = minute;
                list.scrollTop = time.offsetTop;
                times.forEach((t) => t.classList.toggle('focus', t === time));
                // 更改事件
                onchange &&
                  onchange({
                    hour,
                    minute,
                    valid:
                      /^([01][0-9]|[2][0-3])$/.test(hour) &&
                      /^[0-5][0-9]$/.test(minute),
                  });
              },
            },
            createTextNode(formatDateNum(i))
          )
        )
      ),
    ]),
  ]);
}

export { TimeInput };
