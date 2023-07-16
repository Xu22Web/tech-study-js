// ==UserScript==
// @name   不学习何以强国
// @namespace   http://tampermonkey.net/
// @version   1.7.5
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
// @grant   GM_openInTab
// @grant   GM_addValueChangeListener
// @grant   unsafeWindow
// @updateURL   https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js
// @downloadURL   https://raw.githubusercontent.com/Xu22Web/tech-study-js/master/tech-study.js
// @supportURL   https://github.com/Xu22Web
// ==/UserScript==
const css = '* {  -webkit-tap-highlight-color: transparent;}:root {  --themeColor: #fa3333;  --scale: 1;  font-size: calc(10px * var(--scale));}@media (min-height: 678px) and (max-height: 768px) {  :root {    --scale: 0.8;  }}@media (max-height: 667px) {  :root {    --scale: 0.75;  }}@keyframes fade {  from {    opacity: 0.8;  }  to {    opacity: 0.4;    background: #ccc;  }}.egg_icon {  width: 1em;  height: 1em;  fill: currentColor;}.egg_hr_wrap {  position: relative;  display: flex;  justify-content: center;  color: #ccc;}.egg_hr_wrap .egg_hr {  position: absolute;  top: 50%;  transform: translateY(-50%);  background: currentColor;  height: 0.1rem;  width: 30%;}.egg_hr_wrap .egg_hr:nth-of-type(1) {  left: 0;}.egg_hr_wrap .egg_hr:nth-last-of-type(1) {  right: 0;}.egg_hr_title {  font-size: 1.2rem;}.egg_exam_btn {  transition: background 80ms;  outline: none;  border: none;  padding: 1.2rem 2rem;  border-radius: 1.2rem;  cursor: pointer;  font-size: 1.8rem;  font-weight: bold;  text-align: center;  color: #ffffff;  background: #ccc;}.egg_exam_btn.manual {  background: var(--themeColor);}.egg_panel_wrap * {  padding: 0;  margin: 0;  box-sizing: border-box;  outline: none;  border: none;}.egg_panel_wrap {  position: fixed;  left: 0;  top: 0;  z-index: 99999;  width: 100%;  height: 100%;  color: #333;  font-size: 1.6rem;  pointer-events: none;}.egg_panel {  position: absolute;  top: 5rem;  left: 1rem;  padding: 1.2rem 2rem;  border-radius: 1rem;  background: #ffffffe6;  backdrop-filter: blur(1rem);  box-shadow: 0 0 0.1rem 0.1rem #f1f1f1;  transition: 80ms ease-out;  pointer-events: all;}.egg_panel.hide {  left: 0;  transform: translateX(-100%);}.egg_panel_wrap.mobile .egg_panel {  top: 1rem;}@media (min-height: 678px) and (max-height: 768px) {  .egg_panel {    top: 2rem;  }}@media (max-height: 667px) {  .egg_panel {    top: 1rem;  }}.egg_panel button {  outline: none;  border: none;  padding: 0;  cursor: pointer;  background: none;}.egg_panel .egg_btns_wrap {  position: absolute;  left: 100%;  top: 50%;  transform: translate(-50%, -50%);  transition: 80ms ease;  z-index: 9;}.egg_panel.hide .egg_btns_wrap {  left: 100%;  transform: translate(0, -50%);}.egg_panel .egg_btns_wrap button {  border-radius: 50%;  width: 3rem;  height: 3rem;  padding: 0;  overflow: hidden;  border: 0.2rem solid currentColor;  color: white;  display: grid;  place-items: center;  font-size: 1.8rem;}.egg_panel.hide .egg_panel_show_btn {  background: var(--themeColor);}.egg_panel .egg_panel_show_btn {  background: #ccc;}.egg_panel .egg_frame_show_btn {  background: var(--themeColor);  margin-bottom: 1rem;}.egg_panel .egg_frame_show_btn.hide {  display: none;}.egg_panel .egg_settings_show_btn {  background: #ccc;  margin-top: 1rem;}.egg_panel .egg_settings_show_btn.active {  background: var(--themeColor);}.egg_panel .egg_settings_reset_btn {  background: #ccc;  margin-top: 1rem;}.egg_panel .egg_settings_reset_btn:active {  background: var(--themeColor);}.egg_login_item {  display: flex;  justify-content: center;  align-items: center;  flex-direction: column;  padding: 0.5rem 0;}.egg_login_item .egg_login_btn {  font-size: 1.4rem;  border-radius: 1rem;  transition: 80ms ease;  color: white;  background: var(--themeColor);  padding: 0.8rem 2.4rem;}.egg_login_item .egg_login_btn:active {  opacity: 0.8;}.egg_login_item .egg_login_img_wrap {  height: 0;  border-radius: 1rem;  transition: height 80ms ease;  overflow: hidden;}.egg_login_item .egg_login_img_wrap.active {  padding: 0.8rem;  margin-top: 0.8rem;  height: auto;  background: white;}.egg_login_img_wrap .egg_login_img {  width: 15rem;  height: 15rem;}.egg_info_item .egg_login_btn {  font-size: 1.4rem;  border-radius: 1rem;  transition: 80ms ease;  color: white;  background: #ccc;  padding: 0.4rem 0.8rem;}.egg_info_item .egg_login_btn:active {  opacity: 0.8;}.egg_info_item {  display: flex;  justify-content: space-between;  align-items: center;}.egg_info_item .egg_userinfo {  display: flex;  justify-content: center;  align-items: center;  padding: 0.5rem 0;}.egg_userinfo .egg_avatar .egg_avatar_nick,.egg_userinfo .egg_avatar .egg_avatar_img {  height: 5rem;  width: 5rem;  border-radius: 50%;  background: var(--themeColor);  display: flex;  justify-content: center;  align-items: center;  text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;  font-size: 2rem;  color: white;}.egg_userinfo .egg_nick {  padding-left: 0.5rem;  text-overflow: ellipsis;  overflow: hidden;  white-space: nowrap;  max-width: 10rem;}.egg_score_item .egg_scoreinfo {  display: flex;  justify-content: space-between;  align-items: center;  padding: 0.5rem 0;}.egg_scoreinfo .egg_totalscore,.egg_scoreinfo .egg_todayscore {  font-size: 1.2rem;  user-select: none;}.egg_scoreinfo .egg_totalscore span,.egg_scoreinfo .egg_todayscore .egg_todayscore_btn span {  padding-left: 0.2rem;}.egg_scoreinfo .egg_totalscore span,.egg_todayscore .egg_todayscore_btn span,.egg_todayscore .egg_score_details span {  color: var(--themeColor);  font-weight: bold;}.egg_scoreinfo .egg_todayscore {  position: relative;}.egg_todayscore .egg_todayscore_btn {  display: flex;  align-items: center;}.egg_todayscore_btn .egg_icon {  opacity: 0.3;}.egg_todayscore .egg_score_details {  position: absolute;  left: calc(100% + 1rem);  top: 0;  background: #fffffff2;  border-radius: 0.5rem;  opacity: 1;  width: 10rem;  box-shadow: 0 0 0.1rem 0.1rem #f1f1f1;  transition: 80ms ease;  z-index: 9;}.egg_todayscore .egg_score_details.hide {  visibility: hidden;  opacity: 0;  left: 100%;}.egg_score_details .egg_score_title {  border-bottom: 0.1rem solid #eee;  padding: 0.5rem 0.8rem;  display: flex;  align-items: center;}.egg_score_details .egg_score_title .egg_icon {  font-size: 1.4rem;}.egg_score_details .egg_score_title .egg_score_title_text {  font-weight: bold;  padding-left: 0.2rem;}.egg_score_details .egg_score_item {  display: flex;  align-items: center;  justify-content: space-between;  padding: 0.5rem 0.8rem;}.egg_task_list {  position: relative;}.egg_task_item {  user-select: none;  min-height: 3rem;  min-width: 18rem;  display: flex;  align-items: center;  justify-content: space-between;  padding: 0.5rem 0;}.egg_task_item .egg_label_wrap {  flex-grow: 1;  padding-right: 0.5rem;}.egg_label_wrap .egg_task_title_wrap {  display: flex;  justify-content: space-between;  align-items: center;}.egg_task_title_wrap .egg_task_progress_wrap {  display: flex;  align-items: center;  font-size: 1.4rem;  width: 3.5rem;}.egg_task_progress_wrap .egg_task_current {  color: var(--themeColor);}.egg_task_progress_wrap .egg_task_max {  color: #999;  font-size: 1.2rem;}.egg_label_wrap .egg_progress {  display: flex;  justify-content: space-between;  align-items: center;  padding-top: 0.8rem;}.egg_progress .egg_track {  background: #ccc;  height: 0.5rem;  border-radius: 1rem;  flex: 1 1 auto;  overflow: hidden;}.egg_progress .egg_track .egg_bar {  height: 0.5rem;  background: var(--themeColor);  border-radius: 1rem;  width: 0;  transition: width 0.5s;}.egg_setting_item {  min-height: 3rem;  min-width: 18rem;  display: flex;  align-items: center;  justify-content: space-between;  box-sizing: border-box;}.egg_setting_item .egg_label_wrap {  flex-grow: 1;}.egg_detail {  background: #ccc;  color: white;  border-radius: 10rem;  font-size: 1.2rem;  width: 1.6rem;  height: 1.6rem;  margin-left: 0.4rem;  display: inline-block;  text-align: center;  line-height: 1.6rem;  cursor: pointer;}.egg_switch {  cursor: pointer;  margin: 0;  outline: 0;  appearance: none;  -webkit-appearance: none;  -moz-appearance: none;  position: relative;  width: 4.2rem;  height: 2.2rem;  background: #ccc;  border-radius: 5rem;  transition: background 0.3s;  --border-padding: 0.5rem;  box-shadow: -0.1rem 0 0.1rem -0.1rem #999 inset,    0.1rem 0 0.1rem -0.1rem #999 inset;}.egg_switch::after {  content: \'\';  display: inline-block;  width: 1.4rem;  height: 1.4rem;  border-radius: 50%;  background: #fff;  box-shadow: 0 0 0.2rem #999;  transition: left 0.4s;  position: absolute;  top: calc(50% - (1.4rem / 2));  position: absolute;  left: var(--border-padding);}.egg_switch:checked {  background: var(--themeColor);}.egg_switch:disabled {  opacity: 0.5;  background: #ccc;}.egg_switch:checked::after {  left: calc(100% - var(--border-padding) - 1.4rem);}.egg_tip_list {  font-size: 1.2rem;  max-width: 18rem;  line-height: 2rem;  color: var(--themeColor);}.egg_tip_list .egg_tip_btn {  padding: 0.2rem 0.4rem;  background: #f1f1f1;  color: #333;}.egg_tip_list .egg_tip_btn:disabled {  opacity: 0.5;  background: #ccc;}.egg_tip_list .egg_tip_content {  text-align: center;  padding-top: 0.2rem;}.egg_study_item {  display: flex;  justify-content: center;  padding-top: 0.5rem;}.egg_study_item .egg_study_btn {  background: var(--themeColor);  padding: 0.8rem 2.4rem;  font-size: 1.4rem;  border-radius: 1rem;  color: white;  transition: 80ms ease;}.egg_study_item .egg_study_btn:not(.loading):active {  opacity: 0.8;}.egg_study_item .egg_study_btn.loading {  animation: fade 2s ease infinite alternate;}.egg_study_item .egg_study_btn:disabled {  background: #ccc;}.egg_tip_wrap {  position: fixed;  left: 0;  top: 0;  z-index: 999999;  width: 100%;  height: 100%;  pointer-events: none;}.egg_tip_wrap * {  padding: 0;  margin: 0;  box-sizing: border-box;  outline: none;  border: none;}.egg_tip_wrap .egg_tip {  position: absolute;  bottom: 2rem;  left: 2rem;  padding: 1.2rem 1.4rem;  border: none;  border-radius: 1rem;  background: var(--themeColor);  color: white;  font-size: 1.4rem;  transition: 200ms ease;  opacity: 0;  transform: scale(0.9) translateY(1rem);}.egg_tip_wrap .egg_tip.active {  opacity: 1;  transform: scale(1) translateY(0);}.egg_tip_wrap .egg_tip.active.delay {  opacity: 0.5;}.egg_tip_wrap .egg_tip .egg_countdown {  display: inline-block;  color: var(--themeColor);  background: white;  border-radius: 0.5rem;  padding: 0.2rem 0.4rem;  font-weight: bold;  margin-left: 0.4rem;  font-size: 1.2rem;}.egg_frame_wrap {  position: fixed;  left: 0;  top: 0;  z-index: 999;  width: 100%;  height: 100%;  visibility: visible;}.egg_frame_wrap * {  padding: 0;  margin: 0;  box-sizing: border-box;  outline: none;  border: none;}.egg_frame_wrap.hide {  visibility: hidden;}.egg_frame_wrap.hide .egg_frame_mask,.egg_frame_wrap.hide .egg_frame_content_wrap {  opacity: 0;}.egg_frame_wrap.hide .egg_frame_content_wrap {  transform: scale(0);}.egg_frame_mask {  background: #00000030;  width: 100%;  height: 100%;  opacity: 1;  transition: 200ms ease;}.egg_frame_content_wrap {  position: absolute;  width: 80%;  height: 80%;  top: 10%;  left: 10%;  display: flex;  flex-direction: column;  transition: 200ms ease;  border-radius: 1rem;  background: #ffffffe6;  backdrop-filter: blur(1rem);  overflow: hidden;  transform: scale(1);}.egg_frame_content_wrap.max {  top: 0;  left: 0;  width: 100%;  height: 100%;  border-radius: 0;}.egg_frame_content_wrap .egg_frame_controls_wrap {  width: 100%;  display: flex;  justify-content: space-between;  align-items: center;  box-sizing: border-box;}.egg_frame_controls_wrap .egg_frame_title {  padding: 1rem 2rem;  font-size: 1.6rem;}.egg_frame_controls .egg_frame_btn {  outline: none;  border: none;  background: none;  padding: 1rem 2rem;  transition: 80ms ease;  cursor: pointer;  color: #333;  font-size: 1.8rem;}.egg_frame_controls .egg_frame_btn:active {  opacity: 0.8;}.egg_frame_wrap .egg_frame_content {  width: 100%;  flex-grow: 1;  border-top: 0.1rem solid #ccc;  min-height: 40rem;  min-width: 30rem;  background: white;}.egg_frame_content .egg_frame {  width: 100%;  height: 100%;  outline: none;  border: none;}.egg_time_input {  display: inline-flex;  align-items: center;  justify-content: center;}.egg_time_input .egg_hour_wrap,.egg_time_input .egg_minute_wrap {  width: 4rem;}.egg_time_input .egg_separator {  padding: 0 0.5rem;  font-size: 1.5rem;}.egg_settings_item {  position: absolute;  top: 0;  left: 0;  width: 100%;  height: 100%;  pointer-events: none;  overflow: hidden;  border-radius: 1rem;}.egg_settings_item .egg_settings {  display: inline-flex;  flex-direction: column;  font-size: 1.4rem;  background: white;  border-radius: 1rem;  overflow: hidden;  width: 100%;  height: 100%;  pointer-events: all;  transform: translateX(100%);  transition: transform 300ms ease;  padding-top: 1rem;}.egg_settings_item .egg_settings.active {  transform: translateX(0);}.egg_settings .egg_settings_label {  padding-bottom: 1rem;  user-select: none;}.egg_settings_item .egg_settings_version_wrap {  padding: 1rem 2rem 0 2rem;  display: flex;  align-items: center;  justify-content: space-between;}.egg_settings_version_wrap .egg_settings_version {  color: #999;  display: flex;  align-items: center;}.egg_settings_version .egg_settings_version_detail {  color: #24292f;  font-size: 1.6rem;  width: 1.6rem;  height: 1.6rem;  margin-left: 0.4rem;}.egg_settings_item .egg_settings_theme_wrap {  padding: 1rem 2rem 0 2rem;}.egg_settings_theme_wrap .egg_settings_theme_colors {  display: flex;  align-items: center;  justify-content: space-between;}.egg_settings_theme_color_wrap .egg_settings_theme_color {  border-radius: 50%;  width: 1.6rem;  height: 1.6rem;  background: currentColor;}.egg_settings .egg_settings_read_time_wrap,.egg_settings .egg_settings_watch_time_wrap {  padding: 1rem 2rem 0 2rem;  display: flex;  justify-content: space-between;  align-items: center;}.egg_settings_read_time_wrap .egg_settings_label,.egg_settings_watch_time_wrap .egg_settings_label {  padding: 0.5rem 0;}.egg_settings_read_time_wrap .egg_select,.egg_settings_watch_time_wrap .egg_select {  width: 6rem;}.egg_settings .egg_settings_token_wrap {  padding: 1rem 2rem 0 2rem;}.egg_settings_token_wrap .egg_settings_token_input {  outline: none;  border: 0.1rem solid #eee;  padding: 1rem;  background: white;  border-radius: 0.2rem;  width: 100%;  box-sizing: border-box;  color: #ccc;}.egg_settings_token_wrap .egg_settings_token_input.active {  color: #333;}.egg_settings_token_input::placeholder {  color: #ccc;}.egg_settings .egg_settings_submit_btn_wrap {  text-align: right;  padding-top: 1rem;  display: none;}.egg_settings .egg_settings_submit_btn_wrap.active {  display: block;}.egg_settings_submit_btn_wrap .egg_settings_submit_btn {  outline: none;  border: 0.1rem solid #eee;  padding: 0.5rem 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  cursor: pointer;}.egg_settings_submit_btn_wrap .egg_settings_submit_btn:active {  background: #eee;}.egg_schedule {  height: 100%;  display: flex;  flex-direction: column;}.egg_schedule_time_wrap {  padding: 1rem 2rem;  border-bottom: 0.1rem solid #eee;}.egg_schedule_time .egg_schedule_label {  padding-bottom: 1rem;  user-select: none;}.egg_schedule_time .egg_schedule_time_input_wrap {  display: flex;  justify-content: space-between;  align-items: center;}.egg_schedule_time_input_wrap .egg_schedule_add_btn {  outline: none;  border: 0.1rem solid #eee;  padding: 0.5rem 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  cursor: pointer;}.egg_schedule_time_input_wrap .egg_schedule_add_btn:active {  background: #eee;}.egg_schedule_list {  height: 100%;  overflow: auto;}.egg_schedule_list .egg_schedule_item {  display: flex;  justify-content: space-between;  padding: 0.5rem 1.5rem;  font-size: 1.4rem;  border-bottom: 0.1rem solid #eee;}.egg_schedule_list::-webkit-scrollbar {  width: 0.4rem;  background: white;  border-radius: 0.2rem;}.egg_schedule_list::-webkit-scrollbar-thumb {  background: #ccc;  border-radius: 0.2rem;}.egg_schedule_detail_time_wrap {  display: flex;  align-items: center;}.egg_schedule_detail_time_wrap.inactive {  color: #ccc;}.egg_schedule_detail_time_wrap .egg_schedule_detail_icon {  padding-right: 0.4rem;  display: flex;  color: #ccc;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn {  outline: none;  padding: 1rem;  text-align: center;  background: white;  border-radius: 0.2rem;  font-size: 1.4rem;  cursor: pointer;  color: #ccc;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn:hover {  color: #333;}.egg_schedule_detail_del_wrap .egg_schedule_del_btn:active {  color: #eee;}.egg_schedule_list .egg_schedule_list_none {  width: 100%;  height: 100%;  display: flex;  flex-direction: column;  justify-content: center;  align-items: center;  color: #ccc;}.egg_schedule_list_none .egg_icon {  font-size: 2.5rem;}.egg_schedule_list_none_text {  padding-top: 1rem;}.egg_select {  position: relative;}.egg_select .egg_select_input {  outline: none;  border: 0.1rem solid #eee;  padding: 0.8rem;  text-align: center;  background: white;  border-radius: 0.2rem;  display: inline-block;  width: 100%;  box-sizing: border-box;}.egg_select .egg_select_input::placeholder {  color: #ccc;}.egg_select_list {  max-height: 12rem;  border-radius: 0 0 0.2rem 0.2rem;  box-shadow: 0 0.1rem 0.1rem 0.1rem #eee;  background: white;  user-select: none;  transition: 100ms ease;  scrollbar-width: thin;  overflow: auto;  opacity: 1;  z-index: 9;  width: 100%;  position: absolute;}.egg_select_list.hide {  opacity: 0;  visibility: hidden;}.egg_select_list::-webkit-scrollbar {  width: 0.4rem;  background: white;  border-radius: 0.2rem;}.egg_select_list::-webkit-scrollbar-thumb {  background: #ccc;  border-radius: 0.2rem;}.egg_select_list .egg_select_item {  padding: 0.6rem 1rem;  border-bottom: 0.1rem solid #eee;  cursor: pointer;  color: #333;  transition: 300ms ease;  text-align: center;}.egg_select_list .egg_select_item.selected {  font-weight: bold;  background: #f6f6f6;}.egg_select_list .egg_select_item.active {  background: #eee;}.egg_select_list .egg_select_item:hover {  background: #eee;}';
/**
 * @description 嵌入样式
 */
