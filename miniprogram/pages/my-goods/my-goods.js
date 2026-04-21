// pages/my-goods/my-goods.js
var { getMyGoods, deleteGoods, updateMyGoods, updateMyGoodsStatus, getCategoryList, uploadImageFiles, resolveMediaUrl } = require('../../utils/request.js');

function mapItem(g) {
  var images = [];
  try { images = JSON.parse(g.images); } catch (e) {}
  return {
    id: g.itemId,
    title: g.title,
    price: g.price,
    image: images[0] ? resolveMediaUrl(images[0]) : 'https://picsum.photos/200/200?random=60',
    description: g.description || '',
    statusCode: g.status,
    status: g.status === 1 ? '在售' : g.status === 2 ? '已售' : '已下架',
    views: g.viewCount || 0,
    updateTime: g.updateTime ? String(g.updateTime).replace('T', ' ').substring(0, 16) : '',
    categoryId: g.categoryId,
    conditionLevel: g.conditionLevel,
    originalPrice: g.originalPrice,
    tradeLocation: g.tradeLocation,
    contact: g.contact,
    images: images,
    raw: g
  };
}

Page({
  data: {
    goodsList: [],
    categories: [],
    categoryNameMap: {},
    conditions: ['全新', '99新', '95新', '9成新', '8成新'],
    editImagesDisplay: [],
    editVisible: false,
    editId: null,
    edit: {
      title: '',
      price: '',
      originalPrice: '',
      description: '',
      categoryId: '',
      categoryName: '请选择分类',
      conditionLevel: 2,
      conditionName: '95新',
      images: [],
      tradeLocation: '',
      contact: ''
    }
  },

  onLoad() {
    var self = this;
    self.loadCategories();
    self.reload();
  },

  onShow() {
    this.reload();
  },

  onPullDownRefresh() {
    var self = this;
    self.reload().finally(function() {
      wx.stopPullDownRefresh();
    });
  },

  reload() {
    var self = this;
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return Promise.resolve();
    }
    return getMyGoods()
      .then(function(list) {
        self.setData({ goodsList: (list || []).map(mapItem) });
      })
      .catch(function() {});
  },

  stop() {},

  onPublishTap() {
    wx.navigateTo({ url: '/pages/publish-goods/publish-goods' });
  },

  loadCategories() {
    var self = this;
    return getCategoryList('goods')
      .then(function(list) {
        var map = {};
        (list || []).forEach(function(c) { map[c.categoryId] = c.name; });
        self.setData({ categories: list || [], categoryNameMap: map });
      })
      .catch(function() {});
  },

  onDeleteTap(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title || '该商品';
    if (!id) return;
    wx.showModal({
      title: '删除商品',
      content: '确定删除「' + title + '」吗？删除后不可恢复。',
      confirmColor: '#ef4444',
      success: function(res) {
        if (!res.confirm) return;
        deleteGoods(id)
          .then(function() {
            wx.showToast({ title: '已删除', icon: 'success' });
            self.setData({ goodsList: (self.data.goodsList || []).filter(function(g) { return g.id !== id; }) });
          })
          .catch(function(err) {
            wx.showToast({ title: (err && err.msg) || '删除失败', icon: 'none' });
          });
      }
    });
  },

  onToggleStatus(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var status = parseInt(e.currentTarget.dataset.status);
    if (!id) return;
    // 1 在售 -> 0 下架；0 下架 -> 1 上架；2 已售不允许切换
    if (status === 2) {
      wx.showToast({ title: '已售商品不可上架', icon: 'none' });
      return;
    }
    var next = status === 1 ? 0 : 1;
    var text = next === 1 ? '上架' : '下架';
    wx.showModal({
      title: text + '商品',
      content: '确定要' + text + '该商品吗？',
      confirmColor: next === 1 ? '#22c55e' : '#ef4444',
      success: function(res) {
        if (!res.confirm) return;
        updateMyGoodsStatus(id, next)
          .then(function() {
            wx.showToast({ title: '已' + text, icon: 'success' });
            self.reload();
          })
          .catch(function(err) {
            wx.showToast({ title: (err && err.msg) || (text + '失败'), icon: 'none' });
          });
      }
    });
  },

  onEditTap(e) {
    var id = e.currentTarget.dataset.id;
    var item = (this.data.goodsList || []).find(function(g) { return g.id === id; });
    if (!item) return;
    var raw = item.raw || {};
    var catName = (this.data.categoryNameMap && raw.categoryId) ? this.data.categoryNameMap[raw.categoryId] : '';
    var condLevel = raw.conditionLevel || 2;
    var condName = this.data.conditions[(condLevel - 1)] || '95新';

    // images：存服务端 url/相对路径数组
    var images = [];
    try { images = JSON.parse(raw.images); } catch (e2) {}
    if (!Array.isArray(images)) images = [];
    this.setData({
      editVisible: true,
      editId: id,
      edit: {
        title: raw.title || '',
        price: raw.price || '',
        originalPrice: raw.originalPrice || '',
        description: raw.description || '',
        categoryId: raw.categoryId || '',
        categoryName: catName || (raw.categoryId ? '已选择' : '请选择分类'),
        conditionLevel: condLevel,
        conditionName: condName,
        images: images,
        tradeLocation: raw.tradeLocation || '',
        contact: raw.contact || ''
      },
      editImagesDisplay: images.map(function(u) { return resolveMediaUrl(u); })
    });
  },

  onEditCancel() {
    this.setData({ editVisible: false, editId: null, editImagesDisplay: [] });
  },

  onEditTitle(e) {
    this.setData({ 'edit.title': e.detail.value });
  },

  onEditPrice(e) {
    this.setData({ 'edit.price': e.detail.value });
  },

  onEditOriginalPrice(e) {
    this.setData({ 'edit.originalPrice': e.detail.value });
  },

  onEditDesc(e) {
    this.setData({ 'edit.description': e.detail.value });
  },

  onEditLoc(e) {
    this.setData({ 'edit.tradeLocation': e.detail.value });
  },

  onEditContact(e) {
    this.setData({ 'edit.contact': e.detail.value });
  },

  onEditCategoryTap() {
    var self = this;
    var cats = self.data.categories || [];
    if (!cats.length) { wx.showToast({ title: '分类加载中', icon: 'none' }); return; }
    wx.showActionSheet({
      itemList: cats.map(function(c) { return c.name; }),
      success: function(res) {
        var cat = cats[res.tapIndex];
        self.setData({ 'edit.categoryId': cat.categoryId, 'edit.categoryName': cat.name });
      }
    });
  },

  onEditConditionTap() {
    var self = this;
    wx.showActionSheet({
      itemList: self.data.conditions,
      success: function(res) {
        self.setData({ 'edit.conditionLevel': res.tapIndex + 1, 'edit.conditionName': self.data.conditions[res.tapIndex] });
      }
    });
  },

  onEditChooseImage() {
    var self = this;
    var max = 9;
    var current = (self.data.edit.images || []).length;
    var remaining = max - current;
    if (remaining <= 0) { wx.showToast({ title: '最多 9 张图片', icon: 'none' }); return; }
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempPaths = (res.tempFiles || []).map(function(f) { return f.tempFilePath; });
        if (!tempPaths.length) return;
        wx.showLoading({ title: '上传中...', mask: true });
        uploadImageFiles(tempPaths, 'goods')
          .then(function(urls) {
            wx.hideLoading();
            var imgs = (self.data.edit.images || []).concat(urls || []);
            self.setData({
              'edit.images': imgs,
              editImagesDisplay: imgs.map(function(u) { return resolveMediaUrl(u); })
            });
          })
          .catch(function() {
            wx.hideLoading();
            wx.showToast({ title: '上传失败', icon: 'none' });
          });
      }
    });
  },

  onEditDeleteImage(e) {
    var idx = e.currentTarget.dataset.index;
    var imgs = (this.data.edit.images || []).filter(function(_, i) { return i !== idx; });
    this.setData({
      'edit.images': imgs,
      editImagesDisplay: imgs.map(function(u) { return resolveMediaUrl(u); })
    });
  },

  onEditSave() {
    var self = this;
    var id = self.data.editId;
    var payload = Object.assign({}, self.data.edit);
    payload.title = String(payload.title || '').trim();
    payload.price = String(payload.price || '').trim();
    payload.originalPrice = String(payload.originalPrice || '').trim();

    if (!id) return;
    if (!payload.title) return wx.showToast({ title: '请输入标题', icon: 'none' });
    if (!payload.price || isNaN(Number(payload.price))) return wx.showToast({ title: '请输入有效价格', icon: 'none' });
    if (!payload.categoryId) return wx.showToast({ title: '请选择分类', icon: 'none' });
    if (!payload.images || payload.images.length === 0) return wx.showToast({ title: '请至少上传一张图片', icon: 'none' });

    updateMyGoods(id, {
      title: payload.title,
      price: Number(payload.price),
      originalPrice: payload.originalPrice ? Number(payload.originalPrice) : null,
      description: payload.description || '',
      images: JSON.stringify(payload.images || []),
      categoryId: payload.categoryId,
      conditionLevel: payload.conditionLevel || 2,
      tradeLocation: payload.tradeLocation || '',
      contact: payload.contact || ''
    })
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' });
        self.setData({ editVisible: false, editId: null, editImagesDisplay: [] });
        self.reload();
      })
      .catch(function(err) {
        wx.showToast({ title: (err && err.msg) || '保存失败', icon: 'none' });
      });
  }
});

