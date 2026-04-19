// pages/login/login.js
var { userLogin } = require('../../utils/request.js');

Page({
  data: {
    account: '',
    password: '',
    isLoading: false,
    rememberMe: false
  },

  onLoad() {
    var savedAccount = wx.getStorageSync('savedAccount');
    if (savedAccount) {
      this.setData({ account: savedAccount, rememberMe: true });
    }
    // 如果已登录，直接跳转
    var token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/square/square' });
    }
  },

  onAccountInput(e) { this.setData({ account: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onRememberChange(e) { this.setData({ rememberMe: e.detail.value }); },

  onLogin() {
    var self = this;
    var account = self.data.account.trim();
    var password = self.data.password.trim();
    if (!account) { wx.showToast({ title: '请输入账号', icon: 'none' }); return; }
    if (!password) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (self.data.isLoading) return;

    self.setData({ isLoading: true });
    wx.showLoading({ title: '登录中...', mask: true });

    // 小程序获取 openid（生产环境请调用 wx.login 从后端换取）
    // 这里用 account 作为 openid 传给后端演示
    userLogin(account, account)
      .then(function(res) {
        wx.hideLoading();
        // 保存登录信息
        wx.setStorageSync('token', res.token);
        wx.setStorageSync('userId', res.userId);
        wx.setStorageSync('userInfo', {
          userId: res.userId,
          username: res.username || account,
          avatar: res.avatar || 'https://picsum.photos/200/200?random=99',
          account: account
        });
        if (self.data.rememberMe) {
          wx.setStorageSync('savedAccount', account);
        } else {
          wx.removeStorageSync('savedAccount');
        }
        wx.setStorageSync('isLoggedIn', true);
        wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });
        setTimeout(function() {
          wx.switchTab({ url: '/pages/square/square' });
        }, 1500);
        self.setData({ isLoading: false });
      })
      .catch(function(err) {
        wx.hideLoading();
        self.setData({ isLoading: false });
        wx.showModal({
          title: '登录失败',
          content: err.msg || '账号或密码错误，请重新输入',
          showCancel: false,
          confirmText: '确定'
        });
      });
  },

  onGoRegister() { wx.navigateTo({ url: '/pages/register/register' }); },
  onForgotPassword() { wx.showToast({ title: '功能开发中', icon: 'none' }); }
});
