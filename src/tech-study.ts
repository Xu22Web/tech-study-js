import API_CONFIG from './config/api';
import URL_CONFIG from './config/url';
import css from './css/index.css?raw';
import {
  $$,
  closeWin,
  createElementNode,
  createRandomPath,
  createRandomPoint,
  debounce,
  generateMix,
  getCookie,
  hasMobile,
  openWin,
  waitingClose,
  waitingTime,
} from './utils';
/**
 * @description 嵌入样式
 */
GM_addStyle(css);
/* Config·配置 */
/**
 * @description 每周答题开启逆序答题: false: 顺序答题; true: 逆序答题
 */
const examWeeklyReverse = true;
/**
 * @description 专项答题开启逆序答题: false: 顺序答题; true: 逆序答题
 */
const examPaperReverse = true;
/**
 * @description  答题请求速率限制
 */
const ratelimitms = 3000;
/**
 * @description 单次最大新闻数
 */
const maxNewsNum = 6;
/**
 * @description 单次最大视频数
 */
const maxVideoNum = 6;
/* Config End·配置结束 */
/* Tools·工具函数  */
/**
 * @description 暂停锁
 */
function pauseLock(callback?: (msg: string) => void) {
  return new Promise((resolve) => {
    // 学习暂停
    const pauseStudy = <boolean>(GM_getValue('pauseStudy') || false);
    if (pauseStudy) {
      pauseExam(pauseStudy);
    }
    if (pause) {
      const doing = setInterval(() => {
        if (!pause) {
          // 停止定时器
          clearInterval(doing);
          console.log('答题等待结束!');
          if (callback && callback instanceof Function) {
            callback('done');
          }
          resolve('done');
          return;
        }
        if (callback && callback instanceof Function) {
          callback('pending');
        }
        console.log('答题等待...');
      }, 500);
      return;
    }
    resolve('done');
  });
}
/**
 * @description 暂停学习锁
 */
function pauseStudyLock(callback?: (msg: string) => void) {
  return new Promise((resolve) => {
    // 暂停
    const pauseStudy = GM_getValue('pauseStudy') || false;
    if (pauseStudy) {
      const doing = setInterval(() => {
        // 暂停
        const pauseStudy = GM_getValue('pauseStudy') || false;
        if (!pauseStudy) {
          // 停止定时器
          clearInterval(doing);
          console.log('学习等待结束!');
          if (callback && callback instanceof Function) {
            callback('done');
          }
          resolve('done');
          return;
        }
        if (callback && callback instanceof Function) {
          callback('pending');
        }
        console.log('学习等待...');
      }, 500);
      return;
    }
    resolve('done');
  });
}
/* Tools End·工具函数结束 */

/* API请求函数 */
/**
 * @description 获取用户信息
 */
async function getUserInfo() {
  try {
    const res = await fetch(API_CONFIG.userInfo, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      return data;
    }
  } catch (err) {}
}
/**
 * @description 获取总积分
 */
async function getTotalScore() {
  try {
    const res = await fetch(API_CONFIG.totalScore, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 总分
      const { score } = data;
      return score;
    }
  } catch (err) {}
}
/**
 * @description 获取当天总积分
 */
async function getTodayScore() {
  try {
    const res = await fetch(API_CONFIG.todayScore, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 当天总分
      const { score } = data;
      return score;
    }
  } catch (err) {}
}
/**
 * @description 获取任务列表
 */
async function getTaskList() {
  try {
    const res = await fetch(API_CONFIG.taskList, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const { data } = await res.json();
      // 进度和当天总分
      const { taskProgress } = data;
      return taskProgress;
    }
  } catch (err) {}
}
/**
 * @description 获取新闻数据
 */
