// pages/activity-detail/activity-detail.js
var { getActivityDetail, registerActivity, cancelActivity } = require('../../utils/request.js');

Page({
  data: {
    activity: null,
    isRegistered: false,
    activityId: null
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.setData({ activityId: id });
    this.loadActivity(id);
  },

  onShow() {
    var id = this.data.activityId;
    if (id) this.loadActivity(id);
  },

  loadActivity(id) {
    var self = this;
    getActivityDetail(id)
      .then(function(act) {
        var timeStr = '';
        if (act.startTime) {
          var start = act.startTime.replace('T', ' ').substring(0, 16);
          timeStr = start;
        }
        var statusText = act.status === 1 ? '报名中' : act.status === 2 ? '进行中' : '已结束';
        var statusClass = act.status === 1 ? 'open' : act.status === 2 ? 'ongoing' : 'closed';
        self.setData({
          activity: {
            activityId: act.activityId,
            title: act.title || '',
            description: act.description || '',
            club: act.organizer || '',
            location: act.location || '',
            time: timeStr,
            participants: act.currentParticipants || 0,
            maxParticipants: act.maxParticipants || 0,
            status: statusText,
            statusClass: statusClass,
            contact: act.contact || '',
            viewCount: act.viewCount || 0
          }
        });
      })
      .catch(function() {});
  },

  onRegisterTap() {
    var self = this;
    var activity = this.data.activity;
    var token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    if (activity.statusClass === 'closed') {
      wx.showToast({ title: '活动已结束', icon: 'none' }); return;
    }
    var action = self.data.isRegistered
      ? cancelActivity(activity.activityId)
      : registerActivity(activity.activityId);
    action
      .then(function() {
        wx.showToast({
          title: self.data.isRegistered ? '已取消报名' : '报名成功',
          icon: 'success'
        });
        self.setData({ isRegistered: !self.data.isRegistered });
        self.loadActivity(activity.activityId);
      })
      .catch(function(e) {
        wx.showToast({ title: e.msg || '操作失败', icon: 'none' });
      });
  },

  onBack() { wx.navigateBack(); }
});
