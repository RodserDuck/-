// pages/notice-detail/notice-detail.js
var { getNoticeDetail } = require('../../utils/request.js');

Page({
  data: {
    notice: null,
    loading: true
  },

  onLoad(options) {
    var id = options.id;
    if (!id) {
      wx.navigateBack();
      return;
    }
    this.loadNotice(id);
  },

  loadNotice(id) {
    var self = this;
    self.setData({ loading: true });
    getNoticeDetail(id)
      .then(function(notice) {
        self.setData({
          notice: {
            id: notice.noticeId,
            title: notice.title,
            content: notice.content,
            type: notice.type,
            typeName: self.getTypeName(notice.type),
            viewCount: notice.viewCount || 0,
            createTime: notice.createTime ? notice.createTime.substring(0, 16).replace('T', ' ') : '',
            images: self.parseImages(notice.images)
          },
          loading: false
        });
      })
      .catch(function() {
        self.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  getTypeName(type) {
    var map = { 'SYSTEM': '系统通知', 'ALL': '全校通知', 'COLLEGE': '学院通知' };
    return map[type] || '通知';
  },

  parseImages(images) {
    if (!images) return [];
    try { return JSON.parse(images); } catch(e) { return []; }
  },

  onBack() { wx.navigateBack(); },

  onPreviewImage(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: this.data.notice.images, current: src });
  }
});
