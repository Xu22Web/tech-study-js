// 当前订阅
let currentSub: ((newVal?: any, oldVal?: any) => any) | undefined;

// 订阅
const subscription = new WeakMap<
  object,
  Map<string, Set<(newVal: any, oldVal: any) => any>>
>();

/**
 * @description Proxy Map
 */
const proxyMap = new WeakMap<object, object>();

/**
 * @description 收集 Ref 依赖
 * @param target
 * @param key
 */
const trackRef = (target: object) => {
  // 当前订阅
  if (!currentSub) {
    return;
  }
  // target 订阅列表
  let subList = subscription.get(target);
  // 不存在订阅列表
  if (!subList) {
    subList = new Map();
    // 键订阅
    const subkeyList = new Set<(newVal: any, oldVal: any) => any>();
    // 添加订阅
    subkeyList.add(currentSub);
    subList.set('value', subkeyList);
    subscription.set(target, subList);
    return;
  }
  // 键订阅
  let subkeyList = subList.get('value');
  if (!subkeyList) {
    // 键订阅
    subkeyList = new Set<(newVal: any, oldVal: any) => any>();
    // 添加订阅
    subkeyList.add(currentSub);
    subList.set('value', subkeyList);
    subscription.set(target, subList);
    return;
  }
  // 添加订阅
  subkeyList.add(currentSub);
};

/**
 * @description 通知 Ref 订阅
 * @param terget
 * @param key
 * @returns
 */
function triggerRef(target: object, newVal: any, oldVal: any) {
  // target 订阅列表
  const subList = subscription.get(target);
  if (!subList) {
    return;
  }
  // 键订阅
  let subkeyList = subList.get('value');
  if (!subkeyList) {
    return;
  }
  // 通知订阅
  for (const fn of subkeyList) {
    if (fn instanceof Function) {
      fn(newVal, oldVal);
    }
  }
}

/**
 * @description 收集依赖
 * @param target
 * @param key
 */
const track = (target: object, key: string) => {
  // 当前订阅
  if (!currentSub) {
    return;
  }
  // proxy
  const proxyTarget = proxyMap.get(target);
  if (!proxyTarget) {
    return;
  }
  // target 订阅列表
  let subList = subscription.get(target);
  // 不存在订阅列表
  if (!subList) {
    subList = new Map();
    // 键订阅
    const subkeyList = new Set<(newVal: any, oldVal: any) => any>();
    // 添加订阅
    subkeyList.add(currentSub);
    subList.set(key, subkeyList);
    subscription.set(target, subList);
    return;
  }
  // 键订阅
  let subkeyList = subList.get(key);
  if (!subkeyList) {
    // 键订阅
    subkeyList = new Set<(newVal: any, oldVal: any) => any>();
    // 添加订阅
    subkeyList.add(currentSub);
    subList.set(key, subkeyList);
    subscription.set(target, subList);
    return;
  }
  // 添加订阅
  subkeyList.add(currentSub);
};

/**
 * @description 通知订阅
 * @param terget
 * @param key
 * @returns
 */
function trigger(target: object, key: string, newVal: any, oldVal: any) {
  // proxy
  const proxyTarget = proxyMap.get(target);
  if (!proxyTarget) {
    return;
  }
  // proxyTarget 订阅列表
  const subList = subscription.get(target);
  if (!subList) {
    return;
  }
  // 键订阅
  let subkeyList = subList.get(key);
  if (!subkeyList) {
    return;
  }
  // 通知订阅
  for (const fn of subkeyList) {
    fn(newVal, oldVal);
  }
}

/**
 * @description 只读键
 */
enum ReactiveFlags {
  IS_REF = '_isRef',
  IS_SHALLOW = '_isShallow',
  IS_REACTIVE = '_isReactive',
  IS_READONLY = '_isReadonly',
}

/**
 * @description Ref
 */
class Ref<T = any> {
  readonly _isShallow: boolean = false;
  readonly _isRef: boolean = true;
  _value: T;
  value: T;
  constructor(val: T, shallow: boolean = false) {
    const _this = this;
    this._isShallow = shallow;
    if (val && typeof val === 'object' && shallow) {
      const reactiveVal = reactive(val);
      this._value = reactiveVal;
      this.value = reactiveVal;
    } else {
      this._value = val;
      this.value = val;
    }
    // 定义属性
    Object.defineProperty(this, 'value', {
      get() {
        // 收集依赖
        trackRef(this);
        return _this._value;
      },
      set(newVal: any) {
        // 旧数据
        const oldVal = this._value;
        // 数据变化
        if (oldVal !== newVal) {
          // 设置新数据值
          _this._value = newVal;
          // 通知依赖
          triggerRef(this, newVal, oldVal);
        }
      },
    });
  }
  toJSON() {
    return this._value;
  }
}

