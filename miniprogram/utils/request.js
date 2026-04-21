/**
 * 统一请求工具
 * 自动携带 JWT Token，自动处理错误提示
 * 线上请将 baseUrl 改为实际域名
 */

// 站点根（真机请改为电脑局域网 IP，并在微信公众平台配置 downloadFile 合法域名）
const API_ORIGIN = 'http://localhost:8080';
const BASE_URL = API_ORIGIN + '/api';

/**
 * 将库中路径转为带 http(s) 的完整 URL。
 * 微信 <image> 若 src 为 /uploads/... 会当作包内本地路径，必须用 http(s):// 完整地址。
 */
function resolveMediaUrl(path) {
  if (path === null || path === undefined) return '';
  const p = String(path).trim();
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  let rel = p.startsWith('/') ? p : `/${p}`;
  while (rel.startsWith('/api')) {
    rel = rel.substring(4);
    if (!rel.startsWith('/')) rel = `/${rel}`;
  }
  return API_ORIGIN + '/api' + rel;
}

/**
 * 公告 images 字段：JSON 数组字符串、已是数组、或单路径字符串 → 转为完整网络图 URL 列表
 */
function parseNoticeImages(raw) {
  if (raw === null || raw === undefined) return [];
  if (Array.isArray(raw)) {
    return raw.map(String).map(resolveMediaUrl).filter(Boolean);
  }
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return [];
    try {
      const v = JSON.parse(s);
      if (Array.isArray(v)) return v.map(String).map(resolveMediaUrl).filter(Boolean);
      if (v) return [resolveMediaUrl(String(v))];
    } catch (e) {
      return [resolveMediaUrl(s)];
    }
  }
  return [];
}

/**
 * 上传单张图片到服务器（category: user | goods | post | lostfound | club | activity | notice）
 */
function uploadImageFile(filePath, category) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      reject(new Error('未登录'));
      return;
    }
    wx.uploadFile({
      url: `${BASE_URL}/upload`,
      filePath,
      name: 'file',
      formData: { category: String(category) },
      header: { Authorization: `Bearer ${token}` },
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '上传失败', icon: 'none' });
          reject(res);
          return;
        }
        try {
          const result = JSON.parse(res.data);
          if (result.code === 200 && result.data && result.data.url) {
            resolve(result.data.url);
          } else {
            wx.showToast({ title: result.msg || '上传失败', icon: 'none' });
            reject(result);
          }
        } catch (e) {
          reject(e);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}

/** 并行上传多张，返回相对路径数组 */
function uploadImageFiles(filePaths, category) {
  if (!filePaths || filePaths.length === 0) return Promise.resolve([]);
  return Promise.all(filePaths.map((fp) => uploadImageFile(fp, category)));
}

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
const userLogin = (studentNo, password) =>
  request('/user/login', { studentNo, password }, 'POST', true);

// 微信登录（兼容旧接口）
const userWxLogin = (openid, username) =>
  request('/user/wx-login', { openid, username }, 'POST', true);

// 用户注册
const userRegister = (data) =>
  request('/user/register', data, 'POST', true);

// 获取学院列表
const getCollegeList = () =>
  request('/college/list', {}, 'GET', false);

const getUserInfo = () =>
  request('/user/info', {}, 'GET', false);

const updateUser = (data) =>
  request('/user/update', data, 'PUT', true);

// 修改密码
const changePassword = (oldPassword, newPassword) =>
  request('/user/password', { oldPassword, newPassword }, 'PUT', true);

// 通知公告
const getNoticeList = (pageNum = 1, pageSize = 10) =>
  request(`/notice/list?pageNum=${pageNum}&pageSize=${pageSize}`, {}, 'GET', false);

const getNoticeTop = () =>
  request('/notice/top', {}, 'GET', false);

const getNoticeDetail = (id) =>
  request(`/notice/detail/${id}`, {}, 'GET', false);

const getCollegeNoticeDetail = (id) =>
  request(`/college-notice/detail/${id}`, {}, 'GET', false);

