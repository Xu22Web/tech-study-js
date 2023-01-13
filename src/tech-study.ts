import API_CONFIG from './config/api';
import URL_CONFIG from './config/url';
import { autoRefreshQRCodeInterval } from './config/task';
import {} from './api/push';
import {} from './api/user';
import {} from './api/data';
import {} from './api/answer';
import {} from './api/login';
import { SettingType, TaskType } from './types';
import { defaultSettings, mainStore } from './store';
import {} from './component/Hr';
import {} from './component/Infor';
import {} from './component/ScoreInfo';
import {} from './component/TimeInput';
import {} from './component/ScheduleList';
import {} from './component/SchdulePanel';
import {} from './component/NoramlItem';
import {} from './component/TaskItem';
import { Panel } from './component/Panel';
import { Frame } from './component/Frame';
import { hasMobile, pauseStudyLock, getVideoTag } from './utils';
import { log } from './utils/log';
import { $$, $_, createElementNode } from './utils/element';
import { getHighlightHTML, getProgressHTML, pushModal } from './utils/push';
import { createTip } from './utils/tip';
import {} from './utils/random';
import {} from './utils/time';
import {} from './utils/win';
import { closeFrame } from './utils/frame';
import { refreshScheduleTask } from './controller/schedule';
import { refreshLoginQRCode } from './controller/login';
import { refreshInfo } from './controller/user';
import { reading, readNews, watchVideo } from './controller/readAndWatch';
import {
  doExamPaper,
  doExamPractice,
  doingExam,
  ExamType,
} from './controller/exam';
import css from './css/index.css?raw';
/**
 * @description 嵌入样式
 */
GM_addStyle(css);

/**
 * @description load
 */
window.addEventListener('load', () => {
  // 链接
  const { href } = mainStore;
  // 主页
  if (URL_CONFIG.home.test(href)) {
    // 初始化logo
    initLogo();
    // 页面提示
    log('进入主页面!');

    // 初始化设置
    initSetting();
    // 设置字体
    initFontSize();
    // 初始化提示
    initTip();
    // 初始化推送 token
    initPushToken();
    // 初始化定时任务
    initScheduleList();
    // 渲染面板
    renderPanel();
    // 渲染窗口
    renderFrame();
    // 渲染二维码
    renderQRCode();
    return;
  }
  // 文章选读
  if (
    typeof GM_getValue('readingUrl') === 'string' &&
    href === GM_getValue('readingUrl')
  ) {
    // 页面提示
    log('进入文章选读页面!');

    // 初始化设置
    initSetting();
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 初始化提示
    initTip();
    reading(0);
    return;
  }
  // 视听学习页面
  if (
    typeof GM_getValue('watchingUrl') === 'string' &&
    href === GM_getValue('watchingUrl')
  ) {
    // 页面提示
    log('进入视听学习页面!');

    // 初始化设置
    initSetting();
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 初始化提示
    initTip();
    let randNum = 0;
    const checkVideoPlayingInterval = setInterval(() => {
      // 获取视频标签
      let temp = getVideoTag();
      if (temp.video) {
        // 静音
        if (!temp.video.muted) {
          temp.video.muted = true;
        }
        if (temp.video.paused) {
          log('正在尝试播放视频...');
          if (randNum === 0) {
            // 尝试使用js的方式播放
            try {
              temp.video.play(); // 尝试使用js的方式播放
            } catch (e) {}
            randNum++;
          } else {
            try {
              temp.pauseButton?.click(); // 尝试点击播放按钮播放
            } catch (e) {}
            randNum--;
          }
        } else {
          log('视频成功播放!');
          clearInterval(checkVideoPlayingInterval);
          reading(1);
        }
      } else {
        log('等待加载...');
      }
    }, 800);
    return;
  }
  // 每日答题页面
  if (href.includes(URL_CONFIG.examPractice)) {
    // 页面提示
    log('进入每日答题页面!');

    // 初始化设置
    initSetting();
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 初始化提示
    initTip();

    // title
    $_('.title').then(() => {
      // 创建“手动答题”按钮
      renderExamBtn();
      // 开始答题
      doingExam(ExamType.PRACTICE);
    });
    return;
  }
  // 专项练习页面
  if (href.includes(URL_CONFIG.examPaper)) {
    // 页面提示
    log('进入专项练习页面!');

    // 初始化设置
    initSetting();
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 初始化提示
    initTip();
    // title
    $_('.title').then(() => {
      // 创建“手动答题”按钮
      renderExamBtn();
      // 开始答题
      doingExam(ExamType.PAPER);
    });
    return;
  }
  log('此页面不支持加载学习脚本!');
});

