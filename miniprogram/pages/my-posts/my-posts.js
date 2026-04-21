// pages/my-posts/my-posts.js
var { getMyPosts, deletePost, resolveMediaUrl } = require('../../utils/request.js');

function buildPostCard(p) {
  var title = (p.title && String(p.title).trim()) ? String(p.title).trim() : '';
  var content = p.content || '';
  var snippet = content;
  if (title && content.indexOf(title) === 0) {
    snippet = content.substring(title.length).replace(/^\s+/, '');
  }
  if (!title) {
    snippet = content.length > 120 ? content.substring(0, 120) + '...' : content;
  } else if (snippet.length > 120) {
    snippet = snippet.substring(0, 120) + '...';
  }
  return { title: title, snippet: snippet };
}

Page({
  data: {
    posts: [],
    loading: false,
    empty: false
  },

  onLoad() {
    this.loadPosts();
  },

  onShow() {
    this.loadPosts();
  },

  loadPosts() {
    var self = this;
    self.setData({ loading: true });
    getMyPosts()
      .then(function(list) {
        var posts = (list || []).map(function(p) {
          var images = [];
          try { images = JSON.parse(p.images || '[]'); } catch(e) {}
          var card = buildPostCard(p);
          return {
            id: p.postId,
            avatar: p.avatar ? resolveMediaUrl(p.avatar) : 'https://picsum.photos/100/100?random=10',
            nickname: p.nickname || '校园用户',
            title: card.title,
            snippet: card.snippet,
            images: images.map(function(u) { return resolveMediaUrl(u); }),
            likes: p.likeCount || 0,
            comments: p.commentCount || 0,
            time: p.createTime ? self.formatTime(p.createTime) : '',
            viewCount: p.viewCount || 0,
            category: p.category || ''
          };
        });
        self.setData({ posts: posts, loading: false, empty: posts.length === 0 });
      })
      .catch(function() {
        self.setData({ loading: false });
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

  onPostTap(e) {
    wx.navigateTo({ url: '/pages/post-detail/post-detail?id=' + e.currentTarget.dataset.id });
  },

  onDeleteTap(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇帖子吗？',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          deletePost(id)
            .then(function() {
              wx.showToast({ title: '已删除', icon: 'success' });
              self.loadPosts();
            })
            .catch(function() {
              wx.showToast({ title: '删除失败', icon: 'none' });
            });
        }
      }
    });
  },

  onPublishTap() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/publish-post/publish-post' });
  }
});
