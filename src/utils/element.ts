import { isRef, Ref, watchEffect } from './composition';

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
    if (isRef(props[key])) {
      const refVal = <Ref>props[key];
      ele[key] = refVal.value;
      watchEffect(() => (ele[key] = refVal.value));
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
    // 事件绑定
    if (formatKey.startsWith('on')) {
      // 事件监听
      const [, eventType] = key.toLowerCase().split('on');
      // 事件类型
      if (eventType) {
        if (isRef(value)) {
          const refVal = <Ref<EventListener>>value;
          if (value.value instanceof Function) {
            // 设置事件监听
            ele.addEventListener(eventType, refVal.value);
            // 初始监听
            const fn = refVal.value;
            // 订阅
            watchEffect(() => {
              ele.removeEventListener(eventType, fn);
              if (refVal.value instanceof Function) {
                ele.addEventListener(eventType, refVal.value);
              }
            });
          }
        } else if (value instanceof Function) {
          ele.addEventListener(eventType, value);
        }
      }
    } else if (specificAttrs.includes(key)) {
      if (isRef(value)) {
        const refVal = <Ref>value;
        if (refVal.value) {
          ele.setAttribute(key, '');
        } else {
          ele.removeAttribute(key);
        }
        watchEffect(() => {
          if (refVal.value) {
            ele.setAttribute(key, '');
          } else {
            ele.removeAttribute(key);
          }
        });
      } else {
        if (value) {
          ele.setAttribute(key, '');
        } else {
          ele.removeAttribute(key);
        }
      }
    } else if (key === 'ref') {
      if (isRef(value)) {
        const refVal = <Ref>value;
        refVal.value = ele;
      }
      if (value instanceof Function) {
        const refFn = <Function>value;
        refFn(ele);
      }
    } else {
      if (isRef(value)) {
        const refVal = <Ref>value;
        ele.setAttribute(key, refVal.value);
        watchEffect(() => {
          ele.setAttribute(key, refVal.value);
        });
      } else {
        ele.setAttribute(key, value);
      }
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
      if (isRef(props[key])) {
        const refVal = <Ref>props[key];
        ele[key] = refVal.value;
        watchEffect(() => {
          ele[key] = refVal.value;
        });
      } else {
        ele[key] = props[key];
      }
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
        if (isRef(value)) {
          const refVal = <Ref<EventListener>>value;
          if (refVal.value instanceof Function) {
            // 设置事件监听
            ele.addEventListener(eventType, refVal.value);
            // 初始监听
            const fn = refVal.value;
            // 订阅
            watchEffect(() => {
              ele.removeEventListener(eventType, fn);
              if (refVal.value instanceof Function) {
                ele.addEventListener(eventType, refVal.value);
              }
            });
          }
        } else if (value instanceof Function) {
          ele.addEventListener(eventType, value);
        }
      }
    } else if (specificAttrs.includes(key)) {
      if (isRef(value)) {
        const refVal = <Ref>value;
        if (refVal.value) {
          ele.setAttribute(key, '');
        } else {
          ele.removeAttribute(key);
        }
        watchEffect(() => {
          if (refVal.value) {
            ele.setAttribute(key, '');
          } else {
            ele.removeAttribute(key);
          }
        });
      } else if (key === 'ref') {
        if (isRef(value)) {
          const refVal = <Ref>value;
          refVal.value = ele;
        }
        if (value instanceof Function) {
          const refFn = <Function>value;
          refFn(ele);
        }
      } else {
        if (value) {
          ele.setAttribute(key, '');
        } else {
          ele.removeAttribute(key);
        }
      }
    } else {
      if (isRef(value)) {
        const refVal = <Ref>value;
        ele.setAttribute(key, refVal.value);
        watchEffect(() => {
          ele.setAttribute(key, refVal.value);
        });
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
  }
  return ele;
}

/**
 * @description 创建文字节点
 * @param text
 * @returns
 */
function createTextNode(text: any) {
  // ref
  if (isRef(text)) {
    // ref
    const refVal = <Ref>text;
    // 元素
    const ele = document.createTextNode(refVal.value);
    // 订阅变化
    watchEffect(() => {
      ele.data = refVal.value;
    });
    return ele;
  }
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
  parent: Document | Element = document,
  timeout?: number
) {
  return new Promise<T[]>((resolve) => {
    const timer = setInterval(() => {
      const selectors = Array.from(parent.querySelectorAll<T>(selector));
      // 存在元素
      if (selectors.length) {
        clearInterval(timer);
        resolve(selectors);
      }
    }, 10);
    // 超时
    if (timeout) {
      setTimeout(() => {
        clearInterval(timer);
        resolve([]);
      }, timeout);
    }
  });
}

export { createElementNode, createNSElementNode, createTextNode, $$, $_ };
