/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
  // 获取当前所有cookie
  const strCookies = document.cookie;
  // 截取变成cookie数组
  const cookieText = strCookies.split(';');
  // 循环每个cookie
  for (const i in cookieText) {
    // 将cookie截取成两部分
    const item = cookieText[i].split('=');
    // 判断cookie的name 是否相等
    if (item[0].trim() === name) {
      return item[1].trim();
    }
  }
  return null;
}
/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce(callback, delay) {
  let timer = -1;
  return function (this: any, ...args) {
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = <any>setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
/**
 * @description 选择器
 * @param selector
 * @returns
 */
function $$<T extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
) {
  return Array.from(parent.querySelectorAll<T>(selector));
}
/**
 * @description 打开新窗口
 */
function openWin(url: string) {
  return GM_openInTab(url, {
    active: true,
    insert: true,
    setParent: true,
  });
}
/**
 * @description 关闭子窗口
 */
function closeWin(frame?: boolean, id?: string) {
  try {
    if (frame) {
      window.parent.postMessage({ id, closed: true }, 'https://www.xuexi.cn');
    } else {
      window.opener = window;
      const win = window.open('', '_self');
      win?.close();
      top?.close();
    }
  } catch (e) {}
}
/**
 * @description 等待窗口关闭
 * @param newPage
 * @returns
 */
function waitingClose(newPage) {
  return new Promise((resolve) => {
    const doing = setInterval(() => {
      if (newPage.closed) {
        clearInterval(doing); // 停止定时器
        resolve('done');
      }
    }, 1000);
  });
}
/**
 * @description 等待时间
 * @param time
 * @returns
 */
function sleep(time) {
  if (!Number.isInteger(time)) {
    time = 1000;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, time);
  });
}
/**
 * @description 判断是否为移动端
 * @returns
 */
function hasMobile() {
  let isMobile = false;
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    console.log('移动端');
    isMobile = true;
  }
  if (document.body.clientWidth < 800) {
    console.log('小尺寸设备端');
    isMobile = true;
  }
  return isMobile;
}
/**
 * @description 创建元素节点
 * @param eleName
 * @param props
 * @param attrs
 * @param children
 * @returns
 */
function createElementNode<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  props?: { [key: string]: any },
  attrs?: { [key: string]: any },
  children?:
    | HTMLElement
    | SVGElement
    | Text
    | (HTMLElement | SVGElement | Text | undefined)[]
    | Promise<HTMLElement>
    | Promise<Text>
    | Promise<HTMLElement | undefined>
): HTMLElementTagNameMap[T] {
  // 创建普通元素
  const ele = document.createElement(tagName);
  // props属性设置
  for (const key in props) {
    if (props[key] instanceof Object) {
      for (const subkey in props[key]) {
        ele[key][subkey] = props[key][subkey];
      }
    } else {
      ele[key] = props[key];
    }
  }
  // attrs属性设置
  for (const key in attrs) {
    // 属性值
    const value = attrs[key];
    // 处理完的key
    const formatKey = key.toLowerCase();
    // 特殊属性
    const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
    // xlink命名空间
    if (formatKey.startsWith('xlink:')) {
      // xlink属性命名空间
      const attrNS = 'http://www.w3.org/1999/xlink';
      if (value) {
        ele.setAttributeNS(attrNS, key, value);
      } else {
        ele.removeAttributeNS(attrNS, key);
      }
    } else if (formatKey.startsWith('on')) {
      // 事件监听
      const [, eventType] = key.toLowerCase().split('on');
      // 事件类型
      if (eventType) {
        // 回调函数
        if (value instanceof Function) {
          ele.addEventListener(eventType, value);

          // 回调函数数组
        } else if (value instanceof Array) {
          for (const i in value) {
            // 回调函数
            if (value[i] instanceof Function) {
              ele.addEventListener(eventType, value[i]);
            }
          }
        }
      }
    } else if (specificAttrs.includes(key)) {
      if (value) {
        ele.setAttribute(key, '');
      } else {
        ele.removeAttribute(key);
      }
    } else {
      ele.setAttribute(key, value);
    }
  }
  // 子节点
  if (children) {
    if (children instanceof Array) {
      // 过滤
      const filterEle = <(HTMLElement | SVGElement | Text)[]>(
        children.filter((child) => child)
      );
      ele.append(...filterEle);
    } else {
      if (children instanceof Promise) {
        children.then((child) => child && ele.append(child));
      } else {
        ele.append(children);
      }
    }
  }
  return ele;
}
/**
 * @description 创建svg元素
 * @param tagName
 * @param props
 * @param attrs
 * @param children
 * @returns
 */
