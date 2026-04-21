// pages/goods-detail/goods-detail.js
var { getGoodsDetail, createTrade, confirmTrade, cancelTrade, getMySell, getPendingTrade, getMyBuy, resolveMediaUrl } = require('../../utils/request.js');

Page({
  data: {
    goods: null,
    currentImageIndex: 0,
    goodsId: null,
    isOwner: false,
    isBuyer: false,
    tradeList: [],
    showTradeModal: false,
    remark: '',
    showMyTrade: false,
    myBuyList: []
  },

  onLoad(options) {
    var goodsId = options.id;
    this.setData({ goodsId: goodsId });
    this.loadGoods(goodsId);
  },

  onShow() {
    var goods = this.data.goods;
    if (goods) this.loadGoods(goods.itemId || this.data.goodsId);
  },

  loadGoods(goodsId) {
    var self = this;
    getGoodsDetail(goodsId)
      .then(function(g) {
        var userId = wx.getStorageSync('userId');
        var images = [];
        if (g.images) {
          try { images = JSON.parse(g.images); } catch(e) {}
        }
        images = images.map(function(u) { return resolveMediaUrl(u); });
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
            seller: {
              id: g.userId,
              nickname: g.sellerName || '校园用户',
              avatar: g.sellerAvatar ? resolveMediaUrl(g.sellerAvatar) : 'https://picsum.photos/100/100?random=50',
              college: g.sellerCollege || ''
            },
            contact: g.contact || '',
            status: g.status === 1 ? '在售' : g.status === 2 ? '已售' : '已下架',
            statusCode: g.status,
            isLiked: false
          },
          isOwner: userId && g.userId && String(userId) === String(g.userId)
        });
        // 卖家：加载待处理交易请求
        if (userId && g.userId && String(userId) === String(g.userId)) {
          self.loadTradeList();
        }
        // 买家：加载自己的购买记录
        self.loadMyBuyList(goodsId);
      })
      .catch(function() {});
  },

  loadTradeList() {
    var self = this;
    getPendingTrade()
      .then(function(list) {
        var myGoods = (list || []).filter(function(r) {
          return r.itemId === self.data.goods.id;
        });
        self.setData({ tradeList: myGoods });
      })
      .catch(function() {});
  },

  loadMyBuyList(goodsId) {
    var self = this;
    getMyBuy()
      .then(function(list) {
        var records = (list || []).filter(function(r) {
          return r.itemId === goodsId;
        });
        self.setData({
          myBuyList: records,
          isBuyer: records.length > 0
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

  onContactTap() {
    var goods = this.data.goods;
    if (!goods || !goods.contact) return;
    wx.showModal({
      title: '联系方式',
      content: goods.contact,
      confirmText: '复制',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({ data: goods.contact, success: function() {
            wx.showToast({ title: '已复制', icon: 'success' });
          }});
        }
      }
    });
  },

  // 买家：发起交易
  onBuyTap() {
    var self = this;
    var goods = this.data.goods;
    if (!goods) return;
    if (goods.statusCode !== 1) {
      wx.showToast({ title: '该商品已下架', icon: 'none' }); return;
    }
    wx.showModal({
      title: '发起交易',
      content: '确定要购买"' + goods.title + '"吗？\n卖家会收到通知，请线下交易后再确认完成。',
      confirmText: '发起交易',
      confirmColor: '#3b82f6',
      success: function(res) {
        if (res.confirm) {
          wx.showModal({
            title: '给卖家留言（选填）',
            editable: true,
            placeholderText: '可以说说交易时间地点...',
            success: function(confirmRes) {
              if (confirmRes.confirm) {
                createTrade(goods.id, confirmRes.content || '')
                  .then(function() {
                    wx.showToast({ title: '交易请求已发送，等待卖家确认', icon: 'none', duration: 3000 });
                    self.loadGoods(goods.id);
                  })
                  .catch(function(err) {
                    wx.showToast({ title: err.msg || '发起失败', icon: 'none' });
                  });
              }
            }
          });
        }
      }
    });
  },

  // 卖家：查看我的交易
  onMyTradeTap() {
    this.setData({ showMyTrade: true });
    this.loadTradeList();
  },

  // 卖家：确认完成交易
  onConfirmTrade(e) {
    var self = this;
    var recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认完成交易',
      content: '确认已收到货款，交易完成？',
      confirmColor: '#22c55e',
      success: function(res) {
        if (res.confirm) {
          confirmTrade(recordId)
            .then(function() {
              wx.showToast({ title: '交易已完成', icon: 'success' });
              self.loadGoods(self.data.goodsId);
              self.loadTradeList();
            })
            .catch(function(err) {
              wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
            });
        }
      }
    });
  },

  // 买家：确认完成交易
  onConfirmBuyTrade(e) {
    var self = this;
    var recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品且无问题，交易完成？',
      confirmColor: '#22c55e',
      success: function(res) {
        if (res.confirm) {
          confirmTrade(recordId)
            .then(function() {
              wx.showToast({ title: '交易已完成', icon: 'success' });
              self.loadGoods(self.data.goodsId);
              self.loadMyBuyList(self.data.goodsId);
            })
            .catch(function(err) {
              wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
            });
        }
      }
    });
  },

  // 取消交易（买家/卖家通用）
  onCancelTrade(e) {
    var self = this;
    var recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消交易',
      content: '确定要取消该交易吗？',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          cancelTrade(recordId)
            .then(function() {
              wx.showToast({ title: '已取消', icon: 'success' });
              self.loadTradeList();
              self.loadMyBuyList(self.data.goodsId);
            })
            .catch(function(err) {
              wx.showToast({ title: err.msg || '操作失败', icon: 'none' });
            });
        }
      }
    });
  },

  onPreviewImage(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: this.data.goods.images, current: src });
  },

});
