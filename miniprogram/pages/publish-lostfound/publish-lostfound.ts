// pages/publish-lostfound/publish-lostfound.ts
Page({
  data: {
    publishType: 'lost' as 'lost' | 'found',
    title: '',
    itemName: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    images: [] as string[],
    maxImages: 6,
    isSubmitting: false
  },

  onLoad(options: any) {
    const type = options.type || 'lost';
    this.setData({ publishType: type });
    wx.setNavigationBarTitle({
      title: type === 'lost' ? '发布寻物信息' : '发布招领信息'
    });
  },

  onTitleInput(e: any) { this.setData({ title: e.detail.value }); },
  onItemNameInput(e: any) { this.setData({ itemName: e.detail.value }); },
  onLocationInput(e: any) { this.setData({ location: e.detail.value }); },
  onDateChange(e: any) { this.setData({ date: e.detail.value }); },
  onDescriptionInput(e: any) { this.setData({ description: e.detail.value }); },
  onContactInput(e: any) { this.setData({ contact: e.detail.value }); },

  onChooseImage() {
    const remainingCount = this.data.maxImages - this.data.images.length;
    if (remainingCount <= 0) {
      wx.showToast({ title: '最多选择6张图片', icon: 'none' });
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

  onDeleteImage(e: any) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  onPublish() {
    const { publishType, title, itemName, location, date, contact, isSubmitting } = this.data;
    if (isSubmitting) return;
    if (!title.trim()) {
      wx.showToast({ title: publishType === 'lost' ? '请输入寻物标题' : '请输入招领标题', icon: 'none' });
      return;
    }
    if (!itemName.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }
    if (!location.trim()) {
      wx.showToast({ title: publishType === 'lost' ? '请输入丢失地点' : '请输入拾获地点', icon: 'none' });
      return;
    }
    if (!date) {
      wx.showToast({ title: publishType === 'lost' ? '请选择丢失日期' : '请选择拾获日期', icon: 'none' });
      return;
    }
    if (!contact.trim()) {
      wx.showToast({ title: '请输入联系方式', icon: 'none' });
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

  onCancel() { wx.navigateBack(); }
});
