// pages/publish-post/publish-post.ts
Page({
  data: {
    content: '',
    images: [] as string[],
    maxImages: 9,
    isSubmitting: false,
    isAnonymous: false
  },

  onLoad() {
    // 页面加载
  },

  // 内容输入
  onContentInput(e: any) {
    this.setData({ content: e.detail.value });
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

  // 匿名切换
  onAnonymousChange(e: any) {
    this.setData({ isAnonymous: e.detail.value });
  },

  // 发布
  onPublish() {
    const { content, images, isSubmitting } = this.data;
    
    if (isSubmitting) return;
    
    if (!content.trim() && images.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' });
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
    const { content, images } = this.data;
    if (content.trim() || images.length > 0) {
      wx.showModal({
        title: '确认退出',
        content: '退出后内容将不会保存',
        success: (res) => {
          if (res.confirm) wx.navigateBack();
        }
      });
    } else {
      wx.navigateBack();
    }
  }
});
