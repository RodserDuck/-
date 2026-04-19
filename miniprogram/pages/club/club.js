// pages/club/club.js
var { getClubList, getActivityList, getMyClubs } = require('../../utils/request.js');

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
    clubs: [],
    activities: [],
    myClubs: [],
    myActivities: [],
    followedClubIds: []
  },

  onLoad() {
    this.loadClubs();
    this.loadActivities();
  },

  onShow() {
    // 刷新我的社团
    var token = wx.getStorageSync('token');
    if (token) {
      this.loadMyClubs();
    }
  },

  loadClubs() {
    var self = this;
    getClubList()
      .then(function(clubs) {
        var followedIds = clubs.filter(function(c) { return c.followed; }).map(function(c) { return c.clubId; });
        var clubData = clubs.map(function(c) {
          var colors = self.getClubColor(c.category);
          return {
            id: c.clubId,
            name: c.name,
            icon: self.getEmoji(c.category),
            members: c.memberCount || 0,
            category: c.category,
            description: c.description || '',
            hot: c.memberCount || 0,
            followed: false,
            color1: colors[0],
            color2: colors[1],
            coverImage: c.coverImage || ''
          };
        });
        self.setData({ clubs: clubData, followedClubIds: followedIds });
      })
      .catch(function() {});
  },

  loadActivities() {
    var self = this;
    getActivityList()
      .then(function(activities) {
        var actData = activities.map(function(a) {
          var statusText = a.status === 1 ? '报名中' : a.status === 2 ? '进行中' : a.status === 3 ? '已结束' : '已取消';
          var statusClass = a.status === 1 ? 'open' : a.status === 2 ? 'ongoing' : 'closed';
          var timeStr = '';
          if (a.startTime) {
            var start = a.startTime.replace('T', ' ').substring(0, 16);
            if (a.endTime) {
              var end = a.endTime.replace('T', ' ').substring(0, 16);
              timeStr = start + ' ~ ' + end;
            } else {
              timeStr = start;
            }
          }
          return {
            id: a.activityId,
            title: a.title || '校园活动',
            club: a.organizer || '',
            image: a.coverImage || 'https://picsum.photos/800/400?random=30',
            time: timeStr,
            location: a.location || '',
            participants: a.currentParticipants || 0,
            maxParticipants: a.maxParticipants || 0,
            hot: a.viewCount || 0,
            status: statusText,
            statusClass: statusClass
          };
        });
        self.setData({ activities: actData });
      })
      .catch(function() {});
  },

  loadMyClubs() {
    var self = this;
    getMyClubs()
      .then(function(clubs) {
        var myClubs = clubs.map(function(c) {
          var colors = self.getClubColor(c.category);
          return {
            id: c.clubId,
            name: c.name,
            role: c.role === 2 ? '团长' : c.role === 1 ? '管理员' : '成员',
            unread: 0,
            icon: self.getEmoji(c.category),
            color1: colors[0],
            color2: colors[1]
          };
        });
        self.setData({ myClubs: myClubs });
      })
      .catch(function() {});
  },

  getClubColor(category) {
    var map = {
      '文艺体育': ['#fca5a5', '#ef4444'],
      '科技学术': ['#86efac', '#22c55e'],
      '公益服务': ['#f9a8d4', '#ec4899'],
      '兴趣爱好': ['#93c5fd', '#3b82f6'],
      '创业实践': ['#fdba74', '#f97316'],
      '默认': ['#c4b5fd', '#8b5cf6']
    };
    return map[category] || map['默认'];
  },

  getEmoji(category) {
    var map = {
      '文艺体育': '🎨',
      '科技学术': '🔬',
      '公益服务': '❤️',
      '兴趣爱好': '🎮',
      '创业实践': '💡'
    };
    return map[category] || '🏠';
  },

  // Tab切换
  onTabChange(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
  },

  // 分类筛选
  onCategoryTap(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ selectedCategory: id });
    var cat = this.data.categories[id];
    wx.showToast({ title: '已筛选：' + cat.name, icon: 'none', duration: 1000 });
  },

  // 社团详情
  onClubTap(e) {
    wx.navigateTo({ url: '/pages/club-detail/club-detail?id=' + e.currentTarget.dataset.id });
  },

  // 活动详情
  onActivityTap(e) {
    wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id });
  },

  // 加入社团
  onFollowClub(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    var clubs = this.data.clubs.map(function(club) {
      if (club.id === id) {
        return Object.assign({}, club, { followed: !club.followed });
      }
      return club;
    });
    this.setData({ clubs: clubs });
    var club = clubs.find(function(c) { return c.id === id; });
    wx.showToast({
      title: club.followed ? '已加入社团' : '已取消加入',
      icon: 'success',
      duration: 1200
    });
    if (club.followed) {
      self.loadMyClubs();
    }
  },

  // 报名活动
  onJoinActivity(e) {
    var activityId = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.showModal({
      title: '确认报名',
      content: '确定要报名参加该活动吗？',
      confirmColor: '#5b9cf6',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({ title: '报名成功', icon: 'success', duration: 1500 });
        }
      }
    });
  }
});
