# 校园二手物品交换小程序 Spec

## Why
在校园生活中，学生常有闲置物品需要处理，同时也有购买二手物品的需求。现有的二手交易多依赖微信群或线下，信息分散、查找困难。本小程序提供一个集中的二手物品交换平台，让同学们可以方便地发布、浏览和申请交换闲置物品，解决校园生活中的实际问题。

## What Changes
- [ ] 配置云开发环境 ID 为 `cloud1-d6g4fb9piee5ee36d`
- [ ] 新增 4 个核心小程序页面：首页列表、物品详情、发布物品、个人中心
- [ ] 新增 3 个数据库集合：`goods`、`exchanges`、`users`
- [ ] 新增 3 个云函数：`goodsFunctions`、`exchangeFunctions`、`userFunctions`
- [ ] 首页支持分类筛选、搜索、下拉刷新、上拉加载更多
- [ ] 物品详情页支持发起交换请求
- [ ] 个人中心支持管理"我的物品"和"我的交换请求"
- [ ] 数据增删改查操作通过云函数实现，确保安全

## Impact
- 受影响的前端页面：`pages/index/index`（改造成物品列表首页）、新增 `pages/goodsDetail/goodsDetail`、新增 `pages/publish/publish`、新增 `pages/profile/profile`、新增 `pages/myGoods/myGoods`、新增 `pages/myExchanges/myExchanges`
- 受影响的云函数：新增 `cloudfunctions/goodsFunctions`、`cloudfunctions/exchangeFunctions`、`cloudfunctions/userFunctions`
- 受影响的数据库：需要创建 `goods`、`exchanges`、`users` 集合并配置权限和索引
- 受影响的配置：`miniprogram/app.js` 中的 `env` 字段、`miniprogram/app.json` 的页面路由

## ADDED Requirements

### Requirement: 物品列表展示
The system SHALL 在首页展示所有可交换的二手物品列表，并支持分类筛选与分页加载。

#### Scenario: 浏览物品列表
- **WHEN** 用户打开小程序首页
- **THEN** 系统展示物品卡片列表（包含图片、标题、分类、成色、发布时间）
- **AND** 支持按分类筛选（电子产品 / 书籍 / 生活用品 / 服饰 / 其他）
- **AND** 支持下拉刷新和上拉加载更多（分页）
- **AND** 点击卡片可进入物品详情页

### Requirement: 物品详情查看
The system SHALL 提供物品详情页面，展示完整信息并支持发起交换请求。

#### Scenario: 查看物品详情
- **WHEN** 用户点击物品卡片
- **THEN** 系统跳转到物品详情页
- **AND** 展示物品图片（轮播）、标题、描述、成色、发布者信息（昵称、头像）、发布时间、交易地点
- **AND** 若是自己发布的物品，显示"编辑"和"删除"按钮
- **AND** 若是他人发布的物品，显示"申请交换"按钮

### Requirement: 发布与管理物品
The system SHALL 允许用户发布自己的闲置物品，并管理已发布的物品。

#### Scenario: 发布二手物品
- **WHEN** 用户点击发布按钮
- **THEN** 系统打开发布页面
- **AND** 用户可以填写标题、选择分类、填写描述、选择成色、上传图片（最多 6 张）、填写交易地点、填写期望交换的物品
- **AND** 提交后物品出现在首页列表

#### Scenario: 管理我的物品
- **WHEN** 用户进入"我的物品"页面
- **THEN** 系统展示当前用户发布的物品列表
- **AND** 支持编辑物品信息
- **AND** 支持删除物品
- **AND** 支持将物品状态改为"已下架"

### Requirement: 交换请求处理
The system SHALL 支持用户发起交换请求，并允许物品发布者处理请求。

#### Scenario: 发起交换请求
- **WHEN** 用户在他人物品详情页点击"申请交换"
- **THEN** 系统弹出申请对话框
- **AND** 用户可以填写交换留言
- **AND** 提交后物品发布者收到交换请求
- **AND** 同一用户不能重复申请同一物品

