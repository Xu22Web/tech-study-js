import { getNewsList, getVideoList } from '../api/data';
import { maxNewsNum, maxVideoNum, muted } from '../config/task';
import { maxRead, maxWatch, taskConfig } from '../shared';
import { NewsVideoList, TaskType } from '../types';
import { $$, $_ } from '../utils/element';
import { log } from '../utils/log';
import { sleep, studyPauseLock } from '../utils/utils';
import { handleCloseTaskWin, waitTaskWin } from './frame';
import { createTip } from './tip';
import { refreshScoreInfo, refreshTaskList } from './user';

/**
 * @description 新闻
 */
let news: NewsVideoList = [];

/**
 * @description 视频
 */
let videos: NewsVideoList = [];

/**
 * @description 处理文章
 */
async function handleNews() {
  // section
  const sections = await $_('section', undefined, 5000);
  const section = sections[0];
  if (!(section && section.innerText.includes('系统正在维护中'))) {
    // 文章选读
    reading(0);
    return;
  }
  log('未找到文章!');
  // 提示
  createTip('未找到文章!');
  // 关闭页面
  handleCloseTaskWin();
}

/**
 * @description 处理视频
 */
async function handleVideo() {
  // videos
  const videos = await $_('video', undefined, 10000);
  // 视频
  const video = <HTMLVideoElement | undefined>videos[0];
  // 播放按键
  const playBtn = $$('.prism-play-btn')[0];
  if (video && playBtn) {
    // 设置是否静音
    video.muted = muted;
    log('正在尝试播放视频...');
    // 播放超时
    const timeout = setTimeout(() => {
      log('视频播放超时!');
      // 提示
      createTip('视频播放超时!');
      // 关闭页面
      handleCloseTaskWin();
    }, 20000);
    // 能播放
    video.addEventListener('canplay', () => {
      log('正在尝试播放视频...');
      if (video.paused) {
        // 尝试使用js的方式播放
        video.play();
        if (video.paused) {
          // 尝试点击播放按钮播放
          playBtn.click();
        }
      }
      // 已经播放
      if (!video.paused) {
        clearTimeout(timeout);
        // 视听学习
        reading(1);
      }
    });
    return;
  }
  log('未找到视频!');
  // 关闭页面
  handleCloseTaskWin();
}

/**
 * @description 读新闻或者看视频
 * @param type :0为新闻,1为视频
 */
async function reading(type: number) {
  let time = 30;
  // 文章选读
  if (type === 0) {
    // maxRead.value 秒后关闭页面, 看文章
    time = maxRead.value;
  }
  // 视听学习
  if (type === 1) {
    // 视频
    const video = $$<HTMLVideoElement>('video')[0];
    // 总时长
    const { duration } = video;
    // min(duration,  maxWatch.value) 秒后关闭页面, 看文章
    time = duration > maxWatch.value ? maxWatch.value : ~~duration;
  }
  // 随机
  time = time - ~~(Math.random() * 10) + 5;
  // 第一次滚动时间
  const firstTime = time - (~~(Math.random() * 4) + 4);
  // 第二次滚动时间
  const secendTime = ~~(Math.random() * 4) + 8;
  // 窗口
  const window = unsafeWindow;
  // 创建提示
  const tip = createTip('距离关闭页面还剩', time, true, async (time) => {
    // 暂停锁
    await studyPauseLock((flag) => {
      if (type === 1) {
        // 视频
        const video = $$<HTMLVideoElement>('video')[0];
        // 排除反复设置
        if (video.paused === !flag) {
          return;
        }
        // 设置播放状态
        video[flag ? 'play' : 'pause']();
      }
    });
    // 第一次滚动
    if (time === firstTime) {
      // 滚动
      window.scrollTo(0, 400);
      // 模拟滚动
      const scroll = new Event('scroll', {
        bubbles: true,
      });
      document.dispatchEvent(scroll);
      // 模拟滑动
      const mousemove = new MouseEvent('mousemove', {
        bubbles: true,
      });
      document.dispatchEvent(mousemove);
      // 模拟点击
      const click = new Event('click', {
        bubbles: true,
      });
      document.dispatchEvent(click);
    }
    // 第二次滚动
    if (time === secendTime) {
      // 滚动长度
      const scrollLength = document.body.scrollHeight / 2;
      // 滚动
      window.scrollTo(0, scrollLength);
      // 模拟滚动
      const scroll = new Event('scroll', {
        bubbles: true,
      });
      document.dispatchEvent(scroll);
      // 模拟滑动
      const mousemove = new MouseEvent('mousemove', {
        bubbles: true,
      });
      document.dispatchEvent(mousemove);
      // 模拟点击
      const click = new Event('click', {
        bubbles: true,
      });
      document.dispatchEvent(click);
    }
  });
  // 倒计时结束
  await tip.waitCountDown();
  // 关闭任务窗口
  handleCloseTaskWin();
}

