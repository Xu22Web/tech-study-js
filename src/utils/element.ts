import { isRef, ref, Ref, watch, watchEffect, watchRef } from './composition';

type BaseEleChild = Ele<HTMLElement | SVGElement | Text | Comment>;

// 子元素
type EleChild = BaseEleChild | EleChildPromise | undefined;

// 异步子元素
type EleChildPromise = Promise<BaseEleChild | undefined>;

// 子元素集合
type EleChildren = (
  | BaseEleChild
  | EleChildPromise
  | Ref<BaseEleChild | EleChildPromise | undefined>
)[];

// 异步子元素
type EleChildrenPromise = Promise<BaseEleChild[] | undefined>;

// 子元素
type EleChildenRef = Ref<BaseEleChild[] | EleChildrenPromise | undefined>;

/**
 * @description 元素创建配置
 */
type EleCreateOptions = {
  beforeCreat?: () => void;
  onCreated?: () => void;
};

/**
 * @description 元素挂载配置
 */
type EleMountOptions = {
  beforeMount?: () => void;
  onMounted?: () => void;
};

/**
 * @description 事件配置
 */
type EleEventOptions = EleCreateOptions & EleMountOptions;

/**
 * @description 元素
 */
type Ele<T extends HTMLElement | SVGElement | Text | Comment> =
  EleEventOptions & {
    ele: T;
  };

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
  children?: EleChild | EleChildenRef | EleChildren,
  options?: EleEventOptions
): Ele<HTMLElementTagNameMap[T]> {
  // 挂载状态
  let beforemount = ref(false);
  // 挂载状态
  let mounted = ref(false);
  const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
  // 订阅
  const subscribe = (e: EleMountOptions) => {
    const { onMounted, beforeMount } = e;
    if (beforeMount) {
      watch(
        beforemount,
        () => {
          if (beforemount.value) {
            beforeMount();
            return;
          }
        },
        true
      );
    }
    if (onMounted) {
      watch(
        mounted,
        () => {
          if (mounted.value) {
            onMounted();
            return;
          }
        },
        true
      );
    }
  };
  // 取消订阅
  const unsubscribe = (e: EleMountOptions) => {
    //懒得写
  };
  // 创建元素前
  beforeCreat && beforeCreat();
  // 创建普通元素
  const ele = document.createElement(tagName);
  // 处理属性
  handleProps(ele, props);
  // 处理属性
  handleAttributes(ele, attrs, subscribe, unsubscribe);
  // 处理子元素
  handleChildren(ele, children, subscribe, unsubscribe);
  // 收集挂载前
  const collectBeforeMount = () => {
    beforemount.value = true;
    beforeMount && beforeMount();
  };
  // 收集挂载
  const collectOnMounted = () => {
    mounted.value = true;
    onMounted && onMounted();
  };

  // 创建元素后
  onCreated && onCreated();
  return { ele, beforeMount: collectBeforeMount, onMounted: collectOnMounted };
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
  children?: EleChild | EleChildenRef | EleChildren,
  options?: EleEventOptions
): Ele<SVGElementTagNameMap[T]> {
  // 挂载状态
  let beforemount = ref(false);
  // 挂载状态
  let mounted = ref(false);
  const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
  // 订阅
  const subscribe = (e: EleMountOptions) => {
    const { onMounted, beforeMount } = e;
    if (beforeMount) {
      watch(
        beforemount,
        () => {
          if (beforemount.value) {
            beforeMount();
            return;
          }
        },
        true
      );
    }
    if (onMounted) {
      watch(
        mounted,
        () => {
          if (mounted.value) {
            onMounted();
            return;
          }
        },
        true
      );
    }
  };
  // 取消订阅
  const unsubscribe = (e: EleMountOptions) => {
    //懒得写
  };
  // 创建元素前
  beforeCreat && beforeCreat();
  // svg元素命名空间
  const ns = 'http://www.w3.org/2000/svg';
  // 创建svg元素
  const ele = document.createElementNS(ns, tagName);
  // 处理属性
  handleProps(ele, props);
  // 处理属性
  handleAttributes(ele, attrs, subscribe, unsubscribe);
  // 处理子元素
  handleChildren(ele, children, subscribe, unsubscribe);
  // 收集挂载前
  const collectBeforeMount = () => {
    beforemount.value = true;
    beforeMount && beforeMount();
  };
  // 收集挂载
  const collectOnMounted = () => {
    mounted.value = true;
    onMounted && onMounted();
  };

  // 创建元素后
  onCreated && onCreated();
  return { ele, beforeMount: collectBeforeMount, onMounted: collectOnMounted };
}

