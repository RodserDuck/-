// pages/club/club.js
var { getClubList, getActivityList, getMyClubs } = require('../../utils/request.js');

Page({
  data: {
    currentTab: 0,
    selectedCategory: 0,
    selectedActFilter: 0,
    hasNotify: false,
    categories: [
      { id: 0, name: '全部' },
      { id: 1, name: '文艺体育' },
      { id: 2, name: '科技学术' },
      { id: 3, name: '公益服务' },
      { id: 4, name: '兴趣爱好' },
      { id: 5, name: '创业实践' }
    ],
    clubs: [],
    filteredClubs: [],
    activities: [],
    filteredActivities: [],
    myClubs: [],
    myActivities: [],
    userInfo: {}
  },

  onLoad() {
    var userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo: userInfo });
    this.loadClubs();
    this.loadActivities();
  },

  onShow() {
    var token = wx.getStorageSync('token');
    if (token) {
      this.loadMyClubs();
    }
    var userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo: userInfo });
  },

  loadClubs() {
    var self = this;
    getClubList()
      .then(function(clubs) {
        var clubData = clubs.map(function(c) {
          var style = self.getClubStyle(c.category);
          return {
            id: c.clubId,
            name: c.name,
            icon: style.emoji,
            members: c.memberCount || 0,
            category: c.category,
            description: c.description || '',
            hot: c.memberCount || 0,
            followed: false,
            gradient: style.gradient,
            badgeColor: style.badgeColor,
            _animClass: ''
          };
        });
        self.setData({ clubs: clubData });
        self.applyCategoryFilter();
      })
      .catch(function() {});
  },

  loadActivities() {
    var self = this;
    getActivityList()
      .then(function(activities) {
        var actData = activities.map(function(a) {
          var statusText = a.status === 1 ? '报名中' : a.status === 2 ? '进行中' : '已结束';
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
            image: a.coverImage || 'https://picsum.photos/400/400?random=30',
            time: timeStr,
            location: a.location || '',
            participants: a.currentParticipants || 0,
            hot: a.viewCount || 0,
            status: statusText,
            statusClass: statusClass,
            _animClass: ''
          };
        });
        self.setData({ activities: actData });
        self.applyActivityFilter();
      })
      .catch(function() {});
  },

  loadMyClubs() {
    var self = this;
    getMyClubs()
      .then(function(clubs) {
        var myClubs = clubs.map(function(c) {
          var style = self.getClubStyle(c.category);
          var roleClass = c.role === 2 ? 'owner' : c.role === 1 ? 'admin' : 'member';
          var roleText = c.role === 2 ? '团长' : c.role === 1 ? '管理员' : '成员';
          return {
            id: c.clubId,
            name: c.name,
            role: roleText,
            roleClass: roleClass,
            icon: style.emoji,
            gradient: style.gradient
          };
        });
        self.setData({ myClubs: myClubs });
      })
      .catch(function() {});
  },

  getClubStyle(category) {
    var map = {
      '文艺体育': { emoji: '🎨', gradient: 'linear-gradient(135deg, #fca5a5, #ef4444)', badgeColor: '#ef4444' },
      '科技学术': { emoji: '🔬', gradient: 'linear-gradient(135deg, #86efac, #22c55e)', badgeColor: '#22c55e' },
      '公益服务': { emoji: '❤️', gradient: 'linear-gradient(135deg, #f9a8d4, #ec4899)', badgeColor: '#ec4899' },
      '兴趣爱好': { emoji: '🎮', gradient: 'linear-gradient(135deg, #93c5fd, #3b82f6)', badgeColor: '#3b82f6' },
      '创业实践': { emoji: '💡', gradient: 'linear-gradient(135deg, #fdba74, #f97316)', badgeColor: '#f97316' }
    };
    var style = map[category] || { emoji: '🏠', gradient: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', badgeColor: '#8b5cf6' };
    return style;
  },

  applyCategoryFilter() {
    var cats = this.data.categories;
    var catId = this.data.selectedCategory;
    var clubs = this.data.clubs;
    var filtered;
    if (catId === 0) {
      filtered = clubs;
    } else {
      var catName = cats.find(function(c) { return c.id === catId; });
      filtered = clubs.filter(function(c) { return c.category === catName.name; });
    }
    this.setData({ filteredClubs: filtered });
  },

  applyActivityFilter() {
    var acts = this.data.activities;
    var filterId = this.data.selectedActFilter;
    var filtered;
    if (filterId === 0) {
      filtered = acts;
    } else if (filterId === 1) {
      filtered = acts.filter(function(a) { return a.statusClass === 'open'; });
    } else if (filterId === 2) {
      filtered = acts.filter(function(a) { return a.statusClass === 'ongoing'; });
    } else {
      filtered = acts.filter(function(a) { return a.statusClass === 'closed'; });
    }
    this.setData({ filteredActivities: filtered });
  },

  onTabChange(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
  },

  onCategoryTap(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ selectedCategory: id });
    this.applyCategoryFilter();
  },

  onActFilterTap(e) {
    var id = parseInt(e.currentTarget.dataset.id);
    this.setData({ selectedActFilter: id });
    this.applyActivityFilter();
  },

  onNotifyTap() {
    wx.showToast({ title: '暂无新通知', icon: 'none', duration: 1500 });
  },

  onSearch(e) {
    var keyword = (e.detail.value || '').trim();
    if (!keyword) {
      this.applyCategoryFilter();
      return;
    }
    var clubs = this.data.clubs;
    var filtered = clubs.filter(function(c) {
      return c.name.indexOf(keyword) > -1 || c.category.indexOf(keyword) > -1;
    });
    this.setData({ filteredClubs: filtered });
  },

  onClubTap(e) {
    wx.navigateTo({ url: '/pages/club-detail/club-detail?id=' + e.currentTarget.dataset.id });
  },

  onActivityTap(e) {
    wx.navigateTo({ url: '/pages/activity-detail/activity-detail?id=' + e.currentTarget.dataset.id });
  },

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
    this.applyCategoryFilter();
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

  onJoinActivity(e) {
    var activityId = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    var act = this.data.activities.find(function(a) { return a.id === activityId; });
    if (act && act.statusClass === 'closed') {
      wx.showToast({ title: '活动已结束', icon: 'none', duration: 1500 });
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
