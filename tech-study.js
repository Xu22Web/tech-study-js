// ==UserScript==
// @name   不学习何以强国
// @namespace   http://tampermonkey.net/
// @version   20230107
// @description   有趣的 `学习强国` 油猴插件。读文章,看视频，做习题。问题反馈： https://github.com/Xu22Web/tech-study-js/issues 。
// @author   原作者：techxuexi 荷包蛋。现作者：Xu22Web
// @match   https://www.xuexi.cn/*
// @match   https://pc.xuexi.cn/points/exam-practice.html
// @match   https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match   https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match   https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn
// @require   https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @run-at   document-start
// @grant   GM_addStyle
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_openInTab
// @grant   unsafeWindow
// @updateURL   https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js
// @downloadURL   https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js
// @supportURL   https://github.com/Xu22Web
// ==/UserScript==
/**
 * @description api配置
 */
const API_CONFIG = {
    // 用户信息
    userInfo: 'https://pc-api.xuexi.cn/open/api/user/info',
    // 总分
    totalScore: 'https://pc-api.xuexi.cn/open/api/score/get',
    // 当天分数
    todayScore: 'https://pc-api.xuexi.cn/open/api/score/today/query',
    // 任务列表
    taskList: 'https://pc-proxy-api.xuexi.cn/api/score/days/listScoreProgress?sence=score&deviceType=2',
    // 新闻数据
    todayNews: [
        'https://www.xuexi.cn/lgdata/35il6fpn0ohq.json',
        'https://www.xuexi.cn/lgdata/1ap1igfgdn2.json',
        'https://www.xuexi.cn/lgdata/vdppiu92n1.json',
        'https://www.xuexi.cn/lgdata/152mdtl3qn1.json',
    ],
    // 视频数据
    todayVideos: [
        'https://www.xuexi.cn/lgdata/525pi8vcj24p.json',
        'https://www.xuexi.cn/lgdata/11vku6vt6rgom.json',
        'https://www.xuexi.cn/lgdata/2qfjjjrprmdh.json',
        'https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json',
        'https://www.xuexi.cn/lgdata/591ht3bc22pi.json',
        'https://www.xuexi.cn/lgdata/1742g60067k.json',
        'https://www.xuexi.cn/lgdata/1novbsbi47k.json',
    ],
    // 专项练习列表
    paperList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list',
    // 文本服务器保存答案
    answerSave: 'https://a6.qikekeji.com/txt/data/save',
    // 文本服务器获取答案
    answerSearch: 'https://api.answer.redfish.top/answer/search',
    // 推送
    push: 'https://www.pushplus.plus/send',
};


/**
 * @description url配置
 */
const URL_CONFIG = {
    // 主页正则
    home: /^https\:\/\/www\.xuexi\.cn(\/(index\.html)?)?$/,
    // 主页
    homeOrigin: 'https://www.xuexi.cn',
    // 每日答题页面
    examPractice: 'https://pc.xuexi.cn/points/exam-practice.html',
    // 专项练习页面
    examPaper: 'https://pc.xuexi.cn/points/exam-paper-detail.html',
    // 登录界面
    login: 'https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn',
};


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
    return function (...args) {
        if (timer !== -1) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}
/**
 * @description 选择器
 * @param selector
 * @returns
 */
function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
/**
 * @description 打开新窗口
 */
function openWin(url) {
    return GM_openInTab(url, {
        active: true,
        insert: true,
        setParent: true,
    });
}
/**
 * @description 关闭子窗口
 */
