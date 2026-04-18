// pages/lostfound-detail/lostfound-detail.ts
Page({
  data: {
    item: {
      id: 1,
      title: '丢失黑色钱包，内有学生证',
      type: 'lost',
      image: 'https://picsum.photos/600/400?random=60',
      location: '图书馆三楼阅览室',
      time: '2026-03-25 14:00',
      contact: '微信：wx123456',
      description: '黑色长款钱包，内有学生证、身份证和少量现金，捡到请联系，必有重谢！',
      status: '寻找中',
      publisher: {
        nickname: '失主小明',
        avatar: 'https://picsum.photos/100/100?random=70'
      }
    }
  },

  onLoad(options) {
    const itemId = options.id;
    const itemType = options.type;
    console.log('查看失物招领详情，ID:', itemId, '类型:', itemType);
  },

  // 联系发布者
  onContactTap() {
    wx.showModal({
      title: '联系发布者',
      content: this.data.item.contact,
      confirmText: '复制',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.item.contact,
            success: () => wx.showToast({ title: '已复制联系方式', icon: 'success' })
          });
        }
      }
    });
  }
});
