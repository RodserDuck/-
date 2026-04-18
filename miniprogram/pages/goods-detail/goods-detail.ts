// pages/goods-detail/goods-detail.ts
Page({
  data: {
    goods: {
      id: 1,
      title: 'iPad Air 5 64G 深空灰',
      price: 3200,
      originalPrice: 4399,
      images: [
        'https://picsum.photos/600/600?random=40',
        'https://picsum.photos/600/600?random=41'
      ],
      description: '去年9月购买，保修期内，无磕碰无划痕，功能完好。配件齐全。',
      condition: '95新',
      location: '西区宿舍',
      seller: {
        id: 1,
        nickname: '数码达人',
        avatar: 'https://picsum.photos/100/100?random=50'
      },
      status: '在售',
      isLiked: false
    },
    currentImageIndex: 0
  },

  onLoad(options: any) {
    const goodsId = options.id;
    console.log('查看商品详情，ID:', goodsId);
  },

  // 轮播图切换
  onSwiperChange(e: any) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  // 收藏
  onLikeTap() {
    const goods = this.data.goods;
    goods.isLiked = !goods.isLiked;
    this.setData({ goods });
    wx.showToast({
      title: goods.isLiked ? '收藏成功' : '取消收藏',
      icon: 'none'
    });
  },

  // 联系卖家
  onContactTap() {
    wx.navigateTo({
      url: `/pages/chat/chat?sellerId=${this.data.goods.seller.id}&goodsId=${this.data.goods.id}`
    });
  },

  // 立即购买
  onBuyTap() {
    if (this.data.goods.status !== '在售') {
      wx.showToast({ title: '该商品已售出', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '发起交易',
      content: `确定要购买"${this.data.goods.title}"吗？`,
      confirmText: '发起交易',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '交易请求已发送', icon: 'success' });
        }
      }
    });
  }
});
