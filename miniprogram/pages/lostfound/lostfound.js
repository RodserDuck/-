// pages/lostfound/lostfound.js
var { getLostFoundList } = require('../../utils/request.js');

Page({
  data: {
    currentTab: 0,
    lostItems: [],
    foundItems: []
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    var self = this;
    getLostFoundList(1, 50, '')
      .then(function(page) {
        var records = page.records || [];
        var lost = [];
        var found = [];
        records.forEach(function(item) {
          var obj = {
            id: item.lostFoundId,
            title: item.title,
            itemName: item.itemName,
            type: item.type === 1 ? 'lost' : 'found',
            image: item.itemImage || '',
            location: item.location || '',
            time: item.lostTime ? item.lostTime.replace('T', ' ').substring(0, 16) : '',
            contact: item.contact || '',
            description: item.description || '',
            status: item.status === 1 ? (item.type === 1 ? '寻找中' : '待认领')
                       : item.status === 2 ? '已找到' : '已关闭'
          };
          if (item.type === 1) lost.push(obj);
          else found.push(obj);
        });
        self.setData({ lostItems: lost, foundItems: found });
      })
      .catch(function() {});
  },

  onTabChange(e) {
    this.setData({ currentTab: parseInt(e.currentTarget.dataset.index) });
  },

  onPublishLost() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound?type=lost' });
  },

  onPublishFound() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound?type=found' });
  },

  onItemTap(e) {
    wx.navigateTo({ url: '/pages/lostfound-detail/lostfound-detail?id=' + e.currentTarget.dataset.id });
  },

  onContactTap(e) {
    var contact = e.currentTarget.dataset.contact;
    wx.showModal({
      title: '联系方式',
      content: contact,
      confirmText: '复制',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({ data: contact, success: function() { wx.showToast({ title: '已复制', icon: 'success' }); } });
        }
      }
    });
  },

  onSearchInput(e) {
    console.log('搜索关键词:', e.detail.value);
  },

  onFilterTap() {
    wx.showActionSheet({
      itemList: ['全部', '寻找中/待认领', '已找到/已归还'],
      success: function(res) { wx.showToast({ title: '筛选功能开发中', icon: 'none' }); }
    });
  }
});
