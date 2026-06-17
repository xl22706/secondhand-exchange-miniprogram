# 校园二手交换小程序 — 联机功能升级 Spec

## Why
当前项目已有页面和云函数代码框架，但存在多处前后端字段名/参数名不匹配的 bug，导致云函数调用失败、数据无法正确展示。同时数据库集合尚未创建、云函数尚未部署，小程序无法实现真正的"联机"功能（数据上云、换设备不丢失）。本次升级目标是修复所有 bug，完成数据库和云函数的部署，使小程序满足第二次课的验收要求。

## What Changes
- 修复所有前后端字段名不匹配的 bug（共 10 处）
- 修复云函数调用参数名不一致的 bug（`action` vs `type`，涉及 4 个页面）
- 修复云函数返回值格式判断不一致的 bug（`code === 0` vs `success === true`，涉及 3 个页面）
- 修复 `profile/index.js` 中 `initUserInfo` 调用方式错误
- 修复 `exchangeFunctions/createExchange` 缺少头像字段存储
- 引导用户创建数据库集合、配置权限和索引
- 引导用户部署 3 个云函数
- 确保所有页面能正确从云数据库读写数据

## Impact
- 受影响的前端页面：`pages/index/index`、`pages/goodsDetail/index`、`pages/publish/index`、`pages/profile/index`、`pages/myGoods/index`、`pages/myExchanges/index`
- 受影响的云函数：`exchangeFunctions`（需补充头像字段）、`goodsFunctions`/`userFunctions`（代码无需修改，只需部署）
- 受影响的数据库：需创建 `goods`、`exchanges`、`users` 集合并配置权限和索引

## MODIFIED Requirements

### Requirement: 首页物品列表 — 字段名修复
前端 `index.wxml` 中使用的字段名需与数据库字段对齐：
- `item.publisherAvatar` → `item.ownerAvatar`
- `item.publisherNickname` → `item.ownerNickName`
- `item.condition` 需显示中文标签（全新/九成新等），而非英文枚举值

### Requirement: 物品详情页 — 字段名修复
前端 `goodsDetail/index.wxml` 中使用的字段名需与数据库字段对齐：
- `goodsDetail.publisherAvatar` → `goodsDetail.ownerAvatar`
- `goodsDetail.publisherNickname` → `goodsDetail.ownerNickName`（wxml 中 class 为 `publisher-name`，绑定字段为 `publisherNickname`）
- `goodsDetail.expectExchange` → `goodsDetail.wantExchangeFor`
- `goodsDetail.category` 需显示中文标签
- `goodsDetail.condition` 需显示中文标签

### Requirement: 发布物品页 — 云函数参数名修复
`pages/publish/index.js` 调用云函数时使用 `action` 字段，但 `goodsFunctions` 云函数使用 `type` 字段进行 switch 判断，需统一为 `type`。
同时返回值判断需从 `res.result.code === 0` 改为 `res.result.success === true`。

### Requirement: 个人中心页 — 多处修复
- `profile/index.js` 中 `app.initUserInfo()` 不是 Promise，不能 `.then()`，需改为直接读取 `app.globalData.userInfo`
- 云函数调用参数 `action` 改为 `type`
- 返回值判断从 `code === 0` 改为 `success === true`
- `updateUserInfo` 传参需拆平，不能嵌套 `userInfo` 对象（应传 `nickName`、`avatarUrl` 而非 `userInfo`）

### Requirement: 我的物品页 — 云函数参数名修复
`pages/myGoods/index.js` 调用云函数时使用 `action` 字段，需统一为 `type`。
返回值判断需从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`（与云函数返回格式对齐）。

### Requirement: 我的交换请求页 — 字段名和参数名修复
- `pages/myExchanges/index.js` 调用云函数时使用 `action` 字段，需统一为 `type`
- 返回值判断需从 `result.list`/`result.total` 改为 `result.data.list`/`result.data.total`
- `myExchanges/index.wxml` 中字段名需与数据库对齐：
  - "我发出的"列表：`item.ownerAvatar` → `item.toUserAvatar`，`item.ownerNickName` → `item.toUserNickName`
  - "我收到的"列表：`item.requesterAvatar` → `item.fromUserAvatar`，`item.requesterNickName` → `item.fromUserNickName`
- `exchangeFunctions/createExchange` 需补充存储 `fromUserAvatar` 和 `toUserAvatar`（当前只存了昵称没存头像）

### Requirement: 物品详情页 — 云函数返回值判断
`pages/goodsDetail/index.js` 调用 `goodsFunctions` 时使用 `type` 字段（正确），调用 `exchangeFunctions` 时也使用 `type`（正确）。返回值判断 `res.result.success` 已正确，无需修改。

---

## 数据库初始化步骤（微信开发者工具中操作）

### 步骤 1：创建数据库集合
1. 打开微信开发者工具 → 点击右上角"云开发"按钮
2. 进入"数据库" tab
3. 分别创建以下 3 个集合：`goods`、`exchanges`、`users`

### 步骤 2：配置集合权限
| 集合 | 权限设置 |
|------|---------|
| `goods` | 所有用户可读，仅创建者可写 |
| `exchanges` | 自定义权限（仅云函数可读写） |
| `users` | 仅创建者可读写 |

### 步骤 3：创建索引
**goods 集合索引**：
| 索引名称 | 字段 | 排序 |
|---------|------|------|
| idx_createTime | createTime | 降序 (desc) |
| idx_category | category | 升序 (asc) |
| idx_status | status | 升序 (asc) |
| idx_ownerOpenId | ownerOpenId | 升序 (asc) |
| idx_category_status | category + status | 升序 + 升序 |

**exchanges 集合索引**：
| 索引名称 | 字段 | 排序 |
|---------|------|------|
| idx_goodsId | goodsId | 升序 (asc) |
| idx_fromUserOpenId | fromUserOpenId | 升序 (asc) |
| idx_toUserOpenId | toUserOpenId | 升序 (asc) |
| idx_status | status | 升序 (asc) |
| idx_createTime | createTime | 降序 (desc) |
| idx_toUser_status | toUserOpenId + status | 升序 + 升序 |

**users 集合索引**：
| 索引名称 | 字段 | 排序 |
|---------|------|------|
| idx_openid | _openid | 升序 (asc) |
| idx_createTime | createTime | 降序 (desc) |

### 步骤 4：部署云函数
在微信开发者工具中，右键点击以下每个云函数目录 → "创建并部署：云端安装依赖"：
1. `cloudfunctions/goodsFunctions`
2. `cloudfunctions/exchangeFunctions`
3. `cloudfunctions/userFunctions`

---

## 云环境配置

| 配置项 | 值 |
|--------|-----|
| AppID | `wx4b09f11fd8ccfc43` |
| 云环境 ID | `cloud1-d6g4fb9piee5ee36d` |
| 云函数根目录 | `cloudfunctions/` |