/**
 * @description 获取新闻列表
 */
function getNews() {
  return new Promise(async (resolve) => {
    // 需要学习的新闻数量
    const need =
      taskConfig[TaskType.READ].need < maxNewsNum
        ? taskConfig[TaskType.READ].need
        : maxNewsNum;
    log(`剩余 ${need} 个新闻`);
    // 获取重要新闻
    const data = await getNewsList();
    if (data && data.length) {
      // 数量补足需要数量
      while (news.length < need) {
        // 随便取
        const randomIndex = ~~(Math.random() * data.length);
        // 新闻
        const item = data[randomIndex];
        // 是否存在新闻
        if (item.dataValid && item.type === 'tuwen') {
          news.push(item);
        }
      }
    } else {
      news = [];
    }
    resolve('done');
  });
}

/**
 * @description 获取视频列表
 */
function getVideos() {
  return new Promise(async (resolve) => {
    // 需要学习的视频数量
    const need =
      taskConfig[TaskType.WATCH].need < maxVideoNum
        ? taskConfig[TaskType.WATCH].need
        : maxVideoNum;
    log(`剩余 ${need} 个视频`);
    // 获取重要视频
    const data = await getVideoList();
    if (data && data.length) {
      // 数量补足需要数量
      while (videos.length < need) {
        // 随便取
        const randomIndex = ~~(Math.random() * data.length);
        // 视频
        const item = data[randomIndex];
        // 是否存在视频
        if (
          item.dataValid &&
          (item.type === 'shipin' || item.type === 'juji')
        ) {
          videos.push(item);
        }
      }
    } else {
      videos = [];
    }
    resolve('done');
  });
}

/**
 * @description 阅读文章
 */
async function readNews() {
  // 获取文章
  await getNews();
  // 观看文章
  for (const i in news) {
    // 任务关闭跳出循环
    if (!taskConfig[TaskType.READ].active) {
      return;
    }
    // 暂停
    await studyPauseLock();
    log(`正在阅读第 ${Number(i) + 1} 个新闻...`);
    // 创建提示
    createTip(`正在阅读第 ${Number(i) + 1} 个新闻`);
    // 链接
    const { url } = news[i];
    // 链接
    GM_setValue('readingUrl', url);
    // 等待任务窗口
    await waitTaskWin(url, '文章选读');
    // 清空链接
    GM_setValue('readingUrl', null);
    // 创建提示
    createTip(`完成阅读第 ${Number(i) + 1} 个新闻!`);
    // 等待一段时间
    await sleep(1500);
    // 刷新分数数据
    await refreshScoreInfo();
    // 刷新任务数据
    await refreshTaskList();
    // 任务完成跳出循环
    if (taskConfig[TaskType.READ].active && taskConfig[TaskType.READ].status) {
      break;
    }
  }
  // 任务关闭跳出循环
  if (!taskConfig[TaskType.READ].active) {
    return;
  }
  // 任务完成状况
  if (taskConfig[TaskType.READ].active && !taskConfig[TaskType.READ].status) {
    log('任务未完成, 继续阅读新闻!');
    // 创建提示
    createTip('任务未完成, 继续阅读新闻!');
    await readNews();
  }
}

/**
 * @description 观看视频
 */
async function watchVideo() {
  // 获取视频
  await getVideos();
  // 观看视频
  for (const i in videos) {
    // 任务关闭跳出循环
    if (!taskConfig[TaskType.WATCH].active) {
      return;
    }
    // 暂停
    await studyPauseLock();
    log(`正在观看第 ${Number(i) + 1} 个视频...`);
    // 创建提示
    createTip(`正在观看第 ${Number(i) + 1} 个视频`);
    // 链接
    const { url } = videos[i];
    // 链接
    GM_setValue('watchingUrl', url);
    // 等待任务窗口
    await waitTaskWin(url, '视听学习');
    // 清空链接
    GM_setValue('watchingUrl', null);
    // 创建提示
    createTip(`完成观看第 ${Number(i) + 1} 个视频!`);
    // 等待一段时间
    await sleep(1500);
    // 刷新分数数据
    await refreshScoreInfo();
    // 刷新任务数据
    await refreshTaskList();
    // 任务完成跳出循环
    if (
      taskConfig[TaskType.WATCH].active &&
      taskConfig[TaskType.WATCH].status
    ) {
      break;
    }
  }
  // 任务关闭跳出循环
  if (!taskConfig[TaskType.WATCH].active) {
    return;
  }
  // 任务完成状况
  if (taskConfig[TaskType.WATCH].active && !taskConfig[TaskType.WATCH].status) {
    log('任务未完成, 继续观看视频!');
    // 创建提示
    createTip('任务未完成, 继续观看看视频!');
    await watchVideo();
  }
}

export { readNews, watchVideo, reading, handleVideo, handleNews };
