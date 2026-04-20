// pages/market/market.js
var { getGoodsPage, getCategoryList, getMyGoods } = require('../../utils/request.js');

Page({
  data: {
    currentTab: 0,
    currentCategory: 0,
    categories: [],
    allGoods: [],
    leftGoods: [],
    rightGoods: [],
    myGoods: [],
    pageNum: 1,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadCategories();
    this.loadGoods(true);
  },

  onShow() {
    if (this.data.currentTab === 1) {
      this.loadMyGoods();
    }
  },

  loadCategories() {
    var self = this;
    getCategoryList('goods')
      .then(function(list) {
        var categories = [{ categoryId: 0, name: '全部', icon: '🛍️' }].concat((list || []).map(function(c) {
          return { categoryId: c.categoryId, name: c.name, icon: c.icon || '📎' };
        }));
        self.setData({ categories: categories });
      })
      .catch(function() {});
  },

  loadGoods(reload) {
    var self = this;
    if (self.data.loading) return;
    if (!reload && !self.data.hasMore) return;

    var pageNum = reload ? 1 : self.data.pageNum;
    var categoryId = self.data.currentCategory === 0 ? '' : self.data.currentCategory;

    self.setData({ loading: true });
    getGoodsPage(pageNum, 20, categoryId)
      .then(function(page) {
        var records = (page.records || []).map(function(g) {
          var images = [];
          try { images = JSON.parse(g.images); } catch(e) {}
          return {
            id: g.itemId,
            title: g.title,
            price: g.price,
            originalPrice: g.originalPrice,
            image: images[0] || 'https://picsum.photos/400/400?random=50',
            categoryId: g.categoryId,
            seller: g.sellerName || '校园用户',
            avatar: g.sellerAvatar || 'https://picsum.photos/100/100?random=50',
            location: g.tradeLocation || '校园内',
            time: g.createTime ? self.formatTime(g.createTime) : '',
            likes: g.favoriteCount || 0,
            liked: false,
            status: g.status === 1 ? '在售' : g.status === 2 ? '已售' : '已下架',
            statusCode: g.status,
            views: g.viewCount || 0
          };
        });

        var allGoods = reload ? records : self.data.allGoods.concat(records);
        var hasMore = (page.records || []).length >= 20;
        self.setData({
          allGoods: allGoods,
          leftGoods: allGoods.filter(function(_, i) { return i % 2 === 0; }),
          rightGoods: allGoods.filter(function(_, i) { return i % 2 === 1; }),
          pageNum: pageNum + 1,
          hasMore: hasMore,
          loading: false
        });
      })
      .catch(function() {
        self.setData({ loading: false });
      });
  },

  loadMyGoods() {
    var self = this;
    getMyGoods()
      .then(function(list) {
        var goods = (list || []).map(function(g) {
          var images = [];
          try { images = JSON.parse(g.images); } catch(e) {}
          return {
            id: g.itemId,
            title: g.title,
            price: g.price,
            originalPrice: g.originalPrice,
            image: images[0] || 'https://picsum.photos/400/400?random=50',
            status: g.status === 1 ? '在售' : g.status === 2 ? '已售' : '已下架',
            statusCode: g.status,
            views: g.viewCount || 0,
            likes: g.favoriteCount || 0
          };
        });
        self.setData({ myGoods: goods });
      })
      .catch(function() {});
  },

  formatTime(timeStr) {
    if (!timeStr) return '';
    var now = new Date();
    var date = new Date(timeStr.replace('T', ' '));
    var diff = Math.floor((now - date) / 1000);
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 604800) return Math.floor(diff / 86400) + '天前';
    return timeStr.substring(0, 10);
  },

  onTabChange(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
    if (index === 1) this.loadMyGoods();
  },

  onCategoryTap(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ currentCategory: id, allGoods: [], leftGoods: [], rightGoods: [], pageNum: 1, hasMore: true });
    this.loadGoods(true);
    var cat = this.data.categories.find(function(c) { return c.categoryId === id; });
    wx.showToast({ title: '已筛选：' + (cat ? cat.name : '全部'), icon: 'none', duration: 1000 });
  },

  onSearchInput(e) {
    console.log('搜索关键词:', e.detail.value);
  },

  onGoodsTap(e) {
    wx.navigateTo({ url: '/pages/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id });
  },

  onPublishTap() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-goods/publish-goods' });
  },

  onLikeTap(e) {
    var id = e.currentTarget.dataset.id;
    var allGoods = this.data.allGoods.map(function(item) {
      if (item.id === id) {
        return Object.assign({}, item, {
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1
        });
      }
      return item;
    });
    var self = this;
    this.setData({ allGoods: allGoods }, function() {
      self.refreshWaterfall();
    });
  },

  refreshWaterfall() {
    this.setData({
      leftGoods: this.data.allGoods.filter(function(_, i) { return i % 2 === 0; }),
      rightGoods: this.data.allGoods.filter(function(_, i) { return i % 2 === 1; })
    });
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadGoods(false);
    }
  }
});
