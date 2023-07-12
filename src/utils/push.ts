import { pushPlus } from '../api/push';
import { formatDateTime } from './time';
/**
 * @description 消息模板类型
 */
type TemplateType = 'html' | 'txt' | 'json' | 'markdown' | 'cloudMonitor';

/**
 * @description 推送选项
 */
type PushOptions = {
  title: string;
  content: string;
  template: TemplateType;
  toToken?: string;
  fromToken: string;
};

/**
 * @description 模态框
 */
type ModalOptions = {
  title: string;
  subTitle?: string;
  content: string | string[];
  to?: string;
  from?: string;
  type: ModalType;
};

/**
 * @description 类型
 */
type ModalType = 'info' | 'warn' | 'fail' | 'success';

/**
 * @description html进度条
 * @param title
 * @param percent
 * @returns
 */
function getProgressHTML(title: string, current: number, total: number) {
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
    <span>${getHighlightHTML(`${current}`)} / ${total}</span>
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
        width: ${((100 * current) / total).toFixed(1)}%;
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
         <img src="${src}" style="width:200px;height:200px;" />
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
 * @description 推送消息
 */
async function pushMessage(options: PushOptions) {
  // 选项
  const { title, content, template, fromToken, toToken } = options;
  // 推送
  const res = await pushPlus(fromToken, title, content, template, toToken);
  return res;
}
/**
 * @description 推送模态框
 */
async function pushModal(
  options: ModalOptions,
  fromToken: string,
  toToken?: string
) {
  // html
  const html = createModal(options);
  // 推送
  const res = await pushMessage({
    title: '消息提示',
    content: html,
    fromToken,
    toToken,
    template: 'html',
  });
  if (res && res.code === 200) {
    return res;
  }
  return;
}

export {
  createModal,
  getHighlightHTML,
  getImgHTML,
  getProgressHTML,
  pushModal,
};
