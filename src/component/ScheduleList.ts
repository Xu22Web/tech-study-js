import { refreshScheduleTask } from '../controller/schedule';
import { createTip } from '../controller/tip';
import { mainStore } from '../store';
import { Schedule, SettingType } from '../types';
import {
  $$,
  createElementNode,
  createNSElementNode,
  createTextNode,
} from '../utils/element';
import { isLate } from '../utils/time';

/**
 * @description 定时项目
 * @returns
 */
function ScheduleList({ scheduleList }: { scheduleList: Schedule[] }) {
  return createElementNode(
    'div',
    undefined,
    { class: 'egg_schedule_list' },
    scheduleList.length
      ? scheduleList.map((schedule, i) =>
          createElementNode('div', undefined, { class: 'egg_schedule_item' }, [
            createElementNode(
              'div',
              undefined,
              {
                class: `egg_schedule_detail_time_wrap${
                  isLate(schedule) ? ' inactive' : ''
                }`,
              },
              [
                createElementNode(
                  'div',
                  undefined,
                  {
                    class: 'egg_schedule_detail_icon',
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
                        d: 'M810.137703 213.860762c-164.388001-164.4187-431.887404-164.4187-596.277452 0-164.417677 164.388001-164.417677 431.889451 0 596.278475 164.390048 164.417677 431.890474 164.417677 596.277452 0C974.557426 645.750213 974.557426 378.248763 810.137703 213.860762zM767.347131 767.345596c-140.797723 140.829446-369.927237 140.797723-510.693238 0-140.828422-140.797723-140.828422-369.895515 0-510.708588 140.767024-140.783397 369.896538-140.813073 510.693238 0C908.14383 397.420405 908.14383 626.578572 767.347131 767.345596z',
                      }),
                      createNSElementNode('path', undefined, {
                        d: 'M721.450824 521.495258 515.404028 521.495258l0.028653-227.948619c0-15.124466-12.362562-27.458375-27.501354-27.458375s-27.443026 12.33391-27.443026 27.458375l0 235.115855c0 0.835018-1.013073 20.48659 12.094456 34.459836 8.331759 8.809643 20.038382 13.288654 35.148521 13.288654l213.720569 0.031722c15.140839 0 27.472702-12.304234 27.472702-27.474748C748.922503 533.887496 736.620315 521.584286 721.450824 521.495258z',
                      }),
                    ]
                  )
                ),
                createElementNode(
                  'div',
                  undefined,
                  { class: 'egg_schedule_detail_time' },
                  createTextNode(schedule.time)
                ),
              ]
            ),
            createElementNode(
              'div',
              undefined,
              { class: 'egg_schedule_detail_del_wrap' },
              [
                createElementNode(
                  'button',
                  undefined,
                  {
                    class: 'egg_schedule_del_btn',
                    onclick: () => {
                      // 定时刷新
                      if (!mainStore.settings[SettingType.SCHEDULE_RUN]) {
                        createTip('未开启定时刷新!');
                        return;
                      }
                      // 索引
                      const index = scheduleList.findIndex(
                        (s) => s === schedule
                      );
                      // 删除元素
                      scheduleList.splice(index, 1);
                      // 存储
                      GM_setValue('scheduleList', JSON.stringify(scheduleList));
                      // 重新渲染
                      const list = $$('.egg_schedule_list')[0];
                      const scheduleAdd = $$('.egg_schedule_add')[0];
                      list.remove();
                      scheduleAdd.append(ScheduleList({ scheduleList }));
                      // 刷新任务
                      refreshScheduleTask();
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
                        d: 'M896.22 896.22c14.262-14.263 11.263-40.449-6.583-58.295L230.473 178.76c-17.847-17.847-44.105-20.846-58.295-6.583-14.263 14.19-11.264 40.448 6.583 58.295l659.164 659.164c17.846 17.846 44.032 20.845 58.294 6.582',
                      }),
                      createNSElementNode('path', undefined, {
                        d: 'M172.178 896.22c-14.263-14.263-11.264-40.449 6.583-58.295L837.925 178.76c17.846-17.847 44.032-20.846 58.294-6.583 14.263 14.19 11.264 40.448-6.582 58.295L230.4 889.637c-17.847 17.846-44.105 20.845-58.295 6.582',
                      }),
                    ]
                  )
                ),
              ]
            ),
          ])
        )
      : createElementNode(
          'div',
          undefined,
          { class: 'egg_schedule_list_none' },
          [
            createNSElementNode(
              'svg',
              undefined,
              {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
              },
              [
                createNSElementNode('path', undefined, {
                  d: 'M238.1 520.5c-17.6 0-31.9-14.3-31.9-31.9 0-17.6 14.3-31.9 31.9-31.9h293c17.6 0 31.9 14.3 31.9 31.9 0 17.6-14.3 31.9-31.9 31.9h-293zM238.1 733.6c-17.6 0-31.9-14.3-31.9-31.9s14.3-31.9 31.9-31.9h186.5c17.6 0 31.9 14.3 31.9 31.9s-14.3 31.9-31.9 31.9H238.1zM241.6 314.9c-17.6 0-31.9-14.3-31.9-31.9s14.3-31.9 31.9-31.9h426.1c17.6 0 31.9 14.3 31.9 31.9 0 17.5-14.3 31.7-31.8 31.9H241.6z',
                }),
                createNSElementNode('path', undefined, {
                  d: 'M160 926.6c-46.9 0-85.1-38.2-85.1-85.1V149.1c0-46.9 38.2-85.1 85.1-85.1h586c46.9 0 85.1 38.2 85.1 85.1v297.4c0 17.6-14.3 31.9-31.9 31.9-17.6 0-31.9-14.3-31.9-31.9V149.1c0-11.8-9.6-21.4-21.4-21.4H160c-11.8 0-21.4 9.6-21.4 21.4v692.4c0 11.8 9.6 21.4 21.4 21.4h304.5c17.5 0 31.8 14.2 31.9 31.8 0 17.6-14.3 31.8-31.9 31.8H160z',
                }),
                createNSElementNode('path', undefined, {
                  d: 'M917.2 959.9c-8.5 0-16.5-3.3-22.5-9.3l-78.5-78.5-5.3-0.5-0.6 0.4c-31.7 21.6-68.7 33-107 33-105.2 0-190.8-85.6-190.8-190.8s85.6-190.8 190.8-190.8c105.2 0 190.8 85.6 190.8 190.8 0 38.2-11.4 75.2-33 107l-0.4 0.6 0.5 5.3 78.5 78.5c6 6 9.3 14 9.3 22.5s-3.4 16.5-9.4 22.5c-5.9 6-13.9 9.3-22.4 9.3zM703.4 587c-70.1 0-127.2 57.1-127.2 127.2s57.1 127.2 127.2 127.2 127.2-57.1 127.2-127.2S773.6 587 703.4 587z',
                }),
              ]
            ),
            createElementNode(
              'div',
              undefined,
              {
                class: 'egg_schedule_list_none_text',
              },
              createTextNode('暂无定时任务')
            ),
          ]
        )
  );
}

export { ScheduleList };
