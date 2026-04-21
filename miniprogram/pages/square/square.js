// pages/square/square.js
var { getNoticeTop, getPostList, getNoticeList, resolveMediaUrl } = require('../../utils/request.js');

/** 列表摘要：有标题时正文去掉与标题重复的前缀，避免 SQL 回填后与正文重复两行 */
function buildPostCard(p) {
  var title = (p.title && String(p.title).trim()) ? String(p.title).trim() : '';
  var content = p.content || '';
  var snippet = content;
  if (title && content.indexOf(title) === 0) {
    snippet = content.substring(title.length).replace(/^\s+/, '');
  }
  if (!title) {
    snippet = content.length > 140 ? content.substring(0, 140) + '...' : content;
  } else if (snippet.length > 140) {
    snippet = snippet.substring(0, 140) + '...';
  }
  return { title: title, snippet: snippet };
}

Page({
  data: {
    currentBanner: 0,
    banners: [],
    schoolNotices: [],
    posts: [],
    pullLoading: false,
    currentFilter: '',
    filterOptions: [
      { label: '全部', value: '' },
      { label: '🌈 日常分享', value: '日常分享' },
      { label: '📚 学习交流', value: '学习交流' },
      { label: '🎉 活动招募', value: '活动招募' },
      { label: '🤝 互助问答', value: '互助问答' },
      { label: '💡 校园吐槽', value: '校园吐槽' },
      { label: '🎵 兴趣爱好', value: '兴趣爱好' }
    ]
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    var self = this;
    Promise.all([
      self.loadSchoolNotices(),
      self.loadPosts()
    ]).catch(function(err) {
      console.error('加载数据失败', err);
    });
  },

  loadSchoolNotices() {
    var self = this;
    return getNoticeTop()
      .then(function(notices) {
        var banners = notices.map(function(n, i) {
          return {
            id: n.noticeId,
            image: 'https://picsum.photos/800/400?random=' + (i + 10),
            title: n.title,
            tag: n.type === 'SYSTEM' ? '系统通知' : n.type === 'ALL' ? '全校通知' : '学院通知'
          };
        });
        self.setData({ banners: banners.slice(0, 3) });

        return getNoticeList(1, 10);
      })
      .then(function(page) {
        var schoolNotices = (page.records || []).map(function(n) {
          return {
            id: n.noticeId,
            title: n.title,
            time: n.createTime ? n.createTime.substring(0, 10) : '',
            hot: n.isTop === 1
          };
        });
        self.setData({ schoolNotices: schoolNotices });
      });
  },

  loadPosts(category) {
    var self = this;
    var currentFilter = category !== undefined ? category : self.data.currentFilter;
    return getPostList(1, 20, currentFilter)
      .then(function(page) {
        var posts = (page.records || []).map(function(p) {
          var images = [];
          if (p.images) {
            try { images = JSON.parse(p.images); } catch(e) {}
          }
          var card = buildPostCard(p);
          return {
            id: p.postId,
            avatar: p.avatar ? resolveMediaUrl(p.avatar) : 'https://picsum.photos/200/200?random=10',
            nickname: p.nickname || '校园用户',
            title: card.title,
            snippet: card.snippet,
            images: images.map(function(u) { return resolveMediaUrl(u); }),
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

  /** 进入搜索详情页（校园广场） */
  onOpenSearch() {
    wx.navigateTo({ url: '/pages/search/search?scope=post' });
  },

  // 校园公告：t_notice 列表页（非学院公告）
  onSchoolNoticeTap() {
    wx.navigateTo({ url: '/pages/campus-notice/campus-notice' });
  },

  /** 滚动条单条 → 校园公告详情（与轮播同源） */
  onSchoolNoticeItemTap(e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({ url: '/pages/notice-detail/notice-detail?id=' + id });
    }
  },

  // 学院广场 - 跳转到学院通知
  onCollegeNoticeTap() {
    wx.navigateTo({ url: '/pages/college/college?tab=college' });
  },

  // 二手交易
  onMarketTap() {
    wx.switchTab({ url: '/pages/market/market' });
  },

  // 失物招领
  onLostFoundTap() {
    wx.switchTab({ url: '/pages/lostfound/lostfound' });
  },

  // 通知铃铛
  onNoticeTap() {
    this.onSchoolNoticeTap();
  },

  // 轮播图点击 - 跳转到公告详情
  onBannerTap(e) {
    var index = e.currentTarget.dataset.index;
    var banner = this.data.banners[index];
    if (banner && banner.id) {
      wx.navigateTo({ url: '/pages/notice-detail/notice-detail?id=' + banner.id });
    } else {
      wx.showToast({ title: banner.title, icon: 'none', duration: 2000 });
    }
  },

  // 动态筛选
  onFilterTap(e) {
    var filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.loadPosts(filter);
  },

  // 点击帖子 - 跳转到详情
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

  // 评论 - 跳转到详情页
  onCommentTap(e) {
    var postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/post-detail/post-detail?id=' + postId });
  },

  // 发布帖子
  onPublishTap() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-post/publish-post' });
  }
});
