// app.js
App({
  globalData: {},

  onLaunch() {
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  }
});
