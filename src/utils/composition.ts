// 订阅
const subscription = new WeakMap<
  object,
  Set<(newVal: any, oldVal: any) => any>
>();

// 当前订阅
let currentSub: ((newVal: any, oldVal: any) => any) | undefined;

/**
 * @description 收集依赖
 * @param target
 * @param key
 */
const track = (target: object) => {
  // 当前订阅
  if (!currentSub) {
    return;
  }
  // target 订阅列表
  let subList = subscription.get(target);
  // 不存在订阅列表
  if (!subList) {
    subList = new Set();
    subscription.set(target, subList);
  }
  subList.add(currentSub);
};

/**
 * @description 通知订阅
 * @param terget
 * @param key
 * @returns
 */
function trigger(target: object, newVal: any, oldVal: any) {
  // target 订阅列表
  const subList = subscription.get(target);
  if (!subList) {
    return;
  }
  // target 订阅
  if (subList) {
    // 通知订阅
    for (const fn of subList) {
      if (fn instanceof Function) {
        fn(newVal, oldVal);
      }
    }
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
  readonly _shallow: boolean = false;
  readonly _isRef: boolean = true;
  _value: T;
  value: T;
  constructor(val: T, shallow: boolean = false) {
    const _this = this;
    this._shallow = shallow;
    if (val instanceof Object && shallow) {
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
        track(this);
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
          trigger(this, newVal, oldVal);
        }
      },
    });
  }
}

/**
 * @description 脱除 ref
 */
type UnwrapRef<T> = T extends Ref<infer P> ? P : T;

/**
 * @description 数组脱除 ref
 */
type UnwrapRefArray<T> = T extends [infer K, ...infer P]
  ? P extends Ref[]
    ? [UnwrapRef<K>, ...UnwrapRefArray<P>]
    : [UnwrapRef<K>]
  : [];

/**
 * @description ref
 * @param v
 * @returns
 */
const isRef = <T>(v: Ref<T> | unknown): v is Ref<T> => {
  return v && v[ReactiveFlags.IS_REF];
};

/**
 * @description 浅层 shallow
 * @param v
 * @returns
 */
