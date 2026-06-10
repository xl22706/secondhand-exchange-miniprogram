Page({
  data: {
    goodsList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    category: 'all',
    keyword: '',
    categories: [
      { label: '全部', value: 'all' },
      { label: '电子产品', value: 'electronics' },
      { label: '书籍', value: 'books' },
      { label: '生活用品', value: 'daily' },
      { label: '服饰', value: 'clothing' },
      { label: '其他', value: 'others' },
    ],
  },

  onLoad() {
    this.loadGoodsList();
  },

  onPullDownRefresh() {
    this.resetList();
    this.loadGoodsList().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    const { hasMore, loading } = this.data;
    if (!hasMore || loading) {
      return;
    }
    this.setData({ page: this.data.page + 1 });
    this.loadGoodsList();
  },

  resetList() {
    this.setData({
      page: 1,
      goodsList: [],
      hasMore: true,
    });
  },

  loadGoodsList() {
    const { page, pageSize, category } = this.data;
    this.setData({ loading: true });

    const params = {
      type: 'getGoodsList',
      page,
      pageSize,
      category: category === 'all' ? undefined : category,
    };

    return wx.cloud
      .callFunction({
        name: 'goodsFunctions',
        data: params,
      })
      .then((res) => {
        if (res.result && res.result.success) {
          const list = res.result.data || [];
          const goodsList = this.data.goodsList.concat(list);
          const hasMore = list.length === pageSize;
          this.setData({ goodsList, hasMore });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      })
      .catch((err) => {
        console.error('加载列表失败', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },

  onCategoryChange(e) {
    const { value } = e.currentTarget.dataset;
    if (value === this.data.category) {
      return;
    }
    this.setData({ category: value });
    this.resetList();
    this.loadGoodsList();
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch(e) {
    const { keyword } = this.data;
    const trimmed = keyword.trim();
    if (!trimmed) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }

    wx.cloud
      .callFunction({
        name: 'goodsFunctions',
        data: {
          type: 'searchGoods',
          keyword: trimmed,
        },
      })
      .then((res) => {
        if (res.result && res.result.success) {
          this.setData({
            goodsList: res.result.data || [],
            hasMore: false,
          });
        } else {
          wx.showToast({ title: '搜索失败', icon: 'none' });
        }
      })
      .catch((err) => {
        console.error('搜索失败', err);
        wx.showToast({ title: '搜索失败', icon: 'none' });
      });
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/goodsDetail/index?goodsId=${id}`,
    });
  },
});
