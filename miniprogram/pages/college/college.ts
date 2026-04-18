// pages/college/college.ts
Page({
  data: {
    currentTab: 0,
    colleges: [
      { id: 1, name: '计算机学院', icon: '💻', color: '#3b82f6' },
      { id: 2, name: '经济管理学院', icon: '📊', color: '#10b981' },
      { id: 3, name: '外国语学院', icon: '🌍', color: '#f59e0b' },
      { id: 4, name: '机械工程学院', icon: '⚙️', color: '#6366f1' },
      { id: 5, name: '文学与传媒学院', icon: '📖', color: '#ec4899' },
      { id: 6, name: '数学与统计学院', icon: '📐', color: '#8b5cf6' },
      { id: 7, name: '艺术学院', icon: '🎨', color: '#f43f5e' },
      { id: 8, name: '体育学院', icon: '⚽', color: '#14b8a6' }
    ],
    notices: [
      { id: 1, title: '计算机学院2026年研究生招生简章', college: '计算机学院', time: '2026-03-25' },
      { id: 2, title: '经管学院学术讲座：数字经济与未来', college: '经济管理学院', time: '2026-03-24' },
      { id: 3, title: '外语学院英语角活动通知', college: '外国语学院', time: '2026-03-23' },
      { id: 4, title: '机械学院实验室开放日活动', college: '机械工程学院', time: '2026-03-22' }
    ],
    activities: [
      { id: 1, title: '编程马拉松大赛', college: '计算机学院', time: '2026-04-15', location: '科技楼', participants: 120 },
      { id: 2, title: '商业案例分析大赛', college: '经济管理学院', time: '2026-04-20', location: '商学院报告厅', participants: 80 },
      { id: 3, title: '外语演讲比赛', college: '外国语学院', time: '2026-04-25', location: '外语楼', participants: 60 }
 ]
  },

  onLoad() {
    // 页面加载
  },

  // 切换标签
  onTabChange(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  // 学院点击
  onCollegeTap(e: any) {
    const id = e.currentTarget.dataset.id;
    const college = this.data.colleges.find(c => c.id === id);
    wx.showToast({
      title: `进入${college?.name}`,
      icon: 'none'
    });
  },

  // 查看活动详情
  onViewDetail(e: any) {
    const activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/college-activity-detail/college-activity-detail?id=${activityId}`
    });
  }
});
