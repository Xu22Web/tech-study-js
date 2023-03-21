import { createTip } from '../controller/tip';
import { frame, settings } from '../shared';
import { SettingType } from '../types';
import { ref, watchEffectRef, watchRef } from '../utils/composition';
import { createElementNode, createNSElementNode } from '../utils/element';
import { debounce, hasMobile } from '../utils/utils';
import { Hr } from './Hr';
import { InfoItem } from './InfoItem';
import { LoginItem } from './LoginItem';
import { NomalItem } from './NoramlItem';
import { SettingsPanel } from './SettingsPanel';
import { ScoreItem } from './ScoreItem';
import { TaskBtn } from './TaskBtn';
import { TaskList } from './TaskList';

/**
 * @description 面板
 * @returns
 */
function Panel() {
  // 运行设置标签
  const runLabels = [
    {
      title: '自动开始',
      tip: '启动时, 自动开始任务, 在倒计时结束前自动开始可随时取消; 如果在自动开始前手动开始任务, 此次自动开始将取消',
      type: SettingType.AUTO_START,
    },
    {
      title: '同屏任务',
      tip: '运行任务时，所有任务均在当前页面以弹窗方式运行',
      type: SettingType.SAME_TAB,
    },
    {
      title: '静默运行',
      tip: '同屏任务时, 不显示任务弹窗静默运行',
      type: SettingType.SILENT_RUN,
    },
    {
      title: '定时刷新',
      tip: '定时刷新页面，重新进行任务，此功能需要长时间占用浏览器',
      type: SettingType.SCHEDULE_RUN,
    },
  ];
  // 运行设置标签
  const examLabels = [
    {
      title: '随机作答',
      tip: '无答案时, 随机选择或者填入答案, 不保证正确',
      type: SettingType.RANDOM_EXAM,
    },
    {
      title: '专项逆序',
      tip: '专项答题时, 逆序作答',
      type: SettingType.PAPER_REVERSE,
    },
  ];
  // 推送设置标签
  const pushLabels = [
    {
      title: '远程推送',
      tip: '利用 pushplus 推送, 将登录二维码直接推送到微信公众号',
      type: SettingType.REMOTE_PUSH,
      handler() {},
    },
  ];
  // 处理设置变化
  const handleSettingsChange = (e: Event, type: SettingType, title: string) => {
    // 开关
    const { checked } = <HTMLInputElement>e.target;
    if (settings[type] !== checked) {
      settings[type] = checked;
      // 设置
      GM_setValue('studySettings', JSON.stringify(settings));
      // 创建提示
      createTip(`${title} ${checked ? '打开' : '关闭'}!`);
    }
  };
  // 任务显示
  const scheduleShow = ref(false);
  // 面板显示
  const panelShow = ref(false);
  return createElementNode(
    'div',
    undefined,
    {
      class: `egg_panel_wrap${hasMobile() ? ' mobile' : ''}`,
    },
    createElementNode(
      'div',
      undefined,
      {
        class: watchEffectRef(
          () => `egg_panel${panelShow.value ? ' hide' : ''}`
        ),
      },
      [
        // 登录
        LoginItem(),
        // 信息
        InfoItem(),
        // 分数
        ScoreItem(),
        // 任务部分
        Hr({ text: '任务' }),
        TaskList(),
        // 运行部分
        Hr({ text: '运行' }),
        createElementNode(
          'div',
          undefined,
          { class: 'egg_run_list' },
          watchEffectRef(() => {
            return runLabels.map((label) => {
              // 处理变化
              const handleChange = debounce(handleSettingsChange, 300);
              return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                  handleChange(e, label.type, label.title);
                },
              });
            });
          })
        ),
        // 答题部分
        Hr({ text: '答题' }),
        createElementNode(
          'div',
          undefined,
          { class: 'egg_exam_list' },
          watchEffectRef(() => {
            return examLabels.map((label) => {
              // 处理变化
              const handleChange = debounce(handleSettingsChange, 300);
              return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                  handleChange(e, label.type, label.title);
                },
              });
            });
          })
        ),
        // 推送部分
        Hr({ text: '推送' }),
        createElementNode(
          'div',
          undefined,
          { class: 'egg_push_list' },
          watchEffectRef(() => {
            return pushLabels.map((label) => {
              // 处理变化
              const handleChange = debounce(handleSettingsChange, 300);
              return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                  handleChange(e, label.type, label.title);
                },
              });
            });
          })
        ),
        // 按钮集合
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_btns_wrap',
          },
          [
            createElementNode(
              'button',
              undefined,
              {
                class: watchRef(
                  () => [frame.exist, frame.show],
                  () =>
                    `egg_frame_show_btn${
                      !frame.exist || frame.show ? ' hide' : ''
                    }`
                ),
                title: '窗口',
                type: 'button',
                onclick: debounce(() => {
                  // 窗口显示
                  frame.show = true;
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
                  d: 'M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z',
                })
              )
            ),
            createElementNode(
              'button',
              undefined,
              {
                class: 'egg_panel_show_btn',
                title: '面板',
                type: 'button',
                onclick: debounce(() => {
                  panelShow.value = !panelShow.value;
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
                  d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
                })
              )
            ),
            createElementNode(
              'button',
              undefined,
              {
                class: watchEffectRef(
                  () =>
                    `egg_settings_show_btn${
                      scheduleShow.value ? ' active' : ''
                    }`
                ),
                title: '设置',
                type: 'button',
                onclick: debounce(() => {
                  scheduleShow.value = !scheduleShow.value;
                }, 300),
              },
              createNSElementNode(
                'svg',
                undefined,
                {
                  viewBox: '0 0 1024 1024',
                  class: 'egg_icon',
                },
                [
                  createNSElementNode('path', undefined, {
                    d: 'M7.25325 705.466473a503.508932 503.508932 0 0 0 75.26742 121.391295 95.499302 95.499302 0 0 0 93.211173 31.07039 168.59902 168.59902 0 0 1 114.526906 16.257763 148.487566 148.487566 0 0 1 71.052444 83.456515 91.163899 91.163899 0 0 0 75.989987 61.538643 578.053784 578.053784 0 0 0 148.969278 0A91.163899 91.163899 0 0 0 662.380873 957.642436a148.487566 148.487566 0 0 1 72.256723-83.456515 168.59902 168.59902 0 0 1 114.406478-16.257763 95.61973 95.61973 0 0 0 93.331601-31.07039 503.508932 503.508932 0 0 0 75.267419-121.391295 84.29951 84.29951 0 0 0-18.545892-94.897163 138.251197 138.251197 0 0 1 0-197.140426 84.29951 84.29951 0 0 0 18.545892-94.897163 503.508932 503.508932 0 0 0-75.869559-121.391295 95.499302 95.499302 0 0 0-93.211173-31.070391A168.59902 168.59902 0 0 1 734.637596 149.812272a148.848849 148.848849 0 0 1-72.256723-83.456515A91.163899 91.163899 0 0 0 586.631741 4.817115a581.907476 581.907476 0 0 0-148.969277 0A91.163899 91.163899 0 0 0 361.311193 66.355757a148.848849 148.848849 0 0 1-71.413728 83.456515 168.59902 168.59902 0 0 1-114.406478 16.257763 95.378874 95.378874 0 0 0-93.3316 31.070391A503.508932 503.508932 0 0 0 7.25325 318.531721a84.29951 84.29951 0 0 0 18.545893 94.897163 140.057615 140.057615 0 0 1 41.30676 98.509999 140.057615 140.057615 0 0 1-41.30676 98.630427A84.29951 84.29951 0 0 0 7.25325 705.466473z m929.462315-349.240828a219.901294 219.901294 0 0 0 0 312.028615c0.842995 0.842995 2.649413 3.010697 1.806418 5.057971a427.398517 427.398517 0 0 1-63.104205 101.520696 9.513802 9.513802 0 0 1-9.032091 2.167702 255.547944 255.547944 0 0 0-173.777418 24.928569 231.823653 231.823653 0 0 0-111.275354 130.302957 6.984817 6.984817 0 0 1-6.021394 4.937543 492.790851 492.790851 0 0 1-126.328837 0 6.984817 6.984817 0 0 1-6.021394-4.937543 231.823653 231.823653 0 0 0-111.275353-130.302957 255.668372 255.668372 0 0 0-120.427872-30.468252 258.919924 258.919924 0 0 0-52.747408 5.539683 9.513802 9.513802 0 0 1-9.03209-2.167702 427.398517 427.398517 0 0 1-63.104205-101.520696c-0.842995-2.047274 0.963423-4.214976 1.806418-5.057971a221.82814 221.82814 0 0 0 64.910623-156.556233 221.707712 221.707712 0 0 0-65.512762-155.713238c-0.842995-0.842995-2.649413-3.010697-1.806418-5.057971a427.398517 427.398517 0 0 1 63.104205-101.520696 9.393374 9.393374 0 0 1 8.911662-2.167701 255.7888 255.7888 0 0 0 173.897847-24.92857 231.823653 231.823653 0 0 0 111.275353-130.302957 6.984817 6.984817 0 0 1 6.021394-4.937543 492.790851 492.790851 0 0 1 126.328837 0 6.984817 6.984817 0 0 1 6.021394 4.937543 231.823653 231.823653 0 0 0 111.275354 130.302957 255.547944 255.547944 0 0 0 173.777418 24.92857 9.513802 9.513802 0 0 1 9.032091 2.167701 423.063113 423.063113 0 0 1 62.983777 101.520696c0.963423 2.047274-0.842995 4.214976-1.68599 5.057971z',
                  }),
                  createNSElementNode('path', undefined, {
                    d: 'M512.086889 305.766366a206.292944 206.292944 0 1 0 206.172516 206.172517 206.413372 206.413372 0 0 0-206.172516-206.172517z m123.197713 206.172517a123.197713 123.197713 0 1 1-123.197713-123.077285 123.318141 123.318141 0 0 1 123.197713 123.077285z',
                  }),
                ]
              )
            ),
          ]
        ),
        // 任务按钮
        TaskBtn(),
        createElementNode('div', undefined, { class: 'egg_settings_item' }, [
          SettingsPanel({ show: scheduleShow }),
        ]),
      ]
    )
  );
}

export { Panel };
