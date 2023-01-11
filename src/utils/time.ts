/**
 * @description 格式化日期时间数字
 * @param num
 * @returns
 */
function formatDateNum(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * @description 格式化日期时间
 * @param time
 * @returns
 * @example
 * formatDateTime() -> "2022-09-01 08:00:00"
 * formatDateTime(new Date()) -> "2022-09-01 08:00:00"
 * formatDateTime(Date.now()) -> "2022-09-01 08:00:00"
 */
function formatDateTime(time: Date | string | number = Date.now()) {
  const date = new Date(time);
  const s = date.getSeconds();
  const min = date.getMinutes();
  const h = date.getHours();
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  // 日期
  const dateText = [y, m, d].map(formatDateNum).join('-');
  // 时间
  const timeText = [h, min, s].map(formatDateNum).join(':');
  // 日期时间
  const dateTimeText = `${dateText} ${timeText}`;
  return dateTimeText;
}

/**
 * @description 格式化时间
 * @param time
 * @returns
 * @example
 * formatTime() -> "08:00:00"
 * formatTime(new Date()) -> "08:00:00"
 * formatTime(Date.now()) -> "08:00:00"
 */
const formatTime = (time: Date | string | number = Date.now()) => {
  const date = new Date(time);
  const s = date.getSeconds();
  const min = date.getMinutes();
  const h = date.getHours();
  // 时间
  const timeText = [h, min, s].map(formatDateNum).join(':');
  return timeText;
};

/**
 * @description 时间已过
 * @param hour
 * @param minute
 * @returns
 */
function isLate({ hour, minute }: { hour: number; minute: number }) {
  const date = new Date();
  const h = date.getHours();
  const min = date.getMinutes();
  return h > hour || (h === hour && min >= minute);
}

/**
 * @description 时间已过
 * @param hour
 * @param minute
 * @returns
 */
function isNow({ hour, minute }: { hour: number; minute: number }) {
  const date = new Date();
  const h = date.getHours();
  const min = date.getMinutes();
  const s = date.getSeconds();
  return h === hour && min === minute && s === 0;
}

export { formatDateNum, formatDateTime, isLate, isNow };
