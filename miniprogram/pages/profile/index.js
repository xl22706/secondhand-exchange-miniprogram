const app = getApp();

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const globalUserInfo = app.globalData.userInfo;
    if (globalUserInfo) {
      this.setData({
        userInfo: globalUserInfo
      });
    } else if (typeof app.initUserInfo === 'function') {
      app.initUserInfo().then(userInfo => {
        this.setData({ userInfo });
      }).catch(err => {
        console.error('初始化用户信息失败', err);
      });
    }
  },

  onTapLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        app.globalData.userInfo = userInfo;
        this.setData({ userInfo });
        this.updateUserInfo(userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },

  updateUserInfo(userInfo) {
    wx.cloud.callFunction({
      name: 'userFunctions',
      data: {
        action: 'updateUserInfo',
        userInfo
      }
    }).then(res => {
      if (res.result && res.result.code === 0) {
        console.log('用户信息更新成功');
      }
    }).catch(err => {
      console.error('更新用户信息失败', err);
    });
  },

  onTapMyGoods() {
    wx.navigateTo({
      url: '/pages/myGoods/index'
    });
  },

  onTapMyExchanges() {
    wx.navigateTo({
      url: '/pages/myExchanges/index'
    });
  },

  onTapEditProfile() {
    wx.getUserProfile({
      desc: '用于更新用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        app.globalData.userInfo = userInfo;
        this.setData({ userInfo });
        this.updateUserInfo(userInfo);
        wx.showToast({ title: '更新成功', icon: 'success' });
      },
      fail: (err) => {
        console.error('更新用户信息失败', err);
      }
    });
  }
});
