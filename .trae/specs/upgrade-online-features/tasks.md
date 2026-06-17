# 升级任务清单

- [x] Task 1: 修复首页物品列表字段名
  - [x] SubTask 1.1: 修改 `pages/index/index.wxml`，将 `item.publisherAvatar` 改为 `item.ownerAvatar`，`item.publisherNickname` 改为 `item.ownerNickName`
  - [x] SubTask 1.2: 在 `pages/index/index.js` 中添加成色中文标签映射，在 `loadGoodsList` 成功后将 `condition` 枚举值转换为中文显示

- [x] Task 2: 修复物品详情页字段名
  - [x] SubTask 2.1: 修改 `pages/goodsDetail/index.wxml`，将 `publisherAvatar` → `ownerAvatar`、`publisherNickname` → `ownerNickName`、`expectExchange` → `wantExchangeFor`
  - [x] SubTask 2.2: 在 `pages/goodsDetail/index.js` 的 `loadDetail` 中添加分类和成色的中文标签转换

- [x] Task 3: 修复发布物品页云函数调用
  - [x] SubTask 3.1: 修改 `pages/publish/index.js`，将云函数调用参数 `action` 改为 `type`（`loadGoodsDetail` 和 `submitForm` 两处）
  - [x] SubTask 3.2: 将返回值判断从 `res.result.code === 0` 改为 `res.result.success === true`

- [x] Task 4: 修复个人中心页
  - [x] SubTask 4.1: 修改 `pages/profile/index.js` 的 `loadUserInfo`，移除 `app.initUserInfo().then()` 的错误调用，改为直接读取 `app.globalData.userInfo`
  - [x] SubTask 4.2: 将云函数调用参数 `action` 改为 `type`（`updateUserInfo` 调用处）
  - [x] SubTask 4.3: 将返回值判断从 `code === 0` 改为 `success === true`
  - [x] SubTask 4.4: 修复 `updateUserInfo` 传参，将 `userInfo` 对象拆平为 `nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl`

- [x] Task 5: 修复我的物品页
  - [x] SubTask 5.1: 修改 `pages/myGoods/index.js`，将云函数调用参数 `action` 改为 `type`（`loadMyGoods`、`onDelete`、`onOffline` 三处）
  - [x] SubTask 5.2: 将返回值判断从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`

- [x] Task 6: 修复我的交换请求页
  - [x] SubTask 6.1: 修改 `pages/myExchanges/index.js`，将云函数调用参数 `action` 改为 `type`（`loadExchanges`、`onAccept`、`onReject` 三处）
  - [x] SubTask 6.2: 将返回值判断从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`
  - [x] SubTask 6.3: 修改 `pages/myExchanges/index.wxml`，将"我发出的"列表中 `item.ownerAvatar` 改为 `item.toUserAvatar`，`item.ownerNickName` 改为 `item.toUserNickName`
  - [x] SubTask 6.4: 修改 `pages/myExchanges/index.wxml`，将"我收到的"列表中 `item.requesterAvatar` 改为 `item.fromUserAvatar`，`item.requesterNickName` 改为 `item.fromUserNickName`
  - [x] SubTask 6.5: 修改 `exchangeFunctions/index.js` 的 `createExchange`，补充存储 `fromUserAvatar` 和 `toUserAvatar` 字段

- [ ] Task 7: 引导用户完成数据库和云函数部署（手动操作，需用户在微信开发者工具中完成）
  - [ ] SubTask 7.1: 在微信开发者工具中创建 `goods`、`exchanges`、`users` 数据库集合
  - [ ] SubTask 7.2: 配置各集合权限（见 spec.md 步骤 2）
  - [ ] SubTask 7.3: 创建各集合索引（见 spec.md 步骤 3）
  - [ ] SubTask 7.4: 部署 `goodsFunctions`、`exchangeFunctions`、`userFunctions` 云函数

# Task Dependencies
- Task 1 ~ Task 6 可并行（互不依赖）
- Task 6.5（修改云函数）需在 Task 6.3、6.4 之前完成
- Task 7 为手动操作，需在所有代码修复（Task 1~6）完成后进行
