var { getLostFoundList, resolveMediaUrl } = require('../../utils/request.js');

function lostFoundThumb(raw) {
  if (!raw) return '';
  var s = String(raw).trim();
  if (s.charAt(0) === '[') {
    try {
      var arr = JSON.parse(s);
      if (arr && arr[0]) return resolveMediaUrl(arr[0]);
    } catch (e) {}
    return '';
  }
  return resolveMediaUrl(s);
}

function formatStatus(status) {
  if (status === 0) return { text: '待处理', className: 'pending' };
  if (status === 1) return { text: '进行中', className: 'active' };
  return { text: '已找到', className: 'done' };
}

Page({
  data: {
    currentTab: 0,
    statusFilter: '',
    keyword: '',
    items: [],
    loading: false,
    pageNum: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadData(true);
  },

  onShow() {
    this.loadData(true);
  },

  loadData(reset) {
    var self = this;
    var tabType = this.data.currentTab === 0 ? 1 : 2;
    var nextPage = reset ? 1 : this.data.pageNum;
    if (!reset && !this.data.hasMore) return;
    this.setData({ loading: true });
    getLostFoundList(nextPage, this.data.pageSize, tabType, this.data.statusFilter, this.data.keyword)
      .then(function(page) {
        var records = page.records || [];
        var mapped = records.map(function(item) {
          var status = formatStatus(item.status);
          return {
            id: item.lostFoundId,
            title: item.title || '未命名',
            itemName: item.itemName || '',
            image: lostFoundThumb(item.itemImage),
            location: item.location || '未填写地点',
            time: item.lostTime ? String(item.lostTime).replace('T', ' ').substring(0, 16) : '时间未知',
            description: item.description || '暂无描述',
            statusText: status.text,
            statusClass: status.className
          };
        });
        self.setData({
          items: reset ? mapped : self.data.items.concat(mapped),
          pageNum: nextPage + 1,
          hasMore: mapped.length >= self.data.pageSize
        });
      })
      .catch(function() {})
      .finally(function() {
        self.setData({ loading: false });
      });
  },

  onReachBottom() {
    this.loadData(false);
  },

  onPullDownRefresh() {
    this.loadData(true);
    wx.stopPullDownRefresh();
  },

  onTabChange(e) {
    this.setData({
      currentTab: parseInt(e.currentTarget.dataset.index, 10),
      pageNum: 1,
      hasMore: true
    });
    this.loadData(true);
  },

  onStatusFilterChange(e) {
    var raw = e.currentTarget.dataset.status;
    var status = raw === '' || raw === undefined || raw === null ? '' : Number(raw);
    this.setData({
      statusFilter: status,
      pageNum: 1,
      hasMore: true
    });
    this.loadData(true);
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.setData({ pageNum: 1, hasMore: true });
    this.loadData(true);
  },

  onPublishLost() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound?type=lost' });
  },

  onPublishFound() {
    var isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/publish-lostfound/publish-lostfound?type=found' });
  },

  onItemTap(e) {
    wx.navigateTo({ url: '/pages/lostfound-detail/lostfound-detail?id=' + e.currentTarget.dataset.id });
  }
});
