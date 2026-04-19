// pages/square/square.js
var { getNoticeTop, getPostList, getNoticeList } = require('../../utils/request.js');

Page({
  data: {
    currentBanner: 0,
    banners: [],
    notices: [],
    posts: [],
    pullLoading: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 每次显示刷新登录状态
  },

  loadData() {
    var self = this;
    // 并行请求通知和帖子
    Promise.all([
      self.loadNotices(),
      self.loadPosts()
    ]).catch(function(err) {
      console.error('加载数据失败', err);
    });
  },

  loadNotices() {
    var self = this;
    return getNoticeTop()
      .then(function(notices) {
        // 将通知转成轮播图格式
        var banners = notices.map(function(n, i) {
          return {
            id: n.noticeId,
            image: 'https://picsum.photos/800/400?random=' + (i + 10),
            title: n.title,
            tag: n.type === 'SYSTEM' ? '系统通知' : n.type === 'ALL' ? '全校通知' : '学院通知'
          };
        });
        // 最多取前3条作为轮播
        self.setData({ banners: banners.slice(0, 3) });

        // 再请求更多通知（列表）
        return getNoticeList(1, 10);
      })
      .then(function(page) {
        var notices = (page.records || []).map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            time: n.createTime ? n.createTime.substring(0, 10) : '',
            hot: n.isTop === 1
          };
        });
        self.setData({ notices: notices });
      });
  },

  loadPosts() {
    var self = this;
    return getPostList(1, 20)
      .then(function(page) {
        var posts = (page.records || []).map(function(p) {
          var images = [];
          if (p.images) {
            try { images = JSON.parse(p.images); } catch(e) {}
          }
          return {
            id: p.postId,
            avatar: p.avatar || 'https://picsum.photos/200/200?random=10',
            nickname: p.nickname || '校园用户',
            content: p.content,
            images: images,
            likes: p.likeCount || 0,
            comments: p.commentCount || 0,
            time: self.formatTime(p.createTime),
            hot: p.isTop === 1,
            liked: false,
            viewCount: p.viewCount || 0
          };
        });
        self.setData({ posts: posts });
      });
  },

  formatTime(timeStr) {
    if (!timeStr) return '';
    var now = new Date();
    var date = new Date(timeStr.replace('T', ' '));
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 604800) return Math.floor(diff / 86400) + '天前';
    return timeStr.substring(0, 10);
  },

  onPullDownRefresh() {
    var self = this;
    this.setData({ pullLoading: true });
    this.loadData()
      .finally(function() {
        wx.stopPullDownRefresh();
        self.setData({ pullLoading: false });
        wx.showToast({ title: '刷新完成', icon: 'success', duration: 1000 });
      });
  },

  // 搜索
  onSearchInput(e) {
    var keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
  },

  // 通知铃铛
  onNoticeTap() {
    wx.navigateTo({ url: '/pages/college/college' });
  },

  // 轮播图点击
  onBannerTap(e) {
    var index = e.currentTarget.dataset.index;
    var banner = this.data.banners[index];
    wx.showToast({ title: banner.title, icon: 'none', duration: 2000 });
  },

  // 点击帖子
  onPostTap(e) {
    var postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/post-detail/post-detail?id=' + postId });
  },

  // 点赞
  onLikeTap(e) {
    var id = e.currentTarget.dataset.id;
    var posts = this.data.posts.map(function(post) {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    this.setData({ posts: posts });
  },

  // 评论
  onCommentTap(e) {
    var postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/post-detail/post-detail?id=' + postId });
  },

  // 分享
  onShareTap(e) {
    wx.showShareMenu({ withShareTicket: true });
  },

  // 发布帖子
  onPublishTap() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-post/publish-post' });
  },

  // 学院公告
  onCollegeTap() {
    wx.navigateTo({ url: '/pages/college/college' });
  },

  // 社团活动
  onActivityTap() {
    wx.switchTab({ url: '/pages/club/club' });
  }
});
