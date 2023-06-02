import API_CONFIG from '../config/api';
/* 数据 API */

/**
 * @description 新闻列表
 */
type NewsVideoList = {
  publishTime: string;
  title: string;
  type: string;
  url: string;
  showSource: string;
  auditTime: string;
  dataValid: boolean;
  itemType: string;
}[];

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
      const data = <NewsVideoList>await res.json();
      return data;
    }
  } catch (err) {}
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
      const data = <NewsVideoList>await res.json();
      return data;
    }
  } catch (err) {}
}

/**
 * @description 专项练习数据
 */
async function getExamPaper(pageNo: number) {
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
      const paperJson = decodeURIComponent(
        escape(window.atob(data.data_str.replace(/-/g, '+').replace(/_/g, '/')))
      );
      // JSON格式化
      const paper = JSON.parse(paperJson);
      return paper;
    }
  } catch (err) {
    return [];
  }
  return [];
}

export { getVideoList, getNewsList, getExamPaper };