#### Scenario: 处理交换请求
- **WHEN** 用户在个人中心查看"收到的请求"
- **THEN** 系统展示请求列表（包含请求者信息、物品信息、留言、时间）
- **AND** 用户可以"同意"或"拒绝"请求
- **AND** 若同意，该物品状态自动变为 `exchanged`

#### Scenario: 查看我发出的请求
- **WHEN** 用户进入"我的请求"页面
- **THEN** 系统展示用户发出的所有交换请求
- **AND** 显示每个请求的处理状态（待处理 / 已同意 / 已拒绝）

### Requirement: 用户登录与信息获取
The system SHALL 自动获取用户信息并持久化到数据库，用于展示发布者身份。

#### Scenario: 首次进入小程序
- **WHEN** 用户首次打开小程序
- **THEN** 系统自动调用 `wx.getUserProfile` 获取用户昵称与头像
- **AND** 将用户信息存储到 `users` 集合（以 openid 为主键）
- **AND** 后续页面可直接使用用户信息

---

## 数据库设计

### 集合 1：goods（物品信息）

**权限配置**：
- 所有用户可读，仅创建者可写
- 配置路径：微信开发者工具 → 云开发 → 数据库 → `goods` 集合 → 权限设置 → 选择"所有用户可读，仅创建者可写"

**索引配置**：
| 索引名称 | 字段 | 排序 | 用途 |
|---------|------|------|------|
| idx_createTime | createTime | 降序 (desc) | 首页按时间倒序排列 |
| idx_category | category | 升序 (asc) | 分类筛选 |
| idx_status | status | 升序 (asc) | 筛选可交换物品 |
| idx_ownerOpenId | ownerOpenId | 升序 (asc) | 查询"我的物品" |
| idx_category_status | category + status | 升序 + 升序 | 分类+状态联合筛选 |

**字段说明**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | string | 自动 | 文档 ID |
| title | string | 是 | 物品标题，限制 50 字 |
| description | string | 否 | 物品描述，限制 500 字 |
| category | string | 是 | 分类：`electronics`/`books`/`daily`/`clothing`/`others` |
| images | Array<string> | 否 | 图片云存储 fileID 列表，最多 6 张 |
| condition | string | 是 | 成色：`brandNew`/`likeNew`/`good`/`fair`/`poor` |
| ownerOpenId | string | 是 | 发布者 openid |
| ownerNickName | string | 否 | 发布者昵称 |
| ownerAvatar | string | 否 | 发布者头像 URL |
| status | string | 是 | 状态：`available`（可交换）/ `exchanged`（已交换）/ `offline`（已下架）|
| location | string | 否 | 交易地点，如"东区宿舍" |
| wantExchangeFor | string | 否 | 期望交换的物品描述 |
| createTime | Date | 自动 | 创建时间，服务器时间 |
| updateTime | Date | 自动 | 更新时间，服务器时间 |

---

### 集合 2：exchanges（交换请求）

**权限配置**：
- **自定义权限**（前端不可直接读写，必须通过云函数操作）
- 配置路径：微信开发者工具 → 云开发 → 数据库 → `exchanges` 集合 → 权限设置 → 选择"自定义权限"
- 自定义规则：仅允许云函数读写

**索引配置**：
| 索引名称 | 字段 | 排序 | 用途 |
|---------|------|------|------|
| idx_goodsId | goodsId | 升序 (asc) | 查询物品的交换请求 |
| idx_fromUserOpenId | fromUserOpenId | 升序 (asc) | 查询"我发出的请求" |
| idx_toUserOpenId | toUserOpenId | 升序 (asc) | 查询"我收到的请求" |
| idx_status | status | 升序 (asc) | 状态筛选 |
| idx_createTime | createTime | 降序 (desc) | 按时间倒序排列 |
| idx_toUser_status | toUserOpenId + status | 升序 + 升序 | 查询收到的待处理请求 |

