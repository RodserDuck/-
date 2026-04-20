// pages/notifications/notifications.js
var { getNoticeList } = require('../../utils/request.js');

Page({
  data: {
    notifications: [],
    loading: false,
    empty: false
  },

  onLoad() {
    this.loadNotifications();
  },

  loadNotifications() {
    var self = this;
    self.setData({ loading: true });
    getNoticeList(1, 50)
      .then(function(page) {
        var list = page.records || [];
        var notifs = list.map(function(n) {
          return {
            id: n.noticeId,
            title: n.title || '通知标题',
            content: n.content || '',
            time: n.createTime ? n.createTime.replace('T', ' ').substring(0, 16) : '',
            isTop: n.isTop === 1
          };
        });
        self.setData({ notifications: notifs, loading: false, empty: notifs.length === 0 });
      })
      .catch(function() {
        self.setData({ loading: false });
      });
  },

  onNotifTap(e) {
    wx.navigateTo({ url: '/pages/notice-detail/notice-detail?id=' + e.currentTarget.dataset.id });
  }
});
