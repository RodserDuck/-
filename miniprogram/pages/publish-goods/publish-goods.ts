// pages/publish-goods/publish-goods.ts
Page({
  data: {
    title: '',
    price: '',
    originalPrice: '',
    description: '',
    images: [] as string[],
    maxImages: 9,
    category: '',
    condition: '95新',
    location: '',
    categories: ['数码', '书籍', '服饰', '日用', '其他'],
    conditions: ['全新', '99新', '95新', '9成新', '8成新'],
    isSubmitting: false
  },

  onLoad() {
    // 页面加载
  },

  // 标题输入
  onTitleInput(e: any) {
    this.setData({ title: e.detail.value });
  },

  // 价格输入
  onPriceInput(e: any) {
    this.setData({ price: e.detail.value });
  },

  // 原价输入
  onOriginalPriceInput(e: any) {
    this.setData({ originalPrice: e.detail.value });
  },

  // 描述输入
  onDescriptionInput(e: any) {
    this.setData({ description: e.detail.value });
  },

  // 位置输入
  onLocationInput(e: any) {
    this.setData({ location: e.detail.value });
  },

  // 选择分类
  onCategoryTap() {
    wx.showActionSheet({
      itemList: this.data.categories,
      success: (res) => {
        this.setData({ category: this.data.categories[res.tapIndex] });
      }
    });
  },

  // 选择成色
  onConditionTap() {
    wx.showActionSheet({
      itemList: this.data.conditions,
      success: (res) => {
        this.setData({ condition: this.data.conditions[res.tapIndex] });
      }
    });
  },

  // 选择图片
  onChooseImage() {
    const remainingCount = this.data.maxImages - this.data.images.length;
    if (remainingCount <= 0) {
      wx.showToast({ title: '最多选择9张图片', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: remainingCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({ images: [...this.data.images, ...newImages] });
      }
    });
  },

  // 删除图片
  onDeleteImage(e: any) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  // 发布
  onPublish() {
    const { title, price, category, images, isSubmitting } = this.data;
    
    if (isSubmitting) return;
    
    if (!title.trim()) {
      wx.showToast({ title: '请输入商品标题', icon: 'none' });
      return;
    }
    if (!price.trim()) {
      wx.showToast({ title: '请输入价格', icon: 'none' });
      return;
    }
    if (!category) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (images.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '发布中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => wx.navigateBack(), 1500);
        }
      });
    }, 1500);
  },

  // 取消
  onCancel() {
    wx.navigateBack();
  }
});
