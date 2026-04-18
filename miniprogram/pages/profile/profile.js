// pages/profile/profile.ts
Page({
  data: {
    userInfo: {
      avatar: 'https://picsum.photos/200/200?random=99',
      nickname: '校园用户',
      account: 'student001',
      identity: 'student'
    },
    statsList: [
      { id: 1, value: 12, label: '帖子' },
      { id: 2, value: 8, label: '收藏' },
      { id: 3, value: 3, label: '闲置' },
      { id: 4, value: 2, label: '寻物' }
    ],
    quickActions: [
      { id: 1, icon: '✏️', name: '发布帖子', bgColor: 'rgba(91, 156, 246, 0.12)' },
      { id: 2, icon: '📷', name: '发布闲置', bgColor: 'rgba(251, 146, 60, 0.12)' },
      { id: 3, icon: '🔍', name: '寻物启事', bgColor: 'rgba(52, 211, 153, 0.12)' },
      { id: 4, icon: '💬', name: '联系客服', bgColor: 'rgba(167, 139, 250, 0.12)' }
    ],
    menuGroups: [
      {
        title: '我的内容',
        items: [
          { id: 1, icon: '📝', name: '我的帖子', count: 12, iconBg: 'rgba(91, 156, 246, 0.12)', sub: '管理发布的内容' },
          { id: 2, icon: '⭐', name: '我的收藏', count: 8, iconBg: 'rgba(251, 146, 60, 0.12)', sub: '收藏的文章和商品' },
          { id: 3, icon: '📦', name: '我的闲置', count: 3, iconBg: 'rgba(52, 211, 153, 0.12)', sub: '发布和管理的商品' }
        ]
      },
      {
        title: '我的活动',
        items: [
          { id: 4, icon: '👥', name: '我的社团', count: 2, iconBg: 'rgba(167, 139, 250, 0.12)', sub: '已加入的社团' },
          { id: 5, icon: '🎯', name: '我的活动', count: 5, iconBg: 'rgba(251, 191, 36, 0.12)', sub: '报名的社团活动' }
        ]
      },
      {
        title: '其他',
        items: [
          { id: 6, icon: '🔔', name: '消息通知', count: 3, iconBg: 'rgba(248, 113, 113, 0.12)', sub: '评论、点赞通知' },
          { id: 7, icon: '⚙️', name: '设置', count: 0, iconBg: 'rgba(156, 163, 175, 0.12)', sub: '账号与隐私设置' },
          { id: 8, icon: '📞', name: '联系客服', count: 0, iconBg: 'rgba(96, 165, 250, 0.12)', sub: '问题反馈与帮助' }
        ]
      }
    ]
  },

  onLoad() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
    }
  },

  onEditProfile() {
    wx.showToast({ title: '编辑资料', icon: 'none' });
  },

  onQuickAction(e) {
    const id = e.currentTarget.dataset.id;
    switch (id) {
      case 1: wx.navigateTo({ url: '/pages/publish-post/publish-post' }); break;
      case 2: wx.navigateTo({ url: '/pages/publish-goods/publish-goods' }); break;
      case 3: wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound' }); break;
      case 4: wx.showToast({ title: '联系客服功能开发中', icon: 'none' }); break;
    }
  },

  onMenuTap(e) {
    const id = e.currentTarget.dataset.id;
    const menuMap, string> = {
      1: '我的帖子', 2: '我的收藏', 3: '我的闲置',
      4: '我的社团', 5: '我的活动', 6: '消息通知',
      7: '设置', 8: '联系客服'
    };
    wx.showToast({ title: menuMap[id] || '功能开发中', icon: 'none' });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      confirmColor: '#f87171',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('isLoggedIn');
          wx.removeStorageSync('userInfo');
          wx.navigateTo({ url: '/pages/login/login' });
        }
      }
    });
  }
});
