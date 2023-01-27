/* 变量 */

import { Schedule, Settings, Task, TaskType, URLData } from '../types';
import { getCookie } from '../utils';

const defaultSettings: Settings = [
  true,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  false,
];

const mainStore: {
  /**
   * @description 版本号
   */
  version: string;
  /**
   * @description 任务进度
   */
  tasks: Task[];
  /**
   * @description 获取 URL
   */
  href: string;
  /**
   * @description 设置
   */
  settings: Settings;
  /**
   * @description 已经开始
   */
  started: boolean;
  /**
   * @description 是否暂停答题
   */
  pause: boolean;
  /**
   * @description 初始化登录状态
   */
  login: boolean;
  /**
   * @description 新闻
   */
  news: URLData[];
  /**
   * @description 视频
   */
  videos: URLData[];
  /**
   * @description 刷新定时器
   */
  refreshTimer: any;
  /**
   * @description 定时任务定时器
   */
  scheduleTimer: any;
  /**
   * @description frame 关闭
   */
  closed: boolean;
  /**
   * @description id
   */
  id: string;
  /**
   * @description 定时任务
   */
  scheduleList: Schedule[];
  /**
   * @description 推送 token
   */
  pushToken: string;
  /**
   * @description 刷新次数
   */
  refreshCount: number;
} = {
  version: 'v1.5.4',
  tasks: [
    {
      title: '文章选读',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每有效阅读一篇文章积1分，上限6分。有效阅读文章累计1分钟积1分，上限6分。每日上限积12分。',
      type: TaskType.READ,
      percent: 0,
    },
    {
      title: '视听学习',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每有效一个音频或观看一个视频积1分，上限6分。有效收听音频或观看视频累计1分钟积1分，上限6分。每日上限积12分。',
      type: TaskType.WATCH,
      percent: 0,
    },
    {
      title: '每日答题',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每组答题每答对1道积1分。每日上限积5分。',
      type: TaskType.PRACTICE,
      percent: 0,
    },
    {
      title: '专项练习',
      currentScore: 0,
      dayMaxScore: 0,
      need: 0,
      status: false,
      tip: '每组答题每答对1道积1分，同组答题不重复积分；每日仅可获得一组答题积分，5道题一组的上限5分，10道题一组的上限10分。',
      type: TaskType.PAPER,
      percent: 0,
    },
  ],
  href: window.location.href,
  settings: defaultSettings,
  started: false,
  pause: false,
  login: !!getCookie('token'),
  news: [],
  videos: [],
  refreshTimer: null,
  scheduleTimer: null,
  closed: true,
  id: '',
  scheduleList: [],
  pushToken: '',
  refreshCount: 0,
};

export { mainStore, defaultSettings };
