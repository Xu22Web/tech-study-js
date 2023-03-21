import { doExamPaper, doExamPractice } from '../controller/exam';
import { closeFrame } from '../controller/frame';
import { readNews, watchVideo } from '../controller/readAndWatch';
import { createTip } from '../controller/tip';
import {
  frame,
  login,
  pushToken,
  settings,
  taskConfig,
  taskStatus,
  todayScore,
  totalScore,
  userinfo,
} from '../shared';
import { SettingType, TaskStatusType, TaskType } from '../types';
import { watch, watchEffectRef } from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';
import { log, error } from '../utils/log';
import { getHighlightHTML, getProgressHTML, pushModal } from '../utils/push';
import { debounce, studyPauseLock } from '../utils/utils';

/**
 * @description 任务按钮
 */
function TaskBtn() {
  return watchEffectRef(() => {
    if (login.value) {
      /**
       * @description 学习
       */
      async function study() {
        // 创建提示
        createTip('开始学习!');
        // 暂停
        await studyPauseLock();
        // 文章选读
        if (
          taskConfig[TaskType.READ].active &&
          !taskConfig[TaskType.READ].status
        ) {
          log('任务一: 文章选读');
          // 创建提示
          createTip('任务一: 文章选读');
          // 暂停
          await studyPauseLock();
          // 看新闻
          await readNews();
        }
        log('任务一: 文章选读已完成!');

        // 视听学习
        if (
          taskConfig[TaskType.WATCH].active &&
          !taskConfig[TaskType.WATCH].status
        ) {
          log('任务二: 视听学习');
          // 创建提示
          createTip('任务二: 视听学习');
          // 暂停
          await studyPauseLock();
          // 看视频
          await watchVideo();
        }
        log('任务二: 视听学习已完成!');

        // 每日答题
        if (
          taskConfig[TaskType.PRACTICE].active &&
          !taskConfig[TaskType.PRACTICE].status
        ) {
          log('任务三: 每日答题');
          // 创建提示
          createTip('任务三: 每日答题');
          // 暂停
          await studyPauseLock();
          // 做每日答题
          await doExamPractice();
        }
        log('任务三: 每日答题已完成!');

        // 专项练习
        if (
          taskConfig[TaskType.PAPER].active &&
          !taskConfig[TaskType.PAPER].status
        ) {
          log('任务四: 专项练习');
          // 创建提示
          createTip('任务四: 专项练习');
          // 暂停
          await studyPauseLock();
          // 做专项练习
          await doExamPaper();
        }
        log('任务四: 专项练习已完成!');
      }
      /**
       * @description 暂停任务
       */
      function pauseTask() {
        // 全局暂停
        GM_setValue('pauseStudy', true);
        taskStatus.value = TaskStatusType.PAUSE;
      }
      /**
       * @description 继续任务
       */
      function continueTask() {
        // 全局暂停
        GM_setValue('pauseStudy', false);
        taskStatus.value = TaskStatusType.START;
      }
      /**
       * @description 开始任务
       */
      async function startTask() {
        // 未完成任务
        if (taskConfig.some((task) => task.active && !task.status)) {
          // 开始任务
          taskStatus.value = TaskStatusType.START;
          try {
            // 学习
            await study();
            // 同屏任务
            if (settings[SettingType.SAME_TAB]) {
              // 关闭窗口
              closeFrame();
              // 窗口不存在
              frame.exist = false;
            }
          } catch (err: any) {
            if (err instanceof Error) {
              // 提示
              createTip(err.message);
              // 错误
              error(err.message);
              return;
            }
            // 提示
            createTip(err);
            // 错误
            error(err);
          }
        }
        // 刷新任务
        taskStatus.value = TaskStatusType.FINISH;
        log('已完成');
        // 创建提示
        createTip('完成学习!');
        // 远程推送
        if (settings[SettingType.REMOTE_PUSH]) {
          // 推送
          const res = await pushModal(
            {
              title: '学习推送',
              to: userinfo.nick,
              content: [
                '学习强国, 学习完成!',
                `当天积分:  ${getHighlightHTML(todayScore.value)} 分`,
                `总积分: ${getHighlightHTML(totalScore.value)} 分`,
                ...taskConfig.map((task) =>
                  getProgressHTML(task.title, task.percent)
                ),
              ],
              type: 'success',
            },
            pushToken.value
          );
          createTip(`学习推送${res ? '成功' : '失败'}!`);
        }
      }
      // 已在等待
      let flag = false;
      // 自动答题
      watch(
        () => [taskStatus.value, settings[SettingType.AUTO_START]],
        async () => {
          // 加载完毕
          if (!flag && taskStatus.value === TaskStatusType.LOADED) {
            // 自动答题
            if (settings[SettingType.AUTO_START]) {
              // 等待中
              flag = true;
              // 创建提示
              const tip = createTip('即将自动开始任务', 5, true);
              // 等待倒计时结束
              await tip.waitCountDown();
              // 再次查看是否开启
              if (
                settings[SettingType.AUTO_START] &&
                taskStatus.value !== <any>TaskStatusType.START
              ) {
                // 创建提示
                createTip('自动开始任务');
                // 开始任务
                startTask();
                return;
              }
              // 取消等待
              flag = false;
              // 创建提示
              createTip('已取消自动开始任务!');
            }
          }
        }
      );
      // 切换开关任务未完成
      taskConfig.forEach((task) => {
        watch(
          () => [task.active],
          () => {
            if (taskStatus.value === TaskStatusType.FINISH) {
              if (task.active && !task.status) {
                taskStatus.value = TaskStatusType.LOADED;
              }
            }
          }
        );
      });
      return createElementNode(
        'div',
        undefined,
        { class: 'egg_study_item' },
        createElementNode(
          'button',
          undefined,
          {
            class: watchEffectRef(
              () =>
                `egg_study_btn${
                  taskStatus.value === TaskStatusType.LOADING ||
                  taskStatus.value === TaskStatusType.START
                    ? ' loading'
                    : taskStatus.value === TaskStatusType.FINISH
                    ? ' disabled'
                    : ''
                }`
            ),

            type: 'button',
            disabled: watchEffectRef(
              () =>
                taskStatus.value === TaskStatusType.LOADING ||
                taskStatus.value === TaskStatusType.FINISH
            ),
            onclick: watchEffectRef(() =>
              taskStatus.value === TaskStatusType.LOADED
                ? debounce(startTask, 300)
                : taskStatus.value === TaskStatusType.START
                ? debounce(pauseTask, 300)
                : taskStatus.value === TaskStatusType.PAUSE
                ? debounce(continueTask, 300)
                : undefined
            ),
          },
          createTextNode(
            watchEffectRef(
              () =>
                `${
                  taskStatus.value === TaskStatusType.LOADING
                    ? '等待中'
                    : taskStatus.value === TaskStatusType.LOADED
                    ? '开始学习'
                    : taskStatus.value === TaskStatusType.START
                    ? '正在学习, 点击暂停'
                    : taskStatus.value === TaskStatusType.PAUSE
                    ? '继续学习'
                    : taskStatus.value === TaskStatusType.FINISH
                    ? '已完成'
                    : ''
                }`
            )
          )
        )
      );
    }
  });
}

export { TaskBtn };
