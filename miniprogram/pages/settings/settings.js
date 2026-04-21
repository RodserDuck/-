// pages/settings/settings.js
var { updateUser, getUserInfo, uploadImageFile, resolveMediaUrl } = require('../../utils/request.js');

Page({
  data: {
    userInfo: null,
    editNickname: '',
    editPhone: '',
    showEditModal: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    var self = this;
    getUserInfo()
      .then(function(user) {
        if (user.avatar) {
          user.avatarDisplay = resolveMediaUrl(user.avatar);
        } else {
          user.avatarDisplay = 'https://picsum.photos/200/200?random=99';
        }
        self.setData({
          userInfo: user,
          editNickname: user.username || user.nickname || '',
          editPhone: user.phone || ''
        });
      })
      .catch(function() {});
  },

  onChangeAvatar() {
    var self = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var path = res.tempFiles[0].tempFilePath;
        wx.showLoading({ title: '上传中...', mask: true });
        uploadImageFile(path, 'user')
          .then(function(url) {
            return updateUser({ avatar: url });
          })
          .then(function(user) {
            wx.hideLoading();
            wx.showToast({ title: '头像已更新', icon: 'success' });
            var cached = wx.getStorageSync('userInfo') || {};
            if (user && user.avatar) cached.avatar = user.avatar;
            wx.setStorageSync('userInfo', cached);
            self.loadUserInfo();
          })
          .catch(function() {
            wx.hideLoading();
            wx.showToast({ title: '上传失败', icon: 'none' });
          });
      }
    });
  },

  onEditProfile() {
    this.setData({ showEditModal: true });
  },

  onNicknameInput(e) {
    this.setData({ editNickname: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ editPhone: e.detail.value });
  },

  onSaveProfile() {
    var self = this;
    var nickname = self.data.editNickname.trim();
    var phone = self.data.editPhone.trim();
    if (!nickname) { wx.showToast({ title: '请输入昵称', icon: 'none' }); return; }
    updateUser({ username: nickname, phone: phone })
      .then(function() {
        wx.showToast({ title: '保存成功', icon: 'success' });
        self.setData({ showEditModal: false });
        self.loadUserInfo();
        var cached = wx.getStorageSync('userInfo') || {};
        cached.username = nickname;
        cached.phone = phone;
        wx.setStorageSync('userInfo', cached);
      })
      .catch(function() {
        wx.showToast({ title: '保存失败', icon: 'none' });
      });
  },

  onCancelEdit() {
    this.setData({ showEditModal: false });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      confirmColor: '#f87171',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('isLoggedIn');
          wx.removeStorageSync('userId');
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
