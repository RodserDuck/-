// pages/lostfound-detail/lostfound-detail.js
var { getLostFoundDetail, resolveMediaUrl } = require('../../utils/request.js');

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
      .then(function(raw) {
        var imgs = [];
        if (raw.itemImage) {
          var s = String(raw.itemImage).trim();
          if (s.charAt(0) === '[') {
            try { imgs = JSON.parse(s).map(function(u) { return resolveMediaUrl(u); }); } catch (e) {}
          } else {
            imgs = [resolveMediaUrl(s)];
          }
        }
        var statusText = raw.status === 1
          ? (raw.type === 1 ? '寻找中' : '待认领')
          : raw.status === 2 ? (raw.type === 1 ? '已找到' : '已归还') : '已关闭';
        self.setData({
          item: {
            title: raw.title,
            type: raw.type === 1 ? 'lost' : 'found',
            image: imgs[0] || '',
            images: imgs,
            location: raw.location || '',
            time: raw.lostTime ? String(raw.lostTime).replace('T', ' ').substring(0, 16) : '',
            description: raw.description || '',
            contact: raw.contact || '',
            status: statusText,
            publisher: {
              avatar: '',
              nickname: ''
            }
          }
        });
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
