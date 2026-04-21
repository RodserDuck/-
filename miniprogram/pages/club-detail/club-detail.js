// pages/club-detail/club-detail.js
var { getClubDetail, getClubActivities, joinClub, leaveClub, getMyClubStatus, resolveMediaUrl } = require('../../utils/request.js');

Page({
  data: {
    club: null,
    activities: [],
    clubId: null,
    joinStatus: 'none',  // none | pending | joined
    isLeader: false
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.setData({ clubId: id });
    this.loadClub(id);
    this.loadActivities(id);
    this.loadJoinStatus(id);
  },

  onShow() {
    var id = this.data.clubId;
    if (id) {
      this.loadClub(id);
      this.loadJoinStatus(id);
    }
  },

  loadClub(id) {
    var self = this;
    getClubDetail(id)
      .then(function(club) {
        if (club && club.coverImage) {
          club.coverImage = resolveMediaUrl(club.coverImage);
        }
        var uid = wx.getStorageSync('userId');
        var isLeader = uid && club && club.leaderId && String(uid) === String(club.leaderId);
        self.setData({ isLeader: !!isLeader });
        self.setData({ club: club });
      })
      .catch(function() {});
  },

  loadActivities(id) {
    var self = this;
    getClubActivities(id)
      .then(function(acts) {
        var activityData = (acts || []).map(function(a) {
          var statusText = a.status === 1 ? '报名中' : a.status === 2 ? '进行中' : '已结束';
          var statusClass = a.status === 1 ? 'open' : a.status === 2 ? 'ongoing' : 'closed';
          return {
            id: a.activityId,
            title: a.title || '',
            time: a.startTime ? a.startTime.replace('T', ' ').substring(0, 16) : '',
            status: statusText,
            statusClass: statusClass
          };
        });
        self.setData({ activities: activityData });
      })
      .catch(function() {});
  },

  loadJoinStatus(id) {
    var self = this;
    var token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ joinStatus: 'none' });
      return;
    }
    getMyClubStatus()
      .then(function(statusMap) {
        var status = statusMap && statusMap[id] ? statusMap[id] : 'none';
        self.setData({ joinStatus: status });
      })
      .catch(function() {
        self.setData({ joinStatus: 'none' });
      });
  },

  onJoinTap() {
    var self = this;
    var id = this.data.clubId;
    var status = this.data.joinStatus;
    var token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    if (status === 'joined') {
      // 已加入 -> 退出
      wx.showModal({
        title: '退出社团',
        content: '确定要退出该社团吗？',
        confirmColor: '#ef4444',
        success: function(res) {
          if (res.confirm) {
            leaveClub(id)
              .then(function() {
                wx.showToast({ title: '已退出社团', icon: 'success' });
                self.setData({ joinStatus: 'none' });
              })
              .catch(function(e) {
                wx.showToast({ title: e.msg || '操作失败', icon: 'none' });
              });
          }
        }
      });
    } else if (status === 'pending') {
      wx.showToast({ title: '申请正在审核中，请耐心等待', icon: 'none', duration: 2000 });
    } else {
      // 未加入 -> 申请
      wx.showModal({
        title: '申请加入',
        content: '确定要申请加入该社团吗？',
        confirmColor: '#3b82f6',
        success: function(res) {
          if (res.confirm) {
            joinClub(id)
              .then(function() {
                wx.showToast({ title: '申请已提交，等待审核', icon: 'success' });
                self.setData({ joinStatus: 'pending' });
              })
              .catch(function(e) {
                wx.showToast({ title: e.msg || '申请失败', icon: 'none' });
              });
          }
        }
      });
    }
  },

  onActivityTap(e) {
    wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id });
  },

  onManageTap() {
    var id = this.data.clubId;
    if (!id) return;
    wx.navigateTo({ url: '/pages/club-leader/club-leader?clubId=' + id });
  },

  onBack() { wx.navigateBack(); }
});
