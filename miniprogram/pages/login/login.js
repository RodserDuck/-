// pages/login/login.js
var { userLogin } = require('../../utils/request.js');

Page({
  data: {
    studentNo: '',
    password: '',
    isLoading: false,
    rememberMe: false
  },

  onLoad() {
    var savedStudentNo = wx.getStorageSync('savedStudentNo');
    if (savedStudentNo) {
      this.setData({ studentNo: savedStudentNo, rememberMe: true });
    }
    var token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/square/square' });
    }
  },

  onStudentNoInput(e) { this.setData({ studentNo: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onRememberChange(e) { this.setData({ rememberMe: e.detail.value }); },

  onLogin() {
    var self = this;
    var studentNo = self.data.studentNo.trim();
    var password = self.data.password.trim();

    if (!studentNo) {
      wx.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (self.data.isLoading) return;

    self.setData({ isLoading: true });
    wx.showLoading({ title: '登录中...', mask: true });

    userLogin(studentNo, password)
      .then(function(res) {
        wx.hideLoading();
        wx.setStorageSync('token', res.token);
        wx.setStorageSync('userId', res.userId);
        wx.setStorageSync('userInfo', {
          userId: res.userId,
          username: res.username || studentNo,
          avatar: res.avatar || 'https://picsum.photos/200/200?random=99',
          studentNo: res.studentNo,
          college: res.college
        });
        if (self.data.rememberMe) {
          wx.setStorageSync('savedStudentNo', studentNo);
        } else {
          wx.removeStorageSync('savedStudentNo');
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
          content: err.msg || '学号或密码错误，请重新输入',
          showCancel: false,
          confirmText: '确定'
        });
      });
  },

  onGoRegister() { wx.navigateTo({ url: '/pages/register/register' }); },
  onForgotPassword() {
    wx.showToast({ title: '请联系管理员重置密码', icon: 'none', duration: 2500 });
  }
});
