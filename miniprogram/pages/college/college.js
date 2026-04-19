// pages/college/college.js
var { getCollegeNoticeList } = require('../../utils/request.js');

Page({
  data: {
    currentTab: 0,
    colleges: [
      { id: 1, name: '计算机学院', icon: '💻', color: '#3b82f6' },
      { id: 2, name: '经济管理学院', icon: '📊', color: '#10b981' },
      { id: 3, name: '外国语学院', icon: '🌍', color: '#f59e0b' },
      { id: 4, name: '机械工程学院', icon: '⚙️', color: '#6366f1' },
      { id: 5, name: '文学与传媒学院', icon: '📖', color: '#ec4899' },
      { id: 6, name: '数学与统计学院', icon: '📐', color: '#8b5cf6' },
      { id: 7, name: '艺术学院', icon: '🎨', color: '#f43f5e' },
      { id: 8, name: '体育学院', icon: '⚽', color: '#14b8a6' }
    ],
    notices: [],
    activities: []
  },

  onLoad() {
    this.loadNotices();
  },

  loadNotices() {
    var self = this;
    getCollegeNoticeList(1, 50)
      .then(function(page) {
        var records = page.records || [];
        var notices = records.map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            college: n.college || '',
            time: n.createTime ? n.createTime.substring(0, 10) : ''
          };
        });
        self.setData({ notices: notices });
      })
      .catch(function() {});
  },

  onTabChange(e) {
    this.setData({ currentTab: parseInt(e.currentTarget.dataset.index) });
  },

  onCollegeTap(e) {
    var college = this.data.colleges.find(function(c) { return c.id === e.currentTarget.dataset.id; });
    wx.showToast({ title: '进入' + (college ? college.name : ''), icon: 'none' });
  },

  onViewDetail(e) {
    wx.navigateTo({ url: '/pages/college-activity-detail/college-activity-detail?id=' + e.currentTarget.dataset.id });
  }
});
