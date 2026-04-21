// pages/change-password/change-password.js
var { changePassword } = require('../../utils/request.js');

Page({
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },

  onOldInput(e) {
    this.setData({ oldPassword: e.detail.value });
  },

  onNewInput(e) {
    this.setData({ newPassword: e.detail.value });
  },

  onConfirmInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  onCancel() {
    wx.navigateBack();
  },

  onSubmit() {
    var oldPwd = (this.data.oldPassword || '').trim();
    var newPwd = (this.data.newPassword || '').trim();
    var confirmPwd = (this.data.confirmPassword || '').trim();

    if (!oldPwd) return wx.showToast({ title: '请输入旧密码', icon: 'none' });
    if (!newPwd) return wx.showToast({ title: '请输入新密码', icon: 'none' });
    if (newPwd.length < 6) return wx.showToast({ title: '新密码至少 6 位', icon: 'none' });
    if (newPwd !== confirmPwd) return wx.showToast({ title: '两次密码不一致', icon: 'none' });
    if (oldPwd === newPwd) return wx.showToast({ title: '新密码不能与旧密码相同', icon: 'none' });

    changePassword(oldPwd, newPwd)
      .then(function() {
        wx.showToast({ title: '密码已更新', icon: 'success' });
        setTimeout(function() { wx.navigateBack(); }, 800);
      })
      .catch(function(err) {
        wx.showToast({ title: (err && err.msg) || '修改失败', icon: 'none' });
      });
  }
});

