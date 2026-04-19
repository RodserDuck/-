// pages/activity-detail/activity-detail.js
var { getActivityDetail, registerActivity, cancelActivity } = require('../../utils/request.js');

Page({
  data: {
    activity: null,
    isRegistered: false
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.loadActivity(id);
  },

  loadActivity(id) {
    var self = this;
    getActivityDetail(id)
      .then(function(act) {
        self.setData({ activity: act });
      })
      .catch(function() {});
  },

  onRegisterTap() {
    var self = this;
    var activity = this.data.activity;
    var token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    var action = self.data.isRegistered ? cancelActivity(activity.activityId) : registerActivity(activity.activityId);
    action.then(function() {
      self.setData({ isRegistered: !self.data.isRegistered });
      wx.showToast({ title: self.data.isRegistered ? '报名成功' : '已取消报名', icon: 'success' });
    }).catch(function(e) {
      wx.showToast({ title: e.msg || '操作失败', icon: 'none' });
    });
  }
});