/**
 * @description 初始化logo
 */
function initLogo() {
  console.log(
    `%c tech-study.js %c ${mainStore.version} `,
    'background:dodgerblue;color:white;font-size:15px;border-radius:4px 0 0 4px;padding:2px 0;',
    'background:black;color:gold;font-size:15px;border-radius:0 4px 4px 0;padding:2px 0;'
  );
}

/**
 * @description 初始化配置
 */
function initSetting() {
  try {
    const settingTemp = JSON.parse(GM_getValue('studySetting'));
    if (settingTemp && settingTemp.length === defaultSettings.length) {
      mainStore.settings = settingTemp;
      return;
    }
  } catch (e) {}
  // 初始化设置
  mainStore.settings = defaultSettings;
}

/**
 * @description 初始化提示
 */
function initTip() {
  const tipWrap = createElementNode('div', undefined, {
    class: 'egg_tip_wrap',
  });
  document.body.append(tipWrap);
}

/**
 * @description 初始化配置
 */
function initPushToken() {
  // 远程推送
  if (mainStore.settings[SettingType.REMOTE_PUSH]) {
    try {
      const tokenTemp = <string>GM_getValue('pushToken');
      if (tokenTemp) {
        mainStore.pushToken = tokenTemp;
      }
    } catch (e) {
      // 没有则直接初始化
      mainStore.pushToken = '';
    }
  }
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
 * @description 初始化 id
 */
function initFrameID() {
  if (mainStore.settings[SettingType.SAME_TAB]) {
    window.addEventListener('message', (msg: MessageEvent) => {
      const { data } = msg;
      if (data.id) {
        mainStore.id = data.id;
        log(`初始化窗口 ID: ${mainStore.id}`);
      }
    });
  }
}

/**
 * @description 初始化定时任务
 */
function initScheduleList() {
  if (mainStore.settings[SettingType.SCHEDULE_RUN]) {
    try {
      const scheduleTemp = JSON.parse(GM_getValue('scheduleList'));
      if (scheduleTemp) {
        mainStore.scheduleList = scheduleTemp;
      }
    } catch (e) {
      // 没有则直接初始化
      mainStore.scheduleList = [];
    }
    // 刷新定时任务
    refreshScheduleTask();
  }
}

/**
 * @description 渲染答题按钮
 */
function renderExamBtn() {
  const title = $$('.title')[0];
  // 插入节点
  title.parentNode?.insertBefore(
    createElementNode(
      'button',
      { innerText: '关闭自动答题' },
      {
        class: 'egg_exam_btn',
        type: 'button',
        onclick: () => {
          const ExamBtn = $$('.egg_exam_btn')[0];
          mainStore.pause = !mainStore.pause;
          if (mainStore.pause) {
            ExamBtn.innerText = '开启自动答题';
            ExamBtn.classList.add('manual');
          } else {
            ExamBtn.innerText = '关闭自动答题';
            ExamBtn.classList.remove('manual');
          }
        },
      }
    ),
    title.nextSibling
  );
}

/**
 * @description 渲染面板
 * @returns
 */
async function renderPanel() {
  // 面板
  const panel = Panel({ login: mainStore.login });
  // 插入节点
  document.body.append(panel);
  // 已经登录
  if (mainStore.login) {
    // 刷新信息
    await refreshInfo();
    // 完成任务
    if (
      mainStore.tasks.every((task, i) => !mainStore.settings[i] || task.status)
    ) {
      finishTask();
      log('已完成');
      // 创建提示
      createTip('完成学习!');
      // 远程推送
      if (mainStore.settings[SettingType.REMOTE_PUSH]) {
        //  当天分数
        const todayScore = $$<HTMLSpanElement>('.egg_todayscore_btn span')[0]
          ?.innerText;
        // 总分
        const totalScore = $$<HTMLSpanElement>('.egg_totalscore span')[0]
          ?.innerText;
        // 推送
        const res = await pushModal(
          {
            title: '学习推送',
            content: [
              '学习强国, 学习完成!',
              `当天积分:  ${getHighlightHTML(todayScore)} 分`,
              `总积分: ${getHighlightHTML(totalScore)} 分`,
              ...mainStore.tasks.map((task) =>
                getProgressHTML(task.title, task.percent)
              ),
            ],
            type: 'success',
          },
          mainStore.pushToken
        );
        createTip(`学习推送${res ? '成功' : '失败'}!`);
      }
      // 定时任务
      if (mainStore.settings[SettingType.SCHEDULE_RUN]) {
        // 创建提示
        const tip = createTip('即将退出登录', 5);
        // 等待倒计时结束
        await tip.waitCountDown();
        // 退出登录
        const logged = $$("a[class='logged-link']")[0];
        logged && logged.click();
      }
      return;
    }
    // 开始学习按钮
    const studyBtn = $$<HTMLButtonElement>('.egg_study_btn')[0];
    if (studyBtn) {
      studyBtn.removeAttribute('disabled');
      studyBtn.classList.remove('loading');
      studyBtn.innerText = '开始学习';
      studyBtn.addEventListener('click', start);
    }
    // 自动答题
    if (mainStore.settings[SettingType.AUTO_START]) {
      // 创建提示
      const tip = createTip('即将自动开始任务', 5);
      // 等待倒计时结束
      await tip.waitCountDown();
      // 再次查看是否开启
      if (mainStore.settings[SettingType.AUTO_START] && !mainStore.started) {
        // 创建提示
        createTip('自动开始任务');
        start();
      } else {
        // 创建提示
        createTip('已取消自动开始任务!');
      }
    }
  }
}

/**
 * @description 渲染窗口
 */
function renderFrame() {
  if (mainStore.settings[SettingType.SAME_TAB]) {
    const frame = Frame();
    document.body.append(frame);
  }
}

/**
 * @description 渲染二维码
 */
async function renderQRCode() {
  // 加载二维码
  if (!mainStore.login && !mainStore.settings[SettingType.SCHEDULE_RUN]) {
    // 等待加载
    await $_('.egg_login_img_wrap');
    // 刷新二维码
    refreshLoginQRCode();
    // 每隔 100s 刷新
    mainStore.refreshTimer = setInterval(() => {
      // 刷新二维码
      refreshLoginQRCode();
    }, autoRefreshQRCodeInterval);
  }
}

/**
 * @description 学习
 */
async function study() {
  // 创建提示
  createTip('开始学习!');
  // 暂停
  await pauseStudyLock();
  // 任务
  if (mainStore.tasks.length) {
    // 文章宣读
    if (
      mainStore.settings[SettingType.READ] &&
      !mainStore.tasks[TaskType.READ].status
    ) {
      log('任务一: 文章选读');
      // 创建提示
      createTip('任务一: 文章选读');
      // 暂停
      await pauseStudyLock();
      // 看新闻
      await readNews();
    }
    log('任务一: 文章选读已完成!');
    // 视听学习
    if (
      mainStore.settings[SettingType.WATCH] &&
      !mainStore.tasks[TaskType.WATCH].status
    ) {
      log('任务二: 视听学习');
      // 创建提示
      createTip('任务二: 视听学习');
      // 暂停
      await pauseStudyLock();
      // 看视频
      await watchVideo();
    }
    log('任务二: 视听学习已完成!');
    // 每日答题
    if (
      mainStore.settings[SettingType.PRACTICE] &&
      !mainStore.tasks[TaskType.PRACTICE].status
    ) {
      log('任务三: 每日答题');
      // 创建提示
      createTip('任务三: 每日答题');
      // 暂停
      await pauseStudyLock();
      // 做每日答题
      await doExamPractice();
    }
    log('任务三: 每日答题已完成!');
    // 专项练习
    if (
      mainStore.settings[SettingType.PAPER] &&
      !mainStore.tasks[TaskType.PAPER].status
    ) {
      log('任务四: 专项练习');
      // 创建提示
      createTip('任务四: 专项练习');
      // 暂停
      await pauseStudyLock();
      // 做专项练习
      await doExamPaper();
    }
    log('任务四: 专项练习已完成!');
  }
}
/**
 * @description 暂停任务
 */
function pauseTask() {
  // 全局暂停
  if (GM_getValue('pauseStudy') !== true) {
    GM_setValue('pauseStudy', true);
  }
  // 开始按钮
  const studyBtn = $$('.egg_study_btn')[0];
  studyBtn.innerText = '继续学习';
  studyBtn.classList.remove('loading');
  studyBtn.removeEventListener('click', pauseTask);
  studyBtn.addEventListener('click', continueTask);
}
/**
 * @description 继续任务
 */
function continueTask() {
  // 全局暂停
  if (GM_getValue('pauseStudy') !== false) {
    GM_setValue('pauseStudy', false);
  }
  // 开始按钮
  const studyBtn = $$('.egg_study_btn')[0];
  studyBtn.innerText = '正在学习, 点击暂停';
  studyBtn.classList.add('loading');
  studyBtn.removeEventListener('click', continueTask);
  studyBtn.addEventListener('click', pauseTask);
}
/**
 * @description 完成任务
 */
function finishTask() {
  // 全局暂停
  if (GM_getValue('pauseStudy') !== false) {
    GM_setValue('pauseStudy', false);
  }
  // 开始按钮
  const studyBtn = $$('.egg_study_btn')[0];
  studyBtn.innerText = '已完成';
  studyBtn.classList.remove('loading');
  studyBtn.classList.add('disabled');
  studyBtn.setAttribute('disabled', '');
}
/**
 * @description 开始
 */
async function start() {
  // 创建提示
  createTip('准备开始学习');
  // 保存配置
  log('准备开始学习...');
  if (mainStore.login && !mainStore.started) {
    mainStore.started = true;
    // 初始化暂停
    if (GM_getValue('pauseStudy') !== false) {
      GM_setValue('pauseStudy', false);
    }
    // 开始按钮
    const studyBtn = $$('.egg_study_btn')[0];
    studyBtn.innerText = '正在学习, 点击暂停';
    studyBtn.classList.add('loading');
    studyBtn.removeEventListener('click', start);
    // 点击暂停
    studyBtn.addEventListener('click', pauseTask);
    // 学习
    await study();
    // 刷新数据
    await refreshInfo();
    // 未完成
    if (
      !mainStore.tasks.every((task, i) => !mainStore.settings[i] || task.status)
    ) {
      // 再次学习
      await study();
    }
    finishTask();
    // 关闭窗口
    if (mainStore.settings[SettingType.SAME_TAB]) {
      closeFrame();
    }
    log('已完成');
    // 创建提示
    createTip('完成学习!');
    // 远程推送
    if (mainStore.settings[SettingType.REMOTE_PUSH]) {
      //  当天分数
      const todayScore = $$<HTMLSpanElement>('.egg_todayscore_btn span')[0]
        ?.innerText;
      // 总分
      const totalScore = $$<HTMLSpanElement>('.egg_totalscore span')[0]
        ?.innerText;
      // 推送
      const res = await pushModal(
        {
          title: '学习推送',
          content: [
            '学习强国, 学习完成!',
            `当天积分:  ${getHighlightHTML(todayScore)} 分`,
            `总积分: ${getHighlightHTML(totalScore)} 分`,
            ...mainStore.tasks.map((task) =>
              getProgressHTML(task.title, task.percent)
            ),
          ],
          type: 'success',
        },
        mainStore.pushToken
      );
      createTip(`学习推送${res ? '成功' : '失败'}!`);
    }
    // 定时任务
    if (mainStore.settings[SettingType.SCHEDULE_RUN]) {
      // 创建提示
      const tip = createTip('即将退出登录', 5);
      // 等待倒计时结束
      await tip.waitCountDown();
      // 退出登录
      const logged = $$("a[class='logged-link']")[0];
      logged && logged.click();
    }
  }
}