/**
 * @description 处理属性
 * @param ele
 * @param props
 */
function handleProps(
  ele: HTMLElement | SVGElement,
  props?: { [key: string]: any }
) {
  // props属性设置
  for (const key in props) {
    // Ref 属性
    if (isRef(props[key])) {
      const refVal = <Ref>props[key];
      watchEffect(() => (ele[key] = refVal.value));
      continue;
    }
    ele[key] = props[key];
  }
}

/**
 * @description 处理svg属性
 * @param ele
 * @param attrs
 */
function handleAttributes(
  ele: HTMLElement | SVGElement,
  attrs?: { [key: string]: any },
  subscribe?: (e: EleMountOptions) => void,
  unsubscribe?: (e: EleMountOptions) => void
) {
  // 属性存在
  if (attrs) {
    // attrs属性设置
    for (const key in attrs) {
      // 处理普通属性
      handleAttribute(ele, key, attrs[key], subscribe, unsubscribe);
    }
  }
}

/**
 * @description 处理事件选项
 */
function handleEventOptions(option: string[]) {
  if (option.length) {
    const options: AddEventListenerOptions = {
      capture: option.includes('capture'),
      once: option.includes('once'),
      passive: option.includes('passive'),
    };
    return options;
  }
}

/**
 * @description 处理属性
 * @param ele
 * @param key
 * @param value
 */
function handleAttribute(
  ele: HTMLElement | SVGElement,
  key: string,
  value: any,
  subscribe?: (e: EleMountOptions) => void,
  unsubscribe?: (e: EleMountOptions) => void
) {
  // 处理完的key
  const formatKey = key.toLowerCase();
  // 事件绑定
  if (formatKey.startsWith('on')) {
    // 事件监听
    const [event] = formatKey.match(/(?<=on).*/)!;
    // 事件类型
    if (event) {
      const [eventType, ...option] = event.split('_');
      const options = handleEventOptions(option);
      // Ref 函数
      if (isRef(value)) {
        const refVal = <Ref<EventListener>>value;
        const refListener = watchRef(refVal, () =>
          refVal.value
            ? (e) => {
                option.includes('prevent') && e.preventDefault();
                option.includes('stop') && e.stopPropagation();
                const callback = refVal.value;
                callback(e);
              }
            : undefined
        );
        // 设置事件监听
        refListener.value &&
          ele.addEventListener(eventType, refListener.value, options);
        // 监听事件变化
        watch(refListener, (newVal, oldVal) => {
          // 移除旧事件监听
          oldVal && ele.removeEventListener(eventType, oldVal);
          // 设置新事件监听
          newVal && ele.addEventListener(eventType, newVal, options);
        });
        return;
      }
      // 普通函数
      if (value instanceof Function) {
        // 设置事件监听
        ele.addEventListener(eventType, value, options);
      }
    }
    return;
  }
  // 特殊属性
  const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
  // 特殊 key
  if (specificAttrs.includes(formatKey)) {
    // Ref
    if (isRef(value)) {
      const refVal = <Ref>value;
      watchEffect(() => {
        if (refVal.value) {
          ele.setAttribute(formatKey, '');
        } else {
          ele.removeAttribute(formatKey);
        }
      });
      return;
    }
    // 普通属性值
    if (value) {
      ele.setAttribute(formatKey, '');
    } else {
      ele.removeAttribute(formatKey);
    }
    return;
  }
  // ref 属性名
  if (key === 'ref') {
    // Ref
    if (isRef(value)) {
      const refVal = <Ref>value;
      subscribe &&
        subscribe({
          onMounted() {
            refVal.value = ele;
          },
        });
      return;
    }
    // Ref 函数
    if (value instanceof Function) {
      const refFn = <Function>value;
      subscribe &&
        subscribe({
          onMounted() {
            refFn(ele);
          },
        });
      return;
    }
    return;
  }
  // xlink命名空间
  if (key.startsWith('xlink:')) {
    // xlink属性命名空间
    const attrNS = 'http://www.w3.org/1999/xlink';
    if (value) {
      ele.setAttributeNS(attrNS, key, value);
    } else {
      ele.removeAttributeNS(attrNS, key);
    }
    return;
  }
  // Ref 属性值
  if (key && isRef(value)) {
    const refVal = <Ref>value;
    // 监听影响
    watchEffect(() => {
      ele.setAttribute(key, refVal.value);
    });
    return;
  }
  // 普通属性
  if (key) {
    // 普通属性
    ele.setAttribute(key, value);
  }
}

