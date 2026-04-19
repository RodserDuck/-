// pages/chat/chat.js
Page({
  data: {
    messages: [
      { id: 1, type: 'other', avatar: 'https://picsum.photos/100/100?random=30', content: '你好，商品还在吗？', time: '10:30' },
      { id: 2, type: 'me', avatar: '', content: '在的，可以约时间看货', time: '10:32' },
      { id: 3, type: 'other', avatar: 'https://picsum.photos/100/100?random=30', content: '好的，我明天下午有空', time: '10:33' }
    ],
    inputValue: ''
  },

  onLoad(options) {
    console.log('打开聊天', options);
  },

  onInput(e) { this.setData({ inputValue: e.detail.value }); },

  onSend() {
    var self = this;
    var content = self.data.inputValue.trim();
    if (!content) return;
    var newMsg = { id: Date.now(), type: 'me', avatar: '', content: content, time: self.getNowTime() };
    self.setData({ messages: self.data.messages.concat([newMsg]), inputValue: '' });
  },

  getNowTime() {
    var now = new Date();
    return now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
  }
});
