// pages/chat/chat.ts
Page({
  data: {
    goods: {
      id: 1,
      title: 'iPad Air 5 64G 深空灰',
      price: 3200,
      image: 'https://picsum.photos/300/300?random=40'
    },
    messages: [
      { id: 1, type: 'other', content: '你好，请问这个还在吗？', time: '14:30', avatar: 'https://picsum.photos/100/100?random=50' },
      { id: 2, type: 'self', content: '在的，还在保修期内', time: '14:32', avatar: 'https://picsum.photos/100/100?random=99' },
      { id: 3, type: 'other', content: '价格还能便宜点吗？', time: '14:35', avatar: 'https://picsum.photos/100/100?random=50' }
    ],
    inputValue: ''
  },

  onLoad(options: any) {
    const sellerId = options.sellerId;
    const goodsId = options.goodsId;
    console.log('聊天页面，卖家ID:', sellerId, '商品ID:', goodsId);
  },

  // 输入消息
  onInput(e: any) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息
  onSend() {
    const content = this.data.inputValue.trim();
    if (!content) {
      wx.showToast({ title: '请输入消息', icon: 'none' });
      return;
    }

    const newMessage = {
      id: Date.now(),
      type: 'self',
      content: content,
      time: this.getCurrentTime(),
      avatar: 'https://picsum.photos/100/100?random=99'
    };

    this.setData({
      messages: [...this.data.messages, newMessage],
      inputValue: ''
    });
  },

  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
});
