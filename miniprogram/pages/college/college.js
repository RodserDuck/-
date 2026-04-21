// pages/college/college.js
var { getCollegeNoticeList } = require('../../utils/request.js');

Page({
  data: {
    tab: 'notice',
    college: '',
    searchKeyword: '',
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
      self.loadNotices(college, self.data.searchKeyword);
    } else {
      // 校园通知 tab 在首页看，这里学院广场只展示学院通知
      self.setData({ college: '' });
      self.loadNotices('', self.data.searchKeyword);
    }
  },

  loadNotices(college, keyword) {
    var self = this;
    var kw = keyword !== undefined && keyword !== null ? keyword : self.data.searchKeyword;
    kw = (kw || '').trim();
    self.setData({ loading: true });
    getCollegeNoticeList(1, 50, college, kw)
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

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm(e) {
    var kw = (e.detail.value || '').trim();
    this.setData({ searchKeyword: kw });
    var college = this.data.college || '';
    this.loadNotices(college, kw);
  },

  goGlobalSearch() {
    var k = (this.data.searchKeyword || '').trim();
    var q = k ? '&keyword=' + encodeURIComponent(k) : '';
    wx.navigateTo({ url: '/pages/search/search?scope=college' + q });
  },

  // 点击通知卡片 - 跳转到学院公告详情
  onViewDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/college-notice-detail/college-notice-detail?id=' + id });
  }
});