/**
 * @description 处理子元素
 * @param ele
 * @param children
 */
function handleChildren(
  ele: HTMLElement | SVGElement,
  children?: EleChild | EleChildenRef | EleChildren,
  subscribe?: (e: EleMountOptions) => void,
  unsubscribe?: (e: EleMountOptions) => void
) {
  // Ref
  if (isRef(children)) {
    // 注释元素
    const comment = document.createComment('');
    // 监听元素变化
    watch(children, async (newEle, oldEle) => {
      if (!newEle && oldEle) {
        // Promise
        if (oldEle instanceof Promise) {
          const oldEleRes = await oldEle;
          if (oldEleRes) {
            oldEleRes.forEach((ele) => {
              unsubscribe && unsubscribe(ele);
            });
          }
        }
        // unPromise
        if (!(oldEle instanceof Promise)) {
          oldEle.forEach((ele) => {
            unsubscribe && unsubscribe(ele);
          });
        }
        ele.replaceChildren(comment);
        return;
      }
      if (newEle) {
        if (oldEle) {
          // Promise
          if (oldEle instanceof Promise) {
            const oldEleRes = await oldEle;
            if (oldEleRes) {
              oldEleRes.forEach((ele) => {
                unsubscribe && unsubscribe(ele);
              });
            }
          }
          // unPromise
          if (!(oldEle instanceof Promise)) {
            oldEle.forEach((ele) => {
              unsubscribe && unsubscribe(ele);
            });
          }
        }
        // Promise
        if (newEle instanceof Promise) {
          const newEleRes = await newEle;
          if (newEleRes) {
            const eles = newEleRes.map((v) => {
              if (v.beforeMount || v.onMounted) {
                subscribe && subscribe(v);
              }
              return v.ele;
            });
            ele.replaceChildren(createElementBlock(eles));
          }
          return;
        }
        // unPromise
        const eles = newEle.map((v) => {
          if (v.beforeMount || v.onMounted) {
            subscribe && subscribe(v);
          }
          return v.ele;
        });
        ele.replaceChildren(createElementBlock(eles));
        return;
      }
    });
    // Promise
    if (children.value instanceof Promise) {
      // 插入注释元素
      ele.appendChild(comment);
      children.value.then((childrenEle) => {
        if (childrenEle) {
          const eles = childrenEle.map((v) => {
            if (v.beforeMount || v.onMounted) {
              subscribe && subscribe(v);
            }
            return v.ele;
          });
          ele.replaceChildren(createElementBlock(eles));
        }
      });
      return;
    }
    // unPromise
    if (children.value) {
      const eles = children.value.map((v) => {
        if (v.beforeMount || v.onMounted) {
          subscribe && subscribe(v);
        }
        return v.ele;
      });
      ele.appendChild(createElementBlock(eles));
      return;
    }
    // 插入元素
    ele.appendChild(comment);
    return;
  }
  // Promise
  if (children instanceof Promise) {
    // 注释元素
    const comment = document.createComment('');
    // 插入注释元素
    ele.appendChild(comment);
    // 异步替换元素
    children.then((childEle) => {
      if (childEle) {
        const { beforeMount, onMounted } = childEle;
        if (beforeMount || onMounted) {
          subscribe && subscribe(childEle);
        }
        comment.replaceWith(childEle.ele);
      }
    });
    return;
  }
  // Array
  if (Array.isArray(children)) {
    // 处理过后
    const resChildren: BaseEleChild[] = [];
    for (const i in children) {
      const child = children[i];
      // Ref
      if (isRef(child)) {
        // 注释
        const comment = document.createComment('');
        // 监听影响
        watch(child, async (newEle, oldEle) => {
          // 新元素为空
          if (!newEle && oldEle) {
            // Promise
            if (oldEle instanceof Promise) {
              const oldEleRes = await oldEle;
              if (oldEleRes) {
                handleChangeElement(
                  newEle,
                  oldEleRes,
                  comment,
                  subscribe,
                  unsubscribe
                );
              }
              return;
            }
            handleChangeElement(
              newEle,
              oldEle,
              comment,
              subscribe,
              unsubscribe
            );
            return;
          }
          // 旧元素为空
          if (newEle && !oldEle) {
            // Promise
            if (newEle instanceof Promise) {
              const newEleRes = await newEle;
              if (newEleRes) {
                handleChangeElement(
                  newEleRes,
                  oldEle,
                  comment,
                  subscribe,
                  unsubscribe
                );
              }
              return;
            }
            handleChangeElement(
              newEle,
              oldEle,
              comment,
              subscribe,
              unsubscribe
            );
            return;
          }
          // 存在
          if (newEle && oldEle) {
            // Promise
            if (newEle instanceof Promise && oldEle instanceof Promise) {
              const newEleRes = await newEle;
              const oldEleRes = await oldEle;
              // 处理元素变化
              handleChangeElement(
                newEleRes,
                oldEleRes,
                comment,
                subscribe,
                unsubscribe
              );
              return;
            }
            // Promise
            if (newEle instanceof Promise && !(oldEle instanceof Promise)) {
              const newEleRes = await newEle;
              // 处理元素变化
              handleChangeElement(
                newEleRes,
                oldEle,
                comment,
                subscribe,
                unsubscribe
              );
              return;
            }
            // Promise
            if (!(newEle instanceof Promise) && oldEle instanceof Promise) {
              const oldEleRes = await oldEle;
              // 处理元素变化
              handleChangeElement(
                newEle,
                oldEleRes,
                comment,
                subscribe,
                unsubscribe
              );
              return;
            }
            // 非 Promise
            if (!(oldEle instanceof Promise) && !(newEle instanceof Promise)) {
              // 处理元素变化
              handleChangeElement(
                newEle,
                oldEle,
                comment,
                subscribe,
                unsubscribe
              );
              return;
            }
          }
        });
        // Promise
        if (child.value instanceof Promise) {
          // 注释
          resChildren[i] = { ele: comment };
          // 异步替换
          child.value.then((childEle) => {
            if (childEle) {
              const { beforeMount, onMounted } = childEle;
              if (beforeMount || onMounted) {
                subscribe && subscribe(childEle);
              }
              comment.replaceWith(childEle.ele);
            }
          });
          continue;
        }
        // unPromise
        if (child.value) {
          const { beforeMount, onMounted, ele } = child.value;
          resChildren[i] = { ele, beforeMount, onMounted };
          continue;
        }
        resChildren[i] = { ele: comment };
        continue;
      }
      // Promise
      if (child instanceof Promise) {
        // 注释
        const comment = document.createComment('');
        resChildren[i] = { ele: comment };
        // 异步替换元素
        child.then((childEle) => {
          if (childEle) {
            const { beforeMount, onMounted } = childEle;
            if (beforeMount || onMounted) {
              subscribe && subscribe(childEle);
            }
            comment.replaceWith(childEle.ele);
          }
        });
        continue;
      }
      // 普通元素
      if (child) {
        const { beforeMount, onMounted, ele } = child;
        resChildren[i] = { ele, beforeMount, onMounted };
      }
    }
    const eles = resChildren.map((v) => {
      if (v.beforeMount || v.onMounted) {
        subscribe && subscribe(v);
      }
      return v.ele;
    });
    // 插入元素
    ele.appendChild(createElementBlock(eles));
    return;
  }
  // 普通元素
  if (children) {
    const { beforeMount, onMounted } = children;
    if (beforeMount || onMounted) {
      subscribe && subscribe(children);
    }
    // 插入元素
    ele.appendChild(children.ele);
    return;
  }
  return;
}

