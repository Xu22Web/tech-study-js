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
function createElementNode(
  eleName: string,
  props?: { [key: string]: any },
  attrs?: { [key: string]: any },
  children?: Node | Node[]
): HTMLElement {
  // 元素
  let ele;
  // 格式化元素名
  const formatEleName = eleName.toLowerCase();
  // 需要命名空间的svg元素
  const specficSVGElement = [
    'svg',
    'use',
    'circle',
    'rect',
    'line',
    'marker',
    'linearGradient',
    'g',
    'path',
  ];
  // 需要命名空间的html元素
  const specficHTMLElement = 'html';
  if (formatEleName === specficHTMLElement) {
    // html元素命名空间
    const ns = 'http://www.w3.org/1999/xhtml';
    // 创建普通元素
    ele = document.createElementNS(ns, formatEleName);
  } else if (specficSVGElement.includes(formatEleName)) {
    // svg元素命名空间
    const ns = 'http://www.w3.org/2000/svg';
    // 创建普通元素
    ele = document.createElementNS(ns, formatEleName);
  } else {
    // 创建普通元素
    ele = document.createElement(formatEleName);
  }
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
    } else {
      // 特殊属性
      const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
      if (specificAttrs.includes(key) && value) {
        ele.setAttribute(key, '');
      } else {
        if (value) {
          ele.setAttribute(key, value);
        } else {
          ele.removeAttribute(key);
        }
      }
    }
  }
  // 子节点
  if (children) {
    if (children instanceof Array) {
      if (children.length === 1) {
        ele.append(children[0]);
      } else {
        // 文档碎片
        const fragment = document.createDocumentFragment();
        for (const i in children) {
          fragment.append(children[i]);
        }
        ele.append(fragment);
      }
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
function createTextNode(...text) {
  if (text && text.length === 1) {
    return document.createTextNode(text[0]);
  }
  const fragment = document.createDocumentFragment();
  for (const i in text) {
    const textEle = document.createTextNode(text[i]);
    fragment.append(textEle);
  }
  return fragment;
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
  createTextNode,
  createRandomPoint,
  createRandomPath,
  generateMix,
};
