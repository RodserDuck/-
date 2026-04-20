// pages/my-activities/my-activities.js
var { getMyActivities, cancelActivity } = require('../../utils/request.js');

Page({
  data: {
    activities: [],
    loading: false,
    empty: false
  },

  onLoad() {
    this.loadActivities();
  },

  onShow() {
    this.loadActivities();
  },

  loadActivities() {
    var self = this;
    self.setData({ loading: true });
    getMyActivities()
      .then(function(list) {
        var activities = (list || []).map(function(a) {
          return {
            id: a.activityId,
            title: a.title || '活动名称',
            cover: a.cover || 'https://picsum.photos/400/200?random=80',
            time: a.startTime ? a.startTime.replace('T', ' ').substring(0, 16) : '',
            location: a.location || '',
            status: a.status === 1 ? '报名成功' : a.status === 2 ? '进行中' : '已结束',
            statusCode: a.status || 0
          };
        });
        self.setData({ activities: activities, loading: false, empty: activities.length === 0 });
      })
      .catch(function() {
        self.setData({ loading: false });
      });
  },

  onActivityTap(e) {
    wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id });
  },

  onCancelTap(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消报名',
      content: '确定要取消报名该活动吗？',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          cancelActivity(id)
            .then(function() {
              wx.showToast({ title: '已取消报名', icon: 'success' });
              self.loadActivities();
            })
            .catch(function() {
              wx.showToast({ title: '操作失败', icon: 'none' });
            });
        }
      }
    });
  }
});
