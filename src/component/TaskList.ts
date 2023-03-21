import { createTip } from '../controller/tip';
import { refreshTaskList } from '../controller/user';
import { login, taskConfig, taskStatus } from '../shared';
import { TaskStatusType, TaskType } from '../types';
import {
  reactive,
  ref,
  watch,
  watchEffectRef,
  watchRef,
} from '../utils/composition';
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
  // 编辑模式
  const edit = ref(false);
  // 当前拖拽
  const current = ref(-1);
  const block: [number, number, number][] = [];
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_task_list',
      onmouseup: watchRef(edit, () =>
        edit.value
          ? (e: MouseEvent) => {
              const { clientY } = e;
              block.reduce((p, n, i) => {
                if (p[1] < clientY && n[1] > clientY) {
                  console.log(i);
                }
                return n;
              });
              edit.value = false;
            }
          : undefined
      ),
      ondblclick() {
        // edit.value = true;
      },
    },
    watchRef(
      () => taskConfig.map((v) => v.index),
      () => {
        // 任务标签
        const taskLabels = taskConfig.sort(
          (pre, next) => pre.index - next.index
        );
        const taskList = taskLabels.map((label, i) => {
          // 处理变化
          const handleChange = debounce(handleTaskChange, 300);
          const drag = watchEffectRef(() => current.value === i);
          const position = reactive({ x: 0, y: 0 });
          let deltaX = 0;
          let deltaY = 0;
          const ele = TaskItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => label.active),
            percent: watchEffectRef(() => label.percent),
            drag,
            edit,
            position,
            onchange(e) {
              handleChange(e, i, label.title);
            },
            onmousedown(e) {
              const { offsetLeft, offsetTop } = <HTMLElement>e.currentTarget;
              const { clientX, clientY } = e;
              current.value = i;
              position.x = offsetLeft;
              position.y = offsetTop;
              deltaX = clientX;
              deltaY = clientY;
            },
            onmousemove(e) {
              const { clientX, clientY } = e;
              position.x += clientX - deltaX;
              position.y += clientY - deltaY;
              deltaX = clientX;
              deltaY = clientY;
            },
            onmouseup() {
              current.value = -1;
              position.x = 0;
              position.y = 0;
            },
            onMounted() {
              const rect = ele.ele.getBoundingClientRect();
              const topLine = rect.y;
              const middleLine = rect.y + rect.height / 2;
              const bottomLine = rect.y + rect.height;
              block.push([topLine, middleLine, bottomLine]);
            },
          });
          return ele;
        });
        return taskList;
      }
    )
  );
}

export { TaskList };
