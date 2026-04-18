// pages/activity-detail/activity-detail.ts
Page({
  data: {
    activity: {
      id: 1,
      title: '春季摄影大赛作品征集',
      club: '摄影协会',
      image: 'https://picsum.photos/600/400?random=30',
      time: '2026-04-01 ~ 2026-04-30',
      location: '线上投稿',
      description: '为丰富校园文化生活，展现校园美好瞬间，摄影协会特举办春季摄影大赛。参赛作品可以是校园风景、人物、建筑等各类题材。',
      requirements: '1. 作品必须是原创\n2. 单张或组图均可\n3. 需附简短文字说明',
      participants: 45,
      maxParticipants: 100,
      status: '报名中',
      isJoined: false
    }
  },

  onLoad(options) {
    const activityId = options.id;
    console.log('查看活动详情，ID:', activityId);
  },

  onJoinActivity() {
    const activity = this.data.activity;
    if (activity.status !== '报名中') {
      wx.showToast({ title: '该活动已结束报名', icon: 'none' });
      return;
    }
    if (activity.isJoined) {
      wx.showToast({ title: '您已报名此活动', icon: 'none' });
      return;
    }
    if (activity.participants >= activity.maxParticipants) {
      wx.showToast({ title: '报名人数已满', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认报名',
      content: `确定要报名参加"${activity.title}"吗？`,
      confirmText: '确认报名',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            'activity.isJoined': true,
            'activity.participants': activity.participants + 1
          });
          wx.showToast({ title: '报名成功', icon: 'success' });
          setTimeout(() => {
            wx.showModal({
              title: '报名成功',
              content: `恭喜您成功报名"${activity.title}"，请准时参加。`,
              showCancel: false,
              confirmText: '知道了'
            });
          }, 2000);
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.activity.title,
      path: `/pages/activity-detail/activity-detail?id=${this.data.activity.id}`
    };
  }
});
