Page({
  data: {
    goodsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
  },

  onLoad() {
    this.loadMyGoods();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      goodsList: [],
      hasMore: true,
    }, () => {
      this.loadMyGoods();
    });
  },

  onReachBottom() {
    const { hasMore, loading } = this.data;
    if (hasMore && !loading) {
      this.setData({ page: this.data.page + 1 }, () => {
        this.loadMyGoods();
      });
    }
  },

  loadMyGoods() {
    const { page, pageSize, goodsList } = this.data;
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'goodsFunctions',
      data: {
        action: 'getMyGoods',
        page,
        pageSize,
      },
    }).then((res) => {
      const result = res.result || {};
      const list = result.list || [];
      const total = result.total || 0;

      this.setData({
        goodsList: page === 1 ? list : goodsList.concat(list),
        hasMore: goodsList.length + list.length < total,
        loading: false,
      });
    }).catch((err) => {
      console.error('加载我的物品失败', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onEdit(e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '/pages/publish/index?goodsId=' + goodsId + '&mode=edit',
    });
  },

  onDelete(e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，是否继续？',
      confirmColor: '#e64340',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'goodsFunctions',
            data: {
              action: 'deleteGoods',
              goodsId,
            },
          }).then(() => {
            wx.showToast({ title: '已删除', icon: 'success' });
            this.setData({ page: 1, goodsList: [], hasMore: true }, () => {
              this.loadMyGoods();
            });
          }).catch((err) => {
            console.error('删除物品失败', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          });
        }
      },
    });
  },

  onOffline(e) {
    const goodsId = e.currentTarget.dataset.goodsId;
    wx.cloud.callFunction({
      name: 'goodsFunctions',
      data: {
        action: 'updateGoods',
        goodsId,
        status: 'offline',
      },
    }).then(() => {
      wx.showToast({ title: '已下架', icon: 'success' });
      this.setData({ page: 1, goodsList: [], hasMore: true }, () => {
        this.loadMyGoods();
      });
    }).catch((err) => {
      console.error('下架物品失败', err);
      wx.showToast({ title: '下架失败', icon: 'none' });
    });
  },
});