function createNSElementNode<T extends keyof SVGElementTagNameMap>(
  tagName: T,
  props?: { [key: string]: any },
  attrs?: { [key: string]: any },
  children?:
    | HTMLElement
    | SVGElement
    | Text
    | (HTMLElement | SVGElement | Text)[]
): SVGElementTagNameMap[T] {
  // svg元素命名空间
  const ns = 'http://www.w3.org/2000/svg';
  // 创建svg元素
  const ele = document.createElementNS(ns, tagName);
  // props属性设置
  for (const key in props) {
    if (props[key] instanceof Object) {
      for (const subkey in props[key]) {
        ele[key][subkey] = props[key][subkey];
      }
    } else {
      ele[key] = props[key];
    }
  }
  // attrs属性设置
  for (const key in attrs) {
    // 属性值
    const value = attrs[key];
    // 处理完的key
    const formatKey = key.toLowerCase();
    // 特殊属性
    const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
    // xlink命名空间
    if (formatKey.startsWith('xlink:')) {
      // xlink属性命名空间
      const attrNS = 'http://www.w3.org/1999/xlink';
      if (value) {
        ele.setAttributeNS(attrNS, key, value);
      } else {
        ele.removeAttributeNS(attrNS, key);
      }
    } else if (formatKey.startsWith('on')) {
      // 事件监听
      const [, eventType] = key.toLowerCase().split('on');
      // 事件类型
      if (eventType) {
        // 回调函数
        if (value instanceof Function) {
          ele.addEventListener(eventType, value);
          // 回调函数数组
        } else if (value instanceof Array) {
          for (const i in value) {
            // 回调函数
            if (value[i] instanceof Function) {
              ele.addEventListener(eventType, value[i]);
            }
          }
        }
      }
    } else if (specificAttrs.includes(key)) {
      if (value) {
        ele.setAttribute(key, '');
      } else {
        ele.removeAttribute(key);
      }
    } else {
      ele.setAttribute(key, value);
    }
  }
  // 子节点
  if (children) {
    if (children instanceof Array) {
      ele.append(...children);
    } else {
      ele.append(children);
    }
  }
  return ele;
}
/**
 * @description 创建文字节点
 * @param text
 * @returns
 */
function createTextNode(text: any) {
  return document.createTextNode(text);
}
/**
 * @description 点
 */
export type Point = { x: number; y: number };

/**
 * @description 范围
 */
export type Bounds = { x: number; y: number; width: number; height: number };
/**
 * @description 创建随机点
 * @param bounds 范围
 * @returns
 */
function createRandomPoint(bounds: Bounds): Point {
  // 范围
  const { x, y, width, height } = bounds;
  // 横坐标
  const randX = x + Math.random() * width * 0.5 + width * 0.25;
  // 纵坐标
  const randY = y + Math.random() * height * 0.5 + height * 0.25;
  return {
    x: randX,
    y: randY,
  };
}

/**
 * @description 生成随机路径
 * @param start
 * @param end
 * @param steps
 * @returns
 */
function createRandomPath(start: Point, end: Point, steps: number) {
  // 最小水平增量
  const minDeltaX = (end.x - start.x) / steps;
  // 最大垂直增量
  const maxDeltaY = (end.y - start.y) / steps;

  const path: Point[] = [];
  // 开始节点
  path.push(start);
  // 插入点
  for (let i = 0; i < steps; i++) {
    // 横坐标
    const x = path[i].x + Math.random() * 5 + minDeltaX;
    // 纵坐标
    const y =
      path[i].y +
      Math.random() * 5 * Math.pow(-1, ~~(Math.random() * 2 + 1)) +
      maxDeltaY;
    path.push({
      x,
      y,
    });
  }
  return path;
}
/**
 * @description 随机数字
 * @returns
 */
function generateNumAsChar(): string {
  return (~~(Math.random() * 10)).toString();
}
/**
 * @description 随机大写字母
 * @returns
 */
function generateUpperAsChar(): string {
  return String.fromCharCode(~~(Math.random() * 26) + 65);
}
/**
 * @description 随机小写字母
 * @returns
 */
function generateLowerAsChar(): string {
  return String.fromCharCode(~~(Math.random() * 26) + 97);
}
/**
 * @description 随机混合字符
 * @param length
 * @returns
 */
function generateMix(length: number = 6): string {
  // 随机字符串
  const randomText: string[] = [];
  // 生成器
  const typeGenerator: (() => string)[] = [
    generateNumAsChar,
    generateUpperAsChar,
    generateLowerAsChar,
  ];
  if (length) {
    for (let i = 0; i < length; i++) {
      // 随机位置
      const randomIndex = ~~(Math.random() * typeGenerator.length);
      randomText.push(typeGenerator[randomIndex]());
    }
  }
  return randomText.join('');
}
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
 * @description html进度条
 * @param title
 * @param percent
 * @returns
 */