/**
 * @description 元素变化
 * @param newEle
 * @param oldEle
 * @param comment
 */
function handleChangeElement(
  newEle: BaseEleChild | undefined,
  oldEle: BaseEleChild | undefined,
  comment: Comment,
  subscribe?: (e: Ele<HTMLElement | SVGElement | Text | Comment>) => void,
  unsubscribe?: (e: Ele<HTMLElement | SVGElement | Text | Comment>) => void
) {
  if (newEle && oldEle) {
    const { beforeMount, onMounted } = newEle;
    if (beforeMount || onMounted) {
      subscribe && subscribe(newEle);
    }
    oldEle.ele.replaceWith(newEle.ele);

    return;
  }
  if (newEle && !oldEle) {
    const { beforeMount, onMounted } = newEle;
    if (beforeMount || onMounted) {
      subscribe && subscribe(newEle);
    }
    comment.replaceWith(newEle.ele);
    return;
  }
  if (!newEle && oldEle) {
    unsubscribe && unsubscribe(oldEle);
    oldEle.ele.replaceWith(comment);
    return;
  }
}

/**
 * @description 创建文字节点
 * @param text
 * @returns
 */
function createTextNode(text: any, options?: EleEventOptions): Ele<Text> {
  const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
  // 创建元素前
  beforeCreat && beforeCreat();
  // Ref
  if (isRef(text)) {
    // ref
    const refVal = <Ref>text;
    // 元素
    const ele = document.createTextNode('');
    // 订阅变化
    watchEffect(() => {
      ele.data = refVal.value;
    });
    // 创建元素后
    onCreated && onCreated();
    return { ele, beforeMount, onMounted };
  }
  // 创建元素后
  onCreated && onCreated();
  return { ele: document.createTextNode(String(text)), beforeMount, onMounted };
}

/**
 * @description 挂载元素
 * @param eleOptions
 * @param parent
 */
function mountElement<T extends HTMLElement | SVGElement | Text | Comment>(
  eleOptions: Ele<T>,
  parent: HTMLElement | SVGElement = document.body
) {
  const { ele, beforeMount, onMounted } = eleOptions;
  if (ele) {
    // 触发挂载前事件
    beforeMount && beforeMount();
    parent.appendChild(ele);
    // 挂在后
    onMounted && onMounted();
  }
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

/**
 * @description 创建元素块
 * @param eles
 * @returns
 */
function createElementBlock(
  eles: (HTMLElement | SVGElement | Text | Comment)[]
) {
  const fragment = document.createDocumentFragment();
  for (const i in eles) {
    fragment.appendChild(eles[i]);
  }
  return fragment;
}

export {
  createElementNode,
  createNSElementNode,
  createTextNode,
  $$,
  $_,
  createElementBlock,
  mountElement,
  Ele,
};
