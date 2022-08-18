// ==UserScript==
// @name   不学习何以强国
// @namespace   http://tampermonkey.net/
// @version   20220817
// @description   有趣的 `学习强国` 油猴插件。读文章,看视频，做习题。问题反馈： https://github.com/Xu22Web/tech-study-js/issues 。
// @author   原作者 techxuexi 荷包蛋。现作者：Noah
// @match   https://www.xuexi.cn
// @match   https://www.xuexi.cn/*
// @match   https://pc.xuexi.cn/points/exam-practice.html
// @match   https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match   https://pc.xuexi.cn/points/exam-weekly-list.html
// @match   https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match   https://pc.xuexi.cn/points/exam-paper-list.html
// @require   https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require   https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @require   https://at.alicdn.com/t/font_3029437_1ig5vp3wlvx.js
// @grant   GM_addStyle
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_openInTab
// ==/UserScript==
const css = ':root {\n  --themeColor: #fa3333;\n  font-size: 10px;\n}\n.icon {\n  width: 1em;\n  height: 1em;\n  vertical-align: -0.15em;\n  fill: currentColor;\n  overflow: hidden;\n}\n.egg_btn {\n  transition: 0.5s;\n  outline: none;\n  border: none;\n  padding: 1.2rem 2rem;\n  border-radius: 1.2rem;\n  cursor: pointer;\n  font-size: 1.8rem;\n  font-weight: bold;\n  text-align: center;\n  color: rgb(255, 255, 255);\n  background: #666777;\n}\n.egg_btn.manual {\n  background: #e3484b;\n}\n.egg_setting_box {\n  position: fixed;\n  top: 7rem;\n  left: 0.5rem;\n  padding: 1.2rem 2rem;\n  border-radius: 1rem;\n  background: #fff;\n  box-shadow: 0 0 1rem #666777;\n  width: 20rem;\n  overflow: hidden;\n}\n.egg_setting_box.active {\n  width: 24rem;\n}\n.egg_setting_item {\n  margin-top: 0.5rem;\n  min-height: 3rem;\n  min-width: 20rem;\n  font-size: 1.6rem;\n  display: flex;\n  justify-items: center;\n  justify-content: space-between;\n}\n.egg_info {\n  flex-direction: column;\n}\n.egg_userinfo {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.egg_login_status {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.egg_login_status button {\n  outline: none;\n  padding: 0.4rem 0.8rem;\n  background: #ccc;\n  font-size: 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  color: white;\n  cursor: pointer;\n}\n.egg_login_status.active {\n  flex-grow: 1;\n}\n.egg_login_status.active button {\n  background: var(--themeColor);\n  padding: 0.8rem 2.4rem;\n}\n.egg_userinfo .egg_user {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 0.5rem 0;\n}\n.egg_userinfo .egg_user .egg_sub_nickname,\n.egg_userinfo .egg_user .egg_avatar_img {\n  height: 5rem;\n  width: 5rem;\n  border-radius: 50%;\n  background: var(--themeColor);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  font-size: 2rem;\n  color: white;\n}\n.egg_userinfo .egg_user .egg_name {\n  padding-left: 0.5rem;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 10rem;\n}\n.egg_scoreinfo {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 0.8rem;\n}\n.egg_scoreinfo .egg_totalscore,\n.egg_scoreinfo .egg_todayscore {\n  font-size: 1.2rem;\n}\n.egg_scoreinfo span {\n  color: var(--themeColor);\n  padding-left: 0.4rem;\n  font-weight: bold;\n}\n.egg_setting_item label {\n  flex-grow: 1;\n}\n.egg_progress {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;\n}\n.egg_progress .egg_track {\n  background: #ccc;\n  height: 0.5rem;\n  border-radius: 1rem;\n  flex: 1 1 auto;\n  overflow: hidden;\n}\n.egg_progress .egg_track .egg_bar {\n  height: 0.5rem;\n  background: var(--themeColor);\n  border-radius: 1rem;\n  width: 0;\n  transition: width 0.5s;\n}\n.egg_progress .egg_percent {\n  font-size: 1.2rem;\n  padding-left: 0.5rem;\n  width: 3.5rem;\n}\ninput[type=\'checkbox\'].egg_setting_switch {\n  cursor: pointer;\n  margin: 0;\n  outline: 0;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  position: relative;\n  width: 4.2rem;\n  height: 2.2rem;\n  background: #ccc;\n  border-radius: 5rem;\n  transition: background 0.3s;\n  --border-padding: 0.5rem;\n}\ninput[type=\'checkbox\'].egg_setting_switch::after {\n  content: \'\';\n  display: inline-block;\n  width: 1.4rem;\n  height: 1.4rem;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 0 0.2rem #999;\n  transition: 0.4s;\n  position: absolute;\n  top: calc(50% - (1.4rem / 2));\n  position: absolute;\n  left: var(--border-padding);\n}\ninput[type=\'checkbox\'].egg_setting_switch:checked {\n  background: var(--themeColor);\n}\ninput[type=\'checkbox\'].egg_setting_switch:checked::after {\n  left: calc(100% - var(--border-padding) - 1.4rem);\n}\n.egg_start_btn {\n  justify-content: center;\n}\n.egg_study_btn {\n  outline: none;\n  background: var(--themeColor);\n  padding: 0.8rem 2.4rem;\n  font-size: 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  color: white;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n.egg_study_btn:hover {\n  opacity: 0.8;\n}\n@keyframes fade {\n  from {\n    opacity: 0.8;\n  }\n  to {\n    opacity: 0.4;\n    background: #ccc;\n  }\n}\n.egg_study_btn.loading {\n  animation: fade 2s ease infinite alternate;\n}\n.egg_study_btn.disabled {\n  background: #ccc;\n}\n.egg_tip {\n  position: fixed;\n  bottom: 2rem;\n  left: 2rem;\n  padding: 1.2rem 1.4rem;\n  border: none;\n  border-radius: 1rem;\n  background: #222222;\n  color: #ffffff;\n  font-size: 1.4rem;\n  font-weight: bold;\n  transition: all 0.8s ease;\n  opacity: 0;\n  transform: scale(0.9) translateY(10px);\n}\n.egg_tip.active {\n  opacity: 1;\n  transform: scale(1) translateY(0);\n}\n.egg_frame iframe {\n  width: 40rem;\n  height: 32rem;\n  position: relative;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  border: none;\n}\n.egg_menu.mobile .egg_frame iframe {\n  width: 20rem;\n  height: 20rem;\n  top: 0;\n}\n.egg_frame {\n  overflow: hidden;\n}\n';
// 嵌入样式
GM_addStyle(css);
/* Config·配置 */
// 主页
const indexMatch = [
    'https://www.xuexi.cn',
    'https://www.xuexi.cn/',
    'https://www.xuexi.cn/index.html',
];
// url配置
const URL_CONFIG = {
    // 每日答题页面
    examPractice: 'https://pc.xuexi.cn/points/exam-practice.html',
    // 每周答题页面
    examWeekly: 'https://pc.xuexi.cn/points/exam-weekly-detail.html?id={id}',
    // 专项练习页面
    examPaper: 'https://pc.xuexi.cn/points/exam-paper-detail.html?id={id}',
    // 登录界面
    login: 'https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn',
};
// api配置
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
    todayNews: 'https://www.xuexi.cn/lgdata/1jscb6pu1n2.json',
    // 视频数据
    todayVideos: 'https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json',
    // 每周答题列表
    weeklyList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/practice/pc/weekly/more?pageSize=50&pageNo={pageNo}',
    // 专项练习列表
    paperList: 'https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list?pageSize=50&pageNo={pageNo}',
    // 文本服务器保存答案
    answerSave: 'https://a6.qikekeji.com/txt/data/save',
    // 文本服务器获取答案
    answerDetail: 'https://a6.qikekeji.com/txt/data/detail',
};
// 每周答题当前页码
let examWeeklyPageNo = 1;
// 每周答题总页码
let examWeeklyTotalPageCount = 0;
// 每周答题开启逆序答题: false: 顺序答题; true: 逆序答题
let examWeeklyReverse = true;
// 专项练习当前页码
let examPaperPageNo = 1;
// 专项练习总页码
let examPaperTotalPageCount = 0;
// 专 项答题开启逆序答题: false: 顺序答题; true: 逆序答题
let examPaperReverse = true;
// 每周答题，专项练习 请求rate 限制 每 3000ms 一次
const ratelimitms = 3000;
// 单次最大新闻数
const maxNewsNum = 6;
// 单次最大视频数
const maxVideoNum = 6;
/* Config End·配置结束 */
/* Tools·工具函数  */
// 获取cookie
function getCookie(name) {
    // 获取当前所有cookie
    const strCookies = document.cookie;
    // 截取变成cookie数组
    const array = strCookies.split(';');
    // 循环每个cookie
    for (let i = 0; i < array.length; i++) {
        // 将cookie截取成两部分
        const item = array[i].split('=');
        // 判断cookie的name 是否相等
        if (item[0].trim() === name) {
            return item[1].trim();
        }
    }
    return null;
}
// 防抖
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
// 选择器
function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}
// 默认情况下, chrome 只允许 window.close 关闭 window.open 打开的窗口,所以我们就要用window.open命令,在原地网页打开自身窗口再关上,就可以成功关闭了
function closeWin() {
    try {
        window.opener = window;
        const win = window.open('', '_self');
        win?.close();
        top?.close();
    }
    catch (e) { }
}
// 等待窗口关闭
function waitingClose(newPage) {
    return new Promise((resolve) => {
        let doing = setInterval(function () {
            if (newPage.closed) {
                clearInterval(doing); // 停止定时器
                resolve('done');
            }
        }, 1000);
    });
}
// 等待时间
function waitingTime(time) {
    if (!Number.isInteger(time)) {
        time = 1000;
    }
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve('done');
        }, time);
    });
}
// 暂停锁
function pauseLock(callback) {
    return new Promise((resolve) => {
        const doing = setInterval(() => {
            if (!pause) {
                // 停止定时器
                clearInterval(doing);
                console.log('答题等待结束！');
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
    });
}
// 暂停学习锁
function pauseStudyLock(callback) {
    return new Promise((resolve) => {
        const doing = setInterval(() => {
            if (!pauseStudy) {
                // 停止定时器
                clearInterval(doing);
                console.log('学习等待结束！');
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
    });
}
//  判断是否为移动端
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
// 创建元素节点
function creatElementNode(eleName, props, attrs, children) {
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
    }
    else if (specficSVGElement.includes(formatEleName)) {
        // svg元素命名空间
        const ns = 'http://www.w3.org/2000/svg';
        // 创建普通元素
        ele = document.createElementNS(ns, formatEleName);
    }
    else {
        // 创建普通元素
        ele = document.createElement(formatEleName);
    }
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
        else {
            // 特殊属性
            const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
            if (specificAttrs.includes(key) && value) {
                ele.setAttribute(key, '');
            }
            else {
                if (value) {
                    ele.setAttribute(key, value);
                }
                else {
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
            }
            else {
                // 文档碎片
                const fragment = document.createDocumentFragment();
                for (const i in children) {
                    fragment.append(children[i]);
                }
                ele.append(fragment);
            }
        }
        else {
            ele.append(children);
        }
    }
    return ele;
}
// 创建文字节点
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
/* Tools End·工具函数结束 */
/* API请求函数 */
// 获取用户信息
async function getUserInfo() {
    const res = await fetch(API_CONFIG.userInfo, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const { data } = await res.json();
            return data;
        }
        catch (err) { }
    }
}
// 获取总积分
async function getTotalScore() {
    const res = await fetch(API_CONFIG.totalScore, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const { data } = await res.json();
            // 总分
            const { score } = data;
            return score;
        }
        catch (err) { }
    }
}
// 获取当天总积分
async function getTodayScore() {
    const res = await fetch(API_CONFIG.todayScore, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const { data } = await res.json();
            // 当天总分
            const { score } = data;
            return score;
        }
        catch (err) { }
    }
}
// 获取任务列表
async function getTaskList() {
    const res = await fetch(API_CONFIG.taskList, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const { data } = await res.json();
            // 进度和当天总分
            const { taskProgress } = data;
            return taskProgress;
        }
        catch (err) { }
    }
}
// 获取新闻数据
async function getTodayNews() {
    // 获取重要新闻
    const res = await fetch(API_CONFIG.todayNews, {
        method: 'GET',
    });
    if (res && res.ok) {
        try {
            const data = await res.json();
            return data;
        }
        catch (err) { }
    }
}
// 获取视频数据
async function getTodayVideos() {
    // 获取重要新闻
    const res = await fetch(API_CONFIG.todayVideos, {
        method: 'GET',
    });
    if (res && res.ok) {
        try {
            const data = await res.json();
            return data;
        }
        catch (err) { }
    }
}
// 专项练习数据
async function getExamPaper(pageNo) {
    // 链接
    const url = API_CONFIG.paperList.replace('{pageNo}', pageNo);
    // 获取重要新闻
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const data = await res.json();
            const paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
            // JSON格式化
            const paper = JSON.parse(paperJson);
            return paper;
        }
        catch (err) {
            return [];
        }
    }
    return [];
}
// 每周答题数据
async function getExamWeekly(pageNo) {
    // 链接
    const url = API_CONFIG.weeklyList.replace('{pageNo}', pageNo);
    // 获取重要新闻
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });
    if (res && res.ok) {
        try {
            const data = await res.json();
            const paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
            // JSON格式化
            const paper = JSON.parse(paperJson);
            return paper;
        }
        catch (err) {
            return [];
        }
    }
    return [];
}
// 保存答案
async function saveAnswer(key, value) {
    // 内容
    const content = JSON.stringify([{ title: key, content: value }]);
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            url: API_CONFIG.answerSave,
            data: {
                txt_name: key,
                txt_content: content,
                password: '',
                v_id: '',
            },
            dataType: 'json',
            success(data) {
                resolve(data);
            },
            error() {
                resolve(null);
            },
        });
    });
}
// 获取答案
async function getAnswer(key) {
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            url: API_CONFIG.answerDetail,
            data: {
                txt_name: key,
                password: '',
            },
            dataType: 'json',
            success(data) {
                resolve(data);
            },
            error() {
                resolve(null);
            },
        });
    });
}
/* API请求函数结束 */
/* 变量 */
// 获取当前日期
const currDate = new Date().toISOString().split('T')[0];
// 任务进度
const tasks = [];
// 获取URL
const url = window.location.href;
// 设置
let settings = [true, true, true, true, true, false, false];
// 是否暂停答题
let pause = false;
// 是否暂停学习
let pauseStudy = false;
// 初始化登录状态
let login = Boolean(getCookie('token'));
// 用户信息
let userInfo;
// 新闻
let news = [];
// 视频
let videos = [];
// dom加载
$(document).ready(async () => {
    // 主页
    if (indexMatch.includes(url)) {
        let ready = setInterval(() => {
            if ($$('.text-wrap')[0]) {
                // 停止定时器
                clearInterval(ready);
                // 设置字体
                initFontSize();
                // 初始化设置
                initSetting();
                // 渲染菜单
                renderMenu();
            }
        }, 800);
    }
    else if (typeof GM_getValue('readingUrl') === 'string' &&
        url == GM_getValue('readingUrl')) {
        // 初始化设置
        initSetting();
        if (!settings[5]) {
            // 创建学习提示
            createTip('开始读文章');
        }
        reading(0);
    }
    else if (typeof GM_getValue('watchingUrl') === 'string' &&
        url == GM_getValue('watchingUrl')) {
        // 初始化设置
        initSetting();
        if (!settings[5]) {
            // 创建学习提示
            createTip('开始读看视频');
        }
        reading(1);
        let randNum = 0;
        const checkVideoPlayingInterval = setInterval(() => {
            let temp = getVideoTag();
            if (temp.video) {
                if (!temp.video.muted) {
                    temp.video.muted = true;
                }
                if (temp.video.paused) {
                    console.log('正在尝试播放视频');
                    if (randNum == 0) {
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
                    console.log('成功播放');
                    clearInterval(checkVideoPlayingInterval);
                    reading(1);
                }
            }
            else {
                console.log('等待加载');
            }
        }, 800);
    }
    else if (url.includes('exam') || url.includes('list')) {
        // 答题页面
        const ready = setInterval(() => {
            if ($$('.title')[0]) {
                clearInterval(ready); // 停止定时器
                // 创建“手动答题”按钮
                createManualButton();
                // 去除答题验证
                // cancelVerify();
                // 开始答题
                doingExam();
            }
        }, 500);
    }
    else {
    }
});
// 获取video标签
function getVideoTag() {
    let iframe = $$('iframe')[0];
    let video;
    let pauseButton;
    var u = navigator.userAgent;
    if (u.indexOf('Mac') > -1) {
        // Mac
        if (iframe && iframe.innerHTML) {
            // 如果有iframe,说明外面的video标签是假的
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
            // 如果有iframe,说明外面的video标签是假的
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
// 读新闻或者看视频
// type:0为新闻，1为视频
async function reading(type) {
    // 看文章或者视频
    let time = 1;
    if (type == 0) {
        // 80-100秒后关闭页面，看文章
        time = ~~(Math.random() * (100 - 80 + 1) + 80);
    }
    else {
        // 230-250秒后关闭页面，看视频
        time = ~~(Math.random() * (250 - 230 + 1) + 230);
    }
    let firstTime = time - 2;
    let secendTime = 12;
    // 滚动长度
    const scrollLength = document.body.scrollHeight / 2;
    const readingInterval = setInterval(() => {
        time--;
        if (!settings[5]) {
            $$('#studyTip')[0].innerText = time + ' 秒后关闭页面';
        }
        if (time <= firstTime) {
            window.scrollTo(0, 394);
            firstTime = -1;
        }
        if (time <= secendTime) {
            window.scrollTo(0, scrollLength / 3);
            secendTime = -1;
        }
        if (time <= 0) {
            if (type == 0) {
                GM_setValue('readingUrl', null);
            }
            else {
                GM_setValue('watchingUrl', null);
            }
            clearInterval(readingInterval);
            closeWin();
        }
    }, 1000);
    // 关闭文章或视频页面
}
// 创建学习提示
async function createTip(text, delay) {
    return new Promise((resolve, reject) => {
        // 提示
        let tipInfo = creatElementNode('div', {
            innerText: text ? text : '',
        }, { id: 'studyTip', class: 'egg_tip' });
        // 插入节点
        document.body.append(tipInfo);
        // 操作
        const operate = {
            destroy() {
                if (tipInfo) {
                    // 隐藏
                    operate.hide();
                    tipInfo.remove();
                    tipInfo = null;
                }
            },
            hide() {
                if (tipInfo) {
                    tipInfo.classList.remove('active');
                }
            },
            show() {
                if (tipInfo) {
                    tipInfo.classList.add('active');
                }
            },
        };
        operate.show();
        if (delay && delay >= 0) {
            setTimeout(() => {
                operate.hide();
                resolve(operate);
            }, delay);
            return;
        }
        resolve(operate);
    });
}
// 获取新闻列表
function getNews() {
    return new Promise(async (resolve) => {
        // 新闻数
        const newsNum = tasks[0].dayMaxScore - tasks[0].currentScore;
        // 需要学习的新闻数量
        const need = newsNum < maxNewsNum ? newsNum : maxNewsNum;
        console.log('还需要看' + need + '个新闻');
        // 获取重要新闻
        const data = await getTodayNews();
        if (data && data.length) {
            if (need == 6) {
                // 如果今天还没学过，则优先找今天的新闻
                for (let i = 0; i < need; i++) {
                    // 如果有当天日期的,则加入
                    if (data[i].auditTime.indexOf(currDate) != -1) {
                        news.push(data[i]);
                    }
                    else {
                        // 否则跳出循环
                        break;
                    }
                }
            }
            // 数量补足需要数量
            while (news.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * (data.length + 1));
                news.push(data[randomIndex]);
            }
        }
        else {
            news = [];
        }
        resolve('done');
    });
}
// 获取视频列表
function getVideos() {
    return new Promise(async (resolve) => {
        // 还需要看多少个视频
        const temp1 = ~~(tasks[1].dayMaxScore - tasks[1].currentScore);
        const temp2 = ~~(tasks[3].dayMaxScore - tasks[3].currentScore);
        // 视频数
        const videoNum = temp1 > temp2 ? temp1 : temp2;
        // 需要学习的视频数量
        const need = videoNum < maxVideoNum ? videoNum : maxVideoNum;
        console.log(`还需要看${need}个视频`);
        // 获取重要视频
        const data = await getTodayVideos();
        if (data && data.length) {
            if (need == 6) {
                // 如果今天还没学过，则优先找今天的视频
                for (let i = 0; i < need; i++) {
                    // 如果有当天日期的,则加入
                    if (data[i].auditTime.indexOf(currDate) != -1) {
                        videos.push(data[i]);
                    }
                    else {
                        // 否则跳出循环
                        break;
                    }
                }
            }
            // 数量补足需要数量
            while (videos.length < need) {
                // 随便取
                const randomIndex = ~~(Math.random() * (data.length + 1));
                videos.push(data[randomIndex]);
            }
        }
        else {
            videos = [];
        }
        resolve('done');
    });
}
// 阅读文章
async function readNews() {
    await getNews();
    for (let i = 0; i < news.length; i++) {
        // 暂停
        await pauseStudyLock();
        // 链接
        GM_setValue('readingUrl', news[i].url);
        console.log('正在看第' + (i + 1) + '个新闻');
        // 新页面
        const newPage = GM_openInTab(news[i].url, {
            active: true,
            insert: true,
            setParent: true,
        });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(1500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成跳出循环
        if (settings[0] && tasks[0].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[0] && !tasks[0].status) {
        console.log('任务未完成，继续看新闻！');
        await readNews();
    }
}
// 看学习视频
async function watchVideo() {
    // 获取视频
    await getVideos();
    // 观看视频
    for (let i = 0; i < videos.length; i++) {
        // 暂停
        await pauseStudyLock();
        // 链接
        GM_setValue('watchingUrl', videos[i].url);
        console.log('正在观看第' + (i + 1) + '个视频');
        // 页面
        const newPage = GM_openInTab(videos[i].url, {
            active: true,
            insert: true,
            setParent: true,
        });
        // 等待窗口关闭
        await waitingClose(newPage);
        // 等待一段时间
        await waitingTime(1500);
        // 刷新菜单数据
        await refreshMenu();
        // 任务完成跳出循环
        if (settings[1] && tasks[1].status) {
            break;
        }
    }
    // 任务完成状况
    if (settings[1] && !tasks[1].status) {
        console.log('任务未完成，继续看视频！');
        await watchVideo();
    }
}
// 做每日答题
async function doExamPractice() {
    // 暂停
    await pauseStudyLock();
    console.log('正在完成每日答题');
    const newPage = GM_openInTab(URL_CONFIG.examPractice, {
        active: true,
        insert: true,
        setParent: true,
    });
    // 等待窗口关闭
    await waitingClose(newPage);
    // 等待一段时间
    await waitingTime(1500);
    // 刷新菜单数据
    await refreshMenu();
    // 任务完成状况
    if (settings[2] && !tasks[2].status) {
        console.log('任务未完成，继续完成每日答题！');
        await doExamPractice();
    }
}
// fix code = 429
async function waitingDependStartTime(startTime) {
    let remainms = Date.now() - startTime;
    if (remainms < ratelimitms) {
        await waitingTime(ratelimitms - remainms + 1000);
    }
}
// 初始化每周答题总页数属性
async function InitExamWeeklyAttr() {
    let startTime = Date.now();
    // 默认从第一页获取全部页属性
    var data = await getExamWeekly(1);
    if (data) {
        // 初始化总页码
        examWeeklyTotalPageCount = data.totalPageCount;
        // 若每周答题逆序, 则从最后一页开始
        if (examWeeklyReverse) {
            examWeeklyPageNo = examWeeklyTotalPageCount;
        }
    }
    await waitingDependStartTime(startTime);
}
// 查询每周答题列表看看还有没有没做过的，有则返回id
async function findExamWeekly() {
    var continueFind = true;
    var examWeeklyId = null;
    console.log('初始化每周答题');
    await InitExamWeeklyAttr();
    console.log('正在寻找未完成的每周答题');
    while (continueFind) {
        let startTime = Date.now();
        await getExamWeekly(examWeeklyPageNo).then(async (data) => {
            if (data) {
                if (examWeeklyReverse) {
                    // 若开启逆序答题, 则反转列表
                    console.log('每周答题,开启逆序模式,从最早的题目开始答题');
                    data.list.reverse();
                }
                for (let i = 0; i < data.list.length; i++) {
                    let examWeeks = data.list[i].practices; // 获取每周的测试列表
                    if (examWeeklyReverse) {
                        // 若开启逆序, 则反转每周的测试列表
                        examWeeks.reverse();
                    }
                    for (let j = 0; j < examWeeks.length; j++) {
                        // 遍历查询有没有没做过的
                        if (examWeeks[j].status != 2) {
                            // status： 1为"开始答题" , 2为"重新答题"
                            // 如果不是"重新答题"，则可以做
                            examWeeklyId = examWeeks[j].id;
                            continueFind = false;
                            break;
                        }
                    }
                    if (!continueFind) {
                        // 如果已经找到了，则退出循环
                        break;
                    }
                }
                if (!continueFind) {
                }
                else {
                    // 增加页码
                    examWeeklyPageNo += examWeeklyReverse ? -1 : 1;
                    if (examWeeklyTotalPageCount == 0 ||
                        examWeeklyPageNo > examWeeklyTotalPageCount ||
                        examWeeklyPageNo < 1) {
                        // 已经找完所有页码，还是没找到，不再继续查找
                        continueFind = false;
                    }
                }
            }
            else {
                continueFind = false;
            }
            // fix code = 429
            await waitingDependStartTime(startTime);
        });
    }
    return examWeeklyId;
}
// 做每周答题
function doExamWeekly() {
    return new Promise((resolve) => {
        // 查找有没有没做过的每周测试，有则返回ID
        // examWeeklyId = 147;// 测试题目
        findExamWeekly().then(async (examWeeklyId) => {
            if (examWeeklyId != null) {
                // 暂停
                await pauseStudyLock();
                console.log('正在做每周答题');
                // 新页面
                const newPage = GM_openInTab(URL_CONFIG.examWeekly.replace('{id}', examWeeklyId), { active: true, insert: true, setParent: true });
                // 等待窗口关闭
                await waitingClose(newPage);
                // 等待一段时间
                await waitingTime(1500);
                // 刷新菜单数据
                await refreshMenu();
                // 任务完成状况
                if (settings[3] && !tasks[3].status) {
                    console.log('任务未完成，继续完成每周答题！');
                    resolve(await doExamWeekly());
                    return;
                }
                resolve('done');
            }
            else {
                console.log('没有找到未完成的每周答题，跳过');
                resolve('noTest');
            }
        });
    });
}
// 初始化专项练习总页数属性
async function InitExamPaperAttr() {
    let startTime = Date.now();
    var data = await getExamPaper(1); // 默认从第一页获取全部页属性
    if (data) {
        // 初始化总页码
        examPaperTotalPageCount = data.totalPageCount;
        // 若专项练习逆序, 则从最后一页开始
        if (examPaperReverse) {
            examPaperPageNo = examPaperTotalPageCount;
        }
    }
    await waitingDependStartTime(startTime);
}
// 查询专项练习列表看看还有没有没做过的，有则返回id
async function findExamPaper() {
    var continueFind = true;
    var examPaperId = null;
    console.log('初始化专项练习属性');
    await InitExamPaperAttr();
    console.log('正在寻找未完成的专项练习');
    while (continueFind) {
        let startTime = Date.now();
        await getExamPaper(examPaperPageNo).then(async (data) => {
            if (data) {
                let examPapers = data.list; // 获取专项练习的列表
                if (examPaperReverse) {
                    // 若开启逆序答题, 则反转专项练习列表
                    console.log('专项练习,开启逆序模式,从最早的题目开始答题');
                    examPapers.reverse();
                }
                for (let j = 0; j < examPapers.length; j++) {
                    // 遍历查询有没有没做过的
                    if (examPapers[j].status != 2) {
                        // status： 1为"开始答题" , 2为"重新答题"
                        // 如果不是"重新答题"，则可以做
                        examPaperId = examPapers[j].id;
                        continueFind = false;
                        break;
                    }
                }
                if (!continueFind) {
                }
                else {
                    // 增加页码 (若开启逆序翻页, 则减少页码)
                    examPaperPageNo += examPaperReverse ? -1 : 1;
                    if (examPaperTotalPageCount == 0 ||
                        examPaperPageNo > examPaperTotalPageCount ||
                        examPaperPageNo < 1) {
                        // 已经找完所有页码，还是没找到，不再继续查找
                        continueFind = false;
                    }
                }
            }
            else {
                continueFind = false;
            }
            // fix code = 429
            await waitingDependStartTime(startTime);
        });
    }
    return examPaperId;
}
// 做专项练习
function doExamPaper() {
    return new Promise((resolve) => {
        // 查找有没有没做过的专项练习，有则返回ID
        findExamPaper().then(async (examPaperId) => {
            if (examPaperId != null) {
                // 暂停
                await pauseStudyLock();
                console.log('正在做专项练习');
                // 新页面
                const newPage = GM_openInTab(URL_CONFIG.examPaper.replace('{id}', examPaperId), {
                    active: true,
                    insert: true,
                    setParent: true,
                });
                // 等待窗口关闭
                await waitingClose(newPage);
                // 等待一段时间
                await waitingTime(1500);
                // 刷新菜单数据
                await refreshMenu();
                // 任务完成状况
                if (settings[4] && !tasks[4].status) {
                    console.log('任务未完成，继续专项练习！');
                    resolve(await doExamPaper());
                    return;
                }
                resolve('done');
            }
            else {
                console.log('没有找到未完成的专项练习，跳过');
                resolve('noTest');
            }
        });
    });
}
// 获取答题按钮
function getNextButton() {
    return new Promise((resolve) => {
        let nextInterVal = setInterval(() => {
            // 答题按钮
            const nextAll = $$('.ant-btn').filter((next) => next.innerText);
            if (nextAll.length) {
                clearInterval(nextInterVal); // 停止定时器
                if (nextAll.length == 2) {
                    resolve(nextAll[1]);
                    return;
                }
                resolve(nextAll[0]);
            }
        }, 500);
    });
}
// 暂停答题
function pauseExam() {
    // 按钮
    const manualButton = $$('#manualButton')[0];
    if (manualButton) {
        console.log('自动答题失败，切换为手动');
        pause = true;
        manualButton.innerText = '开启自动答题';
        manualButton.classList.add('manual');
        createTip('已暂停，只需答题后手动开启自动答题，请勿进行其他操作（如：下一题，确认等）！', 10000);
    }
}
// 答题过程(整合)
async function doingExam() {
    // 下一个按钮
    let nextButton;
    // 保存答案
    let shouldSaveAnswer = false;
    const currentPage = $$('.pager span')[0]?.innerText;
    while (true) {
        // 先等等再开始做题
        await waitingTime(2500);
        // 暂停
        await pauseLock();
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 结束
        const finish = ['再练一次', '再来一组', '查看解析'];
        if (finish.includes(nextButton.innerText)) {
            break;
        }
        // 点击提示
        $$('.tips')[0]?.click();
        // 所有提示
        const allTips = $$('font[color=red]');
        // 等待一段时间
        await waitingTime(1500);
        // 选项按钮
        const allBtns = $$('.q-answer');
        // 所有填空
        const blanks = $$('input[type=text][class=blank]');
        // 问题类型
        const questionType = $$('.q-header')[0]
            .innerText
            ? $$('.q-header')[0].innerText.substr(0, 3)
            : '';
        switch (questionType) {
            case '填空题': {
                // 根据提示作答
                if (allTips.length) {
                    // 填空数量和提示数量一致
                    if (allTips.length === blanks.length) {
                        // 错误
                        let error = false;
                        for (let i = 0; i < allTips.length; i++) {
                            // 将答案填写到对应的空中
                            const answer = allTips[i].innerText;
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
                            }
                            else {
                                error = true;
                                break;
                            }
                        }
                        // 无错误
                        if (!error) {
                            break;
                        }
                    }
                    else if (allTips.length > 1 && blanks.length === 1) {
                        // 直接将所有答案整合填进去
                        let answer = '';
                        for (let i = 0; i < allTips.length; i++) {
                            answer += allTips[i].innerText;
                        }
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
                            break;
                        }
                    }
                }
                // 尝试题库获取
                // 生成秘钥
                const key = getKey();
                // 尝试获取答案
                const data = await getAnswer(key);
                // 获取答案数据
                if (data && data.status !== 0) {
                    // 错误
                    let error = false;
                    // 格式化
                    const answerData = JSON.parse(data.data.txt_content);
                    // 答案
                    const answers = answerData[0].content.split(';');
                    // 答案和空数量相同
                    if (answers.length === blanks.length) {
                        for (let i = 0; i < answers.length; i++) {
                            // 答案存在
                            if (answers[i] && answers[i].length) {
                                // 输入事件
                                const inputEvent = new Event('input', {
                                    bubbles: true,
                                });
                                // 设置答案
                                blanks[i].setAttribute('value', answers[i].trim());
                                // 触发输入input
                                blanks[i].dispatchEvent(inputEvent);
                            }
                            else {
                                error = true;
                                break;
                            }
                        }
                    }
                    // 无错误
                    if (!error) {
                        break;
                    }
                }
                // 暂停答题
                pauseExam();
                // 暂停
                await pauseLock();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
            case '多选题': {
                // 根据提示作答
                if (allTips.length) {
                    // 题目
                    const content = $$('.q-body')[0].innerText;
                    // 空格
                    const blanks = content.match(/（）/g);
                    // 空和选项数量相同
                    if (allBtns.length === allTips.length ||
                        blanks.length === allBtns.length) {
                        // 全选
                        allBtns.forEach((choice) => {
                            // 未被选
                            if (!choice.classList.contains('chosen')) {
                                choice.click();
                            }
                        });
                        break;
                    }
                    else if (allBtns.length > allTips.length) {
                        //  错误
                        let error = false;
                        // 提示
                        for (let i = 0; i < allTips.length; i++) {
                            // 提示
                            const tip = allTips[i];
                            // 答案
                            const answer = tip.innerText;
                            // 是否答案完全对应选项
                            let hasButton = false;
                            // 答案存在
                            if (answer && answer.length) {
                                // 按钮
                                for (let j = 0; j < allBtns.length; j++) {
                                    // 选项
                                    let choice = allBtns[j];
                                    // 选项文本
                                    const choiceText = choice.innerText;
                                    // 答案对应选项
                                    if (choiceText == answer ||
                                        choiceText.includes(answer) ||
                                        answer.includes(choiceText)) {
                                        // 对应
                                        hasButton = true;
                                        // 选择
                                        if (!$(choice).hasClass('chosen')) {
                                            choice.click();
                                        }
                                        break;
                                    }
                                }
                                // 存在不匹配
                                if (!hasButton) {
                                    error = true;
                                    break;
                                }
                            }
                            else {
                                // 答案不存在
                                error = true;
                                break;
                            }
                        }
                        // 无错误
                        if (!error) {
                            break;
                        }
                    }
                }
                // 尝试题库获取
                // 生成秘钥
                const key = getKey();
                // 尝试获取答案
                let data = await getAnswer(key);
                // 获取答案数据
                if (data && data.status !== 0) {
                    // 分割答案
                    const answerData = JSON.parse(data.data.txt_content).split(';');
                    //  错误
                    let error = false;
                    // 作答
                    for (let i = 0; i < answerData.length; i++) {
                        // 答案
                        const answer = answerData[i];
                        // 是否答案完全对应选项
                        let hasButton = false;
                        // 答案存在
                        if (answer && answer.length) {
                            for (let j = 0; j < allBtns.length; j++) {
                                // 选项
                                const choice = allBtns[j];
                                // 选项文本
                                const choiceText = choice.innerText;
                                if (choiceText == answer ||
                                    choiceText.includes(answer) ||
                                    answer.includes(choiceText)) {
                                    // 对应
                                    hasButton = true;
                                    // 选择
                                    if (!choice.classList.contains('chosen')) {
                                        choice.click();
                                    }
                                    break;
                                }
                            }
                            // 存在不匹配
                            if (!hasButton) {
                                error = true;
                                break;
                            }
                        }
                        else {
                            // 答案不存在
                            error = true;
                            break;
                        }
                    }
                    // 无错误
                    if (!error) {
                        break;
                    }
                }
                // 暂停答题
                pauseExam();
                // 暂停
                await pauseLock();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
            case '单选题': {
                // 根据提示作答
                if (allTips.length) {
                    // 提示为1
                    if (allTips.length === 1) {
                        // 答案
                        const answer = allTips[0].innerText;
                        // 是否答案完全对应选项
                        let hasButton = false;
                        // 答案存在
                        if (answer && answer.length) {
                            for (let i = 0; i < allBtns.length; i++) {
                                // 选项
                                const choice = allBtns[i];
                                // 选项文本
                                const choiceText = choice.innerText;
                                // 对比答案
                                if (choiceText == answer ||
                                    choiceText.includes(answer) ||
                                    answer.includes(choiceText)) {
                                    // 对应
                                    hasButton = true;
                                    // 选择
                                    if (!choice.classList.contains('chosen')) {
                                        choice.click();
                                    }
                                    break;
                                }
                            }
                            // 存在选项
                            if (hasButton) {
                                break;
                            }
                        }
                    }
                    else {
                        // 答案
                        const answerText = [];
                        const seperator = ['', ' ', '，', ';', ',', '、'];
                        for (let i = 0; i < allTips.length; i++) {
                            answerText.push(allTips[i].innerText);
                        }
                        // 答案
                        const answers = seperator.map((s) => answerText.join(s));
                        // 答案存在
                        if (answers.every((answer) => answer.length)) {
                            // 是否答案完全对应选项
                            let hasButton = false;
                            for (let i = 0; i < allBtns.length; i++) {
                                // 选项
                                const choice = allBtns[i];
                                // 选项文本
                                const choiceText = choice.innerText;
                                // 对比答案
                                if (answers.some((answer) => choiceText == answer ||
                                    choiceText.includes(answer) ||
                                    answer.includes(choiceText))) {
                                    // 对应
                                    hasButton = true;
                                    // 选择
                                    if (!choice.classList.contains('chosen')) {
                                        choice.click();
                                    }
                                    break;
                                }
                            }
                            // 答案选项不对应
                            if (hasButton) {
                                break;
                            }
                        }
                    }
                }
                // 尝试题库获取
                // 生成秘钥
                const key = getKey();
                // 尝试获取答案
                const data = await getAnswer(key);
                // 获取答案数据
                if (data && data.status !== 0) {
                    // 答案数据
                    const answerData = JSON.parse(data.data.txt_content);
                    // 答案
                    const answer = answerData[0].content;
                    // 答案存在
                    if (answer && answer.length) {
                        // 是否答案完全对应选项
                        let hasButton = false;
                        for (let i = 0; i < allBtns.length; i++) {
                            // 选项
                            const choice = allBtns[i];
                            // 选项文本
                            const choiceText = choice.innerText;
                            // 对比答案
                            if (choiceText == answer ||
                                choiceText.includes(answer) ||
                                answer.includes(choiceText)) {
                                // 对应
                                hasButton = true;
                                // 选择
                                if (!choice.classList.contains('chosen')) {
                                    choice.click();
                                }
                                break;
                            }
                        }
                        // 答案选项不对应
                        if (hasButton) {
                            break;
                        }
                    }
                }
                // 暂停答题
                pauseExam();
                // 暂停
                await pauseLock();
                // 提交答案
                shouldSaveAnswer = true;
                break;
            }
        }
        if (nextButton.innerText === '确 定') {
            // 需要提交答案
            if (shouldSaveAnswer) {
                // 获取key
                const key = getKey();
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
                            const [, answer] = answerTemp.split('. ');
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
                    // 答案
                    console.log(`上传了手工答案 key:${key} answer:${answer}}`);
                    await saveAnswer(key, answer);
                }
            }
            // 确认
            nextButton.click();
            // 等待一段时间
            await waitingTime(2000);
            // 答案解析
            const answerBox = $$('.answer')[0];
            // 答题错误
            if (answerBox) {
                // 获取key
                const key = getKey();
                const answerTemp = answerBox.innerText;
                // 从字符串中拿出答案
                const [, answer] = answerTemp.split('：');
                if (answer && answer.length) {
                    answer.replaceAll(' ', ';');
                    console.log(`上传了错题答案 key:${key} answer:${answer}}`);
                    await saveAnswer(key, answer);
                }
                nextButton = await getNextButton();
                // 每周、专项暂停
                if (url.includes(URL_CONFIG.examWeekly.replace('{id}', '')) ||
                    url.includes(URL_CONFIG.examPaper.replace('{id}', ''))) {
                    // 暂停答题
                    pauseExam();
                    // 暂停
                    await pauseLock();
                }
            }
        }
        else if (nextButton.innerText === '下一题' ||
            nextButton.innerText === '交 卷') {
            // 等待一段时间
            await waitingTime(2500);
            // 下一题
            nextButton.click();
        }
        else {
            // 已经做完，跳出循环
            break;
        }
    }
    closeWin();
}
// 获取关键字
function getKey() {
    // 获取题目的文本内容
    let content = $$('.q-body')[0].innerText;
    // 外部引用md5加密
    const key = md5(content);
    console.log(`获取 key:${key}}`);
    return key;
}
// 初始化配置
function initSetting() {
    try {
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp) {
            settings = settingTemp;
        }
        else {
            settings = [true, true, true, true, true, false, false];
        }
    }
    catch (e) {
        // 没有则直接初始化
        settings = [true, true, true, true, true, false, false];
    }
}
// 初始化配置
function initFontSize() {
    // 移动端
    const moblie = hasMobile();
    if (moblie) {
        const scale = window.innerWidth / window.outerWidth;
        document.documentElement.style.fontSize = `${10 * scale}px`;
    }
}
// 创建“手动答题”按钮
function createManualButton() {
    const title = $$('.title')[0];
    // 按钮
    const manualButton = creatElementNode('button', { innerText: '关闭自动答题' }, {
        id: 'manualButton',
        class: 'egg_btn',
        type: 'button',
        onclick: clickManualButton,
    });
    // 插入节点
    title.parentNode.insertBefore(manualButton, title.nextSibling);
}
// 点击手动学习按钮
function clickManualButton() {
    const manualButton = $$('#manualButton')[0];
    pause = !pause;
    if (pause) {
        manualButton.innerText = '开启自动答题';
        manualButton.classList.add('manual');
    }
    else {
        manualButton.innerText = '关闭自动答题';
        manualButton.classList.remove('manual');
    }
}
// 加载用户信息
async function loadUserInfo() {
    const egg_userinfo = $$('.egg_userinfo')[0];
    egg_userinfo.innerHTML = '';
    // 登录状态
    const loginStatus = creatElementNode('div', undefined, {
        class: 'egg_login_status',
    });
    if (login) {
        // 获取用户信息
        userInfo = await getUserInfo();
        if (userInfo) {
            const { avatarMediaUrl, nick } = userInfo;
            const avatarItems = [];
            if (avatarMediaUrl) {
                // 图片
                const img = creatElementNode('img', undefined, {
                    src: avatarMediaUrl,
                    class: 'egg_avatar_img',
                });
                avatarItems.push(img);
            }
            else {
                // 文字
                const subNickName = creatElementNode('div', { innerText: nick.substring(1, 3) }, { class: 'egg_sub_nickname' });
                avatarItems.push(subNickName);
            }
            // 头像
            const avatar = creatElementNode('div', undefined, { class: 'egg_avatar' }, avatarItems);
            // 昵称
            const nickName = creatElementNode('div', { innerText: nick }, { class: 'egg_name' });
            // 关于用户
            const user = creatElementNode('div', undefined, { class: 'egg_user' }, [
                avatar,
                nickName,
            ]);
            egg_userinfo.append(user);
        }
        // 退出按钮
        const logoutBtn = creatElementNode('button', { innerText: '退出' }, {
            type: 'button',
            onclick() {
                const logged = $$("a[class='logged-link']")[0];
                logged.click();
            },
        });
        loginStatus.classList.remove('active');
        loginStatus.append(logoutBtn);
    }
    else {
        // 登录按钮
        const loginBtn = creatElementNode('button', { innerText: '请先登录' }, {
            type: 'button',
            onclick() {
                loginWindow();
            },
        });
        loginStatus.classList.add('active');
        loginBtn.addEventListener('click', () => {
            loginWindow();
        });
        loginStatus.append(loginBtn);
    }
    egg_userinfo.append(loginStatus);
}
// 加载分数
async function loadScoreInfo() {
    if (login) {
        // 获取总分
        const totalScore = await getTotalScore();
        // 获取当天总分
        const todayScore = await getTodayScore();
        // 更新分数
        const totalScoreSpan = $$('.egg_scoreinfo .egg_totalscore span')[0];
        const todayScoreSpan = $$('.egg_scoreinfo .egg_todayscore span')[0];
        totalScoreSpan.innerText = totalScore;
        todayScoreSpan.innerText = todayScore;
    }
}
// 加载任务列表
async function loadTaskList() {
    // 原始任务进度
    const taskProgress = await getTaskList();
    if (taskProgress) {
        // 进度条对象
        const taskProgressList = $$('.egg_progress');
        // 文章
        const { currentScore: artCur, dayMaxScore: artMax } = taskProgress[0];
        tasks[0] = {
            currentScore: artCur,
            dayMaxScore: artMax,
            status: false,
        };
        // 视频
        const { currentScore: videoCur1, dayMaxScore: videoMax1 } = taskProgress[1];
        const { currentScore: videoCur2, dayMaxScore: videoMax2 } = taskProgress[3];
        tasks[1] = {
            currentScore: videoCur1 + videoCur2,
            dayMaxScore: videoMax1 + videoMax2,
            status: false,
        };
        // 每日答题
        const { currentScore: dayCur, dayMaxScore: dayMax } = taskProgress[6];
        tasks[2] = {
            currentScore: dayCur,
            dayMaxScore: dayMax,
            status: false,
        };
        // 每周答题
        const { currentScore: weekCur, dayMaxScore: weekMax } = taskProgress[2];
        tasks[3] = {
            currentScore: weekCur,
            dayMaxScore: weekMax,
            status: false,
        };
        // 专项练习
        const { currentScore: exerCur, dayMaxScore: exerMax } = taskProgress[5];
        tasks[4] = {
            currentScore: exerCur,
            dayMaxScore: exerMax,
            status: false,
        };
        // 更新数据
        for (const i in tasks) {
            const { currentScore, dayMaxScore } = tasks[i];
            // 进度
            let rate = (100 * currentScore) / dayMaxScore;
            // 修复专项练习成组做完,进度条显示异常
            if (dayMaxScore <= currentScore) {
                rate = 100;
            }
            if (rate === 100) {
                tasks[i].status = true;
            }
            // 修复每周答题、专项练习做完,进度条显示异常
            if (rate > 0) {
                // 进度条
                const bar = taskProgressList[i].querySelector('.egg_bar');
                // 百分比
                const percent = taskProgressList[i].querySelector('.egg_percent');
                // 长度
                bar.style.width = `${rate.toFixed(2)}%`;
                // 文字
                percent.innerText = `${rate.toFixed(0)}%`;
            }
        }
    }
}
// 刷新菜单数据
async function refreshMenu() {
    // 加载分数信息
    await loadScoreInfo();
    // 加载任务列表
    await loadTaskList();
}
// 渲染菜单
async function renderMenu() {
    // 设置项
    const settingItems = [];
    // 用户信息
    const userinfo = creatElementNode('div', undefined, {
        class: 'egg_userinfo',
    });
    // 总分
    const totalScoreSpan = creatElementNode('span', { innerText: 0 });
    const totalScoreDiv = creatElementNode('div', { innerHTML: '总积分' }, { class: 'egg_totalscore' }, totalScoreSpan);
    // 当天总分
    const todayScoreSpan = creatElementNode('span', { innerText: 0 });
    const todayScoreDiv = creatElementNode('div', { innerHTML: '当天积分' }, { class: 'egg_todayscore' }, todayScoreSpan);
    // 分数信息
    const scoreinfo = creatElementNode('div', undefined, { class: 'egg_scoreinfo' }, [totalScoreDiv, todayScoreDiv]);
    // 信息
    const info = creatElementNode('div', undefined, { class: 'egg_setting_item egg_info' }, [userinfo, scoreinfo]);
    settingItems.push(info);
    // 任务标签
    const settingTaskLabels = [
        '文章选读',
        '视听学习',
        '每日答题',
        '每周答题',
        '专项练习',
    ];
    // 分割线
    settingItems.push(creatElementNode('hr'));
    for (const i in settingTaskLabels) {
        // 进度条
        const bar = creatElementNode('div', undefined, { class: 'egg_bar' });
        // 轨道
        const track = creatElementNode('div', undefined, { class: 'egg_track' }, bar);
        // 百分比符号
        const percentSymbol = creatElementNode('span', { innerText: '%' }, { class: 'egg_percentsymbol' });
        // 数值
        const percent = creatElementNode('div', { innerText: '0' }, { class: 'egg_percent' }, percentSymbol);
        // 进度
        const progress = creatElementNode('div', undefined, { class: 'egg_progress' }, [track, percent]);
        // 标签
        const label = creatElementNode('label', {
            innerText: settingTaskLabels[i],
        }, undefined, progress);
        // 处理设置选项变化
        const handleCheckChange = debounce(async (checked) => {
            if (settings[i] !== checked) {
                // 创建提示
                const { destroy } = await createTip(`${settingTaskLabels[i]}已${checked ? '打开' : '关闭'}`, 2000);
                // 销毁
                destroy();
                settings[i] = checked;
                // 运行时是否要隐藏
                GM_setValue('studySetting', JSON.stringify(settings));
            }
        }, 500);
        // 选项
        const input = creatElementNode('input', undefined, {
            title: settingTaskLabels[i],
            class: 'egg_setting_switch',
            type: 'checkbox',
            checked: settings[i] ? 'checked' : '',
            onchange(e) {
                const { checked } = e.target;
                handleCheckChange(checked);
            },
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item' }, [label, input]);
        settingItems.push(item);
    }
    // 分割线
    settingItems.push(creatElementNode('hr'));
    // 设置标签
    const settingLabel = ['运行隐藏', '自动开始'];
    for (const i in settingLabel) {
        // 标签
        const label = creatElementNode('label', {
            innerText: settingLabel[i],
        });
        // 当前序号
        const currentIndex = Number(i) + settingTaskLabels.length;
        // 处理设置选项变化
        const handleCheckChange = debounce(async (checked) => {
            if (settings[currentIndex] !== checked) {
                // 创建提示
                const { destroy } = await createTip(`${settingLabel[i]}已${checked ? '打开' : '关闭'}，部分设置刷新后生效！`, 2000);
                // 销毁
                destroy();
                settings[currentIndex] = checked;
                // 运行时是否要隐藏
                GM_setValue('studySetting', JSON.stringify(settings));
            }
        }, 500);
        // 选项
        const input = creatElementNode('input', undefined, {
            title: settingLabel[i],
            class: 'egg_setting_switch',
            type: 'checkbox',
            checked: settings[currentIndex] ? 'checked' : '',
            onchange: (e) => {
                const { checked } = e.target;
                handleCheckChange(checked);
            },
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item' }, [label, input]);
        settingItems.push(item);
    }
    // 窗口项
    const frame = creatElementNode('div', undefined, { class: 'egg_frame' });
    settingItems.push(frame);
    // 设置
    const settingBox = creatElementNode('div', undefined, { class: 'egg_setting_box' }, settingItems);
    // 菜单
    const menu = creatElementNode('div', undefined, {
        id: 'settingData',
        class: `egg_menu${hasMobile() ? ' mobile' : ''}`,
    }, settingBox);
    // 根容器
    const base = creatElementNode('div', undefined, undefined, menu);
    // 插入节点
    document.body.append(base);
    // 加载用户信息
    await loadUserInfo();
    // 加载分数信息
    await loadScoreInfo();
    // 加载任务列表
    await loadTaskList();
    // 渲染开始按钮
    if (login) {
        // 开始学习按钮
        const startButton = creatElementNode('button', { innerText: '开始学习' }, {
            id: 'startButton',
            class: 'egg_study_btn',
            type: 'button',
            onclick: start,
        });
        // 设置项
        const item = creatElementNode('div', undefined, { class: 'egg_setting_item egg_start_btn' }, startButton);
        settingBox.append(item);
        // 完成任务
        if (tasks.every((task) => task.status)) {
            finishTask();
        }
    }
    // 自动答题'
    if (login && settings[6]) {
        await createTip('3秒后开始自动答题', 3000);
        start();
    }
}
// 是否显示目录
function showMenu(isShow = true) {
    let items = $$('.egg_menu');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = isShow ? 'block' : 'none';
    }
}
// 登录状态
function loginStatus() {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (getCookie('token')) {
                clearInterval(timer);
                resolve(true);
            }
        }, 100);
    });
}
// 登录窗口
async function loginWindow() {
    const frame = $$('.egg_frame')[0];
    const settingBox = $$('.egg_setting_box')[0];
    if (frame) {
        let iframe = frame.querySelector('iframe');
        if (!iframe) {
            iframe = creatElementNode('iframe');
            frame.append(iframe);
        }
        settingBox.classList.add('active');
        // 登录页面
        iframe.src = URL_CONFIG.login;
        // 刷新
        const refresh = window.setInterval(() => {
            // 登录刷新
            iframe.src = URL_CONFIG.login;
        }, 100000);
        const res = await loginStatus();
        if (res) {
            // 登录成功
            window.clearInterval(refresh);
            console.log('登录成功！');
            window.location.reload();
            return;
        }
        return;
    }
}
// 学习
async function study() {
    console.log('开始学习');
    // 暂停
    await pauseStudyLock();
    // 任务
    if (tasks.length) {
        // 检查新闻
        if (settings[0] && !tasks[0].status) {
            console.log('任务一：看新闻');
            // 暂停
            await pauseStudyLock();
            // 看新闻
            await readNews();
        }
        if (settings[1] && !tasks[1].status) {
            console.log('任务二：看视频');
            // 暂停
            await pauseStudyLock();
            // 看视频
            await watchVideo();
        }
        // 检查每日答题
        if (settings[2] && !tasks[2].status) {
            console.log('任务三：做每日答题');
            // 暂停
            await pauseStudyLock();
            // 做每日答题
            await doExamPractice();
        }
        // 检查每周答题
        if (settings[3] && !tasks[3].status) {
            console.log('任务四：做每周答题');
            // 暂停
            await pauseStudyLock();
            // 做每周答题
            const res = await doExamWeekly();
            if (res === 'noTest') {
                // 如果是全都完成了，已经没有能做的了
                tasks[3].status = true;
                // 修复每周答题做完,进度条显示异常
                // 进度条对象
                const taskProgressList = $$('.egg_progress');
                // 进度条
                const bar = taskProgressList[3].querySelector('.egg_bar');
                // 百分比
                const percent = taskProgressList[3].querySelector('.egg_percent');
                // 长度
                bar.style.width = `100%`;
                // 文字
                percent.innerText = `100%`;
            }
        }
    }
    // 检查专项练习
    if (settings[4] && !tasks[4].status) {
        console.log('5.做专项练习');
        // 暂停
        await pauseStudyLock();
        // 做专项练习
        const res = await doExamPaper();
        if (res === 'noTest') {
            // 如果是全都完成了，已经没有能做的了
            tasks[4].status = true;
            // 修复专项练习做完,进度条显示异常
            // 进度条对象
            const taskProgressList = $$('.egg_progress');
            // 进度条
            const bar = taskProgressList[4].querySelector('.egg_bar');
            // 百分比
            const percent = taskProgressList[4].querySelector('.egg_percent');
            // 长度
            bar.style.width = `100%`;
            // 文字
            percent.innerText = `100%`;
        }
    }
}
// 暂停任务
function pauseTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    pauseStudy = true;
    startButton.innerText = '继续学习';
    startButton.classList.remove('loading');
    startButton.removeEventListener('click', pauseTask);
    startButton.addEventListener('click', continueTask);
}
// 继续任务
function continueTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    pauseStudy = false;
    startButton.innerText = '正在学习，点击暂停';
    startButton.classList.add('loading');
    startButton.removeEventListener('click', continueTask);
    startButton.addEventListener('click', pauseTask);
}
// 完成任务
function finishTask() {
    // 开始按钮
    const startButton = $$('#startButton')[0];
    startButton.innerText = '已完成';
    startButton.classList.remove('loading');
    startButton.classList.add('disabled');
    startButton.setAttribute('disabled', '');
}
// 开始
async function start() {
    // 保存配置
    console.log('初始化...');
    console.log('检查是否登录...');
    if (login) {
        // 开始按钮
        const startButton = $$('#startButton')[0];
        startButton.innerText = '正在学习，点击暂停';
        startButton.classList.add('loading');
        startButton.removeEventListener('click', start);
        // 点击暂停
        startButton.addEventListener('click', pauseTask);
        // 隐藏菜单
        if (settings[5]) {
            showMenu(false);
        }
        // 查询今天还有什么任务没做完
        console.log('检查今天还有什么任务没做完');
        // 任务
        if (tasks.length) {
            // 学习
            await study();
            // 未完成
            if (!tasks.every((task) => task.status)) {
                await study();
            }
            // 刷新菜单数据
            await refreshMenu();
            finishTask();
            console.log('已完成');
        }
        if (settings[5]) {
            showMenu();
        }
    }
    else {
        // 提醒登录
        alert('请先登录');
        console.log('登录中...');
        // 登录窗口
        await loginWindow();
    }
    return;
}

