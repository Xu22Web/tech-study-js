import { createTip } from '../controller/tip';
import { refreshTaskList } from '../controller/user';
import { login, taskConfig, taskStatus } from '../shared';
import { TaskStatusType, TaskType } from '../types';
import { watch, watchEffectRef } from '../utils/composition';
import { createElementNode } from '../utils/element';
import { debounce } from '../utils/utils';
import { TaskItem } from './TaskItem';

/**
 * @description 任务
 */
function TaskList() {
  // 处理任务设置变化
  const handleTaskChange = (e: Event, type: TaskType, title: string) => {
    // 开关
    const { checked } = <HTMLInputElement>e.target;
    if (taskConfig[type].active !== checked) {
      taskConfig[type].active = checked;
      // 设置
      GM_setValue('taskConfig', JSON.stringify(taskConfig));
      // 创建提示
      createTip(`${title} ${checked ? '打开' : '关闭'}!`);
    }
  };
  // 登录加载
  watch(
    login,
    async () => {
      if (login.value) {
        // 加载任务列表
        await refreshTaskList();
        // 未完成任务
        if (taskConfig.some((task) => task.active && !task.status)) {
          // 全局暂停
          GM_setValue('pauseStudy', false);
          // 加载完毕
          taskStatus.value = TaskStatusType.LOADED;
          return;
        }
        // 任务完毕
        taskStatus.value = TaskStatusType.FINISH;
      }
    },
    true
  );
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_task_list',
    },
    taskConfig.map((label, i) =>
      label.immutable
        ? TaskItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => label.active),
            percent: watchEffectRef(() => label.percent),
            onchange: debounce((e) => {
              handleTaskChange(e, label.type, label.title);
            }, 300),
            immutable: label.immutable,
          })
        : TaskItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => label.active),
            percent: watchEffectRef(() => label.percent),
            onchange: debounce((e) => {
              handleTaskChange(e, label.type, label.title);
            }, 300),
            immutable: label.immutable,
          })
    )
  );
}

export { TaskList };
