import {} from './api/answer';
import {} from './api/data';
import {} from './api/login';
import {} from './api/push';
import {} from './api/user';
import {} from './config/task';
import URL_CONFIG from './config/url';
import {} from './config/api';
import { version } from './config/version';
import { Settings } from './types';
import { watch } from './utils/composition';
import { $$, $_, createElementNode, mountElement } from './utils/element';
import { error, log } from './utils/log';
import {} from './utils/push';
import {} from './utils/random';
import {} from './utils/time';
import { hasMobile, load } from './utils/utils';
import { maxRead, maxWatch, settings, taskConfig, themeColor } from './shared';
import { doingExam, ExamType } from './controller/exam';
import { initChildListener, initMainListener } from './controller/frame';
import {} from './controller/login';
import { handleNews, handleVideo } from './controller/readAndWatch';
import {} from './controller/schedule';
import { createTip } from './controller/tip';
import {} from './controller/user';
import {} from './component/Tip';
import {} from './component/Hr';
import {} from './component/Select';
import { ExamBtn } from './component/ExamBtn';
import { Frame } from './component/Frame';
import {} from './component/LoginItem';
import {} from './component/InfoItem';
import {} from './component/ScoreItem';
import {} from './component/NoramlItem';
import {} from './component/TaskItem';
import {} from './component/TaskList';
import {} from './component/TaskBtn';
import {} from './component/ScheduleList';
import {} from './component/TimeInput';
import {} from './component/SettingsPanel';
import { Panel } from './component/Panel';
import css from './css/index.css?raw';

/**
 * @description 嵌入样式
 */
GM_addStyle(css);

load(
  (href) => href.match(URL_CONFIG.home),
  () => {
    // 初始化logo
    initLogo();
    // 页面提示
    log('进入主页面!');

    // 初始化主题
    initThemeColor();
    // 初始化任务配置
    initTaskConfig();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化主页面
    initMainListener();
    // 初始化提示
    renderTip();
    // 渲染面板
    renderPanel();
    // 渲染窗口
    renderFrame();
  }
);

load(
  (href) => href === GM_getValue('readingUrl'),
  async () => {
    // 页面提示
    log('进入文章选读页面!');

    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 最大阅读
    initMaxRead();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    try {
      // 处理文章
      await handleNews();
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 提示
        createTip(err.message);
        // 错误
        error(err.message);
        return;
      }
      // 提示
      createTip(String(err));
      // 错误
      error(err);
    }
  }
);

load(
  (href) => href === GM_getValue('watchingUrl'),
  async () => {
    // 页面提示
    log('进入视听学习页面!');

    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 最大视听
    initMaxWatch();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    try {
      // 处理视频
      await handleVideo();
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 提示
        createTip(err.message);
        // 错误
        error(err.message);
        return;
      }
      // 提示
      createTip(String(err));
      // 错误
      error(err);
    }
  }
);

load(
  (href) => href === URL_CONFIG.examPractice,
  async () => {
    // 页面提示
    log('进入每日答题页面!');

    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    // 创建答题按钮
    await renderExamBtn();
    try {
      // 开始答题
      await doingExam(ExamType.PRACTICE);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 提示
        createTip(err.message);
        // 错误
        error(err.message);
        return;
      }
      // 提示
      createTip(String(err));
      // 错误
      error(err);
    }
  }
);

load(
  (href) => href.includes(URL_CONFIG.examPaper),
  async () => {
    // 页面提示
    log('进入专项练习页面!');

    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    // 创建答题按钮
    await renderExamBtn();
    // 开始答题
    doingExam(ExamType.PAPER);
    return;
  }
);

/**
 * @description 初始化logo
 */
function initLogo() {
  console.log(
    `%c tech-study.js %c ${version} `,
    'background:dodgerblue;color:white;font-size:15px;border-radius:4px 0 0 4px;padding:2px 0;',
    'background:black;color:gold;font-size:15px;border-radius:0 4px 4px 0;padding:2px 0;'
  );
}

/**
 * @description 初始化配置
 */
function initTaskConfig() {
  try {
    const taskTemp = JSON.parse(GM_getValue('taskConfig'));
    if (taskTemp && Array.isArray(taskTemp)) {
      if (taskTemp.length === taskConfig.length) {
        taskConfig.forEach((task, i) => {
          task.active = taskTemp[i].active;
        });
      }
    }
    // 监听值变化
    GM_addValueChangeListener('taskConfig', (key, oldVal, newVal, remote) => {
      if (remote) {
        const taskTemp = JSON.parse(newVal);
        if (taskTemp && Array.isArray(taskTemp)) {
          if (taskTemp.length === taskConfig.length) {
            taskConfig.forEach((task, i) => {
              task.active = taskTemp[i].active;
            });
          }
        }
      }
    });
  } catch (e) {}
}

