var {
  leaderGetClubActivities,
  leaderSaveActivity,
  leaderUpdateActivity,
  leaderDeleteActivity,
  leaderGetClubMembers,
  leaderGetApplications,
  leaderApproveApplication,
  leaderRejectApplication,
  resolveMediaUrl
} = require('../../utils/request.js');

function fmtTime(t) {
  if (!t) return '';
  return String(t).replace('T', ' ').slice(0, 19);
}

Page({
  data: {
    clubId: null,
    tab: 'activity',
    loading: false,
    activities: [],
    memberLoading: false,
    members: [],
    keyword: '',

    applyLoading: false,
    applications: [],
    applyKeyword: '',

    editVisible: false,
    edit: {},
    statusOptions: [
      { label: '草稿', value: 0 },
      { label: '进行中', value: 1 },
      { label: '结束', value: 2 }
    ],
    statusIndex: 1
  },

  onLoad(options) {
    var clubId = options.clubId;
    if (!clubId) return;
    this.setData({ clubId: clubId });
    this.loadActivities();
  },

  onShow() {
    if (this.data.clubId && this.data.tab === 'activity') this.loadActivities();
  },

  onTab(e) {
    var t = e.currentTarget.dataset.tab;
    this.setData({ tab: t });
    if (t === 'activity') this.loadActivities();
    if (t === 'member') this.loadMembers();
    if (t === 'apply') this.loadApplications();
  },

  // ========== 活动 ==========
  loadActivities() {
    var self = this;
    self.setData({ loading: true });
    leaderGetClubActivities(self.data.clubId)
      .then(function(list) {
        var acts = (list || []).map(function(a) {
          var st = a.status == null ? 1 : a.status;
          var stText = st === 0 ? '草稿' : st === 1 ? '进行中' : '结束';
          return {
            activityId: a.activityId,
            clubId: a.clubId,
            title: a.title || '',
            description: a.description || '',
            coverImage: a.coverImage ? resolveMediaUrl(a.coverImage) : '',
            coverImageRaw: a.coverImage || '',
            maxParticipants: a.maxParticipants || 0,
            currentParticipants: a.currentParticipants || 0,
            outsiderLimit: a.outsiderLimit || 0,
            location: a.location || '',
            startTime: a.startTime || '',
            endTime: a.endTime || '',
            contact: a.contact || '',
            organizer: a.organizer || '',
            status: st,
            statusText: stText,
            time: a.startTime ? fmtTime(a.startTime).slice(0, 16) : ''
          };
        });
        self.setData({ activities: acts, loading: false });
      })
      .catch(function(e) {
        self.setData({ loading: false });
        wx.showToast({ title: (e && e.msg) || '加载失败', icon: 'none' });
      });
  },

  onCreateActivity() {
    this.setData({
      editVisible: true,
      edit: {
        clubId: this.data.clubId,
        title: '',
        description: '',
        coverImage: '',
        maxParticipants: 0,
        outsiderLimit: 0,
        location: '',
        startTime: '',
        endTime: '',
        contact: '',
        organizer: '',
        status: 1
      },
      statusIndex: 1
    });
  },

  onEditActivity(e) {
    var id = e.currentTarget.dataset.id;
    var a = (this.data.activities || []).find(function(x) { return String(x.activityId) === String(id); });
    if (!a) return;
    var idx = this.data.statusOptions.findIndex(function(o) { return o.value === a.status; });
    if (idx < 0) idx = 1;
    this.setData({
      editVisible: true,
      edit: {
        activityId: a.activityId,
        clubId: a.clubId,
        title: a.title,
        description: a.description,
        coverImage: a.coverImageRaw || '',
        maxParticipants: a.maxParticipants,
        outsiderLimit: a.outsiderLimit || 0,
        location: a.location,
        startTime: a.startTime ? fmtTime(a.startTime) : '',
        endTime: a.endTime ? fmtTime(a.endTime) : '',
        contact: a.contact,
        organizer: a.organizer,
        status: a.status
      },
      statusIndex: idx
    });
  },

  onDeleteActivity(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title || '';
    wx.showModal({
      title: '删除活动',
      content: `确定删除「${title}」？`,
      confirmColor: '#ef4444',
      success: function(res) {
        if (!res.confirm) return;
        leaderDeleteActivity(id)
          .then(function() {
            wx.showToast({ title: '已删除', icon: 'success' });
            self.loadActivities();
          })
          .catch(function(err) {
            wx.showToast({ title: (err && err.msg) || '删除失败', icon: 'none' });
          });
      }
    });
  },

  onEditInput(e) {
    var k = e.currentTarget.dataset.k;
    var v = e.detail.value;
    var obj = Object.assign({}, this.data.edit);
    obj[k] = v;
    this.setData({ edit: obj });
  },

  onStatusPick(e) {
    var idx = parseInt(e.detail.value, 10) || 0;
    var opt = this.data.statusOptions[idx];
    var obj = Object.assign({}, this.data.edit);
    obj.status = opt.value;
    this.setData({ statusIndex: idx, edit: obj });
  },

  onCloseEdit() {
    this.setData({ editVisible: false });
  },

  onSubmitEdit() {
    var self = this;
    var d = self.data.edit || {};
    if (!d.title || !String(d.title).trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    // 兼容 LocalDateTime：将 "YYYY-MM-DD HH:mm:ss" 转为 ISO "YYYY-MM-DDTHH:mm:ss"
    if (d.startTime && String(d.startTime).indexOf(' ') > -1 && String(d.startTime).indexOf('T') === -1) {
      d.startTime = String(d.startTime).replace(' ', 'T');
    }
    if (d.endTime && String(d.endTime).indexOf(' ') > -1 && String(d.endTime).indexOf('T') === -1) {
      d.endTime = String(d.endTime).replace(' ', 'T');
    }
    var action = d.activityId ? leaderUpdateActivity(d) : leaderSaveActivity(d);
    action
      .then(function() {
        wx.showToast({ title: '已保存', icon: 'success' });
        self.setData({ editVisible: false });
        self.loadActivities();
      })
      .catch(function(err) {
        wx.showToast({ title: (err && err.msg) || '保存失败', icon: 'none' });
      });
  },

  // ========== 成员 ==========
  onKeyword(e) {
    this.setData({ keyword: e.detail.value });
  },

  loadMembers() {
    var self = this;
    self.setData({ memberLoading: true });
    leaderGetClubMembers(self.data.clubId, (self.data.keyword || '').trim())
      .then(function(list) {
        var members = (list || []).map(function(m) {
          return {
            memberId: m.memberId,
            userId: m.userId,
            username: m.username,
            studentNo: m.studentNo,
            phone: m.phone,
            role: m.role,
            avatar: m.avatar ? resolveMediaUrl(m.avatar) : ''
          };
        });
        self.setData({ members: members, memberLoading: false });
      })
      .catch(function(err) {
        self.setData({ memberLoading: false });
        wx.showToast({ title: (err && err.msg) || '加载失败', icon: 'none' });
      });
  },

  // ========== 入团申请 ==========
  onApplyKeyword(e) {
    this.setData({ applyKeyword: e.detail.value });
  },

  loadApplications() {
    var self = this;
    self.setData({ applyLoading: true });
    leaderGetApplications(1, 50, self.data.clubId, (self.data.applyKeyword || '').trim())
      .then(function(page) {
        var list = (page && page.records) ? page.records : [];
        self.setData({ applications: list, applyLoading: false });
      })
      .catch(function(err) {
        self.setData({ applyLoading: false });
        wx.showToast({ title: (err && err.msg) || '加载失败', icon: 'none' });
      });
  },

  onApprove(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    leaderApproveApplication(id)
      .then(function() {
        wx.showToast({ title: '已通过', icon: 'success' });
        self.loadApplications();
        self.loadMembers();
      })
      .catch(function(err) {
        wx.showToast({ title: (err && err.msg) || '操作失败', icon: 'none' });
      });
  },

  onReject(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    leaderRejectApplication(id)
      .then(function() {
        wx.showToast({ title: '已拒绝', icon: 'success' });
        self.loadApplications();
      })
      .catch(function(err) {
        wx.showToast({ title: (err && err.msg) || '操作失败', icon: 'none' });
      });
  },

  noop() {}
});

