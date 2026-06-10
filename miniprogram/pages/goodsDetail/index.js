const getCurrentOpenId = () => {
  const app = getApp();
  const openid = app.globalData.userInfo?._openid;
  if (openid) return openid;

  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo._openid) return userInfo._openid;

    const storedOpenid = wx.getStorageSync('openid');
    if (storedOpenid) return storedOpenid;
  } catch (e) {
    console.error('读取本地存储失败', e);
  }

  return '';
};

Page({
  data: {
    goodsId: '',
    goodsDetail: null,
    isOwner: false,
    showExchangeModal: false,
    exchangeMessage: '',
  },

  onLoad(options) {
    const goodsId = options.goodsId || '';
    this.setData({ goodsId });

    if (goodsId) {
      this.loadDetail();
    } else {
      wx.showToast({ title: '物品ID不存在', icon: 'none' });
    }
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  },

  loadDetail() {
    wx.showLoading({ title: '加载中' });

    wx.cloud
      .callFunction({
        name: 'goodsFunctions',
        data: {
          type: 'getGoodsDetail',
          goodsId: this.data.goodsId,
        },
      })
      .then((res) => {
        wx.hideLoading();

        if (res.result && res.result.success) {
          const detail = res.result.data;
          const currentOpenId = getCurrentOpenId();
          const isOwner = detail.ownerOpenId === currentOpenId;
          detail.formattedCreateTime = this.formatDate(detail.createTime);
          this.setData({ goodsDetail: detail, isOwner });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('获取详情失败', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  onExchange() {
    const currentOpenId = getCurrentOpenId();
    if (!currentOpenId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    this.setData({ showExchangeModal: true, exchangeMessage: '' });
  },

  onExchangeCancel() {
    this.setData({ showExchangeModal: false });
  },

  onExchangeMessageInput(e) {
    this.setData({ exchangeMessage: e.detail.value });
  },

  onExchangeConfirm() {
    const { goodsId, exchangeMessage } = this.data;
    const trimmed = exchangeMessage.trim();

    if (!trimmed) {
      wx.showToast({ title: '请输入留言', icon: 'none' });
      return;
    }

    wx.cloud
      .callFunction({
        name: 'exchangeFunctions',
        data: {
          type: 'createExchange',
          goodsId,
          message: trimmed,
        },
      })
      .then((res) => {
        if (res.result && res.result.success) {
          wx.showToast({ title: '申请已发送', icon: 'success' });
          this.setData({ showExchangeModal: false, exchangeMessage: '' });
        } else {
          wx.showToast({ title: res.result?.message || '申请失败', icon: 'none' });
        }
      })
      .catch((err) => {
        console.error('申请交换失败', err);
        wx.showToast({ title: '申请失败', icon: 'none' });
      });
  },

  onEdit() {
    const { goodsId } = this.data;
    wx.navigateTo({
      url: `/pages/publish/index?goodsId=${goodsId}&mode=edit`,
    });
  },

  onDelete() {
    wx.showModal({
      title: '提示',
      content: '确定删除该物品吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this.doDelete();
        }
      },
    });
  },

  doDelete() {
    const { goodsId } = this.data;

    wx.cloud
      .callFunction({
        name: 'goodsFunctions',
        data: {
          type: 'deleteGoods',
          goodsId,
        },
      })
      .then((res) => {
        if (res.result && res.result.success) {
          wx.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' });
          }, 1500);
        } else {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      })
      .catch((err) => {
        console.error('删除失败', err);
        wx.showToast({ title: '删除失败', icon: 'none' });
      });
  },

  preventBubble() {
    // 阻止事件冒泡
  },
});
