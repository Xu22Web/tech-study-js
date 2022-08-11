"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var index_css_raw_1 = require("./css/index.css?raw");
GM_addStyle(index_css_raw_1["default"]);
/* Config·配置 */
// // 重要新闻列表（主）
// const NewsUrl1 = 'https://www.xuexi.cn/lgdata/1jscb6pu1n2.json';
// // 学习时评新闻列表
// const NewsUrl2 = 'https://www.xuexi.cn/lgdata/1ap1igfgdn2.json';
// // 新闻视频列表
// const VideosUrl1 = 'https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json';
// // 新闻视频列表
// const VideosUrl2 = 'https://www.xuexi.cn/lgdata/1742g60067k.json';
// 主页
var indexMatch = [
    'https://www.xuexi.cn',
    'https://www.xuexi.cn/',
    'https://www.xuexi.cn/index.html',
];
// url配置
var URL_CONFIG = {
    // 每日答题页面
    examPractice: 'https://pc.xuexi.cn/points/exam-practice.html',
    // 每周答题页面
    examWeekly: 'https://pc.xuexi.cn/points/exam-weekly-detail.html?id={id}',
    // 专项练习页面
    examPaper: 'https://pc.xuexi.cn/points/exam-paper-detail.html?id={id}',
    // 登录界面
    login: 'https://login.xuexi.cn/login/xuexiWeb?appid=dingoankubyrfkttorhpou&goto=https%3A%2F%2Foa.xuexi.cn&type=1&state=ffdea2ded23f45ab%2FKQreTlDFe1Id3B7BVdaaYcTMp6lsTBB%2Fs3gGevuMKfvpbABDEl9ymG3bbOgtpSN&check_login=https%3A%2F%2Fpc-api.xuexi.cn'
};
// api配置
var API_CONFIG = {
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
    answerDetail: 'https://a6.qikekeji.com/txt/data/detail'
};
// 每周答题当前页码
var examWeeklyPageNo = 1;
// 每周答题总页码
var examWeeklyTotalPageCount = -1;
// 每周答题开启逆序答题: false: 顺序答题; true: 逆序答题
var examWeeklyReverse = true;
// 专项练习当前页码
var examPaperPageNo = 1;
// 专项练习总页码
var examPaperTotalPageCount = -1;
// 专 项答题开启逆序答题: false: 顺序答题; true: 逆序答题
var examPaperReverse = true;
// 每周答题，专项练习 请求rate 限制 每 3000ms 一次
var ratelimitms = 3000;
/* Config End·配置结束 */
/* Tools·工具函数  */
// 获取cookie
function getCookie(name) {
    // 获取当前所有cookie
    var strCookies = document.cookie;
    // 截取变成cookie数组
    var array = strCookies.split(';');
    // 循环每个cookie
    for (var i = 0; i < array.length; i++) {
        // 将cookie截取成两部分
        var item = array[i].split('=');
        // 判断cookie的name 是否相等
        if (item[0].trim() === name) {
            return item[1].trim();
        }
    }
    return null;
}
// 删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    // 获取cookie是否存在
    var value = getCookie(name);
    if (value !== null) {
        document.cookie = name + '=' + value + ';expires=' + exp.toUTCString();
    }
}
// 防抖
function debounce(callback, delay) {
    var timer;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer !== -1) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            callback.apply(_this, args);
        }, delay);
    };
}
// 选择器
function $$(selector) {
    return document.querySelectorAll(selector);
}
// 默认情况下, chrome 只允许 window.close 关闭 window.open 打开的窗口,所以我们就要用window.open命令,在原地网页打开自身窗口再关上,就可以成功关闭了
function closeWin() {
    try {
        window.opener = window;
        var win = window.open('', '_self');
        win === null || win === void 0 ? void 0 : win.close();
        top === null || top === void 0 ? void 0 : top.close();
    }
    catch (e) { }
}
// 等待窗口关闭
function waitingClose(newPage) {
    return new Promise(function (resolve) {
        var doing = setInterval(function () {
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
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('done');
        }, time);
    });
}
// 暂停锁
function pauseLock(callback) {
    return new Promise(function (resolve) {
        var doing = setInterval(function () {
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
    return new Promise(function (resolve) {
        var doing = setInterval(function () {
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
// 创建元素节点
function creatElementNode(eleName, props, attrs, children) {
    // 元素
    var ele;
    // 格式化元素名
    var formatEleName = eleName.toLowerCase();
    // 需要命名空间的svg元素
    var specficSVGElement = [
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
    var specficHTMLElement = 'html';
    if (formatEleName === specficHTMLElement) {
        // html元素命名空间
        var ns = 'http://www.w3.org/1999/xhtml';
        // 创建普通元素
        ele = document.createElementNS(ns, formatEleName);
    }
    else if (specficSVGElement.includes(formatEleName)) {
        // svg元素命名空间
        var ns = 'http://www.w3.org/2000/svg';
        // 创建普通元素
        ele = document.createElementNS(ns, formatEleName);
    }
    else {
        // 创建普通元素
        ele = document.createElement(formatEleName);
    }
    // props属性设置
    for (var key in props) {
        if (props[key] instanceof Object) {
            for (var subkey in props[key]) {
                ele[key][subkey] = props[key][subkey];
            }
        }
        else {
            ele[key] = props[key];
        }
    }
    // attrs属性设置
    for (var key in attrs) {
        // 属性值
        var value = attrs[key];
        // 处理完的key
        var formatKey = key.toLowerCase();
        // xlink命名空间
        if (formatKey.startsWith('xlink:')) {
            // xlink属性命名空间
            var attrNS = 'http://www.w3.org/1999/xlink';
            if (value) {
                ele.setAttributeNS(attrNS, key, value);
            }
            else {
                ele.removeAttributeNS(attrNS, key);
            }
        }
        else if (formatKey.startsWith('on')) {
            // 事件监听
            var _a = key.toLowerCase().split('on'), eventType = _a[1];
            // 事件类型
            if (eventType) {
                // 回调函数
                if (value instanceof Function) {
                    ele.addEventListener(eventType, value);
                    // 回调函数数组
                }
                else if (value instanceof Array) {
                    for (var i in value) {
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
            var specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
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
                var fragment = document.createDocumentFragment();
                for (var i in children) {
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
function createTextNode() {
    var text = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        text[_i] = arguments[_i];
    }
    if (text && text.length === 1) {
        return document.createTextNode(text[0]);
    }
    var fragment = document.createDocumentFragment();
    for (var i in text) {
        var textEle = document.createTextNode(text[i]);
        fragment.append(textEle);
    }
    return fragment;
}
/* Tools End·工具函数结束 */
/* API请求函数 */
// 获取用户信息
function getUserInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.userInfo, {
                        method: 'GET',
                        credentials: 'include'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 4:
                    err_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 获取总积分
function getTotalScore() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, score, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.totalScore, {
                        method: 'GET',
                        credentials: 'include'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_a.sent()).data;
                    score = data.score;
                    return [2 /*return*/, score];
                case 4:
                    err_2 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 获取当天总积分
function getTodayScore() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, score, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.todayScore, {
                        method: 'GET',
                        credentials: 'include'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_a.sent()).data;
                    score = data.score;
                    return [2 /*return*/, score];
                case 4:
                    err_3 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 获取任务列表
function getTaskList() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, taskProgress, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.taskList, {
                        method: 'GET',
                        credentials: 'include'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_a.sent()).data;
                    taskProgress = data.taskProgress;
                    return [2 /*return*/, taskProgress];
                case 4:
                    err_4 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 获取新闻数据
function getTodayNews() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.todayNews, {
                        method: 'GET'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_5 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 获取视频数据
function getTodayVideos() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(API_CONFIG.todayVideos, {
                        method: 'GET'
                    })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 4:
                    err_6 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 专项练习数据
function getExamPaper(pageNo) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, data, paperJson, paper, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = API_CONFIG.paperList.replace('{pageNo}', String(pageNo));
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            credentials: 'include'
                        })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
                    paper = JSON.parse(paperJson);
                    return [2 /*return*/, paper];
                case 4:
                    err_7 = _a.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/, []];
            }
        });
    });
}
// 每周答题数据
function getExamWeekly(pageNo) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, data, paperJson, paper, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = API_CONFIG.weeklyList.replace('{pageNo}', String(pageNo));
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            credentials: 'include'
                        })];
                case 1:
                    res = _a.sent();
                    if (!(res && res.ok)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    paperJson = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/'))));
                    paper = JSON.parse(paperJson);
                    return [2 /*return*/, paper];
                case 4:
                    err_8 = _a.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/, []];
            }
        });
    });
}
// 保存答案
function saveAnswer(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            content = JSON.stringify([{ title: key, content: value }]);
            return [2 /*return*/, new Promise(function (resolve) {
                    $.ajax({
                        type: 'POST',
                        url: API_CONFIG.answerSave,
                        data: {
                            txt_name: key,
                            txt_content: content,
                            password: '',
                            v_id: ''
                        },
                        dataType: 'json',
                        success: function (data) {
                            resolve(data);
                        },
                        error: function () {
                            resolve('error');
                        }
                    });
                })];
        });
    });
}
// 获取答案
function getAnswer(key) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    $.ajax({
                        type: 'POST',
                        url: API_CONFIG.answerDetail,
                        data: {
                            txt_name: key,
                            password: ''
                        },
                        dataType: 'json',
                        success: function (data) {
                            resolve(data);
                        },
                        error: function () {
                            resolve('error');
                        }
                    });
                })];
        });
    });
}
/* API请求函数结束 */
/* 变量 */
// 获取当前日期
var currDate = new Date().toISOString().split('T')[0];
// 任务进度
var tasks = [];
// 获取URL
var url = window.location.href;
// 设置
var settings = [true, true, true, true, true, true, true, false, false];
// 是否暂停答题
var pause = false;
// 是否暂停学习
var pauseStudy = false;
// 初始化登录状态
var login = Boolean(getCookie('token'));
// 用户信息
var userInfo;
// 新闻数
var newsNum = 6;
// 新闻
var news = [];
// 视频数
var videoNum = 6;
// 视频
var videos = [];
// dom加载
$(document).ready(function () { return __awaiter(void 0, void 0, void 0, function () {
    var ready_1, settingTemp, e_1, settingTemp, e_2, randNum_1, checkVideoPlayingInterval, ready_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!indexMatch.includes(url)) return [3 /*break*/, 1];
                ready_1 = setInterval(function () {
                    if ($$('.text-wrap')[0]) {
                        // 停止定时器
                        clearInterval(ready_1);
                        // 初始化设置
                        initSetting();
                        // 渲染菜单
                        renderMenu();
                    }
                }, 800);
                return [3 /*break*/, 16];
            case 1:
                if (!(typeof GM_getValue('readingUrl') === 'string' &&
                    url == GM_getValue('readingUrl'))) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 7]);
                settingTemp = JSON.parse(GM_getValue('studySetting'));
                if (!!settingTemp[7]) return [3 /*break*/, 4];
                return [4 /*yield*/, createTip()];
            case 3:
                _a.sent(); // 创建学习提示
                _a.label = 4;
            case 4:
                reading(0);
                return [3 /*break*/, 7];
            case 5:
                e_1 = _a.sent();
                return [4 /*yield*/, createTip()];
            case 6:
                _a.sent(); // 创建学习提示
                reading(0);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 16];
            case 8:
                if (!(typeof GM_getValue('watchingUrl') === 'string' &&
                    url == GM_getValue('watchingUrl'))) return [3 /*break*/, 15];
                _a.label = 9;
            case 9:
                _a.trys.push([9, 12, , 14]);
                settingTemp = JSON.parse(GM_getValue('studySetting'));
                if (!!settingTemp[7]) return [3 /*break*/, 11];
                return [4 /*yield*/, createTip()];
            case 10:
                _a.sent(); // 创建学习提示
                _a.label = 11;
            case 11: return [3 /*break*/, 14];
            case 12:
                e_2 = _a.sent();
                return [4 /*yield*/, createTip()];
            case 13:
                _a.sent(); // 创建学习提示
                return [3 /*break*/, 14];
            case 14:
                randNum_1 = 0;
                checkVideoPlayingInterval = setInterval(function () {
                    var _a;
                    var temp = getVideoTag();
                    if (temp.video) {
                        if (!temp.video.muted) {
                            temp.video.muted = true;
                        }
                        if (temp.video.paused) {
                            temp.video.play();
                            console.log('正在尝试播放视频');
                            if (randNum_1 == 0) {
                                // 尝试使用js的方式播放
                                try {
                                    temp.video.play(); // 尝试使用js的方式播放
                                }
                                catch (e) { }
                                randNum_1++;
                            }
                            else {
                                try {
                                    (_a = temp.pauseButton) === null || _a === void 0 ? void 0 : _a.click(); // 尝试点击播放按钮播放
                                }
                                catch (e) { }
                                randNum_1--;
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
                return [3 /*break*/, 16];
            case 15:
                if (url.indexOf('exam') != -1 && url.indexOf('list') == -1) {
                    ready_2 = setInterval(function () {
                        if ($$('.title')[0]) {
                            clearInterval(ready_2); // 停止定时器
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
                _a.label = 16;
            case 16: return [2 /*return*/];
        }
    });
}); });
// 获取video标签
function getVideoTag() {
    var _a, _b, _c, _d;
    // 窗口
    var iframe = $$('iframe')[0];
    // 视频
    var video = null;
    // 暂停按钮
    var pauseButton = null;
    // 用户代理
    var u = navigator.userAgent;
    if (u.indexOf('Mac') > -1) {
        // Mac
        if (iframe !== null && iframe.innerHTML) {
            // 如果有iframe,说明外面的video标签是假的
            video = ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.getElementsByTagName('video')[0]);
            pauseButton = ((_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton
        };
    }
    else {
        if (iframe) {
            // 如果有iframe,说明外面的video标签是假的
            video = ((_c = iframe.contentWindow) === null || _c === void 0 ? void 0 : _c.document.getElementsByTagName('video')[0]);
            pauseButton = ((_d = iframe.contentWindow) === null || _d === void 0 ? void 0 : _d.document.getElementsByClassName('prism-play-btn')[0]);
        }
        else {
            // 否则这个video标签是真的
            video = $$('video')[0];
            pauseButton = $$('.prism-play-btn')[0];
        }
        return {
            video: video,
            pauseButton: pauseButton
        };
    }
}
// 读新闻或者看视频
// type:0为新闻，1为视频
function reading(type) {
    return __awaiter(this, void 0, void 0, function () {
        var time, firstTime, secendTime, scrollLength, readingInterval;
        return __generator(this, function (_a) {
            time = 1;
            if (type == 0) {
                // 80-100秒后关闭页面，看文章
                time = ~~(Math.random() * (100 - 80 + 1) + 80);
            }
            else {
                // 230-250秒后关闭页面，看视频
                time = ~~(Math.random() * (250 - 230 + 1) + 230);
            }
            firstTime = time - 2;
            secendTime = 12;
            scrollLength = document.body.scrollHeight / 2;
            readingInterval = setInterval(function () {
                time--;
                $('#studyTip').text(time + ' 秒后关闭页面');
                if (time <= firstTime) {
                    try {
                        $('html,body').animate({ scrollTop: 394 }, 1000);
                    }
                    catch (e) {
                        window.scrollTo(0, 394);
                    }
                    firstTime = -1;
                }
                if (time <= secendTime) {
                    try {
                        $('html,body').animate({ scrollTop: scrollLength / 3 }, 1000);
                    }
                    catch (e) {
                        window.scrollTo(0, scrollLength / 3);
                    }
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
            return [2 /*return*/];
        });
    });
}
// 创建学习提示
function createTip(text, delay) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    // 提示
                    var tipInfo = creatElementNode('div', {
                        style: {
                            position: 'fixed',
                            bottom: '15px',
                            left: '5px',
                            padding: '12px 14px',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: '#222222',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        },
                        innerText: text ? text : ''
                    }, { id: 'studyTip' });
                    // 插入节点
                    document.body.append(tipInfo);
                    // 操作
                    var operate = {
                        destroy: function () {
                            tipInfo === null || tipInfo === void 0 ? void 0 : tipInfo.remove();
                            tipInfo = null;
                        },
                        hide: function () {
                            if (tipInfo) {
                                tipInfo.style.display = 'none';
                            }
                        },
                        show: function () {
                            if (tipInfo) {
                                tipInfo.style.display = 'block';
                            }
                        }
                    };
                    // 存在延时
                    if (delay && delay >= 0) {
                        setTimeout(function () {
                            operate.hide();
                            resolve(operate);
                        }, delay);
                        return;
                    }
                    resolve(operate);
                })];
        });
    });
}
// 获取新闻列表
function getNews() {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var need, data, i, randomIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    need = newsNum < 6 ? newsNum : 6;
                    console.log('还需要看' + need + '个新闻');
                    return [4 /*yield*/, getTodayNews()];
                case 1:
                    data = _a.sent();
                    if (data && data.length) {
                        if (need == 6) {
                            // 如果今天还没学过，则优先找今天的新闻
                            for (i = 0; i < need; i++) {
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
                            randomIndex = ~~(Math.random() * (data.length + 1));
                            news.push(data[randomIndex]);
                        }
                    }
                    else {
                        news = [];
                    }
                    resolve('done');
                    return [2 /*return*/];
            }
        });
    }); });
}
// 获取视频列表
function getVideos() {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var need, data, i, randomIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    need = videoNum < 6 ? videoNum : 6;
                    console.log("\u8FD8\u9700\u8981\u770B".concat(need, "\u4E2A\u89C6\u9891"));
                    return [4 /*yield*/, getTodayNews()];
                case 1:
                    data = _a.sent();
                    if (data && data.length) {
                        if (need == 6) {
                            // 如果今天还没学过，则优先找今天的视频
                            for (i = 0; i < need; i++) {
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
                            randomIndex = ~~(Math.random() * (data.length + 1));
                            videos.push(data[randomIndex]);
                        }
                    }
                    else {
                        videos = [];
                    }
                    resolve('done');
                    return [2 /*return*/];
            }
        });
    }); });
}
// 阅读文章
function readNews() {
    return __awaiter(this, void 0, void 0, function () {
        var i, newPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNews()];
                case 1:
                    _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < news.length)) return [3 /*break*/, 9];
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 3:
                    // 暂停
                    _a.sent();
                    GM_setValue('readingUrl', news[i].url);
                    console.log('正在看第' + (i + 1) + '个新闻');
                    newPage = GM_openInTab(news[i].url, {
                        active: true,
                        insert: true,
                        setParent: true
                    });
                    // 等待窗口关闭
                    return [4 /*yield*/, waitingClose(newPage)];
                case 4:
                    // 等待窗口关闭
                    _a.sent();
                    // 等待一段时间
                    return [4 /*yield*/, waitingTime(1500)];
                case 5:
                    // 等待一段时间
                    _a.sent();
                    // 刷新菜单数据
                    return [4 /*yield*/, refreshMenu()];
                case 6:
                    // 刷新菜单数据
                    _a.sent();
                    if (!(settings[0] && !tasks[0].status)) return [3 /*break*/, 8];
                    console.log('任务未完成，继续看新闻！');
                    return [4 /*yield*/, readNews()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// 看学习视频
function watchVideo() {
    return __awaiter(this, void 0, void 0, function () {
        var i, newPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 获取视频
                return [4 /*yield*/, getVideos()];
                case 1:
                    // 获取视频
                    _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < videos.length)) return [3 /*break*/, 8];
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 3:
                    // 暂停
                    _a.sent();
                    GM_setValue('watchingUrl', videos[i].url);
                    console.log('正在观看第' + (i + 1) + '个视频');
                    newPage = GM_openInTab(videos[i].url, {
                        active: true,
                        insert: true,
                        setParent: true
                    });
                    // 等待窗口关闭
                    return [4 /*yield*/, waitingClose(newPage)];
                case 4:
                    // 等待窗口关闭
                    _a.sent();
                    // 等待一段时间
                    return [4 /*yield*/, waitingTime(1500)];
                case 5:
                    // 等待一段时间
                    _a.sent();
                    // 刷新菜单数据
                    return [4 /*yield*/, refreshMenu()];
                case 6:
                    // 刷新菜单数据
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 2];
                case 8:
                    if (!(settings[1] && !tasks[1].status)) return [3 /*break*/, 10];
                    console.log('任务未完成，继续看视频！');
                    return [4 /*yield*/, watchVideo()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
// 做每日答题
function doExamPractice() {
    return __awaiter(this, void 0, void 0, function () {
        var newPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 暂停
                return [4 /*yield*/, pauseStudyLock()];
                case 1:
                    // 暂停
                    _a.sent();
                    console.log('正在完成每日答题');
                    newPage = GM_openInTab(URL_CONFIG.examPractice, {
                        active: true,
                        insert: true,
                        setParent: true
                    });
                    // 等待窗口关闭
                    return [4 /*yield*/, waitingClose(newPage)];
                case 2:
                    // 等待窗口关闭
                    _a.sent();
                    // 等待一段时间
                    return [4 /*yield*/, waitingTime(1500)];
                case 3:
                    // 等待一段时间
                    _a.sent();
                    // 刷新菜单数据
                    return [4 /*yield*/, refreshMenu()];
                case 4:
                    // 刷新菜单数据
                    _a.sent();
                    if (!(settings[2] && !tasks[2].status)) return [3 /*break*/, 6];
                    console.log('任务未完成，继续完成每日答题！');
                    return [4 /*yield*/, doExamPractice()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// fix code = 429
function waitingDependStartTime(startTime) {
    return __awaiter(this, void 0, void 0, function () {
        var remainms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    remainms = Date.now() - startTime;
                    if (!(remainms < ratelimitms)) return [3 /*break*/, 2];
                    return [4 /*yield*/, waitingTime(ratelimitms - remainms + 1000)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// 初始化每周答题总页数属性
function InitExamWeeklyAttr() {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    return [4 /*yield*/, getExamWeekly(1)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        // 初始化总页码
                        examWeeklyTotalPageCount = data.totalPageCount;
                        // 若每周答题逆序, 则从最后一页开始
                        if (examWeeklyReverse) {
                            examWeeklyPageNo = examWeeklyTotalPageCount;
                        }
                    }
                    return [4 /*yield*/, waitingDependStartTime(startTime)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 查询每周答题列表看看还有没有没做过的，有则返回id
function findExamWeekly() {
    return __awaiter(this, void 0, void 0, function () {
        var continueFind, examWeeklyId, _loop_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    continueFind = true;
                    examWeeklyId = null;
                    console.log('初始化每周答题');
                    return [4 /*yield*/, InitExamWeeklyAttr()];
                case 1:
                    _a.sent();
                    console.log('正在寻找未完成的每周答题');
                    _loop_1 = function () {
                        var startTime;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    startTime = Date.now();
                                    return [4 /*yield*/, getExamWeekly(examWeeklyPageNo).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                            var i, examWeeks, j;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (data) {
                                                            if (examWeeklyReverse) {
                                                                // 若开启逆序答题, 则反转列表
                                                                console.log('每周答题,开启逆序模式,从最早的题目开始答题');
                                                                data.list.reverse();
                                                            }
                                                            for (i = 0; i < data.list.length; i++) {
                                                                examWeeks = data.list[i].practices;
                                                                if (examWeeklyReverse) {
                                                                    // 若开启逆序, 则反转每周的测试列表
                                                                    examWeeks.reverse();
                                                                }
                                                                for (j = 0; j < examWeeks.length; j++) {
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
                                                                if (examWeeklyTotalPageCount == null ||
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
                                                        return [4 /*yield*/, waitingDependStartTime(startTime)];
                                                    case 1:
                                                        // fix code = 429
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!continueFind) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, examWeeklyId];
            }
        });
    });
}
// 做每周答题
function doExamWeekly() {
    return new Promise(function (resolve) {
        var _this = this;
        // 查找有没有没做过的每周测试，有则返回ID
        // examWeeklyId = 147;// 测试题目
        findExamWeekly().then(function (examWeeklyId) { return __awaiter(_this, void 0, void 0, function () {
            var newPage, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(examWeeklyId != null)) return [3 /*break*/, 7];
                        // 暂停
                        return [4 /*yield*/, pauseStudyLock()];
                    case 1:
                        // 暂停
                        _b.sent();
                        console.log('正在做每周答题');
                        newPage = GM_openInTab(URL_CONFIG.examWeekly.replace('{id}', examWeeklyId), { active: true, insert: true, setParent: true });
                        // 等待窗口关闭
                        return [4 /*yield*/, waitingClose(newPage)];
                    case 2:
                        // 等待窗口关闭
                        _b.sent();
                        // 等待一段时间
                        return [4 /*yield*/, waitingTime(1500)];
                    case 3:
                        // 等待一段时间
                        _b.sent();
                        // 刷新菜单数据
                        return [4 /*yield*/, refreshMenu()];
                    case 4:
                        // 刷新菜单数据
                        _b.sent();
                        if (!(settings[3] && !tasks[3].status)) return [3 /*break*/, 6];
                        console.log('任务未完成，继续完成每周答题！');
                        _a = resolve;
                        return [4 /*yield*/, doExamWeekly()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/];
                    case 6:
                        resolve('done');
                        return [3 /*break*/, 8];
                    case 7:
                        console.log('没有找到未完成的每周答题，跳过');
                        resolve('noTest');
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    });
}
// 初始化专项练习总页数属性
function InitExamPaperAttr() {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    return [4 /*yield*/, getExamPaper(1)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        // 初始化总页码
                        examPaperTotalPageCount = data.totalPageCount;
                        // 若专项练习逆序, 则从最后一页开始
                        if (examPaperReverse) {
                            examPaperPageNo = examPaperTotalPageCount;
                        }
                    }
                    return [4 /*yield*/, waitingDependStartTime(startTime)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 查询专项练习列表看看还有没有没做过的，有则返回id
function findExamPaper() {
    return __awaiter(this, void 0, void 0, function () {
        var continueFind, examPaperId, _loop_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    continueFind = true;
                    examPaperId = null;
                    console.log('初始化专项练习属性');
                    return [4 /*yield*/, InitExamPaperAttr()];
                case 1:
                    _a.sent();
                    console.log('正在寻找未完成的专项练习');
                    _loop_2 = function () {
                        var startTime;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    startTime = Date.now();
                                    return [4 /*yield*/, getExamPaper(examPaperPageNo).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                            var examPapers, j;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (data) {
                                                            examPapers = data.list;
                                                            if (examPaperReverse) {
                                                                // 若开启逆序答题, 则反转专项练习列表
                                                                console.log('专项练习,开启逆序模式,从最早的题目开始答题');
                                                                examPapers.reverse();
                                                            }
                                                            for (j = 0; j < examPapers.length; j++) {
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
                                                                if (examPaperTotalPageCount == null ||
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
                                                        return [4 /*yield*/, waitingDependStartTime(startTime)];
                                                    case 1:
                                                        // fix code = 429
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!continueFind) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, examPaperId];
            }
        });
    });
}
// 做专项练习
function doExamPaper() {
    return new Promise(function (resolve) {
        var _this = this;
        // 查找有没有没做过的专项练习，有则返回ID
        findExamPaper().then(function (examPaperId) { return __awaiter(_this, void 0, void 0, function () {
            var newPage, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(examPaperId != null)) return [3 /*break*/, 7];
                        // 暂停
                        return [4 /*yield*/, pauseStudyLock()];
                    case 1:
                        // 暂停
                        _b.sent();
                        console.log('正在做专项练习');
                        newPage = GM_openInTab(URL_CONFIG.examPaper.replace('{id}', examPaperId), {
                            active: true,
                            insert: true,
                            setParent: true
                        });
                        // 等待窗口关闭
                        return [4 /*yield*/, waitingClose(newPage)];
                    case 2:
                        // 等待窗口关闭
                        _b.sent();
                        // 等待一段时间
                        return [4 /*yield*/, waitingTime(1500)];
                    case 3:
                        // 等待一段时间
                        _b.sent();
                        // 刷新菜单数据
                        return [4 /*yield*/, refreshMenu()];
                    case 4:
                        // 刷新菜单数据
                        _b.sent();
                        if (!(settings[4] && !tasks[4].status)) return [3 /*break*/, 6];
                        console.log('任务未完成，继续专项练习！');
                        _a = resolve;
                        return [4 /*yield*/, doExamPaper()];
                    case 5:
                        _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/];
                    case 6:
                        resolve('done');
                        return [3 /*break*/, 8];
                    case 7:
                        console.log('没有找到未完成的专项练习，跳过');
                        resolve('noTest');
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    });
}
// 获取答题按钮
function getNextButton() {
    return new Promise(function (resolve) {
        var nextInterVal = setInterval(function () {
            // 答题按钮
            var nextAll = __spreadArray([], $$('.ant-btn'), true).filter(function (next) { return next.textContent; });
            if (nextAll.length) {
                clearInterval(nextInterVal); // 停止定时器
                resolve(nextAll[0]);
            }
        }, 800);
    });
}
// 暂停答题
function pauseExam() {
    var manualButton = (document.querySelector('#manualButton'));
    console.log('自动答题失败，切换为手动');
    pause = true;
    manualButton.innerText = '开启自动答题';
    manualButton.className = 'egg_manual_btn';
}
// 答题过程(整合)
function doingExam() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var nextButton, shouldSaveAnswer, finish, allTips, allbuttons, blanks, questionType, _l, inputBubblesEvent, key, answerData, i, i, answer, answer, i, j, answer, i, video, key, answerData, i, tip, answer, hasButton, j, selectButton, buttonAnswer, key, answerData, i, answer, hasButton, j, selectButton, buttonAnswer, answer, hasButton, i, radioButton, buttonAnswer, answerText, i, text, answers, hasButton, _loop_3, i, state_1, key, answerData, answer, hasButton, i, radioButton, buttonAnswer, key, answerTemp, reg, answer, key, answerTemp, reg, answer;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    shouldSaveAnswer = false;
                    _m.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 81];
                    // 先等等再开始做题
                    return [4 /*yield*/, waitingTime(2500)];
                case 2:
                    // 先等等再开始做题
                    _m.sent();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 3:
                    // 暂停
                    _m.sent();
                    return [4 /*yield*/, getNextButton()];
                case 4:
                    nextButton = _m.sent();
                    finish = ['再练一次', '再来一组', '查看解析'];
                    if (finish.includes(String(nextButton.textContent))) {
                        return [3 /*break*/, 81];
                    }
                    // 点击提示
                    (_a = $$('.tips')[0]) === null || _a === void 0 ? void 0 : _a.click();
                    allTips = $$('font[color=red]');
                    // 等待一段时间
                    return [4 /*yield*/, waitingTime(1500)];
                case 5:
                    // 等待一段时间
                    _m.sent();
                    allbuttons = $$('.q-answer');
                    blanks = $$('input[type=text][class=blank]');
                    questionType = $$('.q-header')[0].textContent
                        ? (_b = $$('.q-header')[0].textContent) === null || _b === void 0 ? void 0 : _b.substr(0, 3)
                        : '';
                    _l = questionType;
                    switch (_l) {
                        case '填空题': return [3 /*break*/, 6];
                        case '多选题': return [3 /*break*/, 30];
                        case '单选题': return [3 /*break*/, 49];
                    }
                    return [3 /*break*/, 70];
                case 6:
                    inputBubblesEvent = new Event('input', { bubbles: true });
                    if (!(blanks.length > 1)) return [3 /*break*/, 21];
                    if (!(allTips.length == 0)) return [3 /*break*/, 11];
                    // 如果没有提示，先获取看看有没有答案
                    try {
                        // 尝试点击视频播放按钮,播不播都没关系
                        $$('.outter')[0].click();
                    }
                    catch (e) { }
                    key = getKey();
                    return [4 /*yield*/, getAnswer(key)];
                case 7:
                    answerData = _m.sent();
                    if (!(answerData.status == 0 || answerData == 'error')) return [3 /*break*/, 9];
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 8:
                    // 暂停
                    _m.sent();
                    // 答完保存答案
                    shouldSaveAnswer = true;
                    return [3 /*break*/, 10];
                case 9:
                    // 获取到了答案
                    // 格式化
                    answerData = JSON.parse(answerData.data.txt_content);
                    answerData = answerData[0].content;
                    // 因为有多个空，所以有多个答案，先切割
                    answerData = answerData.split(';');
                    for (i = 0; i < answerData.length; i++) {
                        // 将答案填入
                        blanks[i].setAttribute('value', answerData[i].trim());
                        blanks[i].dispatchEvent(inputBubblesEvent);
                    }
                    _m.label = 10;
                case 10: return [3 /*break*/, 20];
                case 11:
                    if (!(allTips.length == blanks.length)) return [3 /*break*/, 17];
                    i = 0;
                    _m.label = 12;
                case 12:
                    if (!(i < allTips.length)) return [3 /*break*/, 16];
                    answer = allTips[i].textContent;
                    if (!(answer && answer.length > 0)) return [3 /*break*/, 13];
                    blanks[i].setAttribute('value', answer.trim());
                    blanks[i].dispatchEvent(inputBubblesEvent);
                    return [3 /*break*/, 15];
                case 13:
                    // 答案异常 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 14:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 12];
                case 16: return [3 /*break*/, 20];
                case 17:
                    if (!(allTips.length > blanks.length)) return [3 /*break*/, 18];
                    answer = '';
                    for (i = 0; i < allTips.length; i++) {
                        answer += allTips[i].textContent;
                    }
                    for (j = 0; j < blanks.length; j++) {
                        blanks[j].setAttribute('value', answer.trim());
                        blanks[j].dispatchEvent(inputBubblesEvent);
                    }
                    return [3 /*break*/, 20];
                case 18:
                    // 答案少于空 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 19:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 20;
                case 20: return [3 /*break*/, 29];
                case 21:
                    if (!(blanks.length == 1)) return [3 /*break*/, 27];
                    answer = '';
                    if (!(allTips.length != 0)) return [3 /*break*/, 22];
                    // 如果有提示
                    for (i = 0; i < allTips.length; i++) {
                        answer += allTips[i].textContent;
                    }
                    return [3 /*break*/, 26];
                case 22:
                    try {
                        video = $$('video')[0];
                        // 尝试点击视频播放按钮,不过播不播都没关系
                        video === null || video === void 0 ? void 0 : video.play();
                    }
                    catch (e) { }
                    key = getKey();
                    return [4 /*yield*/, getAnswer(key)];
                case 23:
                    answerData = _m.sent();
                    if (!(answerData.status == 0 || answerData == 'error')) return [3 /*break*/, 25];
                    // 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 24:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    return [3 /*break*/, 26];
                case 25:
                    // 有答案
                    answerData = JSON.parse(answerData.data.txt_content);
                    answer = answerData[0].content;
                    _m.label = 26;
                case 26:
                    blanks[0].setAttribute('value', answer);
                    blanks[0].dispatchEvent(inputBubblesEvent);
                    return [3 /*break*/, 71];
                case 27:
                    // 怕有没空白的情况 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 28:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 29;
                case 29: return [3 /*break*/, 71];
                case 30:
                    if (!allTips.length) return [3 /*break*/, 38];
                    i = 0;
                    _m.label = 31;
                case 31:
                    if (!(i < allTips.length)) return [3 /*break*/, 37];
                    tip = allTips[i];
                    answer = (_c = tip.textContent) === null || _c === void 0 ? void 0 : _c.trim();
                    hasButton = false;
                    if (!(answer && answer.length > 0)) return [3 /*break*/, 32];
                    for (j = 0; j < allbuttons.length; j++) {
                        selectButton = allbuttons[j];
                        buttonAnswer = (_d = selectButton.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                        if (buttonAnswer == answer ||
                            (buttonAnswer === null || buttonAnswer === void 0 ? void 0 : buttonAnswer.indexOf(answer)) != -1 ||
                            answer.indexOf(buttonAnswer) != -1) {
                            hasButton = true;
                            if (!$(selectButton).hasClass('chosen')) {
                                selectButton.click();
                            }
                            break;
                        }
                    }
                    return [3 /*break*/, 34];
                case 32:
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 33:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 34;
                case 34:
                    if (!!hasButton) return [3 /*break*/, 36];
                    // 没找到按钮，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 35:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 36;
                case 36:
                    i++;
                    return [3 /*break*/, 31];
                case 37: return [3 /*break*/, 48];
                case 38:
                    key = getKey();
                    return [4 /*yield*/, getAnswer(key)];
                case 39:
                    answerData = _m.sent();
                    if (!(answerData.status == 0 || answerData == 'error')) return [3 /*break*/, 41];
                    // 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 40:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    return [3 /*break*/, 48];
                case 41:
                    // 有答案
                    answerData = JSON.parse(answerData.data.txt_content);
                    // 因为有多个空，所以有多个答案，先切割
                    answerData = answerData.split(';');
                    i = 0;
                    _m.label = 42;
                case 42:
                    if (!(i < answerData.length)) return [3 /*break*/, 48];
                    answer = answerData[i];
                    hasButton = false;
                    if (!(answer && answer.length > 0)) return [3 /*break*/, 43];
                    for (j = 0; j < allbuttons.length; j++) {
                        selectButton = allbuttons[j];
                        buttonAnswer = (_e = selectButton.textContent) === null || _e === void 0 ? void 0 : _e.trim();
                        if (buttonAnswer == answer ||
                            (buttonAnswer === null || buttonAnswer === void 0 ? void 0 : buttonAnswer.indexOf(answer)) != -1 ||
                            answer.indexOf(buttonAnswer) != -1) {
                            hasButton = true;
                            if (!$(selectButton).hasClass('chosen')) {
                                selectButton.click();
                            }
                            break;
                        }
                    }
                    return [3 /*break*/, 45];
                case 43:
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 44:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 45;
                case 45:
                    if (!!hasButton) return [3 /*break*/, 47];
                    // 没找到按钮，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 46:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 47;
                case 47:
                    i++;
                    return [3 /*break*/, 42];
                case 48: return [3 /*break*/, 71];
                case 49:
                    if (!(allTips.length === 1)) return [3 /*break*/, 55];
                    answer = (_f = allTips[0].textContent) === null || _f === void 0 ? void 0 : _f.trim();
                    if (!(answer && answer.length > 0)) return [3 /*break*/, 52];
                    hasButton = false;
                    for (i = 0; i < allbuttons.length; i++) {
                        radioButton = allbuttons[i];
                        buttonAnswer = (_g = radioButton.textContent) === null || _g === void 0 ? void 0 : _g.trim();
                        // 对比答案
                        if (buttonAnswer == answer ||
                            (buttonAnswer === null || buttonAnswer === void 0 ? void 0 : buttonAnswer.indexOf(answer)) != -1 ||
                            answer.indexOf(buttonAnswer) != -1) {
                            hasButton = true;
                            radioButton.click();
                            break;
                        }
                    }
                    if (!!hasButton) return [3 /*break*/, 51];
                    // 没找到按钮，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 50:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 51;
                case 51: return [3 /*break*/, 54];
                case 52:
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 53:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 54;
                case 54: return [3 /*break*/, 69];
                case 55:
                    if (!(allTips.length > 1)) return [3 /*break*/, 61];
                    answerText = [];
                    for (i = 0; i < allTips.length; i++) {
                        text = (_h = allTips[i].textContent) === null || _h === void 0 ? void 0 : _h.trim();
                        if (text) {
                            answerText.push(text);
                        }
                    }
                    answers = [
                        answerText.join(''),
                        answerText.join(' '),
                        answerText.join('，'),
                        answerText.join(';'),
                        answerText.join(','),
                        answerText.join('、'),
                    ];
                    if (!answers.every(function (answer) { return answer.length; })) return [3 /*break*/, 58];
                    hasButton = false;
                    _loop_3 = function (i) {
                        var radioButton = allbuttons[i];
                        var buttonAnswer = (_j = radioButton.textContent) === null || _j === void 0 ? void 0 : _j.trim();
                        // 对比答案
                        if (answers.some(function (answer) {
                            return buttonAnswer == answer ||
                                (buttonAnswer === null || buttonAnswer === void 0 ? void 0 : buttonAnswer.indexOf(answer)) != -1 ||
                                answer.indexOf(buttonAnswer) != -1;
                        })) {
                            hasButton = true;
                            radioButton.click();
                            return "break";
                        }
                    };
                    for (i = 0; i < allbuttons.length; i++) {
                        state_1 = _loop_3(i);
                        if (state_1 === "break")
                            break;
                    }
                    if (!!hasButton) return [3 /*break*/, 57];
                    // 没找到按钮，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 56:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 57;
                case 57: return [3 /*break*/, 60];
                case 58:
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 59:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 60;
                case 60: return [3 /*break*/, 69];
                case 61:
                    key = getKey();
                    return [4 /*yield*/, getAnswer(key)];
                case 62:
                    answerData = _m.sent();
                    if (!(answerData.status == 0 || answerData == 'error')) return [3 /*break*/, 64];
                    // 暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 63:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    return [3 /*break*/, 69];
                case 64:
                    // 有答案
                    answerData = JSON.parse(answerData.data.txt_content);
                    answer = answerData[0].content;
                    if (!(answer && answer.length > 0)) return [3 /*break*/, 67];
                    hasButton = false;
                    for (i = 0; i < allbuttons.length; i++) {
                        radioButton = allbuttons[i];
                        buttonAnswer = (_k = radioButton.textContent) === null || _k === void 0 ? void 0 : _k.trim();
                        // 对比答案
                        if (buttonAnswer == answer ||
                            (buttonAnswer === null || buttonAnswer === void 0 ? void 0 : buttonAnswer.indexOf(answer)) != -1 ||
                            answer.indexOf(buttonAnswer) != -1) {
                            hasButton = true;
                            radioButton.click();
                            break;
                        }
                    }
                    if (!!hasButton) return [3 /*break*/, 66];
                    // 没找到按钮，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 65:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 66;
                case 66: return [3 /*break*/, 69];
                case 67:
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 68:
                    // 暂停
                    _m.sent();
                    // 提交答案
                    shouldSaveAnswer = true;
                    _m.label = 69;
                case 69: return [3 /*break*/, 71];
                case 70: return [3 /*break*/, 71];
                case 71:
                    if (!(nextButton.textContent != '再练一次' &&
                        nextButton.textContent != '再来一组' &&
                        nextButton.textContent != '查看解析')) return [3 /*break*/, 79];
                    if (!(shouldSaveAnswer && $$('.answer')[0])) return [3 /*break*/, 73];
                    key = getKey();
                    answerTemp = $$('.answer')[0].innerText;
                    reg = new RegExp(' ', 'g');
                    answer = '';
                    try {
                        // 从字符串中拿出答案
                        answer = answerTemp.split('：')[1];
                        answer = answer.replace(reg, ';');
                    }
                    catch (e) {
                        answer = answerTemp;
                    }
                    return [4 /*yield*/, saveAnswer(key, answer)];
                case 72:
                    _m.sent();
                    shouldSaveAnswer = false;
                    _m.label = 73;
                case 73:
                    nextButton.click();
                    return [4 /*yield*/, waitingTime(2000)];
                case 74:
                    _m.sent();
                    return [4 /*yield*/, getNextButton()];
                case 75:
                    nextButton = _m.sent();
                    if (!(nextButton.textContent === '下一题')) return [3 /*break*/, 78];
                    key = getKey();
                    answerTemp = $$('.answer')[0].innerText;
                    reg = new RegExp(' ', 'g');
                    answer = '';
                    try {
                        // 从字符串中拿出答案
                        answer = answerTemp.split('：')[1];
                        answer = answer.replace(reg, ';');
                    }
                    catch (e) {
                        answer = answerTemp;
                    }
                    return [4 /*yield*/, saveAnswer(key, answer)];
                case 76:
                    _m.sent();
                    if (!(URL_CONFIG.examWeekly.indexOf(url) !== -1 ||
                        URL_CONFIG.examPaper.indexOf(url) !== -1)) return [3 /*break*/, 78];
                    // 没答案，暂停答题
                    pauseExam();
                    // 暂停
                    return [4 /*yield*/, pauseLock()];
                case 77:
                    // 暂停
                    _m.sent();
                    _m.label = 78;
                case 78: return [3 /*break*/, 80];
                case 79: 
                // 已经做完，跳出循环
                return [3 /*break*/, 81];
                case 80: return [3 /*break*/, 1];
                case 81:
                    closeWin();
                    return [2 /*return*/];
            }
        });
    });
}
// 获取关键字
function getKey() {
    // 获取题目的文本内容
    var key = $$('.q-body')[0].innerText;
    // 外部引用md5加密
    key = md5(key);
    console.log(key);
    return key;
}
// 去除答题验证
function cancelVerify() {
    try {
        var verifyBox = document.getElementById('nc_mask');
        verifyBox.id = 'egg_nc_mask';
        verifyBox.innerHTML = '';
        verifyBox.remove();
    }
    catch (e) {
        console.log('去除验证失败');
    }
}
// 初始化配置
function initSetting() {
    try {
        var settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp) {
            settings = settingTemp;
        }
        else {
            settings = [true, true, true, true, true, true, true, false, false];
        }
    }
    catch (e) {
        // 没有则直接初始化
        settings = [true, true, true, true, true, true, true, false, false];
    }
}
// 创建“手动答题”按钮
function createManualButton() {
    var _a;
    var title = $$('.title')[0];
    // 按钮
    var manualButton = creatElementNode('button', { innerText: '关闭自动答题' }, {
        id: 'manualButton',
        "class": 'egg_auto_btn',
        type: 'button',
        onclick: clickManualButton
    });
    // 插入节点
    (_a = title.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(manualButton, title.nextSibling);
}
// 点击手动学习按钮
function clickManualButton() {
    var manualButton = (document.querySelector('#manualButton'));
    pause = !pause;
    if (pause) {
        manualButton.innerText = '开启自动答题';
        manualButton.className = 'egg_manual_btn';
    }
    else {
        manualButton.innerText = '关闭自动答题';
        manualButton.className = 'egg_auto_btn';
    }
}
// 加载用户信息
function loadUserInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var egg_userinfo, loginStatus, avatarMediaUrl, nick, avatarItems, img, subNickName, avatar, nickName, user, logoutBtn, loginBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    egg_userinfo = document.querySelector('.egg_userinfo');
                    egg_userinfo.innerHTML = '';
                    loginStatus = creatElementNode('div', null, {
                        "class": 'egg_login_status'
                    });
                    if (!login) return [3 /*break*/, 2];
                    return [4 /*yield*/, getUserInfo()];
                case 1:
                    // 获取用户信息
                    userInfo = _a.sent();
                    if (userInfo) {
                        avatarMediaUrl = userInfo.avatarMediaUrl, nick = userInfo.nick;
                        avatarItems = [];
                        if (avatarMediaUrl) {
                            img = creatElementNode('img', null, {
                                src: avatarMediaUrl,
                                "class": 'egg_avatar_img'
                            });
                            avatarItems.push(img);
                        }
                        else {
                            subNickName = creatElementNode('div', { innerText: nick.substring(1, 3) }, { "class": 'egg_sub_nickname' });
                            avatarItems.push(subNickName);
                        }
                        avatar = creatElementNode('div', null, { "class": 'egg_avatar' }, avatarItems);
                        nickName = creatElementNode('div', { innerText: nick }, { "class": 'egg_name' });
                        user = creatElementNode('div', null, { "class": 'egg_user' }, [
                            avatar,
                            nickName,
                        ]);
                        egg_userinfo.append(user);
                    }
                    logoutBtn = creatElementNode('button', { innerText: '退出' }, {
                        type: 'button',
                        onclick: function () {
                            var logged = $$("a[class='logged-link']")[0];
                            logged.click();
                        }
                    });
                    loginStatus.classList.remove('active');
                    loginStatus.append(logoutBtn);
                    return [3 /*break*/, 3];
                case 2:
                    loginBtn = creatElementNode('button', { innerText: '请先登录' }, {
                        type: 'button',
                        onclick: function () {
                            loginWindow();
                        }
                    });
                    loginStatus.classList.add('active');
                    loginBtn.addEventListener('click', function () {
                        loginWindow();
                    });
                    loginStatus.append(loginBtn);
                    _a.label = 3;
                case 3:
                    egg_userinfo.append(loginStatus);
                    return [2 /*return*/];
            }
        });
    });
}
// 加载分数
function loadScoreInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var totalScore, todayScore, totalScoreSpan, todayScoreSpan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!login) return [3 /*break*/, 3];
                    return [4 /*yield*/, getTotalScore()];
                case 1:
                    totalScore = _a.sent();
                    return [4 /*yield*/, getTodayScore()];
                case 2:
                    todayScore = _a.sent();
                    totalScoreSpan = ($$('.egg_scoreinfo .egg_totalscore span')[0]);
                    todayScoreSpan = ($$('.egg_scoreinfo .egg_todayscore span')[0]);
                    totalScoreSpan.innerText = totalScore;
                    todayScoreSpan.innerText = todayScore;
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 初始化配置
function loadTaskList() {
    return __awaiter(this, void 0, void 0, function () {
        var taskProgress, taskProgressList, _a, artCur, artMax, _b, videoCur1, videoMax1, _c, videoCur2, videoMax2, _d, dayCur, dayMax, _e, weekCur, weekMax, _f, exerCur, exerMax, i, _g, currentScore, dayMaxScore, rate, bar, percent;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, getTaskList()];
                case 1:
                    taskProgress = _h.sent();
                    if (taskProgress) {
                        taskProgressList = $$('.egg_progress');
                        _a = taskProgress[0], artCur = _a.currentScore, artMax = _a.dayMaxScore;
                        tasks[0] = {
                            currentScore: artCur,
                            dayMaxScore: artMax,
                            status: false
                        };
                        _b = taskProgress[1], videoCur1 = _b.currentScore, videoMax1 = _b.dayMaxScore;
                        _c = taskProgress[3], videoCur2 = _c.currentScore, videoMax2 = _c.dayMaxScore;
                        tasks[1] = {
                            currentScore: videoCur1 + videoCur2,
                            dayMaxScore: videoMax1 + videoMax2,
                            status: false
                        };
                        _d = taskProgress[6], dayCur = _d.currentScore, dayMax = _d.dayMaxScore;
                        tasks[2] = {
                            currentScore: dayCur,
                            dayMaxScore: dayMax,
                            status: false
                        };
                        _e = taskProgress[2], weekCur = _e.currentScore, weekMax = _e.dayMaxScore;
                        tasks[3] = {
                            currentScore: weekCur,
                            dayMaxScore: weekMax,
                            status: false
                        };
                        _f = taskProgress[5], exerCur = _f.currentScore, exerMax = _f.dayMaxScore;
                        tasks[4] = {
                            currentScore: exerCur,
                            dayMaxScore: exerMax,
                            status: false
                        };
                        // 更新数据
                        for (i in tasks) {
                            _g = tasks[i], currentScore = _g.currentScore, dayMaxScore = _g.dayMaxScore;
                            rate = (100 * currentScore) / dayMaxScore;
                            // 修复专项练习成组做完,进度条显示异常
                            if (dayMaxScore <= currentScore) {
                                rate = 100;
                            }
                            if (rate === 100) {
                                tasks[i].status = true;
                            }
                            // 修复每周答题、专项练习做完,进度条显示异常
                            if (rate > 0) {
                                bar = taskProgressList[i].querySelector('.egg_bar');
                                percent = (taskProgressList[i].querySelector('.egg_percent'));
                                // 长度
                                bar.style.width = "".concat(rate.toFixed(2), "%");
                                // 文字
                                percent.innerText = "".concat(rate.toFixed(0), "%");
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// 刷新菜单数据
function refreshMenu() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 加载分数信息
                return [4 /*yield*/, loadScoreInfo()];
                case 1:
                    // 加载分数信息
                    _a.sent();
                    // 加载任务列表
                    return [4 /*yield*/, loadTaskList()];
                case 2:
                    // 加载任务列表
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 渲染菜单
function renderMenu() {
    return __awaiter(this, void 0, void 0, function () {
        var settingItems, userinfo, totalScoreSpan, totalScoreDiv, todayScoreSpan, todayScoreDiv, scoreinfo, info, settingTaskLabels, _loop_4, i, settingLabel, _loop_5, i, settingBox, menu, base, startButton, item;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settingItems = [];
                    userinfo = creatElementNode('div', null, { "class": 'egg_userinfo' });
                    totalScoreSpan = creatElementNode('span', { innerText: 0 });
                    totalScoreDiv = creatElementNode('div', { innerHTML: '总积分' }, { "class": 'egg_totalscore' }, totalScoreSpan);
                    todayScoreSpan = creatElementNode('span', { innerText: 0 });
                    todayScoreDiv = creatElementNode('div', { innerHTML: '当天积分' }, { "class": 'egg_todayscore' }, todayScoreSpan);
                    scoreinfo = creatElementNode('div', null, { "class": 'egg_scoreinfo' }, [
                        totalScoreDiv,
                        todayScoreDiv,
                    ]);
                    info = creatElementNode('div', null, { "class": 'egg_setting_item egg_info' }, [userinfo, scoreinfo]);
                    settingItems.push(info);
                    settingTaskLabels = [
                        '文章选读',
                        '视听学习',
                        '每日答题',
                        '每周答题',
                        '专项练习',
                    ];
                    // 分割线
                    settingItems.push(creatElementNode('hr'));
                    _loop_4 = function (i) {
                        // 进度条
                        var bar = creatElementNode('div', null, { "class": 'egg_bar' });
                        // 轨道
                        var track = creatElementNode('div', null, { "class": 'egg_track' }, bar);
                        // 百分比符号
                        var percentSymbol = creatElementNode('span', { innerText: '%' }, { "class": 'egg_percentsymbol' });
                        // 数值
                        var percent = creatElementNode('div', { innerText: '0' }, { "class": 'egg_percent' }, percentSymbol);
                        // 进度
                        var progress = creatElementNode('div', null, { "class": 'egg_progress' }, [
                            track,
                            percent,
                        ]);
                        // 标签
                        var label = creatElementNode('label', {
                            innerText: settingTaskLabels[i]
                        }, null, progress);
                        // 处理设置选项变化
                        var handleCheckChange = debounce(function (checked) { return __awaiter(_this, void 0, void 0, function () {
                            var destroy;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(settings[i] !== checked)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, createTip("".concat(settingTaskLabels[i], "\u5DF2").concat(checked ? '打开' : '关闭'), 2000)];
                                    case 1:
                                        destroy = (_a.sent()).destroy;
                                        // 销毁
                                        destroy();
                                        settings[i] = checked;
                                        // 运行时是否要隐藏
                                        GM_setValue('studySetting', JSON.stringify(settings));
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }, 500);
                        // 选项
                        var input = creatElementNode('input', null, {
                            title: settingTaskLabels[i],
                            "class": 'egg_setting_switch',
                            type: 'checkbox',
                            checked: settings[i] ? 'checked' : '',
                            onchange: function (e) {
                                var checked = e.target.checked;
                                handleCheckChange(checked);
                            }
                        });
                        // 设置项
                        var item = creatElementNode('div', null, { "class": 'egg_setting_item' }, [
                            label,
                            input,
                        ]);
                        settingItems.push(item);
                    };
                    for (i in settingTaskLabels) {
                        _loop_4(i);
                    }
                    // 分割线
                    settingItems.push(creatElementNode('hr'));
                    settingLabel = ['运行隐藏', '自动开始'];
                    _loop_5 = function (i) {
                        // 标签
                        var label = creatElementNode('label', {
                            innerText: settingLabel[i]
                        });
                        // 当前序号
                        var currentIndex = Number(i) + settingTaskLabels.length;
                        // 处理设置选项变化
                        var handleCheckChange = debounce(function (checked) { return __awaiter(_this, void 0, void 0, function () {
                            var destroy;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(settings[currentIndex] !== checked)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, createTip("".concat(settingLabel[i], "\u5DF2").concat(checked ? '打开' : '关闭', "\uFF0C\u90E8\u5206\u8BBE\u7F6E\u5237\u65B0\u540E\u751F\u6548\uFF01"), 2000)];
                                    case 1:
                                        destroy = (_a.sent()).destroy;
                                        // 销毁
                                        destroy();
                                        settings[currentIndex] = checked;
                                        // 运行时是否要隐藏
                                        GM_setValue('studySetting', JSON.stringify(settings));
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }, 500);
                        // 选项
                        var input = creatElementNode('input', null, {
                            title: settingLabel[i],
                            "class": 'egg_setting_switch',
                            type: 'checkbox',
                            checked: settings[currentIndex] ? 'checked' : '',
                            onchange: function (e) {
                                var checked = e.target.checked;
                                handleCheckChange(checked);
                            }
                        });
                        // 设置项
                        var item = creatElementNode('div', null, { "class": 'egg_setting_item' }, [
                            label,
                            input,
                        ]);
                        settingItems.push(item);
                    };
                    for (i in settingLabel) {
                        _loop_5(i);
                    }
                    settingBox = creatElementNode('div', null, { "class": 'egg_setting_box' }, settingItems);
                    menu = creatElementNode('div', null, {
                        id: 'settingData',
                        "class": 'egg_menu'
                    }, settingBox);
                    base = creatElementNode('div', null, null, menu);
                    // 插入节点
                    document.body.append(base);
                    // 加载用户信息
                    return [4 /*yield*/, loadUserInfo()];
                case 1:
                    // 加载用户信息
                    _a.sent();
                    // 加载分数信息
                    return [4 /*yield*/, loadScoreInfo()];
                case 2:
                    // 加载分数信息
                    _a.sent();
                    // 加载任务列表
                    return [4 /*yield*/, loadTaskList()];
                case 3:
                    // 加载任务列表
                    _a.sent();
                    // 渲染开始按钮
                    if (login) {
                        startButton = creatElementNode('button', { innerText: '开始学习' }, {
                            id: 'startButton',
                            "class": 'egg_study_btn',
                            type: 'button',
                            onclick: start
                        });
                        item = creatElementNode('div', null, { "class": 'egg_setting_item egg_start_btn' }, startButton);
                        settingBox.append(item);
                        // 完成任务
                        if (tasks.every(function (task) { return task.status; })) {
                            finishTask();
                        }
                    }
                    if (!(login && settings[6])) return [3 /*break*/, 5];
                    return [4 /*yield*/, createTip('3秒后开始自动答题', 3000)];
                case 4:
                    _a.sent();
                    start();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 是否显示目录
function showMenu(isShow) {
    if (isShow === void 0) { isShow = true; }
    var items = $$('egg_menu');
    for (var i = 0; i < items.length; i++) {
        items[i].style.display = isShow ? 'block' : 'none';
    }
}
// 登录状态
function loginStatus() {
    return new Promise(function (resolve) {
        var timer = setInterval(function () {
            if (getCookie('token')) {
                clearInterval(timer);
                resolve(true);
            }
        }, 100);
    });
}
// 登录窗口
function loginWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var settingBox, iframe_1, refresh, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settingBox = $$('.egg_setting_box')[0];
                    if (!settingBox) return [3 /*break*/, 2];
                    iframe_1 = settingBox.querySelector('iframe');
                    settingBox.style.width = '200px';
                    settingBox.style.overflow = 'hidden';
                    if (!iframe_1) {
                        iframe_1 = creatElementNode('iframe', {
                            style: {
                                width: '400px',
                                height: '320px',
                                position: 'relative',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                border: 'none'
                            }
                        });
                        settingBox.append(iframe_1);
                    }
                    // 登录页面
                    iframe_1.src = URL_CONFIG.login;
                    refresh = window.setInterval(function () {
                        // 登录刷新
                        iframe_1.src = URL_CONFIG.login;
                    }, 60000);
                    return [4 /*yield*/, loginStatus()];
                case 1:
                    res = _a.sent();
                    if (res) {
                        // 登录成功
                        window.clearInterval(refresh);
                        console.log('登录成功！');
                        window.location.reload();
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
                case 2: return [2 /*return*/];
            }
        });
    });
}
// 学习
function study() {
    return __awaiter(this, void 0, void 0, function () {
        var temp1, temp2, res, taskProgressList, bar, percent, res, taskProgressList, bar, percent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('开始学习');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 1:
                    // 暂停
                    _a.sent();
                    if (!tasks.length) return [3 /*break*/, 13];
                    if (!(settings[0] && !tasks[0].status)) return [3 /*break*/, 4];
                    newsNum = tasks[0].dayMaxScore - tasks[0].currentScore; // 还需要看多少个新闻
                    console.log('1.看新闻');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 2:
                    // 暂停
                    _a.sent();
                    // 看新闻
                    return [4 /*yield*/, readNews()];
                case 3:
                    // 看新闻
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(settings[1] && !tasks[1].status)) return [3 /*break*/, 7];
                    temp1 = ~~(tasks[1].dayMaxScore - tasks[1].currentScore);
                    temp2 = ~~(tasks[3].dayMaxScore - tasks[3].currentScore);
                    videoNum = temp1 > temp2 ? temp1 : temp2; // 还需要看多少个视频
                    console.log('2.看视频');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 5:
                    // 暂停
                    _a.sent();
                    // 看视频
                    return [4 /*yield*/, watchVideo()];
                case 6:
                    // 看视频
                    _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(settings[2] && !tasks[2].status)) return [3 /*break*/, 10];
                    console.log('3.做每日答题');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 8:
                    // 暂停
                    _a.sent();
                    // 做每日答题
                    return [4 /*yield*/, doExamPractice()];
                case 9:
                    // 做每日答题
                    _a.sent();
                    _a.label = 10;
                case 10:
                    if (!(settings[3] && !tasks[3].status)) return [3 /*break*/, 13];
                    console.log('4.做每周答题');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 11:
                    // 暂停
                    _a.sent();
                    return [4 /*yield*/, doExamWeekly()];
                case 12:
                    res = _a.sent();
                    if (res == 'noTest') {
                        // 如果是全都完成了，已经没有能做的了
                        tasks[3].status = true;
                        taskProgressList = $$('.egg_progress');
                        bar = taskProgressList[3].querySelector('.egg_bar');
                        percent = (taskProgressList[3].querySelector('.egg_percent'));
                        // 长度
                        bar.style.width = "100%";
                        // 文字
                        percent.innerText = "100%";
                    }
                    _a.label = 13;
                case 13:
                    if (!(settings[4] && !tasks[4].status)) return [3 /*break*/, 16];
                    console.log('5.做专项练习');
                    // 暂停
                    return [4 /*yield*/, pauseStudyLock()];
                case 14:
                    // 暂停
                    _a.sent();
                    return [4 /*yield*/, doExamPaper()];
                case 15:
                    res = _a.sent();
                    if (res == 'noTest') {
                        // 如果是全都完成了，已经没有能做的了
                        tasks[4].status = true;
                        taskProgressList = $$('.egg_progress');
                        bar = taskProgressList[3].querySelector('.egg_bar');
                        percent = (taskProgressList[3].querySelector('.egg_percent'));
                        // 长度
                        bar.style.width = "100%";
                        // 文字
                        percent.innerText = "100%";
                    }
                    _a.label = 16;
                case 16: return [2 /*return*/];
            }
        });
    });
}
// 暂停任务
function pauseTask() {
    // 开始按钮
    var startButton = document.getElementById('startButton');
    pauseStudy = true;
    startButton.innerText = '继续学习';
    startButton.classList.remove('loading');
    startButton.removeEventListener('click', pauseTask);
    startButton.addEventListener('click', continueTask);
}
// 继续任务
function continueTask() {
    // 开始按钮
    var startButton = document.getElementById('startButton');
    pauseStudy = false;
    startButton.innerText = '正在学习，点击暂停';
    startButton.classList.add('loading');
    startButton.removeEventListener('click', continueTask);
    startButton.addEventListener('click', pauseTask);
}
// 完成任务
function finishTask() {
    // 开始按钮
    var startButton = document.getElementById('startButton');
    startButton.innerText = '已完成';
    startButton.classList.remove('loading');
    startButton.classList.add('disabled');
    startButton.setAttribute('disabled', '');
}
// 开始
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var startButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 保存配置
                    console.log('初始化...');
                    console.log('检查是否登录...');
                    if (!login) return [3 /*break*/, 6];
                    startButton = (document.getElementById('startButton'));
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
                    if (!tasks.length) return [3 /*break*/, 5];
                    // 学习
                    return [4 /*yield*/, study()];
                case 1:
                    // 学习
                    _a.sent();
                    if (!!tasks.every(function (task) { return task.status; })) return [3 /*break*/, 3];
                    return [4 /*yield*/, study()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: 
                // 刷新菜单数据
                return [4 /*yield*/, refreshMenu()];
                case 4:
                    // 刷新菜单数据
                    _a.sent();
                    finishTask();
                    console.log('已完成');
                    _a.label = 5;
                case 5:
                    if (settings[5]) {
                        showMenu();
                    }
                    return [3 /*break*/, 8];
                case 6:
                    // 提醒登录
                    alert('请先登录');
                    console.log('登录中...');
                    // 登录窗口
                    return [4 /*yield*/, loginWindow()];
                case 7:
                    // 登录窗口
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
