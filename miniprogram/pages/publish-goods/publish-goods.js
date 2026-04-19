// pages/publish-goods/publish-goods.js
var { publishGoods, getCategoryList } = require('../../utils/request.js');

Page({
  data: {
    title: '',
    price: '',
    originalPrice: '',
    description: '',
    images: [],
    maxImages: 9,
    categoryId: '',
    categoryName: '请选择分类',
    conditionLevel: 2,
    conditionName: '95新',
    location: '',
    contact: '',
    categories: [],
    conditions: ['全新', '99新', '95新', '9成新', '8成新'],
    isSubmitting: false
  },

  onLoad() {
    var self = this;
    getCategoryList('goods')
      .then(function(list) {
        self.setData({ categories: list });
      })
      .catch(function() {});
  },

  onTitleInput(e) { this.setData({ title: e.detail.value }); },
  onPriceInput(e) { this.setData({ price: e.detail.value }); },
  onOriginalPriceInput(e) { this.setData({ originalPrice: e.detail.value }); },
  onDescriptionInput(e) { this.setData({ description: e.detail.value }); },
  onLocationInput(e) { this.setData({ location: e.detail.value }); },
  onContactInput(e) { this.setData({ contact: e.detail.value }); },

  onCategoryTap() {
    var self = this;
    var cats = self.data.categories;
    if (!cats.length) { wx.showToast({ title: '分类加载中', icon: 'none' }); return; }
    wx.showActionSheet({
      itemList: cats.map(function(c) { return c.name; }),
      success: function(res) {
        var cat = cats[res.tapIndex];
        self.setData({ categoryId: cat.categoryId, categoryName: cat.name });
      }
    });
  },

  onConditionTap() {
    var self = this;
    wx.showActionSheet({
      itemList: self.data.conditions,
      success: function(res) {
        self.setData({ conditionLevel: res.tapIndex + 1, conditionName: self.data.conditions[res.tapIndex] });
      }
    });
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

  onPublish() {
    var self = this;
    if (self.data.isSubmitting) return;
    if (!self.data.title.trim()) { wx.showToast({ title: '请输入商品标题', icon: 'none' }); return; }
    if (!self.data.price.trim()) { wx.showToast({ title: '请输入价格', icon: 'none' }); return; }
    if (!self.data.categoryId) { wx.showToast({ title: '请选择分类', icon: 'none' }); return; }
    if (self.data.images.length === 0) { wx.showToast({ title: '请至少上传一张图片', icon: 'none' }); return; }

    self.setData({ isSubmitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    publishGoods({
      title: self.data.title,
      price: parseFloat(self.data.price),
      originalPrice: self.data.originalPrice ? parseFloat(self.data.originalPrice) : null,
      description: self.data.description,
      images: JSON.stringify(self.data.images),
      categoryId: self.data.categoryId,
      conditionLevel: self.data.conditionLevel,
      tradeLocation: self.data.location,
      contact: self.data.contact
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
  },

  onCancel() { wx.navigateBack(); }
});
