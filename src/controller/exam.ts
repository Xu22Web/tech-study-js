import { getAnswer, saveAnswer } from '../api/answer';
import { getExamPaper } from '../api/data';
import { examPaperReverse } from '../config/task';
import URL_CONFIG from '../config/url';
import { mainStore } from '../store';
import { SettingType, TaskType } from '../types';
import { $$ } from '../utils/element';
import { log } from '../utils/log';
import { pushModal } from '../utils/push';
import { createRandomPath, createRandomPoint } from '../utils/random';
import {
  examPauseLock,
  hasMobile,
  sleep,
  studyPauseLock,
} from '../utils/utils';
import { closeTaskWin, waitTaskWin } from './frame';
import { createTip } from './tip';
import { refreshScoreInfo, refreshTaskList } from './user';

/**
 * @description  考试类型
 */
enum ExamType {
  PRACTICE,
  PAPER,
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
 * @description 处理滑动验证
 */
function handleSlideVerify() {
  return new Promise(async (resolve) => {
    // 滑动验证
    const mask = $$<HTMLElement>('#nc_mask')[0];
    if (mask && getComputedStyle(mask).display !== 'none') {
      // 创建提示
      createTip('等待滑动验证');
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
          await sleep(10);
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
          await sleep(10);
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
      createTip('滑动验证完成!');
      // 定时器
      const timer = setInterval(() => {
        // 滑动验证
        const mask = $$('#nc_mask')[0];
        if (!mask || getComputedStyle(mask).display === 'none') {
          log('滑动验证成功!');
          // 创建提示
          createTip('滑动验证成功!');
          clearInterval(timer);
          resolve(true);
          return;
        }
        resolve(false);
        log('滑动验证失败!');
        // 创建提示
        createTip('滑动验证失败!');
      }, 1000);
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
 * @description 答题
 */
async function doingExam(type: ExamType) {
  // 下一个按钮
  let nextButton: HTMLButtonElement;
  // 下一个文本
  let nextText: string;
  // 保存答案
  let shouldSaveAnswer = false;
  while (true) {
    // 先等等再开始做题
    await sleep(2500);
    // 暂停
    await examPauseLock();
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
    await sleep(1500);
    // 暂停
    await examPauseLock();
    // 选项按钮
    const allBtns = $$<HTMLButtonElement>('.q-answer');
    // 所有填空
    const blanks = $$<HTMLInputElement>('input[type=text][class=blank]');
    // 问题类型
    const questionType = <'填空题' | '单选题' | '多选题'>(
      $$('.q-header')[0].innerText.substring(0, 3)
    );
    // 暂停
    await examPauseLock();
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
        createTip('答案异常, 尝试网络题库获取!');
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
        if (
          type === ExamType.PRACTICE ||
          mainStore.settings[SettingType.RANDOM_EXAM]
        ) {
          log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!');
          await handleBlankInputRand();
        } else {
          // 推送
          const res = await pushModal(
            {
              title: '学习推送',
              content: '答题存在异常, 已暂停答题!',
              type: 'fail',
            },
            mainStore.pushToken
          );
          createTip(`学习推送${res ? '成功' : '失败'}!`);
          // 暂停
          mainStore.examPause.value = true;
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
        createTip('答案异常, 尝试网络题库获取!');
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
        if (
          type === ExamType.PRACTICE ||
          mainStore.settings[SettingType.RANDOM_EXAM]
        ) {
          log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!');
          await handleMutiplyChoiceRand();
        } else {
          // 推送
          const res = await pushModal(
            {
              title: '学习推送',
              content: '答题存在异常, 已暂停答题!',
              type: 'fail',
            },
            mainStore.pushToken
          );
          createTip(`学习推送${res ? '成功' : '失败'}!`);
          // 暂停
          mainStore.examPause.value = true;
          // 提交答案
          shouldSaveAnswer = true;
        }
        break;
      }
      case '单选题': {
        // 根据提示作答
        if (answers.length) {
          // 创建提示为1
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
        createTip('答案异常, 尝试网络题库获取!');
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
        if (
          type === ExamType.PRACTICE ||
          mainStore.settings[SettingType.RANDOM_EXAM]
        ) {
          log('答案不存在, 随机作答!');
          // 创建提示
          createTip('答案不存在, 随机作答!');
          await handleSingleChoiceRand();
        } else {
          // 推送
          const res = await pushModal(
            {
              title: '学习推送',
              content: '答题存在异常, 已暂停答题!',
              type: 'fail',
            },
            mainStore.pushToken
          );
          createTip(`学习推送${res ? '成功' : '失败'}!`);
          // 暂停
          mainStore.examPause.value = true;
          // 提交答案
          shouldSaveAnswer = true;
        }
        break;
      }
    }
    // 暂停
    await examPauseLock();
    // 获取下一个按钮
    nextButton = await getNextButton();
    // 下一个文本
    nextText = nextButton.innerText.replaceAll(' ', '');
    // 需要提交答案
    if (shouldSaveAnswer) {
      // 获取key
      const key = md5(question);
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
            const [, answer] = answerTemp.split('.');
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
        log('上传答案', { answer, key, question });
        // 保存答案
        await saveAnswer(key, answer);
        // 答案
        log('上传答案成功!');
      }
      // 重置
      shouldSaveAnswer = false;
    }
    // 确认
    if (nextText === '确定') {
      // 确认
      nextButton.click();
      // 等待一段时间
      await sleep(2000);
      // 暂停
      await examPauseLock();
      // 答案解析
      const answerBox = $$('.answer')[0];
      // 答题错误
      if (answerBox) {
        // 获取key
        const key = md5(question);
        const answerTemp = answerBox.innerText;
        // 从字符串中拿出答案
        const [, answerText] = answerTemp.split('：');
        if (answerText && answerText.length) {
          const answer = answerText.replaceAll(' ', ';');
          log('上传答案', { answer, key, question });
          await saveAnswer(key, answer);
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
      await sleep(2500);
      // 下一题
      nextButton.click();
    }
  }
  // 关闭任务窗口
  closeTaskWin(mainStore.id);
}

/**
 * @description 做每日答题
 */
async function doExamPractice() {
  // 暂停
  await studyPauseLock();
  log('正在做每日答题...');
  // 创建提示
  createTip('正在做每日答题');
  // 链接
  const url = URL_CONFIG.examPractice;
  // 等待任务窗口
  await waitTaskWin(url, '每日答题');
  // 创建提示
  createTip('完成每日答题!');
  // 等待一段时间
  await sleep(1500);
  // 刷新分数数据
  await refreshScoreInfo();
  // 刷新任务数据
  await refreshTaskList();
  // 任务完成状况
  if (
    mainStore.settings[SettingType.PRACTICE] &&
    !mainStore.tasks[TaskType.PRACTICE].status
  ) {
    log('任务未完成, 继续每日答题!');
    // 创建提示
    createTip('任务未完成, 继续每日答题!');
    await doExamPractice();
  }
}

/**
 * @description 做专项练习
 */
async function doExamPaper() {
  // 创建提示
  createTip('正在寻找未做的专项练习');
  // id
  const examPaperId = await findExamPaper();
  if (examPaperId) {
    // 暂停
    await studyPauseLock();
    log('正在做专项练习...');
    // 创建提示
    createTip('正在做专项练习');
    // 链接
    const url = `${URL_CONFIG.examPaper}?id=${examPaperId}`;
    log(`链接: ${url}`);
    // 等待窗口任务
    await waitTaskWin(url, '专项练习');
    // 创建提示
    createTip('完成专项练习!');
    // 等待一段时间
    await sleep(1500);
    // 刷新分数数据
    await refreshScoreInfo();
    // 刷新任务数据
    await refreshTaskList();
    if (
      mainStore.settings[SettingType.PAPER] &&
      !mainStore.tasks[TaskType.PAPER].status
    ) {
      log('任务未完成, 继续专项练习!');
      // 创建提示
      createTip('任务未完成, 继续专项练习!');
      doExamPaper();
    }
    return;
  }
  // 创建提示
  createTip('专项练习均已完成!');
}

/**
 * @description 初始化总页数属性
 */
async function initExam() {
  // 默认从第一页获取全部页属性
  const data = await getExamPaper(1);
  if (data) {
    // 等待
    await sleep(3000);
    return data.totalPageCount;
  }
}

/**
 * @description 查询专项练习列表
 */
async function findExamPaper() {
  log('正在寻找未完成的专项练习...');
  // 获取总页数
  const total = await initExam();
  // 当前页数
  let current = examPaperReverse ? total : 1;
  if (examPaperReverse) {
    log('专项练习, 开启逆序模式, 从最早的题目开始答题');
  } else {
    log('专项练习, 开启顺序模式, 从最近的题目开始答题');
  }
  log('正在寻找未完成的专项练习...');
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
      await sleep(3000);
    } else {
      break;
    }
  }
}

export { doingExam, doExamPaper, doExamPractice, ExamType };
