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
 * @description 设置类型
 */
enum SettingType {
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
type Settings = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

/**
 * @description 定时信息
 */
type Schedule = {
  time: string;
  hour: number;
  minute: number;
};

/**
 * @description 进度类型
 */
enum TaskStatusType {
  LOADING,
  LOADED,
  START,
  PAUSE,
  FINISH,
}

/**
 * @description 文章视听列表
 */
type NewsVideoList = {
  publishTime: string;
  title: string;
  type: string;
  url: string;
  showSource: string;
  auditTime: string;
  dataValid: boolean;
  itemType: string;
}[];

export {
  TaskType,
  SettingType,
  Settings,
  Schedule,
  TaskStatusType,
  NewsVideoList,
};