function getProgressHTML(title: string, percent: number) {
  // html
  const progressHTML = `<div
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1px 0;
    "
  >
    <span>${title}</span>
    <span>${getHighlightHTML(percent)} %</span>
  </div>
  <div
    style="
      background: white;
      border-radius: 10px;
      height: 10px;
      border: 1px solid #eee;
      flex-shrink: 1;
    "
  >
    <div
      style="
        background: linear-gradient(to left, #188fff80, #1890ff);
        height: 100%;
        width: ${percent}%;
        border-radius: 10px;
      "
    ></div>
  </div>`;
  return progressHTML;
}
/**
 * @description html高亮文本
 * @param text
 * @returns
 */
function getHighlightHTML(text: string | number) {
  // html
  const highlightHTML = `<span style="color: #1890ff">${text}</span>`;
  return highlightHTML;
}
/**
 * @description 二维码
 * @param src
 */
function getImgHTML(src: string) {
  // 图片
  return `
     <div style="padding: 10px 0">
     <div
       style="
         display: flex;
         justify-content: center;
         align-items: center;
         padding: 20px;
         background: #f7f7f7;
         border-radius: 10px;
       "
     >
         <img src="${src}" style="" />
       </div>
     </div>
`;
}
/**
 * @description 创建模态框
 * @param options 选项
 * @returns
 */
function createModal(options: ModalOptions) {
  // 配置
  const {
    title,
    subTitle = '',
    to = '用户',
    content,
    type,
    from = 'tech-study.js',
  } = options;
  // 内容文本
  let contentText = '';
  if (Array.isArray(content)) {
    contentText = content.map((ct) => `<div>${ct}</div>`).join('');
  } else {
    contentText = content;
  }
  // 日期
  const dateTime = formatDateTime();
  // 类型html
  let typeHTML = '';
  if (type && type.length) {
    if (type === 'info') {
      typeHTML = `
      <svg
       viewBox="64 64 896 896"
       style="color: #1890ff; width: 18px; height: 18px"
       fill="currentColor"
       aria-hidden="true"
     >
       <path
         d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
       ></path>
     </svg>`;
    }
    if (type === 'warn') {
      typeHTML = `
      <svg
        viewBox="64 64 896 896"
        style="color: #faad14; width: 18px; height: 18px"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
        ></path>
      </svg>
      `;
    }
    if (type === 'success') {
      typeHTML = `
      <svg
        viewBox="64 64 896 896"
        style="color: #52c41a; width: 18px; height: 18px"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
        ></path>
      </svg>
      `;
    }
    if (type === 'fail') {
      typeHTML = `
      <svg
        viewBox="64 64 896 896"
        style="color: #ff4d4f; width: 18px; height: 18px"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
        ></path>
      </svg>
      `;
    }
  }
  // 类型
  const typeWrap = `
  <span
    style="
      padding-right: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    ${typeHTML}
  </span>
  `;
  // 基础html
  const baseHTML = `
  <div
  style="
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  "
>
  <div
    style="
      background: #ffffff;
      box-shadow: 1px 1px 8px -1px #dadada;
      padding: 5px 10px;
      border-radius: 5px;
      width: 100%;
    "
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding: 5px;
        border-bottom: 1px solid #eee;
      "
    >
      <div style="display: flex; justify-content: center; align-items: center">
        ${typeWrap}
        <span style="padding-left: 5px; font-size: 18px">${title}</span>
      </div>
      <div style="font-size: 16px; color: #999">${subTitle}</div>
    </div>
    <div></div>

    <div style="padding:10px 5px; font-size: 16px; min-height: 80px">
      <div>
        ${getHighlightHTML(to)}, 你好!
      </div>
      <div style="line-height: 28px;">${contentText}</div>
    </div>
    <div
      style="
        font-size: 14px;
        padding: 5px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="color: #999">${dateTime}</div>
      <div>
        <span>来自</span>
        <span style="color: #1890ff; padding-left: 1px">${from}</span>
      </div>
    </div>
  </div>
</div>  
  `;
  return baseHTML;
}
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
export {
  $$,
  openWin,
  closeWin,
  waitingClose,
  debounce,
  hasMobile,
  getCookie,
  sleep,
  createElementNode,
  createNSElementNode,
  createTextNode,
  createRandomPoint,
  createRandomPath,
  generateMix,
  createModal,
  getImgHTML,
  formatTime,
  formatDateNum,
  isNow,
  isLate,
  getProgressHTML,
  getHighlightHTML,
};
