// pages/goods-detail/goods-detail.js
var { getGoodsDetail } = require('../../utils/request.js');

Page({
  data: {
    goods: null,
    currentImageIndex: 0,
    goodsId: null
  },

  onLoad(options) {
    var goodsId = options.id;
    this.setData({ goodsId: goodsId });
    this.loadGoods(goodsId);
  },

  loadGoods(goodsId) {
    var self = this;
    getGoodsDetail(goodsId)
      .then(function(g) {
        var images = [];
        if (g.images) {
          try { images = JSON.parse(g.images); } catch(e) {}
        }
        self.setData({
          goods: {
            id: g.itemId,
            title: g.title,
            price: g.price,
            originalPrice: g.originalPrice,
            images: images.length ? images : ['https://picsum.photos/600/600?random=40'],
            description: g.description || '',
            condition: self.getConditionText(g.conditionLevel),
            location: g.tradeLocation || '',
            seller: { id: g.userId, nickname: '校园用户', avatar: 'https://picsum.photos/100/100?random=50' },
            contact: g.contact || '',
            status: g.status === 1 ? '在售' : g.status === 2 ? '已售' : '已下架',
            isLiked: false
          }
        });
      })
      .catch(function() {});
  },

  getConditionText(level) {
    var map = { 1: '全新', 2: '99新', 3: '95新', 4: '9成新', 5: '8成新' };
    return map[level] || '95新';
  },

  onSwiperChange(e) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  onLikeTap() {
    var goods = this.data.goods;
    if (!goods) return;
    goods.isLiked = !goods.isLiked;
    this.setData({ goods: goods });
    wx.showToast({ title: goods.isLiked ? '收藏成功' : '取消收藏', icon: 'none' });
  },

  onContactTap() {
    var goods = this.data.goods;
    if (!goods || !goods.contact) return;
    wx.showModal({
      title: '联系方式',
      content: goods.contact,
      confirmText: '复制',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({ data: goods.contact, success: function() { wx.showToast({ title: '已复制', icon: 'success' }); } });
        }
      }
    });
  },

  onBuyTap() {
    var goods = this.data.goods;
    if (!goods) return;
    if (goods.status !== '在售') { wx.showToast({ title: '该商品已售出', icon: 'none' }); return; }
    wx.showModal({
      title: '发起交易',
      content: '确定要购买"' + goods.title + '"吗？',
      confirmText: '发起交易',
      success: function(res) {
        if (res.confirm) { wx.showToast({ title: '交易请求已发送', icon: 'success' }); }
      }
    });
  }
});
