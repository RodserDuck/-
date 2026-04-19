// pages/college/college.js
var { getCollegeNoticeList } = require('../../utils/request.js');

Page({
  data: {
    collegeName: '学院广场',
    college: '',
    notices: [],
    loading: false
  },

  onLoad(options) {
    // 根据 URL 参数决定跳转哪个 tab
    var tab = options && options.tab;
    if (tab === 'notice') {
      // 来自校园广场的"校园公告"入口，不传 college 参数，展示全部通知
    }
    this.refreshCollege();
  },

  refreshCollege() {
    var userInfo = wx.getStorageSync('userInfo');
    var college = userInfo && userInfo.college ? userInfo.college : '';
    this.setData({
      collegeName: college || '学院广场',
      college: college
    });
    this.loadNotices(college);
  },

  loadNotices(college) {
    var self = this;
    self.setData({ loading: true });
    getCollegeNoticeList(1, 50, college)
      .then(function(page) {
        var notices = (page.records || []).map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            time: n.createTime ? n.createTime.substring(0, 10) : ''
          };
        });
        self.setData({ notices: notices, loading: false });
      })
      .catch(function() {
        self.setData({ notices: [], loading: false });
      });
  },

  onBack() {
    wx.navigateBack();
  },

  onViewDetail(e) {
    wx.navigateTo({ url: '/pages/college-activity-detail/college-activity-detail?id=' + e.currentTarget.dataset.id });
  }
});
