// pages/login/login.ts
Page({
  data: {
    account: '',
    password: '',
    isLoading: false,
    rememberMe: false
  },

  onLoad() {
    // 检查是否有保存的账号
    const savedAccount = wx.getStorageSync('savedAccount');
    if (savedAccount) {
      this.setData({ account: savedAccount, rememberMe: true });
    }
  },

  onAccountInput(e: any) { this.setData({ account: e.detail.value }); },
  onPasswordInput(e: any) { this.setData({ password: e.detail.value }); },
  onRememberChange(e: any) { this.setData({ rememberMe: e.detail.value }); },

  onLogin() {
    const { account, password, isLoading } = this.data;
    if (isLoading) return;
    if (!account.trim()) { wx.showToast({ title: '请输入账号', icon: 'none' }); return; }
    if (!password.trim()) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }

    this.setData({ isLoading: true });
    wx.showLoading({ title: '登录中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      if (password === '123456') {
        if (this.data.rememberMe) wx.setStorageSync('savedAccount', account);
        else wx.removeStorageSync('savedAccount');
        wx.setStorageSync('isLoggedIn', true);
        wx.setStorageSync('userInfo', { account, nickname: '用户' + account });
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
          success: () => setTimeout(() => wx.switchTab({ url: '/pages/square/square' }), 1500)
        });
      } else {
        this.setData({ isLoading: false });
        wx.showModal({ title: '登录失败', content: '密码错误，请重新输入', showCancel: false, confirmText: '确定' });
      }
    }, 1500);
  },

  onGoRegister() { wx.navigateTo({ url: '/pages/register/register' }); },
  onForgotPassword() { wx.showToast({ title: '功能开发中', icon: 'none' }); }
});
