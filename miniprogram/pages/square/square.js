// pages/square/square.ts
Page({
  data: {
    currentBanner: 0,
    banners: [
      {
        id: 1,
        image: 'https://picsum.photos/800/400?random=1',
        title: '2026年春季校园马拉松报名开启',
        tag: '校园赛事'
      },
      {
        id: 2,
        image: 'https://picsum.photos/800/400?random=2',
        title: '图书馆延长开放时间通知',
        tag: '重要通知'
      },
      {
        id: 3,
        image: 'https://picsum.photos/800/400?random=3',
        title: '新学期选课系统已开放',
        tag: '教务信息'
      }
    ],
    notices: [
      { id: 1, title: '关于2026年清明节放假安排的通知', time: '2026-03-25', hot: true },
      { id: 2, title: '图书馆数字资源使用培训讲座报名', time: '2026-03-24', hot: false },
      { id: 3, title: '学生证补办流程及注意事项', time: '2026-03-23', hot: false },
      { id: 4, title: '春季学期勤工助学岗位招聘', time: '2026-03-22', hot: true }
    ],
    posts: [
      {
        id: 1,
        avatar: 'https://picsum.photos/200/200?random=10',
        nickname: '摄影爱好者小李',
        content: '今天天气超级好，傍晚在校园里随手拍了几张！夕阳下的图书馆真的太美了，有没有人一起去拍照呀~',
        images: [
          'https://picsum.photos/600/600?random=20',
          'https://picsum.photos/600/600?random=21',
          'https://picsum.photos/600/600?random=22'
        ],
        likes: 328,
        comments: 56,
        time: '1小时前',
        hot: true,
        liked: false
      },
      {
        id: 2,
        avatar: 'https://picsum.photos/200/200?random=11',
        nickname: '学习狂人小明',
        content: '分享一份期末复习资料，涵盖高数、线代、概率论全套笔记，整理了两个月，亲测有效！',
        images: ['https://picsum.photos/600/600?random=23', 'https://picsum.photos/600/600?random=24'],
        likes: 512,
        comments: 89,
        time: '3小时前',
        hot: true,
        liked: false
      },
      {
        id: 3,
        avatar: 'https://picsum.photos/200/200?random=12',
        nickname: '美食探索家',
        content: '强烈推荐食堂三楼新开的麻辣烫！味道一绝，价格也很实惠，人均20元吃到撑，周末约起来~',
        images: ['https://picsum.photos/600/600?random=25'],
        likes: 256,
        comments: 42,
        time: '5小时前',
        hot: false,
        liked: false
      },
      {
        id: 4,
        avatar: 'https://picsum.photos/200/200?random=13',
        nickname: '校园歌手大赛官方',
        content: '🎤 校园十大歌手大赛初赛圆满结束！恭喜晋级的30位选手，复赛将于4月20日在大学生活动中心举行，敬请期待！',
        images: [],
        likes: 189,
        comments: 34,
        time: '8小时前',
        hot: false,
        liked: false
      }
    ]
  },

  onLoad() {
    // 初始化页面数据
  },

  onShow() {
    // 每次显示页面检查登录状态
  },

  onPullDownRefresh() {
    wx.showToast({ title: '刷新中...', icon: 'loading', duration: 800 });
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新完成', icon: 'success', duration: 1000 });
    }, 800);
  },

  // 搜索
  onSearchInput(e) {
    const keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
  },

  // 通知铃铛
  onNoticeTap() {
    wx.navigateTo({ url: '/pages/college/college' });
  },

  // 轮播图点击
  onBannerTap(e) {
    const index = e.currentTarget.dataset.index;
    const banner = this.data.banners[index];
    wx.showToast({ title: banner.title, icon: 'none', duration: 2000 });
  },

  // 点击帖子
  onPostTap(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/post-detail/post-detail?id=${postId}` });
  },

  // 点赞
  onLikeTap(e) {
    const id = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    this.setData({ posts });
  },

  // 评论
  onCommentTap(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/post-detail/post-detail?id=${postId}` });
  },

  // 分享
  onShareTap(e) {
    wx.showShareMenu({ withShareTicket: true });
  },

  // 发布帖子
  onPublishTap() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
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
