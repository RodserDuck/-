// pages/club-detail/club-detail.js
var { getClubDetail, getClubActivities, joinClub, leaveClub } = require('../../utils/request.js');

Page({
  data: {
    club: null,
    activities: [],
    isJoined: false
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.loadClub(id);
    this.loadActivities(id);
  },

  loadClub(id) {
    var self = this;
    getClubDetail(id)
      .then(function(club) {
        self.setData({ club: club });
      })
      .catch(function() {});
  },

  loadActivities(id) {
    var self = this;
    getClubActivities(id)
      .then(function(acts) {
        self.setData({ activities: acts || [] });
      })
      .catch(function() {});
  },

  onJoinTap() {
    var self = this;
    var club = this.data.club;
    var token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    var action = self.data.isJoined ? leaveClub(club.clubId) : joinClub(club.clubId);
    action.then(function() {
      self.setData({ isJoined: !self.data.isJoined });
      wx.showToast({ title: self.data.isJoined ? '已加入社团' : '已退出社团', icon: 'success' });
    }).catch(function(e) {
      wx.showToast({ title: e.msg || '操作失败', icon: 'none' });
    });
  }
});
