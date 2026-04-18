// pages/club/club.ts
Page({
  data: {
    currentTab: 0,
    selectedCategory: 0,
    categories: [
      { id: 0, name: '全部', icon: '✨' },
      { id: 1, name: '文艺体育', icon: '🎨' },
      { id: 2, name: '科技学术', icon: '🔬' },
      { id: 3, name: '公益服务', icon: '❤️' },
      { id: 4, name: '兴趣爱好', icon: '🎮' },
      { id: 5, name: '创业实践', icon: '💡' }
    ],
    clubs: [
      {
        id: 1,
        name: '摄影协会',
        icon: '📷',
        members: 156,
        category: '兴趣爱好',
        description: '用镜头记录美好校园生活，用光影定格青春瞬间',
        hot: 98,
        followed: false,
        color1: '#93c5fd',
        color2: '#3b82f6'
      },
      {
        id: 2,
        name: '街舞社',
        icon: '🕺',
        members: 89,
        category: '文艺体育',
        description: '释放青春活力，舞动校园精彩',
        hot: 76,
        followed: true,
        color1: '#fca5a5',
        color2: '#ef4444'
      },
      {
        id: 3,
        name: '志愿者协会',
        icon: '❤️',
        members: 234,
        category: '公益服务',
        description: '奉献爱心，服务社会，传递正能量',
        hot: 120,
        followed: false,
        color1: '#f9a8d4',
        color2: '#ec4899'
      },
      {
        id: 4,
        name: '机器人协会',
        icon: '🤖',
        members: 67,
        category: '科技学术',
        description: '探索人工智能奥秘，培养科技创新人才',
        hot: 55,
        followed: false,
        color1: '#86efac',
        color2: '#22c55e'
      },
      {
        id: 5,
        name: '吉他社',
        icon: '🎸',
        members: 112,
        category: '文艺体育',
        description: '用音乐连接你我，用旋律奏响青春',
        hot: 88,
        followed: false,
        color1: '#fdba74',
        color2: '#f97316'
      },
      {
        id: 6,
        name: '辩论队',
        icon: '🎤',
        members: 45,
        category: '科技学术',
        description: '思辨明理，以辩会友，提升表达能力',
        hot: 42,
        followed: false,
        color1: '#c4b5fd',
        color2: '#8b5cf6'
      }
    ],
    activities: [
      {
        id: 1,
        title: '春季摄影大赛作品征集',
        club: '摄影协会',
        image: 'https://picsum.photos/800/400?random=30',
        time: '2026-04-01 ~ 04-30',
        location: '线上投稿',
        participants: 45,
        hot: 86,
        status: '进行中',
        statusClass: 'ongoing'
      },
      {
        id: 2,
        title: '校园街舞快闪活动',
        club: '街舞社',
        image: 'https://picsum.photos/800/400?random=31',
        time: '2026-04-15 18:00',
        location: '图书馆广场',
        participants: 30,
        hot: 64,
        status: '报名中',
        statusClass: 'open'
      },
      {
        id: 3,
        title: '敬老院志愿服务',
        club: '志愿者协会',
        image: 'https://picsum.photos/800/400?random=32',
        time: '2026-04-20 09:00',
        location: '阳光敬老院',
        participants: 20,
        hot: 52,
        status: '报名中',
        statusClass: 'open'
      }
    ],
    myClubs: [
      {
        id: 2,
        name: '街舞社',
        role: '成员',
        unread: 0,
        icon: '🕺',
        color1: '#fca5a5',
        color2: '#ef4444'
      },
      {
        id: 3,
        name: '志愿者协会',
        role: '部长',
        unread: 5,
        icon: '❤️',
        color1: '#f9a8d4',
        color2: '#ec4899'
      }
    ],
    myActivities: []
  },

  onLoad() {},

  // Tab切换
  onTabChange(e: any) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
  },

  // 分类筛选
  onCategoryTap(e: any) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategory: id });
    // 实际开发中这里应该根据分类重新请求数据
    wx.showToast({ title: `已筛选：${this.data.categories[id].name}`, icon: 'none', duration: 1000 });
  },

  // 社团详情
  onClubTap(e: any) {
    wx.navigateTo({ url: `/pages/club-detail/club-detail?id=${e.currentTarget.dataset.id}` });
  },

  // 活动详情
  onActivityTap(e: any) {
    wx.navigateTo({ url: `/pages/activity-detail/activity-detail?id=${e.currentTarget.dataset.id}` });
  },

  // 加入社团
  onFollowClub(e: any) {
    const id = e.currentTarget.dataset.id;
    const clubs = this.data.clubs.map(club => {
      if (club.id === id) {
        return { ...club, followed: !club.followed };
      }
      return club;
    });
    this.setData({ clubs });
    const club = clubs.find(c => c.id === id);
    wx.showToast({
      title: club.followed ? '已加入社团' : '已取消加入',
      icon: 'success',
      duration: 1200
    });
  },

  // 报名活动
  onJoinActivity(e: any) {
    const activityId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认报名',
      content: '确定要报名参加该活动吗？',
      confirmColor: '#5b9cf6',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '报名成功', icon: 'success', duration: 1500 });
        }
      }
    });
  }
});
