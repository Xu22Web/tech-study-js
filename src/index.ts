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
import { log } from './utils/log';
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
import {} from './controller/tip';
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
    // 处理文章
    handleNews();
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
    // 处理视频
    handleVideo();
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
    // 开始答题
    doingExam(ExamType.PRACTICE);
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
    const configTemp = JSON.parse(GM_getValue('taskConfig'));
    if (configTemp && configTemp.length === taskConfig.length) {
      taskConfig.forEach((task, i) => {
        task.active = configTemp[i].active;
      });
      return;
    }
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
      return;
    }
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
      // 文档对象
      const doc = $$(':root')[0];
      // 设置主题
      doc.style.setProperty('--themeColor', themeColor.value);
    });
    // 主题色
    const themeColorTemp = <string>GM_getValue('themeColor');
    if (themeColorTemp) {
      themeColor.value = themeColorTemp;
    }
  } catch (error) {}
}

/**
 * @description 渲染提示
 */
function renderTip() {
  const tipWrap = createElementNode('div', undefined, {
    class: 'egg_tip_wrap',
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