**字段说明**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | string | 自动 | 文档 ID |
| goodsId | string | 是 | 关联的物品 ID |
| goodsTitle | string | 否 | 物品标题（冗余存储，避免联表查询）|
| fromUserOpenId | string | 是 | 请求者 openid |
| fromUserNickName | string | 否 | 请求者昵称 |
| fromUserAvatar | string | 否 | 请求者头像 |
| toUserOpenId | string | 是 | 物品发布者 openid |
| message | string | 否 | 交换留言，限制 200 字 |
| status | string | 是 | 状态：`pending`（待处理）/ `accepted`（已同意）/ `rejected`（已拒绝）|
| createTime | Date | 自动 | 创建时间 |
| updateTime | Date | 自动 | 更新时间 |

---

### 集合 3：users（用户信息）

**权限配置**：
- 仅创建者可读写
- 配置路径：微信开发者工具 → 云开发 → 数据库 → `users` 集合 → 权限设置 → 选择"仅创建者可读写"

**索引配置**：
| 索引名称 | 字段 | 排序 | 用途 |
|---------|------|------|------|
| idx_openid | _openid | 升序 (asc) | 根据 openid 查询用户 |
| idx_createTime | createTime | 降序 (desc) | 按注册时间排序 |

**字段说明**：
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | string | 自动 | 文档 ID |
| _openid | string | 自动 | 用户 openid（云开发自动注入）|
| nickName | string | 否 | 微信昵称 |
| avatarUrl | string | 否 | 微信头像 URL |
| contact | string | 否 | 联系方式（手机号/微信号）|
| createTime | Date | 自动 | 首次登录时间 |
| updateTime | Date | 自动 | 信息更新时间 |

---

## 云函数设计

### goodsFunctions（物品相关云函数）

云函数路径：`cloudfunctions/goodsFunctions/`

| 接口名 | 说明 | 输入参数 | 输出 | 安全校验 |
|--------|------|----------|------|----------|
| `getGoodsList` | 分页查询物品列表 | `page`(number), `pageSize`(number), `category`(string, 可选) | `{ success, data: { list, total, hasMore } }` | 无 |
| `getGoodsDetail` | 获取物品详情 | `goodsId`(string) | `{ success, data }` | 无 |
| `createGoods` | 创建物品 | `title, description, category, images, condition, location, wantExchangeFor` | `{ success, data: { _id } }` | 必须登录 |
| `updateGoods` | 更新物品 | `goodsId, ...fields` | `{ success }` | 校验是否为 owner |
| `deleteGoods` | 删除物品 | `goodsId` | `{ success }` | 校验是否为 owner，级联删除关联 exchanges |
| `getMyGoods` | 获取我的物品 | `page, pageSize, status`(可选) | `{ success, data: { list, total } }` | 必须登录 |
| `searchGoods` | 搜索物品 | `keyword`(string), `page, pageSize` | `{ success, data: { list, total, hasMore } }` | 无 |

### exchangeFunctions（交换相关云函数）

云函数路径：`cloudfunctions/exchangeFunctions/`

| 接口名 | 说明 | 输入参数 | 输出 | 安全校验 |
|--------|------|----------|------|----------|
| `createExchange` | 发起交换请求 | `goodsId, message` | `{ success }` | 必须登录，不能请求自己的物品，不能重复申请 |
| `getExchangeList` | 获取交换请求列表 | `type`('sent'\|'received'), `page, pageSize` | `{ success, data: { list, total } }` | 必须登录 |
| `updateExchangeStatus` | 更新交换状态 | `exchangeId, status`('accepted'\|'rejected') | `{ success }` | 仅 toUserOpenId 可更新 |
| `getExchangeDetail` | 获取交换详情 | `exchangeId` | `{ success, data }` | 仅相关双方可查看 |

### userFunctions（用户相关云函数）

云函数路径：`cloudfunctions/userFunctions/`

| 接口名 | 说明 | 输入参数 | 输出 | 安全校验 |
|--------|------|----------|------|----------|
| `getUserInfo` | 获取/初始化用户信息 | 无（从上下文取 openid） | `{ success, data }` | 必须登录 |
| `updateUserInfo` | 更新用户信息 | `nickName, avatarUrl, contact` | `{ success }` | 仅可更新自己的信息 |

---

## 前端页面路由设计

