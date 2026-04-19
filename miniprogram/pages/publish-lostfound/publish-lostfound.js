// pages/publish-lostfound/publish-lostfound.js
var { saveLostFound } = require('../../utils/request.js');

Page({
  data: {
    publishType: 'lost',
    title: '',
    itemName: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    images: [],
    maxImages: 6,
    isSubmitting: false
  },

  onLoad(options) {
    var type = options.type || 'lost';
    this.setData({ publishType: type });
    wx.setNavigationBarTitle({ title: type === 'lost' ? '发布寻物信息' : '发布招领信息' });
  },

  onTitleInput(e) { this.setData({ title: e.detail.value }); },
  onItemNameInput(e) { this.setData({ itemName: e.detail.value }); },
  onLocationInput(e) { this.setData({ location: e.detail.value }); },
  onDescriptionInput(e) { this.setData({ description: e.detail.value }); },
  onContactInput(e) { this.setData({ contact: e.detail.value }); },

  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  onChooseImage() {
    var self = this;
    var remaining = self.data.maxImages - self.data.images.length;
    if (remaining <= 0) { wx.showToast({ title: '最多选择6张图片', icon: 'none' }); return; }
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

  onPublish() {
    var self = this;
    var d = this.data;
    if (self.data.isSubmitting) return;
    if (!d.title.trim()) { wx.showToast({ title: '请输入标题', icon: 'none' }); return; }
    if (!d.itemName.trim()) { wx.showToast({ title: '请输入物品名称', icon: 'none' }); return; }
    if (!d.location.trim()) { wx.showToast({ title: '请输入地点', icon: 'none' }); return; }
    if (!d.contact.trim()) { wx.showToast({ title: '请输入联系方式', icon: 'none' }); return; }

    self.setData({ isSubmitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    saveLostFound({
      type: d.publishType === 'lost' ? 1 : 2,
      title: d.title,
      itemName: d.itemName,
      location: d.location,
      lostTime: d.date,
      description: d.description,
      contact: d.contact,
      itemImage: d.images.length > 0 ? d.images[0] : ''
    })
      .then(function() {
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

  onCancel() { wx.navigateBack(); }
});
