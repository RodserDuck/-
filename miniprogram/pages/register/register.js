// pages/register/register.ts
Page({
  data: {
    identity: 'student' as 'student' | 'teacher' | 'admin',
    account: '',
    password: '',
    confirmPassword: '',
    isLoading: false
  },

  onLoad() {},

  onIdentitySelect(e) { this.setData({ identity: e.currentTarget.dataset.type }); },
  onAccountInput(e) { this.setData({ account: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }); },

  onRegister() {
    const { identity: userIdentity, account, password, confirmPassword, isLoading } = this.data;
    console.log('注册身份:', userIdentity);
    if (isLoading) return;
    if (!account.trim()) { wx.showToast({ title: '请输入账号', icon: 'none' }); return; }
    if (account.length < 6) { wx.showToast({ title: '账号至少6位', icon: 'none' }); return; }
    if (!password.trim()) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (password.length < 6) { wx.showToast({ title: '密码至少6位', icon: 'none' }); return; }
    if (password !== confirmPassword) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }

    this.setData({ isLoading: true });
    wx.showLoading({ title: '注册中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      if (account === 'test123') {
        this.setData({ isLoading: false });
        wx.showModal({ title: '注册失败', content: '该账号已存在，请更换账号', showCancel: false, confirmText: '确定' });
      } else {
        wx.showToast({ title: '注册成功', icon: 'success', duration: 1500, success: () => setTimeout(() => wx.switchTab({ url: '/pages/square/square' }), 1500) });
      }
    }, 1500);
  },

  onGoLogin() { wx.navigateBack(); }
});
