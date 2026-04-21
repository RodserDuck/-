// pages/publish-post/publish-post.js
var { publishPost, uploadImageFiles } = require('../../utils/request.js');

Page({
  data: {
    content: '',
    images: [],
    maxImages: 9,
    isSubmitting: false,
    currentCategory: '校园生活',
    categories: [
      { label: '🌈 校园生活', value: '校园生活' },
      { label: '📚 学习交流', value: '学习交流' },
      { label: '🎉 活动招募', value: '活动招募' },
      { label: '🤝 互助问答', value: '互助问答' },
      { label: '💡 校园吐槽', value: '校园吐槽' },
      { label: '🎵 兴趣爱好', value: '兴趣爱好' },
      { label: '🤝 二手交易', value: '二手交易' }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '发布帖子'
    });
  },

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

  onCategoryTap(e) {
    this.setData({ currentCategory: e.currentTarget.dataset.value });
  },

  onPublish() {
    var self = this;
    if (self.data.isSubmitting) return;
    if (!self.data.content.trim() && self.data.images.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' }); return;
    }
    self.setData({ isSubmitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    var uploadPromise = self.data.images.length
      ? uploadImageFiles(self.data.images, 'post')
      : Promise.resolve([]);

    uploadPromise
      .then(function(urls) {
        return publishPost({
          content: self.data.content,
          images: urls.length ? JSON.stringify(urls) : '[]',
          category: self.data.currentCategory
        });
      })
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
  }
});
