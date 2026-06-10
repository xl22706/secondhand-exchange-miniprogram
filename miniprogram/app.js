// app.js
App({
  onLaunch: function () {
    this.globalData = {
      // env 参数说明：
      // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会请求到哪个云环境的资源
      // 云环境 ID: cloud1-d6g4fb9piee5ee36d
      env: "cloud1-d6g4fb9piee5ee36d",
    };
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }

    // 获取或初始化用户信息
    this.initUserInfo();
  },

  initUserInfo() {
    wx.cloud.callFunction({
      name: "userFunctions",
      data: { type: "getUserInfo" },
    }).then((res) => {
      if (res.result && res.result.success) {
        this.globalData.userInfo = res.result.data;
      }
    }).catch((err) => {
      console.error("获取用户信息失败", err);
    });
  },

  globalData: {
    env: "cloud1-d6g4fb9piee5ee36d",
    userInfo: null,
  },
});