// 学院公告
const getCollegeNoticeList = (pageNum = 1, pageSize = 10, college = '', keyword = '') => {
  let url = `/college-notice/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (college) url += `&college=${encodeURIComponent(college)}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

// 帖子
const getPostList = (pageNum = 1, pageSize = 10, category = '', keyword = '') => {
  let url = `/post/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

const getPostDetail = (id) =>
  request(`/post/detail/${id}`, {}, 'GET', false);

const publishPost = (data) =>
  request('/post/publish', data, 'POST', true);

const deletePost = (id) =>
  request(`/post/${id}`, {}, 'DELETE', true);

const likePost = (id) =>
  request(`/post/like/${id}`, {}, 'POST', true);

const unlikePost = (id) =>
  request(`/post/unlike/${id}`, {}, 'POST', true);

// 评论
const getCommentList = (postId) =>
  request(`/comment/list/${postId}`, {}, 'GET', false);

const saveComment = (data) =>
  request('/comment/save', data, 'POST', true);

const deleteComment = (id) =>
  request(`/comment/${id}`, {}, 'DELETE', true);

// 社团
const getClubList = () =>
  request('/club/list', {}, 'GET', false);

/** 社团分页：category 可选，keyword 按社团名称/简介搜索 */
const getClubPage = (pageNum = 1, pageSize = 20, category = '', keyword = '') => {
  let url = `/club/page?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

const getClubDetail = (id) =>
  request(`/club/detail/${id}`, {}, 'GET', false);

const getMyClubs = () =>
  request('/club/my', {}, 'GET', false);

const joinClub = (id) =>
  request(`/club/join/${id}`, {}, 'POST', true);

const leaveClub = (id) =>
  request(`/club/leave/${id}`, {}, 'POST', true);

const createClub = (data) =>
  request('/club/save', data, 'POST', true);

// 社团成员申请状态查询
const getMyClubStatus = () =>
  request('/club/my-status', {}, 'GET', false);

// 活动
const getActivityList = () =>
  request('/activity/list', {}, 'GET', false);

const getActivityDetail = (id) =>
  request(`/activity/detail/${id}`, {}, 'GET', false);

const getClubActivities = (clubId) =>
  request(`/activity/club/${clubId}`, {}, 'GET', false);

const registerActivity = (id) =>
  request(`/activity/register/${id}`, {}, 'POST', true);

const cancelActivity = (id) =>
  request(`/activity/cancel/${id}`, {}, 'POST', true);

// 二手商品
const getGoodsList = () =>
  request('/second-hand/list', {}, 'GET', false);

const getGoodsPage = (pageNum = 1, pageSize = 20, categoryId = '', keyword = '') => {
  let url = `/second-hand/page?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

const getGoodsDetail = (id) =>
  request(`/second-hand/detail/${id}`, {}, 'GET', false);

const publishGoods = (data) =>
  request('/second-hand/publish', data, 'POST', true);

const deleteGoods = (id) =>
  request(`/second-hand/${id}`, {}, 'DELETE', true);

const getMyGoods = () =>
  request('/second-hand/my', {}, 'GET', false);

// 我的闲置 - 更新（仅本人可改）
const updateMyGoods = (id, data) =>
  request(`/second-hand/${id}`, data, 'PUT', true);

// 我的闲置 - 上/下架（仅本人可改）
const updateMyGoodsStatus = (id, status) =>
  request(`/second-hand/${id}/status?status=${status}`, {}, 'PUT', true);

// 失物招领
const getLostFoundList = (pageNum = 1, pageSize = 10, type = '', status = '', keyword = '') => {
  let url = `/lost-found/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  if (type) url += `&type=${type}`;
  if (status !== '' && status !== null && status !== undefined) url += `&status=${status}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  return request(url, {}, 'GET', false);
};

const getLostFoundDetail = (id) =>
  request(`/lost-found/detail/${id}`, {}, 'GET', false);

const saveLostFound = (data) =>
  request('/lost-found/save', data, 'POST', true);

const updateLostFoundStatus = (id, status) =>
  request(`/lost-found/status/${id}?status=${status}`, {}, 'PUT', true);

const submitLostFoundClaim = (id, remark = '') =>
  request(`/lost-found/claim/${id}?remark=${encodeURIComponent(remark || '')}`, {}, 'POST', true);

// 分类
const getCategoryList = (type = 'goods') =>
  request(`/category/list?type=${type}`, {}, 'GET', false);

// 交易记录
const createTrade = (itemId, remark) =>
  request('/trade/create', { itemId, remark }, 'POST', true);

const confirmTrade = (recordId) =>
  request(`/trade/confirm/${recordId}`, {}, 'POST', true);

const cancelTrade = (recordId) =>
  request(`/trade/cancel/${recordId}`, {}, 'POST', true);

const getMyBuy = () =>
  request('/trade/my-buy', {}, 'GET', false);

const getMySell = () =>
  request('/trade/my-sell', {}, 'GET', false);

const getPendingTrade = () =>
  request('/trade/pending', {}, 'GET', false);

// 我的帖子
const getMyPosts = () =>
  request('/post/my', {}, 'GET', false);

// 我的活动报名
const getMyActivities = () =>
  request('/activity/my', {}, 'GET', false);

// 微信小程序环境普遍使用 require，需导出 CommonJS（仅用 export 时 require 得到空对象）
module.exports = {
  API_ORIGIN,
  BASE_URL,
  resolveMediaUrl,
  parseNoticeImages,
  uploadImageFile,
  uploadImageFiles,
  request,
  userLogin,
  userWxLogin,
  userRegister,
  getCollegeList,
  getUserInfo,
  updateUser,
  changePassword,
  getNoticeList,
  getNoticeTop,
  getNoticeDetail,
  getCollegeNoticeDetail,
  getCollegeNoticeList,
  getPostList,
  getPostDetail,
  publishPost,
  deletePost,
  likePost,
  unlikePost,
  getCommentList,
  saveComment,
  deleteComment,
  getClubList,
  getClubPage,
  getClubDetail,
  getMyClubs,
  joinClub,
  leaveClub,
  createClub,
  getMyClubStatus,
  getActivityList,
  getActivityDetail,
  getClubActivities,
  registerActivity,
  cancelActivity,
  getGoodsList,
  getGoodsPage,
  getGoodsDetail,
  publishGoods,
  deleteGoods,
  getMyGoods,
  updateMyGoods,
  updateMyGoodsStatus,
  getLostFoundList,
  getLostFoundDetail,
  saveLostFound,
  updateLostFoundStatus,
  submitLostFoundClaim,
  getCategoryList,
  createTrade,
  confirmTrade,
  cancelTrade,
  getMyBuy,
  getMySell,
  getPendingTrade,
  getMyPosts,
  getMyActivities
};
