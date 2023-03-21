import { formatDateTime } from './time';

/**
 * @description 打印日志
 * @param text
 */
function log(...text: any[]) {
  printColor('dodgerblue', ...text);
}

/**
 * @description 打印错误
 * @param text
 */
function error(...text: any[]) {
  printColor('red', ...text);
}

/**
 * @description 打印信息
 * @param text
 */
function info(...text: any[]) {
  printColor('yellow', ...text);
}

/**
 * @description 打印颜色
 * @param text
 * @param color
 */
function printColor(color: string, ...text: any[]) {
  const textFormatted = text
    .map((t) => (typeof t === 'object' ? JSON.stringify(t) : String(t)))
    .join(' ');
  console.log(
    `%c[${formatDateTime()}] %c${textFormatted}`,
    '',
    `color: ${color}`
  );
}

export { log, error, info };
