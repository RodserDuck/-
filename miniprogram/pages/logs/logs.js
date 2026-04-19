// pages/logs/logs.js
Page({
  data: {
    logs: []
  },

  onLoad() {
    var logs = wx.getStorageSync('logs') || [];
    this.setData({ logs: logs.map(function(t) {
      var d = new Date(t);
      return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.toTimeString().substring(0,5);
    })});
  }
});