GM_addStyle(css);
load((href) => href.match(URL_CONFIG.home), () => {
    // 初始化logo
    initLogo();
    // 页面提示
    log('进入主页面!');
    // 初始化主题
    initThemeColor();
    // 初始化任务配置
    initTaskConfig();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化主页面
    initMainListener();
    // 初始化提示
    renderTip();
    // 渲染面板
    renderPanel();
    // 渲染窗口
    renderFrame();
});
load((href) => href === GM_getValue('readingUrl'), async () => {
    // 页面提示
    log('进入文章选读页面!');
    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 最大阅读
    initMaxRead();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    try {
        // 处理文章
        await handleNews();
    }
    catch (err) {
        if (err instanceof Error) {
            // 提示
            createTip(err.message);
            // 错误
            error(err.message);
            return;
        }
        // 提示
        createTip(String(err));
        // 错误
        error(err);
    }
});
load((href) => href === GM_getValue('watchingUrl'), async () => {
    // 页面提示
    log('进入视听学习页面!');
    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 最大视听
    initMaxWatch();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    try {
        // 处理视频
        await handleVideo();
    }
    catch (err) {
        if (err instanceof Error) {
            // 提示
            createTip(err.message);
            // 错误
            error(err.message);
            return;
        }
        // 提示
        createTip(String(err));
        // 错误
        error(err);
    }
});
load((href) => href === URL_CONFIG.examPractice, async () => {
    // 页面提示
    log('进入每日答题页面!');
    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    // 创建答题按钮
    await renderExamBtn();
    try {
        // 开始答题
        await doingExam(ExamType.PRACTICE);
    }
    catch (err) {
        if (err instanceof Error) {
            // 提示
            createTip(err.message);
            // 错误
            error(err.message);
            return;
        }
        // 提示
        createTip(String(err));
        // 错误
        error(err);
    }
});
load((href) => href.includes(URL_CONFIG.examPaper), async () => {
    // 页面提示
    log('进入专项练习页面!');
    // 初始化主题
    initThemeColor();
    // 初始化设置
    initSettings();
    // 设置字体
    initFontSize();
    // 初始化子页面
    initChildListener();
    // 初始化提示
    renderTip();
    // 创建答题按钮
    await renderExamBtn();
    // 开始答题
    doingExam(ExamType.PAPER);
    return;
});
/**
 * @description 初始化logo
 */
function initLogo() {
    console.log(`%c tech-study.js %c ${version} `, 'background:dodgerblue;color:white;font-size:15px;border-radius:4px 0 0 4px;padding:2px 0;', 'background:black;color:gold;font-size:15px;border-radius:0 4px 4px 0;padding:2px 0;');
}
/**
 * @description 初始化配置
 */
function initTaskConfig() {
    try {
        const taskTemp = JSON.parse(GM_getValue('taskConfig'));
        if (taskTemp && Array.isArray(taskTemp)) {
            if (taskTemp.length === taskConfig.length) {
                taskConfig.forEach((task, i) => {
                    task.active = taskTemp[i].active;
                });
            }
        }
        // 监听值变化
        GM_addValueChangeListener('taskConfig', (key, oldVal, newVal, remote) => {
            if (remote) {
                const taskTemp = JSON.parse(newVal);
                if (taskTemp && Array.isArray(taskTemp)) {
                    if (taskTemp.length === taskConfig.length) {
                        taskConfig.forEach((task, i) => {
                            task.active = taskTemp[i].active;
                        });
                    }
                }
            }
        });
    }
    catch (e) { }
}
/**
 * @description 初始化配置
 */
function initSettings() {
    try {
        const settingsTemp = JSON.parse(GM_getValue('studySettings'));
        if (settingsTemp && Array.isArray(settingsTemp)) {
            if (settingsTemp.length === settings.length) {
                for (const i in settingsTemp) {
                    settings[i] = settingsTemp[i];
                }
            }
        }
        // 监听值变化
        GM_addValueChangeListener('studySettings', (key, oldVal, newVal, remote) => {
            if (remote) {
                const settingsTemp = JSON.parse(newVal);
                if (settingsTemp && Array.isArray(settingsTemp)) {
                    if (settingsTemp.length === settings.length) {
                        for (const i in settingsTemp) {
                            settings[i] = settingsTemp[i];
                        }
                    }
                }
            }
        });
    }
    catch (e) { }
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
    }
}
/**
 * @description 初始化最大阅读时长
 */
function initMaxRead() {
    try {
        const maxReadTemp = GM_getValue('maxRead');
        if (maxReadTemp) {
            maxRead.value = maxReadTemp;
        }
    }
    catch (error) { }
}
/**
 * @description 初始化最大视听时长
 */
function initMaxWatch() {
    try {
        const maxWatchTemp = GM_getValue('maxWatch');
        if (maxWatchTemp) {
            maxWatch.value = maxWatchTemp;
        }
    }
    catch (error) { }
}
/**
 * @description 初始化主题色
 */
function initThemeColor() {
    try {
        // 监听主题变化
        watch(themeColor, () => {
            // 设置主题
            document.documentElement.style.setProperty('--themeColor', themeColor.value);
        });
        // 主题色
        const themeColorTemp = GM_getValue('themeColor');
        if (themeColorTemp) {
            themeColor.value = themeColorTemp;
        }
        // 监听值变化
        GM_addValueChangeListener('themeColor', (key, oldVal, newVal, remote) => {
            if (remote) {
                // 主题色
                const themeColorTemp = newVal;
                if (themeColorTemp) {
                    themeColor.value = themeColorTemp;
                }
            }
        });
    }
    catch (error) { }
}
/**
 * @description 渲染提示
 */
function renderTip() {
    const tipWrap = createElementNode('div', undefined, {
        class: 'egg_tip_wrap',
        onclick(e) {
            e.stopPropagation();
        },
        onmousedown(e) {
            e.stopPropagation();
        },
        onmousemove(e) {
            e.stopPropagation();
        },
        onmouseup(e) {
            e.stopPropagation();
        },
        onmouseenter(e) {
            e.stopPropagation();
        },
        onmouseleave(e) {
            e.stopPropagation();
        },
        onmouseover(e) {
            e.stopPropagation();
        },
        ontouchstart(e) {
            e.stopPropagation();
        },
        ontouchmove(e) {
            e.stopPropagation();
        },
        ontouchend(e) {
            e.stopPropagation();
        },
        oninput(e) {
            e.stopPropagation();
        },
        onchange(e) {
            e.stopPropagation();
        },
        onblur(e) {
            e.stopPropagation();
        },
    });
    mountElement(tipWrap);
}
/**
 * @description 渲染答题按钮
 */
async function renderExamBtn() {
    const titles = await $_('.title');
    if (titles.length) {
        // 插入节点
        titles[0].parentNode?.insertBefore(ExamBtn().ele, titles[0].nextSibling);
    }
}
/**
 * @description 渲染面板
 * @returns
 */
async function renderPanel() {
    // 面板
    const panel = Panel();
    // 插入节点
    mountElement(panel);
}
/**
 * @description 渲染窗口
 */
function renderFrame() {
    // 窗口
    const frame = Frame();
    // 插入节点
    mountElement(frame);
}
/* 答案 API */
/**
 * @description 获取答案
 */
async function getAnswer(question) {
    // 数据
    const data = {
        txt_name: md5(question),
        password: '',
    };
    try {
        const params = new URLSearchParams(data);
        // 请求
        const res = await fetch(API_CONFIG.answerSearch, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });
        // 请求成功
        if (res.ok) {
            const result = await res.json();
            const { data, status } = result;
            if (status !== 0) {
                // 答案列表
                const answerList = JSON.parse(data.txt_content);
                // 答案
                const answers = answerList[0].content.split(/[;\s]/);
                return answers;
            }
        }
    }
    catch (error) { }
    return [];
}
/**
 * @description 保存答案
 */
async function saveAnswer(question, answer) {
    try {
        // 内容
        const content = JSON.stringify([{ title: md5(question), content: answer }]);
        // 数据
        const data = {
            txt_name: md5(question),
            txt_content: content,
            password: '',
            v_id: '',
        };
        const params = new URLSearchParams(data);
        // 请求
        const res = await fetch(API_CONFIG.answerSave, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (error) { }
}
/* 数据 API */
/**
 * @description 获取新闻数据
 */
async function getNewsList() {
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
async function getVideoList() {
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
 * @description 生成二维码
 */
async function generateQRCode() {
    try {
        // 推送
        const res = await fetch(API_CONFIG.generateQRCode, {
            method: 'GET',
            mode: 'cors',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                return data.result;
            }
        }
    }
    catch (error) { }
}
/**
 * @description 用二维码登录
 */
async function loginWithQRCode(qrCode) {
    try {
        const params = new URLSearchParams({
            qrCode,
            goto: 'https://oa.xuexi.cn',
            pdmToken: '',
        });
        // 推送
        const res = await fetch(API_CONFIG.loginWithQRCode, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: params.toString(),
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    }
    catch (error) { }
}
/**
 * @description 签名
 */
async function getSign() {
    try {
        // 推送
        const res = await fetch(API_CONFIG.sign, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            if (data.ok) {
                return data.data.sign;
            }
        }
    }
    catch (error) { }
}
/**
 * @description 安全检查
 * @param data
 */
async function secureCheck(data) {
    try {
        const params = new URLSearchParams(data);
        const url = `${API_CONFIG.secureCheck}?${params}`;
        // 推送
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });
        // 请求成功
        if (res.ok) {
            const data = await res.json();
            return data.success;
        }
    }
    catch (error) { }
    return false;
}
/* 推送 API */
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
            const data = await res.json();
            return data;
        }
    }
    catch (error) { }
}
/* 用户 API */
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
/* task·配置 */
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
/**
 * @description 二维码自动刷新间隔
 */
const autoRefreshQRCodeInterval = 100000;
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
};
/**
 * @description api配置
 */
const API_CONFIG = {
    // 用户信息
    userInfo: 'https://pc-api.xuexi.cn/open/api/user/info',
    // 总分
    totalScore: 'https://pc-proxy-api.xuexi.cn/delegate/score/get',
    // 当天分数
    todayScore: 'https://pc-proxy-api.xuexi.cn/delegate/score/today/query',
    // 任务列表
    taskList: 'https://pc-proxy-api.xuexi.cn/delegate/score/days/listScoreProgress?sence=score&deviceType=2',
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
    answerSearch: 'https://a6.qikekeji.com/txt/data/detail',
    // 推送
    push: 'https://www.pushplus.plus/send',
    // 生成二维码
    generateQRCode: 'https://login.xuexi.cn/user/qrcode/generate',
    //二维码登录
    loginWithQRCode: 'https://login.xuexi.cn/login/login_with_qr',
    // 签名
    sign: 'https://pc-api.xuexi.cn/open/api/sns/sign',
    // 安全检查
    secureCheck: 'https://pc-api.xuexi.cn/login/secure_check',
    // 二维码
    qrcode: 'https://api.qrserver.com/v1/create-qr-code',
};
/**
 * @description 版本号
 */
const version = '1.7.5';
/**
 * @description 任务类型
 */
var TaskType;
(function (TaskType) {
    TaskType[TaskType["LOGIN"] = 0] = "LOGIN";
    TaskType[TaskType["READ"] = 1] = "READ";
    TaskType[TaskType["WATCH"] = 2] = "WATCH";
    TaskType[TaskType["PRACTICE"] = 3] = "PRACTICE";
})(TaskType || (TaskType = {}));
/**
 * @description 设置类型
 */
var SettingType;
(function (SettingType) {
    SettingType[SettingType["AUTO_START"] = 0] = "AUTO_START";
    SettingType[SettingType["SAME_TAB"] = 1] = "SAME_TAB";
    SettingType[SettingType["SILENT_RUN"] = 2] = "SILENT_RUN";
    SettingType[SettingType["SCHEDULE_RUN"] = 3] = "SCHEDULE_RUN";
    SettingType[SettingType["VIDEO_MUTED"] = 4] = "VIDEO_MUTED";
    SettingType[SettingType["RANDOM_EXAM"] = 5] = "RANDOM_EXAM";
    SettingType[SettingType["AUTO_ANSWER"] = 6] = "AUTO_ANSWER";
    SettingType[SettingType["REMOTE_PUSH"] = 7] = "REMOTE_PUSH";
})(SettingType || (SettingType = {}));
/**
 * @description 进度类型
 */
