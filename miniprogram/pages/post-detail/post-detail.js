// pages/post-detail/post-detail.js
var { getPostDetail, getCommentList, saveComment, likePost, unlikePost } = require('../../utils/request.js');

Page({
  data: {
    post: null,
    commentList: [],
    inputValue: '',
    postId: null,
    replyTo: null,
    replyToNickname: '',
    replyPlaceholder: '写评论...',
    keyboardHeight: 0
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
            college: post.college || '',
            content: post.content,
            images: images,
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            time: post.createTime ? self.formatTime(post.createTime) : '',
            isLiked: false,
            viewCount: post.viewCount || 0,
            category: post.category || ''
          }
        });
      })
      .catch(function() {});
  },

  loadComments(postId) {
    var self = this;
    getCommentList(postId)
      .then(function(comments) {
        self.setData({ commentList: comments || [] });
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
    if (diff < 604800) return Math.floor(diff / 86400) + '天前';
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

  // 点击回复按钮（在评论项上）
  onReplyTap(e) {
    var comment = e.currentTarget.dataset.comment;
    this.setData({
      replyTo: comment.id,
      replyToNickname: comment.nickname,
      replyPlaceholder: '回复 @' + comment.nickname,
      scrollToComment: true
    });
    this.focusInput();
  },

  focusInput() {
    setTimeout(() => {
      this.setData({ focusInput: true });
    }, 100);
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onReplyInputFocus() {
    this.setData({ focusInput: true });
  },

  onSendComment() {
    var self = this;
    var content = this.data.inputValue.trim();
    if (!content) { wx.showToast({ title: '请输入评论', icon: 'none' }); return; }
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }

    var postId = this.data.postId;
    var replyTo = this.data.replyTo;
    var replyToNickname = this.data.replyToNickname;

    var data = { postId: postId, content: content };
    if (replyTo) {
      data.parentId = replyTo;
      // 找到被回复者的 userId
      var comment = self.data.commentList.find(function(c) { return c.id === replyTo; });
      if (comment) {
        data.replyToUserId = comment.userId;
      }
    }

    saveComment(data)
      .then(function() {
        wx.showToast({ title: '评论成功', icon: 'success' });
        self.setData({ inputValue: '', replyTo: null, replyToNickname: '', replyPlaceholder: '写评论...' });
        self.loadComments(postId);
      })
      .catch(function(err) {
        wx.showToast({ title: err.msg || '评论失败', icon: 'none' });
      });
  },

  // 取消回复
  onCancelReply() {
    this.setData({ replyTo: null, replyToNickname: '', replyPlaceholder: '写评论...' });
  },

  // 预览图片
  onPreviewImage(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: this.data.post.images, current: src });
  },

  onBack() { wx.navigateBack(); }
});
