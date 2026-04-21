// pages/my-clubs/my-clubs.js
var { getMyClubs, leaveClub, resolveMediaUrl } = require('../../utils/request.js');

Page({
  data: {
    clubs: [],
    loading: false,
    empty: false
  },

  onLoad() {
    this.loadClubs();
  },

  onShow() {
    this.loadClubs();
  },

  loadClubs() {
    var self = this;
    self.setData({ loading: true });
    getMyClubs()
      .then(function(list) {
        var clubs = (list || []).map(function(c) {
          return {
            id: c.clubId,
            name: c.name || '社团名称',
            avatar: c.avatar ? resolveMediaUrl(c.avatar) : 'https://picsum.photos/200/200?random=70',
            description: c.description || '',
            memberCount: c.memberCount || 0,
            role: c.role || '成员'
          };
        });
        self.setData({ clubs: clubs, loading: false, empty: clubs.length === 0 });
      })
      .catch(function() {
        self.setData({ loading: false });
      });
  },

  onClubTap(e) {
    wx.navigateTo({ url: '/pages/club-detail/club-detail?id=' + e.currentTarget.dataset.id });
  },

  onLeaveTap(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '退出社团',
      content: '确定要退出该社团吗？',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          leaveClub(id)
            .then(function() {
              wx.showToast({ title: '已退出', icon: 'success' });
              self.loadClubs();
            })
            .catch(function() {
              wx.showToast({ title: '操作失败', icon: 'none' });
            });
        }
      }
    });
  }
});