var TaskStatusType;
(function (TaskStatusType) {
    TaskStatusType[TaskStatusType["LOADING"] = 0] = "LOADING";
    TaskStatusType[TaskStatusType["LOADED"] = 1] = "LOADED";
    TaskStatusType[TaskStatusType["START"] = 2] = "START";
    TaskStatusType[TaskStatusType["PAUSE"] = 3] = "PAUSE";
    TaskStatusType[TaskStatusType["FINISH"] = 4] = "FINISH";
})(TaskStatusType || (TaskStatusType = {}));
// 当前订阅
let currentSub;
// 订阅
const subscription = new WeakMap();
/**
 * @description Proxy Map
 */
const proxyMap = new WeakMap();
/**
 * @description 收集 Ref 依赖
 * @param target
 * @param key
 */
const trackRef = (target) => {
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
        const subkeyList = new Set();
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
        subkeyList = new Set();
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
function triggerRef(target, newVal, oldVal) {
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
const track = (target, key) => {
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
        const subkeyList = new Set();
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
        subkeyList = new Set();
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
function trigger(target, key, newVal, oldVal) {
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
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REF"] = "_isRef";
    ReactiveFlags["IS_SHALLOW"] = "_isShallow";
    ReactiveFlags["IS_REACTIVE"] = "_isReactive";
    ReactiveFlags["IS_READONLY"] = "_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
/**
 * @description Ref
 */
class Ref {
    _isShallow = false;
    _isRef = true;
    _value;
    value;
    constructor(val, shallow = false) {
        const _this = this;
        this._isShallow = shallow;
        if (val && typeof val === 'object' && shallow) {
            const reactiveVal = reactive(val);
            this._value = reactiveVal;
            this.value = reactiveVal;
        }
        else {
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
            set(newVal) {
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
 * @description ref
 * @param v
 * @returns
 */
const isRef = (v) => {
    return !!(v && v[ReactiveFlags.IS_REF]);
};
/**
 * @description 浅层 shallow
 * @param v
 * @returns
 */
const isShallow = (v) => {
    return !!(v && v[ReactiveFlags.IS_SHALLOW]);
};
/**
 * @description 创建 ref
 * @param v
 * @returns
 */
const createRef = (rawVal, shallow) => {
    return new Ref(rawVal, shallow);
};
/**
 * @description 解除 ref
 * @param val
 * @returns
 */
const unref = (val) => {
    return (isRef(val) ? val.value : val);
};
/**
 * @description 顶层 ref
 * @param v
 * @returns
 */
const ref = (value) => {
    return isRef(value)
        ? value
        : createRef(value, true);
};
/**
 * @description ref
 * @param value
 * @returns
 */
const shallowRef = (value) => {
    return isRef(value)
        ? value
        : createRef(value, false);
};
/**
 * @description 创建处理 reactive
 * @param isReadonly
 * @param isShallow
 * @returns
 */
const createReactiveHandlers = (isReadonly, isShallow) => {
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
const createGetters = (isReadonly, isShallow) => {
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
const createSetters = (readonly, shallow) => {
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
/**
 * @description reactive object
 */
const createReactiveObj = (target, isReadonly, shallow) => {
    // 存在 Proxy
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // 新建
    const proxy = new Proxy(target, createReactiveHandlers(isReadonly, shallow));
    proxyMap.set(target, proxy);
    return proxy;
};
/**
 * @description reactive
 * @param val
 * @returns
 */
const isReactive = (val) => {
    return !!(val && val[ReactiveFlags.IS_REACTIVE]);
};
/**
 * @description 创建 reactive
 * @param target
 * @returns
 */
const createReactive = (target) => {
    return createReactiveObj(target, false, false);
};
/**
 * @description 顶层 reactive
 * @param target
 * @returns
 */
const shallowReactive = (target) => {
    return createReactiveObj(target, false, true);
};
/**
 * @description reactive
 * @param val
 * @returns
 */
const isReadonly = (val) => {
    return !!(val && val[ReactiveFlags.IS_READONLY]);
};
/**
 * @description 创建 readonly
 * @param target
 * @returns
 */
const createReadonly = (target) => {
    return createReactiveObj(target, true, false);
};
/**
 * @description 顶层 readonly
 * @param target
 * @returns
 */
const shallowReadonly = (target) => {
    return createReactiveObj(target, true, true);
};
/**
 * @description proxy
 * @param val
 * @returns
 */
const isProxy = (val) => {
    return isReactive(val) || isReadonly(val);
};
/**
 * @description reactive
 * @param target
 * @returns
 */
const reactive = (target) => {
    return createReactive(target);
};
/**
 * @description readonly
 * @param target
 * @returns
 */
const readonly = (target) => {
    return createReadonly(target);
};
/**
 * @description 监听数据变化
 * @param source
 * @param callback
 */
const watch = (source, callback, immediate = false) => {
    // 立刻执行
    immediate && callback(unref(source), unref(source));
    // array
    if (Array.isArray(source) && source.every((s) => isRef(s))) {
        for (const i in source) {
            // Proxy
            if (isProxy(source[i])) {
                watch(source[i], () => {
                    const res = source.map((s) => unref(s));
                    callback(res, res);
                });
            }
        }
        watch(() => source.map((s) => unref(s)), callback);
        return;
    }
    // function
    if (source instanceof Function) {
        watch(watchEffectRef(source), (n, o) => {
            callback(unref(n), unref(o));
        });
        return;
    }
    // Proxy
    if (isProxy(source)) {
        for (const key in source) {
            currentSub = () => {
                callback(source, source);
            };
            // sub source
            const subSource = source[key];
            currentSub = undefined;
            watch(subSource, () => {
                callback(source, source);
            });
        }
        return;
    }
    // Ref
    if (isRef(source)) {
        // Ref.value Proxy
        if (isProxy(source.value)) {
            watch(source.value, () => {
                callback(unref(source), unref(source));
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
const watchEffect = (callback) => {
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
const watchRef = (source, callback) => {
    // 收集依赖
    const effectRes = shallowRef(callback());
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
const watchEffectRef = (callback) => {
    // 收集依赖
    const effectRes = shallowRef(undefined);
    // 监听
    watchEffect(() => (effectRes.value = unref(callback())));
    return effectRes;
};
/**
 * @description 创建元素节点
 * @param eleName
 * @param props
 * @param attrs
 * @param children
 * @returns
 */
function createElementNode(tagName, props, attrs, children, options) {
    // 挂载状态
    let beforemount = ref(false);
    // 挂载状态
    let mounted = ref(false);
    const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
    // 订阅
    const subscribe = (e) => {
        const { onMounted, beforeMount } = e;
        if (beforeMount) {
            watch(beforemount, () => {
                if (beforemount.value) {
                    beforeMount();
                    return;
                }
            }, true);
        }
        if (onMounted) {
            watch(mounted, () => {
                if (mounted.value) {
                    onMounted();
                    return;
                }
            }, true);
        }
    };
    // 取消订阅
    const unsubscribe = (e) => {
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
function createNSElementNode(tagName, props, attrs, children, options) {
    // 挂载状态
    let beforemount = ref(false);
    // 挂载状态
    let mounted = ref(false);
    const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
    // 订阅
    const subscribe = (e) => {
        const { onMounted, beforeMount } = e;
        if (beforeMount) {
            watch(beforemount, () => {
                if (beforemount.value) {
                    beforeMount();
                    return;
                }
            }, true);
        }
        if (onMounted) {
            watch(mounted, () => {
                if (mounted.value) {
                    onMounted();
                    return;
                }
            }, true);
        }
    };
    // 取消订阅
    const unsubscribe = (e) => {
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
function handleProps(ele, props) {
    // props属性设置
    for (const key in props) {
        // Ref 属性
        if (isRef(props[key])) {
            const refVal = props[key];
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
function handleAttributes(ele, attrs, subscribe, unsubscribe) {
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
function handleEventOptions(option) {
    if (option.length) {
        const options = {
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
function handleAttribute(ele, key, value, subscribe, unsubscribe) {
    // 处理完的key
    const formatKey = key.toLowerCase();
    // 事件绑定
    if (formatKey.startsWith('on')) {
        // 事件监听
        const [event] = formatKey.match(/(?<=on).*/);
        // 事件类型
        if (event) {
            const [eventType, ...option] = event.split('_');
            const options = handleEventOptions(option);
            // Ref 函数
            if (isRef(value)) {
                const refVal = value;
                const refListener = watchRef(refVal, () => refVal.value
                    ? (e) => {
                        option.includes('prevent') && e.preventDefault();
                        option.includes('stop') && e.stopPropagation();
                        const callback = refVal.value;
                        callback(e);
                    }
                    : undefined);
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
            const refVal = value;
            watchEffect(() => {
                if (refVal.value) {
                    ele.setAttribute(formatKey, '');
                }
                else {
                    ele.removeAttribute(formatKey);
                }
            });
            return;
        }
        // 普通属性值
        if (value) {
            ele.setAttribute(formatKey, '');
        }
        else {
            ele.removeAttribute(formatKey);
        }
        return;
    }
    // ref 属性名
    if (key === 'ref') {
        // Ref
        if (isRef(value)) {
            const refVal = value;
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
            const refFn = value;
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
        }
        else {
            ele.removeAttributeNS(attrNS, key);
        }
        return;
    }
    // Ref 属性值
    if (key && isRef(value)) {
        const refVal = value;
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
function handleChildren(ele, children, subscribe, unsubscribe) {
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
        const resChildren = [];
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
                                handleChangeElement(newEle, oldEleRes, comment, subscribe, unsubscribe);
                            }
                            return;
                        }
                        handleChangeElement(newEle, oldEle, comment, subscribe, unsubscribe);
                        return;
                    }
                    // 旧元素为空
                    if (newEle && !oldEle) {
                        // Promise
                        if (newEle instanceof Promise) {
                            const newEleRes = await newEle;
                            if (newEleRes) {
                                handleChangeElement(newEleRes, oldEle, comment, subscribe, unsubscribe);
                            }
                            return;
                        }
                        handleChangeElement(newEle, oldEle, comment, subscribe, unsubscribe);
                        return;
                    }
                    // 存在
                    if (newEle && oldEle) {
                        // Promise
                        if (newEle instanceof Promise && oldEle instanceof Promise) {
                            const newEleRes = await newEle;
                            const oldEleRes = await oldEle;
                            // 处理元素变化
                            handleChangeElement(newEleRes, oldEleRes, comment, subscribe, unsubscribe);
                            return;
                        }
                        // Promise
                        if (newEle instanceof Promise && !(oldEle instanceof Promise)) {
                            const newEleRes = await newEle;
                            // 处理元素变化
                            handleChangeElement(newEleRes, oldEle, comment, subscribe, unsubscribe);
                            return;
                        }
                        // Promise
                        if (!(newEle instanceof Promise) && oldEle instanceof Promise) {
                            const oldEleRes = await oldEle;
                            // 处理元素变化
                            handleChangeElement(newEle, oldEleRes, comment, subscribe, unsubscribe);
                            return;
                        }
                        // 非 Promise
                        if (!(oldEle instanceof Promise) && !(newEle instanceof Promise)) {
                            // 处理元素变化
                            handleChangeElement(newEle, oldEle, comment, subscribe, unsubscribe);
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
function handleChangeElement(newEle, oldEle, comment, subscribe, unsubscribe) {
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
function createTextNode(text, options) {
    const { onCreated, beforeCreat, onMounted, beforeMount } = options || {};
    // 创建元素前
    beforeCreat && beforeCreat();
    // Ref
    if (isRef(text)) {
        // ref
        const refVal = text;
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
function mountElement(eleOptions, parent = document.body) {
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
function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
/**
 * @description 异步选择器
 * @param selector
 * @returns
 */
function $_(selector, parent = document, timeout) {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            const selectors = Array.from(parent.querySelectorAll(selector));
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
function createElementBlock(eles) {
    const fragment = document.createDocumentFragment();
    for (const i in eles) {
        fragment.appendChild(eles[i]);
    }
    return fragment;
}
/**
 * @description 打印日志
 * @param text
 */
function log(...text) {
    printColor('dodgerblue', ...text);
}
/**
 * @description 打印错误
 * @param text
 */
function error(...text) {
    printColor('red', ...text);
}
/**
 * @description 打印信息
 * @param text
 */
function info(...text) {
    printColor('yellow', ...text);
}
/**
 * @description 打印颜色
 * @param text
 * @param color
 */
function printColor(color, ...text) {
    const textFormatted = text
        .map((t) => (typeof t === 'object' ? JSON.stringify(t) : String(t)))
        .join(' ');
    console.log(`%c[${formatDateTime()}] %c${textFormatted}`, '', `color: ${color}`);
}
/**
 * @description html进度条
 * @param title
 * @param percent
 * @returns
 */
function getProgressHTML(title, current, total) {
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
    if (res && res.code === 200) {
        return res;
    }
    return;
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
/* 工具函数 */
/**
 * @description 设置cookie
 * @param name
 * @param value
 * @param expires
 */
function setCookie(name, value, expires, domain) {
    // 当前日期
    const date = new Date();
    // 过期日期
    date.setTime(date.getTime() + expires);
    // 设置cookie
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;domain=${domain}`;
}
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
 * @description 删除cookie
 * @param name
 */
function delCookie(name, domain) {
    // 存在cookie
    const value = getCookie(name);
    if (value !== null) {
        setCookie(name, '', -1, domain);
    }
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
 * @description 判断是否为移动端
 * @returns
 */
function hasMobile() {
    let isMobile = false;
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        log('移动端');
        isMobile = true;
    }
    if (document.body.clientWidth < 800) {
        log('小尺寸设备端');
        isMobile = true;
    }
    return isMobile;
}
/**
 * @description 等待时间
 * @param time
 * @returns
 */
function sleep(time) {
    // 延时
    let timeDelay = Number(time);
    if (!Number.isInteger(timeDelay)) {
        timeDelay = 1000;
    }
    timeDelay += Math.random() * 500 - 250;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, timeDelay);
    });
}
/**
 * @description 暂停学习锁
 */
function studyPauseLock(callback) {
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
                    log('学习等待结束!');
                    if (callback && callback instanceof Function) {
                        callback(true);
                    }
                    resolve(true);
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback(false);
                }
                log('学习等待...');
            }, 500);
            return;
        }
        resolve(true);
    });
}
/**
 * @description 加载
 * @param match
 * @param callback
 */
function load(match, callback) {
    // 链接
    const { href } = window.location;
    window.addEventListener('load', () => {
        // 函数
        if (match instanceof Function) {
            match(href) && callback();
            return;
        }
        // 布尔
        if (typeof match === 'boolean') {
            match && callback();
            return;
        }
        // 字符正则
        if (href.match(match)) {
            callback();
            return;
        }
    });
}
/* 变量 */
/**
 * @description 链接
 */
const href = window.location.href;
/**
 * @description 任务配置
 */
const taskConfig = reactive([
    {
        title: '登录',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每日首次登录积1分。',
        score: 0,
        active: true,
        immutable: true,
        type: TaskType.LOGIN,
    },
    {
        title: '文章选读',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每有效阅读一篇文章积1分，上限6分。有效阅读文章累计1分钟积1分，上限6分。每日上限积12分。',
        score: 0,
        active: true,
        immutable: false,
        type: TaskType.READ,
    },
    {
        title: '视听学习',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每有效一个音频或观看一个视频积1分，上限6分。有效收听音频或观看视频累计1分钟积1分，上限6分。每日上限积12分。',
        score: 0,
        active: true,
        immutable: false,
        type: TaskType.WATCH,
    },
    {
        title: '每日答题',
        currentScore: 0,
        dayMaxScore: 0,
        need: 0,
        status: false,
        tip: '每组答题每答对1道积1分。每日上限积5分。',
        score: 0,
        active: true,
        immutable: false,
        type: TaskType.PRACTICE,
    },
]);
/**
 * @description 设置
 */
const settings = reactive([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
]);
/**
 * @description 总分
 */
const totalScore = ref(0);
/**
 * @description 当天分数
 */
const todayScore = ref(0);
/**
 * @description 用户信息
 */
const userinfo = reactive({
    nick: '',
    avatar: '',
});
/**
 * @description 进度
 */
const taskStatus = ref(TaskStatusType.LOADING);
/**
 * @description 答题暂停
 */
const examPause = ref(false);
/**
 * @description 登录
 */
const login = ref(!!getCookie('token'));
/**
 * @description 窗口id
 */
const id = ref('');
/**
 * @description 定时刷新列表
 */
const scheduleList = shallowReactive([]);
/**
 * @description 推送token
 */
const pushToken = ref('');
/**
 * @description 刷新次数
 */
const refreshCount = ref(0);
/**
 * @description 窗口关闭
 */
const frame = reactive({
    title: '',
    show: false,
    exist: false,
    closed: true,
    ele: undefined,
    src: '',
});
/**
 * @description 页面
 */
const page = ref(undefined);
/**
 * @description 开始登录
 */
const loginQRCodeShow = ref(false);
/**
 * @description 最大选读时长
 */
const maxRead = ref(100);
/**
 * @description 最大视听时长
 */
const maxWatch = ref(120);
/**
 * @description 运行其他任务
 */
const running = ref(false);
/**
 * @description 主题色
 */
const themeColor = ref('#fa3333');
/**
 * @description  考试类型
 */
var ExamType;
(function (ExamType) {
    ExamType[ExamType["PRACTICE"] = 0] = "PRACTICE";
    ExamType[ExamType["PAPER"] = 1] = "PAPER";
})(ExamType || (ExamType = {}));
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
            const track = (await $_('.nc_scale', undefined, 3000))[0];
            // 滑块
            const slide = (await $_('.btn_slide', undefined, 3000))[0];
            // 延时
            await sleep(2000);
            // 矩形范围
            const rectTrack = track.getBoundingClientRect();
            // 矩形范围
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
                    log('滑动验证成功!');
                    // 创建提示
                    createTip('滑动验证成功!');
                    clearInterval(timer);
                    resolve(true);
                    return;
                }
                resolve(false);
                log('滑动验证失败!');
                // 创建提示
                createTip('滑动验证失败!');
            }, 1000);
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
 * @description 暂停锁
 */
function examPauseLock(callback) {
    return new Promise((resolve) => {
        // 学习暂停
        const pauseStudy = (GM_getValue('pauseStudy') || false);
        // 全局暂停
        if (pauseStudy) {
            examPause.value = true;
        }
        // 暂停
        if (examPause.value) {
            // 创建提示
            createTip('已暂停, 手动开启自动答题! ', 10);
            const doing = setInterval(() => {
                if (!examPause.value) {
                    // 停止定时器
                    clearInterval(doing);
                    log('答题等待结束!');
                    if (callback && callback instanceof Function) {
                        // 创建提示
                        createTip('已开启, 自动答题!');
                        callback(true);
                    }
                    resolve(true);
                    return;
                }
                if (callback && callback instanceof Function) {
                    callback(false);
                }
                log('答题等待...');
            }, 500);
            return;
        }
        resolve(true);
    });
}
/**
 * @description 答题
 */
async function doingExam(type) {
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
        await examPauseLock();
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
        await examPauseLock();
        // 选项按钮
        const allBtns = $$('.q-answer');
        // 所有填空
        const blanks = $$('input[type=text][class=blank]');
        // 问题类型
        const questionType = ($$('.q-header')[0].innerText.substring(0, 3));
        // 暂停
        await examPauseLock();
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
                log('正在获取答案...');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                log(`获取答案${answersNetwork.length ? '成功' : '失败'}!`, {
                    question,
                    answersNetwork,
                });
                // 根据题库作答
                if (answersNetwork.length) {
                    const res = handleBlankInput(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 随机作答
                if (type === ExamType.PRACTICE || settings[SettingType.RANDOM_EXAM]) {
                    log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleBlankInputRand();
                }
                else {
                    // 推送
                    const res = await pushModal({
                        title: '学习推送',
                        to: userinfo.nick,
                        content: '答题存在异常, 已暂停答题!',
                        type: 'fail',
                    }, pushToken.value);
                    createTip(`学习推送${res ? '成功' : '失败'}!`);
                    // 暂停
                    examPause.value = true;
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
                log('正在获取答案...');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                log(`获取答案${answersNetwork.length ? '成功' : '失败'}!`, {
                    question,
                    answersNetwork,
                });
                // 答案存在
                if (answersNetwork.length) {
                    const res = handleChoiceBtn(answersNetwork);
                    // 成功
                    if (res) {
                        break;
                    }
                }
                // 随机作答
                if (type === ExamType.PRACTICE || settings[SettingType.RANDOM_EXAM]) {
                    log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleMutiplyChoiceRand();
                }
                else {
                    // 推送
                    const res = await pushModal({
                        title: '学习推送',
                        to: userinfo.nick,
                        content: '答题存在异常, 已暂停答题!',
                        type: 'fail',
                    }, pushToken.value);
                    createTip(`学习推送${res ? '成功' : '失败'}!`);
                    // 暂停
                    examPause.value = true;
                    // 提交答案
                    shouldSaveAnswer = true;
                }
                break;
            }
            case '单选题': {
                // 根据提示作答
                if (answers.length) {
                    // 创建提示为1
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
                        const answersLike = seperator
                            .map((s) => answers.join(s).trim())
                            .filter((answer) => answer.length);
                        // 答案存在
                        if (answersLike.length) {
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
                log('正在获取答案...');
                // 尝试题库获取
                const answersNetwork = await getAnswer(question);
                log(`获取答案${answersNetwork.length ? '成功' : '失败'}!`, {
                    question,
                    answersNetwork,
                });
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
                if (type === ExamType.PRACTICE || settings[SettingType.RANDOM_EXAM]) {
                    log('答案不存在, 随机作答!');
                    // 创建提示
                    createTip('答案不存在, 随机作答!');
                    await handleSingleChoiceRand();
                }
                else {
                    // 推送
                    const res = await pushModal({
                        title: '学习推送',
                        to: userinfo.nick,
                        content: '答题存在异常, 已暂停答题!',
                        type: 'fail',
                    }, pushToken.value);
                    createTip(`学习推送${res ? '成功' : '失败'}!`);
                    // 暂停
                    examPause.value = true;
                    // 提交答案
                    shouldSaveAnswer = true;
                }
                break;
            }
        }
        // 暂停
        await examPauseLock();
        // 获取下一个按钮
        nextButton = await getNextButton();
        // 下一个文本
        nextText = nextButton.innerText.replaceAll(' ', '');
        // 需要提交答案
        if (shouldSaveAnswer) {
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
                log('正在上传答案...');
                // 上传答案
                const res = await saveAnswer(question, answer);
                log(`上传答案${res ? '成功' : '失败'}!`, { question, answer });
            }
            // 重置
            shouldSaveAnswer = false;
        }
        // 确定
        if (nextText === '确定') {
            // 确认
            nextButton.click();
            // 等待一段时间
            await sleep(2000);
            // 暂停
            await examPauseLock();
            // 答案解析
            const answerBox = $$('.answer')[0];
            // 答题错误
            if (answerBox) {
                const answerTemp = answerBox.innerText;
                // 从字符串中拿出答案
                const [, answerText] = answerTemp.split('：');
                if (answerText && answerText.length) {
                    const answer = answerText.replaceAll(' ', ';');
                    log('正在上传答案...');
                    // 上传答案
                    const res = await saveAnswer(question, answer);
                    log(`上传答案${res ? '成功' : '失败'}!`, { question, answer });
                }
            }
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
        // 滑动验证
        await handleSlideVerify();
    }
    // 关闭任务窗口
    handleCloseTaskWin();
}
/**
 * @description 每日答题
 */
async function doExamPractice() {
    // 暂停
    await studyPauseLock();
    log('正在每日答题...');
    // 创建提示
    createTip('正在每日答题');
    // 链接
    const url = URL_CONFIG.examPractice;
    // 等待任务窗口
    await waitTaskWin(url, '每日答题');
    // 创建提示
    createTip('完成每日答题!');
    // 等待一段时间
    await sleep(1500);
    // 刷新分数数据
    await refreshScoreInfo();
    // 刷新任务数据
    await refreshTaskList();
    // 任务完成状况
    if (taskConfig[TaskType.PRACTICE].active &&
        !taskConfig[TaskType.PRACTICE].status) {
        log('任务未完成, 继续每日答题!');
        // 创建提示
        createTip('任务未完成, 继续每日答题!');
        await doExamPractice();
    }
}
/**
 * @description 专项练习
 */
async function doExamPaper() {
    running.value = true;
    log('正在专项练习...');
    // 创建提示
    createTip('正在专项练习');
    // id
    const examPaperId = await findExamPaper();
    if (examPaperId) {
        // 链接
        const url = `${URL_CONFIG.examPaper}?id=${examPaperId}`;
        log(`链接: ${url}`);
        // 等待窗口任务
        await waitTaskWin(url, '专项练习');
        // 创建提示
        createTip('完成专项练习!');
        running.value = false;
        // 同屏任务
        if (settings[SettingType.SAME_TAB]) {
            // 窗口不存在
            frame.exist = false;
        }
        return;
    }
    running.value = false;
    // 创建提示
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
        await sleep(3000);
        return data.totalPageCount;
    }
}
/**
 * @description 查询专项练习列表
 */
async function findExamPaper() {
    // 获取总页数
    const total = await initExam();
    // 当前页数
    let current = 1;
    log(`正在寻找的专项练习...`);
    // 创建提示
    createTip(`正在寻找的专项练习...`);
    while (current <= total && current) {
        // 请求数据
        const data = await getExamPaper(current);
        if (data) {
            // 获取专项练习的列表
            const examPapers = data.list;
            for (const i in examPapers) {
                // 遍历查询有没有没做过的
                if (examPapers[i].status !== 2) {
                    // status： 1 开始答题, 2 已满分/重新答题, 3 继续答题
                    return examPapers[i].id;
                }
            }
            // 增加页码
            current += 1;
            // 等待
            await sleep(3000);
        }
        else {
            break;
        }
    }
}
/**
 * @description 初始化主页面
 */
function initMainListener() {
    // 监听关闭
    window.addEventListener('message', (msg) => {
        const { data } = msg;
        if (data.id === id.value && data.closed) {
            // 关闭窗口
            closeFrame();
            return;
        }
    });
}
/**
 * @description 初始化子页面
 */
function initChildListener() {
    window.addEventListener('message', (msg) => {
        const { data } = msg;
        if (data.id && !data.closed) {
            // 设置窗口id
            id.value = data.id;
            log(`初始化窗口 ID: ${id.value}`);
            return;
        }
    });
}
/**
 * @description 打开窗口
 * @param url
 * @returns
 */
async function openFrame(url, title) {
    // 设置 URL
    frame.src = url;
    // 等待元素
    await $_('.egg_frame');
    if (frame.ele) {
        // id
        id.value = generateMix(10);
        // 打开
        frame.closed = false;
        // 设置标题
        frame.title = title || '';
        // 等待页面加载
        await waitFrameLoaded(frame.ele);
        // 发送窗口 ID
        frame.ele.contentWindow?.postMessage({ id: id.value, closed: false }, url);
        return true;
    }
    return false;
}
/**
 * @description 关闭窗口
 */
function closeFrame() {
    log(`关闭窗口 ID: ${id.value}`);
    // 窗口显示
    frame.show = false;
    // 关闭
    frame.closed = true;
    // 标题
    frame.title = '';
    // src
    frame.src = '';
}
/**
 * @description 关闭 frame
 */
function handleCloseFrame() {
    window.parent.postMessage({ id: id.value, closed: true }, URL_CONFIG.homeOrigin);
}
/**
 * @description 等待窗口任务结束
 * @param id
 * @returns
 */
function waitFrameClose() {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            // 窗口关闭
            if (frame.closed) {
                clearInterval(timer);
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
 * @description 关闭窗口
 */
function closeWin() {
    page.value && page.value.close();
}
/**
 * @description 关闭子窗口
 */
function handleCloseWin() {
    try {
        window.opener = window;
        const win = window.open('', '_self');
        win?.close();
        top?.close();
    }
    catch (e) { }
}
/**
 * @description 等待窗口关闭
 * @param newPage
 * @returns
 */
function waitWinClose(newPage) {
    return new Promise((resolve) => {
        newPage.onclose = () => {
            resolve(undefined);
        };
    });
}
/**
 * @description 关闭任务窗口
 */
function closeTaskWin() {
    // 同屏任务
    if (settings[SettingType.SAME_TAB] && id.value) {
        closeFrame();
        return;
    }
    // 非同屏任务
    closeWin();
}
/**
 * @description 关闭任务窗口
 */
function handleCloseTaskWin() {
    // 同屏任务
    if (settings[SettingType.SAME_TAB] && id.value) {
        handleCloseFrame();
        return;
    }
    // 子窗口
    handleCloseWin();
}
/**
 * @description 打开并等待任务结束
 */
async function waitTaskWin(url, title) {
    // 同屏任务
    if (settings[SettingType.SAME_TAB]) {
        // 窗口存在
        frame.exist = true;
        // 显示窗体
        frame.show = !settings[SettingType.SILENT_RUN];
        // 新窗口
        const res = await openFrame(url, title);
        if (res) {
            // 等待窗口关闭
            await waitFrameClose();
        }
        return;
    }
    // 子页面任务
    page.value = openWin(url);
    await waitWinClose(page.value);
}
/**
 * @description 二维码刷新定时器
 */
let refreshTimer = -1;
/**
 * @description 尝试登录
 */
let tryLoginTimer = -1;
/**
 * @description 生成二维码
 */
async function getQRCode() {
    log('正在生成登录二维码...');
    const qrCode = await generateQRCode();
    if (qrCode) {
        log('生成登录二维码成功!');
        // 链接
        const url = `https://login.xuexi.cn/login/qrcommit?showmenu=false&code=${qrCode}&appId=dingoankubyrfkttorhpou`;
        return {
            code: qrCode,
            src: `${API_CONFIG.qrcode}?data=${encodeURIComponent(url)}`,
            url,
        };
    }
    log('生成登录二维码失败!');
}
/**
 * @description 验证登录二维码
 * @param code
 * @returns
 */
async function checkQRCode(code) {
    log('尝试用二维码登录...');
    // 二维码登录
    const res = await loginWithQRCode(code);
    if (res) {
        const { data, code, success } = res;
        // 临时登录验证码
        if (success && data) {
            return data;
        }
        // 二维码失效
        if (code === '11019') {
            return;
        }
    }
    return new Promise((resolve) => {
        // 清除定时
        clearTimeout(tryLoginTimer);
        // 设置定时
        tryLoginTimer = setTimeout(async () => {
            resolve(await checkQRCode(code));
        }, 1000);
    });
}
/**
 * @description 尝试二维码登录
 */
async function tryLogin(checkCode) {
    log('正在获取签名...');
    // 获取签名
    const sign = await getSign();
    if (sign) {
        // 生成uuid
        const uuid = crypto.randomUUID();
        const [, code] = checkCode.split('=');
        const state = `${sign}${uuid}`;
        // 安全检查
        const res = await secureCheck({ code, state });
        return res;
    }
}
/**
 * @description 刷新登录二维码
 */
async function handleLogin() {
    // 清除刷新
    clearInterval(refreshTimer);
    // 每隔一段时间刷新
    refreshTimer = setInterval(() => {
        // 刷新二维码
        handleLogin();
    }, autoRefreshQRCodeInterval);
    // 是否超出次数
    if (refreshCount.value >= maxRefreshCount) {
        createTip('超过最大重试次数, 登录失败!');
        // 重置刷新数
        refreshCount.value = 0;
        // 隐藏二维码
        loginQRCodeShow.value = false;
        // 远程推送
        if (settings[SettingType.REMOTE_PUSH]) {
            // 推送
            const res = await pushModal({
                title: '登录推送',
                content: '超过最大重试次数, 登录失败!',
                type: 'fail',
            }, pushToken.value);
            createTip(`登录推送${res ? '成功' : '失败'}!`);
        }
        return;
    }
    // 配置
    const imgWrap = $$('.egg_login_img_wrap')[0];
    // 图片
    const img = $$('.egg_login_img', imgWrap)[0];
    if (imgWrap && img) {
        // 刷新二维码
        log('刷新登录二维码!');
        // 刷新次数累加
        refreshCount.value++;
        // 获取二维码
        const qrCode = await getQRCode();
        if (qrCode) {
            // 获取连接
            const { src, code, url } = qrCode;
            // src
            img.src = src;
            // 开始登录
            loginQRCodeShow.value = true;
            // 远程推送
            if (settings[SettingType.REMOTE_PUSH]) {
                // img html
                const imgWrap = getImgHTML(src);
                // 跳转链接
                const aWrap = `
   <div>
      或在浏览器
      <a
        href="dtxuexi://appclient/page/study_feeds?url=${encodeURIComponent(url)}"
        style="text-decoration: none"
        >${getHighlightHTML('打开学习强国APP')}</a
      >
    </div>
  `;
                // 推送
                const res = await pushModal({
                    title: '登录推送',
                    content: ['扫一扫, 登录学习强国!', aWrap, imgWrap],
                    type: 'info',
                }, pushToken.value);
                createTip(`登录推送${res ? '成功' : '失败'}!`);
            }
            // 获取验证码
            const checkCode = await checkQRCode(code);
            // 验证成功
            if (checkCode) {
                // 尝试登录
                const loginRes = await tryLogin(checkCode);
                if (loginRes) {
                    // 清除刷新
                    clearInterval(refreshTimer);
                    // 二维码显示
                    loginQRCodeShow.value = false;
                    // 登录成功
                    log('登录成功!');
                    // 创建提示
                    createTip('登录成功!');
                    // 登录成功
                    login.value = true;
                    // 刷新用户信息
                    await refreshUserInfo();
                    // 刷新分数信息
                    await refreshScoreInfo();
                    // 刷新任务信息
                    await refreshTaskList();
                    // 远程推送
                    if (settings[SettingType.REMOTE_PUSH]) {
                        const res = await pushModal({
                            title: '登录推送',
                            to: userinfo.nick,
                            content: [
                                '学习强国, 登录成功!',
                                `当天积分:  ${getHighlightHTML(todayScore.value)} 分`,
                                `总积分: ${getHighlightHTML(totalScore.value)} 分`,
                                ...taskConfig.map((task) => getProgressHTML(task.title, task.currentScore, task.dayMaxScore)),
                            ],
                            type: 'success',
                        }, pushToken.value);
                        createTip(`登录推送${res ? '成功' : '失败'}!`);
                    }
                }
                return;
            }
            // 二维码失效
            log('登录二维码失效!');
            // 二维码失效刷新
            handleLogin();
        }
    }
}
/**
 * @description 退出登录
 */
function handleLogout() {
    // 删除token
    delCookie('token', '.xuexi.cn');
    // 关闭窗口
    closeFrame();
    frame.exist = false;
    // 退出登录
    login.value = false;
    // 清除用户信息
    userinfo.nick = '';
    userinfo.avatar = '';
    // 总分
    totalScore.value = 0;
    // 当天分数
    todayScore.value = 0;
    // 任务进度重置
    taskConfig.forEach((task) => {
        task.currentScore = 0;
    });
    taskStatus.value = TaskStatusType.LOADING;
    // 退出登录
    log('退出登录');
}
/**
 * @description 新闻
 */
let news = [];
/**
 * @description 视频
 */
let videos = [];
/**
 * @description 处理文章
 */
async function handleNews() {
    // section
    const sections = await $_('section', undefined, 5000);
    const section = sections[0];
    if (!(section && section.innerText.includes('系统正在维护中'))) {
        // 文章选读
        reading(0);
        return;
    }
    log('未找到文章!');
    // 提示
    createTip('未找到文章!');
    // 关闭页面
    handleCloseTaskWin();
}
/**
 * @description 处理视频
 */
async function handleVideo() {
    // videos
    const videos = await $_('video', undefined, 10000);
    // 视频
    const video = videos[0];
    // 播放按键
    const playBtn = $$('.prism-play-btn')[0];
    if (video && playBtn) {
        log('正在尝试播放视频...');
        // 播放超时
        const timeout = setTimeout(() => {
            log('视频播放超时!');
            // 提示
            createTip('视频播放超时!');
            // 关闭页面
            handleCloseTaskWin();
        }, 20000);
        // 设置是否静音
        watchEffect(() => (video.muted = settings[SettingType.VIDEO_MUTED]));
        // 能播放
        video.addEventListener('canplay', () => {
            const timer = setInterval(() => {
                // 尝试点击播放按钮播放
                playBtn.click();
                // 播放未成功
                if (video.paused) {
                    // 尝试使用js的方式播放
                    video.play();
                }
            }, 1000);
            video.addEventListener('playing', () => {
                // 清除超时定时器
                clearTimeout(timeout);
                // 清除定时器
                clearInterval(timer);
                log('播放视频成功!');
                // 视听学习
                reading(1);
                return;
            }, { once: true });
        }, { once: true });
        return;
    }
    log('未找到视频!');
    // 关闭页面
    handleCloseTaskWin();
}
/**
 * @description 读新闻或者看视频
 * @param type :0为新闻,1为视频
 */
async function reading(type) {
    let time = 30;
    // 文章选读
    if (type === 0) {
        // 章节
        const sections = $$('section');
        // 最大字数
        const maxTextCount = Math.max(...sections.map((s) => s.innerText.length), 200);
        // 预计时间
        const predictTime = ~~((60 * maxTextCount) / 1000);
        // min(predictTime,  maxWatch.value) 秒后关闭页面
        time = Math.min(predictTime, maxRead.value);
    }
    // 视听学习
    if (type === 1) {
        // 视频
        const video = $$('video')[0];
        // 预计时间
        const predictTime = ~~video.duration;
        // min(predictTime,  maxWatch.value) 秒后关闭页面
        time = Math.min(predictTime, maxWatch.value);
    }
    // 随机
    time = time - ~~(Math.random() * 10) + 5;
    // 第一次滚动时间
    const firstTime = time - (~~(Math.random() * 4) + 4);
    // 第二次滚动时间
    const secendTime = ~~(Math.random() * 4) + 8;
    // 窗口
    const window = unsafeWindow;
    // 创建提示
    const tip = createTip('距离关闭页面还剩', time, true, async (time) => {
        // 暂停锁
        await studyPauseLock((flag) => {
            if (type === 1) {
                // 视频
                const video = $$('video')[0];
                // 排除反复设置
                if (video.paused === !flag) {
                    return;
                }
                // 设置播放状态
                video[flag ? 'play' : 'pause']();
            }
        });
        // 第一次滚动
        if (time === firstTime) {
            // 滚动
            window.scrollTo(0, 400);
            // 模拟滚动
            const scroll = new Event('scroll', {
                bubbles: true,
            });
            document.dispatchEvent(scroll);
            // 模拟滑动
            const mousemove = new MouseEvent('mousemove', {
                bubbles: true,
            });
            document.dispatchEvent(mousemove);
            // 模拟点击
            const click = new Event('click', {
                bubbles: true,
            });
            document.dispatchEvent(click);
        }
        // 第二次滚动
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
            // 模拟滑动
            const mousemove = new MouseEvent('mousemove', {
                bubbles: true,
            });
            document.dispatchEvent(mousemove);
            // 模拟点击
            const click = new Event('click', {
                bubbles: true,
            });
            document.dispatchEvent(click);
        }
    });
    // 倒计时结束
    await tip.waitCountDown();
    // 关闭任务窗口
    handleCloseTaskWin();
}
/**
 * @description 获取新闻列表
 */
async function getNews() {
    // 需要学习的新闻数量
    const need = taskConfig[TaskType.READ].need < maxNewsNum
        ? taskConfig[TaskType.READ].need
        : maxNewsNum;
    log(`剩余 ${need} 个新闻`);
    // 获取新闻
    const data = await getNewsList();
    if (data && data.length) {
        // 索引
        let i = 0;
        // 最新新闻
        const latestItems = data.slice(0, 100);
        // 当前年份
        const currentYear = new Date().getFullYear().toString();
        // 查找今年新闻
        while (i < need) {
            const randomIndex = ~~(Math.random() * latestItems.length);
            // 新闻
            const item = latestItems[randomIndex];
            // 是否存在
            if (item.publishTime.startsWith(currentYear) && item.type === 'tuwen') {
                news[i] = item;
                i++;
            }
        }
    }
    else {
        news = [];
    }
}
/**
 * @description 获取视频列表
 */
async function getVideos() {
    // 需要学习的视频数量
    const need = taskConfig[TaskType.WATCH].need < maxVideoNum
        ? taskConfig[TaskType.WATCH].need
        : maxVideoNum;
    log(`剩余 ${need} 个视频`);
    // 获取视频
    const data = await getVideoList();
    if (data && data.length) {
        // 索引
        let i = 0;
        // 最新视频
        const latestItems = data.slice(0, 100);
        // 当前年份
        const currentYear = new Date().getFullYear().toString();
        // 查找今年视频
        while (i < need) {
            const randomIndex = ~~(Math.random() * latestItems.length);
            // 新闻
            const item = latestItems[randomIndex];
            // 是否存在
            if (item.publishTime.startsWith(currentYear) &&
                (item.type === 'shipin' || item.type === 'juji')) {
                videos[i] = item;
                i++;
            }
        }
    }
    else {
        videos = [];
    }
}
/**
 * @description 阅读文章
 */
async function readNews() {
    // 获取文章
    await getNews();
    // 观看文章
    for (const i in news) {
        // 任务关闭跳出循环
        if (!taskConfig[TaskType.READ].active) {
            return;
        }
        // 暂停
        await studyPauseLock();
        log(`正在阅读第 ${Number(i) + 1} 个新闻...`);
        // 创建提示
        createTip(`正在阅读第 ${Number(i) + 1} 个新闻`);
        // 链接
        const { url } = news[i];
        // 链接
        GM_setValue('readingUrl', url);
        // 等待任务窗口
        await waitTaskWin(url, '文章选读');
        // 清空链接
        GM_setValue('readingUrl', null);
        // 创建提示
        createTip(`完成阅读第 ${Number(i) + 1} 个新闻!`);
        // 等待一段时间
        await sleep(1500);
        // 刷新分数数据
        await refreshScoreInfo();
        // 刷新任务数据
        await refreshTaskList();
        // 任务完成跳出循环
        if (taskConfig[TaskType.READ].active && taskConfig[TaskType.READ].status) {
            break;
        }
    }
    // 任务关闭跳出循环
    if (!taskConfig[TaskType.READ].active) {
        return;
    }
    // 任务完成状况
    if (taskConfig[TaskType.READ].active && !taskConfig[TaskType.READ].status) {
        log('任务未完成, 继续阅读新闻!');
        // 创建提示
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
        // 任务关闭跳出循环
        if (!taskConfig[TaskType.WATCH].active) {
            return;
        }
        // 暂停
        await studyPauseLock();
        log(`正在观看第 ${Number(i) + 1} 个视频...`);
        // 创建提示
        createTip(`正在观看第 ${Number(i) + 1} 个视频`);
        // 链接
        const { url } = videos[i];
        // 链接
        GM_setValue('watchingUrl', url);
        // 等待任务窗口
        await waitTaskWin(url, '视听学习');
        // 清空链接
        GM_setValue('watchingUrl', null);
        // 创建提示
        createTip(`完成观看第 ${Number(i) + 1} 个视频!`);
        // 等待一段时间
        await sleep(1500);
        // 刷新分数数据
        await refreshScoreInfo();
        // 刷新任务数据
        await refreshTaskList();
        // 任务完成跳出循环
        if (taskConfig[TaskType.WATCH].active &&
            taskConfig[TaskType.WATCH].status) {
            break;
        }
    }
    // 任务关闭跳出循环
    if (!taskConfig[TaskType.WATCH].active) {
        return;
    }
    // 任务完成状况
    if (taskConfig[TaskType.WATCH].active && !taskConfig[TaskType.WATCH].status) {
        log('任务未完成, 继续观看视频!');
        // 创建提示
        createTip('任务未完成, 继续观看看视频!');
        await watchVideo();
    }
}
/**
 * @description 定时刷新定时器
 */
let scheduleTimer = -1;
/**
 * @description 刷新定时任务
 */
async function refreshScheduleTask() {
    // 清除定时刷新
    clearInterval(scheduleTimer);
    // 未登录
    if (!login.value) {
        // 剩余定时任务
        const restList = scheduleList.filter((s) => !isLate(s));
        // 存在剩余任务
        if (restList.length) {
            const rest = restList[0];
            log(`已设置 ${rest.time} 的定时任务!`);
            // 提示
            createTip(`已设置 ${rest.time} 的定时任务!`);
            // 时间
            let time = 0;
            // 刷新间隔
            const interval = 10;
            scheduleTimer = setInterval(() => {
                if (!(time++ % interval)) {
                    log('定时刷新正在运行...');
                }
                // 到达定时
                if (isNow(rest)) {
                    clearInterval(scheduleTimer);
                    log(`执行 ${rest.time} 的定时任务!`);
                    // 提示
                    createTip(`执行 ${rest.time} 的定时任务!`);
                    // 登录
                    handleLogin();
                }
            }, 1000);
        }
    }
}
/**
 * @description 清除定时
 */
function clearScheduleTask() {
    clearInterval(scheduleTimer);
}
/**
 * @description 创建学习提示
 */
function createTip(text, delay = 2, countShow = false, callback) {
    const tipWrap = $$('.egg_tip_wrap')[0];
    // 提前去除
    const tips = $$('.egg_tip');
    if (tips.length) {
        tips.forEach((t) => t.delay());
    }
    // 延迟
    const delayCount = ref(delay);
    // 文字
    const textContent = ref(text);
    //显示
    const show = ref(false);
    // 延迟显示
    const delayShow = ref(false);
    // 销毁
    let destroyed = false;
    // 倒计时结束
    let done = false;
    // 提示
    const tip = Tip({
        text: textContent,
        count: delayCount,
        show,
        delayShow,
        countShow: ref(countShow),
        callback: async (count) => {
            callback && (await callback(count));
            // 恢复显示
            if (delayShow.value && count === delay) {
                delayShow.value = false;
            }
            // 倒计时结束
            if (count <= 0) {
                done = true;
                operate.destroy();
            }
        },
    });
    // 操作
    const operate = {
        destroy() {
            if (!destroyed) {
                // 隐藏
                operate.hide();
                // 销毁
                destroyed = true;
                return new Promise((resolve) => {
                    setTimeout(() => {
                        tip.ele.remove();
                        resolve(undefined);
                    }, 300);
                });
            }
        },
        hide() {
            if (!destroyed) {
                show.value = false;
            }
        },
        show() {
            if (!destroyed) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        show.value = true;
                        resolve(undefined);
                    }, 300);
                });
            }
        },
        setText(text) {
            if (!destroyed) {
                textContent.value = text;
            }
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
        delay() {
            if (!destroyed) {
                delayShow.value = true;
                delayCount.value += 2;
            }
        },
    };
    Object.assign(tip.ele, operate);
    // 插入节点
    mountElement(tip, tipWrap);
    // 显示
    operate.show();
    return operate;
}
/**
 * @description 刷新用户信息
 */
async function refreshUserInfo() {
    // 未登录
    if (!login.value) {
        throw new Error('用户未登录!');
    }
    // 已存在信息
    if (userinfo.nick) {
        return true;
    }
    log('加载用户信息...');
    // 获取用户信息
    const res = await getUserInfo();
    if (res) {
        const { avatarMediaUrl = '', nick: nickRes } = res;
        if (nickRes) {
            // 设置昵称
            userinfo.nick = nickRes;
            // 设置头像
            userinfo.avatar = avatarMediaUrl;
            return true;
        }
    }
    log('加载用户信息失败!');
    return false;
}
/**
 * @description 刷新分数信息
 */
async function refreshScoreInfo() {
    // 未登录
    if (!login.value) {
        throw new Error('用户未登录!');
    }
    log('加载分数信息...');
    // 获取总分
    const totalScoreRes = await getTotalScore();
    // 获取当天总分
    const todayScoreRes = await getTodayScore();
    // 整数值
    if (Number.isInteger(totalScoreRes) && Number.isInteger(todayScoreRes)) {
        // 设置分数
        totalScore.value = totalScoreRes;
        todayScore.value = todayScoreRes;
        return true;
    }
    log('加载分数信息失败!');
    return false;
}
/**
 * @description 刷新任务列表
 */
async function refreshTaskList() {
    // 未登录
    if (!login.value) {
        throw new Error('用户未登录!');
    }
    log('加载任务进度...');
    // 原始任务进度
    const taskProgress = await getTaskList();
    if (taskProgress) {
        // 登录
        taskConfig[TaskType.LOGIN].currentScore = taskProgress[2].currentScore;
        taskConfig[TaskType.LOGIN].dayMaxScore = taskProgress[2].dayMaxScore;
        taskConfig[TaskType.LOGIN].need =
            taskProgress[2].dayMaxScore - taskProgress[2].currentScore;
        // 文章选读
        taskConfig[TaskType.READ].currentScore = taskProgress[0].currentScore;
        taskConfig[TaskType.READ].dayMaxScore = taskProgress[0].dayMaxScore;
        taskConfig[TaskType.READ].need =
            taskProgress[0].dayMaxScore - taskProgress[0].currentScore;
        // 视听学习
        taskConfig[TaskType.WATCH].currentScore = taskProgress[1].currentScore;
        taskConfig[TaskType.WATCH].dayMaxScore = taskProgress[1].dayMaxScore;
        taskConfig[TaskType.WATCH].need =
            taskProgress[1].dayMaxScore - taskProgress[1].currentScore;
        // 每日答题
        taskConfig[TaskType.PRACTICE].currentScore = taskProgress[3].currentScore;
        taskConfig[TaskType.PRACTICE].dayMaxScore = taskProgress[3].dayMaxScore;
        taskConfig[TaskType.PRACTICE].need = taskProgress[3].dayMaxScore;
        // 更新数据
        for (const i in taskConfig) {
            const { currentScore, dayMaxScore } = taskConfig[i];
            // 进度
            const rate = Number(((100 * currentScore) / dayMaxScore).toFixed(1));
            // 分数
            taskConfig[i].score = currentScore;
            // 完成状态
            taskConfig[i].status = rate === 100;
        }
        return;
    }
    // 重试
    await sleep(2000);
    refreshTaskList();
    return;
}
function Tip({ text, count, show, delayShow, countShow, callback, }) {
    return createElementNode('div', undefined, {
        class: watchRef([show, delayShow], () => `egg_tip${show.value ? (delayShow.value ? ' active delay' : ' active') : ''}`),
    }, [
        createElementNode('span', undefined, {
            class: 'egg_text',
        }, createTextNode(text)),
        watchEffectRef(() => countShow.value
            ? createElementNode('span', undefined, {
                class: 'egg_countdown',
            }, createTextNode(watchEffectRef(() => `${count.value}s`)))
            : undefined),
    ], {
        onMounted() {
            // 倒计时
            const countDown = async () => {
                // 倒计时回调
                await callback(count.value);
                // 倒计时结束
                if (!count.value) {
                    show.value = false;
                    return;
                }
                count.value--;
                setTimeout(countDown, 1000);
            };
            countDown();
        },
    });
}
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
function Select({ data, maxlength, placeholder = '', onchange, onblur, value, keep, }) {
    const selectData = reactive(data.map((v) => ({ selected: false, active: false, ele: undefined, ...v })));
    const focus = ref(false);
    const input = shallowRef(undefined);
    const list = shallowRef(undefined);
    const valueRef = ref('');
    value &&
        watch(value, () => {
            const item = selectData.find((v) => v.value === value.value);
            valueRef.value = item ? item.label : '';
            if (!item) {
                selectData.forEach((v) => (v.selected = false));
                list.value && (list.value.scrollTop = 0);
            }
        }, true);
    return createElementNode('div', undefined, {
        class: 'egg_select',
    }, [
        createElementNode('input', { value: valueRef }, {
            class: 'egg_select_input',
            type: 'text',
            placeholder,
            maxlength,
            ref: input,
            onfocus() {
                if (list.value && input.value) {
                    focus.value = true;
                    if (input.value.value && valueRef.value) {
                        const index = selectData.findIndex((v) => v.label === valueRef.value);
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
                        const index = selectData.findIndex((v) => v.label.includes(value));
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
                        onblur(item ? { label: item.label, value: item.value } : undefined);
                }
            },
        }),
        createElementNode('div', undefined, {
            class: watchEffectRef(() => `egg_select_list${focus.value ? '' : ' hide'}`),
            ref: list,
        }, selectData.map((v, index) => createElementNode('div', undefined, {
            class: watchRef(() => [v.selected, v.active], () => `egg_select_item${v.selected ? ' selected' : v.active ? ' active' : ''}`),
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
        }, createTextNode(v.label)))),
    ]);
}
/**
 * @description 答题按钮
 */
function ExamBtn() {
    // 设置初始状态
    watchEffect(() => (examPause.value = !settings[SettingType.AUTO_ANSWER]));
    return createElementNode('button', undefined, {
        class: watchEffectRef(() => `egg_exam_btn${examPause.value ? ' manual' : ''}`),
        type: 'button',
        onclick(e) {
            e.stopPropagation();
            examPause.value = !examPause.value;
        },
        onmousedown(e) {
            e.stopPropagation();
        },
        onmousemove(e) {
            e.stopPropagation();
        },
        onmouseup(e) {
            e.stopPropagation();
        },
        onmouseenter(e) {
            e.stopPropagation();
        },
        onmouseleave(e) {
            e.stopPropagation();
        },
        onmouseover(e) {
            e.stopPropagation();
        },
        ontouchstart(e) {
            e.stopPropagation();
        },
        ontouchmove(e) {
            e.stopPropagation();
        },
        ontouchend(e) {
            e.stopPropagation();
        },
        oninput(e) {
            e.stopPropagation();
        },
        onchange(e) {
            e.stopPropagation();
        },
        onblur(e) {
            e.stopPropagation();
        },
    }, createTextNode(watchEffectRef(() => `${examPause.value ? '开启自动答题' : '关闭自动答题'}`)));
}
/**
 * @description 任务窗口
 * @returns
 */
function Frame() {
    // 最大化
    const max = ref(false);
    // 容器
    return createElementNode('div', undefined, {
        class: watchEffectRef(() => `egg_frame_wrap${frame.show ? '' : ' hide'}`),
        onclick(e) {
            e.stopPropagation();
        },
        onmousedown(e) {
            e.stopPropagation();
        },
        onmousemove(e) {
            e.stopPropagation();
        },
        onmouseup(e) {
            e.stopPropagation();
        },
        onmouseenter(e) {
            e.stopPropagation();
        },
        onmouseleave(e) {
            e.stopPropagation();
        },
        onmouseover(e) {
            e.stopPropagation();
        },
        ontouchstart(e) {
            e.stopPropagation();
        },
        ontouchmove(e) {
            e.stopPropagation();
        },
        ontouchend(e) {
            e.stopPropagation();
        },
        oninput(e) {
            e.stopPropagation();
        },
        onchange(e) {
            e.stopPropagation();
        },
        onblur(e) {
            e.stopPropagation();
        },
    }, watchRef(() => [login.value, settings[SettingType.SAME_TAB]], () => {
        // 同屏任务
        if (login.value && settings[SettingType.SAME_TAB]) {
            return [
                // 遮罩
                createElementNode('div', undefined, { class: 'egg_frame_mask' }),
                // 窗口内容
                createElementNode('div', undefined, {
                    class: watchEffectRef(() => `egg_frame_content_wrap ${max.value ? ' max' : ''}`),
                }, [
                    // 窗口控制
                    createElementNode('div', undefined, { class: 'egg_frame_controls_wrap' }, [
                        // 标题
                        createElementNode('div', undefined, {
                            class: 'egg_frame_title',
                        }),
                        createElementNode('div', undefined, {
                            class: 'egg_frame_controls',
                        }, [
                            // 隐藏
                            createElementNode('button', undefined, {
                                class: 'egg_frame_btn',
                                type: 'button',
                                title: '隐藏',
                                onclick: debounce(() => {
                                    // 隐藏窗口
                                    frame.show = false;
                                }, 300),
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
                                title: '缩放',
                                onclick: debounce(() => {
                                    max.value = !max.value;
                                }, 300),
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
                                title: '关闭',
                                onclick: debounce(() => {
                                    // 关闭窗口
                                    closeFrame();
                                }, 300),
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
                    }, watchEffectRef(() => frame.src
                        ? [
                            createElementNode('iframe', undefined, {
                                class: 'egg_frame',
                                src: frame.src,
                                ref(ele) {
                                    frame.ele = ele;
                                },
                            }, undefined),
                        ]
                        : undefined)),
                ], {
                    onMounted() {
                        // 隐藏窗口
                        watch(() => [
                            taskStatus.value,
                            running.value,
                            settings[SettingType.SAME_TAB],
                            settings[SettingType.SILENT_RUN],
                        ], () => {
                            // 同屏任务
                            if (settings[SettingType.SAME_TAB] &&
                                (taskStatus.value === TaskStatusType.START ||
                                    taskStatus.value === TaskStatusType.PAUSE ||
                                    running.value)) {
                                // 设置窗口显示
                                frame.show = !settings[SettingType.SILENT_RUN];
                            }
                        });
                    },
                }),
            ];
        }
    }), {
        onMounted() {
            // 关闭窗口
            watch(() => [login.value, settings[SettingType.SAME_TAB]], () => {
                if (login.value) {
                    if (settings[SettingType.SAME_TAB]) {
                        frame.exist = true;
                        closeWin();
                    }
                    else {
                        closeFrame();
                        frame.exist = false;
                    }
                }
                else {
                    closeWin();
                    closeFrame();
                    frame.exist = false;
                }
            });
        },
    });
}
/**
 * @description 登录
 */
function LoginItem() {
    return watchEffectRef(() => {
        return login.value
            ? undefined
            : createElementNode('div', undefined, {
                class: 'egg_login_item',
            }, [
                // 登录按钮
                createElementNode('button', undefined, {
                    type: 'button',
                    class: 'egg_login_btn',
                    onclick: debounce(async () => {
                        // 开始登录
                        handleLogin();
                    }, 300),
                }, createTextNode('扫码登录')),
                // 窗口
                createElementNode('div', undefined, {
                    class: watchEffectRef(() => `egg_login_img_wrap${loginQRCodeShow.value ? ' active' : ''}`),
                }, createElementNode('img', undefined, {
                    class: 'egg_login_img',
                })),
            ], {
                onMounted() {
                    watch(() => settings[SettingType.SCHEDULE_RUN], () => {
                        // 未开启定时展示二维码
                        if (!settings[SettingType.SCHEDULE_RUN]) {
                            // 开始登录
                            handleLogin();
                        }
                    }, true);
                },
            });
    });
}
/**
 * @description 信息
 * @returns
 */
function InfoItem() {
    return watchEffectRef(() => {
        if (login.value) {
            return createElementNode('div', undefined, {
                class: 'egg_info_item',
            }, [
                // 用户信息
                createElementNode('div', undefined, { class: 'egg_userinfo' }, [
                    // 头像
                    createElementNode('div', undefined, { class: 'egg_avatar' }, watchEffectRef(() => {
                        return [
                            userinfo.avatar
                                ? createElementNode('img', undefined, {
                                    src: userinfo.avatar,
                                    class: 'egg_avatar_img',
                                })
                                : createElementNode('div', undefined, {
                                    class: 'egg_avatar_nick',
                                }, createTextNode(watchEffectRef(() => userinfo.nick.substring(1, 3)))),
                        ];
                    })),
                    // 昵称
                    createElementNode('div', undefined, { class: 'egg_nick' }, createTextNode(watchEffectRef(() => userinfo.nick))),
                ]),
                // 退出按钮
                createElementNode('button', undefined, {
                    type: 'button',
                    class: 'egg_login_btn',
                    onclick: debounce(() => {
                        // 退出登录
                        handleLogout();
                    }, 300),
                }, createTextNode('退出')),
            ], {
                onMounted() {
                    // 刷新用户信息
                    refreshUserInfo();
                },
            });
        }
    });
}
/**
 * @description 分数详情
 */
function ScoreItem() {
    return watchEffectRef(() => {
        if (login.value) {
            // 分数显示
            const scoreShow = ref(false);
            // 分数信息
            return createElementNode('div', undefined, {
                class: 'egg_score_item',
            }, createElementNode('div', undefined, { class: 'egg_scoreinfo' }, [
                createElementNode('div', undefined, {
                    class: 'egg_totalscore',
                }, [
                    createTextNode('总积分'),
                    createElementNode('span', undefined, undefined, createTextNode(totalScore)),
                ]),
                createElementNode('div', undefined, {
                    class: 'egg_todayscore',
                }, [
                    createElementNode('button', undefined, {
                        type: 'button',
                        class: 'egg_todayscore_btn',
                        title: '查看分数详情',
                        onclick: debounce(() => {
                            scoreShow.value = !scoreShow.value;
                        }, 300),
                        onblur: () => {
                            scoreShow.value = false;
                        },
                    }, [
                        createTextNode('当天分数'),
                        // 当天分数
                        createElementNode('span', undefined, undefined, createTextNode(todayScore)),
                        // icon
                        createNSElementNode('svg', undefined, {
                            viewBox: '0 0 1024 1024',
                            class: 'egg_icon',
                        }, createNSElementNode('path', undefined, {
                            d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
                        })),
                        createElementNode('div', undefined, {
                            class: watchEffectRef(() => `egg_score_details${scoreShow.value ? '' : ' hide'}`),
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
                            ...taskConfig.map((task) => createElementNode('div', undefined, { class: 'egg_score_item' }, [
                                createTextNode(task.title),
                                createElementNode('span', undefined, {
                                    class: 'egg_score_detail',
                                }, createTextNode(watchEffectRef(() => task.score))),
                            ])),
                        ]),
                    ]),
                ]),
            ]), {
                onMounted() {
                    // 刷新分数信息
                    refreshScoreInfo();
                },
            });
        }
    });
}
/**
 * @description 设置普通项
 * @returns
 */
function NormalItem({ title, tip, checked, onchange, }) {
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
            onchange,
        }),
    ]);
}
/**
 * @description 设置任务项
 * @returns
 */
function TaskItem({ title, tip, checked, currentScore, dayMaxScore, onchange, immutable, }) {
    return createElementNode('div', undefined, {
        class: 'egg_task_item',
    }, [
        createElementNode('div', undefined, { class: 'egg_label_wrap' }, [
            createElementNode('div', undefined, { class: 'egg_task_title_wrap' }, [
                createElementNode('div', undefined, { class: 'egg_task_title' }, createTextNode(title)),
                createElementNode('div', undefined, { class: 'egg_task_progress_wrap' }, [
                    createElementNode('div', undefined, {
                        class: 'egg_task_current',
                    }, createTextNode(currentScore)),
                    createElementNode('div', undefined, {
                        class: 'egg_task_max',
                    }, createTextNode(watchEffectRef(() => `/${dayMaxScore.value}`))),
                ]),
            ]),
            createElementNode('div', undefined, { class: 'egg_progress' }, [
                createElementNode('div', undefined, { class: 'egg_track' }, createElementNode('div', undefined, {
                    class: 'egg_bar',
                    style: watchEffectRef(() => `width: ${((100 * currentScore.value) /
                        dayMaxScore.value).toFixed(1)}%;`),
                })),
            ]),
        ]),
        createElementNode('input', undefined, {
            title: tip,
            class: 'egg_switch',
            type: 'checkbox',
            checked,
            onchange,
            disabled: immutable,
        }),
    ]);
}
/**
 * @description 任务
 */
function TaskList() {
    // 处理任务设置变化
    const handleTaskChange = (e, type, title) => {
        // 开关
        const { checked } = e.target;
        if (taskConfig[type].active !== checked) {
            taskConfig[type].active = checked;
            // 设置
            GM_setValue('taskConfig', JSON.stringify(taskConfig));
            // 创建提示
            createTip(`${title} ${checked ? '打开' : '关闭'}!`);
        }
    };
    // 登录加载
    watch(login, async () => {
        if (login.value) {
            // 加载任务列表
            await refreshTaskList();
            // 未完成任务
            if (taskConfig.some((task) => task.active && !task.status)) {
                // 全局暂停
                GM_setValue('pauseStudy', false);
                // 加载完毕
                taskStatus.value = TaskStatusType.LOADED;
                return;
            }
            // 任务完毕
            taskStatus.value = TaskStatusType.FINISH;
        }
    }, true);
    return createElementNode('div', undefined, {
        class: 'egg_task_list',
    }, taskConfig.map((label) => label.immutable
        ? TaskItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => label.active),
            currentScore: watchEffectRef(() => label.currentScore),
            dayMaxScore: watchEffectRef(() => label.dayMaxScore),
            onchange: debounce((e) => {
                handleTaskChange(e, label.type, label.title);
            }, 300),
            immutable: label.immutable,
        })
        : TaskItem({
            title: label.title,
            tip: label.tip,
            checked: watchEffectRef(() => label.active),
            currentScore: watchEffectRef(() => label.currentScore),
            dayMaxScore: watchEffectRef(() => label.dayMaxScore),
            onchange: debounce((e) => {
                handleTaskChange(e, label.type, label.title);
            }, 300),
            immutable: label.immutable,
        })));
}
/**
 * @description 任务按钮
 */
function TaskBtn() {
    return watchEffectRef(() => {
        if (login.value) {
            /**
             * @description 学习
             */
            async function study() {
                // 创建提示
                createTip('开始学习!');
                // 暂停
                await studyPauseLock();
                // 文章选读
                if (taskConfig[TaskType.READ].active &&
                    !taskConfig[TaskType.READ].status) {
                    log('任务一: 文章选读');
                    // 创建提示
                    createTip('任务一: 文章选读');
                    // 暂停
                    await studyPauseLock();
                    // 看新闻
                    await readNews();
                }
                log('任务一: 文章选读已完成!');
                // 视听学习
                if (taskConfig[TaskType.WATCH].active &&
                    !taskConfig[TaskType.WATCH].status) {
                    log('任务二: 视听学习');
                    // 创建提示
                    createTip('任务二: 视听学习');
                    // 暂停
                    await studyPauseLock();
                    // 看视频
                    await watchVideo();
                }
                log('任务二: 视听学习已完成!');
                // 每日答题
                if (taskConfig[TaskType.PRACTICE].active &&
                    !taskConfig[TaskType.PRACTICE].status) {
                    log('任务三: 每日答题');
                    // 创建提示
                    createTip('任务三: 每日答题');
                    // 暂停
                    await studyPauseLock();
                    // 做每日答题
                    await doExamPractice();
                }
                log('任务三: 每日答题已完成!');
            }
            /**
             * @description 暂停任务
             */
            function pauseTask() {
                // 全局暂停
                GM_setValue('pauseStudy', true);
                taskStatus.value = TaskStatusType.PAUSE;
            }
            /**
             * @description 继续任务
             */
            function continueTask() {
                // 全局暂停
                GM_setValue('pauseStudy', false);
                taskStatus.value = TaskStatusType.START;
            }
            /**
             * @description 开始任务
             */
            async function startTask() {
                // 未完成任务
                if (taskConfig.some((task) => task.active && !task.status)) {
                    // 开始任务
                    taskStatus.value = TaskStatusType.START;
                    try {
                        // 学习
                        await study();
                        // 同屏任务
                        if (settings[SettingType.SAME_TAB]) {
                            // 关闭窗口
                            closeFrame();
                            // 窗口不存在
                            frame.exist = false;
                        }
                    }
                    catch (err) {
                        if (err instanceof Error) {
                            // 提示
                            createTip(err.message);
                            // 错误
                            error(err.message);
                            return;
                        }
                        // 提示
                        createTip(String(err));
                        // 错误
                        error(err);
                    }
                }
                // 刷新任务
                taskStatus.value = TaskStatusType.FINISH;
                log('已完成');
                // 创建提示
                createTip('完成学习!');
                // 远程推送
                if (settings[SettingType.REMOTE_PUSH]) {
                    // 推送
                    const res = await pushModal({
                        title: '学习推送',
                        to: userinfo.nick,
                        content: [
                            '学习强国, 学习完成!',
                            `当天积分:  ${getHighlightHTML(todayScore.value)} 分`,
                            `总积分: ${getHighlightHTML(totalScore.value)} 分`,
                            ...taskConfig.map((task) => getProgressHTML(task.title, task.currentScore, task.dayMaxScore)),
                        ],
                        type: 'success',
                    }, pushToken.value);
                    createTip(`学习推送${res ? '成功' : '失败'}!`);
                }
            }
            // 已在等待
            let flag = false;
            // 自动答题
            watch(() => [taskStatus.value, settings[SettingType.AUTO_START]], async () => {
                // 加载完毕
                if (!flag && taskStatus.value === TaskStatusType.LOADED) {
                    // 自动答题
                    if (settings[SettingType.AUTO_START]) {
                        // 等待中
                        flag = true;
                        // 创建提示
                        const tip = createTip('即将自动开始任务', 5, true);
                        // 等待倒计时结束
                        await tip.waitCountDown();
                        // 再次查看是否开启
                        if (settings[SettingType.AUTO_START] &&
                            taskStatus.value !== TaskStatusType.START) {
                            // 创建提示
                            createTip('自动开始任务');
                            // 开始任务
                            startTask();
                            return;
                        }
                        // 取消等待
                        flag = false;
                        // 创建提示
                        createTip('已取消自动开始任务!');
                    }
                }
            });
            // 切换开关任务未完成
            taskConfig.forEach((task) => {
                watch(() => [task.active], () => {
                    if (taskStatus.value === TaskStatusType.FINISH) {
                        if (task.active && !task.status) {
                            taskStatus.value = TaskStatusType.LOADED;
                        }
                    }
                });
            });
            return createElementNode('div', undefined, { class: 'egg_study_item' }, createElementNode('button', undefined, {
                class: watchEffectRef(() => `egg_study_btn${taskStatus.value === TaskStatusType.START ? ' loading' : ''}`),
                type: 'button',
                disabled: watchRef(() => [running.value, taskStatus.value], () => running.value ||
                    taskStatus.value === TaskStatusType.LOADING ||
                    taskStatus.value === TaskStatusType.FINISH),
                onclick: watchEffectRef(() => taskStatus.value === TaskStatusType.LOADED
                    ? debounce(startTask, 300)
                    : taskStatus.value === TaskStatusType.START
                        ? debounce(pauseTask, 300)
                        : taskStatus.value === TaskStatusType.PAUSE
                            ? debounce(continueTask, 300)
                            : undefined),
            }, createTextNode(watchEffectRef(() => `${taskStatus.value === TaskStatusType.LOADING
                ? '等待中'
                : taskStatus.value === TaskStatusType.LOADED
                    ? '开始学习'
                    : taskStatus.value === TaskStatusType.START
                        ? '正在学习, 点击暂停'
                        : taskStatus.value === TaskStatusType.PAUSE
                            ? '继续学习'
                            : taskStatus.value === TaskStatusType.FINISH
                                ? '已完成'
                                : ''}`))));
        }
    });
}
/**
 * @description 定时项目
 * @returns
 */
function ScheduleList() {
    return createElementNode('div', undefined, { class: 'egg_schedule_list' }, watchEffectRef(() => {
        return scheduleList.length
            ? scheduleList.map((schedule) => createElementNode('div', undefined, { class: 'egg_schedule_item' }, [
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
                        onclick: debounce(() => {
                            // 定时刷新
                            if (!settings[SettingType.SCHEDULE_RUN]) {
                                createTip('未开启定时刷新!');
                                return;
                            }
                            // 索引
                            const index = scheduleList.findIndex((s) => s === schedule);
                            // 删除元素
                            scheduleList.splice(index, 1);
                            // 存储
                            GM_setValue('scheduleList', JSON.stringify(scheduleList));
                            // 刷新任务
                            refreshScheduleTask();
                        }, 300),
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
            ]))
            : [
                createElementNode('div', undefined, { class: 'egg_schedule_list_none' }, [
                    createNSElementNode('svg', undefined, {
                        viewBox: '0 0 1024 1024',
                        class: 'egg_icon',
                    }, [
                        createNSElementNode('path', undefined, {
                            d: 'M238.1 520.5c-17.6 0-31.9-14.3-31.9-31.9 0-17.6 14.3-31.9 31.9-31.9h293c17.6 0 31.9 14.3 31.9 31.9 0 17.6-14.3 31.9-31.9 31.9h-293zM238.1 733.6c-17.6 0-31.9-14.3-31.9-31.9s14.3-31.9 31.9-31.9h186.5c17.6 0 31.9 14.3 31.9 31.9s-14.3 31.9-31.9 31.9H238.1zM241.6 314.9c-17.6 0-31.9-14.3-31.9-31.9s14.3-31.9 31.9-31.9h426.1c17.6 0 31.9 14.3 31.9 31.9 0 17.5-14.3 31.7-31.8 31.9H241.6z',
                        }),
                        createNSElementNode('path', undefined, {
                            d: 'M160 926.6c-46.9 0-85.1-38.2-85.1-85.1V149.1c0-46.9 38.2-85.1 85.1-85.1h586c46.9 0 85.1 38.2 85.1 85.1v297.4c0 17.6-14.3 31.9-31.9 31.9-17.6 0-31.9-14.3-31.9-31.9V149.1c0-11.8-9.6-21.4-21.4-21.4H160c-11.8 0-21.4 9.6-21.4 21.4v692.4c0 11.8 9.6 21.4 21.4 21.4h304.5c17.5 0 31.8 14.2 31.9 31.8 0 17.6-14.3 31.8-31.9 31.8H160z',
                        }),
                        createNSElementNode('path', undefined, {
                            d: 'M917.2 959.9c-8.5 0-16.5-3.3-22.5-9.3l-78.5-78.5-5.3-0.5-0.6 0.4c-31.7 21.6-68.7 33-107 33-105.2 0-190.8-85.6-190.8-190.8s85.6-190.8 190.8-190.8c105.2 0 190.8 85.6 190.8 190.8 0 38.2-11.4 75.2-33 107l-0.4 0.6 0.5 5.3 78.5 78.5c6 6 9.3 14 9.3 22.5s-3.4 16.5-9.4 22.5c-5.9 6-13.9 9.3-22.4 9.3zM703.4 587c-70.1 0-127.2 57.1-127.2 127.2s57.1 127.2 127.2 127.2 127.2-57.1 127.2-127.2S773.6 587 703.4 587z',
                        }),
                    ]),
                    createElementNode('div', undefined, {
                        class: 'egg_schedule_list_none_text',
                    }, createTextNode('暂无定时任务')),
                ]),
            ];
    }));
}
/**
 * @description 时间输入
 * @returns
 */
function TimeInput({ hour, minute, onchange, }) {
    // 小时
    const hours = new Array(24).fill(undefined).map((v, i) => ({
        value: i,
        label: formatDateNum(i),
    }));
    // 分钟
    const minutes = new Array(60).fill(undefined).map((v, i) => ({
        value: i,
        label: formatDateNum(i),
    }));
    const valueRef = watchEffectRef(() => {
        const h = hours.find((h) => h.value === hour.value);
        const min = minutes.find((min) => min.value === minute.value);
        return {
            hour: h ? h.value : -1,
            minute: min ? min.value : -1,
        };
    });
    return createElementNode('div', undefined, { class: 'egg_time_input' }, [
        createElementNode('div', undefined, { class: 'egg_hour_wrap' }, [
            Select({
                data: hours,
                placeholder: '00',
                maxlength: 2,
                value: hour,
                onchange({ value }) {
                    valueRef.value.hour = value;
                    onchange && onchange(valueRef.value);
                },
                onblur(res) {
                    if (!res) {
                        valueRef.value.hour = -1;
                        onchange && onchange(valueRef.value);
                    }
                },
            }),
        ]),
        createElementNode('span', undefined, { class: 'egg_separator' }, createTextNode(':')),
        createElementNode('div', undefined, { class: 'egg_minute_wrap' }, [
            Select({
                data: minutes,
                placeholder: '00',
                maxlength: 2,
                value: minute,
                onchange({ value }) {
                    valueRef.value.minute = value;
                    onchange && onchange(valueRef.value);
                },
                onblur(res) {
                    if (!res) {
                        valueRef.value.minute = -1;
                        onchange && onchange(valueRef.value);
                    }
                },
            }),
        ]),
    ]);
}
/**
 * @description 设置面板组件
 * @returns
 */
function SettingsPanel({ show }) {
    // token
    let token = '';
    // 小时
    let hour = ref(-1);
    // 分钟
    let minute = ref(-1);
    return createElementNode('div', undefined, {
        class: watchEffectRef(() => `egg_settings${show.value ? ' active' : ''}`),
    }, [
        createElementNode('div', undefined, { class: 'egg_settings_version_wrap' }, [
            createElementNode('div', undefined, { class: 'egg_settings_label' }, createTextNode('版本信息')),
            createElementNode('div', undefined, {
                class: 'egg_settings_version',
            }, [
                createTextNode(`v${version}`),
                createElementNode('a', undefined, {
                    class: 'egg_settings_version_detail',
                    title: 'GitHub Xu22Web/tech-study-js',
                    href: 'https://github.com/Xu22Web/tech-study-js',
                }, createNSElementNode('svg', undefined, {
                    viewBox: '0 0 16 16',
                    class: 'egg_icon',
                }, createNSElementNode('path', undefined, {
                    d: 'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z',
                }))),
            ]),
        ]),
        createElementNode('div', undefined, { class: 'egg_settings_theme_wrap' }, [
            createElementNode('div', undefined, { class: 'egg_settings_label' }, createTextNode('主题预设')),
            createElementNode('div', undefined, { class: 'egg_settings_theme_colors' }, [
                {
                    value: '#fa3333',
                    title: '强国红',
                    detail: 'XueXi Red',
                    code: 'none',
                },
                {
                    value: '#bb2649',
                    title: '非凡洋红',
                    detail: 'Viva Magenta',
                    code: '18-1750',
                },
                {
                    value: '#35548a',
                    title: '经典蓝',
                    detail: 'Classic Blue',
                    code: '19-4052',
                },
                {
                    value: '#f36f63',
                    title: '活珊瑚橘',
                    detail: 'Living Coral',
                    code: '16-1546',
                },
                {
                    value: '#6d5b97',
                    title: '紫外光色',
                    detail: 'Ultra Violet',
                    code: '18-3838',
                },
                {
                    value: '#86af49',
                    title: '草木绿',
                    detail: 'Greenery',
                    code: '15-0343',
                },
                {
                    value: '#fc8bab',
                    title: 'B站粉',
                    detail: 'Bilibili Pink',
                    code: 'none',
                },
                {
                    value: '#056de8',
                    title: '知乎蓝',
                    detail: 'Zhihu Blue',
                    code: 'none',
                },
            ].map((color) => createElementNode('div', undefined, {
                class: 'egg_settings_theme_color_wrap',
            }, createElementNode('button', undefined, {
                class: 'egg_settings_theme_color',
                type: 'button',
                style: watchEffectRef(() => `color: ${color.value};${themeColor.value === color.value
                    ? ''
                    : ` box-shadow: 0rem 0.4rem 0.1rem 0.1rem ${color.value}30;`}`),
                title: color.title,
                onclick: debounce(() => {
                    if (themeColor.value !== color.value) {
                        themeColor.value = color.value;
                        // 存储
                        GM_setValue('themeColor', themeColor.value);
                    }
                }, 300),
            })))),
        ]),
        createElementNode('div', undefined, {
            class: 'egg_settings_read_time_wrap',
        }, [
            createElementNode('div', undefined, { class: 'egg_settings_label' }, createTextNode('最大文章时长')),
            Select({
                data: [
                    {
                        label: '40s',
                        value: 40,
                    },
                    {
                        label: '60s',
                        value: 60,
                    },
                    {
                        label: '80s',
                        value: 80,
                    },
                    {
                        label: '100s',
                        value: 100,
                    },
                ],
                value: maxRead,
                placeholder: '100s',
                maxlength: 4,
                keep: true,
                onchange({ value }) {
                    // 创建提示
                    createTip('最大文章时长 已保存!');
                    maxRead.value = value;
                    // 存储
                    GM_setValue('maxRead', value);
                },
            }),
        ], {
            onMounted() {
                try {
                    const maxReadTemp = GM_getValue('maxRead');
                    if (maxReadTemp) {
                        maxRead.value = maxReadTemp;
                    }
                }
                catch (e) { }
            },
        }),
        createElementNode('div', undefined, {
            class: 'egg_settings_watch_time_wrap',
        }, [
            createElementNode('div', undefined, { class: 'egg_settings_label' }, createTextNode('最大视听时长')),
            Select({
                data: [
                    {
                        label: '40s',
                        value: 40,
                    },
                    {
                        label: '60s',
                        value: 60,
                    },
                    {
                        label: '80s',
                        value: 80,
                    },
                    {
                        label: '100s',
                        value: 100,
                    },
                    {
                        label: '120s',
                        value: 120,
                    },
                ],
                value: maxWatch,
                placeholder: '120s',
                maxlength: 4,
                keep: true,
                onchange({ value }) {
                    // 创建提示
                    createTip('最大视听时长 已保存!');
                    maxWatch.value = value;
                    // 存储
                    GM_setValue('maxWatch', value);
                },
            }),
        ], {
            onMounted() {
                try {
                    const maxWatchTemp = GM_getValue('maxWatch');
                    if (maxWatchTemp) {
                        maxWatch.value = maxWatchTemp;
                    }
                }
                catch (e) { }
            },
        }),
        watchEffectRef(() => settings[SettingType.REMOTE_PUSH]
            ? createElementNode('div', undefined, { class: 'egg_settings_token_wrap' }, [
                createElementNode('div', undefined, { class: 'egg_settings_token' }, [
                    createElementNode('div', undefined, { class: 'egg_settings_label' }, createTextNode('我的 token')),
                    createElementNode('input', undefined, {
                        class: 'egg_settings_token_input',
                        placeholder: '用户 token',
                        maxlength: 32,
                        value: pushToken.value,
                        onfocus: (e) => {
                            const input = e.target;
                            input.classList.add('active');
                            const btnWrap = $$('.egg_settings_submit_btn_wrap')[0];
                            btnWrap.classList.add('active');
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
                                const btnWrap = $$('.egg_settings_submit_btn_wrap')[0];
                                btnWrap.classList.remove('active');
                                input.value = pushToken.value;
                            }, 200);
                        },
                    }),
                ]),
                createElementNode('div', undefined, { class: 'egg_settings_submit_btn_wrap' }, createElementNode('button', undefined, {
                    class: 'egg_settings_submit_btn',
                    onclick: debounce(() => {
                        // 创建提示
                        createTip('用户 token 已保存!');
                        if (token !== pushToken.value) {
                            pushToken.value = token;
                            // 存储
                            GM_setValue('pushToken', token);
                        }
                    }, 300),
                }, createTextNode('保存'))),
            ])
            : undefined),
        watchEffectRef(() => settings[SettingType.SCHEDULE_RUN]
            ? createElementNode('div', undefined, { class: 'egg_schedule' }, [
                createElementNode('div', undefined, { class: 'egg_schedule_time_wrap' }, [
                    createElementNode('div', undefined, { class: 'egg_schedule_time' }, [
                        createElementNode('div', undefined, { class: 'egg_schedule_label' }, createTextNode('设置时间')),
                        createElementNode('div', undefined, { class: 'egg_schedule_time_input_wrap' }, [
                            TimeInput({
                                hour,
                                minute,
                                onchange({ hour: h, minute: min }) {
                                    hour.value = h;
                                    minute.value = min;
                                },
                            }),
                            createElementNode('button', undefined, {
                                class: 'egg_schedule_add_btn',
                                onclick: debounce(() => {
                                    // 定时刷新
                                    if (!settings[SettingType.SCHEDULE_RUN]) {
                                        createTip('未开启定时刷新!');
                                        return;
                                    }
                                    if (hour.value === -1 || minute.value === -1) {
                                        createTip('时间格式不符合要求!');
                                        return;
                                    }
                                    // 重复定时存在
                                    const exists = scheduleList.find((schedule) => schedule.hour === hour.value &&
                                        schedule.minute === minute.value);
                                    if (exists) {
                                        createTip('设置定时任务重复!');
                                        return;
                                    }
                                    createTip('设置定时任务成功!');
                                    // 添加
                                    scheduleList.push({
                                        hour: hour.value,
                                        minute: minute.value,
                                        time: `${formatDateNum(hour.value)}:${formatDateNum(minute.value)}`,
                                    });
                                    // 排序
                                    scheduleList.sort((a, b) => a.hour === b.hour
                                        ? a.minute - b.minute
                                        : a.hour - b.hour);
                                    // 存储
                                    GM_setValue('scheduleList', JSON.stringify(scheduleList));
                                    // 清空
                                    hour.value = -1;
                                    minute.value = -1;
                                    const inputs = $$('.egg_time_input input');
                                    inputs.forEach((i) => (i.value = ''));
                                    // 刷新任务
                                    refreshScheduleTask();
                                }, 300),
                            }, createNSElementNode('svg', undefined, {
                                viewBox: '0 0 1024 1024',
                                class: 'egg_icon',
                            }, createNSElementNode('path', undefined, {
                                d: 'M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z',
                            }))),
                        ]),
                    ]),
                ]),
                ScheduleList(),
            ])
            : undefined),
    ], {
        onMounted() {
            // 刷新token
            watch(() => settings[SettingType.REMOTE_PUSH], () => {
                // 远程推送
                if (settings[SettingType.REMOTE_PUSH]) {
                    try {
                        const tokenTemp = GM_getValue('pushToken');
                        if (tokenTemp) {
                            pushToken.value = tokenTemp;
                        }
                    }
                    catch (e) { }
                }
            }, true);
            // 刷新定时任务
            watch(() => settings[SettingType.SCHEDULE_RUN], () => {
                // 定时任务打开
                if (settings[SettingType.SCHEDULE_RUN]) {
                    try {
                        const scheduleTemp = JSON.parse(GM_getValue('scheduleList'));
                        if (scheduleTemp && Array.isArray(scheduleTemp)) {
                            for (const i in scheduleTemp) {
                                scheduleList[i] = scheduleTemp[i];
                            }
                        }
                    }
                    catch (e) { }
                    // 刷新定时任务
                    refreshScheduleTask();
                    return;
                }
                // 清除任务
                clearScheduleTask();
            }, true);
        },
    });
}
/**
 * @description 面板
 * @returns
 */
function Panel() {
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
        {
            title: '视频静音',
            tip: '视听学习时，静音播放视频',
            type: SettingType.VIDEO_MUTED,
        },
    ];
    // 运行设置标签
    const examLabels = [
        {
            title: '随机作答',
            tip: '无答案时, 随机选择或者填入答案, 不保证正确',
            type: SettingType.RANDOM_EXAM,
        },
        {
            title: '自动答题',
            tip: '进入答题页面时，自动答题并提交答案',
            type: SettingType.AUTO_ANSWER,
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
    const handleSettingsChange = (e, type, title) => {
        // 开关
        const { checked } = e.target;
        if (settings[type] !== checked) {
            settings[type] = checked;
            // 设置
            GM_setValue('studySettings', JSON.stringify(settings));
            // 创建提示
            createTip(`${title} ${checked ? '打开' : '关闭'}!`);
        }
    };
    // 任务显示
    const scheduleShow = ref(false);
    // 面板显示
    const panelShow = ref(false);
    return createElementNode('div', undefined, {
        class: `egg_panel_wrap${hasMobile() ? ' mobile' : ''}`,
        onclick(e) {
            e.stopPropagation();
        },
        onmousedown(e) {
            e.stopPropagation();
        },
        onmousemove(e) {
            e.stopPropagation();
        },
        onmouseup(e) {
            e.stopPropagation();
        },
        onmouseenter(e) {
            e.stopPropagation();
        },
        onmouseleave(e) {
            e.stopPropagation();
        },
        onmouseover(e) {
            e.stopPropagation();
        },
        ontouchstart(e) {
            e.stopPropagation();
        },
        ontouchmove(e) {
            e.stopPropagation();
        },
        ontouchend(e) {
            e.stopPropagation();
        },
        oninput(e) {
            e.stopPropagation();
        },
        onchange(e) {
            e.stopPropagation();
        },
        onblur(e) {
            e.stopPropagation();
        },
    }, createElementNode('div', undefined, {
        class: watchEffectRef(() => `egg_panel${panelShow.value ? ' hide' : ''}`),
    }, [
        // 登录
        LoginItem(),
        // 信息
        InfoItem(),
        // 分数
        ScoreItem(),
        // 任务部分
        Hr({ text: '任务' }),
        TaskList(),
        // 运行部分
        Hr({ text: '运行' }),
        createElementNode('div', undefined, { class: 'egg_run_list' }, runLabels.map((label) => {
            return NormalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onchange: debounce((e) => {
                    handleSettingsChange(e, label.type, label.title);
                }, 300),
            });
        })),
        // 答题部分
        Hr({ text: '答题' }),
        createElementNode('div', undefined, { class: 'egg_exam_list' }, examLabels.map((label) => {
            return NormalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onchange: debounce((e) => {
                    handleSettingsChange(e, label.type, label.title);
                }, 300),
            });
        })),
        // 推送部分
        Hr({ text: '推送' }),
        createElementNode('div', undefined, { class: 'egg_push_list' }, pushLabels.map((label) => {
            return NormalItem({
                title: label.title,
                tip: label.tip,
                checked: settings[label.type],
                onchange: debounce((e) => {
                    handleSettingsChange(e, label.type, label.title);
                }, 300),
            });
        })),
        // 提示部分
        Hr({ text: '提示' }),
        createElementNode('div', undefined, { class: 'egg_tip_list' }, watchRef(login, () => login.value
            ? [
                createTextNode('专项练习已被移除, 如需使用, 请点击'),
                createElementNode('button', undefined, {
                    class: 'egg_tip_btn',
                    type: 'button',
                    onclick: debounce(doExamPaper, 300),
                    disabled: watchRef(() => [running.value, taskStatus.value], () => running.value ||
                        taskStatus.value === TaskStatusType.START ||
                        taskStatus.value === TaskStatusType.PAUSE),
                }, createTextNode('去完成')),
            ]
            : [
                createElementNode('div', undefined, { class: 'egg_tip_content' }, createTextNode('请先登录!')),
            ])),
        // 按钮集合
        createElementNode('div', undefined, {
            class: 'egg_btns_wrap',
        }, [
            createElementNode('button', undefined, {
                class: watchRef(() => [frame.exist, frame.show], () => `egg_frame_show_btn${!frame.exist || frame.show ? ' hide' : ''}`),
                title: '窗口',
                type: 'button',
                onclick: debounce(() => {
                    // 窗口显示
                    frame.show = true;
                }, 300),
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, createNSElementNode('path', undefined, {
                d: 'M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z',
            }))),
            createElementNode('button', undefined, {
                class: 'egg_panel_show_btn',
                title: '面板',
                type: 'button',
                onclick: debounce(() => {
                    panelShow.value = !panelShow.value;
                }, 300),
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, createNSElementNode('path', undefined, {
                d: 'M332.16 883.84a40.96 40.96 0 0 0 58.24 0l338.56-343.04a40.96 40.96 0 0 0 0-58.24L390.4 140.16a40.96 40.96 0 0 0-58.24 58.24L640 512l-307.84 314.24a40.96 40.96 0 0 0 0 57.6z',
            }))),
            createElementNode('button', undefined, {
                class: watchEffectRef(() => `egg_settings_show_btn${scheduleShow.value ? ' active' : ''}`),
                title: '设置',
                type: 'button',
                onclick: debounce(() => {
                    scheduleShow.value = !scheduleShow.value;
                }, 300),
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, [
                createNSElementNode('path', undefined, {
                    d: 'M7.25325 705.466473a503.508932 503.508932 0 0 0 75.26742 121.391295 95.499302 95.499302 0 0 0 93.211173 31.07039 168.59902 168.59902 0 0 1 114.526906 16.257763 148.487566 148.487566 0 0 1 71.052444 83.456515 91.163899 91.163899 0 0 0 75.989987 61.538643 578.053784 578.053784 0 0 0 148.969278 0A91.163899 91.163899 0 0 0 662.380873 957.642436a148.487566 148.487566 0 0 1 72.256723-83.456515 168.59902 168.59902 0 0 1 114.406478-16.257763 95.61973 95.61973 0 0 0 93.331601-31.07039 503.508932 503.508932 0 0 0 75.267419-121.391295 84.29951 84.29951 0 0 0-18.545892-94.897163 138.251197 138.251197 0 0 1 0-197.140426 84.29951 84.29951 0 0 0 18.545892-94.897163 503.508932 503.508932 0 0 0-75.869559-121.391295 95.499302 95.499302 0 0 0-93.211173-31.070391A168.59902 168.59902 0 0 1 734.637596 149.812272a148.848849 148.848849 0 0 1-72.256723-83.456515A91.163899 91.163899 0 0 0 586.631741 4.817115a581.907476 581.907476 0 0 0-148.969277 0A91.163899 91.163899 0 0 0 361.311193 66.355757a148.848849 148.848849 0 0 1-71.413728 83.456515 168.59902 168.59902 0 0 1-114.406478 16.257763 95.378874 95.378874 0 0 0-93.3316 31.070391A503.508932 503.508932 0 0 0 7.25325 318.531721a84.29951 84.29951 0 0 0 18.545893 94.897163 140.057615 140.057615 0 0 1 41.30676 98.509999 140.057615 140.057615 0 0 1-41.30676 98.630427A84.29951 84.29951 0 0 0 7.25325 705.466473z m929.462315-349.240828a219.901294 219.901294 0 0 0 0 312.028615c0.842995 0.842995 2.649413 3.010697 1.806418 5.057971a427.398517 427.398517 0 0 1-63.104205 101.520696 9.513802 9.513802 0 0 1-9.032091 2.167702 255.547944 255.547944 0 0 0-173.777418 24.928569 231.823653 231.823653 0 0 0-111.275354 130.302957 6.984817 6.984817 0 0 1-6.021394 4.937543 492.790851 492.790851 0 0 1-126.328837 0 6.984817 6.984817 0 0 1-6.021394-4.937543 231.823653 231.823653 0 0 0-111.275353-130.302957 255.668372 255.668372 0 0 0-120.427872-30.468252 258.919924 258.919924 0 0 0-52.747408 5.539683 9.513802 9.513802 0 0 1-9.03209-2.167702 427.398517 427.398517 0 0 1-63.104205-101.520696c-0.842995-2.047274 0.963423-4.214976 1.806418-5.057971a221.82814 221.82814 0 0 0 64.910623-156.556233 221.707712 221.707712 0 0 0-65.512762-155.713238c-0.842995-0.842995-2.649413-3.010697-1.806418-5.057971a427.398517 427.398517 0 0 1 63.104205-101.520696 9.393374 9.393374 0 0 1 8.911662-2.167701 255.7888 255.7888 0 0 0 173.897847-24.92857 231.823653 231.823653 0 0 0 111.275353-130.302957 6.984817 6.984817 0 0 1 6.021394-4.937543 492.790851 492.790851 0 0 1 126.328837 0 6.984817 6.984817 0 0 1 6.021394 4.937543 231.823653 231.823653 0 0 0 111.275354 130.302957 255.547944 255.547944 0 0 0 173.777418 24.92857 9.513802 9.513802 0 0 1 9.032091 2.167701 423.063113 423.063113 0 0 1 62.983777 101.520696c0.963423 2.047274-0.842995 4.214976-1.68599 5.057971z',
                }),
                createNSElementNode('path', undefined, {
                    d: 'M512.086889 305.766366a206.292944 206.292944 0 1 0 206.172516 206.172517 206.413372 206.413372 0 0 0-206.172516-206.172517z m123.197713 206.172517a123.197713 123.197713 0 1 1-123.197713-123.077285 123.318141 123.318141 0 0 1 123.197713 123.077285z',
                }),
            ])),
            createElementNode('button', undefined, {
                class: 'egg_settings_reset_btn',
                title: '重置',
                type: 'button',
                onclick: debounce(() => {
                    // 任务配置
                    GM_setValue('taskConfig', null);
                    // 设置
                    GM_setValue('studySettings', null);
                    // 最大阅读
                    GM_setValue('maxRead', null);
                    // 最大观看
                    GM_setValue('maxWatch', null);
                    // 主题色
                    GM_setValue('themeColor', null);
                    // 刷新页面
                    location.reload();
                }, 300),
            }, createNSElementNode('svg', undefined, {
                viewBox: '0 0 1024 1024',
                class: 'egg_icon',
            }, [
                createNSElementNode('path', undefined, {
                    d: 'M943.8 484.1c-17.5-13.7-42.8-10.7-56.6 6.8-5.7 7.3-8.5 15.8-8.6 24.4h-0.4c-0.6 78.3-26.1 157-78 223.3-124.9 159.2-356 187.1-515.2 62.3-31.7-24.9-58.2-54-79.3-85.9h77.1c22.4 0 40.7-18.3 40.7-40.7v-3c0-22.4-18.3-40.7-40.7-40.7H105.5c-22.4 0-40.7 18.3-40.7 40.7v177.3c0 22.4 18.3 40.7 40.7 40.7h3c22.4 0 40.7-18.3 40.7-40.7v-73.1c24.2 33.3 53 63.1 86 89 47.6 37.3 101 64.2 158.9 79.9 55.9 15.2 113.5 19.3 171.2 12.3 57.7-7 112.7-24.7 163.3-52.8 52.5-29 98-67.9 135.3-115.4 37.3-47.6 64.2-101 79.9-158.9 10.2-37.6 15.4-76 15.6-114.6h-0.1c-0.3-11.6-5.5-23.1-15.5-30.9zM918.7 135.2h-3c-22.4 0-40.7 18.3-40.7 40.7V249c-24.2-33.3-53-63.1-86-89-47.6-37.3-101-64.2-158.9-79.9-55.9-15.2-113.5-19.3-171.2-12.3-57.7 7-112.7 24.7-163.3 52.8-52.5 29-98 67.9-135.3 115.4-37.3 47.5-64.2 101-79.9 158.8-10.2 37.6-15.4 76-15.6 114.6h0.1c0.2 11.7 5.5 23.2 15.4 30.9 17.5 13.7 42.8 10.7 56.6-6.8 5.7-7.3 8.5-15.8 8.6-24.4h0.4c0.6-78.3 26.1-157 78-223.3 124.9-159.2 356-187.1 515.2-62.3 31.7 24.9 58.2 54 79.3 85.9h-77.1c-22.4 0-40.7 18.3-40.7 40.7v3c0 22.4 18.3 40.7 40.7 40.7h177.3c22.4 0 40.7-18.3 40.7-40.7V175.8c0.1-22.3-18.2-40.6-40.6-40.6z',
                }),
            ])),
        ]),
        // 任务按钮
        TaskBtn(),
        createElementNode('div', undefined, { class: 'egg_settings_item' }, [
            SettingsPanel({ show: scheduleShow }),
        ]),
    ]));
}
