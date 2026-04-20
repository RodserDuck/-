// pages/profile/profile.js
var { getUserInfo, getMyGoods, getMyClubs, getMyBuy, getMySell, confirmTrade, cancelTrade } = require('../../utils/request.js');

Page({
  data: {
    userInfo: {
      avatar: 'https://picsum.photos/200/200?random=99',
      nickname: '校园用户',
      account: '',
      identity: 'student'
    },
    statsList: [
      { id: 1, value: 0, label: '帖子' },
      { id: 3, value: 0, label: '闲置' },
      { id: 4, value: 0, label: '寻物' }
    ],
    quickActions: [
      { id: 1, icon: '✏️', name: '发布帖子', bgColor: 'rgba(91, 156, 246, 0.12)' },
      { id: 2, icon: '📷', name: '发布闲置', bgColor: 'rgba(251, 146, 60, 0.12)' },
      { id: 3, icon: '🔍', name: '寻物启事', bgColor: 'rgba(52, 211, 153, 0.12)' },
      { id: 4, icon: '💬', name: '联系客服', bgColor: 'rgba(167, 139, 250, 0.12)' }
    ],
    tradeTab: 'buy',
    buyList: [],
    sellList: [],
    tradeStats: { buyCount: 0, sellCount: 0, pendingCount: 0 },
    showTradeSheet: false,
    menuGroups: [
      {
        title: '我的内容',
        items: [
          { id: 1, icon: '📝', name: '我的帖子', count: 0, iconBg: 'rgba(91, 156, 246, 0.12)', sub: '管理发布的内容' },
          { id: 3, icon: '📦', name: '我的闲置', count: 0, iconBg: 'rgba(52, 211, 153, 0.12)', sub: '发布和管理的商品' }
        ]
      },
      {
        title: '我的交易',
        items: [
          { id: 9, icon: '🛒', name: '我的购买', count: 0, iconBg: 'rgba(245, 158, 11, 0.12)', sub: '购买记录与交易状态' },
          { id: 10, icon: '💰', name: '我的售出', count: 0, iconBg: 'rgba(34, 197, 94, 0.12)', sub: '售出记录与收款确认' }
        ]
      },
      {
        title: '我的活动',
        items: [
          { id: 4, icon: '👥', name: '我的社团', count: 0, iconBg: 'rgba(167, 139, 250, 0.12)', sub: '已加入的社团' },
          { id: 5, icon: '🎯', name: '我的活动', count: 0, iconBg: 'rgba(251, 191, 36, 0.12)', sub: '报名的社团活动' }
        ]
      },
      {
        title: '其他',
        items: [
          { id: 6, icon: '🔔', name: '消息通知', count: 0, iconBg: 'rgba(248, 113, 113, 0.12)', sub: '评论、点赞通知' },
          { id: 7, icon: '⚙️', name: '设置', count: 0, iconBg: 'rgba(156, 163, 175, 0.12)', sub: '账号与隐私设置' }
        ]
      }
    ]
  },

  onLoad() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    this.loadUserInfo();
  },

  onShow() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) return;
    this.loadUserInfo();
    this.loadMyData();
  },

  loadUserInfo() {
    var self = this;
    var cached = wx.getStorageSync('userInfo');
    if (cached) {
      self.setData({
        userInfo: {
          avatar: cached.avatar || 'https://picsum.photos/200/200?random=99',
          nickname: cached.username || cached.nickname || '校园用户',
          account: cached.account || cached.studentNo || '',
          identity: 'student'
        }
      });
    }
    getUserInfo()
      .then(function(user) {
        wx.setStorageSync('userInfo', user);
        self.setData({
          userInfo: {
            avatar: user.avatar || 'https://picsum.photos/200/200?random=99',
            nickname: user.username || '校园用户',
            account: user.studentNo || user.phone || '',
            identity: 'student',
            userId: user.userId
          }
        });
      })
      .catch(function() {});
  },

  loadMyData() {
    var self = this;
    getMyGoods()
      .then(function(goods) {
        var stats = self.data.statsList;
        stats[1].value = goods ? goods.length : 0;
        var menuGroups = self.data.menuGroups;
        menuGroups[0].items[1].count = goods ? goods.length : 0;
        self.setData({ statsList: stats, menuGroups: menuGroups });
      })
      .catch(function() {});

    getMyClubs()
      .then(function(clubs) {
        var menuGroups = self.data.menuGroups;
        menuGroups[2].items[0].count = clubs ? clubs.length : 0;
        self.setData({ menuGroups: menuGroups });
      })
      .catch(function() {});

    // 加载交易统计
    Promise.all([getMyBuy(), getMySell()])
      .then(function(results) {
        var buyList = results[0] || [];
        var sellList = results[1] || [];
        var pendingCount = sellList.filter(function(r) { return r.status === 0; }).length;
        var tradeStats = {
          buyCount: buyList.length,
          sellCount: sellList.length,
          pendingCount: pendingCount
        };
        var menuGroups = self.data.menuGroups;
        menuGroups[1].items[0].count = buyList.length;
        menuGroups[1].items[1].count = sellList.length;
        self.setData({
          buyList: buyList,
          sellList: sellList,
          tradeStats: tradeStats,
          menuGroups: menuGroups
        });
      })
      .catch(function() {});
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onQuickAction(e) {
    var id = e.currentTarget.dataset.id;
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn && id !== 8) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    switch (id) {
      case 1: wx.navigateTo({ url: '/pages/publish-post/publish-post' }); break;
      case 2: wx.navigateTo({ url: '/pages/publish-goods/publish-goods' }); break;
      case 3: wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound' }); break;
      case 4: wx.showToast({ title: '联系客服功能开发中', icon: 'none' }); break;
    }
  },

  onMenuTap(e) {
    var id = e.currentTarget.dataset.id;
    if (id === 9) {
      this.showTradeSheet('buy');
    } else if (id === 10) {
      this.showTradeSheet('sell');
    } else {
      var pageMap = {
        1: '/pages/my-posts/my-posts',
        3: '/pages/market/market?tab=mine',
        4: '/pages/my-clubs/my-clubs',
        5: '/pages/my-activities/my-activities',
        6: '/pages/notifications/notifications',
        7: '/pages/settings/settings'
      };
      var url = pageMap[id];
      if (url) {
        wx.navigateTo({ url: url });
      } else {
        wx.showToast({ title: '功能开发中', icon: 'none' });
      }
    }
  },

  showTradeSheet(e) {
    var tab = e.currentTarget.dataset.tab || e;
    this.setData({ tradeTab: tab, showTradeSheet: true });
  },

  closeTradeSheet() {
    this.setData({ showTradeSheet: false });
  },

  onBuyerConfirm(e) {
    var self = this;
    var recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品且无问题，交易完成？',
      confirmColor: '#22c55e',
      success: function(res) {
        if (res.confirm) {
          confirmTrade(recordId)
            .then(function() {
              wx.showToast({ title: '交易已完成', icon: 'success' });
              self.loadMyData();
              self.closeTradeSheet();
            })
            .catch(function(err) {
              wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
            });
        }
      }
    });
  },

  onBuyerCancel(e) {
    var self = this;
    var recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消交易',
      content: '确定要取消该交易吗？',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          cancelTrade(recordId)
            .then(function() {
              wx.showToast({ title: '已取消', icon: 'success' });
              self.loadMyData();
            })
            .catch(function(err) {
              wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
            });
        }
      }
    });
  },

  onLogout() {
    var self = this;
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      confirmColor: '#f87171',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('isLoggedIn');
          wx.removeStorageSync('userId');
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
