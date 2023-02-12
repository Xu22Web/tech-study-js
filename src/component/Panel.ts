import { createTip } from '../controller/tip';
import { mainStore } from '../store';
import { ProgressType, SettingType } from '../types';
import { debounce, hasMobile } from '../utils/utils';
import { ref, watchEffectRef, watchEffectRefs } from '../utils/composition';
import {
  createElementNode,
  createNSElementNode,
  createTextNode,
} from '../utils/element';
import { Hr } from './Hr';
import { Info } from './Infor';
import { NomalItem } from './NoramlItem';
import { SchedulePanel } from './SchdulePanel';
import { ScoreInfo } from './ScoreInfo';
import { TaskItem } from './TaskItem';
/**
 * @description 面板
 * @returns
 */
function Panel({ login }: { login: boolean }) {
  // 任务标签
  const taskLabels = mainStore.tasks.map((task) => ({
    title: task.title,
    tip: task.tip,
    type: task.type,
  }));
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
      tip: '无答案时, 随机选择或者填入答案, 不保证正确!',
      type: SettingType.RANDOM_EXAM,
    },
  ];
  // 推送设置标签
  const pushLabels = [
    {
      title: '远程推送',
      tip: '利用 pushplus 推送, 将登录二维码直接推送到微信公众号',
      type: SettingType.REMOTE_PUSH,
      handler(){
        
      }
    },
  ];
  // 处理设置变化
  const handleChangeAndNotice = (
    e: Event,
    type: SettingType,
    title: string
  ) => {
    // 开关
    const { checked } = <HTMLInputElement>e.target;
    if (mainStore.settings[type] !== checked) {
      mainStore.settings[type] = checked;
      // 设置
      GM_setValue('studySetting', JSON.stringify(mainStore.settings));
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
          panelShow,
          () => `egg_panel${panelShow.value ? ' hide' : ''}`
        ),
      },
      [
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_user_item',
          },
          Info({ login })
        ),
        createElementNode(
          'div',
          undefined,
          {
            class: 'egg_score_item',
          },
          ScoreInfo({ login })
        ),
        // 任务部分
        Hr({ text: '任务' }),
        ...taskLabels.map((label, i) => {
          // 处理变化
          const handleChange = debounce(handleChangeAndNotice, 500);
          return TaskItem({
            title: label.title,
            tip: label.tip,
            checked: mainStore.settings[label.type],
            percent: mainStore.tasks[i].percent,
            onChange: (e) => {
              handleChange(e, label.type, label.title);
            },
          });
        }),
        // 运行部分
        Hr({ text: '运行' }),
        ...runLabels.map((label) => {
          // 处理变化
          const handleChange = debounce(handleChangeAndNotice, 500);
          return NomalItem({
            title: label.title,
            tip: label.tip,
            checked: mainStore.settings[label.type],
            onChange: (e) => {
              handleChange(e, label.type, label.title);
            },
          });
        }),
        // 答题部分
        Hr({ text: '答题' }),
        ...examLabels.map((label) => {
          // 处理变化
          const handleChange = debounce(handleChangeAndNotice, 500);
          return NomalItem({
            title: label.title,
            tip: label.tip,
            checked: mainStore.settings[label.type],
            onChange: (e) => {
              handleChange(e, label.type, label.title);
            },
          });
        }),
        // 推送部分
        Hr({ text: '推送' }),
        ...pushLabels.map((label) => {
          // 处理变化
          const handleChange = debounce(handleChangeAndNotice, 500);
          return NomalItem({
            title: label.title,
            tip: label.tip,
            checked: mainStore.settings[label.type],
            onChange: (e) => {
              handleChange(e, label.type, label.title);
            },
          });
        }),
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
                class: watchEffectRefs(
                  [mainStore.frameShow, mainStore.frameExist],
                  () =>
                    `egg_frame_show_btn${
                      !mainStore.frameExist.value || mainStore.frameShow.value
                        ? ' hide'
                        : ''
                    }`
                ),
                type: 'button',
                onclick: () => {
                  mainStore.frameShow.value = true;
                },
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
                class: 'egg_setting_show_btn',
                type: 'button',
                onclick: () => {
                  panelShow.value = !panelShow.value;
                },
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
                class:
                  mainStore.settings[SettingType.REMOTE_PUSH] ||
                  mainStore.settings[SettingType.SCHEDULE_RUN]
                    ? watchEffectRef(
                        scheduleShow,
                        () =>
                          `egg_setting_push_btn${
                            scheduleShow.value ? ' active' : ''
                          }`
                      )
                    : 'egg_setting_push_btn hide',
                type: 'button',
                onclick: () => {
                  scheduleShow.value = !scheduleShow.value;
                },
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
                    d: 'M825.571556 176.355556c68.778667 0 124.472889 55.751111 124.472888 124.416v422.456888c0 68.721778-55.751111 124.416-124.472888 124.416H198.485333A124.416 124.416 0 0 1 73.955556 723.171556V300.828444C73.955556 232.106667 129.706667 176.355556 198.428444 176.355556zM893.155556 358.456889l-366.08 228.864a28.444444 28.444444 0 0 1-25.372445 2.389333l-4.778667-2.389333L130.844444 358.456889v364.771555c0 34.929778 26.567111 63.715556 60.643556 67.128889l6.883556 0.398223h627.2c37.319111 0 67.584-30.264889 67.584-67.584V358.513778zM825.571556 233.244444H198.485333c-34.304 0-62.577778 25.486222-67.015111 58.595556L512 529.635556l380.586667-237.795556A67.584 67.584 0 0 0 825.628444 233.244444z',
                  }),
                ]
              )
            ),
          ]
        ),
        // 开始按钮
        login
          ? createElementNode(
              'div',
              undefined,
              { class: 'egg_study_item' },
              createElementNode(
                'button',
                undefined,
                {
                  class: watchEffectRef(
                    mainStore.progress,
                    () =>
                      `egg_study_btn${
                        mainStore.progress.value === ProgressType.LOADING ||
                        mainStore.progress.value === ProgressType.START
                          ? ' loading'
                          : mainStore.progress.value === ProgressType.FINISH
                          ? ' disabled'
                          : ''
                      }`
                  ),

                  type: 'button',
                  disabled: watchEffectRef(
                    mainStore.progress,
                    () =>
                      mainStore.progress.value === ProgressType.LOADING ||
                      mainStore.progress.value === ProgressType.FINISH
                  ),
                },
                createTextNode(
                  watchEffectRef(
                    mainStore.progress,
                    () =>
                      `${
                        mainStore.progress.value === ProgressType.LOADING
                          ? '等待中'
                          : mainStore.progress.value === ProgressType.LOADED
                          ? '开始学习'
                          : mainStore.progress.value === ProgressType.START
                          ? '正在学习, 点击暂停'
                          : mainStore.progress.value === ProgressType.PAUSE
                          ? '继续学习'
                          : mainStore.progress.value === ProgressType.FINISH
                          ? '已完成'
                          : ''
                      }`
                  )
                )
              )
            )
          : undefined,
        createElementNode(
          'div',
          undefined,
          { class: 'egg_schedule_settings_item' },
          SchedulePanel({
            scheduleList: mainStore.scheduleList,
            show: scheduleShow,
          })
        ),
      ]
    )
  );
}

export { Panel };
