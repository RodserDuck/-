// pages/register/register.js
var { userLogin } = require('../../utils/request.js');

Page({
  data: {
    studentNo: '',
    nickname: '',
    phone: '',
    college: '',
    password: '',
    confirmPassword: '',
    isLoading: false
  },

  onLoad() {},

  onStudentNoInput(e) { this.setData({ studentNo: e.detail.value }); },
  onNicknameInput(e) { this.setData({ nickname: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onCollegeInput(e) { this.setData({ college: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmInput(e) { this.setData({ confirmPassword: e.detail.value }); },

  onRegister() {
    var self = this;
    var d = self.data;
    if (!d.studentNo.trim()) { wx.showToast({ title: '请输入学号', icon: 'none' }); return; }
    if (!d.nickname.trim()) { wx.showToast({ title: '请输入昵称', icon: 'none' }); return; }
    if (!d.password.trim()) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (d.password !== d.confirmPassword) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }

    self.setData({ isLoading: true });
    wx.showLoading({ title: '注册中...', mask: true });

    // 用学号作为openid注册
    var openid = 'student_' + d.studentNo;
    userLogin(openid, d.nickname)
      .then(function(res) {
        // 注册成功，自动登录，保存信息
        wx.setStorageSync('token', res.token);
        wx.setStorageSync('userId', res.userId);
        wx.setStorageSync('userInfo', {
          userId: res.userId,
          username: d.nickname,
          studentNo: d.studentNo,
          phone: d.phone,
          college: d.college,
          avatar: 'https://picsum.photos/200/200?random=99'
        });
        wx.setStorageSync('isLoggedIn', true);
        wx.hideLoading();
        wx.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(function() { wx.switchTab({ url: '/pages/square/square' }); }, 1500);
      })
      .catch(function() {
        wx.hideLoading();
        self.setData({ isLoading: false });
        wx.showToast({ title: '注册失败，请重试', icon: 'none' });
      });
  }
});
