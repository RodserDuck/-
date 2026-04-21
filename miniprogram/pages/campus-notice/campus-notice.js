// pages/campus-notice/campus-notice.js — t_notice 校园公告列表
var { getNoticeList } = require('../../utils/request.js');

function typeName(type) {
  var map = { SYSTEM: '系统通知', ALL: '全校通知', COLLEGE: '学院通知' };
  return map[type] || '通知';
}

Page({
  data: {
    notices: [],
    pageNum: 1,
    pageSize: 15,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadNotices(true);
  },

  onPullDownRefresh() {
    var self = this;
    this.loadNotices(true).finally(function() {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadNotices(false);
    }
  },

  loadNotices(reload) {
    var self = this;
    if (self.data.loading) return Promise.resolve();
    var pageNum = reload ? 1 : self.data.pageNum;
    self.setData({ loading: true });
    return getNoticeList(pageNum, self.data.pageSize)
      .then(function(page) {
        var records = page.records || [];
        var list = records.map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            typeName: typeName(n.type),
            time: n.createTime ? n.createTime.substring(0, 16).replace('T', ' ') : '',
            hot: n.isTop === 1
          };
        });
        var merged = reload ? list : self.data.notices.concat(list);
        var hasMore = records.length >= self.data.pageSize;
        self.setData({
          notices: merged,
          pageNum: pageNum + 1,
          hasMore: hasMore,
          loading: false
        });
      })
      .catch(function() {
        self.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  onItemTap(e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({ url: '/pages/notice-detail/notice-detail?id=' + id });
    }
  }
});
