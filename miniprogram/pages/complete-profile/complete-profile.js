var { getCollegeList, completeProfile } = require('../../utils/request.js');

Page({
  data: {
    username: '',
    studentNo: '',
    phone: '',
    major: '',
    className: '',
    collegeList: [],
    collegeIndex: 0,
    selectedCollege: '',
    isLoading: false
  },

  onLoad() {
    var cached = wx.getStorageSync('userInfo') || {};
    this.setData({
      username: cached.username || '',
      studentNo: cached.studentNo || '',
      phone: cached.phone || '',
      major: cached.major || '',
      className: cached.className || ''
    });
    this.loadCollegeList();
  },

  loadCollegeList() {
    var self = this;
    getCollegeList()
      .then(function(list) {
        list = list || [];
        var cached = wx.getStorageSync('userInfo') || {};
        var currentCollege = cached.college || '';
        var idx = 0;
        if (currentCollege) {
          var found = list.findIndex(function(c) { return c && c.name === currentCollege; });
          if (found >= 0) idx = found;
        }
        self.setData({
          collegeList: list,
          collegeIndex: idx,
          selectedCollege: (list[idx] && list[idx].name) ? list[idx].name : ''
        });
      })
      .catch(function() {});
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onStudentNoInput(e) { this.setData({ studentNo: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onMajorInput(e) { this.setData({ major: e.detail.value }); },
  onClassInput(e) { this.setData({ className: e.detail.value }); },

  onCollegeChange(e) {
    var idx = parseInt(e.detail.value, 10) || 0;
    var list = this.data.collegeList || [];
    var college = list[idx];
    this.setData({
      collegeIndex: idx,
      selectedCollege: college ? college.name : ''
    });
  },

  onSubmit() {
    var self = this;
    if (self.data.isLoading) return;

    var username = (self.data.username || '').trim();
    var studentNo = (self.data.studentNo || '').trim();
    var college = (self.data.selectedCollege || '').trim();
    if (!username) { wx.showToast({ title: '请输入昵称', icon: 'none' }); return; }
    if (!studentNo) { wx.showToast({ title: '请输入学号', icon: 'none' }); return; }
    if (!college) { wx.showToast({ title: '请选择学院', icon: 'none' }); return; }

    self.setData({ isLoading: true });
    wx.showLoading({ title: '提交中...', mask: true });

    var preToken = wx.getStorageSync('preToken');
    completeProfile({
      username: username,
      studentNo: studentNo,
      phone: (self.data.phone || '').trim(),
      college: college,
      major: (self.data.major || '').trim(),
      className: (self.data.className || '').trim()
    }, preToken)
      .then(function(res) {
        wx.hideLoading();
        if (res && res.token) wx.setStorageSync('token', res.token);
        if (res && res.userId) wx.setStorageSync('userId', res.userId);
        wx.setStorageSync('userInfo', Object.assign({}, wx.getStorageSync('userInfo') || {}, res));
        wx.setStorageSync('isLoggedIn', true);
        wx.removeStorageSync('preToken');
        wx.showToast({ title: '已完善', icon: 'success', duration: 1200 });
        setTimeout(function() {
          wx.switchTab({ url: '/pages/square/square' });
        }, 1200);
        self.setData({ isLoading: false });
      })
      .catch(function(err) {
        wx.hideLoading();
        self.setData({ isLoading: false });
        wx.showModal({
          title: '提交失败',
          content: err.msg || '请检查填写信息后重试',
          showCancel: false
        });
      });
  }
});