/**
 * @description 脱除 ref
 */
type UnwrapRef<T> = T extends Ref<infer P> ? P : T;

/**
 * @description 数组脱除 ref
 */
type UnwrapRefArray<T> = T extends Ref<infer K>[]
  ? K[]
  : T extends [infer K, ...infer P]
  ? P extends Ref[]
    ? [UnwrapRef<K>, ...UnwrapRefArray<P>]
    : [UnwrapRef<K>]
  : [];

/**
 * @description ref
 * @param v
 * @returns
 */
const isRef = <T = any>(v: Ref<T> | unknown): v is Ref<T> => {
  return !!(v && v[ReactiveFlags.IS_REF]);
};

/**
 * @description 浅层 shallow
 * @param v
 * @returns
 */
const isShallow = (v: unknown) => {
  return !!(v && v[ReactiveFlags.IS_SHALLOW]);
};

/**
 * @description 创建 ref
 * @param v
 * @returns
 */
const createRef = <T>(rawVal: T, shallow: boolean) => {
  return new Ref(rawVal, shallow);
};

/**
 * @description 解除 ref
 * @param val
 * @returns
 */
const unref = <T>(val: T) => {
  return <UnwrapRef<T>>(isRef(val) ? val.value : val);
};

/**
 * @description 顶层 ref
 * @param v
 * @returns
 */
const ref = <T>(value: T): Ref<UnwrapRef<T>> => {
  return isRef<UnwrapRef<T>>(value)
    ? value
    : createRef(<UnwrapRef<T>>value, true);
};

/**
 * @description ref
 * @param value
 * @returns
 */
const shallowRef = <T>(value: T): Ref<UnwrapRef<T>> => {
  return isRef<UnwrapRef<T>>(value)
    ? value
    : createRef(<UnwrapRef<T>>value, false);
};

/**
 * @description 创建处理 reactive
 * @param isReadonly
 * @param isShallow
 * @returns
 */
const createReactiveHandlers = (isReadonly: boolean, isShallow: boolean) => {
  return {
    get: createGetters(isReadonly, isShallow),
    set: createSetters(isReadonly, isShallow),
  };
};

/**
 * @description getters
 * @param isReadonly
 * @param isShallow
 * @returns
 */
const createGetters = (isReadonly: boolean, isShallow: boolean) => {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow;
    }
    // 结果
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }
    if (isShallow) {
      return res;
    }
    if (isRef(res)) {
      return res.value;
    }
    if (res && typeof res === 'object') {
      if (res instanceof Element) {
        return res;
      }
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
};

/**
 * @description setters
 * @param readonly
 * @param shallow
 * @returns
 */
const createSetters = (readonly: boolean, shallow: boolean) => {
  return function set(target, key, newVal, receiver) {
    // 只读
    if (readonly) {
      return false;
    }
    // 旧值
    const oldVal = target[key];
    if (isReadonly(oldVal) && isRef(oldVal) && !isRef(newVal)) {
      return false;
    }
    if (!shallow) {
      if (isRef(oldVal) && !isRef(newVal)) {
        oldVal.value = newVal;
        return true;
      }
    }
    const res = Reflect.set(target, key, newVal, receiver);
    // length
    if (Array.isArray(target) && key === 'length') {
      // 通知依赖
      trigger(target, key, newVal, oldVal);
      return res;
    }
    // 数据变化
    if (oldVal !== newVal) {
      // 通知依赖
      trigger(target, key, newVal, oldVal);
    }
    return res;
  };
};

// 响应式
type Reactive<T extends object = object> = {
  _isReactive: boolean;
  _isReadonly: boolean;
} & T;

/**
 * @description reactive object
 */
const createReactiveObj = <T extends object>(
  target: T,
  isReadonly: boolean,
  shallow: boolean
) => {
  // 存在 Proxy
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return <Reactive<T>>existingProxy;
  }
  // 新建
  const proxy = new Proxy(target, createReactiveHandlers(isReadonly, shallow));
  proxyMap.set(target, proxy);
  return <Reactive<T>>proxy;
};

/**
 * @description reactive
 * @param val
 * @returns
 */
const isReactive = (val: unknown): val is boolean => {
  return !!(val && val[ReactiveFlags.IS_REACTIVE]);
};

/**
 * @description 创建 reactive
 * @param target
 * @returns
 */
const createReactive = <T extends object>(target: T): Reactive<T> => {
  return createReactiveObj(target, false, false);
};

