// pages/search/search.js — 统一搜索：校园动态 / 学院公告 / 社团 / 二手 / 失物招领
var R = require('../../utils/request.js');

var SCOPES = [
  { key: 'post', label: '校园广场' },
  { key: 'college', label: '学院广场' },
  { key: 'club', label: '社团' },
  { key: 'goods', label: '二手市场' },
  { key: 'lost', label: '失物招领' }
];

function tagForScope(key) {
  var m = { post: '动态', college: '学院', club: '社团', goods: '闲置', lost: '失物' };
  return m[key] || '';
}

Page({
  data: {
    scopes: SCOPES,
    scope: 'post',
    keyword: '',
    inputValue: '',
    loading: false,
    results: [],
    emptyHint: ''
  },

  onLoad(options) {
    var scope = options.scope;
    var valid = SCOPES.some(function(s) { return s.key === scope; });
    if (!valid) scope = 'post';
    var kw = options.keyword ? decodeURIComponent(options.keyword) : '';
    this.setData({ scope: scope, keyword: kw, inputValue: kw });
    if (kw) {
      this.doSearch();
    }
  },

  onScopeTap(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ scope: key });
    if ((this.data.inputValue || '').trim()) {
      this.doSearch();
    }
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onConfirm() {
    this.doSearch();
  },

  doSearch() {
    var self = this;
    var kw = (self.data.inputValue || '').trim();
    self.setData({ keyword: kw, loading: true, results: [], emptyHint: '' });
    if (!kw) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      self.setData({ loading: false, emptyHint: '', results: [], keyword: '' });
      return;
    }
    var scope = self.data.scope;
    var req;
    if (scope === 'post') {
      req = R.getPostList(1, 50, '', kw);
    } else if (scope === 'college') {
      req = R.getCollegeNoticeList(1, 50, '', kw);
    } else if (scope === 'club') {
      req = R.getClubPage(1, 50, '', kw);
    } else if (scope === 'goods') {
      req = R.getGoodsPage(1, 50, '', kw);
    } else {
      req = R.getLostFoundList(1, 50, '', kw);
    }

    req
      .then(function(page) {
        var records = page.records || [];
        var results = records.map(function(r) {
          return self.mapRecord(scope, r);
        });
        self.setData({
          results: results,
          loading: false,
          emptyHint: results.length ? '' : '暂无匹配结果'
        });
      })
      .catch(function() {
        self.setData({ loading: false, results: [], emptyHint: '加载失败，请稍后重试' });
      });
  },

  mapRecord(scope, r) {
    var tag = tagForScope(scope);
    if (scope === 'post') {
      var title = (r.title && String(r.title).trim()) ? r.title : String(r.content || '').substring(0, 36);
      return {
        uid: 'post-' + r.postId,
        resultType: 'post',
        id: r.postId,
        tag: tag,
        title: title || '帖子',
        desc: String(r.content || '').substring(0, 120)
      };
    }
    if (scope === 'college') {
      return {
        uid: 'college-' + r.noticeId,
        resultType: 'college',
        id: r.noticeId,
        tag: r.college ? String(r.college) : tag,
        title: r.title || '公告',
        desc: String(r.content || '').substring(0, 120)
      };
    }
    if (scope === 'club') {
      return {
        uid: 'club-' + r.clubId,
        resultType: 'club',
        id: r.clubId,
        tag: tag,
        title: r.name || '社团',
        desc: String(r.description || '').substring(0, 120)
      };
    }
    if (scope === 'goods') {
      return {
        uid: 'goods-' + r.itemId,
        resultType: 'goods',
        id: r.itemId,
        tag: tag,
        title: r.title || '商品',
        desc: r.price != null ? '¥' + r.price : ''
      };
    }
    return {
      uid: 'lost-' + r.lostFoundId,
      resultType: 'lost',
      id: r.lostFoundId,
      tag: tag,
      title: r.title || r.itemName || '失物招领',
      desc: String(r.description || '').substring(0, 120)
    };
  },

  onResultTap(e) {
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (!id) return;
    var url;
    if (type === 'post') {
      url = '/pages/post-detail/post-detail?id=' + id;
    } else if (type === 'college') {
      url = '/pages/college-notice-detail/college-notice-detail?id=' + id;
    } else if (type === 'club') {
      url = '/pages/club-detail/club-detail?id=' + id;
    } else if (type === 'goods') {
      url = '/pages/goods-detail/goods-detail?id=' + id;
    } else {
      url = '/pages/lostfound-detail/lostfound-detail?id=' + id;
    }
    wx.navigateTo({ url: url });
  }
});
