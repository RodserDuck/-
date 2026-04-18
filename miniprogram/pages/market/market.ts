// pages/market/market.ts
Page({
  data: {
    currentTab: 0,
    currentCategory: 0,
    categories: [
      { id: 0, name: '全部', icon: '🛍️' },
      { id: 1, name: '数码', icon: '💻' },
      { id: 2, name: '书籍', icon: '📚' },
      { id: 3, name: '服饰', icon: '👔' },
      { id: 4, name: '日用', icon: '🏠' },
      { id: 5, name: '运动', icon: '⚽' },
      { id: 6, name: '其他', icon: '📎' }
    ],
    allGoods: [
      {
        id: 1,
        title: 'iPad Air 5 64G 深空灰 99新',
        price: 3200,
        originalPrice: 4399,
        image: 'https://picsum.photos/400/400?random=40',
        category: 1,
        seller: '数码达人小王',
        avatar: 'https://picsum.photos/100/100?random=50',
        location: '西区宿舍',
        time: '10分钟前',
        likes: 12,
        liked: false,
        status: '在售'
      },
      {
        id: 2,
        title: '高等数学同济第七版上下册 送配套习题',
        price: 25,
        originalPrice: 89,
        image: 'https://picsum.photos/400/500?random=41',
        category: 2,
        seller: '学霸学姐',
        avatar: 'https://picsum.photos/100/100?random=51',
        location: '图书馆',
        time: '30分钟前',
        likes: 8,
        liked: false,
        status: '在售'
      },
      {
        id: 3,
        title: '耐克篮球鞋 42码 全新未拆封',
        price: 299,
        originalPrice: 599,
        image: 'https://picsum.photos/400/600?random=42',
        category: 3,
        seller: '运动男孩',
        avatar: 'https://picsum.photos/100/100?random=52',
        location: '体育馆',
        time: '1小时前',
        likes: 23,
        liked: false,
        status: '在售'
      },
      {
        id: 4,
        title: '罗技无线鼠标 M720 9成新',
        price: 80,
        originalPrice: 199,
        image: 'https://picsum.photos/400/400?random=43',
        category: 1,
        seller: '程序猿小李',
        avatar: 'https://picsum.photos/100/100?random=53',
        location: '科技楼',
        time: '2小时前',
        likes: 5,
        liked: false,
        status: '在售'
      },
      {
        id: 5,
        title: '台灯护眼LED 可充电 无极调光',
        price: 35,
        originalPrice: 79,
        image: 'https://picsum.photos/400/450?random=44',
        category: 4,
        seller: '宿舍好物',
        avatar: 'https://picsum.photos/100/100?random=54',
        location: '东区宿舍',
        time: '3小时前',
        likes: 15,
        liked: false,
        status: '在售'
      },
      {
        id: 6,
        title: 'Python编程从入门到实践 全套',
        price: 40,
        originalPrice: 119,
        image: 'https://picsum.photos/400/550?random=45',
        category: 2,
        seller: '代码爱好者',
        avatar: 'https://picsum.photos/100/100?random=55',
        location: '计算机学院',
        time: '5小时前',
        likes: 18,
        liked: false,
        status: '在售'
      },
      {
        id: 7,
        title: 'AirPods Pro 2 充电盒版 95新',
        price: 850,
        originalPrice: 1899,
        image: 'https://picsum.photos/400/400?random=46',
        category: 1,
        seller: '音乐发烧友',
        avatar: 'https://picsum.photos/100/100?random=56',
        location: '南区宿舍',
        time: '6小时前',
        likes: 32,
        liked: false,
        status: '已售'
      }
    ],
    myGoods: [
      {
        id: 101,
        title: '考研英语真题全套 2024版',
        price: 30,
        image: 'https://picsum.photos/200/200?random=60',
        status: '在售',
        views: 156,
        likes: 12
      },
      {
        id: 102,
        title: '民谣吉他入门级 送教材',
        price: 180,
        image: 'https://picsum.photos/200/200?random=61',
        status: '已售',
        views: 89,
        likes: 5
      }
    ]
  },

  onLoad() {
    this.refreshWaterfall();
  },

  refreshWaterfall() {
    const all = this.data.allGoods;
    this.setData({
      leftGoods: all.filter((_, i) => i % 2 === 0),
      rightGoods: all.filter((_, i) => i % 2 === 1)
    });
  },

  onTabChange(e: any) {
    this.setData({ currentTab: parseInt(e.currentTarget.dataset.index) });
  },

  onCategoryTap(e: any) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentCategory: id });
    wx.showToast({ title: `已筛选：${this.data.categories[id].name}`, icon: 'none', duration: 1000 });
  },

  onSearchInput(e: any) {
    console.log('搜索关键词:', e.detail.value);
  },

  onGoodsTap(e: any) {
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPublishTap() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-goods/publish-goods' });
  },

  onLikeTap(e: any) {
    const id = e.currentTarget.dataset.id;
    const allGoods = this.data.allGoods.map(item => {
      if (item.id === id) {
        return {
          ...item,
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    });
    this.setData({ allGoods }, () => this.refreshWaterfall());
    const item = allGoods.find(i => i.id === id);
    wx.showToast({
      title: item.liked ? '已收藏' : '取消收藏',
      icon: 'success',
      duration: 800
    });
  },

  onEditGoods(e: any) {
    wx.showToast({ title: '编辑商品', icon: 'none' });
  },

  onOffShelf(e: any) {
    const id = e.currentTarget.dataset.id;
    const myGoods = this.data.myGoods.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === '在售' ? '已售' : '在售' };
      }
      return item;
    });
    this.setData({ myGoods });
    wx.showToast({ title: '操作成功', icon: 'success', duration: 1200 });
  },

  onDeleteGoods(e: any) {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      confirmColor: '#f87171',
      success: (res) => {
        if (res.confirm) {
          const myGoods = this.data.myGoods.filter(item => item.id !== e.currentTarget.dataset.id);
          this.setData({ myGoods });
          wx.showToast({ title: '已删除', icon: 'success', duration: 1200 });
        }
      }
    });
  }
});
