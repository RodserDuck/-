// pages/publish-post/publish-post.js
var { publishPost } = require('../../utils/request.js');

Page({
  data: {
    content: '',
    images: [],
    maxImages: 9,
    isSubmitting: false,
    isAnonymous: false
  },

  onLoad() {},

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onChooseImage() {
    var self = this;
    var remaining = self.data.maxImages - self.data.images.length;
    if (remaining <= 0) { wx.showToast({ title: '最多选择9张图片', icon: 'none' }); return; }
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var newImages = res.tempFiles.map(function(f) { return f.tempFilePath; });
        self.setData({ images: self.data.images.concat(newImages) });
      }
    });
  },

  onDeleteImage(e) {
    var idx = e.currentTarget.dataset.index;
    var images = this.data.images.filter(function(_, i) { return i !== idx; });
    this.setData({ images: images });
  },

  onAnonymousChange(e) {
    this.setData({ isAnonymous: e.detail.value });
  },

  onPublish() {
    var self = this;
    if (self.data.isSubmitting) return;
    if (!self.data.content.trim() && self.data.images.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' }); return;
    }
    self.setData({ isSubmitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    publishPost({ content: self.data.content, images: JSON.stringify(self.data.images) })
      .then(function(res) {
        wx.hideLoading();
        wx.showToast({ title: '发布成功', icon: 'success', duration: 1500 });
        setTimeout(function() { wx.navigateBack(); }, 1500);
      })
      .catch(function() {
        wx.hideLoading();
        self.setData({ isSubmitting: false });
        wx.showToast({ title: '发布失败', icon: 'none' });
      });
  },

  onCancel() {
    var self = this;
    if (self.data.content.trim() || self.data.images.length > 0) {
      wx.showModal({
        title: '确认退出',
        content: '退出后内容将不会保存',
        success: function(res) { if (res.confirm) wx.navigateBack(); }
      });
    } else {
      wx.navigateBack();
    }
  }
});
