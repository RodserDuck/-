// pages/club-detail/club-detail.ts
Page({
  data: {
    club: {
      id: 1,
      name: '摄影协会',
      icon: '📷',
      banner: 'https://picsum.photos/600/300?random=70',
      category: '兴趣爱好',
      members: 156,
      description: '摄影协会成立于2015年，是一个致力于推广摄影艺术、提升摄影技术的社团。我们定期举办摄影讲座、外拍活动、作品展览等，为摄影爱好者提供学习交流的平台。',
      activities: [
        { title: '春季摄影大赛', time: '2026-04-01', status: '进行中' },
        { title: '人像摄影工作坊', time: '2026-03-15', status: '已结束' }
      ],
      isJoined: false,
      isApplying: false
    }
  },

  onLoad(options: any) {
    const clubId = options.id;
    console.log('查看社团详情，ID:', clubId);
  },

  onJoinClub() {
    const club = this.data.club;
    if (club.isJoined) {
      wx.showToast({ title: '您已经是该社团成员', icon: 'none' });
      return;
    }
    if (club.isApplying) {
      wx.showToast({ title: '申请审核中', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '申请加入社团',
      content: `确定要申请加入"${club.name}"吗？`,
      confirmText: '申请加入',
      success: (res) => {
        if (res.confirm) {
          this.setData({ 'club.isApplying': true });
          wx.showToast({ title: '申请已提交', icon: 'success' });
          setTimeout(() => {
            wx.showModal({
              title: '审核通知',
              content: '您的入社申请已通过审核，欢迎加入！',
              showCancel: false,
              success: () => {
                this.setData({ 'club.isJoined': true, 'club.isApplying': false, 'club.members': club.members + 1 });
              }
            });
          }, 3000);
        }
      }
    });
  }
});