async function getTodayNews() {
  // 随机
  const randNum = ~~(Math.random() * API_CONFIG.todayNews.length);
  try {
    // 获取重要新闻
    const res = await fetch(API_CONFIG.todayNews[randNum], {
      method: 'GET',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {}
}
/**
 * @description 获取视频数据
 */
async function getTodayVideos() {
  // 随机
  const randNum = ~~(Math.random() * API_CONFIG.todayVideos.length);
  try {
    // 获取重要新闻
    const res = await fetch(API_CONFIG.todayVideos[randNum], {
      method: 'GET',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {}
}
/**
 * @description 专项练习数据
 */
async function getExamPaper(pageNo: number) {
  // 链接
  const url = `${API_CONFIG.paperList}?pageSize=50&pageNo=${pageNo}`;
  try {
    // 获取专项练习
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      const paperJson = decodeURIComponent(
        escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/')))
      );
      // JSON格式化
      const paper = JSON.parse(paperJson);
      return paper;
    }
  } catch (err) {
    return [];
  }
  return [];
}
/**
 * @description 每周答题数据
 */
async function getExamWeekly(pageNo: number) {
  // 链接
  const url = `${API_CONFIG.weeklyList}?pageSize=50&pageNo=${pageNo}`;
  try {
    // 获取每周答题
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    // 请求成功
    if (res.ok) {
      const data = await res.json();
      const paperJson = decodeURIComponent(
        escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/')))
      );
      // JSON格式化
      const paper = JSON.parse(paperJson);
      return paper;
    }
  } catch (err) {
    return [];
  }
  return [];
}
/**
 * @description 获取答案
 */
async function getAnswer(question: string) {
  console.log('正在获取网络答案...');
  // 数据
  const data = {
    question,
  };
  try {
    // 请求
    const res = await fetch(API_CONFIG.answerSearch, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // 请求成功
    if (res.ok) {
      const data: {
        errno: number;
        data: { answers: string[] };
      } = await res.json();
      // 状态
      const { errno } = data;
      if (errno !== -1) {
        // 答案
        const { answers } = data.data;
        console.log('answers', answers);
        return answers;
      }
    }
  } catch (error) {}
  console.log('获取网络答案失败!');
  return [];
}
/**
 * @description 保存答案
 */
async function saveAnswer(key, value) {
  // 内容
  const content = JSON.stringify([{ title: key, content: value }]);
  // 数据
  const data = {
    txt_name: key,
    txt_content: content,
    password: '',
    v_id: '',
  };
  // 请求体
  const body = Object.keys(data)
    .map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    })
    .join('&');
  // 请求
  const res = await fetch(API_CONFIG.answerSave, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });
  // 请求成功
  if (res.ok) {
    try {
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }
  return null;
}
/* API请求函数结束 */

/* 变量 */
/**
 * @description 任务进度
 */
const tasks: {
  dayMaxScore: number;
  currentScore: number;
  status: boolean;
  need: number;
}[] = [];
/**
 * @description 获取 URL
 */
const { href } = window.location;
/**
 * @description 设置
 */
let settings = [
  true,
  true,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
];
/**
 * @description 已经开始
 */
let started = false;
/**
 * @description 是否暂停答题
 */
let pause = false;
/**
 * @description 初始化登录状态
 */
let login = !!getCookie('token');
/**
 * @description 新闻
 */
let news: { url: string }[] = [];
/**
 * @description 视频
 */
let videos: { url: string }[] = [];
/**
 * @description 登录定时器
 */
let loginTimer: any;
/**
 * @description frame 关闭
 */
let closed = true;
/**
 * @description frame 隐藏
 */
let hidden = true;
/**
 * @description id
 */
let id: string;

/**
 * @description load
 */
window.addEventListener('load', () => {
  console.log('正在加载脚本...');
  // 主页
  if (URL_CONFIG.home.test(href)) {
    console.log('进入主页面!');
    let ready = setInterval(() => {
      if ($$('.text-wrap')[0]) {
        window.addEventListener('beforeunload', () => {
          // 全局暂停
          if (GM_getValue('pauseStudy') !== false) {
            GM_setValue('pauseStudy', false);
          }
        });
        // 停止定时器
        clearInterval(ready);
        // 设置字体
        initFontSize();
        // 初始化设置
        initSetting();
        // 渲染菜单
        renderMenu();
        // 渲染窗口
        renderFrame();
        // 渲染提示
        renderTip();
      }
    }, 800);
  } else if (
    typeof GM_getValue('readingUrl') === 'string' &&
    href === GM_getValue('readingUrl')
  ) {
    // 初始化设置
    initSetting();
    console.log('初始化设置!');
    console.log(settings);
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 渲染提示
    renderTip();
    reading(0);
  } else if (
    typeof GM_getValue('watchingUrl') === 'string' &&
    href === GM_getValue('watchingUrl')
  ) {
    // 初始化设置
    initSetting();
    console.log('初始化设置!');
    console.log(settings);
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    // 渲染提示
    renderTip();
    let randNum = 0;
    const checkVideoPlayingInterval = setInterval(() => {
      let temp = getVideoTag();
      if (temp.video) {
        if (!temp.video.muted) {
          temp.video.muted = true;
        }
        if (temp.video.paused) {
          console.log('正在尝试播放视频...');
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
          console.log('视频成功播放!');
          clearInterval(checkVideoPlayingInterval);
          reading(1);
        }
      } else {
        console.log('等待加载...');
      }
    }, 800);
  } else if (
    href.includes(URL_CONFIG.examPaper) ||
    href.includes(URL_CONFIG.examPractice) ||
    href.includes(URL_CONFIG.examWeekly)
  ) {
    // 初始化设置
    initSetting();
    console.log('初始化设置!');
    console.log(settings);
    // 设置字体
    initFontSize();
    // 初始化 id
    initFrameID();
    console.log('进入答题页面!');
    // 渲染提示
    renderTip();
    // 答题页面
    const ready = setInterval(() => {
      if ($$('.title')[0]) {
        clearInterval(ready); // 停止定时器
        // 创建“手动答题”按钮
        createManualButton();
        // 开始答题
        doingExam();
      }
    }, 500);
  } else {
    console.log('此页面不支持加载学习脚本!');
  }
});

/**
 * @description 获取video标签
 */
function getVideoTag() {
  let iframe = $$<HTMLIFrameElement>('iframe')[0];
  let video: HTMLVideoElement | undefined;
  let pauseButton: HTMLButtonElement | undefined;
  const u = navigator.userAgent;
  if (u.indexOf('Mac') > -1) {
    // Mac
    if (iframe && iframe.innerHTML) {
      // 如果有iframe, 说明外面的video标签是假的
      video = iframe.contentWindow?.document.getElementsByTagName('video')[0];
      pauseButton = <HTMLButtonElement>(
        iframe.contentWindow?.document.getElementsByClassName(
          'prism-play-btn'
        )[0]
      );
    } else {
      // 否则这个video标签是真的
      video = $$<HTMLVideoElement>('video')[0];
      pauseButton = $$<HTMLButtonElement>('.prism-play-btn')[0];
    }
    return {
      video: video,
      pauseButton: pauseButton,
    };
  } else {
    if (iframe) {
      // 如果有iframe, 说明外面的video标签是假的
      video = <HTMLVideoElement>(
        iframe.contentWindow?.document.getElementsByTagName('video')[0]
      );
      pauseButton = <HTMLButtonElement>(
        iframe.contentWindow?.document.getElementsByClassName(
          'prism-play-btn'
        )[0]
      );
    } else {
      // 否则这个video标签是真的
      video = $$<HTMLVideoElement>('video')[0];
      pauseButton = $$<HTMLButtonElement>('.prism-play-btn')[0];
    }
    return {
      video: video,
      pauseButton: pauseButton,
    };
  }
}

/**
 * @description 读新闻或者看视频
 */
/**
 * @description type:0为新闻,1为视频
 */
async function reading(type: number) {
  // 看文章或者视频
  let time = 1;
  if (type === 0) {
    // 80-100秒后关闭页面, 看文章
    time = ~~(Math.random() * 20 + 80) + 1;
  }
  if (type === 1) {
    // 100-150秒后关闭页面, 看视频
    time = ~~(Math.random() * 50 + 100) + 1;
  }
  // 第一次滚动时间
  let firstTime = time - 2;
  // 第二次滚动时间
  let secendTime = 12;
  // 创建提示
  const tip = createTip(
    '距离关闭页面还剩',
    time,
    async (time) => {
      // 暂停锁
      await pauseStudyLock();
      if (time === firstTime) {
        // 模拟滚动
        const scroll = new Event('scroll', {
          bubbles: true,
        });
        document.dispatchEvent(scroll);
      }
      if (time === secendTime) {
        // 模拟滚动
        const scroll = new Event('scroll', {
          bubbles: true,
        });
        document.dispatchEvent(scroll);
      }
    },
    !settings[5]
  );
  // 倒计时结束
  await tip.waitCountDown();
  // 清空链接
  if (type === 0) {
    GM_setValue('readingUrl', null);
  } else {
    GM_setValue('watchingUrl', null);
  }
  // 关闭窗口
  closeWin(settings[7], id);
}
/**
 * @description 创建学习提示
 */
function createTip(
  text: string,
  delay: number = 2,
  callback?: (current: number, operate: object) => any,
  show: boolean = true
) {
  const tipWrap = $$('.egg_tip_wrap')[0];
  // 提前去除
  const studyTip = $$<HTMLElement & { destroy: () => void }>('#studyTip')[0];
  if (studyTip) {
    studyTip.destroy();
  }
  // 提示
  const tipInfo: HTMLElement = createElementNode('div', undefined, {
    id: 'studyTip',
    class: 'egg_tip',
  });
  // 倒计时
  const countdown = createElementNode(
    'span',
    {
      innerText: `${delay}s`,
    },
    {
      class: 'egg_countdown',
    }
  );
  // 文本
  const span = createElementNode(
    'span',
    {
      innerText: text,
    },
    {
      class: 'egg_text',
    }
  );
  // 销毁
  let destroyed = false;
  // 倒计时结束
  let done = false;
  // 倒计时
  const countDown = async () => {
    countdown.innerText = `${delay}s`;
    // 回调
    if (callback) {
      await callback(delay, operate);
    }
    // 倒计时结束
    if (!delay) {
      done = true;
      // 隐藏
      operate.hide();
      return;
    }
    delay--;
    setTimeout(countDown, 1000);
  };
  // 操作
  const operate = {
    async destroy() {
      if (!destroyed) {
        // 隐藏
        operate.hide();
        destroyed = true;
        setTimeout(() => {
          tipInfo.remove();
        }, 300);
      }
    },
    hide() {
      if (!destroyed) {
        tipInfo.classList.remove('active');
      }
    },
    show() {
      if (!destroyed) {
        setTimeout(() => {
          tipInfo.classList.add('active');
        }, 300);
      }
    },
    setText(text: string) {
      span.innerText = text;
    },
    waitCountDown() {
      return new Promise((resolve) => {
        // 计时器
        const timer = setInterval(() => {
          // 结束
          if (done) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      });
    },
  };
  Object.assign(tipInfo, operate);
  tipInfo.append(span, countdown);
  // 插入节点
  tipWrap.append(tipInfo);
  // 显示
  show && operate.show();
  // 倒计时
  countDown();
  return operate;
}
/**
 * @description 获取新闻列表
 */
function getNews() {
  return new Promise(async (resolve) => {
    // 需要学习的新闻数量
    const need = tasks[0].need < maxNewsNum ? tasks[0].need : maxNewsNum;
    console.log(`还需要看 ${need} 个新闻`);
    // 获取重要新闻
    const data = await getTodayNews();
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
    const need = tasks[1].need < maxVideoNum ? tasks[1].need : maxVideoNum;
    console.log(`还需要看 ${need} 个视频`);
    // 获取重要视频
    const data = await getTodayVideos();
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
  await getNews();
  for (const i in news) {
    // 暂停
    await pauseStudyLock();
    console.log(`正在看第${Number(i) + 1}个新闻...`);
    // 链接
    const { url } = news[i];
    // 链接
    GM_setValue('readingUrl', url);
    // 等待任务窗口
    await waitTaskWin(url);
    // 等待一段时间
    await waitingTime(1500);
    // 刷新菜单数据
    await refreshMenu();
    // 任务完成跳出循环
    if (settings[0] && tasks[0].status) {
      break;
    }
  }
  // 任务完成状况
  if (settings[0] && !tasks[0].status) {
    console.log('任务未完成, 继续看新闻!');
    await readNews();
  }
}
/**
 * @description 看学习视频
 */
async function watchVideo() {
  // 获取视频
  await getVideos();
  // 观看视频
  for (const i in videos) {
    // 暂停
    await pauseStudyLock();
    console.log(`正在观看第${Number(i) + 1}个视频...`);
    // 链接
    const { url } = videos[i];
    // 链接
    GM_setValue('watchingUrl', url);
    // 等待任务窗口
    await waitTaskWin(url);
    // 等待窗口关闭
    // 等待一段时间
    await waitingTime(1500);
    // 刷新菜单数据pauseStudyLock
    await refreshMenu();
    // 任务完成跳出循环
    if (settings[1] && tasks[1].status) {
      break;
    }
  }
  // 任务完成状况
  if (settings[1] && !tasks[1].status) {
    console.log('任务未完成, 继续看视频!');
    await watchVideo();
  }
}

/**
 * @description 做每日答题
 */
async function doExamPractice() {
  // 暂停
  await pauseStudyLock();
  console.log('正在完成每日答题...');
  // 链接
  const url = URL_CONFIG.examPractice;
  // 等待任务窗口
  await waitTaskWin(url);
  // 等待一段时间
  await waitingTime(1500);
  // 刷新菜单数据
  await refreshMenu();
  // 任务完成状况
  if (settings[2] && !tasks[2].status) {
    console.log('任务未完成, 继续完成每日答题!');
    await doExamPractice();
  }
}
/**
 * @description 做每周答题
 */
async function doExamWeekly() {
  // id
  const examWeeklyId = await findExamWeekly();
  if (examWeeklyId) {
    // 暂停
    await pauseStudyLock();
    console.log('正在做每周答题...');
    // 链接
    const url = `${URL_CONFIG.examWeekly}?id=${examWeeklyId}`;
    // 等待任务窗口
    await waitTaskWin(url);
    // 等待一段时间
    await waitingTime(1500);
    // 刷新菜单数据
    await refreshMenu();
    // 任务完成状况
    if (settings[3] && !tasks[3].status) {
      console.log('任务未完成, 继续完成每周答题!');
      return await doExamWeekly();
    }
    return true;
  }
  return false;
}

/**
 * @description 做专项练习
 */
async function doExamPaper() {
  // id
  const examPaperId = await findExamPaper();
  if (examPaperId) {
    // 暂停
    await pauseStudyLock();
    console.log('正在做专项练习...');
    // 链接
    const url = `${URL_CONFIG.examPaper}?id=${examPaperId}`;
    // 等待窗口任务
    await waitTaskWin(url);
    // 等待一段时间
    await waitingTime(1500);
    // 刷新菜单数据
    await refreshMenu();
    // 任务完成状况
    if (settings[4] && !tasks[4].status) {
      console.log('任务未完成, 继续专项练习!');
      return await doExamPaper();
    }
    return true;
  }
  return false;
}
/**
 * @description 初始化每周答题总页数属性
 */
async function initExam(type: number) {
  if (type === 0) {
    // 默认从第一页获取全部页属性
    const data = await getExamWeekly(1);
    if (data) {
      // 等待
      await waitingTime(ratelimitms);
      return data.totalPageCount;
    }
  }
  if (type === 1) {
    // 默认从第一页获取全部页属性
    const data = await getExamPaper(1);
    if (data) {
      // 等待
      await waitingTime(ratelimitms);
      return data.totalPageCount;
    }
  }
}

/**
 * @description 查询每周答题列表看看还有没有没做过的, 有则返回id
 */
async function findExamWeekly() {
  console.log('初始化每周答题!');
  // 获取总页数
  const total = await initExam(0);
  // 当前页数
  let current = examPaperReverse ? total : 1;
  examPaperReverse &&
    console.log('每周答题, 开启逆序模式, 从最早的题目开始答题');
  console.log('正在寻找未完成的每周答题...');
  while (current <= total && current) {
    // 请求数据
    const data = await getExamWeekly(current);
    if (data) {
      const examWeeks = data.list;
      // 逆序每周列表
      if (examWeeklyReverse) {
        examWeeks.reverse();
      }
      for (const i in data.list) {
        // 获取每周列表
        const examWeek = data.list[i].practices;
        // 若开启逆序, 则反转每周的测试列表
        if (examWeeklyReverse) {
          examWeek.reverse();
        }
        for (const j in examWeek) {
          // 遍历查询有没有没做过的
          if (examWeek[j].status === 1) {
            // status： 1为"开始答题" , 2为"重新答题"
            return examWeek[j].id;
          }
        }
      }
      // 增加页码
      current += examWeeklyReverse ? -1 : 1;
      // 等待
      await waitingTime(ratelimitms);
    } else {
      break;
    }
  }
}
/**
 * @description 查询专项练习列表看看还有没有没做过的, 有则返回id
 */
async function findExamPaper() {
  console.log('初始化专项练习');
  // 获取总页数
  const total = await initExam(1);
  // 当前页数
  let current = examPaperReverse ? total : 1;
  examPaperReverse &&
    console.log('专项练习, 开启逆序模式, 从最早的题目开始答题');
  console.log('正在寻找未完成的专项练习...');
  while (current <= total && current) {
    // 请求数据
    const data = await getExamPaper(current);
    if (data) {
      // 获取专项练习的列表
      const examPapers = data.list;
      if (examPaperReverse) {
        // 若开启逆序答题, 则反转专项练习列表
        examPapers.reverse();
      }
      for (const i in examPapers) {
        // 遍历查询有没有没做过的
        if (examPapers[i].status === 1) {
          // status： 1为"开始答题" , 2为"重新答题"
          return examPapers[i].id;
        }
      }
      // 增加页码 (若开启逆序翻页, 则减少页码)
      current += examPaperReverse ? -1 : 1;
      // 等待
      await waitingTime(ratelimitms);
    } else {
      break;
    }
  }
}

/**
 * @description 获取答题按钮
 */
function getNextButton() {
  return new Promise<HTMLButtonElement>((resolve) => {
    const timer = setInterval(() => {
      // 答题按钮
      const nextAll = $$<HTMLButtonElement>('.ant-btn').filter(
        (next) => next.innerText
      );
      if (nextAll.length) {
        // 停止定时器
        clearInterval(timer);
        if (nextAll.length === 2) {
          resolve(nextAll[1]);
          return;
        }
        resolve(nextAll[0]);
      }
    }, 500);
  });
}
/**
 * @description 暂停答题
 */
function pauseExam(flag: boolean) {
  // 按钮
  const manualButton = $$<HTMLButtonElement>('#manualButton')[0];
  if (manualButton) {
    if (flag) {
      // 创建提示
      createTip('已暂停, 手动开启自动答题! ', 10);
    } else {
      // 创建提示
      createTip('已开启, 自动答题! ', 2);
    }
    pause = flag;
    manualButton.innerText = '开启自动答题';
    manualButton.classList.add('manual');
  }
}
/**
 * @description 处理滑动验证
 */
function handleSlideVerify() {
  return new Promise(async (resolve) => {
    // 滑动验证
    const mask = $$<HTMLElement>('#nc_mask')[0];
    if (mask && getComputedStyle(mask).display !== 'none') {
      // 创建提示
      createTip('等待处理滑动验证 ', 2);
      // 提高层级
      mask.style.zIndex = '999';
      // 轨道
      const track = $$<HTMLElement>('.nc_scale')[0];
      // 滑块
      const slide = $$<HTMLElement>('.btn_slide')[0];
      const rectTrack = track.getBoundingClientRect();
      const rectSlide = slide.getBoundingClientRect();
      // 窗口
      const window = unsafeWindow;
      // 范围内随机起点
      const start = createRandomPoint(rectSlide);
      // 终点
      const end = {
        x: rectTrack.x + rectTrack.width,
        y: rectTrack.y + rectTrack.height / 2,
      };
      // 路径
      const path = createRandomPath(start, end, 10);
      // 移动端
      const mobile = hasMobile();
      if (mobile) {
        slide.style.touchAction = 'none';
        const touchstartTouch = new Touch({
          identifier: 0,
          target: slide,
          clientX: path[0].x,
          clientY: path[0].y,
        });
        const touchstartList = [touchstartTouch];
        // 开始触摸
        const touchstart = new TouchEvent('touchstart', {
          targetTouches: touchstartList,
          touches: touchstartList,
          changedTouches: touchstartList,
          view: window,
          bubbles: true,
        });
        slide.dispatchEvent(touchstart);
        // 触摸滑动
        for (const i in path) {
          const touchmoveTouch = new Touch({
            identifier: 0,
            target: slide,
            clientX: path[i].x,
            clientY: path[i].y,
          });
          const touchmoveList = [touchmoveTouch];
          const touchmove = new TouchEvent('touchmove', {
            targetTouches: touchmoveList,
            touches: touchmoveList,
            changedTouches: touchmoveList,
            view: window,
            bubbles: true,
          });
          slide.dispatchEvent(touchmove);
          await waitingTime(10);
        }
        const touchendTouch = new Touch({
          identifier: 0,
          target: slide,
          clientX: path[path.length - 1].x,
          clientY: path[path.length - 1].y,
        });
        // 触摸结束
        const touchendList = [touchendTouch];
        // 开始触摸
        const touchend = new TouchEvent('touchend', {
          targetTouches: [],
          touches: [],
          changedTouches: touchendList,
          view: window,
          bubbles: true,
        });
        slide.dispatchEvent(touchend);
      } else {
        // 鼠标按下
        const mousedown = new MouseEvent('mousedown', {
          clientX: path[0].x,
          clientY: path[0].y,
          bubbles: true,
          view: window,
        });
        slide.dispatchEvent(mousedown);
        // 鼠标滑动
        for (const i in path) {
          const mousemove = new MouseEvent('mousemove', {
            clientX: path[i].x,
            clientY: path[i].y,
            bubbles: true,
            view: window,
          });
          slide.dispatchEvent(mousemove);
          await waitingTime(10);
        }
        // 鼠标抬起
        const mouseup = new MouseEvent('mouseup', {
          clientX: path[path.length - 1].x,
          clientY: path[path.length - 1].y,
          bubbles: true,
          view: window,
        });
        slide.dispatchEvent(mouseup);
      }
      // 创建提示
      createTip('滑动验证成功! ', 2);
      // 定时器
      const timer = setInterval(() => {
        // 滑动验证
        const mask = $$('#nc_mask')[0];
        if (!mask || getComputedStyle(mask).display === 'none') {
          console.log('滑动验证完成!');
          // 创建提示
          createTip('滑动验证完成! ', 2);
          clearInterval(timer);
          resolve(true);
        }
        console.log('正在滑动验证...');
      }, 100);
      return;
    }
    resolve(true);
  });
}
/**
 * @description 处理选项
 */
function handleChoiceBtn(answers: string[]) {
  // 选项按钮
  const allBtns = $$<HTMLButtonElement>('.q-answer');
  // 答案存在
  if (answers.length && allBtns.length) {
    // 作答
    return answers.every((answer) => {
      // 答案存在
      if (answer && answer.length) {
        // 包含答案最短长度选项
        let minLengthChoice: HTMLButtonElement | undefined;
        // 遍历
        allBtns.forEach((choice) => {
          // 选项文本
          const choiceText = choice.innerText.trim();
          // 无符号选项文本
          const unsignedChoiceText = choiceText.replaceAll(/[、，,。 ]/g, '');
          // 无符号答案
          const unsignedAnswer = answer.replaceAll(/[、，,。 ]/g, '');
          // 包含答案
          if (
            choiceText === answer ||
            choiceText.includes(answer) ||
            answer.includes(choiceText) ||
            unsignedChoiceText.includes(unsignedAnswer)
          ) {
            // 最小长度选项有值
            if (minLengthChoice) {
              // 最短长度选项与当前选项比较长度
              if (minLengthChoice.innerText.length > choiceText.length) {
                minLengthChoice = choice;
              }
            } else {
              // 最小长度选项赋值
              minLengthChoice = choice;
            }
          }
        });
        // 存在选项
        if (minLengthChoice) {
          // 选择
          if (!minLengthChoice.classList.contains('chosen')) {
            minLengthChoice.click();
          }
          return true;
        }
      }
      return false;
    });
  }
  return false;
}
/**
 * @description 随机处理单选
 */
function handleSingleChoiceRand() {
  // 选项按钮
  const allBtns = $$<HTMLButtonElement>('.q-answer');
  // 按钮存在
  if (allBtns.length) {
    const index = ~~(Math.random() * allBtns.length);
    const randBtn = allBtns[index];
    // 选择
    if (!randBtn.classList.contains('chosen')) {
      randBtn.click();
    }
  }
}
/**
 * @description 随机处理多选
 */
function handleMutiplyChoiceRand() {
  // 选项按钮
  const allBtns = $$<HTMLButtonElement>('.q-answer');
  // 按钮存在
  if (allBtns.length) {
    allBtns.forEach((allBtn) => {
      // 选择
      if (!allBtn.classList.contains('chosen')) {
        allBtn.click();
      }
    });
  }
}
/**
 * @description 处理填空
 */
const handleBlankInput = (answers: string[]) => {
  // 所有填空
  const blanks = $$<HTMLInputElement>('.blank');
  // 答案存在
  if (blanks.length && answers.length) {
    // 填空数量和答案数量一致
    if (answers.length === blanks.length) {
      return answers.every((answer, i) => {
        // 答案存在
        if (answer && answer.length) {
          // 输入事件
          const inputEvent = new Event('input', {
            bubbles: true,
          });
          // 设置答案
          blanks[i].setAttribute('value', answer);
          // 触发输入input
          blanks[i].dispatchEvent(inputEvent);
          return true;
        }
        return false;
      });
    }
    // 填空数量为1和提示数量大于1
    if (blanks.length === 1 && answers.length > 1) {
      // 直接将所有答案整合填进去
      const answer = answers.join('');
      // 答案存在
      if (answer && answer.length) {
        // 输入事件
        const inputEvent = new Event('input', {
          bubbles: true,
        });
        // 设置答案
        blanks[0].setAttribute('value', answer);
        // 触发输入input
        blanks[0].dispatchEvent(inputEvent);
        return true;
      }
    }
  }
  return false;
};
/**
 * @description 处理填空随机
 */
async function handleBlankInputRand() {
  // 所有填空
  const blanks = $$<HTMLInputElement>('.blank');
  if (blanks.length) {
    // 输入事件
    const inputEvent = new Event('input', {
      bubbles: true,
    });
    blanks.forEach((blank) => {
      // 设置答案
      blank.setAttribute('value', '答案');
      // 触发输入input
      blank.dispatchEvent(inputEvent);
    });
  }
}
/**
 * @description 答题过程(整合)
 */
async function doingExam() {
  // 下一个按钮
  let nextButton: HTMLButtonElement;
  // 下一个文本
  let nextText: string;
  // 保存答案
  let shouldSaveAnswer = false;
  while (true) {
    // 先等等再开始做题
    await waitingTime(2500);
    // 暂停
    await pauseLock();
    // 获取下一个按钮
    nextButton = await getNextButton();
    // 下一个文本
    nextText = nextButton.innerText.replaceAll(' ', '');
    // 结束
    const finish = ['再练一次', '再来一组', '查看解析'];
    if (finish.includes(nextButton.innerText)) {
      break;
    }
    // 点击提示
    $$('.tips')[0]?.click();
    // 所有提示
    const allTips = $$<HTMLFontElement>('.line-feed font[color]');
    // 答案
    const answers = allTips.map((tip) => tip.innerText.trim());
    // 获取题目的文本内容
    const question = $$('.q-body')[0].innerText;
    // 等待一段时间
    await waitingTime(1500);
    // 暂停
    await pauseLock();
    // 选项按钮
    const allBtns = $$<HTMLButtonElement>('.q-answer');
    // 所有填空
    const blanks = $$<HTMLInputElement>('input[type=text][class=blank]');
    // 问题类型
    const questionType = <'填空题' | '单选题' | '多选题'>(
      $$('.q-header')[0].innerText.substring(0, 3)
    );
    // 暂停
    await pauseLock();
    // 题型分类作答
    switch (questionType) {
      case '填空题': {
        // 根据提示作答
        if (answers.length) {
          const res = handleBlankInput(answers);
          // 成功
          if (res) {
            break;
          }
        }
        // 创建提示
        createTip('答案异常, 尝试网络题库获取!', 2);
        // 尝试题库获取
        const answersNetwork = await getAnswer(question);
        // 根据题库作答
        if (answersNetwork.length) {
          const res = handleBlankInput(answersNetwork);
          // 成功
          if (res) {
            break;
          }
        }
        // 随机作答
        if (settings[8]) {
          console.log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!', 2);
          await handleBlankInputRand();
        } else {
          // 暂停答题
          pauseExam(true);
          // 提交答案
          shouldSaveAnswer = true;
        }
        break;
      }
      case '多选题': {
        // 根据提示作答
        if (answers.length) {
          // 选项文本
          const choicesText = allBtns.map((btn) => btn.innerText);
          // 选项内容
          const choicesContent = choicesText
            .map((choiceText) => choiceText.split(/[A-Z]./)[1].trim())
            .join('');
          // 空格
          const blanks = question.match(/（）/g);
          // 填空数量、选项数量、答案数量相同 | 选项全文等于答案全文
          if (
            (blanks && allBtns.length === blanks.length) ||
            question === choicesContent ||
            allBtns.length === 2
          ) {
            // 全选
            allBtns.forEach((choice) => {
              if (!choice.classList.contains('chosen')) {
                choice.click();
              }
            });
            break;
          }
          // 选项数量大于等于答案
          if (allBtns.length >= answers.length) {
            const res = handleChoiceBtn(answers);
            // 成功
            if (res) {
              break;
            }
          }
        }
        // 创建提示
        createTip('答案异常, 尝试网络题库获取!', 2);
        // 尝试题库获取
        const answersNetwork = await getAnswer(question);
        // 答案存在
        if (answersNetwork.length) {
          const res = handleChoiceBtn(answersNetwork);
          // 成功
          if (res) {
            break;
          }
        }
        // 随机作答
        if (settings[8]) {
          console.log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!', 2);
          await handleMutiplyChoiceRand();
        } else {
          // 暂停答题
          pauseExam(true);
          // 提交答案
          shouldSaveAnswer = true;
        }
        break;
      }
      case '单选题': {
        // 根据提示作答
        if (answers.length) {
          // 提示为1
          if (answers.length === 1) {
            const res = handleChoiceBtn(answers);
            // 成功
            if (res) {
              break;
            }
          } else {
            // 可能的分隔符
            const seperator = [
              '',
              ' ',
              ',',
              ';',
              ',',
              '、',
              '-',
              '|',
              '+',
              '/',
            ];
            // 可能的答案
            const answersLike = seperator.map((s) => answers.join(s));
            // 答案存在
            if (answersLike.every((answer) => answer.length)) {
              // 可能答案是否正确
              const res = answersLike.some((answer) => {
                // 尝试查找点击
                return handleChoiceBtn([answer]);
              });
              if (res) {
                break;
              }
            }
          }
        }
        // 创建提示
        createTip('答案异常, 尝试网络题库获取!', 2);
        // 尝试题库获取
        const answersNetwork = await getAnswer(question);
        // 存在答案
        if (answersNetwork.length) {
          // 单答案单选项
          if (answersNetwork.length === 1) {
            // 尝试查找点击
            const res = handleChoiceBtn(answersNetwork);
            if (res) {
              break;
            }
          } else {
            // 多答案单选项 选项意外拆分
            // 可能分隔符
            const seperator = ['', ' '];
            // 可能答案
            const answersLike = seperator.map((s) => answers.join(s));
            // 答案存在
            if (answersLike.every((answer) => answer.length)) {
              // 可能答案是否正确
              const res = answersLike.some((answer) => {
                // 尝试查找点击
                return handleChoiceBtn([answer]);
              });
              if (res) {
                break;
              }
            }
          }
        }
        // 随机作答
        if (settings[8]) {
          console.log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!', 2);
          await handleSingleChoiceRand();
        } else {
          // 暂停答题
          pauseExam(true);
          // 提交答案
          shouldSaveAnswer = true;
        }
        break;
      }
    }
    // 暂停
    await pauseLock();
    // 获取下一个按钮
    nextButton = await getNextButton();
    // 下一个文本
    nextText = nextButton.innerText.replaceAll(' ', '');
    // 需要提交答案
    if (shouldSaveAnswer) {
      // 获取key
      const key = getKey(question);
      // 答案
      const answers: string[] = [];
      if (questionType === '填空题') {
        blanks.forEach((blank) => {
          answers.push(blank.value);
        });
      }
      if (questionType === '单选题' || questionType === '多选题') {
        allBtns.forEach((choice) => {
          if (choice.classList.contains('chosen')) {
            // 带字母的选项
            const answerTemp = choice.innerText;
            // 从字符串中拿出答案
            const [, answer] = answerTemp.split('. ');
            if (answer && answer.length) {
              answers.push(answer);
            }
          }
        });
      }
      // 答案
      const answer = answers.join(';');
      // 存在答案
      if (answer.length) {
        // 答案
        console.log('正在上传中...');
        console.log(`key:${key}, answers:${answer}`);
        // 保存答案
        await saveAnswer(key, answer);
        // 答案
        console.log('上传答案成功!');
      }
      // 重置
      shouldSaveAnswer = false;
    }
    // 确认
    if (nextText === '确定') {
      // 确认
      nextButton.click();
      // 等待一段时间
      await waitingTime(2000);
      // 暂停
      await pauseLock();
      // 答案解析
      const answerBox = $$('.answer')[0];
      // 答题错误
      if (answerBox) {
        // 获取key
        const key = getKey(question);
        const answerTemp = answerBox.innerText;
        // 从字符串中拿出答案
        const [, answer] = answerTemp.split('：');
        if (answer && answer.length) {
          answer.replaceAll(' ', ';');
          console.log(`上传了错题答案 key:${key} answer:${answer}!`);
          await saveAnswer(key, answer);
        }
        // 每周答题
        if (href.includes(URL_CONFIG.examWeekly) && settings[9]) {
          console.log('每周答题, 答错暂停!');
          // 暂停答题
          pauseExam(true);
          // 暂停
          await pauseLock();
        }
      }
      // 滑动验证
      await handleSlideVerify();
    }
    // 获取按钮
    nextButton = await getNextButton();
    // 下一个文本
    nextText = nextButton.innerText.replaceAll(' ', '');
    if (nextText === '下一题' || nextText === '完成' || nextText === '交卷') {
      // 等待一段时间
      await waitingTime(2500);
      // 下一题
      nextButton.click();
    }
  }
  closeWin(settings[7], id);
}
/**
 * @description 获取关键字
 */
function getKey(content: string) {
  // 外部引用md5加密
  const key = md5(content);
  console.log(`获取 key:${key}`);
  return key;
}
/**
 * @description 初始化配置
 */
function initSetting() {
  try {
    let settingTemp = JSON.parse(GM_getValue('studySetting'));
    if (settingTemp) {
      settings = settingTemp;
    } else {
      settings = [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
      ];
    }
  } catch (e) {
    // 没有则直接初始化
    settings = [
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ];
  }
}
/**
 * @description 初始化配置
 */
function initFontSize() {
  // 移动端
  const moblie = hasMobile();
  if (moblie) {
    // 缩放比例
    const scale = ~~(window.innerWidth / window.outerWidth) || 1;
    document.documentElement.style.setProperty('--scale', String(scale));
    window.addEventListener('resize', () => {
      // 缩放比例
      const scale = ~~(window.innerWidth / window.outerWidth) || 1;
      document.documentElement.style.setProperty('--scale', String(scale));
    });
  }
}
/**
 * @description 创建“手动答题”按钮
 */
function createManualButton() {
  const title = $$('.title')[0];
  // 按钮
  const manualButton = createElementNode(
    'button',
    { innerText: '关闭自动答题' },
    {
      id: 'manualButton',
      class: 'egg_btn',
      type: 'button',
      onclick: clickManualButton,
    }
  );
  // 插入节点
  title.parentNode?.insertBefore(manualButton, title.nextSibling);
}
/**
 * @description 点击手动学习按钮
 */
function clickManualButton() {
  const manualButton = $$('#manualButton')[0];
  pause = !pause;
  if (pause) {
    manualButton.innerText = '开启自动答题';
    manualButton.classList.add('manual');
  } else {
    manualButton.innerText = '关闭自动答题';
    manualButton.classList.remove('manual');
  }
}
/**
 * @description 加载用户信息
 */
async function loadUserInfo() {
  // 分数信息
  const infoItem = $$<HTMLDivElement>('.egg_info_item')[0];
  if (login) {
    // 退出按钮
    const logoutBtn = createElementNode(
      'button',
      { innerText: '退出' },
      {
        type: 'button',
        class: 'login_btn',
        onclick: debounce(() => {
          const logged = $$("a[class='logged-link']")[0];
          logged.click();
        }, 500),
      }
    );
    // 获取用户信息
    const userInfo = await getUserInfo();
    if (userInfo) {
      const { avatarMediaUrl, nick } = userInfo;
      const avatarItems: Node[] = [];
      if (avatarMediaUrl) {
        // 图片
        const img = createElementNode('img', undefined, {
          src: avatarMediaUrl,
          class: 'egg_avatar_img',
        });
        avatarItems.push(img);
      } else {
        // 文字
        const subNickName = createElementNode(
          'div',
          { innerText: nick.substring(1, 3) },
          { class: 'egg_sub_nickname' }
        );
        avatarItems.push(subNickName);
      }
      // 头像
      const avatar = createElementNode(
        'div',
        undefined,
        { class: 'egg_avatar' },
        avatarItems
      );
      // 昵称
      const nickName = createElementNode(
        'div',
        { innerText: nick },
        { class: 'egg_name' }
      );
      // 关于用户
      const user = createElementNode('div', undefined, { class: 'egg_user' }, [
        avatar,
        nickName,
      ]);
      // 用户信息
      const userInfoWrap = createElementNode(
        'div',
        undefined,
        {
          class: 'egg_userinfo',
        },
        [user, logoutBtn]
      );
      infoItem.append(userInfoWrap);
    }
  } else {
    let refreshTimer: any;
    // 登录按钮
    const loginBtn = createElementNode(
      'button',
      { innerText: '扫码登录' },
      {
        type: 'button',
        class: 'login_btn',
        onclick: debounce(async () => {
          if (refreshTimer) {
            clearInterval(refreshTimer);
          }
          loginWindowLoad();
          refreshTimer = setInterval(() => {
            loginWindowLoad();
          }, 100000);
          // 登录状态
          const res = await loginStatus();
          if (res) {
            console.log('登录成功!');
            window.location.reload();
          }
        }, 500),
      }
    );
    // 窗口
    const loginFrame = createElementNode('div', undefined, {
      class: 'egg_frame_login',
    });
    // 窗口项
    const frameWrap = createElementNode(
      'div',
      undefined,
      { class: 'egg_frame' },
      loginFrame
    );
    // 窗口项
    const loginFrameItem = createElementNode(
      'div',
      undefined,
      {
        class: 'egg_frame_item',
      },
      frameWrap
    );
    // 用户登录
    const userLogin = createElementNode(
      'div',
      undefined,
      {
        class: 'egg_user_login',
      },
      [loginBtn, loginFrameItem]
    );
    infoItem.append(userLogin);
  }
}
/**
 * @description 加载分数
 */
async function loadScoreInfo() {
  if (login) {
    // 获取总分
    const totalScore = await getTotalScore();
    // 获取当天总分
    const todayScore = await getTodayScore();
    // 分数信息
    const infoItem = $$<HTMLDivElement>('.egg_info_item')[0];
    // 总分
    const totalScoreSpan = $$<HTMLSpanElement>('.egg_totalscore span')[0];
    //  当天分数
    const todayScoreSpan = $$<HTMLSpanElement>('.egg_todayscore span')[0];
    if (infoItem) {
      // 刷新分数
      if (totalScoreSpan && todayScoreSpan) {
        totalScoreSpan.innerText = totalScore;
        todayScoreSpan.innerText = todayScore;
      } else {
        // 总分
        const totalScoreSpan = createElementNode('span', {
          innerText: totalScore,
        });
        const totalScoreDiv = createElementNode(
          'div',
          { innerText: '总积分' },
          { class: 'egg_totalscore' },
          totalScoreSpan
        );
        // 当天总分
        const todayScoreSpan = createElementNode('span', {
          innerText: todayScore,
        });
        const todayScoreDiv = createElementNode(
          'div',
          { innerText: '当天积分' },
          { class: 'egg_todayscore' },
          todayScoreSpan
        );
        // 分数信息
        const scoreInfo = createElementNode(
          'div',
          undefined,
          {
            class: 'egg_scoreinfo',
          },

          [totalScoreDiv, todayScoreDiv]
        );
        infoItem.append(scoreInfo);
      }
    }
  }
}
/**
 * @description 加载任务列表
 */
async function loadTaskList() {
  // 原始任务进度
  const taskProgress = await getTaskList();
  if (taskProgress) {
    // 文章
    const { currentScore: artCur, dayMaxScore: artMax } = taskProgress[0];
    tasks[0] = {
      currentScore: artCur,
      dayMaxScore: artMax,
      status: false,
      need: artMax - artCur,
    };
    // 视频
    const { currentScore: videoCur1, dayMaxScore: videoMax1 } = taskProgress[1];
    const { currentScore: videoCur2, dayMaxScore: videoMax2 } = taskProgress[3];

    tasks[1] = {
      currentScore: videoCur1 + videoCur2,
      dayMaxScore: videoMax1 + videoMax2,
      status: false,
      need: videoMax1 + videoMax2 - (videoCur1 + videoCur2),
    };
    // 每日答题
    const { currentScore: dayCur, dayMaxScore: dayMax } = taskProgress[6];
    tasks[2] = {
      currentScore: dayCur,
      dayMaxScore: dayMax,
      status: false,
      need: dayMax - dayCur,
    };
    // 每周答题
    const { currentScore: weekCur, dayMaxScore: weekMax } = taskProgress[2];
    tasks[3] = {
      currentScore: weekCur,
      dayMaxScore: weekMax,
      status: false,
      need: weekMax - weekCur,
    };
    // 专项练习
    const { currentScore: exerCur, dayMaxScore: exerMax } = taskProgress[5];
    tasks[4] = {
      currentScore: exerCur,
      dayMaxScore: exerMax,
      status: false,
      need: exerMax - exerCur,
    };
    // 更新数据
    for (const i in tasks) {
      const { currentScore, dayMaxScore } = tasks[i];
      // 进度
      let rate = (100 * currentScore) / dayMaxScore;
      // 修复专项练习成组做完, 进度条显示异常
      if (dayMaxScore <= currentScore) {
        rate = 100;
      }
      if (rate === 100) {
        tasks[i].status = true;
      }
      if (rate > 0) {
        // 设置进度条
        setProgress(Number(i), Number(rate.toFixed(1)));
      }
    }
  }
}
/**
 * @description 刷新菜单数据
 */
async function refreshMenu() {
  // 加载分数信息
  await loadScoreInfo();
  // 加载任务列表
  await loadTaskList();
}
/**
 * @description 渲染菜单
 * @returns
 */
async function renderMenu() {
  // 设置项
  const settingItems: Node[] = [];
  // 信息
  const infoItem = createElementNode('div', undefined, {
    class: 'egg_info_item',
  });
  settingItems.push(infoItem);
  // 任务标签
  const settingTaskLabels = [
    '文章选读',
    '视听学习',
    '每日答题',
    '每周答题',
    '专项练习',
  ];
  // 分割线
  settingItems.push(
    createElementNode('hr', undefined, { 'data-category': '任务' })
  );
  for (const i in settingTaskLabels) {
    // 进度条
    const bar = createElementNode('div', undefined, { class: 'egg_bar' });
    // 轨道
    const track = createElementNode(
      'div',
      undefined,
      { class: 'egg_track' },
      bar
    );
    // 百分比符号
    const percentSymbol = createElementNode(
      'span',
      { innerText: '%' },
      { class: 'egg_percentsymbol' }
    );
    // 数值
    const percent = createElementNode(
      'div',
      { innerText: '0' },
      { class: 'egg_percent' },
      percentSymbol
    );
    // 进度
    const progress = createElementNode(
      'div',
      undefined,
      { class: 'egg_progress' },
      [track, percent]
    );
    // 标签
    const label = createElementNode(
      'label',
      {
        innerText: settingTaskLabels[i],
      },
      undefined,
      progress
    );
    // 处理设置选项变化
    const handleCheckChange = debounce(async (checked) => {
      if (settings[i] !== checked) {
        settings[i] = checked;
        // 设置
        GM_setValue('studySetting', JSON.stringify(settings));
        // 创建提示
        createTip(`${settingTaskLabels[i]} ${checked ? '打开' : '关闭'}!`, 2);
      }
    }, 500);
    // 选项
    const input = createElementNode('input', undefined, {
      title: settingTaskLabels[i],
      class: 'egg_setting_switch',
      type: 'checkbox',
      checked: settings[i] ? 'checked' : '',
      onchange(e) {
        const { checked } = e.target;
        handleCheckChange(checked);
      },
    });
    // 设置项
    const item = createElementNode(
      'div',
      undefined,
      { class: 'egg_setting_item' },
      [label, input]
    );
    settingItems.push(item);
  }
  // 分割线
  settingItems.push(
    createElementNode('hr', undefined, { 'data-category': '运行' })
  );
  // 运行设置标签
  const settingRunLabel = [
    {
      title: '运行隐藏',
      tip: '运行时, 隐藏任务面板以及弹窗提示',
    },
    {
      title: '自动开始',
      tip: '启动时, 自动开始任务, 在倒计时结束前自动开始可随时取消; 如果在自动开始前手动开始任务, 此次自动开始将取消',
    },
    {
      title: '同屏任务',
      tip: '所有任务不在打开的新页面进行, 而在当前页面运行',
    },
  ];
  for (const i in settingRunLabel) {
    // 标签
    const label = createElementNode('label', {
      innerText: settingRunLabel[i].title,
    });
    if (settingRunLabel[i].tip.length) {
      const tip = createElementNode(
        'span',
        { innerText: 'i' },
        { class: 'tip', title: settingRunLabel[i].tip }
      );
      label.appendChild(tip);
    }
    // 当前序号
    const currentIndex = Number(i) + settingTaskLabels.length;
    // 处理设置选项变化
    const handleCheckChange = debounce(async (checked) => {
      if (settings[currentIndex] !== checked) {
        settings[currentIndex] = checked;
        // 设置
        GM_setValue('studySetting', JSON.stringify(settings));
        // 创建提示
        createTip(
          `${settingRunLabel[i].title} ${checked ? '打开' : '关闭'}!`,
          2
        );
      }
    }, 300);
    // 选项
    const input = createElementNode('input', undefined, {
      title: settingRunLabel[i].tip,
      class: 'egg_setting_switch',
      type: 'checkbox',
      checked: settings[currentIndex] ? 'checked' : '',
      onchange: (e) => {
        const { checked } = e.target;
        handleCheckChange(checked);
      },
    });
    // 设置项
    const item = createElementNode(
      'div',
      undefined,
      { class: 'egg_setting_item' },
      [label, input]
    );
    settingItems.push(item);
  }
  // 分割线
  settingItems.push(
    createElementNode('hr', undefined, { 'data-category': '答题' })
  );
  // 运行设置标签
  const settingExamLabel = [
    {
      title: '随机作答',
      tip: '无答案时, 随机选择或者填入答案, 不保证正确!',
    },
    { title: '答错暂停', tip: '每周答题时, 答错暂停答题!' },
  ];
  for (const i in settingExamLabel) {
    // 标签
    const label = createElementNode('label', {
      innerText: settingExamLabel[i].title,
    });
    if (settingExamLabel[i].tip.length) {
      const tip = createElementNode(
        'span',
        { innerText: 'i' },
        { class: 'tip', title: settingExamLabel[i].tip }
      );
      label.appendChild(tip);
    }
    // 当前序号
    const currentIndex =
      Number(i) + settingTaskLabels.length + settingRunLabel.length;
    // 处理设置选项变化
    const handleCheckChange = debounce(async (checked) => {
      if (settings[currentIndex] !== checked) {
        settings[currentIndex] = checked;
        // 设置
        GM_setValue('studySetting', JSON.stringify(settings));
        // 创建提示
        createTip(
          `${settingExamLabel[i].title} ${checked ? '打开' : '关闭'}!`,
          2
        );
      }
    }, 300);
    // 选项
    const input = createElementNode('input', undefined, {
      title: settingExamLabel[i].tip,
      class: 'egg_setting_switch',
      type: 'checkbox',
      checked: settings[currentIndex] ? 'checked' : '',
      onchange: (e) => {
        const { checked } = e.target;
        handleCheckChange(checked);
      },
    });
    // 设置项
    const item = createElementNode(
      'div',
      undefined,
      { class: 'egg_setting_item' },
      [label, input]
    );
    settingItems.push(item);
  }
  const frameShowPath = createElementNode('path', undefined, {
    d: 'M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z',
  });
  const frameShowIcon = createElementNode(
    'svg',
    undefined,
    {
      viewBox: '0 0 1024 1024',
      class: 'egg_icon',
    },
    frameShowPath
  );
  // 隐藏
  const frameShowBtn = createElementNode(
    'button',
    undefined,
    {
      class: `frame_show_btn hide`,
      type: 'button',
      onclick: () => {
        // 显示窗口
        setFrameVisible(true);
      },
    },
    frameShowIcon
  );
  // 显示状况
  let hidden = false;
  const showPath = createElementNode('path', undefined, {
    d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
  });
  const showIcon = createElementNode(
    'svg',
    undefined,
    {
      viewBox: '0 0 1024 1024',
      class: 'egg_icon',
    },
    showPath
  );
  // 隐藏
  const showBtn = createElementNode(
    'button',
    undefined,
    {
      class: `egg_setting_show_btn`,
      type: 'button',
      onclick: () => {
        hidden = !hidden;
        settingBox.classList.toggle('hide', hidden);
      },
    },
    showIcon
  );
  // 按钮集合
  const btnsWrap = createElementNode(
    'div',
    undefined,
    {
      class: 'egg_btns_wrap',
    },
    [frameShowBtn, showBtn]
  );
  settingItems.push(btnsWrap);
  // 设置
  const settingBox = createElementNode(
    'div',
    undefined,
    { class: 'egg_setting_box' },
    settingItems
  );
  // 菜单
  const menu = createElementNode(
    'div',
    undefined,
    {
      id: 'settingData',
      class: `egg_menu${hasMobile() ? ' mobile' : ''}`,
    },
    settingBox
  );
  // 根容器
  const base = createElementNode('div', undefined, undefined, menu);
  // 已经登录
  if (login) {
    // 开始学习按钮
    const startButton = createElementNode(
      'button',
      { innerText: '等待中' },
      {
        id: 'startButton',
        class: 'egg_study_btn loading',
        type: 'button',
        disabled: 'disabled',
      }
    );
    // 设置项
    const item = createElementNode(
      'div',
      undefined,
      { class: 'egg_setting_item egg_start_btn' },
      startButton
    );
    settingBox.append(item);
  }
  // 插入节点
  document.body.append(base);
  console.log('正在加载用户信息...');
  // 加载用户信息
  await loadUserInfo();
  console.log('正在加载分数信息...');
  // 加载分数信息
  await loadScoreInfo();
  console.log('正在加载任务列表...');
  // 加载任务列表
  await loadTaskList();
  // 已经登录
  if (login) {
    // 完成任务
    if (tasks.every((task, i) => !settings[i] || task.status)) {
      finishTask();
      return;
    }
    // 开始学习按钮
    const startButton = $$<HTMLButtonElement>('#startButton')[0];
    if (startButton) {
      startButton.removeAttribute('disabled');
      startButton.classList.remove('loading');
      startButton.innerText = '开始学习';
      startButton.addEventListener('click', start);
    }
  }
  // 自动答题
  if (login && settings[6]) {
    // 创建提示
    const tip = createTip('即将自动开始任务', 5);
    // 等待倒计时结束
    await tip.waitCountDown();
    // 再次查看是否开启
    if (settings[6] && !started) {
      // 创建提示
      createTip('自动开始任务', 2);
      start();
    } else {
      // 创建提示
      createTip('已取消自动开始任务!', 2);
    }
  }
}
/**
 * @description 渲染窗口
 */
function renderFrame() {
  if (settings[7]) {
    // 标题
    const title = createElementNode('div', undefined, { class: 'frame_title' });
    const hidePath = createElementNode('path', undefined, {
      d: 'M863.7 552.5H160.3c-10.6 0-19.2-8.6-19.2-19.2v-41.7c0-10.6 8.6-19.2 19.2-19.2h703.3c10.6 0 19.2 8.6 19.2 19.2v41.7c0 10.6-8.5 19.2-19.1 19.2z',
    });
    const hideIcon = createElementNode(
      'svg',
      undefined,
      {
        viewBox: '0 0 1024 1024',
        class: 'egg_icon',
      },
      hidePath
    );
    // 隐藏
    const hideBtn = createElementNode(
      'button',
      undefined,
      {
        class: 'frame_btn',
        type: 'button',
        onclick: () => {
          // 隐藏窗口
          setFrameVisible(false);
        },
      },
      hideIcon
    );
    // 最大化
    let max = false;
    const resizePath = createElementNode('path', undefined, {
      d: 'M609.52 584.92a35.309 35.309 0 0 1 24.98-10.36c9.37 0 18.36 3.73 24.98 10.36l189.29 189.22-0.07-114.3 0.57-6.35c3.25-17.98 19.7-30.5 37.9-28.85 18.2 1.65 32.12 16.92 32.09 35.2v200.23c-0.05 1.49-0.19 2.97-0.42 4.45l-0.21 1.13c-0.22 1.44-0.55 2.85-0.99 4.24l-0.57 1.62-0.56 1.41a34.163 34.163 0 0 1-7.62 11.36l2.12-2.4-0.14 0.14-0.92 1.06-1.06 1.2-0.57 0.57-0.56 0.57a36.378 36.378 0 0 1-16.23 8.39l-3.53 0.5-4.02 0.35h-199.6l-6.35-0.63c-16.73-3.06-28.9-17.63-28.93-34.64l0.56-6.35c3.07-16.76 17.67-28.93 34.71-28.92l114.29-0.14-189.07-189.1-4.09-4.94c-9.71-14.01-8.01-32.95 4.02-45.02z m-162.06 0c12.06 12.05 13.78 30.99 4.09 45.01l-4.09 4.94-189.15 189.08 114.3 0.14c17.04-0.01 31.65 12.17 34.71 28.92l0.57 6.35c-0.03 17.01-12.19 31.58-28.92 34.64l-6.35 0.63H173.09l-4.23-0.42-3.39-0.49a36.38 36.38 0 0 1-17.36-9.52l-1.06-1.13-0.98-1.13 0.98 1.06-1.97-2.26 0.85 1.06-0.42-0.56a35.137 35.137 0 0 1-3.74-5.64l-1.13-2.68a34.71 34.71 0 0 1-2.11-7.33l-0.28-1.13c-0.21-1.47-0.33-2.96-0.36-4.45V659.78c-0.03-18.28 13.89-33.55 32.09-35.2 18.2-1.65 34.65 10.87 37.9 28.85l0.57 6.35-0.07 114.36 189.29-189.22c13.77-13.77 36.11-13.77 49.88 0h-0.09z m-74.71-471.71l6.35 0.57c16.76 3.06 28.93 17.67 28.92 34.71l-0.63 6.35c-3.07 16.76-17.67 28.93-34.71 28.92l-114.3 0.14 189.15 189.08 4.09 4.94c10.26 15.02 7.42 35.37-6.55 47.01-13.98 11.63-34.51 10.74-47.42-2.07L208.29 233.71l0.07 114.3-0.57 6.35c-3.25 17.98-19.7 30.5-37.9 28.85-18.2-1.65-32.12-16.92-32.09-35.2V147.78c0-1.55 0.14-3.03 0.35-4.51l0.21-1.13c0.24-1.44 0.59-2.85 1.06-4.23a34.97 34.97 0 0 1 8.68-14.39l-2.12 2.4-0.42 0.57 1.55-1.84-0.99 1.06 0.92-0.98 2.26-2.33c3.04-2.73 6.52-4.92 10.3-6.49l2.82-1.06c3.45-1.07 7.04-1.62 10.65-1.62l-3.6 0.14h0.49l1.48-0.14h201.31z m512.91 0l1.41 0.14h0.42c2.43 0.29 4.84 0.79 7.19 1.48l2.82 1.06 2.61 1.2 3.04 1.76c2.09 1.33 4.03 2.89 5.78 4.66l1.13 1.2 0.78 0.98 0.21 0.14 0.49 0.64 2.33 3.17c2.35 3.83 3.98 8.07 4.8 12.49l0.21 1.13c0.21 1.48 0.35 2.96 0.35 4.44v200.37c-0.16 18.13-14.03 33.19-32.08 34.83-18.06 1.64-34.42-10.67-37.83-28.48l-0.57-6.35V233.65L659.54 422.87c-12.9 12.95-33.56 13.91-47.59 2.2-14.04-11.71-16.81-32.2-6.38-47.22l4.02-4.86 189.22-189.08-114.29-0.14c-17.06 0.04-31.71-12.14-34.78-28.92l-0.63-6.35c-0.01-17.04 12.16-31.65 28.93-34.71l6.35-0.57h201.27z m0 0',
    });
    const resizeIcon = createElementNode(
      'svg',
      undefined,
      {
        viewBox: '0 0 1024 1024',
        class: 'egg_icon',
      },
      resizePath
    );
    // 改变大小
    const resizeBtn = createElementNode(
      'button',
      undefined,
      {
        class: 'frame_btn',
        type: 'button',
        onclick: () => {
          max = !max;
          wrap.classList.toggle('max', max);
        },
      },
      resizeIcon
    );
    const closePath = createElementNode('path', undefined, {
      d: 'M453.44 512L161.472 220.032a41.408 41.408 0 0 1 58.56-58.56L512 453.44 803.968 161.472a41.408 41.408 0 0 1 58.56 58.56L570.56 512l291.968 291.968a41.408 41.408 0 0 1-58.56 58.56L512 570.56 220.032 862.528a41.408 41.408 0 0 1-58.56-58.56L453.44 512z',
    });
    const closeIcon = createElementNode(
      'svg',
      undefined,
      {
        viewBox: '0 0 1024 1024',
        class: 'egg_icon',
      },
      closePath
    );
    // 关闭窗口
    const closeBtn = createElementNode(
      'button',
      undefined,
      {
        class: 'frame_btn',
        type: 'button',
        onclick: () => {
          // 关闭窗口
          closeFrame();
        },
      },
      closeIcon
    );
    // 控制器
    const controls = createElementNode(
      'div',
      undefined,
      {
        class: 'frame_controls',
      },
      [hideBtn, resizeBtn, closeBtn]
    );
    const controlsWrap = createElementNode(
      'div',
      undefined,
      { class: 'frame_controls_wrap' },
      [title, controls]
    );
    // 窗口
    const frame = <HTMLIFrameElement>createElementNode('iframe', undefined, {
      class: 'frame',
    });
    // 窗口内容
    const frameContent = createElementNode(
      'div',
      undefined,
      {
        class: 'frame_content',
      },
      [frame]
    );
    // 容器
    const wrap = createElementNode('div', undefined, { class: 'frame_wrap' }, [
      controlsWrap,
      frameContent,
    ]);
    // 遮罩
    const mask = createElementNode('div', undefined, { class: 'frame_mask' });
    // 容器
    const conn = createElementNode(
      'div',
      undefined,
      {
        class: 'frame_container hide',
      },
      [mask, wrap]
    );
    document.body.append(conn);
  }
}
/**
 * @description 渲染提示
 */
function renderTip() {
  const tipWrap = createElementNode('div', undefined, {
    class: 'egg_tip_wrap',
  });
  document.body.append(tipWrap);
}
/**
 * @description 初始化 id
 */
function initFrameID() {
  if (settings[7]) {
    const win = unsafeWindow;
    win.addEventListener('message', (msg) => {
      const { data } = msg;
      if (data.id) {
        id = data.id;
        console.log('初始化 id!', id);
      }
    });
  }
}
/**
 * @description 打开窗口
 * @param url
 * @returns
 */
function openFrame(url: string) {
  const conn = $$('.frame_container')[0];
  if (conn) {
    setFrameVisible(true);
    // 窗口
    const frame = $$<HTMLIFrameElement>('.frame', conn)[0];
    // 打开
    closed = false;
    // id
    const id = generateMix(10);
    frame.src = url;
    frame.addEventListener('load', () => {
      frame.contentWindow?.postMessage({ id, closed: false }, url);
    });
    return {
      id,
      frame,
    };
  }
}
/**
 * @description 改变窗口可见性
 */
function setFrameVisible(show: boolean) {
  const conn = $$('.frame_container')[0];
  const frameBtn = $$('.frame_show_btn')[0];
  if (conn && frameBtn) {
    // 隐藏
    hidden = !show;
    conn.classList.toggle('hide', !show);
    frameBtn.classList.toggle('hide', show);
  }
}
/**
 * @description 关闭窗口
 */
function closeFrame() {
  const conn = $$('.frame_container')[0];
  const frameBtn = $$('.frame_show_btn')[0];
  if (conn && frameBtn) {
    // 隐藏窗口
    conn.classList.toggle('hide', true);
    // 隐藏按钮
    frameBtn.classList.toggle('hide', true);
    // 窗口
    const frame = $$<HTMLIFrameElement>('.frame', conn)[0];
    // 关闭
    closed = true;
    frame.src = '';
  }
}
/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose(id: string) {
  return new Promise((resolve) => {
    window.addEventListener('message', (msg) => {
      const { data } = msg;
      if (data.id === id && data.closed) {
        resolve(true);
      }
    });
    setInterval(() => {
      if (closed) {
        resolve(true);
      }
    }, 100);
  });
}
/**
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url: string) {
  if (settings[7]) {
    const newFrame = openFrame(url);
    if (newFrame) {
      // id
      const { id } = newFrame;
      // 等待窗口关闭
      await waitFrameClose(id);
    }
  } else {
    // 页面
    const newPage = openWin(url);
    await waitingClose(newPage);
  }
}
/**
 * @description 是否显示目菜单
 */
function setVisible(isShow: boolean) {
  // 菜单
  const menu = $$('.egg_menu')[0];
  if (menu) {
    menu.style.display = isShow ? 'block' : 'none';
  }
}
/**
 * @description 登录状态
 */
function loginStatus() {
  return new Promise((resolve) => {
    // 清楚之前的定时器
    if (loginTimer) {
      clearInterval(loginTimer);
    }
    loginTimer = setInterval(() => {
      // 获取token
      if (getCookie('token')) {
        clearInterval(loginTimer);
        resolve(true);
      }
    }, 100);
  });
}
/**
 * @description 登录窗口
 */
function loginWindowLoad() {
  // egg_frame_login
  const frameLogin = $$('.egg_frame_login')[0];
  // 配置
  const frameItem = $$('.egg_frame_item')[0];
  if (frameLogin) {
    let iframe = $$<HTMLIFrameElement>('iframe', frameLogin)[0];
    if (!iframe) {
      iframe = <HTMLIFrameElement>createElementNode('iframe');
      frameLogin.append(iframe);
      frameItem.classList.add('active');
      console.log('加载登录二维码!');
    } else {
      console.log('刷新登录二维码!');
    }
    // 登录页面
    iframe.src = URL_CONFIG.login;
  }
}
/**
 * @description 学习
 */
async function study() {
  console.log('开始学习');
  // 暂停
  await pauseStudyLock();
  // 任务
  if (tasks.length) {
    // 检查新闻
    if (settings[0] && !tasks[0].status) {
      console.log('任务一：看新闻');
      // 暂停
      await pauseStudyLock();
      // 看新闻
      await readNews();
    }
    if (settings[1] && !tasks[1].status) {
      console.log('任务二：看视频');
      // 暂停
      await pauseStudyLock();
      // 看视频
      await watchVideo();
    }
    // 检查每日答题
    if (settings[2] && !tasks[2].status) {
      console.log('任务三：做每日答题');
      // 暂停
      await pauseStudyLock();
      // 做每日答题
      await doExamPractice();
    }
    // 检查每周答题
    if (settings[3] && !tasks[3].status) {
      console.log('任务四：做每周答题');
      // 暂停
      await pauseStudyLock();
      // 做每周答题
      const res = await doExamWeekly();
      // 无题可做
      if (!res) {
        // 如果是全都完成了, 已经没有能做的了
        tasks[3].status = true;
        // 进度条对象
        const taskProgressList = $$('.egg_progress');
        // 进度信息
        const progressInfo = taskProgressList[3];
        // 进度条
        const bar = $$('.egg_bar', progressInfo)[0];
        // 百分比
        const percent = $$('.egg_percent', progressInfo)[0];
        // 长度
        bar.style.width = `100%`;
        // 文字
        percent.innerText = `100%`;
      }
    }
  }
  // 检查专项练习
  if (settings[4] && !tasks[4].status) {
    console.log('任务五：做专项练习');
    // 暂停
    await pauseStudyLock();
    // 做专项练习
    const res = await doExamPaper();
    // 无题可做
    if (!res) {
      // 如果是全都完成了, 已经没有能做的了
      tasks[4].status = true;
      // 进度条对象
      const taskProgressList = $$('.egg_progress');
      // 进度条信息
      const progressInfo = taskProgressList[4];
      // 进度条
      const bar = $$('.egg_bar', progressInfo)[0];
      // 百分比
      const percent = $$('.egg_percent', progressInfo)[0];
      // 长度
      bar.style.width = `100%`;
      // 文字
      percent.innerText = `100%`;
    }
  }
}
/**
 * @description 设置进度条
 */
function setProgress(index: number, progress: number) {
  // 进度条对象
  const taskProgressList = $$('.egg_progress');
  // 进度条信息
  const progressInfo = taskProgressList[index];
  // 进度条
  const bar = $$('.egg_bar', progressInfo)[0];
  // 百分比
  const percent = $$('.egg_percent', progressInfo)[0];
  // 长度
  bar.style.width = `${progress}%`;
  // 文字
  percent.innerText = `${progress}%`;
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
  const startButton = $$('#startButton')[0];
  startButton.innerText = '继续学习';
  startButton.classList.remove('loading');
  startButton.removeEventListener('click', pauseTask);
  startButton.addEventListener('click', continueTask);
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
  const startButton = $$('#startButton')[0];
  startButton.innerText = '正在学习, 点击暂停';
  startButton.classList.add('loading');
  startButton.removeEventListener('click', continueTask);
  startButton.addEventListener('click', pauseTask);
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
  const startButton = $$('#startButton')[0];
  startButton.innerText = '已完成';
  startButton.classList.remove('loading');
  startButton.classList.add('disabled');
  startButton.setAttribute('disabled', '');
}
/**
 * @description 开始
 */
async function start() {
  // 保存配置
  console.log('准备开始学习...');
  if (login && !started) {
    started = true;
    // 初始化暂停
    if (GM_getValue('pauseStudy') !== false) {
      GM_setValue('pauseStudy', false);
    }
    // 开始按钮
    const startButton = $$('#startButton')[0];
    startButton.innerText = '正在学习, 点击暂停';
    startButton.classList.add('loading');
    startButton.removeEventListener('click', start);
    // 点击暂停
    startButton.addEventListener('click', pauseTask);
    // 隐藏界面
    if (settings[5]) {
      setVisible(false);
    }
    // 查询今天还有什么任务没做完
    console.log('检查今天还有什么任务没做完');
    // 任务
    if (tasks.length) {
      // 学习
      await study();
      // 未完成
      if (!tasks.every((task, i) => !settings[i] || task.status)) {
        await study();
      }
      // 刷新菜单数据
      await refreshMenu();
      finishTask();
      // 关闭窗口
      if (settings[7]) {
        closeFrame();
      }
      console.log('已完成');
    }
    // 显示界面
    if (settings[5]) {
      setVisible(true);
    }
  }
}
