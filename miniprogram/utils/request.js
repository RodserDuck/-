/**
 * 统一请求工具
 * 自动携带 JWT Token，自动处理错误提示
 * 线上请将 baseUrl 改为实际域名
 */

// 开发环境：本地电脑用 localhost，真机调试用电脑IP（如 192.168.x.x）
const BASE_URL = 'http://localhost:8080/api';

/**
 * 发起请求
 * @param {string} url     接口路径（自动拼接 BASE_URL）
 * @param {object} data    POST 请求体
 * @param {string} method  GET | POST | PUT | DELETE，默认 POST
 * @param {boolean} showLoading 是否显示 loading，默认 true
 */
function request(url, data = {}, method = 'POST', showLoading = true) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({ title: '加载中...', mask: true });
    }

    const header = {
      'Content-Type': 'application/json',
    };

    // 带上 Token
    const token = wx.getStorageSync('token');
    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }

    wx.request({
      url: BASE_URL + url,
      data,
      method,
      header,
      success(res) {
        if (showLoading) wx.hideLoading();

        if (res.statusCode === 200) {
          const result = res.data;
          if (result.code === 200) {
            resolve(result.data);
          } else {
            wx.showToast({ title: result.msg || '请求失败', icon: 'none', duration: 2000 });
            reject(result);
          }
        } else if (res.statusCode === 401) {
          // Token 过期，清除登录状态跳转登录页
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('isLoggedIn');
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 });
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
          }, 2000);
          reject(res);
        } else {
          wx.showToast({ title: '网络错误', icon: 'none' });
          reject(res);
        }
      },
      fail(err) {
        if (showLoading) wx.hideLoading();
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

// ==================== 各模块 API ====================

// 用户模块
// 学号+密码登录
export const userLogin = (studentNo, password) =>
  request('/user/login', { studentNo, password }, 'POST', true);

// 微信登录（兼容旧接口）
export const userWxLogin = (openid, username) =>
  request('/user/wx-login', { openid, username }, 'POST', true);

// 用户注册
export const userRegister = (data) =>
  request('/user/register', data, 'POST', true);

// 获取学院列表
export const getCollegeList = () =>
  request('/college/list', {}, 'GET', false);

export const getUserInfo = () =>
  request('/user/info', {}, 'GET', false);

export const updateUser = (data) =>
  request('/user/update', data, 'PUT', true);

// 通知公告
export const getNoticeList = (pageNum = 1, pageSize = 10) =>
  request(`/notice/list?pageNum=${pageNum}&pageSize=${pageSize}`, {}, 'GET', false);

export const getNoticeTop = () =>
  request('/notice/top', {}, 'GET', false);

export const getNoticeDetail = (id) =>
  request(`/notice/detail/${id}`, {}, 'GET', false);

// 学院公告
export const getCollegeNoticeList = (pageNum = 1, pageSize = 10, college = '') => {
  let url = `/college-notice/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (college) url += `&college=${encodeURIComponent(college)}`;
  return request(url, {}, 'GET', false);
};

// 帖子
export const getPostList = (pageNum = 1, pageSize = 10, category = '', keyword = '') => {
  let url = `/post/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

export const getPostDetail = (id) =>
  request(`/post/detail/${id}`, {}, 'GET', false);

export const publishPost = (data) =>
  request('/post/publish', data, 'POST', true);

export const deletePost = (id) =>
  request(`/post/${id}`, {}, 'DELETE', true);

export const likePost = (id) =>
  request(`/post/like/${id}`, {}, 'POST', true);

export const unlikePost = (id) =>
  request(`/post/unlike/${id}`, {}, 'POST', true);

// 评论
export const getCommentList = (postId) =>
  request(`/comment/list/${postId}`, {}, 'GET', false);

export const saveComment = (data) =>
  request('/comment/save', data, 'POST', true);

export const deleteComment = (id) =>
  request(`/comment/${id}`, {}, 'DELETE', true);

// 社团
export const getClubList = () =>
  request('/club/list', {}, 'GET', false);

export const getClubDetail = (id) =>
  request(`/club/detail/${id}`, {}, 'GET', false);

export const getMyClubs = () =>
  request('/club/my', {}, 'GET', false);

export const joinClub = (id) =>
  request(`/club/join/${id}`, {}, 'POST', true);

export const leaveClub = (id) =>
  request(`/club/leave/${id}`, {}, 'POST', true);

export const createClub = (data) =>
  request('/club/save', data, 'POST', true);

// 活动
export const getActivityList = () =>
  request('/activity/list', {}, 'GET', false);

export const getActivityDetail = (id) =>
  request(`/activity/detail/${id}`, {}, 'GET', false);

export const getClubActivities = (clubId) =>
  request(`/activity/club/${clubId}`, {}, 'GET', false);

export const registerActivity = (id) =>
  request(`/activity/register/${id}`, {}, 'POST', true);

export const cancelActivity = (id) =>
  request(`/activity/cancel/${id}`, {}, 'POST', true);

// 二手商品
export const getGoodsList = () =>
  request('/second-hand/list', {}, 'GET', false);

export const getGoodsPage = (pageNum = 1, pageSize = 20, categoryId = '') => {
  let url = `/second-hand/page?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  return request(url, {}, 'GET', false);
};

export const getGoodsDetail = (id) =>
  request(`/second-hand/detail/${id}`, {}, 'GET', false);

export const publishGoods = (data) =>
  request('/second-hand/publish', data, 'POST', true);

export const deleteGoods = (id) =>
  request(`/second-hand/${id}`, {}, 'DELETE', true);

export const getMyGoods = () =>
  request('/second-hand/my', {}, 'GET', false);

// 失物招领
export const getLostFoundList = (pageNum = 1, pageSize = 10, type = '') => {
  let url = `/lost-found/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (type) url += `&type=${type}`;
  return request(url, {}, 'GET', false);
};

export const getLostFoundDetail = (id) =>
  request(`/lost-found/detail/${id}`, {}, 'GET', false);

export const saveLostFound = (data) =>
  request('/lost-found/save', data, 'POST', true);

export const updateLostFoundStatus = (id, status) =>
  request(`/lost-found/status/${id}?status=${status}`, {}, 'PUT', true);

// 分类
export const getCategoryList = (type = 'goods') =>
  request(`/category/list?type=${type}`, {}, 'GET', false);