const isShallow = (v: unknown) => {
  return v && v[ReactiveFlags.IS_SHALLOW];
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
const unref = <T>(val: T | Ref<T>) => {
  return isRef(val) ? val.value : val;
};

/**
 * @description 顶层 ref
 * @param v
 * @returns
 */
const ref = <T>(value: T): Ref<UnwrapRef<T>> => {
  return isRef<UnwrapRef<T>>(value)
    ? value
    : createRef(<UnwrapRef<T>>value, false);
};

/**
 * @description ref
 * @param value
 * @returns
 */
const shallowRef = <T>(value: T): Ref<UnwrapRef<T>> => {
  return isRef<UnwrapRef<T>>(value)
    ? value
    : createRef(<UnwrapRef<T>>value, true);
};

/**
 * @description 响应式
 */
type Reactive<T> = {
  _isReactive: boolean;
  _isReadonly: boolean;
} & {
  [P in keyof T]: T[P];
};

/**
 * @description 只读键
 * @param key
 * @returns
 */
const isReadonlyKey = (key: any) => {
  return ![
    ReactiveFlags.IS_REF,
    ReactiveFlags.IS_SHALLOW,
    ReactiveFlags.IS_REACTIVE,
    ReactiveFlags.IS_READONLY,
  ].includes(key);
};

/**
 * @description 创建处理 reactive
 * @param isReadonly
 * @returns
 */
const createReactiveHandlers = (isReadonly: boolean, isShallow: boolean) => {
  return {
    get: createGetters(isReadonly, isShallow),
    set: createSetters(isShallow),
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
    // 结果
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 收集依赖
      track(receiver);
    }
    if (isShallow) {
      return res;
    }
    if (isRef(res)) {
      return res.value;
    }
    if (res instanceof Object) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
};

/**
 * @description setters
 * @param shallow
 * @returns
 */
const createSetters = (shallow: boolean) => {
  return function set(target, key, newVal, receiver) {
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
    // 数据变化
    if (oldVal !== newVal) {
      // 通知依赖
      trigger(receiver, newVal, oldVal);
    }
    return res;
  };
};

/**
 * @description reactive object
 */
const createReactiveObj = <T extends object>(
  target: T,
  isReadonly: boolean,
  shallow: boolean
) => {
  return <Reactive<T>>(
    new Proxy(target, createReactiveHandlers(isReadonly, shallow))
  );
};

/**
 * @description reactive
 * @param val
 * @returns
 */
const isReactive = (val: unknown): val is object => {
  return val && val[ReactiveFlags.IS_REACTIVE];
};

/**
 * @description 创建 reactive
 * @param target
 * @returns
 */
const createReactive = <T extends object>(target: T): T => {
  return createReactiveObj(target, false, true);
};

/**
 * @description 顶层 reactive
 * @param target
 * @returns
 */
const shallowReactive = <T extends object>(target: T) => {
  return createReactiveObj(target, false, false);
};

/**
 * @description reactive
 * @param val
 * @returns
 */
const isReadonly = (val: unknown): val is object => {
  return val && val[ReactiveFlags.IS_READONLY];
};

/**
 * @description 创建 readonly
 * @param target
 * @returns
 */
const createReadonly = <T extends object>(target: T): T => {
  return createReactiveObj(target, true, true);
};

/**
 * @description 顶层 readonly
 * @param target
 * @returns
 */
const shallowReadonly = <T extends object>(target: T) => {
  return createReactiveObj(target, true, false);
};

/**
 * @description proxy
 * @param val
 * @returns
 */
const isProxy = (val: unknown): val is object => {
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
const watch = <T extends object>(
  source: T,
  callback: (
    newValue: T extends Ref ? UnwrapRef<T> : T,
    oldValue: T extends Ref ? UnwrapRef<T> : T
  ) => void
) => {
  // target 订阅列表
  let subList = subscription.get(source);
  if (!subList) {
    subList = new Set();
    subscription.set(source, subList);
  }
  // 添加订阅
  subList.add(callback);

  // Proxy
  if (isProxy(source)) {
    for (const key in source) {
      const subSource = source[key];
      if (isProxy(subSource)) {
        watch(subSource, () => {
          callback(<any>source, <any>source);
        });
      }
    }
  }
  // shallow Ref
  if (isRef(source) && isProxy(source.value)) {
    watch(source.value, () => {
      callback(<any>source, <any>source);
    });
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
const watchEffectRef = <T extends Ref, P>(
  refVal: T,
  callback: (val: UnwrapRef<T>) => P
) => {
  if (isRef(refVal)) {
    // 影响
    const effect = ref(callback(refVal.value));
    // 监听
    watchEffect(() => (effect.value = <UnwrapRef<P>>callback(refVal.value)));
    return effect;
  }
};

/**
 * @description 监听影响 refs
 * @param refVal
 * @param callback
 * @returns
 */
const watchEffectRefs = <T extends Ref[], P>(
  refVal: T,
  callback: (val: UnwrapRefArray<T>) => P
) => {
  if (Array.isArray(refVal)) {
    // 影响
    const effect = ref(
      callback(<UnwrapRefArray<T>>refVal.map((v) => unref(v)))
    );
    refVal.forEach((ref) => {
      watch(
        ref,
        () =>
          (effect.value = <UnwrapRef<P>>(
            callback(<UnwrapRefArray<T>>refVal.map((v) => unref(v)))
          ))
      );
    });
    return effect;
  }
};

export {
  Ref,
  ref,
  shallowRef,
  unref,
  isRef,
  watch,
  watchEffectRef,
  watchEffectRefs,
  watchEffect,
  reactive,
  shallowReactive,
  isReactive,
  readonly,
  shallowReadonly,
  isReadonly,
  isProxy,
};
