# Tasks

- [x] Task 1: 云开发环境配置与数据库初始化
  - [x] SubTask 1.1: 在 `miniprogram/app.js` 中配置 `env: 'cloud1-d6g4fb9piee5ee36d'`
  - [x] SubTask 1.2: 修改 `app.json`，更新 navigationBarTitleText 为"校园二手交换"
  - [ ] SubTask 1.3: 在微信开发者工具中创建数据库集合 `goods`，配置权限为"所有用户可读，仅创建者可写"
  - [ ] SubTask 1.4: 在微信开发者工具中创建数据库集合 `exchanges`，配置权限为"自定义权限（仅云函数可读写）"
  - [ ] SubTask 1.5: 在微信开发者工具中创建数据库集合 `users`，配置权限为"仅创建者可读写"
  - [ ] SubTask 1.6: 为 `goods` 集合创建索引：`idx_createTime`(desc)、`idx_category`(asc)、`idx_status`(asc)、`idx_ownerOpenId`(asc)、`idx_category_status`(asc+asc)
  - [ ] SubTask 1.7: 为 `exchanges` 集合创建索引：`idx_goodsId`(asc)、`idx_fromUserOpenId`(asc)、`idx_toUserOpenId`(asc)、`idx_status`(asc)、`idx_createTime`(desc)、`idx_toUser_status`(asc+asc)
  - [ ] SubTask 1.8: 为 `users` 集合创建索引：`idx_openid`(asc)、`idx_createTime`(desc)

- [x] Task 2: 用户系统与用户云函数
  - [x] SubTask 2.1: 创建 `cloudfunctions/userFunctions/package.json`
  - [x] SubTask 2.2: 创建 `cloudfunctions/userFunctions/config.json`
  - [x] SubTask 2.3: 实现 `userFunctions/index.js`，包含 `getUserInfo` 和 `updateUserInfo` 接口
  - [ ] SubTask 2.4: 部署 `userFunctions` 云函数
  - [x] SubTask 2.5: 在 `app.js` 的 `onLaunch` 中调用 `getUserInfo` 初始化用户信息

- [x] Task 3: 首页物品列表页面
  - [x] SubTask 3.1: 重写 `pages/index/index.js`，实现物品列表数据加载、分页、下拉刷新、上拉加载
  - [x] SubTask 3.2: 重写 `pages/index/index.wxml`，设计物品卡片列表、分类筛选 Tab、搜索框
  - [x] SubTask 3.3: 重写 `pages/index/index.wxss`，实现卡片布局、分类 Tab 样式
  - [x] SubTask 3.4: 在 `app.json` 中配置 TabBar（发现、发布、我的）

- [x] Task 4: 物品详情页面
  - [x] SubTask 4.1: 创建 `pages/goodsDetail/index.js`，实现获取详情、判断是否为本人发布、处理申请交换
  - [x] SubTask 4.2: 创建 `pages/goodsDetail/index.wxml`，实现图片轮播、物品信息展示、操作按钮
  - [x] SubTask 4.3: 创建 `pages/goodsDetail/index.wxss`，实现详情页布局
  - [x] SubTask 4.4: 创建 `pages/goodsDetail/index.json`，配置页面标题

- [x] Task 5: 物品云函数
  - [x] SubTask 5.1: 创建 `cloudfunctions/goodsFunctions/package.json`
  - [x] SubTask 5.2: 创建 `cloudfunctions/goodsFunctions/config.json`
  - [x] SubTask 5.3: 实现 `goodsFunctions/index.js`，包含 `getGoodsList`、`getGoodsDetail`、`createGoods`、`updateGoods`、`deleteGoods`、`getMyGoods`、`searchGoods` 接口
  - [ ] SubTask 5.4: 部署 `goodsFunctions` 云函数

- [x] Task 6: 发布物品页面
  - [x] SubTask 6.1: 创建 `pages/publish/index.js`，实现表单数据绑定、图片上传（云存储）、提交调用 `createGoods`
  - [x] SubTask 6.2: 创建 `pages/publish/index.wxml`，设计表单：标题、分类选择器、成色选择器、描述 textarea、图片上传组件、地点输入、期望交换输入
  - [x] SubTask 6.3: 创建 `pages/publish/index.wxss`，实现表单布局与上传图片网格
  - [x] SubTask 6.4: 创建 `pages/publish/index.json`，配置页面标题为"发布物品"

- [x] Task 7: 个人中心页面
  - [x] SubTask 7.1: 创建 `pages/profile/index.js`，展示用户头像昵称、提供"我的物品"和"我的请求"入口
  - [x] SubTask 7.2: 创建 `pages/profile/index.wxml`，设计用户卡片、功能列表入口
  - [x] SubTask 7.3: 创建 `pages/profile/index.wxss`，实现个人中心布局
  - [x] SubTask 7.4: 创建 `pages/profile/index.json`，配置页面标题为"我的"

- [x] Task 8: 我的物品页面
  - [x] SubTask 8.1: 创建 `pages/myGoods/index.js`，调用 `getMyGoods`、实现编辑跳转和删除确认
  - [x] SubTask 8.2: 创建 `pages/myGoods/index.wxml`，物品列表带状态标签、编辑/删除按钮
  - [x] SubTask 8.3: 创建 `pages/myGoods/index.wxss`，列表布局
  - [x] SubTask 8.4: 创建 `pages/myGoods/index.json`

- [x] Task 9: 交换请求云函数
  - [x] SubTask 9.1: 创建 `cloudfunctions/exchangeFunctions/package.json`
  - [x] SubTask 9.2: 创建 `cloudfunctions/exchangeFunctions/config.json`
  - [x] SubTask 9.3: 实现 `exchangeFunctions/index.js`，包含 `createExchange`、`getExchangeList`、`updateExchangeStatus`、`getExchangeDetail` 接口
  - [ ] SubTask 9.4: 部署 `exchangeFunctions` 云函数

- [x] Task 10: 我的交换请求页面
  - [x] SubTask 10.1: 创建 `pages/myExchanges/index.js`，实现 Tab 切换（我发出的 / 我收到的），调用 `getExchangeList`
  - [x] SubTask 10.2: 创建 `pages/myExchanges/index.wxml`，请求列表展示、同意/拒绝按钮
  - [x] SubTask 10.3: 创建 `pages/myExchanges/index.wxss`
  - [x] SubTask 10.4: 创建 `pages/myExchanges/index.json`

# Task Dependencies
- Task 1 必须在所有其他 Task 之前完成
- Task 2 必须在 Task 3、Task 7 之前完成（需要用户信息）
- Task 5 必须在 Task 3、Task 6、Task 8 之前完成（需要 goods 云函数）
- Task 9 必须在 Task 4、Task 10 之前完成（需要 exchange 云函数）
- Task 3 和 Task 4 可并行
- Task 6 和 Task 7 可并行
- Task 8 和 Task 10 可并行
