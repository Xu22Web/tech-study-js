import { version } from '../config/version';
import { clearScheduleTask, refreshScheduleTask } from '../controller/schedule';
import { createTip } from '../controller/tip';
import {
  maxRead,
  maxWatch,
  pushToken,
  scheduleList,
  settings,
  themeColor,
} from '../shared';
import { SettingType } from '../types';
import { Ref, ref, watch, watchEffectRef } from '../utils/composition';
import {
  $$,
  createElementNode,
  createNSElementNode,
  createTextNode,
} from '../utils/element';
import { formatDateNum } from '../utils/time';
import { debounce } from '../utils/utils';
import { ScheduleList } from './ScheduleList';
import { Select } from './Select';
import { TimeInput } from './TimeInput';

/**
 * @description 设置面板组件
 * @returns
 */
function SettingsPanel({ show }: { show: Ref<boolean> }) {
  // token
  let token = '';
  // 小时
  let hour = ref(-1);
  // 分钟
  let minute = ref(-1);
  return createElementNode(
    'div',
    undefined,
    {
      class: watchEffectRef(() => `egg_settings${show.value ? ' active' : ''}`),
    },
    [
      createElementNode(
        'div',
        undefined,
        { class: 'egg_settings_version_wrap' },
        [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_settings_label' },
            createTextNode('版本信息')
          ),
          createElementNode(
            'div',
            undefined,
            {
              class: 'egg_settings_version',
            },
            [
              createTextNode(`v${version}`),

              createElementNode(
                'a',
                undefined,
                {
                  class: 'egg_settings_version_detail',
                  title: 'GitHub Xu22Web/tech-study-js',
                  href: 'https://github.com/Xu22Web/tech-study-js',
                },
                createNSElementNode(
                  'svg',
                  undefined,
                  {
                    viewBox: '0 0 16 16',
                    class: 'egg_icon',
                  },
                  createNSElementNode('path', undefined, {
                    d: 'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z',
                  })
                )
              ),
            ]
          ),
        ]
      ),
      createElementNode(
        'div',
        undefined,
        { class: 'egg_settings_theme_wrap' },
        [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_settings_label' },
            createTextNode('主题预设')
          ),
          createElementNode(
            'div',
            undefined,
            { class: 'egg_settings_theme_colors' },
            [
              {
                value: '#fa3333',
                title: '强国红',
                detail: 'XueXi Red',
                code: 'none',
              },
              {
                value: '#bb2649',
                title: '非凡洋红',
                detail: 'Viva Magenta',
                code: '18-1750',
              },
              {
                value: '#35548a',
                title: '经典蓝',
                detail: 'Classic Blue',
                code: '19-4052',
              },
              {
                value: '#f36f63',
                title: '活珊瑚橘',
                detail: 'Living Coral',
                code: '16-1546',
              },
              {
                value: '#6d5b97',
                title: '紫外光色',
                detail: 'Ultra Violet',
                code: '18-3838',
              },
              {
                value: '#86af49',
                title: '草木绿',
                detail: 'Greenery',
                code: '15-0343',
              },
              {
                value: '#fc8bab',
                title: 'B站粉',
                detail: 'Bilibili Pink',
                code: 'none',
              },
              {
                value: '#056de8',
                title: '知乎蓝',
                detail: 'Zhihu Blue',
                code: 'none',
              },
            ].map((color) =>
              createElementNode(
                'div',
                undefined,
                {
                  class: 'egg_settings_theme_color_wrap',
                },
                createElementNode('button', undefined, {
                  class: 'egg_settings_theme_color',
                  type: 'button',
                  style: watchEffectRef(
                    () =>
                      `color: ${color.value};${
                        themeColor.value === color.value
                          ? ''
                          : ` box-shadow: 0rem 0.4rem 0.1rem 0.1rem ${color.value}30;`
                      }`
                  ),

                  title: color.title,
                  onclick: debounce(() => {
                    if (themeColor.value !== color.value) {
                      themeColor.value = color.value;
                      // 存储
                      GM_setValue('themeColor', themeColor.value);
                    }
                  }, 300),
                })
              )
            )
          ),
        ]
      ),
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_settings_read_time_wrap',
        },
        [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_settings_label' },
            createTextNode('最大文章时长')
          ),
          Select({
            data: [
              {
                label: '40s',
                value: 40,
              },
              {
                label: '60s',
                value: 60,
              },
              {
                label: '80s',
                value: 80,
              },
              {
                label: '100s',
                value: 100,
              },
            ],
            value: maxRead,
            placeholder: '100s',
            maxlength: 4,
            keep: true,
            onchange({ value }) {
              // 创建提示
              createTip('最大文章时长 已保存!');
              maxRead.value = value;
              // 存储
              GM_setValue('maxRead', value);
            },
          }),
        ],
        {
          onMounted() {
            try {
              const maxReadTemp = <number>GM_getValue('maxRead');
              if (maxReadTemp) {
                maxRead.value = maxReadTemp;
              }
            } catch (e) {}
          },
        }
      ),
      createElementNode(
        'div',
        undefined,
        {
          class: 'egg_settings_watch_time_wrap',
        },
        [
          createElementNode(
            'div',
            undefined,
            { class: 'egg_settings_label' },
            createTextNode('最大视听时长')
          ),
          Select({
            data: [
              {
                label: '40s',
                value: 40,
              },
              {
                label: '60s',
                value: 60,
              },
              {
                label: '80s',
                value: 80,
              },
              {
                label: '100s',
                value: 100,
              },
              {
                label: '120s',
                value: 120,
              },
            ],
            value: maxWatch,
            placeholder: '120s',
            maxlength: 4,
            keep: true,
            onchange({ value }) {
              // 创建提示
              createTip('最大视听时长 已保存!');
              maxWatch.value = value;
              // 存储
              GM_setValue('maxWatch', value);
            },
          }),
        ],
        {
          onMounted() {
            try {
              const maxWatchTemp = <number>GM_getValue('maxWatch');
              if (maxWatchTemp) {
                maxWatch.value = maxWatchTemp;
              }
            } catch (e) {}
          },
        }
      ),
      watchEffectRef(() =>
        settings[SettingType.REMOTE_PUSH]
          ? createElementNode(
              'div',
              undefined,
              { class: 'egg_settings_token_wrap' },
              [
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_settings_token' },
                  [
                    createElementNode(
                      'div',
                      undefined,
                      { class: 'egg_settings_label' },
                      createTextNode('我的 token')
                    ),
                    createElementNode('input', undefined, {
                      class: 'egg_settings_token_input',
                      placeholder: '用户 token',
                      maxlength: 32,
                      value: pushToken.value,
                      onfocus: (e: Event) => {
                        const input = <HTMLInputElement>e.target;
                        input.classList.add('active');
                        const btnWrap = $$('.egg_settings_submit_btn_wrap')[0];
                        btnWrap.classList.add('active');
                      },
                      onblur: (e: Event) => {
                        const input = <HTMLInputElement>e.target;
                        // 去除空格
                        const value = input.value.trim();
                        if (/^[0-9a-z]{32}$/.test(value)) {
                          token = value;
                          input.value = value;
                        } else {
                          token = '';
                        }
                        input.classList.remove('active');
                        setTimeout(() => {
                          const btnWrap = $$(
                            '.egg_settings_submit_btn_wrap'
                          )[0];
                          btnWrap.classList.remove('active');
                          input.value = pushToken.value;
                        }, 200);
                      },
                    }),
                  ]
                ),
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_settings_submit_btn_wrap' },
                  createElementNode(
                    'button',
                    undefined,
                    {
                      class: 'egg_settings_submit_btn',
                      onclick: debounce(() => {
                        // 创建提示
                        createTip('用户 token 已保存!');
                        if (token !== pushToken.value) {
                          pushToken.value = token;
                          // 存储
                          GM_setValue('pushToken', token);
                        }
                      }, 300),
                    },
                    createTextNode('保存')
                  )
                ),
              ]
            )
          : undefined
      ),
      watchEffectRef(() =>
        settings[SettingType.SCHEDULE_RUN]
          ? createElementNode('div', undefined, { class: 'egg_schedule' }, [
              createElementNode(
                'div',
                undefined,
                { class: 'egg_schedule_time_wrap' },
                [
                  createElementNode(
                    'div',
                    undefined,
                    { class: 'egg_schedule_time' },
                    [
                      createElementNode(
                        'div',
                        undefined,
                        { class: 'egg_schedule_label' },
                        createTextNode('设置时间')
                      ),
                      createElementNode(
                        'div',
                        undefined,
                        { class: 'egg_schedule_time_input_wrap' },
                        [
                          TimeInput({
                            hour,
                            minute,
                            onchange({ hour: h, minute: min }) {
                              hour.value = h;
                              minute.value = min;
                            },
                          }),
                          createElementNode(
                            'button',
                            undefined,
                            {
                              class: 'egg_schedule_add_btn',
                              onclick: debounce(() => {
                                // 定时刷新
                                if (!settings[SettingType.SCHEDULE_RUN]) {
                                  createTip('未开启定时刷新!');
                                  return;
                                }
                                if (hour.value === -1 || minute.value === -1) {
                                  createTip('时间格式不符合要求!');
                                  return;
                                }
                                // 重复定时存在
                                const exists = scheduleList.find(
                                  (schedule) =>
                                    schedule.hour === hour.value &&
                                    schedule.minute === minute.value
                                );
                                if (exists) {
                                  createTip('设置定时任务重复!');
                                  return;
                                }
                                createTip('设置定时任务成功!');
                                // 添加
                                scheduleList.push({
                                  hour: hour.value,
                                  minute: minute.value,
                                  time: `${formatDateNum(
                                    hour.value
                                  )}:${formatDateNum(minute.value)}`,
                                });
                                // 排序
                                scheduleList.sort((a, b) =>
                                  a.hour === b.hour
                                    ? a.minute - b.minute
                                    : a.hour - b.hour
                                );
                                // 存储
                                GM_setValue(
                                  'scheduleList',
                                  JSON.stringify(scheduleList)
                                );
                                // 清空
                                hour.value = -1;
                                minute.value = -1;
                                const inputs = $$<HTMLInputElement>(
                                  '.egg_time_input input'
                                );
                                inputs.forEach((i) => (i.value = ''));
                                // 刷新任务
                                refreshScheduleTask();
                              }, 300),
                            },
                            createNSElementNode(
                              'svg',
                              undefined,
                              {
                                viewBox: '0 0 1024 1024',
                                class: 'egg_icon',
                              },
                              createNSElementNode('path', undefined, {
                                d: 'M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z',
                              })
                            )
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
              ScheduleList(),
            ])
          : undefined
      ),
    ],
    {
      onMounted() {
        // 刷新token
        watch(
          () => settings[SettingType.REMOTE_PUSH],
          () => {
            // 远程推送
            if (settings[SettingType.REMOTE_PUSH]) {
              try {
                const tokenTemp = <string>GM_getValue('pushToken');
                if (tokenTemp) {
                  pushToken.value = tokenTemp;
                }
              } catch (e) {}
            }
          },
          true
        );
        // 刷新定时任务
        watch(
          () => settings[SettingType.SCHEDULE_RUN],
          () => {
            // 定时任务打开
            if (settings[SettingType.SCHEDULE_RUN]) {
              try {
                const scheduleTemp = JSON.parse(GM_getValue('scheduleList'));
                if (scheduleTemp && Array.isArray(scheduleTemp)) {
                  for (const i in scheduleTemp) {
                    scheduleList[i] = scheduleTemp[i];
                  }
                }
              } catch (e) {}
              // 刷新定时任务
              refreshScheduleTask();
              return;
            }
            // 清除任务
            clearScheduleTask();
          },
          true
        );
      },
    }
  );
}

export { SettingsPanel };
