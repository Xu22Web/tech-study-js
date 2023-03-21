import {
  reactive,
  Ref,
  ref,
  shallowRef,
  watchEffectRef,
  watchRef,
  watch,
} from '../utils/composition';
import { createElementNode, createTextNode } from '../utils/element';
import { debounce } from '../utils/utils';

function Select<T>({
  data,
  maxlength,
  placeholder = '',
  onchange,
  onblur,
  value,
  keep,
}: {
  data: { label: string; value: T; selected?: boolean }[];
  maxlength?: number;
  placeholder?: string;
  onchange?: (data: { value: T; label: string }) => void;
  onblur?: (data: { value: T; label: string } | undefined) => void;
  value?: Ref<T>;
  keep?: boolean;
}) {
  const selectData = reactive<
    {
      label: string;
      value: T;
      selected: boolean;
      active: boolean;
      ele: HTMLElement | undefined;
    }[]
  >(
    data.map((v) => ({ selected: false, active: false, ele: undefined, ...v }))
  );
  const focus = ref(false);
  const input = shallowRef<HTMLInputElement | undefined>(undefined);
  const list = shallowRef<HTMLElement | undefined>(undefined);
  const valueRef = ref('');
  value &&
    watch(
      value,
      () => {
        const item = selectData.find((v) => v.value === value.value);
        valueRef.value = item ? item.label : '';
        if (!item) {
          selectData.forEach((v) => (v.selected = false));
          list.value && (list.value.scrollTop = 0);
        }
      },
      true
    );
  return createElementNode(
    'div',
    undefined,
    {
      class: 'egg_select',
    },
    [
      createElementNode(
        'input',
        { value: valueRef },
        {
          class: 'egg_select_input',
          type: 'text',
          placeholder,
          maxlength,
          ref: input,
          onfocus() {
            if (list.value && input.value) {
              focus.value = true;
              if (input.value.value && valueRef.value) {
                const index = selectData.findIndex(
                  (v) => v.label === valueRef.value
                );
                if (index + 1) {
                  list.value.scrollTop = selectData[index].ele?.offsetTop || 0;
                  selectData.forEach((v, i) => (v.selected = i === index));
                }
                return;
              }
            }
          },
          oninput() {
            if (list.value && input.value) {
              const { value } = input.value;
              // 文本存在
              if (value) {
                const index = selectData.findIndex((v) =>
                  v.label.includes(value)
                );
                // 存在匹配
                if (index + 1) {
                  list.value.scrollTop = selectData[index].ele?.offsetTop || 0;
                  selectData.forEach((v, i) => {
                    v.active = i === index;
                    v.active &&
                      setTimeout(() => {
                        v.active = false;
                      }, 300);
                  });
                }
                return;
              }
              // 清除
              selectData.forEach((v) => (v.active = v.selected = false));
              list.value.scrollTop = 0;
            }
          },
          onblur() {
            if (list.value && input.value) {
              const item = selectData.find((v) => v.selected);
              // 关闭选项
              if (item || !input.value.value) {
                setTimeout(() => {
                  focus.value = false;
                }, 100);
              }
              // 恢复文本
              if (item && input.value.value !== item.label) {
                input.value.value = item.label;
              }
              // 保留文本
              if (!item && keep) {
                input.value.value = valueRef.value;
              }
              onblur &&
                onblur(
                  item ? { label: item.label, value: item.value } : undefined
                );
            }
          },
        }
      ),
      createElementNode(
        'div',
        undefined,
        {
          class: watchEffectRef(
            () => `egg_select_list${focus.value ? '' : ' hide'}`
          ),
          ref: list,
        },
        selectData.map((v, index) =>
          createElementNode(
            'div',
            undefined,
            {
              class: watchRef(
                () => [v.selected, v.active],
                () =>
                  `egg_select_item${
                    v.selected ? ' selected' : v.active ? ' active' : ''
                  }`
              ),
              ref: (e) => (v.ele = e),
              onclick: debounce(() => {
                if (valueRef.value !== v.label) {
                  onchange && onchange({ label: v.label, value: v.value });
                  selectData.forEach((v, i) => {
                    v.selected = i === index;
                    v.selected && (valueRef.value = v.label);
                  });
                }
                focus.value = false;
              }, 300),
            },
            createTextNode(v.label)
          )
        )
      ),
    ]
  );
}

export { Select };
