var { getLostFoundDetail, submitLostFoundClaim, resolveMediaUrl } = require('../../utils/request.js');

Page({
  data: {
    item: null,
    id: null,
    claimRemark: '',
    claiming: false
  },

  onLoad(options) {
    var id = options.id;
    if (!id) return;
    this.setData({ id: Number(id) });
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
        var statusText = raw.status === 0 ? '待处理' : raw.status === 1 ? '进行中' : '已找到';
        self.setData({
          item: {
            id: raw.lostFoundId,
            userId: raw.userId,
            title: raw.title,
            type: raw.type === 1 ? 'lost' : 'found',
            image: imgs[0] || '',
            images: imgs,
            location: raw.location || '',
            time: raw.lostTime ? String(raw.lostTime).replace('T', ' ').substring(0, 16) : '',
            description: raw.description || '',
            contact: raw.contact || '',
            status: statusText,
            statusCode: raw.status,
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
  },

  onClaimRemarkInput(e) {
    this.setData({ claimRemark: e.detail.value || '' });
  },

  onClaimSubmit() {
    var item = this.data.item;
    if (!item || item.type !== 'found') return;
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    if (this.data.claiming) return;
    var self = this;
    this.setData({ claiming: true });
    submitLostFoundClaim(item.id, this.data.claimRemark || '')
      .then(function() {
        wx.showToast({ title: '已提交认领，等待审核', icon: 'none' });
        self.setData({ claimRemark: '' });
        self.loadItem(item.id);
      })
      .catch(function() {})
      .finally(function() {
        self.setData({ claiming: false });
      });
  }
});
