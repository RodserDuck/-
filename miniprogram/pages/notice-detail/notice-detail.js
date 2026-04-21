// pages/notice-detail/notice-detail.js
var { getNoticeDetail, parseNoticeImages } = require('../../utils/request.js');

Page({
  data: {
    notice: null,
    loading: true,
    navTop: 0,
    navHeight: 44
  },

  onLoad(options) {
    var sys = wx.getSystemInfoSync();
    this.setData({
      navTop: sys.statusBarHeight || 0,
      navHeight: 44
    });
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
            contentNodes: self.formatContentNodes(notice.content),
            type: notice.type,
            typeName: self.getTypeName(notice.type),
            viewCount: notice.viewCount || 0,
            createTime: notice.createTime ? notice.createTime.substring(0, 16).replace('T', ' ') : '',
            images: parseNoticeImages(notice.images)
          },
          loading: false
        });
      })
      .catch(function() {
        self.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  formatContentNodes(content) {
    var safe = String(content || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
    return '<div style="line-height:1.9;font-size:32rpx;color:#374151;word-break:break-word;">' + safe + '</div>';
  },

  getTypeName(type) {
    var map = { 'SYSTEM': '系统通知', 'ALL': '全校通知', 'COLLEGE': '学院通知' };
    return map[type] || '通知';
  },

  onBack() { wx.navigateBack(); },

  onPreviewImage(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({ urls: this.data.notice.images, current: src });
  }
});
