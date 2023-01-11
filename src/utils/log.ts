import { formatDateTime } from './time';

/**
 * @description 打印日志
 * @param text
 */
function log(...text: any[]) {
  console.log(
    `%c[${formatDateTime()}] %c${text.join(' ')}`,
    '',
    'color:dodgerblue'
  );
}

export { log };
