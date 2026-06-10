const app = getApp();

Page({
  data: {
    form: {
      title: '',
      category: 'electronics',
      description: '',
      condition: 'brandNew',
      location: '',
      wantExchangeFor: '',
      images: []
    },
    categories: [
      { label: '电子产品', value: 'electronics' },
      { label: '书籍', value: 'books' },
      { label: '生活用品', value: 'daily' },
      { label: '服饰', value: 'clothing' },
      { label: '其他', value: 'others' }
    ],
    conditions: [
      { label: '全新', value: 'brandNew' },
      { label: '九成新', value: 'likeNew' },
      { label: '八成新', value: 'good' },
      { label: '七成新', value: 'fair' },
      { label: '其他', value: 'poor' }
    ],
    mode: 'create',
    goodsId: ''
  },

  onLoad(options) {
    if (options.mode === 'edit' && options.goodsId) {
      this.setData({
        mode: 'edit',
        goodsId: options.goodsId
      });
      this.loadGoodsDetail(options.goodsId);
    }
    this.updatePickerLabels();
  },

  updatePickerLabels() {
    const { form, categories, conditions } = this.data;
    const categoryItem = categories.find(item => item.value === form.category);
    const conditionItem = conditions.find(item => item.value === form.condition);
    this.setData({
      categoryLabel: categoryItem ? categoryItem.label : '',
      conditionLabel: conditionItem ? conditionItem.label : ''
    });
  },

  loadGoodsDetail(goodsId) {
    wx.cloud.callFunction({
      name: 'goodsFunctions',
      data: {
        action: 'getGoodsDetail',
        goodsId
      }
    }).then(res => {
      if (res.result && res.result.code === 0) {
        const detail = res.result.data || {};
        this.setData({
          form: {
            title: detail.title || '',
            category: detail.category || 'electronics',
            description: detail.description || '',
            condition: detail.condition || 'brandNew',
            location: detail.location || '',
            wantExchangeFor: detail.wantExchangeFor || '',
            images: detail.images || []
          }
        });
        this.updatePickerLabels();
      }
    }).catch(err => {
      console.error('获取物品详情失败', err);
      wx.showToast({ title: '获取详情失败', icon: 'none' });
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`form.${field}`]: value
    });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const item = this.data.categories[index];
    this.setData({
      'form.category': item.value,
      categoryLabel: item.label
    });
  },

  onConditionChange(e) {
    const index = e.detail.value;
    const item = this.data.conditions[index];
    this.setData({
      'form.condition': item.value,
      conditionLabel: item.label
    });
  },

  chooseImage() {
    const remainCount = 6 - this.data.form.images.length;
    if (remainCount <= 0) {
      wx.showToast({ title: '最多上传6张图片', icon: 'none' });
      return;
    }

    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.uploadImages(tempFilePaths);
      }
    });
  },

  uploadImages(tempFilePaths) {
    const uploadTasks = tempFilePaths.map((filePath, index) => {
      const cloudPath = `goods/${Date.now()}-${index}.png`;
      return wx.cloud.uploadFile({
        cloudPath,
        filePath
      });
    });

    Promise.all(uploadTasks)
      .then(results => {
        const fileIDs = results.map(res => res.fileID);
        const newImages = this.data.form.images.concat(fileIDs);
        this.setData({
          'form.images': newImages
        });
      })
      .catch(err => {
        console.error('上传图片失败', err);
        wx.showToast({ title: '上传图片失败', icon: 'none' });
      });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.form.images.slice();
    images.splice(index, 1);
    this.setData({
      'form.images': images
    });
  },

  submitForm() {
    const { form, mode, goodsId } = this.data;

    if (!form.title.trim()) {
      wx.showToast({ title: '请输入物品标题', icon: 'none' });
      return;
    }
    if (!form.category) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (!form.condition) {
      wx.showToast({ title: '请选择成色', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...', mask: true });

    const action = mode === 'edit' ? 'updateGoods' : 'createGoods';
    const params = mode === 'edit' ? { ...form, goodsId } : form;

    wx.cloud.callFunction({
      name: 'goodsFunctions',
      data: {
        action,
        ...params
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result.code === 0) {
        wx.showToast({
          title: mode === 'edit' ? '保存成功' : '发布成功',
          icon: 'success'
        });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' });
        }, 1500);
      } else {
        wx.showToast({ title: res.result?.message || '提交失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('提交失败', err);
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    });
  }
});
