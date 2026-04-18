// pages/lostfound/lostfound.ts
Page({
  data: {
    currentTab: 0,
    lostItems: [
      {
        id: 1,
        title: '丢失黑色钱包，内有学生证',
        type: 'lost',
        image: 'https://picsum.photos/300/300?random=60',
        location: '图书馆三楼阅览室',
        time: '2026-03-25 14:00',
        contact: '微信：wx123456',
        description: '黑色长款钱包，内有学生证、身份证和少量现金，捡到请联系，必有重谢！',
        status: '寻找中'
      },
      {
        id: 2,
        title: '丢失一串宿舍钥匙',
        type: 'lost',
        image: '',
        location: '食堂二楼',
        time: '2026-03-24 12:30',
        contact: '电话：138****5678',
        description: '钥匙扣上有一个小熊挂件，共3把钥匙',
        status: '寻找中'
      },
      {
        id: 3,
        title: '丢失AirPods Pro耳机',
        type: 'lost',
        image: 'https://picsum.photos/300/300?random=61',
        location: '体育馆篮球场',
        time: '2026-03-23 18:00',
        contact: '微信：apple_user',
        description: '白色AirPods Pro，耳机盒上有贴纸',
        status: '已找回'
      }
    ],
    foundItems: [
      {
        id: 1,
        title: '捡到校园卡一张',
        type: 'found',
        image: 'https://picsum.photos/300/300?random=62',
        location: '教学楼A座门口',
        time: '2026-03-25 09:00',
        contact: '电话：139****1234',
        description: '计算机学院张三同学的校园卡，请失主联系我领取',
        status: '待认领'
      },
      {
        id: 2,
        title: '捡到蓝牙耳机',
        type: 'found',
        image: 'https://picsum.photos/300/300?random=63',
        location: '操场看台',
        time: '2026-03-24 20:00',
        contact: '微信：finder001',
        description: '黑色蓝牙耳机一只，品牌未知',
        status: '待认领'
      },
      {
        id: 3,
        title: '捡到钱包已归还',
        type: 'found',
        image: '',
        location: '快递站',
        time: '2026-03-23 16:00',
        contact: '已归还',
        description: '棕色钱包，已交至失物招领处',
        status: '已归还'
      }
    ]
  },

  onLoad() {
    // 页面加载
  },

  // 切换标签
  onTabChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  // 发布寻物
  onPublishLost() {
    wx.navigateTo({
      url: '/pages/publish-lostfound/publish-lostfound?type=lost'
    });
  },

  // 发布招领
  onPublishFound() {
    wx.navigateTo({
      url: '/pages/publish-lostfound/publish-lostfound?type=found'
    });
  },

  // 查看详情
  onItemTap(e) {
    const itemId = e.currentTarget.dataset.id;
    const itemType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/lostfound-detail/lostfound-detail?id=${itemId}&type=${itemType}`
    });
  },

  // 联系发布者
  onContactTap(e) {
    const contact = e.currentTarget.dataset.contact;
    wx.showModal({
      title: '联系方式',
      content: contact,
      confirmText: '复制',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: contact,
            success: () => {
              wx.showToast({ title: '已复制', icon: 'success' });
            }
          });
        }
      }
    });
  },

  // 搜索
  onSearchInput(e) {
    const searchKey = e.detail.value;
    console.log('搜索关键词:', searchKey);
    // 搜索逻辑待实现
  },

  // 筛选状态
  onFilterTap() {
    wx.showActionSheet({
      itemList: ['全部', '寻找中/待认领', '已找回/已归还'],
      success: (tapResult) => {
        console.log('用户选择了:', tapResult.tapIndex);
        wx.showToast({ title: '筛选功能开发中', icon: 'none' });
      }
    });
  }
});
