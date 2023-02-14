import { Ref } from '../utils/composition';

/**
 * @description 任务类型
 */
enum TaskType {
  READ,
  WATCH,
  PRACTICE,
  PAPER,
}

/**
 * @description 任务
 */
type Task = {
  title: string;
  dayMaxScore: number;
  currentScore: number;
  status: boolean;
  need: number;
  tip: string;
  type: TaskType;
  percent: Ref<number>;
  score: Ref<number>;
};

/**
 * @description 设置类型
 */
enum SettingType {
  READ,
  WATCH,
  PRACTICE,
  PAPER,
  AUTO_START,
  SAME_TAB,
  SILENT_RUN,
  SCHEDULE_RUN,
  RANDOM_EXAM,
  PAPER_REVERSE,
  REMOTE_PUSH,
}

/**
 * @description 设置
 */
type Settings = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];

/**
 * @description 定时信息
 */
type Schedule = {
  time: string;
  hour: number;
  minute: number;
};

/**
 * @description 数据
 */
type URLData = { url: string };

/**
 * @description 进度类型
 */
enum ProgressType {
  LOADING,
  LOADED,
  START,
  PAUSE,
  FINISH,
}

export {
  TaskType,
  Task,
  SettingType,
  Settings,
  Schedule,
  URLData,
  ProgressType,
};
