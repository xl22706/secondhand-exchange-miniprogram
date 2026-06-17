Page({
  data: {
    currentTab: 'sent',
    sentList: [],
    receivedList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
  },

  onLoad() {
    this.loadExchanges();
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
      page: 1,
      hasMore: true,
      sentList: tab === 'sent' ? [] : this.data.sentList,
      receivedList: tab === 'received' ? [] : this.data.receivedList,
    }, () => {
      this.loadExchanges();
    });
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      sentList: this.data.currentTab === 'sent' ? [] : this.data.sentList,
      receivedList: this.data.currentTab === 'received' ? [] : this.data.receivedList,
    }, () => {
      this.loadExchanges();
    });
  },

  onReachBottom() {
    const { hasMore, loading } = this.data;
    if (hasMore && !loading) {
      this.setData({ page: this.data.page + 1 }, () => {
        this.loadExchanges();
      });
    }
  },

  loadExchanges() {
    const { currentTab, page, pageSize, sentList, receivedList } = this.data;
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'exchangeFunctions',
      data: {
        type: 'getExchangeList',
        tab: currentTab,
        page,
        pageSize,
      },
    }).then((res) => {
      const result = res.result || {};
      const data = result.data || {};
      const list = data.list || [];
      const total = data.total || 0;

      if (currentTab === 'sent') {
        const newList = page === 1 ? list : sentList.concat(list);
        this.setData({
          sentList: newList,
          hasMore: newList.length < total,
          loading: false,
        });
      } else {
        const newList = page === 1 ? list : receivedList.concat(list);
        this.setData({
          receivedList: newList,
          hasMore: newList.length < total,
          loading: false,
        });
      }
    }).catch((err) => {
      console.error('加载交换请求失败', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onAccept(e) {
    const exchangeId = e.currentTarget.dataset.exchangeId;
    wx.showModal({
      title: '提示',
      content: '确认同意该交换请求？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'exchangeFunctions',
            data: {
              type: 'updateExchangeStatus',
              exchangeId,
              status: 'accepted',
            },
          }).then(() => {
            wx.showToast({ title: '已同意', icon: 'success' });
            this.setData({ page: 1, hasMore: true, receivedList: [] }, () => {
              this.loadExchanges();
            });
          }).catch((err) => {
            console.error('同意交换请求失败', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          });
        }
      },
    });
  },

  onReject(e) {
    const exchangeId = e.currentTarget.dataset.exchangeId;
    wx.showModal({
      title: '提示',
      content: '确认拒绝该交换请求？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'exchangeFunctions',
            data: {
              type: 'updateExchangeStatus',
              exchangeId,
              status: 'rejected',
            },
          }).then(() => {
            wx.showToast({ title: '已拒绝', icon: 'success' });
            this.setData({ page: 1, hasMore: true, receivedList: [] }, () => {
              this.loadExchanges();
            });
          }).catch((err) => {
            console.error('拒绝交换请求失败', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          });
        }
      },
    });
  },

  onGoToGoods(e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '/pages/goodsDetail/index?goodsId=' + goodsId,
    });
  },
});
