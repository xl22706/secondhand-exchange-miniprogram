# 升级检查清单

## 首页物品列表
- [x] `index.wxml` 中 `item.publisherAvatar` 已改为 `item.ownerAvatar`
- [x] `index.wxml` 中 `item.publisherNickname` 已改为 `item.ownerNickName`
- [x] 物品成色显示为中文标签（全新/九成新/八成新/七成新/其他），而非英文枚举值

## 物品详情页
- [x] `goodsDetail/index.wxml` 中 `publisherAvatar` 已改为 `ownerAvatar`
- [x] `goodsDetail/index.wxml` 中 `publisherNickname` 已改为 `ownerNickName`
- [x] `goodsDetail/index.wxml` 中 `expectExchange` 已改为 `wantExchangeFor`
- [x] 分类和成色显示为中文标签

## 发布物品页
- [x] `publish/index.js` 中 `loadGoodsDetail` 的云函数调用参数已改为 `type`
- [x] `publish/index.js` 中 `submitForm` 的云函数调用参数已改为 `type`
- [x] 返回值判断已从 `code === 0` 改为 `success === true`

## 个人中心页
- [x] `profile/index.js` 中 `loadUserInfo` 已移除 `app.initUserInfo().then()` 错误调用
- [x] `profile/index.js` 中 `updateUserInfo` 的云函数调用参数已改为 `type`
- [x] 返回值判断已从 `code === 0` 改为 `success === true`
- [x] `updateUserInfo` 传参已拆平为 `nickName` 和 `avatarUrl`

## 我的物品页
- [x] `myGoods/index.js` 中 `loadMyGoods` 的云函数调用参数已改为 `type`
- [x] `myGoods/index.js` 中 `onDelete` 的云函数调用参数已改为 `type`
- [x] `myGoods/index.js` 中 `onOffline` 的云函数调用参数已改为 `type`
- [x] 返回值判断已从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`

## 我的交换请求页
- [x] `myExchanges/index.js` 中 `loadExchanges` 的云函数调用参数已改为 `type`
- [x] `myExchanges/index.js` 中 `onAccept` 的云函数调用参数已改为 `type`
- [x] `myExchanges/index.js` 中 `onReject` 的云函数调用参数已改为 `type`
- [x] 返回值判断已从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`
- [x] `myExchanges/index.wxml` 中"我发出的"列表字段已改为 `toUserAvatar`/`toUserNickName`
- [x] `myExchanges/index.wxml` 中"我收到的"列表字段已改为 `fromUserAvatar`/`fromUserNickName`
- [x] `exchangeFunctions/index.js` 的 `createExchange` 已补充存储 `fromUserAvatar` 和 `toUserAvatar`

## 数据库和云函数部署（手动操作）
- [ ] 数据库集合 `goods` 已创建，权限为"所有用户可读，仅创建者可写"
- [ ] 数据库集合 `exchanges` 已创建，权限为"自定义权限（仅云函数可读写）"
- [ ] 数据库集合 `users` 已创建，权限为"仅创建者可读写"
- [ ] `goods` 集合索引已全部创建（5 个）
- [ ] `exchanges` 集合索引已全部创建（6 个）
- [ ] `users` 集合索引已全部创建（2 个）
- [ ] `goodsFunctions` 云函数已部署
- [ ] `exchangeFunctions` 云函数已部署
- [ ] `userFunctions` 云函数已部署

## 功能验证
- [ ] 首页能正确加载并展示物品列表（从云数据库读取）
- [ ] 分类筛选功能正常
- [ ] 发布物品能成功写入云数据库
- [ ] 物品详情页能正确展示物品信息和发布者信息
- [ ] 申请交换功能正常，交换请求写入云数据库
- [ ] 个人中心能展示用户信息
- [ ] "我的物品"列表能正确展示
- [ ] "我的交换请求"列表能正确展示（我发出的/我收到的）
- [ ] 同意/拒绝交换请求功能正常
- [ ] 换设备登录数据不丢失（验证云数据库持久化）