`app.json` 中 `pages` 配置：
```json
[
  "pages/index/index",
  "pages/goodsDetail/index",
  "pages/publish/index",
  "pages/profile/index",
  "pages/myGoods/index",
  "pages/myExchanges/index"
]
```

**TabBar 设计**（3 个 Tab）：
| Tab | 页面路径 | 图标 | 文字 |
|-----|----------|------|------|
| 首页 | `pages/index/index` | home / home-active | 发现 |
| 发布 | `pages/publish/index` | goods / goods-active | 发布 |
| 我的 | `pages/profile/index` | usercenter / usercenter-active | 我的 |

**页面说明**：
| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `pages/index/index` | 物品卡片列表、分类筛选、搜索框 |
| 物品详情 | `pages/goodsDetail/index` | 图片轮播、物品信息、发布者信息、申请交换按钮 |
| 发布物品 | `pages/publish/index` | 表单填写、图片上传、提交 |
| 个人中心 | `pages/profile/index` | 用户头像昵称、我的物品入口、我的请求入口 |
| 我的物品 | `pages/myGoods/index` | 列表展示、编辑、删除、下架 |
| 我的请求 | `pages/myExchanges/index` | Tab 切换"我发出的"和"我收到的" |

---

## 关键交互流程

### 流程 1：用户首次进入
1. 用户打开小程序
2. `app.js` 初始化云开发环境（`env: 'cloud1-d6g4fb9piee5ee36d'`）
3. 调用 `userFunctions.getUserInfo` 获取/注册用户
4. 若用户未授权，引导授权获取 nickName 与 avatarUrl

### 流程 2：浏览与筛选物品
1. 进入首页，调用 `goodsFunctions.getGoodsList` 加载第一页数据
2. 用户选择分类 → 重新调用接口并传入 category 参数
3. 用户上拉 → 加载下一页（page + 1）
4. 用户下拉 → 重置 page=1 重新加载

### 流程 3：发布物品
1. 用户点击 TabBar "发布"
2. 填写表单，点击"上传图片"调用 `wx.cloud.uploadFile` 上传至云存储
3. 提交时调用 `goodsFunctions.createGoods`
4. 成功后跳转首页并刷新列表

### 流程 4：申请交换
1. 用户在物品详情页点击"申请交换"
2. 弹出模态框填写留言
3. 调用 `exchangeFunctions.createExchange`
4. 后端校验：不能申请自己的物品、不能重复申请
5. 成功后提示"申请已发送"

### 流程 5：处理交换请求
1. 物品发布者进入"我的 → 收到的请求"
2. 调用 `exchangeFunctions.getExchangeList`（type='received'）
3. 点击"同意"或"拒绝"
4. 调用 `exchangeFunctions.updateExchangeStatus`
5. 若同意，云函数内部同时更新 `goods.status = 'exchanged'`

---

## 云环境 ID 配置清单

| 配置项 | 值 | 配置位置 |
|--------|-----|----------|
| 云环境 ID | `cloud1-d6g4fb9piee5ee36d` | `miniprogram/app.js` → `globalData.env` |
| 云环境 ID | `cloud1-d6g4fb9piee5ee36d` | `cloudfunctions/*/index.js` → `cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })`（使用动态环境）|
| 云函数根目录 | `cloudfunctions/` | `project.config.json` → `cloudfunctionRoot` |

---

## 数据库初始化步骤（微信开发者工具中操作）

1. 打开微信开发者工具 → 点击右上角"云开发"按钮
2. 进入"数据库" tab
3. 分别创建以下集合：
   - `goods`
   - `exchanges`
   - `users`
4. 为每个集合配置权限（详见上方"权限配置"）
5. 为每个集合创建索引（详见上方"索引配置"）

## 云函数部署步骤（微信开发者工具中操作）

1. 在项目目录创建 `cloudfunctions/goodsFunctions`、`cloudfunctions/exchangeFunctions`、`cloudfunctions/userFunctions`
2. 每个云函数目录下包含 `index.js`、`config.json`、`package.json`
3. 在 `config.json` 中配置触发器和权限
4. 右键点击云函数目录 → "创建并部署：云端安装依赖"