/**
 * @description 初始化配置
 */
function initSettings() {
  try {
    const settingsTemp = JSON.parse(GM_getValue('studySettings'));
    if (settingsTemp && Array.isArray(settingsTemp)) {
      if (settingsTemp.length === settings.length) {
        for (const i in settingsTemp) {
          settings[i] = (<Settings>settingsTemp)[i];
        }
      }
    }
    // 监听值变化
    GM_addValueChangeListener(
      'studySettings',
      (key, oldVal, newVal, remote) => {
        if (remote) {
          const settingsTemp = JSON.parse(newVal);
          if (settingsTemp && Array.isArray(settingsTemp)) {
            if (settingsTemp.length === settings.length) {
              for (const i in settingsTemp) {
                settings[i] = (<Settings>settingsTemp)[i];
              }
            }
          }
        }
      }
    );
  } catch (e) {}
}

/**
 * @description 初始化配置
 */
function initFontSize() {
  // 移动端
  const moblie = hasMobile();
  if (moblie) {
    // 清除缩放
    const meta = $$<HTMLMetaElement>('meta[name=viewport]')[0];
    if (meta) {
      meta.content = 'initial-scale=0, user-scalable=yes';
    }
    // 缩放比例
    const scale = ~~(window.innerWidth / window.outerWidth) || 1;
    document.documentElement.style.setProperty('--scale', String(scale));
  }
}

/**
 * @description 初始化最大阅读时长
 */
function initMaxRead() {
  try {
    const maxReadTemp = <number>GM_getValue('maxRead');
    if (maxReadTemp) {
      maxRead.value = maxReadTemp;
    }
  } catch (error) {}
}

/**
 * @description 初始化最大视听时长
 */
function initMaxWatch() {
  try {
    const maxWatchTemp = <number>GM_getValue('maxWatch');
    if (maxWatchTemp) {
      maxWatch.value = maxWatchTemp;
    }
  } catch (error) {}
}

/**
 * @description 初始化主题色
 */
function initThemeColor() {
  try {
    // 监听主题变化
    watch(themeColor, () => {
      // 设置主题
      document.documentElement.style.setProperty(
        '--themeColor',
        themeColor.value
      );
    });
    // 主题色
    const themeColorTemp = <string>GM_getValue('themeColor');
    if (themeColorTemp) {
      themeColor.value = themeColorTemp;
    }
    // 监听值变化
    GM_addValueChangeListener('themeColor', (key, oldVal, newVal, remote) => {
      if (remote) {
        // 主题色
        const themeColorTemp = <string>newVal;
        if (themeColorTemp) {
          themeColor.value = themeColorTemp;
        }
      }
    });
  } catch (error) {}
}

/**
 * @description 渲染提示
 */
function renderTip() {
  const tipWrap = createElementNode('div', undefined, {
    class: 'egg_tip_wrap',
    onclick(e: Event) {
      e.stopPropagation();
    },
    onmousedown(e: Event) {
      e.stopPropagation();
    },
    onmousemove(e: Event) {
      e.stopPropagation();
    },
    onmouseup(e: Event) {
      e.stopPropagation();
    },
    onmouseenter(e: Event) {
      e.stopPropagation();
    },
    onmouseleave(e: Event) {
      e.stopPropagation();
    },
    onmouseover(e: Event) {
      e.stopPropagation();
    },
    ontouchstart(e: Event) {
      e.stopPropagation();
    },
    ontouchmove(e: Event) {
      e.stopPropagation();
    },
    ontouchend(e: Event) {
      e.stopPropagation();
    },
    oninput(e: Event) {
      e.stopPropagation();
    },
    onchange(e: Event) {
      e.stopPropagation();
    },
    onblur(e: Event) {
      e.stopPropagation();
    },
  });
  mountElement(tipWrap);
}

/**
 * @description 渲染答题按钮
 */
async function renderExamBtn() {
  const titles = await $_('.title');
  if (titles.length) {
    // 插入节点
    titles[0].parentNode?.insertBefore(ExamBtn().ele, titles[0].nextSibling);
  }
}

/**
 * @description 渲染面板
 * @returns
 */
async function renderPanel() {
  // 面板
  const panel = Panel();
  // 插入节点
  mountElement(panel);
}

/**
 * @description 渲染窗口
 */
function renderFrame() {
  // 窗口
  const frame = Frame();
  // 插入节点
  mountElement(frame);
}
