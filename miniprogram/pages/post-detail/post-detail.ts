// pages/post-detail/post-detail.ts
Page({
  data: {
    post: {
      id: 1,
      avatar: 'https://picsum.photos/100/100?random=10',
      nickname: '校园小记者',
      content: '今天食堂三楼新开的麻辣烫真的超级好吃！推荐给大家，价格也很实惠~',
      images: ['https://picsum.photos/600/600?random=20'],
      likes: 128,
      comments: 32,
      time: '2小时前',
      isLiked: false
    },
    commentList: [
      {
        id: 1,
        avatar: 'https://picsum.photos/100/100?random=30',
        nickname: '吃货小王',
        content: '真的吗？明天就去试试！',
        time: '1小时前',
        likes: 5
      },
      {
        id: 2,
        avatar: 'https://picsum.photos/100/100?random=31',
        nickname: '美食探员',
        content: '同意！我也去吃过，味道确实不错',
        time: '30分钟前',
        likes: 3
      }
    ],
    inputValue: ''
  },

  onLoad(options: any) {
    const postId = options.id;
    console.log('查看帖子详情，ID:', postId);
  },

  // 点赞帖子
  onLikeTap() {
    const post = this.data.post;
    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
    this.setData({ post });
    wx.showToast({
      title: post.isLiked ? '点赞成功' : '取消点赞',
      icon: 'none'
    });
  },

  // 分享
  onShareTap() {
    wx.showShareMenu({ withShareTicket: true });
  },

  // 输入评论
  onInput(e: any) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送评论
  onSendComment() {
    const content = this.data.inputValue.trim();
    if (!content) {
      wx.showToast({ title: '请输入评论', icon: 'none' });
      return;
    }
    
    const newComment = {
      id: Date.now(),
      avatar: 'https://picsum.photos/100/100?random=99',
      nickname: '我',
      content: content,
      time: '刚刚',
      likes: 0
    };
    
    this.setData({
      commentList: [...this.data.commentList, newComment],
      inputValue: '',
      'post.comments': this.data.post.comments + 1
    });
    
    wx.showToast({ title: '评论成功', icon: 'success' });
  },

  // 点赞评论
  onLikeComment(e: any) {
    const index = e.currentTarget.dataset.index;
    const commentList = this.data.commentList.map((item, i) => {
      if (i === index) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    this.setData({ commentList });
  },

  onShareAppMessage() {
    return {
      title: this.data.post.content.substring(0, 50) + '...',
      path: `/pages/post-detail/post-detail?id=${this.data.post.id}`
    };
  }
});
