// pages/college/college.js
var { getCollegeNoticeList } = require('../../utils/request.js');

Page({
  data: {
    tab: 'notice',
    college: '',
    notices: [],
    loading: false
  },

  onLoad(options) {
    var tab = options && options.tab;
    this.setData({ tab: tab || 'notice' });
    this.refresh();
  },

  refresh() {
    var self = this;
    var tab = self.data.tab;
    if (tab === 'college') {
      var userInfo = wx.getStorageSync('userInfo');
      var college = userInfo && userInfo.college ? userInfo.college : '';
      self.setData({ college: college });
      self.loadNotices(college);
    } else {
      // 校园通知 tab 在首页看，这里学院广场只展示学院通知
      self.setData({ college: '' });
      self.loadNotices('');
    }
  },

  loadNotices(college) {
    var self = this;
    self.setData({ loading: true });
    getCollegeNoticeList(1, 50, college, '')
      .then(function(page) {
        var notices = (page.records || []).map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            content: n.content,
            college: n.college || '',
            time: n.createTime ? n.createTime.substring(0, 10) : ''
          };
        });
        self.setData({ notices: notices, loading: false });
      })
      .catch(function() {
        self.setData({ notices: [], loading: false });
      });
  },

  onBack() { wx.navigateBack(); },

  onOpenSearch() {
    wx.navigateTo({ url: '/pages/search/search?scope=college' });
  },

  // 点击通知卡片 - 跳转到学院公告详情
  onViewDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/college-notice-detail/college-notice-detail?id=' + id });
  }
});
