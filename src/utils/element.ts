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
 * @description 异步选择器
 * @param selector
 * @returns
 */
function $_<T extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
) {
  return new Promise<T[]>((resolve, reject) => {
    const timer = setInterval(() => {
      const selectors = Array.from(parent.querySelectorAll<T>(selector));
      // 存在元素
      if (selectors.length) {
        clearInterval(timer);
        resolve(selectors);
      }
    }, 10);
  });
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

export { createElementNode, createNSElementNode, createTextNode, $$, $_ };
