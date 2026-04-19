// pages/post-detail/post-detail.js
var { getPostDetail, getCommentList, saveComment, likePost, unlikePost } = require('../../utils/request.js');

Page({
  data: {
    post: null,
    commentList: [],
    inputValue: '',
    postId: null
  },

  onLoad(options) {
    var postId = options.id;
    this.setData({ postId: postId });
    this.loadPost(postId);
    this.loadComments(postId);
  },

  loadPost(postId) {
    var self = this;
    getPostDetail(postId)
      .then(function(post) {
        var images = [];
        if (post.images) {
          try { images = JSON.parse(post.images); } catch(e) {}
        }
        self.setData({
          post: {
            id: post.postId,
            avatar: post.avatar || 'https://picsum.photos/100/100?random=10',
            nickname: post.nickname || '校园用户',
            content: post.content,
            images: images,
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            time: post.createTime ? self.formatTime(post.createTime) : '',
            isLiked: false,
            viewCount: post.viewCount || 0
          }
        });
      })
      .catch(function() {});
  },

  loadComments(postId) {
    var self = this;
    getCommentList(postId)
      .then(function(comments) {
        var list = (comments || []).map(function(c) {
          return {
            id: c.commentId,
            avatar: c.avatar || 'https://picsum.photos/100/100?random=30',
            nickname: c.nickname || '用户',
            content: c.content,
            time: c.createTime ? self.formatTime(c.createTime) : '刚刚',
            likes: c.likeCount || 0
          };
        });
        self.setData({ commentList: list });
      })
      .catch(function() {});
  },

  formatTime(timeStr) {
    if (!timeStr) return '';
    var now = new Date();
    var date = new Date(timeStr.replace('T', ' '));
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    return timeStr.substring(0, 10);
  },

  onLikeTap() {
    var self = this;
    var post = this.data.post;
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    var action = post.isLiked ? unlikePost(post.id) : likePost(post.id);
    action.then(function() {
      post.isLiked = !post.isLiked;
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
      self.setData({ post: post });
    }).catch(function() {});
  },

  onShareTap() {
    wx.showShareMenu({ withShareTicket: true });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSendComment() {
    var self = this;
    var content = this.data.inputValue.trim();
    if (!content) { wx.showToast({ title: '请输入评论', icon: 'none' }); return; }
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    saveComment({ postId: this.data.postId, content: content })
      .then(function() {
        wx.showToast({ title: '评论成功', icon: 'success' });
        self.setData({ inputValue: '' });
        self.loadComments(self.data.postId);
      })
      .catch(function() {
        wx.showToast({ title: '评论失败', icon: 'none' });
      });
  },

  onLikeComment(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onShareAppMessage() {
    var post = this.data.post;
    return {
      title: post ? post.content.substring(0, 50) + '...' : '校园动态',
      path: '/pages/post-detail/post-detail?id=' + (post ? post.id : '')
    };
  }
});
