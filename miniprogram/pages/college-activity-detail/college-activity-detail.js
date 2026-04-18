// pages/college-activity-detail/college-activity-detail.ts
Page({
  data: {
    activity: {
      id: 1,
      title: '编程马拉松大赛',
      college: '计算机学院',
      image: 'https://picsum.photos/600/400?random=80',
      time: '2026-04-15 09:00 ~ 18:00',
      location: '科技楼实验室',
      description: '本届编程马拉松大赛旨在提升学生的编程能力和团队协作精神。比赛将采用现场命题、限时完成的形式。',
      requirements: '1. 计算机学院在校生\n2. 每队3-5人\n3. 自备笔记本电脑',
      participants: 120,
      maxParticipants: 200,
      status: '报名中',
      isJoined: false
    }
  },

  onLoad(options) {
    const activityId = options.id;
    console.log('查看学院活动详情，ID:', activityId);
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
        }
      }
    });
  }
});
