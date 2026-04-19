// pages/lostfound-detail/lostfound-detail.js
var { getLostFoundDetail } = require('../../utils/request.js');

Page({
  data: {
    item: null
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.loadItem(id);
  },

  loadItem(id) {
    var self = this;
    getLostFoundDetail(id)
      .then(function(item) {
        self.setData({ item: item });
      })
      .catch(function() {});
  },

  onContactTap() {
    var item = this.data.item;
    if (!item || !item.contact) return;
    wx.showModal({
      title: '联系方式',
      content: item.contact,
      confirmText: '复制',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({ data: item.contact, success: function() { wx.showToast({ title: '已复制', icon: 'success' }); } });
        }
      }
    });
  }
});