function closeWin(frame, id) {
    try {
        if (frame) {
            window.parent.postMessage({ id, closed: true }, 'https://www.xuexi.cn');
        }
        else {
            window.opener = window;
            const win = window.open('', '_self');
            win?.close();
            top?.close();
        }
    }
    catch (e) { }
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
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
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
function createElementNode(tagName, props, attrs, children) {
    // 创建普通元素
    const ele = document.createElement(tagName);
    // props属性设置
    for (const key in props) {
        if (props[key] instanceof Object) {
            for (const subkey in props[key]) {
                ele[key][subkey] = props[key][subkey];
            }
        }
        else {
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
            }
            else {
                ele.removeAttributeNS(attrNS, key);
            }
        }
        else if (formatKey.startsWith('on')) {
            // 事件监听
            const [, eventType] = key.toLowerCase().split('on');
            // 事件类型
            if (eventType) {
                // 回调函数
                if (value instanceof Function) {
                    ele.addEventListener(eventType, value);
                    // 回调函数数组
                }
                else if (value instanceof Array) {
                    for (const i in value) {
                        // 回调函数
                        if (value[i] instanceof Function) {
                            ele.addEventListener(eventType, value[i]);
                        }
                    }
                }
            }
        }
        else if (specificAttrs.includes(key)) {
            if (value) {
                ele.setAttribute(key, '');
            }
            else {
                ele.removeAttribute(key);
            }
        }
        else {
            ele.setAttribute(key, value);
        }
    }
    // 子节点
    if (children) {
        if (children instanceof Array) {
            // 过滤
            const filterEle = (children.filter((child) => child));
            ele.append(...filterEle);
        }
        else {
            if (children instanceof Promise) {
                children.then((child) => child && ele.append(child));
            }
            else {
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
function createNSElementNode(tagName, props, attrs, children) {
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
        }
        else {
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
            }
            else {
                ele.removeAttributeNS(attrNS, key);
            }
        }
        else if (formatKey.startsWith('on')) {
            // 事件监听
            const [, eventType] = key.toLowerCase().split('on');
            // 事件类型
            if (eventType) {
                // 回调函数
                if (value instanceof Function) {
                    ele.addEventListener(eventType, value);
                    // 回调函数数组
                }
                else if (value instanceof Array) {
                    for (const i in value) {
                        // 回调函数
                        if (value[i] instanceof Function) {
                            ele.addEventListener(eventType, value[i]);
                        }
                    }
                }
            }
        }
        else if (specificAttrs.includes(key)) {
            if (value) {
                ele.setAttribute(key, '');
            }
            else {
                ele.removeAttribute(key);
            }
        }
        else {
            ele.setAttribute(key, value);
        }
    }
    // 子节点
    if (children) {
        if (children instanceof Array) {
            ele.append(...children);
        }
        else {
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
function createTextNode(text) {
    return document.createTextNode(text);
}
/**
 * @description 创建随机点
 * @param bounds 范围
 * @returns
 */
function createRandomPoint(bounds) {
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
function createRandomPath(start, end, steps) {
    // 最小水平增量
    const minDeltaX = (end.x - start.x) / steps;
    // 最大垂直增量
    const maxDeltaY = (end.y - start.y) / steps;
    const path = [];
    // 开始节点
    path.push(start);
    // 插入点
    for (let i = 0; i < steps; i++) {
        // 横坐标
        const x = path[i].x + Math.random() * 5 + minDeltaX;
        // 纵坐标
        const y = path[i].y +
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
function generateNumAsChar() {
    return (~~(Math.random() * 10)).toString();
}
/**
 * @description 随机大写字母
 * @returns
 */
function generateUpperAsChar() {
    return String.fromCharCode(~~(Math.random() * 26) + 65);
}
/**
 * @description 随机小写字母
 * @returns
 */
function generateLowerAsChar() {
    return String.fromCharCode(~~(Math.random() * 26) + 97);
}
/**
 * @description 随机混合字符
 * @param length
 * @returns
 */
function generateMix(length = 6) {
    // 随机字符串
    const randomText = [];
    // 生成器
    const typeGenerator = [
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
function formatDateNum(num) {
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
function formatDateTime(time = Date.now()) {
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
const formatTime = (time = Date.now()) => {
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
function getProgressHTML(title, percent) {
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
function getHighlightHTML(text) {
    // html
    const highlightHTML = `<span style="color: #1890ff">${text}</span>`;
    return highlightHTML;
}
/**
 * @description 二维码
 * @param src
 */
function getImgHTML(src) {
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
function createModal(options) {
    // 配置
    const { title, subTitle = '', to = '用户', content, type, from = 'tech-study.js', } = options;
    // 内容文本
    let contentText = '';
    if (Array.isArray(content)) {
        contentText = content.map((ct) => `<div>${ct}</div>`).join('');
    }
    else {
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
function isLate({ hour, minute }) {
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
function isNow({ hour, minute }) {
    const date = new Date();
    const h = date.getHours();
    const min = date.getMinutes();
    const s = date.getSeconds();
    return h === hour && min === minute && s === 0;
}


const css = '* {  -webkit-tap-highlight-color: transparent;}:root {  --themeColor: #fa3333;  --scale: 1;  font-size: calc(10px * var(--scale));}@media (min-height: 678px) and (max-height: 768px) {  :root {    --scale: 0.8;  }}@media (max-height: 667px) {  :root {    --scale: 0.75;  }}@keyframes fade {  from {    opacity: 0.8;  }  to {    opacity: 0.4;    background: #ccc;  }}.egg_icon {  width: 1em;  height: 1em;  fill: currentColor;}.egg_hr_wrap {  position: relative;  display: flex;  justify-content: center;  color: #ccc;}.egg_hr_wrap .egg_hr {  position: absolute;  top: 50%;  transform: translateY(-50%);  background: currentColor;  height: 0.1rem;  width: 30%;}.egg_hr_wrap .egg_hr:nth-of-type(1) {  left: 0;}.egg_hr_wrap .egg_hr:nth-last-of-type(1) {  right: 0;}.egg_hr_title {  font-size: 1.2rem;}.egg_exam_btn {  transition: background-color 80ms;  outline: none;  border: none;  padding: 1.2rem 2rem;  border-radius: 1.2rem;  cursor: pointer;  font-size: 1.8rem;  font-weight: bold;  text-align: center;  color: #ffffff;  background: #666777;}.egg_exam_btn.manual {  background: #e3484b;}.egg_panel {  position: fixed;  top: 5rem;  left: 1rem;  padding: 1.2rem 2rem;  border-radius: 1rem;  background: #ffffffe6;  backdrop-filter: blur(1rem);  box-shadow: 0 0 0.1rem 0.1rem #f1f1f1;  transition: 80ms ease-out;  z-index: 99999;  color: #333;}.egg_panel.hide {  left: 0;  transform: translateX(-100%);}.egg_panel_wrap.mobile .egg_panel {  top: 1rem;}@media (min-height: 678px) and (max-height: 768px) {  .egg_panel {    top: 2rem;  }}@media (max-height: 667px) {  .egg_panel {    top: 1rem;  }}.egg_panel button {  outline: none;  border: none;  padding: 0;  cursor: pointer;  background: none;}.egg_panel .egg_btns_wrap {  position: absolute;  left: 100%;  top: 50%;  transform: translate(-50%, -50%);  transition: 80ms ease;  z-index: 9;}.egg_panel.hide .egg_btns_wrap {  left: 100%;  transform: translate(0, -50%);}.egg_panel .egg_btns_wrap button {  border-radius: 50%;  width: 3rem;  height: 3rem;  padding: 0;  overflow: hidden;  border: 0.2rem solid currentColor;  color: white;  display: grid;  place-items: center;  font-size: 1.8rem;}.egg_panel.hide .egg_setting_show_btn {  background: var(--themeColor);}.egg_panel .egg_setting_show_btn {  background: #ccc;}.egg_panel .egg_frame_show_btn {  background: var(--themeColor);  margin-bottom: 1rem;}.egg_panel .egg_frame_show_btn.hide {  display: none;}.egg_panel .egg_setting_push_btn {  background: #ccc;  margin-top: 1rem;}.egg_panel .egg_setting_push_btn.hide {  display: none;}.egg_panel .egg_setting_push_btn.active {  background: var(--themeColor);}.egg_login_wrap .egg_login_btn,.egg_user_wrap .egg_login_btn {  font-size: 1.4rem;  border-radius: 1rem;  transition: 80ms ease;  color: white;}.egg_login_wrap .egg_login_btn:active,.egg_user_wrap .egg_login_btn:active {  opacity: 0.8;}.egg_login_wrap .egg_login_btn {  background: var(--themeColor);  padding: 0.8rem 2.4rem;}.egg_user_wrap .egg_login_btn {  background: #ccc;  padding: 0.4rem 0.8rem;}.egg_login_wrap {  display: flex;  justify-content: center;  align-items: center;  flex-direction: column;  padding: 0.5rem 0;}.egg_login_wrap .egg_login_frame_item {  height: 0;  overflow: hidden;}.egg_login_wrap .egg_login_frame_item.active {  --rate: 0.75;  margin-top: 0.8rem;  height: calc(22.8rem * var(--rate));  width: calc(22.8rem * var(--rate));}.egg_login_frame_item.active .egg_login_frame_wrap {  transform: scale(var(--rate));  transform-origin: top left;  overflow: hidden;  padding: 1rem;  width: 22.8rem;  height: 22.8rem;  background: white;  border-radius: 1rem;}.egg_login_frame_wrap {  position: relative;  box-sizing: border-box;  margin: 0 auto;}.egg_login_frame {  width: 284px;  height: 241px;  border: none;  transform: scale(var(--scale));  transform-origin: top left;  position: absolute;  left: -6.4rem;  top: -2.1rem;}.egg_user_wrap {  display: flex;  justify-content: space-between;  align-items: center;}.egg_user_wrap .egg_userinfo {  display: flex;  justify-content: center;  align-items: center;  padding: 0.5rem 0;}.egg_userinfo .egg_avatar .egg_sub_nickname,.egg_userinfo .egg_avatar .egg_avatar_img {  height: 5rem;  width: 5rem;  border-radius: 50%;  background: var(--themeColor);  display: flex;  justify-content: center;  align-items: center;  text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;  font-size: 2rem;  color: white;}.egg_userinfo .egg_nick {  padding-left: 0.5rem;  text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;  max-width: 10rem;  font-size: 1.6rem;}.egg_score_item .egg_scoreinfo {  display: flex;  justify-content: space-between;  align-items: center;  padding: 0.5rem 0;}.egg_scoreinfo .egg_totalscore,.egg_scoreinfo .egg_todayscore {  font-size: 1.2rem;  user-select: none;}.egg_scoreinfo .egg_totalscore span,.egg_scoreinfo .egg_todayscore .egg_todayscore_btn span {  padding-left: 0.2rem;}.egg_scoreinfo .egg_totalscore span,.egg_todayscore .egg_todayscore_btn span,.egg_todayscore .egg_score_details span {  color: var(--themeColor);  font-weight: bold;}.egg_scoreinfo .egg_todayscore {  position: relative;}.egg_todayscore .egg_todayscore_btn {  display: flex;  align-items: center;}.egg_todayscore_btn .egg_icon {  opacity: 0.3;}.egg_todayscore .egg_score_details {  position: absolute;  left: calc(100% + 1rem);  top: 0;  background: #fffffff2;  border-radius: 0.5rem;  opacity: 1;  width: 10rem;  box-shadow: 0 0 0.1rem 0.1rem #f1f1f1;  transition: 80ms ease;  z-index: 9;}.egg_todayscore .egg_score_details.hide {  visibility: hidden;  opacity: 0;  left: 100%;}.egg_score_details .egg_score_title {  border-bottom: 0.1rem solid #eee;  padding: 0.5rem 0.8rem;  display: flex;  align-items: center;}.egg_score_details .egg_score_title .egg_icon {  font-size: 1.4rem;}.egg_score_details .egg_score_title .egg_score_title_text {  font-weight: bold;  padding-left: 0.2rem;}.egg_score_details .egg_score_item {  display: flex;  align-items: center;  justify-content: space-between;  padding: 0.5rem 0.8rem;}.egg_setting_item {  min-height: 3rem;  min-width: 18rem;  font-size: 1.6rem;  display: flex;  align-items: center;  justify-content: space-between;}.egg_setting_item .egg_label_wrap {  flex-grow: 1;}.egg_label_wrap .egg_progress {  display: flex;  justify-content: space-between;  align-items: center;  padding: 0.5rem 0;}.egg_progress .egg_track {  background: #ccc;  height: 0.5rem;  border-radius: 1rem;  flex: 1 1 auto;  overflow: hidden;}.egg_progress .egg_track .egg_bar {  height: 0.5rem;  background: var(--themeColor);  border-radius: 1rem;  width: 0;  transition: width 0.5s;}.egg_progress .egg_percent {  font-size: 1.2rem;  padding-left: 0.5rem;  width: 4rem;}.egg_detail {  background: #ccc;  color: white;  border-radius: 10rem;  font-size: 1.2rem;  width: 1.6rem;  height: 1.6rem;  margin-left: 0.4rem;  display: inline-block;  text-align: center;  line-height: 1.6rem;  cursor: pointer;}.egg_switch {  cursor: pointer;  margin: 0;  outline: 0;  appearance: none;  -webkit-appearance: none;  -moz-appearance: none;  position: relative;  width: 4.2rem;  height: 2.2rem;  background: #ccc;  border-radius: 5rem;  transition: background 0.3s;  --border-padding: 0.5rem;  box-shadow: -0.1rem 0 0.1rem -0.1rem #999 inset,    0.1rem 0 0.1rem -0.1rem #999 inset;}.egg_switch::after {  content: \'\';  display: inline-block;  width: 1.4rem;  height: 1.4rem;  border-radius: 50%;  background: #fff;  box-shadow: 0 0 0.2rem #999;  transition: left 0.4s;  position: absolute;  top: calc(50% - (1.4rem / 2));  position: absolute;  left: var(--border-padding);}.egg_switch:checked {  background: var(--themeColor);}.egg_switch:checked::after {  left: calc(100% - var(--border-padding) - 1.4rem);}.egg_study_item {  display: flex;  justify-content: center;  padding-top: 0.5rem;}.egg_study_item .egg_study_btn {  background: var(--themeColor);  padding: 0.8rem 2.4rem;  font-size: 1.4rem;  border-radius: 1rem;  color: white;  transition: 80ms ease;}.egg_study_item .egg_study_btn:active {  opacity: 0.8;}.egg_study_item .egg_study_btn.loading {  animation: fade 2s ease infinite alternate;}.egg_study_item .egg_study_btn.disabled {  background: #ccc;}.egg_tip_wrap {  position: fixed;  left: 0;  top: 0;  z-index: 999999;  width: 100%;  height: 100%;  pointer-events: none;}.egg_tip_wrap .egg_tip {  position: absolute;  bottom: 2rem;  left: 2rem;  padding: 1.2rem 1.4rem;  border: none;  border-radius: 1rem;  background: var(--themeColor);  color: white;  font-size: 1.4rem;  transition: 200ms ease;  opacity: 0;  transform: scale(0.9) translateY(1rem);}.egg_tip_wrap .egg_tip.active {  opacity: 1;  transform: scale(1) translateY(0);}.egg_tip_wrap .egg_tip .egg_countdown {  display: inline-block;  color: var(--themeColor);  background: white;  border-radius: 0.5rem;  padding: 0.2rem 0.4rem;  font-weight: bold;  margin-left: 0.4rem;  font-size: 1.2rem;}.egg_frame_wrap {  position: fixed;  left: 0;  top: 0;  z-index: 999;  width: 100%;  height: 100%;  visibility: visible;}.egg_frame_wrap.hide {  visibility: hidden;}.egg_frame_wrap.hide .egg_frame_mask,.egg_frame_wrap.hide .egg_frame_content_wrap {  opacity: 0;}.egg_frame_wrap.hide .egg_frame_content_wrap {  transform: scale(0);}.egg_frame_mask {  background: #00000030;  width: 100%;  height: 100%;  opacity: 1;  transition: 200ms ease;}.egg_frame_content_wrap {  position: absolute;  width: 80%;  height: 80%;  top: 10%;  left: 10%;  display: flex;  flex-direction: column;  transition: 200ms ease;  border-radius: 1rem;  background: #ffffffe6;  backdrop-filter: blur(1rem);  overflow: hidden;  transform: scale(1);}.egg_frame_content_wrap.max {  top: 0;  left: 0;  width: 100%;  height: 100%;  border-radius: 0;}.egg_frame_content_wrap .egg_frame_controls_wrap {  width: 100%;  display: flex;  justify-content: space-between;  align-items: center;  box-sizing: border-box;}.egg_frame_controls_wrap .egg_frame_title {  padding: 1rem 2rem;  font-size: 1.6rem;}.egg_frame_controls .egg_frame_btn {  outline: none;  border: none;  background: none;  padding: 1rem 2rem;  transition: 80ms ease;  cursor: pointer;  color: #333;  font-size: 1.8rem;}.egg_frame_controls .egg_frame_btn:active {  opacity: 0.8;}.egg_frame_wrap .egg_frame_content {  width: 100%;  flex-grow: 1;  border-top: 1px solid #ccc;  min-height: 40rem;  min-width: 30rem;  background: white;}.egg_frame_content .egg_frame {  width: 100%;  height: 100%;  outline: none;  border: none;}.egg_time_input {  display: inline-flex;  align-items: center;  justify-content: center;}.egg_time_input input {  outline: none;  border: 1px solid #eee;  width: 2rem;  padding: 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;}.egg_time_input input::placeholder {  color: #ccc;}.egg_time_input span {  padding: 0 0.5rem;  font-size: 1.5rem;}.egg_list {  max-height: 12rem;  overflow: auto;  border-radius: 0 0 0.2rem 0.2rem;  box-shadow: 0.1rem 0.1rem 0.1rem 0.1rem #eee;  position: absolute;  background: white;  z-index: 9;  scroll-behavior: smooth;  user-select: none;  transition: 100ms ease;  opacity: 1;  scrollbar-width: thin;}.egg_list.hide {  opacity: 0;  visibility: hidden;}.egg_list::-webkit-scrollbar {  width: 0.4rem;  background: white;  border-radius: 0.2rem;}.egg_list::-webkit-scrollbar-thumb {  background: #ccc;  border-radius: 0.2rem;}.egg_list .egg_time {  padding: 0.6rem 1rem;  border-bottom: 0.1rem solid #eee;  cursor: pointer;  color: #333;  transition: 100ms ease;}.egg_list .egg_time.focus {  font-weight: bold;  background: #eee;}.egg_list .egg_time:hover {  background: #eee;}.egg_schedule {  display: inline-flex;  flex-direction: column;  font-size: 1.6rem;  background: white;  border-radius: 1rem;  overflow: hidden;}.egg_schedule_add {  padding: 0 2rem;  box-shadow: 0 0 0.4rem 0.4rem #eee;}.egg_schedule_add .egg_schedule_label {  padding-bottom: 1rem;  user-select: none;}.egg_schedule_add .egg_schedule_token_wrap,.egg_schedule_add .egg_schedule_time_wrap {  padding: 1.5rem 0;  color: #333;}.egg_schedule_token_wrap .egg_schedule_token {}.egg_schedule_token_wrap .egg_schedule_token_input {  outline: none;  border: 1px solid #eee;  padding: 1rem;  background: white;  border-radius: 0.2rem;  width: 100%;  box-sizing: border-box;  color: #ccc;}.egg_schedule_token_wrap .egg_schedule_token_input.active {  color: #333;}.egg_schedule_token_input::placeholder {  color: #ccc;}.egg_schedule .egg_schedule_submit_btn_wrap {  text-align: right;  padding-top: 1rem;  display: none;}.egg_schedule .egg_schedule_submit_btn_wrap.active {  display: block;}.egg_schedule_submit_btn_wrap .egg_schedule_submit_btn {  outline: none;  border: 1px solid #eee;  padding: 0.5rem 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  cursor: pointer;}.egg_schedule_submit_btn_wrap .egg_schedule_submit_btn:active {  background: #eee;}.egg_schedule_time_input_wrap {  display: flex;  justify-content: space-between;  align-items: center;}.egg_schedule_time_input_wrap .egg_schedule_add_btn {  outline: none;  border: 1px solid #eee;  padding: 0.5rem 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  cursor: pointer;}.egg_schedule_time_input_wrap .egg_schedule_add_btn:active {  background: #eee;}.egg_schedule_list {  flex-grow: 1;  height: 100%;  overflow: auto;}.egg_schedule_list .egg_schedule_item {  display: flex;  justify-content: space-between;  padding: 1rem 1.5rem;  font-size: 1.4rem;  border-bottom: 0.1rem solid #eee;}.egg_schedule_list::-webkit-scrollbar {  width: 0.4rem;  background: white;  border-radius: 0.2rem;}.egg_schedule_list::-webkit-scrollbar-thumb {  background: #ccc;  border-radius: 0.2rem;}.egg_schedule_detail_time_wrap {  display: flex;  align-items: center;}.egg_schedule_detail_time_wrap.inactive {  color: #ccc;}.egg_schedule_detail_time_wrap .egg_schedule_detail_icon {  padding-right: 0.4rem;  display: flex;  color: #ccc;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn {  outline: none;  padding: 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  font-size: 1.4rem;  cursor: pointer;  color: #ccc;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn:hover {  color: #333;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn:active {  color: #eee;}.egg_schedule_settings_item {  position: absolute;  top: 0;  left: 0;  width: 100%;  height: 100%;  pointer-events: none;  overflow: hidden;  border-radius: 1rem;}.egg_schedule_settings_item .egg_schedule {  width: 100%;  height: 100%;  pointer-events: all;  transform: translateX(100%);  transition: 300ms ease;}.egg_schedule_settings_item .egg_schedule.active {  transform: translateX(0);}';
/**
 * @description 嵌入样式
 */
GM_addStyle(css);
/* Config·配置 */
/**
 * @description 专项答题开启逆序答题: false: 顺序答题; true: 逆序答题
 */
const examPaperReverse = true;
/**
 * @description  答题请求速率限制
 */
const ratelimitms = 3000;
/**
 * @description 单次最大新闻数
 */
const maxNewsNum = 6;
/**
 * @description 单次最大视频数
 */
const maxVideoNum = 6;
/**
 * @description 二维码最大刷新次数
 */
const maxRefreshCount = 10;
/* Config End·配置结束 */
/* Tools·工具函数  */
/**
 * @description 暂停锁
 */
function pauseLock(callback) {
    return new Promise((resolve) => {
        // 学习暂停
        const pauseStudy = (GM_getValue('pauseStudy') || false);
        if (pauseStudy) {
            pauseExam(pauseStudy);
        }
        if (pause) {
            const doing = setInterval(() => {
                if (!pause) {
                    // 停止定时器
                    clearInterval(doing);
                    console.log('答题等待结束!');
                    if (callback && callback instanceof Function) {
                        callback('done');
                    }
                    resolve('done');
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback('pending');
                }
                console.log('答题等待...');
            }, 500);
            return;
        }
        resolve('done');
    });
}
/**
 * @description 暂停学习锁
 */
function pauseStudyLock(callback) {
    return new Promise((resolve) => {
        // 暂停
        const pauseStudy = GM_getValue('pauseStudy') || false;
        if (pauseStudy) {
            const doing = setInterval(() => {
                // 暂停
                const pauseStudy = GM_getValue('pauseStudy') || false;
                if (!pauseStudy) {
                    // 停止定时器
                    clearInterval(doing);
                    console.log('学习等待结束!');
                    if (callback && callback instanceof Function) {
                        callback('done');
                    }
                    resolve('done');
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback('pending');
                }
                console.log('学习等待...');
            }, 500);
            return;
        }
        resolve('done');
    });
}
/**
 * @description 推送消息
 */
async function pushMessage(options) {
    // 选项
    const { title, content, template, fromToken, toToken } = options;
    // 推送
    const res = await pushPlus(fromToken, title, content, template, toToken);
    return res;
}
/**
 * @description 推送模态框
 */
async function pushModal(options, fromToken, toToken) {
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
    return res;
}
/* Tools End·工具函数结束 */
/* API 请求函数 */
/**
 * @description 获取用户信息
 */
async function getUserInfo() {
    try {
        const res = await fetch(API_CONFIG.userInfo, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            return data;
        }
    }
    catch (err) { }
}
/**
 * @description 获取总积分
 */
async function getTotalScore() {
    try {
        const res = await fetch(API_CONFIG.totalScore, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 总分
            const { score } = data;
            return score;
        }
    }
    catch (err) { }
}
/**
 * @description 获取当天总积分
 */
async function getTodayScore() {
    try {
        const res = await fetch(API_CONFIG.todayScore, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 当天总分
            const { score } = data;
            return score;
        }
    }
    catch (err) { }
}
/**
 * @description 获取任务列表
 */
async function getTaskList() {
    try {
        const res = await fetch(API_CONFIG.taskList, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const { data } = await res.json();
            // 进度和当天总分
            const { taskProgress } = data;
            return taskProgress;
        }
    }
    catch (err) { }
}
/**
 * @description 获取新闻数据
 */
async function getTodayNews() {
    // 随机
    const randNum = ~~(Math.random() * API_CONFIG.todayNews.length);
    try {
        // 获取重要新闻
        const res = await fetch(API_CONFIG.todayNews[randNum], {
            method: 'GET',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (err) { }
}
/**
 * @description 获取视频数据
 */
async function getTodayVideos() {
    // 随机
    const randNum = ~~(Math.random() * API_CONFIG.todayVideos.length);
    try {
        // 获取重要新闻
        const res = await fetch(API_CONFIG.todayVideos[randNum], {
            method: 'GET',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (err) { }
}
/**
 * @description 专项练习数据
 */
async function getExamPaper(pageNo) {
    // 链接
    const url = `${API_CONFIG.paperList}?pageSize=50&pageNo=${pageNo}`;
    try {
        // 获取专项练习
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            const paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
            // JSON格式化
            const paper = JSON.parse(paperJson);
            return paper;
        }
    }
    catch (err) {
        return [];
    }
    return [];
}
/**
 * @description 获取答案
 */
async function getAnswer(question) {
    console.log('正在获取网络答案...');
    // 数据
    const data = {
        question,
    };
    try {
        // 请求
        const res = await fetch(API_CONFIG.answerSearch, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            // 状态
            const { errno } = data;
            if (errno !== -1) {
                // 答案
                const { answers } = data.data;
                console.log('answers', answers);
                return answers;
            }
        }
    }
    catch (error) { }
    console.log('获取网络答案失败!');
    return [];
}
/**
 * @description 保存答案
 */
async function saveAnswer(key, value) {
    // 内容
    const content = JSON.stringify([{ title: key, content: value }]);
    // 数据
    const data = {
        txt_name: key,
        txt_content: content,
        password: '',
        v_id: '',
    };
    // 请求体
    const body = Object.keys(data)
        .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    })
        .join('&');
    // 请求
    const res = await fetch(API_CONFIG.answerSave, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body,
    });
    // 请求成功
    if (res.ok) {
        try {
            const data = await res.json();
            return data;
        }
        catch (err) {
            return null;
        }
    }
    return null;
}
/**
 * @description 推送
 */
async function pushPlus(token, title, content, template, toToken) {
    try {
        // 参数体
        const body = {
            token,
            title,
            content,
            template,
        };
        // 好友令牌
        if (toToken) {
            body.to = toToken;
        }
        // 推送
        const res = await fetch(API_CONFIG.push, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        // 请求成功
        if (res.ok) {
            try {
                const data = await res.json();
                return data;
            }
            catch (err) { }
        }
    }
    catch (error) { }
}
/* API 请求函数结束 */
/* 变量 */
/**
 * @description 任务类型
 */
var TaskType;
(function (TaskType) {
    TaskType[TaskType["READ"] = 0] = "READ";
    TaskType[TaskType["WATCH"] = 1] = "WATCH";
    TaskType[TaskType["PRACTICE"] = 2] = "PRACTICE";
    TaskType[TaskType["PAPER"] = 3] = "PAPER";
})(TaskType || (TaskType = {}));
/**
 * @description 任务进度
 */
const tasks = [
    {
        title: '文章选读',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每有效阅读一篇文章积1分，上限6分。有效阅读文章累计1分钟积1分，上限6分。每日上限积12分。',
        type: TaskType.READ,
        percent: 0,
    },
    {
        title: '视听学习',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每有效一个音频或观看一个视频积1分，上限6分。有效收听音频或观看视频累计1分钟积1分，上限6分。每日上限积12分。',
        type: TaskType.WATCH,
        percent: 0,
    },
    {
        title: '每日答题',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每组答题每答对1道积1分。每日上限积5分。',
        type: TaskType.PRACTICE,
        percent: 0,
    },
    {
        title: '专项练习',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每组答题每答对1道积1分，同组答题不重复积分；每日仅可获得一组答题积分，5道题一组的上限5分，10道题一组的上限10分。',
        type: TaskType.PAPER,
        percent: 0,
    },
];
/**
 * @description 获取 URL
 */
const { href } = window.location;
/**
 * @description 默认设置
 */
const defaultSettings = [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
];
/**
 * @description 设置
 */
let settings = defaultSettings;
/**
 * @description 设置类型
 */
var SettingType;
(function (SettingType) {
    SettingType[SettingType["READ"] = 0] = "READ";
    SettingType[SettingType["WATCH"] = 1] = "WATCH";
    SettingType[SettingType["PRACTICE"] = 2] = "PRACTICE";
    SettingType[SettingType["PAPER"] = 3] = "PAPER";
    SettingType[SettingType["AUTO_START"] = 4] = "AUTO_START";
    SettingType[SettingType["SAME_TAB"] = 5] = "SAME_TAB";
    SettingType[SettingType["SILENT_RUN"] = 6] = "SILENT_RUN";
    SettingType[SettingType["SCHEDULE_RUN"] = 7] = "SCHEDULE_RUN";
    SettingType[SettingType["RANDOM_EXAM"] = 8] = "RANDOM_EXAM";
    SettingType[SettingType["REMOTE_PUSH"] = 9] = "REMOTE_PUSH";
})(SettingType || (SettingType = {}));
/**
 * @description 已经开始
 */
let started = false;
/**
 * @description 是否暂停答题
 */
let pause = false;
/**
 * @description 初始化登录状态
 */
let login = !!getCookie('token');
/**
 * @description 新闻
 */
let news = [];
/**
 * @description 视频
 */
let videos = [];
/**
 * @description 登录定时器
 */
let loginTimer;
/**
 * @description 刷新定时器
 */
let refreshTimer;
/**
 * @description 定时任务定时器
 */
let scheduleTimer;
/**
 * @description frame 关闭
 */
let closed = true;
/**
 * @description id
 */
let id;
/**
 * @description 定时任务
 */
let scheduleList = [];
/**
 * @description 推送 token
 */
let pushToken = '';
/**
 * @description 刷新次数
 */
let refreshCount = 0;
/* 变量结束 */
/* 组件化 */
/**
 * @description 分隔符
 * @returns
 */
function Hr({ text }) {
    return createElementNode('div', undefined, {
        class: 'egg_hr_wrap',
    }, [
        createElementNode('div', undefined, { class: 'egg_hr' }),
        createElementNode('div', undefined, { class: 'egg_hr_title' }, createTextNode(text)),
        createElementNode('div', undefined, { class: 'egg_hr' }),
    ]);
}
/**
 * @description 设置任务项
 * @returns
 */
function TaskItem({ title, tip, checked, onChange, }) {
    return createElementNode('div', undefined, { class: 'egg_setting_item' }, [
        createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
            createElementNode('label', undefined, { class: 'egg_task_title' }, createTextNode(title)),
            createElementNode('div', undefined, { class: 'egg_progress' }, [
                createElementNode('div', undefined, { class: 'egg_track' }, createElementNode('div', undefined, { class: 'egg_bar' })),
                createElementNode('div', undefined, { class: 'egg_percent' }, [
                    createElementNode('span', undefined, undefined, [createTextNode(0)]),
                    createTextNode('%'),
                ]),
            ]),
        ]),
        createElementNode('input', undefined, {
            title: tip,
            class: 'egg_switch',
            type: 'checkbox',
            checked,
            onChange,
        }),
    ]);
}
/**
 * @description 设置普通项
 * @returns
 */
function NomalItem({ title, tip, checked, onChange, }) {
    return createElementNode('div', undefined, { class: 'egg_setting_item' }, [
        createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
            createElementNode('label', undefined, { class: 'egg_task_title' }, [
                createTextNode(title),
                createElementNode('span', undefined, {
                    class: 'egg_detail',
                    title: tip,
                }, createTextNode('i')),
            ]),
        ]),
        createElementNode('input', undefined, {
            title: tip,
            class: 'egg_switch',
            type: 'checkbox',
            checked,
            onChange,
        }),
    ]);
}
/**
 * @description 信息
 * @returns
 */
async function Info({ login }) {
    if (login) {
        // 用户信息
        const userInfo = await getUserInfo();
        if (userInfo) {
            const { avatarMediaUrl, nick } = userInfo;
            return createElementNode('div', undefined, {
                class: 'egg_user_wrap',
            }, [
                // 用户信息
                createElementNode('div', undefined, { class: 'egg_userinfo' }, [
                    // 头像
                    createElementNode('div', undefined, { class: 'egg_avatar' }, avatarMediaUrl
                        ? createElementNode('img', undefined, {
                            src: avatarMediaUrl,
                            class: 'egg_avatar_img',
                        })
                        : createElementNode('div', undefined, {
                            class: 'egg_sub_nickname',
                        }, createTextNode(nick.substring(1, 3)))),
                    // 昵称
                    createElementNode('div', { innerText: nick }, { class: 'egg_nick' }),
                ]),
                // 退出按钮
                createElementNode('button', { innerText: '退出' }, {
                    type: 'button',
                    class: 'egg_login_btn',
                    onclick: debounce(() => {
                        const logged = $$("a[class='logged-link']")[0];
                        logged && logged.click();
                    }, 500),
                }),
            ]);
        }
    }
    // 用户登录
    return createElementNode('div', undefined, {
        class: 'egg_login_wrap',
    }, [
        // 登录按钮
        createElementNode('button', undefined, {
            type: 'button',
            class: 'egg_login_btn',
            onclick: debounce(async () => {
                if (settings[SettingType.SCHEDULE_RUN]) {
                    const iframeItem = $$('.egg_login_frame_item')[0];
                    const visible = iframeItem.classList.contains('active');
                    if (!visible) {
                        // 加载二维码
                        setLoginVisible(true);
                        return;
                    }
                }
                if (refreshTimer) {
                    clearInterval(refreshTimer);
                }
                // 加载登录页面
                refreshLoginQRCode();
                refreshTimer = setInterval(() => {
                    refreshLoginQRCode();
                }, 100000);
            }, 500),
        }, createTextNode('扫码登录')),
        // 窗口
        createElementNode('div', undefined, {
            class: `egg_login_frame_item${settings[SettingType.SCHEDULE_RUN] ? '' : ' active'}`,
        }, createElementNode('div', undefined, { class: 'egg_login_frame_wrap' }, createElementNode('iframe', undefined, {
            class: 'egg_login_frame',
            src: settings[SettingType.SCHEDULE_RUN] ? '' : URL_CONFIG.login,
            onload: async (e) => {
                // 加载登录页
                if (e.target.src === URL_CONFIG.login) {
                    // 加载二维码
                    console.log('加载登录二维码!');
                    // 登录窗口
                    const iframe = $$('.egg_login_frame')[0];
                    // 加载二维码
                    iframe.contentWindow?.postMessage({ type: 'load_qrcode' }, URL_CONFIG.login);
                    refreshTimer = setInterval(() => {
                        refreshLoginQRCode();
                    }, 100000);
                    // 登录状态
                    const res = await loginStatus();
                    if (res) {
                        await createTip('登录成功, 刷新页面!');
                        // 推送
                        if (settings[SettingType.REMOTE_PUSH]) {
                            await pushModal({
                                title: '登录推送',
                                content: '学习强国, 登录成功!',
                                type: 'success',
                            }, pushToken);
                        }
                        window.location.reload();
                    }
                }
            },
        }))),
    ]);
}
/**
 * @description 面板
 * @returns
 */
function Panel() {
    // 任务标签
    const taskLabels = tasks.map((task) => ({
        title: task.title,
        tip: task.tip,
        type: task.type,
    }));
    // 运行设置标签
    const runLabels = [
        {
            title: '自动开始',
            tip: '启动时, 自动开始任务, 在倒计时结束前自动开始可随时取消; 如果在自动开始前手动开始任务, 此次自动开始将取消',
            type: SettingType.AUTO_START,
        },
        {
            title: '同屏任务',
            tip: '运行任务时，所有任务均在当前页面以弹窗方式运行',
            type: SettingType.SAME_TAB,
        },
        {
            title: '静默运行',
            tip: '同屏任务时, 不显示任务弹窗静默运行',
            type: SettingType.SILENT_RUN,
        },
        {
            title: '定时刷新',
            tip: '定时刷新页面，重新进行任务，此功能需要长时间占用浏览器',
            type: SettingType.SCHEDULE_RUN,
        },
    ];
    // 运行设置标签
    const examLabels = [
        {
            title: '随机作答',
            tip: '无答案时, 随机选择或者填入答案, 不保证正确!',
            type: SettingType.RANDOM_EXAM,
        },
    ];
    // 推送设置标签
    const pushLabels = [
        {
            title: '远程推送',
            tip: '利用 pushplus 推送, 将登录二维码直接推送到微信公众号',
            type: SettingType.REMOTE_PUSH,
        },
    ];
    // 处理设置变化
    const handleChangeAndNotice = (e, type, title) => {
        // 开关
        const { checked } = e.target;
        if (settings[type] !== checked) {
            settings[type] = checked;
            // 设置
            GM_setValue('studySetting', JSON.stringify(settings));
            // 创建提示
            createTip(`${title} ${checked ? '打开' : '关闭'}!`);
        }
    };
    return createElementNode('div', undefined, {
        class: `egg_panel_wrap${hasMobile() ? ' mobile' : ''}`,
    }, createElementNode('div', undefined, { class: 'egg_panel' }, [
        createElementNode('div', undefined, {
            class: 'egg_user_item',
        }, Info({ login })),
        createElementNode('div', undefined, {
            class: 'egg_score_item',
        }, ScoreInfo({ login })),
        // 任务部分
        Hr({ text: '任务' }),
        ...taskLabels.map((label) => {
            // 处理变化
            const handleChange = debounce(handleChangeAndNotice, 500);
            return TaskItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                    handleChange(e, label.type, label.title);
                },
            });
        }),
        // 运行部分
        Hr({ text: '运行' }),
        ...runLabels.map((label) => {
            // 处理变化
            const handleChange = debounce(handleChangeAndNotice, 500);
            return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                    handleChange(e, label.type, label.title);
                },
            });
        }),
        // 答题部分
        Hr({ text: '答题' }),
        ...examLabels.map((label) => {
            // 处理变化
            const handleChange = debounce(handleChangeAndNotice, 500);
            return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                    handleChange(e, label.type, label.title);
                },
            });
        }),
        // 推送部分
        Hr({ text: '推送' }),
        ...pushLabels.map((label) => {
            // 处理变化
            const handleChange = debounce(handleChangeAndNotice, 500);
            return NomalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onChange: (e) => {
                    handleChange(e, label.type, label.title);
                },
            });
        }),
        // 按钮集合
        createElementNode('div', undefined, {
            class: 'egg_btns_wrap',
        }, [
            createElementNode('button', undefined, {
                class: 'egg_frame_show_btn hide',
                type: 'button',
                onclick: () => {
                    // 显示窗口
                    setFrameVisible(true);
                },
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, createNSElementNode('path', undefined, {
                d: 'M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z',
            }))),
            createElementNode('button', undefined, {
                class: 'egg_setting_show_btn',
                type: 'button',
                onclick: () => {
                    const panel = $$('.egg_panel')[0];
                    if (panel) {
                        const panelHidden = panel.classList.contains('hide');
                        panel.classList.toggle('hide', !panelHidden);
                    }
                },
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, createNSElementNode('path', undefined, {
                d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
            }))),
            createElementNode('button', undefined, {
                class: `egg_setting_push_btn${settings[SettingType.REMOTE_PUSH] ||
                    settings[SettingType.SCHEDULE_RUN]
                    ? ' active'
                    : ' hide'}`,
                type: 'button',
                onclick: () => {
                    const schedule = $$('.egg_schedule')[0];
                    const btn = $$('.egg_setting_push_btn')[0];
                    const active = schedule.classList.contains('active');
                    schedule.classList.toggle('active', !active);
                    btn.classList.toggle('active', active);
                },
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, [
                createNSElementNode('path', undefined, {
                    d: 'M825.571556 176.355556c68.778667 0 124.472889 55.751111 124.472888 124.416v422.456888c0 68.721778-55.751111 124.416-124.472888 124.416H198.485333A124.416 124.416 0 0 1 73.955556 723.171556V300.828444C73.955556 232.106667 129.706667 176.355556 198.428444 176.355556zM893.155556 358.456889l-366.08 228.864a28.444444 28.444444 0 0 1-25.372445 2.389333l-4.778667-2.389333L130.844444 358.456889v364.771555c0 34.929778 26.567111 63.715556 60.643556 67.128889l6.883556 0.398223h627.2c37.319111 0 67.584-30.264889 67.584-67.584V358.513778zM825.571556 233.244444H198.485333c-34.304 0-62.577778 25.486222-67.015111 58.595556L512 529.635556l380.586667-237.795556A67.584 67.584 0 0 0 825.628444 233.244444z',
                }),
            ])),
        ]),
        // 开始按钮
        login
            ? createElementNode('div', undefined, { class: 'egg_study_item' }, createElementNode('button', undefined, {
                class: 'egg_study_btn loading',
                type: 'button',
                disabled: true,
            }, createTextNode('等待中')))
            : undefined,
        createElementNode('div', undefined, { class: 'egg_schedule_settings_item' }, SchedulePanel({ scheduleList })),
    ]));
}
/**
 * @description 分数详情
 */
function ScoreInfo({ login }) {
    if (login) {
        // 分数信息
        return createElementNode('div', undefined, { class: 'egg_scoreinfo' }, [
            createElementNode('div', undefined, {
                class: 'egg_totalscore',
            }, [
                createTextNode('总积分'),
                createElementNode('span', undefined, undefined, createTextNode(0)),
            ]),
            createElementNode('div', undefined, {
                class: 'egg_todayscore',
            }, [
                createElementNode('button', undefined, {
                    type: 'button',
                    class: 'egg_todayscore_btn',
                    title: '查看分数详情',
                    onclick: () => {
                        const scoreDetails = $$('.egg_score_details')[0];
                        if (scoreDetails) {
                            const exists = scoreDetails.classList.contains('hide');
                            scoreDetails.classList.toggle('hide', !exists);
                        }
                    },
                    onblur: () => {
                        // 积分详情
                        const scoreDetails = $$('.egg_score_details')[0];
                        if (scoreDetails) {
                            const exists = scoreDetails.classList.contains('hide');
                            if (!exists) {
                                scoreDetails.classList.add('hide');
                            }
                        }
                    },
                }, [
                    createTextNode('当天分数'),
                    // 当天分数
                    createElementNode('span', undefined, undefined, createTextNode(0)),
                    // icon
                    createNSElementNode('svg', undefined, {
                        viewBox: '0 0 1024 1024',
                        class: 'egg_icon',
                    }, createNSElementNode('path', undefined, {
                        d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
                    })),
                    createElementNode('div', undefined, {
                        class: 'egg_score_details hide',
                    }, [
                        createElementNode('div', undefined, { class: 'egg_score_title' }, [
                            createNSElementNode('svg', undefined, {
                                viewBox: '0 0 1024 1024',
                                class: 'egg_icon',
                            }, [
                                createNSElementNode('path', undefined, {
                                    d: 'M314.81 304.01h415.86v58.91H314.81zM314.81 440.24h415.86v58.91H314.81z',
                                }),
                                createNSElementNode('path', undefined, {
                                    d: 'M814.8 892.74h-8.64l-283.51-182-283.51 182h-8.64A69.85 69.85 0 0 1 160.72 823V188.22a69.85 69.85 0 0 1 69.77-69.77H814.8a69.85 69.85 0 0 1 69.77 69.77V823a69.85 69.85 0 0 1-69.77 69.74zM230.5 177.35a10.87 10.87 0 0 0-10.86 10.86V823a10.86 10.86 0 0 0 5 9.11l298.01-191.42 298.06 191.38a10.86 10.86 0 0 0 5-9.11V188.22a10.87 10.87 0 0 0-10.86-10.86z',
                                }),
                            ]),
                            createElementNode('div', undefined, {
                                class: 'egg_score_title_text',
                            }, createTextNode('积分详情')),
                        ]),
                        ...tasks.map((task) => createElementNode('div', undefined, { class: 'egg_score_item' }, [
                            createTextNode(task.title),
                            createElementNode('span', { innerText: task.currentScore }, {
                                class: 'egg_score_detail',
                            }),
                        ])),
                    ]),
                ]),
            ]),
        ]);
    }
}
/**
 * @description 任务窗口
 * @returns
 */
function Frame() {
    // 容器
    return createElementNode('div', undefined, {
        class: 'egg_frame_wrap hide',
    }, [
        // 遮罩
        createElementNode('div', undefined, { class: 'egg_frame_mask' }),
        // 窗口内容
        createElementNode('div', undefined, { class: 'egg_frame_content_wrap' }, [
            // 窗口控制
            createElementNode('div', undefined, { class: 'egg_frame_controls_wrap' }, [
                // 标题
                createElementNode('div', undefined, { class: 'egg_frame_title' }),
                createElementNode('div', undefined, {
                    class: 'egg_frame_controls',
                }, [
                    // 隐藏
                    createElementNode('button', undefined, {
                        class: 'egg_frame_btn',
                        type: 'button',
                        onclick: () => {
                            // 隐藏窗口
                            setFrameVisible(false);
                        },
                    }, createNSElementNode('svg', undefined, {
                        viewBox: '0 0 1024 1024',
                        class: 'egg_icon',
                    }, createNSElementNode('path', undefined, {
                        d: 'M863.7 552.5H160.3c-10.6 0-19.2-8.6-19.2-19.2v-41.7c0-10.6 8.6-19.2 19.2-19.2h703.3c10.6 0 19.2 8.6 19.2 19.2v41.7c0 10.6-8.5 19.2-19.1 19.2z',
                    }))),
                    // 改变大小
                    createElementNode('button', undefined, {
                        class: 'egg_frame_btn',
                        type: 'button',
                        onclick: () => {
                            const content = $$('.egg_frame_content_wrap')[0];
                            if (content) {
                                const exists = content.classList.contains('max');
                                content.classList.toggle('max', !exists);
                            }
                        },
                    }, createNSElementNode('svg', undefined, {
                        viewBox: '0 0 1024 1024',
                        class: 'egg_icon',
                    }, createNSElementNode('path', undefined, {
                        d: 'M609.52 584.92a35.309 35.309 0 0 1 24.98-10.36c9.37 0 18.36 3.73 24.98 10.36l189.29 189.22-0.07-114.3 0.57-6.35c3.25-17.98 19.7-30.5 37.9-28.85 18.2 1.65 32.12 16.92 32.09 35.2v200.23c-0.05 1.49-0.19 2.97-0.42 4.45l-0.21 1.13c-0.22 1.44-0.55 2.85-0.99 4.24l-0.57 1.62-0.56 1.41a34.163 34.163 0 0 1-7.62 11.36l2.12-2.4-0.14 0.14-0.92 1.06-1.06 1.2-0.57 0.57-0.56 0.57a36.378 36.378 0 0 1-16.23 8.39l-3.53 0.5-4.02 0.35h-199.6l-6.35-0.63c-16.73-3.06-28.9-17.63-28.93-34.64l0.56-6.35c3.07-16.76 17.67-28.93 34.71-28.92l114.29-0.14-189.07-189.1-4.09-4.94c-9.71-14.01-8.01-32.95 4.02-45.02z m-162.06 0c12.06 12.05 13.78 30.99 4.09 45.01l-4.09 4.94-189.15 189.08 114.3 0.14c17.04-0.01 31.65 12.17 34.71 28.92l0.57 6.35c-0.03 17.01-12.19 31.58-28.92 34.64l-6.35 0.63H173.09l-4.23-0.42-3.39-0.49a36.38 36.38 0 0 1-17.36-9.52l-1.06-1.13-0.98-1.13 0.98 1.06-1.97-2.26 0.85 1.06-0.42-0.56a35.137 35.137 0 0 1-3.74-5.64l-1.13-2.68a34.71 34.71 0 0 1-2.11-7.33l-0.28-1.13c-0.21-1.47-0.33-2.96-0.36-4.45V659.78c-0.03-18.28 13.89-33.55 32.09-35.2 18.2-1.65 34.65 10.87 37.9 28.85l0.57 6.35-0.07 114.36 189.29-189.22c13.77-13.77 36.11-13.77 49.88 0h-0.09z m-74.71-471.71l6.35 0.57c16.76 3.06 28.93 17.67 28.92 34.71l-0.63 6.35c-3.07 16.76-17.67 28.93-34.71 28.92l-114.3 0.14 189.15 189.08 4.09 4.94c10.26 15.02 7.42 35.37-6.55 47.01-13.98 11.63-34.51 10.74-47.42-2.07L208.29 233.71l0.07 114.3-0.57 6.35c-3.25 17.98-19.7 30.5-37.9 28.85-18.2-1.65-32.12-16.92-32.09-35.2V147.78c0-1.55 0.14-3.03 0.35-4.51l0.21-1.13c0.24-1.44 0.59-2.85 1.06-4.23a34.97 34.97 0 0 1 8.68-14.39l-2.12 2.4-0.42 0.57 1.55-1.84-0.99 1.06 0.92-0.98 2.26-2.33c3.04-2.73 6.52-4.92 10.3-6.49l2.82-1.06c3.45-1.07 7.04-1.62 10.65-1.62l-3.6 0.14h0.49l1.48-0.14h201.31z m512.91 0l1.41 0.14h0.42c2.43 0.29 4.84 0.79 7.19 1.48l2.82 1.06 2.61 1.2 3.04 1.76c2.09 1.33 4.03 2.89 5.78 4.66l1.13 1.2 0.78 0.98 0.21 0.14 0.49 0.64 2.33 3.17c2.35 3.83 3.98 8.07 4.8 12.49l0.21 1.13c0.21 1.48 0.35 2.96 0.35 4.44v200.37c-0.16 18.13-14.03 33.19-32.08 34.83-18.06 1.64-34.42-10.67-37.83-28.48l-0.57-6.35V233.65L659.54 422.87c-12.9 12.95-33.56 13.91-47.59 2.2-14.04-11.71-16.81-32.2-6.38-47.22l4.02-4.86 189.22-189.08-114.29-0.14c-17.06 0.04-31.71-12.14-34.78-28.92l-0.63-6.35c-0.01-17.04 12.16-31.65 28.93-34.71l6.35-0.57h201.27z m0 0',
                    }))),
                    // 关闭
                    createElementNode('button', undefined, {
                        class: 'egg_frame_btn',
                        type: 'button',
                        onclick: () => {
                            // 关闭窗口
                            closeFrame();
                        },
                    }, createNSElementNode('svg', undefined, {
                        viewBox: '0 0 1024 1024',
                        class: 'egg_icon',
                    }, createNSElementNode('path', undefined, {
                        d: 'M453.44 512L161.472 220.032a41.408 41.408 0 0 1 58.56-58.56L512 453.44 803.968 161.472a41.408 41.408 0 0 1 58.56 58.56L570.56 512l291.968 291.968a41.408 41.408 0 0 1-58.56 58.56L512 570.56 220.032 862.528a41.408 41.408 0 0 1-58.56-58.56L453.44 512z',
                    }))),
                ]),
            ]),
            // 窗口内容
            createElementNode('div', undefined, {
                class: 'egg_frame_content',
            }, createElementNode('iframe', undefined, {
                class: 'egg_frame',
            })),
        ]),
    ]);
}
/**
 * @description 时间输入
 * @returns
 */
function TimeInput({ onchange, onblur, }) {
    let hour = '';
    let minute = '';
    return createElementNode('div', undefined, { class: 'egg_time_input' }, [
        createElementNode('div', undefined, { class: 'egg_hour_wrap' }, [
            createElementNode('input', undefined, {
                placeholder: '12',
                class: 'egg_hour',
                type: 'text',
                maxlength: '2',
                onfocus: () => {
                    // 显示列表
                    const list = $$('.egg_hour_wrap .egg_list')[0];
                    list.classList.remove('hide');
                    // 显示正在选择
                    const times = $$('.egg_hour_wrap .egg_time');
                    const time = times.find((time) => hour && time.textContent?.includes(hour));
                    if (time) {
                        list.scrollTop = time.offsetTop;
                    }
                    times.forEach((t) => t.classList.toggle('focus', t === time));
                },
                oninput: (e) => {
                    const h = e.target.value.trim();
                    if (/^[0-9]$/.test(h)) {
                        hour = formatDateNum(Number(h));
                    }
                    else {
                        hour = h;
                    }
                    const times = $$('.egg_hour_wrap .egg_time');
                    const list = $$('.egg_hour_wrap .egg_list')[0];
                    const time = times.find((time) => hour && time.textContent?.includes(hour));
                    if (time) {
                        list.scrollTop = time.offsetTop;
                    }
                    times.forEach((t) => t.classList.toggle('focus', t === time));
                    // 更改事件
                    onchange &&
                        onchange({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
                onblur: (e) => {
                    const h = e.target.value.trim();
                    if (h && !/^([01][0-9]|[2][0-3])$/.test(h)) {
                        if (/^[0-9]$/.test(h)) {
                            e.target.value = hour;
                        }
                        else {
                            // 默认值
                            e.target.value = '';
                            hour = '';
                            // 移除样式
                            const times = $$('.egg_hour_wrap .egg_time');
                            times.forEach((t) => t.classList.remove('focus'));
                            // 更改事件
                            onchange &&
                                onchange({
                                    hour,
                                    minute,
                                    valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                        /^[0-5][0-9]$/.test(minute),
                                });
                        }
                    }
                    // 隐藏列表
                    const list = $$('.egg_hour_wrap .egg_list')[0];
                    setTimeout(() => {
                        list.classList.add('hide');
                    }, 100);
                    // 失去焦点
                    onblur &&
                        onblur({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
            }),
            createElementNode('div', undefined, { class: 'egg_list hide' }, new Array(24).fill(undefined).map((v, i) => createElementNode('div', undefined, {
                class: 'egg_time',
                onclick: (e) => {
                    const time = e.target;
                    const list = $$('.egg_hour_wrap .egg_list')[0];
                    const input = $$('.egg_hour')[0];
                    hour = time.textContent || '';
                    input.value = hour;
                    list.scrollTop = time.offsetTop;
                    // 更改事件
                    onchange &&
                        onchange({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
            }, createTextNode(formatDateNum(i))))),
        ]),
        createElementNode('span', undefined, undefined, createTextNode(':')),
        createElementNode('div', undefined, { class: 'egg_minute_wrap' }, [
            createElementNode('input', undefined, {
                placeholder: '00',
                class: 'egg_minute',
                type: 'text',
                maxlength: '2',
                onfocus: () => {
                    // 显示列表
                    const list = $$('.egg_minute_wrap .egg_list')[0];
                    list.classList.remove('hide');
                    // 显示正在选择
                    const times = $$('.egg_minute_wrap .egg_time');
                    const time = times.find((time) => minute && time.textContent?.includes(minute));
                    if (time) {
                        list.scrollTop = time.offsetTop;
                    }
                    times.forEach((t) => t.classList.toggle('focus', t === time));
                },
                oninput: (e) => {
                    const min = e.target.value.trim();
                    if (/^[0-9]$/.test(min)) {
                        minute = formatDateNum(Number(min));
                    }
                    else {
                        minute = min;
                    }
                    const times = $$('.egg_minute_wrap .egg_time');
                    const list = $$('.egg_minute_wrap .egg_list')[0];
                    const time = times.find((time) => minute && time.textContent?.includes(minute));
                    if (time) {
                        list.scrollTop = time.offsetTop;
                    }
                    times.forEach((t) => t.classList.toggle('focus', t === time));
                    // 更改事件
                    onchange &&
                        onchange({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
                onblur: (e) => {
                    const min = e.target.value.trim();
                    if (min && !/^[0-5][0-9]$/.test(min)) {
                        if (/^[0-9]$/.test(min)) {
                            e.target.value = minute;
                        }
                        else {
                            // 默认值
                            e.target.value = '';
                            minute = '';
                            // 移除样式
                            const times = $$('.egg_minute_wrap .egg_time');
                            times.forEach((t) => t.classList.remove('focus'));
                            // 更改事件
                            onchange &&
                                onchange({
                                    hour,
                                    minute,
                                    valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                        /^[0-5][0-9]$/.test(minute),
                                });
                        }
                    }
                    // 隐藏列表
                    const list = $$('.egg_minute_wrap .egg_list')[0];
                    setTimeout(() => {
                        list.classList.add('hide');
                    }, 100);
                    // 失去焦点
                    onblur &&
                        onblur({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
            }),
            createElementNode('div', undefined, { class: 'egg_list hide' }, new Array(60).fill(undefined).map((v, i) => createElementNode('div', undefined, {
                class: 'egg_time',
                onclick: (e) => {
                    const times = $$('.egg_minute_wrap .egg_time');
                    const time = e.target;
                    const list = $$('.egg_minute_wrap .egg_list')[0];
                    const input = $$('.egg_minute')[0];
                    minute = time.textContent || '';
                    input.value = minute;
                    list.scrollTop = time.offsetTop;
                    times.forEach((t) => t.classList.toggle('focus', t === time));
                    // 更改事件
                    onchange &&
                        onchange({
                            hour,
                            minute,
                            valid: /^([01][0-9]|[2][0-3])$/.test(hour) &&
                                /^[0-5][0-9]$/.test(minute),
                        });
                },
            }, createTextNode(formatDateNum(i))))),
        ]),
    ]);
}
/**
 * @description 定时任务组件
 * @returns
 */
function SchedulePanel({ scheduleList }) {
    // token
    let token = '';
    // 小时
    let hour = '';
    // 分钟
    let minute = '';
    // 时间
    let time = '';
    return createElementNode('div', undefined, { class: 'egg_schedule' }, [
        createElementNode('div', undefined, { class: 'egg_schedule_add' }, [
            settings[SettingType.REMOTE_PUSH]
                ? createElementNode('div', undefined, { class: 'egg_schedule_token_wrap' }, [
                    createElementNode('div', undefined, { class: 'egg_schedule_token' }, [
                        createElementNode('div', undefined, { class: 'egg_schedule_label' }, createTextNode('我的 token')),
                        createElementNode('input', undefined, {
                            class: 'egg_schedule_token_input',
                            placeholder: '用户 token',
                            maxlength: 32,
                            value: pushToken,
                            onfocus: (e) => {
                                const input = e.target;
                                input.classList.add('active');
                                const btnWrap = $$('.egg_schedule_submit_btn_wrap')[0];
                                btnWrap.classList.add('active');
                            },
                            oninput: (e) => {
                                const input = e.target;
                                // 去除空格
                                const value = input.value.trim();
                            },
                            onblur: (e) => {
                                const input = e.target;
                                // 去除空格
                                const value = input.value.trim();
                                if (/^[0-9a-z]{32}$/.test(value)) {
                                    token = value;
                                    input.value = value;
                                }
                                else {
                                    token = '';
                                }
                                input.classList.remove('active');
                                setTimeout(() => {
                                    const btnWrap = $$('.egg_schedule_submit_btn_wrap')[0];
                                    btnWrap.classList.remove('active');
                                }, 100);
                            },
                        }),
                    ]),
                    createElementNode('div', undefined, { class: 'egg_schedule_submit_btn_wrap' }, createElementNode('button', undefined, {
                        class: 'egg_schedule_submit_btn',
                        onclick: () => {
                            // 提示
                            createTip('用户 token 已保存!');
                            if (token !== pushToken) {
                                pushToken = token;
                                // 存储
                                GM_setValue('pushToken', token);
                            }
                        },
                    }, createTextNode('保存'))),
                ])
                : undefined,
            createElementNode('div', undefined, { class: 'egg_schedule_time_wrap' }, [
                createElementNode('div', undefined, { class: 'egg_schedule_time' }, [
                    createElementNode('div', undefined, { class: 'egg_schedule_label' }, createTextNode('设置时间')),
                    createElementNode('div', undefined, { class: 'egg_schedule_time_input_wrap' }, [
                        TimeInput({
                            onchange: (e) => {
                                const { valid, hour: h, minute: min } = e;
                                if (valid) {
                                    hour = h;
                                    minute = min;
                                    time = `${hour}:${minute}`;
                                }
                                else {
                                    hour = '';
                                    minute = '';
                                    time = '';
                                }
                            },
                        }),
                        createElementNode('button', undefined, {
                            class: 'egg_schedule_add_btn',
                            onclick: () => {
                                if (!time) {
                                    createTip('时间格式不符合要求!');
                                    return;
                                }
                                // 重复定时存在
                                const exists = scheduleList.find((schedule) => time && schedule.time === time);
                                if (exists) {
                                    createTip('设置定时任务重复!');
                                    return;
                                }
                                createTip('设置定时任务成功!');
                                // 添加
                                scheduleList.push({
                                    time,
                                    hour: Number(hour),
                                    minute: Number(minute),
                                });
                                // 排序
                                scheduleList.sort((a, b) => a.hour === b.hour ? a.minute - b.minute : a.hour - b.hour);
                                // 存储
                                GM_setValue('scheduleList', JSON.stringify(scheduleList));
                                // 清空
                                const inputs = $$('.egg_time_input input');
                                inputs.forEach((i) => (i.value = ''));
                                // 重新渲染
                                const list = $$('.egg_schedule_list')[0];
                                const scheduleEle = $$('.egg_schedule')[0];
                                list.remove();
                                scheduleEle.append(ScheduleList({ scheduleList }));
                                // 刷新任务
                                refreshScheduleTask();
                            },
                        }, createNSElementNode('svg', undefined, {
                            viewBox: '0 0 1024 1024',
                            class: 'egg_icon',
                        }, createNSElementNode('path', undefined, {
                            d: 'M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z',
                        }))),
                    ]),
                ]),
            ]),
        ]),
        ScheduleList({ scheduleList }),
    ]);
}
/**
 * @description 定时项目
 * @returns
 */
function ScheduleList({ scheduleList }) {
    return createElementNode('div', undefined, { class: 'egg_schedule_list' }, scheduleList.map((schedule, i) => createElementNode('div', undefined, { class: 'egg_schedule_item' }, [
        createElementNode('div', undefined, {
            class: `egg_schedule_detail_time_wrap${isLate(schedule) ? ' inactive' : ''}`,
        }, [
            createElementNode('div', undefined, {
                class: 'egg_schedule_detail_icon',
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, [
                createNSElementNode('path', undefined, {
                    d: 'M810.137703 213.860762c-164.388001-164.4187-431.887404-164.4187-596.277452 0-164.417677 164.388001-164.417677 431.889451 0 596.278475 164.390048 164.417677 431.890474 164.417677 596.277452 0C974.557426 645.750213 974.557426 378.248763 810.137703 213.860762zM767.347131 767.345596c-140.797723 140.829446-369.927237 140.797723-510.693238 0-140.828422-140.797723-140.828422-369.895515 0-510.708588 140.767024-140.783397 369.896538-140.813073 510.693238 0C908.14383 397.420405 908.14383 626.578572 767.347131 767.345596z',
                }),
                createNSElementNode('path', undefined, {
                    d: 'M721.450824 521.495258 515.404028 521.495258l0.028653-227.948619c0-15.124466-12.362562-27.458375-27.501354-27.458375s-27.443026 12.33391-27.443026 27.458375l0 235.115855c0 0.835018-1.013073 20.48659 12.094456 34.459836 8.331759 8.809643 20.038382 13.288654 35.148521 13.288654l213.720569 0.031722c15.140839 0 27.472702-12.304234 27.472702-27.474748C748.922503 533.887496 736.620315 521.584286 721.450824 521.495258z',
                }),
            ])),
            createElementNode('div', undefined, { class: 'egg_schedule_detail_time' }, createTextNode(schedule.time)),
        ]),
        createElementNode('div', undefined, { class: 'egg_schedule_detail_del_wrap' }, [
            createElementNode('button', undefined, {
                class: 'egg_schedule_del_btn',
                onclick: () => {
                    // 索引
                    const index = scheduleList.findIndex((s) => s === schedule);
                    // 删除元素
                    scheduleList.splice(index, 1);
                    // 存储
                    GM_setValue('scheduleList', JSON.stringify(scheduleList));
                    // 重新渲染
                    const list = $$('.egg_schedule_list')[0];
                    const scheduleEle = $$('.egg_schedule')[0];
                    list.remove();
                    scheduleEle.append(ScheduleList({ scheduleList }));
                    // 刷新任务
                    refreshScheduleTask();
                },
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, [
                createNSElementNode('path', undefined, {
                    d: 'M896.22 896.22c14.262-14.263 11.263-40.449-6.583-58.295L230.473 178.76c-17.847-17.847-44.105-20.846-58.295-6.583-14.263 14.19-11.264 40.448 6.583 58.295l659.164 659.164c17.846 17.846 44.032 20.845 58.294 6.582',
                }),
                createNSElementNode('path', undefined, {
                    d: 'M172.178 896.22c-14.263-14.263-11.264-40.449 6.583-58.295L837.925 178.76c17.846-17.847 44.032-20.846 58.294-6.583 14.263 14.19 11.264 40.448-6.582 58.295L230.4 889.637c-17.847 17.846-44.105 20.845-58.295 6.582',
                }),
            ])),
        ]),
    ])));
}
/* 组件化结束 */
/**
 * @description load
 */
window.addEventListener('load', () => {
    console.log('正在加载脚本...');
    // 主页
    if (URL_CONFIG.home.test(href)) {
        // 页面提示
        console.log('进入主页面!');
        // 等待加载
        const ready = setInterval(() => {
            if ($$('.text-wrap')[0]) {
                window.addEventListener('beforeunload', () => {
                    // 全局暂停
                    if (GM_getValue('pauseStudy') !== false) {
                        GM_setValue('pauseStudy', false);
                    }
                });
                // 停止定时器
                clearInterval(ready);
                // 设置字体
                initFontSize();
                // 初始化设置
                initSetting();
                // 初始化推送 token
                initPushToken();
                // 初始化定时任务
                initScheduleList();
                // 初始化二维码推送
                initQRCodePush();
                // 渲染提示
                renderTip();
                // 渲染面板
                renderPanel();
                // 渲染窗口
                renderFrame();
            }
        }, 800);
        return;
    }
    // 文章选读
    if (typeof GM_getValue('readingUrl') === 'string' &&
        href === GM_getValue('readingUrl')) {
        // 页面提示
        console.log('进入文章选读页面!');
        // 初始化设置
        initSetting();
        // 设置字体
        initFontSize();
        // 初始化 id
        initFrameID();
        // 渲染提示
        renderTip();
        reading(0);
        return;
    }
    // 视听学习页面
    if (typeof GM_getValue('watchingUrl') === 'string' &&
        href === GM_getValue('watchingUrl')) {
        // 页面提示
        console.log('进入视听学习页面!');
        // 初始化设置
        initSetting();
        // 设置字体
        initFontSize();
        // 初始化 id
        initFrameID();
        // 渲染提示
        renderTip();
        let randNum = 0;
        const checkVideoPlayingInterval = setInterval(() => {
            let temp = getVideoTag();
            if (temp.video) {
                if (!temp.video.muted) {
                    temp.video.muted = true;
                }
                if (temp.video.paused) {
                    console.log('正在尝试播放视频...');
                    if (randNum === 0) {
                        // 尝试使用js的方式播放
                        try {
                            temp.video.play(); // 尝试使用js的方式播放
                        }
                        catch (e) { }
                        randNum++;
                    }
                    else {
                        try {
                            temp.pauseButton?.click(); // 尝试点击播放按钮播放
                        }
                        catch (e) { }
                        randNum--;
                    }
                }
                else {
                    console.log('视频成功播放!');
                    clearInterval(checkVideoPlayingInterval);
                    reading(1);
                }
            }
            else {
                console.log('等待加载...');
            }
        }, 800);
        return;
    }
    // 答题页面
    if (href.includes(URL_CONFIG.examPaper) ||
        href.includes(URL_CONFIG.examPractice)) {
        // 页面提示
        console.log('进入答题页面!');
        // 初始化设置
        initSetting();
        // 设置字体
        initFontSize();
        // 初始化 id
        initFrameID();
        // 渲染提示
        renderTip();
        // 答题页面
        const ready = setInterval(() => {
            if ($$('.title')[0]) {
                clearInterval(ready); // 停止定时器
                // 创建“手动答题”按钮
                renderExamBtn();
                // 开始答题
                doingExam();
            }
        }, 500);
        return;
    }
    // 登录页
    if (href === URL_CONFIG.login) {
        // 初始化设置
        initSetting();
        // 初始化二维码刷新
        initQRCodeRefresh();
        return;
    }
    console.log('此页面不支持加载学习脚本!');
});
/**
 * @description 获取关键字
 */
function getKey(content) {
    // 外部引用md5加密
    const key = md5(content);
    console.log(`获取 key:${key}`);
    return key;
}
/**
 * @description 初始化配置
 */
function initSetting() {
    try {
        const settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp && settingTemp.length === settings.length) {
            settings = settingTemp;
        }
    }
    catch (e) {
        // 没有则直接初始化
        settings = defaultSettings;
    }
}
/**
 * @description 初始化配置
 */
function initPushToken() {
    try {
        const tokenTemp = GM_getValue('pushToken');
        if (tokenTemp) {
            pushToken = tokenTemp;
        }
    }
    catch (e) {
        // 没有则直接初始化
        pushToken = '';
    }
}
/**
 * @description 初始化定时任务
 */
function initScheduleList() {
    if (settings[SettingType.SCHEDULE_RUN]) {
        try {
            const scheduleTemp = JSON.parse(GM_getValue('scheduleList'));
            if (scheduleTemp) {
                scheduleList = scheduleTemp;
            }
        }
        catch (e) {
            // 没有则直接初始化
            scheduleList = [];
        }
        // 刷新定时任务
        refreshScheduleTask();
    }
}
/**
 * @description 初始化配置
 */
function initFontSize() {
    // 移动端
    const moblie = hasMobile();
    if (moblie) {
        // 清除缩放
        const meta = $$('meta[name=viewport]')[0];
        if (meta) {
            meta.content = 'initial-scale=0, user-scalable=yes';
        }
        // 缩放比例
        const scale = ~~(window.innerWidth / window.outerWidth) || 1;
        document.documentElement.style.setProperty('--scale', String(scale));
        window.addEventListener('resize', () => {
            // 缩放比例
            const scale = ~~(window.innerWidth / window.outerWidth) || 1;
            document.documentElement.style.setProperty('--scale', String(scale));
        });
    }
}
/**
 * @description 初始化 id
 */
function initFrameID() {
    if (settings[SettingType.SAME_TAB]) {
        const win = unsafeWindow;
        win.addEventListener('message', (msg) => {
            const { data } = msg;
            if (data.id) {
                id = data.id;
                console.log('初始化窗口 ID: ', id);
            }
        });
    }
}
/**
 * @description 初始化二维码推送
 */
function initQRCodePush() {
    window.addEventListener('message', async (e) => {
        const { data } = e;
        if (data && data.type === 'qrcode') {
            if (pushToken) {
                // src
                const { src } = data;
                const imgWrap = getImgHTML(src);
                const res = await pushModal({
                    title: '登录推送',
                    content: ['扫一扫, 登录学习强国!', imgWrap],
                    type: 'info',
                }, pushToken);
                if (res && res.code === 200) {
                    createTip('登录推送成功!');
                    return;
                }
                createTip('登录推送失败!');
                return;
            }
            createTip('请检查用户 token 是否存在!');
        }
    });
}
/**
 * @description 初始化二维码刷新
 */
function initQRCodeRefresh() {
    window.addEventListener('message', (e) => {
        const { data } = e;
        if (data) {
            // 刷新
            if (data.type === 'refresh_qrcode') {
                // 点击刷新
                const btn = $$('.login_qrcode_refresh span')[0];
                btn && btn.click();
            }
            // 是否开启推送
            if (settings[SettingType.REMOTE_PUSH]) {
                // 推送二维码
                if (data.type === 'load_qrcode') {
                    // 等待加载完成
                    const timer = setInterval(() => {
                        // 登录二维码
                        const img = $$('.login_qrcode img')[0];
                        if (img && img.src) {
                            clearInterval(timer);
                            window.parent.postMessage({ type: 'qrcode', src: img.src }, URL_CONFIG.homeOrigin);
                        }
                    }, 100);
                    // 点击刷新
                    const btn = $$('.login_qrcode_refresh span')[0];
                    if (btn) {
                        btn.addEventListener('click', () => {
                            // 等待加载完成
                            const timer = setInterval(() => {
                                // 登录二维码
                                const img = $$('.login_qrcode img')[0];
                                if (img && img.src) {
                                    clearInterval(timer);
                                    window.parent.postMessage({ type: 'qrcode', src: img.src }, URL_CONFIG.homeOrigin);
                                }
                            }, 100);
                        });
                    }
                }
            }
        }
    });
}
/**
 * @description 渲染答题按钮
 */
function renderExamBtn() {
    const title = $$('.title')[0];
    // 插入节点
    title.parentNode?.insertBefore(createElementNode('button', { innerText: '关闭自动答题' }, {
        class: 'egg_exam_btn',
        type: 'button',
        onclick: () => {
            const ExamBtn = $$('.egg_exam_btn')[0];
            pause = !pause;
            if (pause) {
                ExamBtn.innerText = '开启自动答题';
                ExamBtn.classList.add('manual');
            }
            else {
                ExamBtn.innerText = '关闭自动答题';
                ExamBtn.classList.remove('manual');
            }
        },
    }), title.nextSibling);
}
/**
 * @description 渲染面板
 * @returns
 */
async function renderPanel() {
    // 面板
    const panel = Panel();
    // 插入节点
    document.body.append(panel);
    // 已经登录
    if (login) {
        // 刷新信息
        await refreshInfo();
        // 完成任务
        if (tasks.every((task, i) => !settings[i] || task.status)) {
            finishTask();
            console.log('已完成');
            // 提示
            createTip('完成学习!');
            // 学习推送
            if (settings[SettingType.REMOTE_PUSH]) {
                // 总分
                const totalScoreSpan = $$('.egg_totalscore span')[0];
                //  当天分数
                const todayScoreSpan = $$('.egg_todayscore_btn span')[0];
                pushModal({
                    title: '学习推送',
                    content: [
                        '学习强国, 学习完成!',
                        `当天积分:  ${getHighlightHTML(totalScoreSpan.innerText)} 分`,
                        `总积分: ${getHighlightHTML(todayScoreSpan.innerText)} 分`,
                        ...tasks.map((task) => getProgressHTML(task.title, task.percent)),
                    ],
                    type: 'success',
                }, pushToken);
            }
            // 定时任务
            if (settings[SettingType.SCHEDULE_RUN]) {
                // 创建提示
                const tip = createTip('即将退出登录', 5);
                // 等待倒计时结束
                await tip.waitCountDown();
                // 退出登录
                const logged = $$("a[class='logged-link']")[0];
                logged && logged.click();
            }
            return;
        }
        // 开始学习按钮
        const studyBtn = $$('.egg_study_btn')[0];
        if (studyBtn) {
            studyBtn.removeAttribute('disabled');
            studyBtn.classList.remove('loading');
            studyBtn.innerText = '开始学习';
            studyBtn.addEventListener('click', start);
        }
    }
    // 自动答题
    if (login && settings[SettingType.AUTO_START]) {
        // 创建提示
        const tip = createTip('即将自动开始任务', 5);
        // 等待倒计时结束
        await tip.waitCountDown();
        // 再次查看是否开启
        if (settings[SettingType.AUTO_START] && !started) {
            // 创建提示
            createTip('自动开始任务');
            start();
        }
        else {
            // 创建提示
            createTip('已取消自动开始任务!');
        }
    }
}
/**
 * @description 渲染窗口
 */
function renderFrame() {
    if (settings[SettingType.SAME_TAB]) {
        const frame = Frame();
        document.body.append(frame);
    }
}
/**
 * @description 渲染提示
 */
function renderTip() {
    const tipWrap = createElementNode('div', undefined, {
        class: 'egg_tip_wrap',
    });
    document.body.append(tipWrap);
}
/**
 * @description 刷新登录二维码
 */
async function refreshLoginQRCode() {
    // 是否超出次数
    if (refreshCount >= maxRefreshCount) {
        createTip('超过最大重试次数, 登录失败!');
        // 重置刷新数
        refreshCount = 0;
        // 隐藏二维码
        setLoginVisible(false);
        // 清除刷新
        clearInterval(refreshTimer);
        // 推送
        if (settings[SettingType.REMOTE_PUSH]) {
            pushModal({
                title: '登录推送',
                content: '超过最大重试次数, 登录失败!',
                type: 'fail',
            }, pushToken);
        }
        return;
    }
    // 配置
    const frameItem = $$('.egg_login_frame_item')[0];
    // 窗口
    const iframe = $$('.egg_login_frame_wrap .egg_login_frame')[0];
    if (frameItem) {
        // 刷新二维码
        console.log('刷新登录二维码!');
        iframe.contentWindow?.postMessage({ type: 'refresh_qrcode' }, URL_CONFIG.login);
        refreshCount++;
    }
}
/**
 * @description 刷新定时任务
 */
function refreshScheduleTask() {
    // 剩余定时任务
    const restList = scheduleList.filter((s) => !isLate(s));
    // 存在剩余任务
    if (restList.length) {
        const rest = restList[0];
        scheduleTimer = setInterval(() => {
            if (isNow(rest)) {
                clearInterval(scheduleTimer);
                // 加载二维码
                setLoginVisible(true);
            }
        }, 100);
        return;
    }
    // 无剩余任务
    if (scheduleList.length) {
        // 最新
        const lastest = scheduleList[0];
        scheduleTimer = setInterval(() => {
            if (isNow(lastest)) {
                clearInterval(scheduleTimer);
                // 加载二维码
                setLoginVisible(true);
            }
        }, 100);
    }
}
/**
 * @description 刷新信息
 */
async function refreshInfo() {
    // 登录
    if (login) {
        await refreshScoreInfo();
        await refreshTaskList();
    }
}
/**
 * @description 加载分数
 */
async function refreshScoreInfo() {
    console.log('加载分数...');
    // 获取总分
    const totalScore = await getTotalScore();
    // 获取当天总分
    const todayScore = await getTodayScore();
    // 总分
    const totalScoreSpan = $$('.egg_totalscore span')[0];
    //  当天分数
    const todayScoreSpan = $$('.egg_todayscore_btn span')[0];
    // 刷新分数
    if (totalScoreSpan && todayScoreSpan) {
        totalScoreSpan.innerText = totalScore;
        todayScoreSpan.innerText = todayScore;
    }
}
/**
 * @description 加载任务列表
 */
async function refreshTaskList() {
    console.log('加载任务进度...');
    // 原始任务进度
    const taskProgress = await getTaskList();
    if (taskProgress) {
        // 文章选读
        tasks[TaskType.READ].currentScore = taskProgress[0].currentScore;
        tasks[TaskType.READ].dayMaxScore = taskProgress[0].dayMaxScore;
        tasks[TaskType.READ].need =
            taskProgress[0].dayMaxScore - taskProgress[0].currentScore;
        // 视听学习
        tasks[TaskType.WATCH].currentScore =
            taskProgress[1].currentScore + taskProgress[2].currentScore;
        tasks[TaskType.WATCH].dayMaxScore =
            taskProgress[1].dayMaxScore + taskProgress[2].dayMaxScore;
        tasks[TaskType.WATCH].need =
            taskProgress[1].dayMaxScore +
                taskProgress[2].dayMaxScore -
                (taskProgress[1].currentScore + taskProgress[2].currentScore);
        // 每日答题
        tasks[TaskType.PRACTICE].currentScore = taskProgress[5].currentScore;
        tasks[TaskType.PRACTICE].dayMaxScore = taskProgress[5].dayMaxScore;
        tasks[TaskType.PRACTICE].need =
            taskProgress[5].dayMaxScore - taskProgress[5].currentScore;
        // 专项练习
        tasks[TaskType.PAPER].currentScore = taskProgress[4].currentScore;
        tasks[TaskType.PAPER].dayMaxScore = taskProgress[4].dayMaxScore;
        tasks[TaskType.PAPER].need =
            taskProgress[4].dayMaxScore - taskProgress[4].currentScore;
        // 详情
        const details = $$('.egg_score_details .egg_score_detail');
        // 进度条对象
        const taskProgressList = $$('.egg_progress');
        // 更新数据
        for (const i in tasks) {
            const { currentScore, dayMaxScore } = tasks[i];
            // 进度
            let rate = (100 * currentScore) / dayMaxScore;
            // 修复专项练习成组做完, 进度条显示异常
            if (dayMaxScore <= currentScore) {
                rate = 100;
                tasks[i].status = true;
            }
            if (rate >= 0) {
                // 进度条信息
                const progressInfo = taskProgressList[i];
                // 进度条
                const bar = $$('.egg_bar', progressInfo)[0];
                // 百分比
                const percent = $$('.egg_percent span', progressInfo)[0];
                if (bar && percent) {
                    // 进度
                    const progress = rate.toFixed(2);
                    // 长度
                    bar.style.width = `${progress}%`;
                    // 文字
                    percent.innerText = `${~~rate}`;
                    // 进度
                    tasks[i].percent = Number(progress);
                }
                // 设置详情
                if (details[i]) {
                    details[i].innerText = String(tasks[i].currentScore);
                }
            }
        }
        return;
    }
    // 再次请求
    await sleep(2000);
    await refreshTaskList();
}
/**
 * @description 设置登录二维码可见
 * @param show
 */
async function setLoginVisible(show) {
    // 加载二维码页面
    const iframe = $$('.egg_login_frame')[0];
    if (show && iframe.src !== URL_CONFIG.login) {
        const iframeItem = $$('.egg_login_frame_item')[0];
        iframeItem.classList.add('active');
        iframe.src = URL_CONFIG.login;
        return;
    }
    // 重置为不可见
    if (!show && iframe.src !== '') {
        const iframeItem = $$('.egg_login_frame_item')[0];
        iframeItem.classList.remove('active');
        iframe.src = '';
        clearInterval(refreshTimer);
    }
}
/**
 * @description 获取video标签
 */
function getVideoTag() {
    let iframe = $$('iframe')[0];
    let video;
    let pauseButton;
    const u = navigator.userAgent;
    if (u.indexOf('Mac') > -1) {
        // Mac
        if (iframe && iframe.innerHTML) {
            // 如果有iframe, 说明外面的video标签是假的
            video = iframe.contentWindow?.document.getElementsByTagName('video')[0];
            pauseButton = (iframe.contentWindow?.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton,
        };
    }
    else {
        if (iframe) {
            // 如果有iframe, 说明外面的video标签是假的
            video = (iframe.contentWindow?.document.getElementsByTagName('video')[0]);
            pauseButton = (iframe.contentWindow?.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton,
        };
    }
}
/**
 * @description 读新闻或者看视频
 * @param type :0为新闻,1为视频
 */
async function reading(type) {
    // 看文章或者视频
    let time = 1;
    if (type === 0) {
        // 80-100秒后关闭页面, 看文章
        time = ~~(Math.random() * 20 + 80) + 1;
    }
    if (type === 1) {
        // 100-150秒后关闭页面, 看视频
        time = ~~(Math.random() * 50 + 100) + 1;
    }
    // 第一次滚动时间
    let firstTime = time - 2;
    // 第二次滚动时间
    let secendTime = 12;
    // 创建提示
    const tip = createTip('距离关闭页面还剩', time, async (time) => {
        // 暂停锁
        await pauseStudyLock();
        if (time === firstTime) {
            // 滚动
            window.scrollTo(0, 394);
            // 模拟滚动
            const scroll = new Event('scroll', {
                bubbles: true,
            });
            document.dispatchEvent(scroll);
        }
        if (time === secendTime) {
            // 滚动长度
            const scrollLength = document.body.scrollHeight / 2;
            // 滚动
            window.scrollTo(0, scrollLength);
            // 模拟滚动
            const scroll = new Event('scroll', {
                bubbles: true,
            });
            document.dispatchEvent(scroll);
        }
    });
    // 倒计时结束
    await tip.waitCountDown();
    // 清空链接
    if (type === 0) {
        GM_setValue('readingUrl', null);
    }
    else {
        GM_setValue('watchingUrl', null);
    }
    // 关闭窗口
    closeWin(settings[SettingType.SAME_TAB], id);
}
/**
 * @description 创建学习提示
 */
function createTip(text, delay = 2, callback) {
    const tipWrap = $$('.egg_tip_wrap')[0];
    // 提前去除
    const tips = $$('.egg_tip');
    if (tips.length) {
        tips.forEach((t) => t.destroy());
    }
    // 倒计时
    const countdown = createElementNode('span', undefined, {
        class: 'egg_countdown',
    }, createTextNode(`${delay}s`));
    // 文本
    const span = createElementNode('span', {
        innerText: text,
    }, {
        class: 'egg_text',
    });
    // 销毁
    let destroyed = false;
    // 倒计时结束
    let done = false;
    // 倒计时
    const countDown = async () => {
        countdown.innerText = `${delay}s`;
        // 回调
        if (callback) {
            await callback(delay, operate);
        }
        // 倒计时结束
        if (!delay) {
            done = true;
            // 隐藏
            operate.hide();
            return;
        }
        delay--;
        setTimeout(countDown, 1000);
    };
    // 操作
    const operate = {
        async destroy() {
            if (!destroyed) {
                // 隐藏
                operate.hide();
                destroyed = true;
                setTimeout(() => {
                    tipInfo.remove();
                }, 300);
            }
        },
        hide() {
            if (!destroyed) {
                tipInfo.classList.remove('active');
            }
        },
        show() {
            if (!destroyed) {
                setTimeout(() => {
                    tipInfo.classList.add('active');
                }, 300);
            }
        },
        setText(text) {
            span.innerText = text;
        },
        waitCountDown() {
            return new Promise((resolve) => {
                // 计时器
                const timer = setInterval(() => {
                    // 结束
                    if (done) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 100);
            });
        },
    };
    // 提示
    const tipInfo = createElementNode('div', undefined, {
        class: 'egg_tip',
    }, [span, countdown]);
    Object.assign(tipInfo, operate);
    // 插入节点
    tipWrap.append(tipInfo);
    // 显示
    operate.show();
    // 倒计时
    countDown();
    return operate;
}
/**
 * @description 获取新闻列表
 */
function getNews() {
    return new Promise(async (resolve) => {
        // 需要学习的新闻数量
        const need = tasks[TaskType.READ].need < maxNewsNum
            ? tasks[TaskType.READ].need
            : maxNewsNum;
        console.log(`还需要看 ${need} 个新闻`);
        // 获取重要新闻
        const data = await getTodayNews();
        if (data && data.length) {
            // 数量补足需要数量
            while (news.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * data.length);
                // 新闻
                const item = data[randomIndex];
                // 是否存在新闻
                if (item.dataValid && item.type === 'tuwen') {
                    news.push(item);
                }
            }
        }
        else {
            news = [];
        }
        resolve('done');
    });
}
/**
 * @description 获取视频列表
 */
function getVideos() {
    return new Promise(async (resolve) => {
        // 需要学习的视频数量
        const need = tasks[TaskType.WATCH].need < maxVideoNum
            ? tasks[TaskType.WATCH].need
            : maxVideoNum;
        console.log(`还需要看 ${need} 个视频`);
        // 获取重要视频
        const data = await getTodayVideos();
        if (data && data.length) {
            // 数量补足需要数量
            while (videos.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * data.length);
                // 视频
                const item = data[randomIndex];
                // 是否存在视频
                if (item.dataValid &&
                    (item.type === 'shipin' || item.type === 'juji')) {
                    videos.push(item);
                }
            }
        }
        else {
            videos = [];
        }
        resolve('done');
    });
}
/**
 * @description 阅读文章
 */
async function readNews() {
    await getNews();
    for (const i in news) {
        // 暂停
        await pauseStudyLock();
        console.log(`正在阅读第 ${Number(i) + 1} 个新闻...`);
        // 提示
        createTip(`正在阅读第 ${Number(i) + 1} 个新闻`);
        // 链接
        const { url } = news[i];
        // 链接
        GM_setValue('readingUrl', url);
        // 等待任务窗口
        await waitTaskWin(url, '文章选读');
        // 提示
        createTip(`完成阅读第 ${Number(i) + 1} 个新闻!`);
        // 等待一段时间
        await sleep(1500);
        // 刷新数据
        await refreshInfo();
        // 任务完成跳出循环
        if (settings[SettingType.READ] && tasks[TaskType.READ].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[SettingType.READ] && !tasks[TaskType.READ].status) {
        console.log('任务未完成, 继续阅读新闻!');
        // 提示
        createTip('任务未完成, 继续阅读新闻!');
        await readNews();
    }
}
/**
 * @description 观看视频
 */
async function watchVideo() {
    // 获取视频
    await getVideos();
    // 观看视频
    for (const i in videos) {
        // 暂停
        await pauseStudyLock();
        console.log(`正在观看第 ${Number(i) + 1} 个视频...`);
        // 提示
        createTip(`正在观看第 ${Number(i) + 1} 个视频`);
        // 链接
        const { url } = videos[i];
        // 链接
        GM_setValue('watchingUrl', url);
        // 等待任务窗口
        await waitTaskWin(url, '视听学习');
        // 提示
        createTip(`完成观看第 ${Number(i) + 1} 个视频!`);
        // 等待一段时间
        await sleep(1500);
        // 刷新数据
        await refreshInfo();
        // 任务完成跳出循环
        if (settings[SettingType.WATCH] && tasks[TaskType.WATCH].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[SettingType.WATCH] && !tasks[TaskType.WATCH].status) {
        console.log('任务未完成, 继续观看视频!');
        // 提示
        createTip('任务未完成, 继续观看看视频!');
        await watchVideo();
    }
}
/**
 * @description 做每日答题
 */
async function doExamPractice() {
    // 暂停
    await pauseStudyLock();
    console.log('正在做每日答题...');
    // 提示
    createTip('正在做每日答题');
    // 链接
    const url = URL_CONFIG.examPractice;
    // 等待任务窗口
    await waitTaskWin(url, '每日答题');
    // 提示
    createTip('完成每日答题!');
    // 等待一段时间
    await sleep(1500);
    // 刷新数据
    await refreshInfo();
    // 任务完成状况
    if (settings[SettingType.PRACTICE] && !tasks[TaskType.PRACTICE].status) {
        console.log('任务未完成, 继续每日答题!');
        // 提示
        createTip('任务未完成, 继续每日答题!');
        await doExamPractice();
    }
}
/**
 * @description 做专项练习
 */
async function doExamPaper() {
    // 提示
    createTip('正在寻找未做的专项练习');
    // id
    const examPaperId = await findExamPaper();
    if (examPaperId) {
        // 暂停
        await pauseStudyLock();
        console.log('正在做专项练习...');
        // 提示
        createTip('正在做专项练习');
        // 链接
        const url = `${URL_CONFIG.examPaper}?id=${examPaperId}`;
        console.log(`链接: ${url}`);
        // 等待窗口任务
        await waitTaskWin(url, '专项练习');
        // 提示
        createTip('完成专项练习!');
        // 等待一段时间
        await sleep(1500);
        // 刷新数据
        await refreshInfo();
        if (settings[SettingType.PAPER] && !tasks[TaskType.PAPER].status) {
            console.log('任务未完成, 继续专项练习!');
            // 提示
            createTip('任务未完成, 继续专项练习!');
            doExamPaper();
        }
        return;
    }
    // 提示
    createTip('专项练习均已完成!');
}
/**
 * @description 初始化总页数属性
 */
async function initExam() {
    // 默认从第一页获取全部页属性
    const data = await getExamPaper(1);
    if (data) {
        // 等待
        await sleep(ratelimitms);
        return data.totalPageCount;
    }
}
/**
 * @description 查询专项练习列表
 */
async function findExamPaper() {
    console.log('正在寻找未完成的专项练习...');
    // 获取总页数
    const total = await initExam();
    // 当前页数
    let current = examPaperReverse ? total : 1;
    if (examPaperReverse) {
        console.log('专项练习, 开启逆序模式, 从最早的题目开始答题');
    }
    else {
        console.log('专项练习, 开启顺序模式, 从最近的题目开始答题');
    }
    console.log('正在寻找未完成的专项练习...');
    while (current <= total && current) {
        // 请求数据
        const data = await getExamPaper(current);
        if (data) {
            // 获取专项练习的列表
            const examPapers = data.list;
            if (examPaperReverse) {
                // 若开启逆序答题, 则反转专项练习列表
                examPapers.reverse();
            }
            for (const i in examPapers) {
                // 遍历查询有没有没做过的
                if (examPapers[i].status === 1) {
                    // status： 1为"开始答题" , 2为"重新答题"
                    return examPapers[i].id;
                }
            }
            // 增加页码 (若开启逆序翻页, 则减少页码)
            current += examPaperReverse ? -1 : 1;
            // 等待
            await sleep(ratelimitms);
        }
        else {
            break;
        }
    }
}
/**
 * @description 获取答题按钮
 */
function getNextButton() {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            // 答题按钮
            const nextAll = $$('.ant-btn').filter((next) => next.innerText);
            if (nextAll.length) {
                // 停止定时器
                clearInterval(timer);
                if (nextAll.length === 2) {
                    resolve(nextAll[1]);
                    return;
                }
                resolve(nextAll[0]);
            }
        }, 500);
    });
}
/**
 * @description 暂停答题
 */
function pauseExam(flag) {
    // 按钮
    const ExamBtn = $$('.egg_exam_btn')[0];
    if (ExamBtn) {
        if (flag) {
            // 创建提示
            createTip('已暂停, 手动开启自动答题! ', 10);
        }
        else {
            // 创建提示
            createTip('已开启, 自动答题!');
        }
        pause = flag;
        ExamBtn.innerText = '开启自动答题';
        ExamBtn.classList.add('manual');
    }
}
/**
 * @description 处理滑动验证
 */
function handleSlideVerify() {
    return new Promise(async (resolve) => {
        // 滑动验证
        const mask = $$('#nc_mask')[0];
        if (mask && getComputedStyle(mask).display !== 'none') {
            // 创建提示
            createTip('等待滑动验证');
            // 提高层级
            mask.style.zIndex = '999';
            // 轨道
            const track = $$('.nc_scale')[0];
            // 滑块
            const slide = $$('.btn_slide')[0];
            const rectTrack = track.getBoundingClientRect();
            const rectSlide = slide.getBoundingClientRect();
            // 窗口
            const window = unsafeWindow;
            // 范围内随机起点
            const start = createRandomPoint(rectSlide);
            // 终点
            const end = {
                x: rectTrack.x + rectTrack.width,
                y: rectTrack.y + rectTrack.height / 2,
            };
            // 路径
            const path = createRandomPath(start, end, 10);
            // 移动端
            const mobile = hasMobile();
            if (mobile) {
                slide.style.touchAction = 'none';
                const touchstartTouch = new Touch({
                    identifier: 0,
                    target: slide,
                    clientX: path[0].x,
                    clientY: path[0].y,
                });
                const touchstartList = [touchstartTouch];
                // 开始触摸
                const touchstart = new TouchEvent('touchstart', {
                    targetTouches: touchstartList,
                    touches: touchstartList,
                    changedTouches: touchstartList,
                    view: window,
                    bubbles: true,
                });
                slide.dispatchEvent(touchstart);
                // 触摸滑动
                for (const i in path) {
                    const touchmoveTouch = new Touch({
                        identifier: 0,
                        target: slide,
                        clientX: path[i].x,
                        clientY: path[i].y,
                    });
                    const touchmoveList = [touchmoveTouch];
                    const touchmove = new TouchEvent('touchmove', {
                        targetTouches: touchmoveList,
                        touches: touchmoveList,
                        changedTouches: touchmoveList,
                        view: window,
                        bubbles: true,
                    });
                    slide.dispatchEvent(touchmove);
                    await sleep(10);
                }
                const touchendTouch = new Touch({
                    identifier: 0,
                    target: slide,
                    clientX: path[path.length - 1].x,
                    clientY: path[path.length - 1].y,
                });
                // 触摸结束
                const touchendList = [touchendTouch];
                // 开始触摸
                const touchend = new TouchEvent('touchend', {
                    targetTouches: [],
                    touches: [],
                    changedTouches: touchendList,
                    view: window,
                    bubbles: true,
                });
                slide.dispatchEvent(touchend);
            }
            else {
                // 鼠标按下
                const mousedown = new MouseEvent('mousedown', {
                    clientX: path[0].x,
                    clientY: path[0].y,
                    bubbles: true,
                    view: window,
                });
                slide.dispatchEvent(mousedown);
                // 鼠标滑动
                for (const i in path) {
                    const mousemove = new MouseEvent('mousemove', {
                        clientX: path[i].x,
                        clientY: path[i].y,
                        bubbles: true,
                        view: window,
                    });
                    slide.dispatchEvent(mousemove);
                    await sleep(10);
                }
                // 鼠标抬起
                const mouseup = new MouseEvent('mouseup', {
                    clientX: path[path.length - 1].x,
                    clientY: path[path.length - 1].y,
                    bubbles: true,
                    view: window,
                });
                slide.dispatchEvent(mouseup);
            }
            // 创建提示
            createTip('滑动验证完成!');
            // 定时器
            const timer = setInterval(() => {
                // 滑动验证
                const mask = $$('#nc_mask')[0];
                if (!mask || getComputedStyle(mask).display === 'none') {
                    console.log('滑动验证成功!');
                    // 创建提示
                    createTip('滑动验证成功!');
                    clearInterval(timer);
                    resolve(true);
                    return;
                }
                resolve(false);
                console.log('滑动验证失败!');
                // 创建提示
                createTip('滑动验证失败!');
            }, 100);
            return;
        }
        resolve(true);
    });
}
/**
 * @description 处理选项
 */
function handleChoiceBtn(answers) {
    // 选项按钮
    const allBtns = $$('.q-answer');
    // 答案存在
    if (answers.length && allBtns.length) {
        // 作答
        return answers.every((answer) => {
            // 答案存在
            if (answer && answer.length) {
                // 包含答案最短长度选项
                let minLengthChoice;
                // 遍历
                allBtns.forEach((choice) => {
                    // 选项文本
                    const choiceText = choice.innerText.trim();
                    // 无符号选项文本
                    const unsignedChoiceText = choiceText.replaceAll(/[、，,。 ]/g, '');
                    // 无符号答案
                    const unsignedAnswer = answer.replaceAll(/[、，,。 ]/g, '');
                    // 包含答案
                    if (choiceText === answer ||
                        choiceText.includes(answer) ||
                        answer.includes(choiceText) ||
                        unsignedChoiceText.includes(unsignedAnswer)) {
                        // 最小长度选项有值
                        if (minLengthChoice) {
                            // 最短长度选项与当前选项比较长度
                            if (minLengthChoice.innerText.length > choiceText.length) {
                                minLengthChoice = choice;
                            }
                        }
                        else {
                            // 最小长度选项赋值
                            minLengthChoice = choice;
                        }
                    }
                });
                // 存在选项
                if (minLengthChoice) {
                    // 选择
                    if (!minLengthChoice.classList.contains('chosen')) {
                        minLengthChoice.click();
                    }
                    return true;
                }
            }
            return false;
        });
    }
    return false;
}
/**
 * @description 随机处理单选
 */
function handleSingleChoiceRand() {
    // 选项按钮
    const allBtns = $$('.q-answer');
    // 按钮存在
    if (allBtns.length) {
        const index = ~~(Math.random() * allBtns.length);
        const randBtn = allBtns[index];
        // 选择
        if (!randBtn.classList.contains('chosen')) {
            randBtn.click();
        }
    }
}
/**
 * @description 随机处理多选
 */
function handleMutiplyChoiceRand() {
    // 选项按钮
    const allBtns = $$('.q-answer');
    // 按钮存在
    if (allBtns.length) {
        allBtns.forEach((allBtn) => {
            // 选择
            if (!allBtn.classList.contains('chosen')) {
                allBtn.click();
            }
        });
    }
}
/**
 * @description 处理填空
 */
const handleBlankInput = (answers) => {
    // 所有填空
    const blanks = $$('.blank');
    // 答案存在
    if (blanks.length && answers.length) {
        // 填空数量和答案数量一致
        if (answers.length === blanks.length) {
            return answers.every((answer, i) => {
                // 答案存在
                if (answer && answer.length) {
                    // 输入事件
                    const inputEvent = new Event('input', {
                        bubbles: true,
                    });
                    // 设置答案
                    blanks[i].setAttribute('value', answer);
                    // 触发输入input
                    blanks[i].dispatchEvent(inputEvent);
                    return true;
                }
                return false;
            });
        }
        // 填空数量为1和提示数量大于1
        if (blanks.length === 1 && answers.length > 1) {
            // 直接将所有答案整合填进去
            const answer = answers.join('');
            // 答案存在
            if (answer && answer.length) {
                // 输入事件
                const inputEvent = new Event('input', {
                    bubbles: true,
                });
                // 设置答案
                blanks[0].setAttribute('value', answer);
                // 触发输入input
                blanks[0].dispatchEvent(inputEvent);
                return true;
            }
        }
    }
    return false;
};
/**
 * @description 处理填空随机
 */
async function handleBlankInputRand() {
    // 所有填空
    const blanks = $$('.blank');
    if (blanks.length) {
        // 输入事件
        const inputEvent = new Event('input', {
            bubbles: true,
        });
        blanks.forEach((blank) => {
            // 设置答案
            blank.setAttribute('value', '答案');
            // 触发输入input
            blank.dispatchEvent(inputEvent);
        });
    }
}
/**
 * @description 答题过程(整合)
 */
async function doingExam() {
    // 下一个按钮
    let nextButton;
    // 下一个文本
    let nextText;
    // 保存答案
    let shouldSaveAnswer = false;
    while (true) {
        // 先等等再开始做题
        await sleep(2500);
        // 暂停
        await pauseLock();
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 下一个文本
        nextText = nextButton.innerText.replaceAll(' ', '');
        // 结束
        const finish = ['再练一次', '再来一组', '查看解析'];
        if (finish.includes(nextButton.innerText)) {
            break;
        }
        // 点击提示
        $$('.tips')[0]?.click();
        // 所有提示
        const allTips = $$('.line-feed font[color]');
        // 答案
        const answers = allTips.map((tip) => tip.innerText.trim());
        // 获取题目的文本内容
        const question = $$('.q-body')[0].innerText;
        // 等待一段时间
        await sleep(1500);
        // 暂停
        await pauseLock();
        // 选项按钮
        const allBtns = $$('.q-answer');
        // 所有填空
        const blanks = $$('input[type=text][class=blank]');
        // 问题类型
        const questionType = ($$('.q-header')[0].innerText.substring(0, 3));
        // 暂停
        await pauseLock();
        // 题型分类作答
        switch (questionType) {
            case '填空题': {
                // 根据提示作答
                if (answers.length) {
                    const res = handleBlankInput(answers);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 创建提示
                createTip('答案异常, 尝试网络题库获取!');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 根据题库作答
                if (answersNetwork.length) {
                    const res = handleBlankInput(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 随机作答
                if (settings[SettingType.RANDOM_EXAM]) {
                    console.log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleBlankInputRand();
                }
                else {
                    // 暂停答题
                    pauseExam(true);
                    // 提交答案
                    shouldSaveAnswer = true;
                }
                break;
            }
            case '多选题': {
                // 根据提示作答
                if (answers.length) {
                    // 选项文本
                    const choicesText = allBtns.map((btn) => btn.innerText);
                    // 选项内容
                    const choicesContent = choicesText
                        .map((choiceText) => choiceText.split(/[A-Z]./)[1].trim())
                        .join('');
                    // 空格
                    const blanks = question.match(/（）/g);
                    // 填空数量、选项数量、答案数量相同 | 选项全文等于答案全文
                    if ((blanks && allBtns.length === blanks.length) ||
                        question === choicesContent ||
                        allBtns.length === 2) {
                        // 全选
                        allBtns.forEach((choice) => {
                            if (!choice.classList.contains('chosen')) {
                                choice.click();
                            }
                        });
                        break;
                    }
                    // 选项数量大于等于答案
                    if (allBtns.length >= answers.length) {
                        const res = handleChoiceBtn(answers);
                        // 成功
                        if (res) {
                            break;
                        }
                    }
                }
                // 创建提示
                createTip('答案异常, 尝试网络题库获取!');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 答案存在
                if (answersNetwork.length) {
                    const res = handleChoiceBtn(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 随机作答
                if (settings[SettingType.RANDOM_EXAM]) {
                    console.log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleMutiplyChoiceRand();
                }
                else {
                    // 暂停答题
                    pauseExam(true);
                    // 提交答案
                    shouldSaveAnswer = true;
                }
                break;
            }
            case '单选题': {
                // 根据提示作答
                if (answers.length) {
                    // 提示为1
                    if (answers.length === 1) {
                        const res = handleChoiceBtn(answers);
                        // 成功
                        if (res) {
                            break;
                        }
                    }
                    else {
                        // 可能的分隔符
                        const seperator = [
                            '',
                            ' ',
                            ',',
                            ';',
                            ',',
                            '、',
                            '-',
                            '|',
                            '+',
                            '/',
                        ];
                        // 可能的答案
                        const answersLike = seperator.map((s) => answers.join(s));
                        // 答案存在
                        if (answersLike.every((answer) => answer.length)) {
                            // 可能答案是否正确
                            const res = answersLike.some((answer) => {
                                // 尝试查找点击
                                return handleChoiceBtn([answer]);
                            });
                            if (res) {
                                break;
                            }
                        }
                    }
                }
                // 创建提示
                createTip('答案异常, 尝试网络题库获取!');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                // 存在答案
                if (answersNetwork.length) {
                    // 单答案单选项
                    if (answersNetwork.length === 1) {
                        // 尝试查找点击
                        const res = handleChoiceBtn(answersNetwork);
                        if (res) {
                            break;
                        }
                    }
                    else {
                        // 多答案单选项 选项意外拆分
                        // 可能分隔符
                        const seperator = ['', ' '];
                        // 可能答案
                        const answersLike = seperator.map((s) => answers.join(s));
                        // 答案存在
                        if (answersLike.every((answer) => answer.length)) {
                            // 可能答案是否正确
                            const res = answersLike.some((answer) => {
                                // 尝试查找点击
                                return handleChoiceBtn([answer]);
                            });
                            if (res) {
                                break;
                            }
                        }
                    }
                }
                // 随机作答
                if (settings[SettingType.RANDOM_EXAM]) {
                    console.log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleSingleChoiceRand();
                }
                else {
                    // 暂停答题
                    pauseExam(true);
                    // 提交答案
                    shouldSaveAnswer = true;
                }
                break;
            }
        }
        // 暂停
        await pauseLock();
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 下一个文本
        nextText = nextButton.innerText.replaceAll(' ', '');
        // 需要提交答案
        if (shouldSaveAnswer) {
            // 获取key
            const key = getKey(question);
            // 答案
            const answers = [];
            if (questionType === '填空题') {
                blanks.forEach((blank) => {
                    answers.push(blank.value);
                });
            }
            if (questionType === '单选题' || questionType === '多选题') {
                allBtns.forEach((choice) => {
                    if (choice.classList.contains('chosen')) {
                        // 带字母的选项
                        const answerTemp = choice.innerText;
                        // 从字符串中拿出答案
                        const [, answer] = answerTemp.split('.');
                        if (answer && answer.length) {
                            answers.push(answer);
                        }
                    }
                });
            }
            // 答案
            const answer = answers.join(';');
            // 存在答案
            if (answer.length) {
                console.log('上传答案', { answer, key, question });
                // 保存答案
                await saveAnswer(key, answer);
                // 答案
                console.log('上传答案成功!');
            }
            // 重置
            shouldSaveAnswer = false;
        }
        // 确认
        if (nextText === '确定') {
            // 确认
            nextButton.click();
            // 等待一段时间
            await sleep(2000);
            // 暂停
            await pauseLock();
            // 答案解析
            const answerBox = $$('.answer')[0];
            // 答题错误
            if (answerBox) {
                // 获取key
                const key = getKey(question);
                const answerTemp = answerBox.innerText;
                // 从字符串中拿出答案
                const [, answerText] = answerTemp.split('：');
                if (answerText && answerText.length) {
                    const answer = answerText.replaceAll(' ', ';');
                    console.log('上传答案', { answer, key, question });
                    await saveAnswer(key, answer);
                }
            }
            // 滑动验证
            await handleSlideVerify();
        }
        // 获取按钮
        nextButton = await getNextButton();
        // 下一个文本
        nextText = nextButton.innerText.replaceAll(' ', '');
        if (nextText === '下一题' || nextText === '完成' || nextText === '交卷') {
            // 等待一段时间
            await sleep(2500);
            // 下一题
            nextButton.click();
        }
    }
    closeWin(settings[SettingType.SAME_TAB], id);
}
/**
 * @description 打开窗口
 * @param url
 * @returns
 */
async function openFrame(url, title) {
    const conn = $$('.egg_frame_wrap')[0];
    if (conn) {
        // 显示窗体
        setFrameVisible(!settings[SettingType.SILENT_RUN]);
        // 标题
        const frameTitle = $$('.egg_frame_title', conn)[0];
        // 窗口
        const frame = $$('.egg_frame', conn)[0];
        // 打开
        closed = false;
        // id
        const id = generateMix(10);
        // 设置标题
        frameTitle.innerText = title || '';
        // 设置 URL
        frame.src = url;
        // 等待页面加载
        await waitFrameLoaded(frame);
        // 发送窗口 ID
        frame.contentWindow?.postMessage({ id, closed: false }, url);
        return {
            id,
            frame,
        };
    }
}
/**
 * @description 改变窗口可见性
 */
function setFrameVisible(show) {
    const conn = $$('.egg_frame_wrap')[0];
    const frameBtn = $$('.egg_frame_show_btn')[0];
    if (conn && frameBtn) {
        conn.classList.toggle('hide', !show);
        frameBtn.classList.toggle('hide', show);
    }
}
/**
 * @description 关闭窗口
 */
function closeFrame() {
    const conn = $$('.egg_frame_wrap')[0];
    const frameBtn = $$('.egg_frame_show_btn')[0];
    if (conn && frameBtn) {
        // 隐藏窗口
        conn.classList.add('hide');
        // 隐藏按钮
        frameBtn.classList.add('hide');
        // 标题
        const frameTitle = $$('.egg_frame_title', conn)[0];
        // 窗口
        const frame = $$('.egg_frame', conn)[0];
        // 关闭
        closed = true;
        frame.src = '';
        frameTitle.innerText = '';
    }
}
/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose(id) {
    return new Promise((resolve) => {
        window.addEventListener('message', (msg) => {
            const { data } = msg;
            if (data.id === id && data.closed) {
                resolve(true);
            }
        });
        setInterval(() => {
            if (closed) {
                resolve(true);
            }
        }, 100);
    });
}
// 等待窗口加载
function waitFrameLoaded(iframe) {
    return new Promise((resolve) => {
        iframe.addEventListener('load', () => {
            resolve(true);
        });
    });
}
/**
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url, title) {
    if (settings[SettingType.SAME_TAB]) {
        const newFrame = await openFrame(url, title);
        if (newFrame) {
            // id
            const { id } = newFrame;
            // 等待窗口关闭
            await waitFrameClose(id);
        }
    }
    else {
        // 页面
        const newPage = openWin(url);
        await waitingClose(newPage);
    }
}
/**
 * @description 登录状态
 */
function loginStatus() {
    return new Promise((resolve) => {
        // 清楚之前的定时器
        if (loginTimer) {
            clearInterval(loginTimer);
        }
        loginTimer = setInterval(() => {
            // 获取token
            if (getCookie('token')) {
                clearInterval(loginTimer);
                resolve(true);
            }
        }, 100);
    });
}
/**
 * @description 学习
 */
async function study() {
    // 提示
    createTip('开始学习!');
    // 暂停
    await pauseStudyLock();
    // 任务
    if (tasks.length) {
        // 检查新闻
        if (settings[SettingType.READ] && !tasks[TaskType.READ].status) {
            console.log('任务一: 文章选读');
            // 提示
            createTip('任务一: 文章选读');
            // 暂停
            await pauseStudyLock();
            // 看新闻
            await readNews();
        }
        if (settings[SettingType.WATCH] && !tasks[TaskType.WATCH].status) {
            console.log('任务二: 视听学习');
            // 提示
            createTip('任务二: 视听学习');
            // 暂停
            await pauseStudyLock();
            // 看视频
            await watchVideo();
        }
        // 检查每日答题
        if (settings[SettingType.PRACTICE] && !tasks[TaskType.PRACTICE].status) {
            console.log('任务三: 每日答题');
            // 提示
            createTip('任务三: 每日答题');
            // 暂停
            await pauseStudyLock();
            // 做每日答题
            await doExamPractice();
        }
        // 检查专项练习
        if (settings[SettingType.PAPER] && !tasks[TaskType.PAPER].status) {
            console.log('任务五: 专项练习');
            // 提示
            createTip('任务五: 专项练习');
            // 暂停
            await pauseStudyLock();
            // 做专项练习
            await doExamPaper();
        }
    }
}
/**
 * @description 暂停任务
 */
function pauseTask() {
    // 全局暂停
    if (GM_getValue('pauseStudy') !== true) {
        GM_setValue('pauseStudy', true);
    }
    // 开始按钮
    const studyBtn = $$('.egg_study_btn')[0];
    studyBtn.innerText = '继续学习';
    studyBtn.classList.remove('loading');
    studyBtn.removeEventListener('click', pauseTask);
    studyBtn.addEventListener('click', continueTask);
}
/**
 * @description 继续任务
 */
function continueTask() {
    // 全局暂停
    if (GM_getValue('pauseStudy') !== false) {
        GM_setValue('pauseStudy', false);
    }
    // 开始按钮
    const studyBtn = $$('.egg_study_btn')[0];
    studyBtn.innerText = '正在学习, 点击暂停';
    studyBtn.classList.add('loading');
    studyBtn.removeEventListener('click', continueTask);
    studyBtn.addEventListener('click', pauseTask);
}
/**
 * @description 完成任务
 */
function finishTask() {
    // 全局暂停
    if (GM_getValue('pauseStudy') !== false) {
        GM_setValue('pauseStudy', false);
    }
    // 开始按钮
    const studyBtn = $$('.egg_study_btn')[0];
    studyBtn.innerText = '已完成';
    studyBtn.classList.remove('loading');
    studyBtn.classList.add('disabled');
    studyBtn.setAttribute('disabled', '');
}
/**
 * @description 开始
 */
async function start() {
    // 提示
    createTip('准备开始学习');
    // 保存配置
    console.log('准备开始学习...');
    if (login && !started) {
        started = true;
        // 初始化暂停
        if (GM_getValue('pauseStudy') !== false) {
            GM_setValue('pauseStudy', false);
        }
        // 开始按钮
        const studyBtn = $$('.egg_study_btn')[0];
        studyBtn.innerText = '正在学习, 点击暂停';
        studyBtn.classList.add('loading');
        studyBtn.removeEventListener('click', start);
        // 点击暂停
        studyBtn.addEventListener('click', pauseTask);
        // 学习
        await study();
        // 刷新数据
        await refreshInfo();
        // 未完成
        if (!tasks.every((task, i) => !settings[i] || task.status)) {
            await study();
        }
        finishTask();
        // 关闭窗口
        if (settings[SettingType.SAME_TAB]) {
            closeFrame();
        }
        console.log('已完成');
        // 提示
        createTip('完成学习!');
        // 推送
        if (settings[SettingType.REMOTE_PUSH]) {
            // 总分
            const totalScoreSpan = $$('.egg_totalscore span')[0];
            //  当天分数
            const todayScoreSpan = $$('.egg_todayscore_btn span')[0];
            pushModal({
                title: '学习推送',
                content: [
                    '学习强国, 学习完成!',
                    `当天积分:  ${getHighlightHTML(totalScoreSpan.innerText)} 分`,
                    `总积分: ${getHighlightHTML(todayScoreSpan.innerText)} 分`,
                    ...tasks.map((task) => getProgressHTML(task.title, task.percent)),
                ],
                type: 'success',
            }, pushToken);
        }
        // 定时任务
        if (settings[SettingType.SCHEDULE_RUN]) {
            // 提示
            createTip('退出登录!');
            const logged = $$("a[class='logged-link']")[0];
            logged && logged.click();
        }
    }
}

