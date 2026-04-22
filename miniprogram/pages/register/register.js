// pages/register/register.js
var { userRegister, getCollegeList } = require('../../utils/request.js');

Page({
  data: {
    studentNo: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    collegeList: [],
    selectedCollege: '',
    selectedCollegeName: '',
    collegeIndex: 0,
    major: '',
    className: '',
    isLoading: false,
    showCollegePicker: false
  },

  onLoad() {
    this.loadCollegeList();
  },

  loadCollegeList() {
    getCollegeList()
      .then(list => {
        this.setData({ collegeList: list || [] });
      })
      .catch(() => {});
  },

  onStudentNoInput(e) { this.setData({ studentNo: e.detail.value }); },
  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmInput(e) { this.setData({ confirmPassword: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onMajorInput(e) { this.setData({ major: e.detail.value }); },
  onClassInput(e) { this.setData({ className: e.detail.value }); },

  onCollegeChange(e) {
    var idx = parseInt(e.detail.value, 10) || 0;
    var list = this.data.collegeList || [];
    var college = list[idx];
    this.setData({
      collegeIndex: idx,
      selectedCollege: college ? college.name : '',
      selectedCollegeName: college ? college.name : ''
    });
  },

  onRegister() {
    var self = this;
    var d = self.data;

    if (!d.studentNo.trim()) { wx.showToast({ title: '请输入学号', icon: 'none' }); return; }
    if (!d.username.trim()) { wx.showToast({ title: '请输入昵称', icon: 'none' }); return; }
    if (!d.password.trim()) { wx.showToast({ title: '请输入密码', icon: 'none' }); return; }
    if (d.password.length < 6) { wx.showToast({ title: '密码至少6位', icon: 'none' }); return; }
    if (d.password !== d.confirmPassword) { wx.showToast({ title: '两次密码不一致', icon: 'none' }); return; }
    if (!d.selectedCollege) { wx.showToast({ title: '请选择学院', icon: 'none' }); return; }

    self.setData({ isLoading: true });
    wx.showLoading({ title: '注册中...', mask: true });

    userRegister({
      studentNo: d.studentNo.trim(),
      username: d.username.trim(),
      password: d.password,
      phone: d.phone.trim(),
      college: d.selectedCollege,
      major: d.major.trim(),
      className: d.className.trim()
    })
      .then(function(res) {
        wx.hideLoading();
        wx.setStorageSync('token', res.token);
        wx.setStorageSync('userId', res.userId);
        wx.setStorageSync('userInfo', {
          userId: res.userId,
          username: d.username.trim(),
          studentNo: d.studentNo.trim(),
          phone: d.phone.trim(),
          college: d.selectedCollege,
          major: d.major.trim(),
          avatar: 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 200)
        });
        wx.setStorageSync('isLoggedIn', true);
        wx.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(function() {
          wx.switchTab({ url: '/pages/square/square' });
        }, 1500);
        self.setData({ isLoading: false });
      })
      .catch(function(err) {
        wx.hideLoading();
        self.setData({ isLoading: false });
        wx.showModal({
          title: '注册失败',
          content: err.msg || '注册失败，请检查学号是否已注册',
          showCancel: false,
          confirmText: '知道了'
        });
      });
  },

  onGoLogin() { wx.navigateBack(); }
});