/**
 * @description 顶层 reactive
 * @param target
 * @returns
 */
const shallowReactive = <T extends object>(target: T) => {
  return createReactiveObj(target, false, true);
};

/**
 * @description reactive
 * @param val
 * @returns
 */
const isReadonly = (val: unknown): val is object => {
  return !!(val && val[ReactiveFlags.IS_READONLY]);
};

/**
 * @description 创建 readonly
 * @param target
 * @returns
 */
const createReadonly = <T extends object>(target: T): T => {
  return createReactiveObj(target, true, false);
};

/**
 * @description 顶层 readonly
 * @param target
 * @returns
 */
const shallowReadonly = <T extends object>(target: T) => {
  return createReactiveObj(target, true, true);
};

/**
 * @description proxy
 * @param val
 * @returns
 */
const isProxy = (val: unknown): val is Reactive => {
  return isReactive(val) || isReadonly(val);
};

/**
 * @description reactive
 * @param target
 * @returns
 */
const reactive = <T extends object>(target: T) => {
  return createReactive(target);
};

/**
 * @description readonly
 * @param target
 * @returns
 */
const readonly = <T extends object>(target: T) => {
  return createReadonly(target);
};

/**
 * @description 监听数据变化
 * @param source
 * @param callback
 */
const watch = <T extends Ref | Reactive | Ref[] | (() => any)>(
  source: T,
  callback: (
    newValue: T extends Ref[]
      ? UnwrapRefArray<T>
      : T extends () => infer P
      ? P extends Ref[]
        ? UnwrapRefArray<P>
        : P
      : UnwrapRef<T>,
    oldValue: T extends Ref[]
      ? UnwrapRefArray<T>
      : T extends () => infer P
      ? P extends Ref[]
        ? UnwrapRefArray<P>
        : P
      : UnwrapRef<T>
  ) => void,
  immediate: boolean = false
) => {
  // 立刻执行
  immediate && callback(unref(<any>source), unref(<any>source));
  // array
  if (Array.isArray(source) && source.every((s) => isRef(s))) {
    for (const i in source) {
      // Proxy
      if (isProxy(source[i])) {
        watch(source[i], () => {
          const res = source.map((s) => unref(s));
          callback(<any>res, <any>res);
        });
      }
    }
    watch<() => any>(() => source.map((s) => unref(s)), callback);
    return;
  }
  // function
  if (source instanceof Function) {
    watch<Ref>(watchEffectRef(source), (n, o) => {
      callback(<any>unref(n), <any>unref(o));
    });
    return;
  }
  // Proxy
  if (isProxy(source)) {
    for (const key in source) {
      currentSub = () => {
        callback(<any>source, <any>source);
      };
      // sub source
      const subSource = source[key];
      currentSub = undefined;
      watch(subSource, () => {
        callback(<any>source, <any>source);
      });
    }
    return;
  }
  // Ref
  if (isRef(source)) {
    // Ref.value Proxy
    if (isProxy(source.value)) {
      watch(source.value, () => {
        callback(<any>unref(source), <any>unref(source));
      });
    }
    currentSub = callback;
    // 收集依赖
    trackRef(source);
    currentSub = undefined;
    return;
  }
};

/**
 * @description 监听数据变化影响
 * @param callback
 * @returns
 */
const watchEffect = (callback: () => any) => {
  currentSub = callback;
  // 收集依赖
  callback();
  currentSub = undefined;
};

/**
 * @description 监听影响 ref
 * @param refVal
 * @param callback
 * @returns
 */
const watchRef = <T extends Ref | Reactive | Ref[] | (() => any), P>(
  source: T,
  callback: () => P
) => {
  // 收集依赖
  const effectRes = shallowRef<P>(callback());
  // 监听
  watch(source, () => (effectRes.value = unref(callback())));
  return effectRes;
};

/**
 * @description 监听影响 ref
 * @param refVal
 * @param callback
 * @returns
 */
const watchEffectRef = <T>(callback: () => T) => {
  // 收集依赖
  const effectRes = shallowRef<T | undefined>(undefined);
  // 监听
  watchEffect(() => (effectRes.value = unref(callback())));
  return <Ref<UnwrapRef<T>>>effectRes;
};

export {
  Ref,
  ref,
  shallowRef,
  unref,
  isRef,
  watch,
  watchRef,
  watchEffectRef,
  watchEffect,
  reactive,
  shallowReactive,
  isReactive,
  readonly,
  shallowReadonly,
  isReadonly,
  isProxy,
  isShallow,
  Reactive,
};
