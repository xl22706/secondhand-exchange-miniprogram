const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID;

    switch (event.type) {
      case 'getGoodsList':
        return await getGoodsList(event);
      case 'getGoodsDetail':
        return await getGoodsDetail(event);
      case 'createGoods':
        return await createGoods(OPENID, event);
      case 'updateGoods':
        return await updateGoods(OPENID, event);
      case 'deleteGoods':
        return await deleteGoods(OPENID, event);
      case 'getMyGoods':
        return await getMyGoods(OPENID, event);
      case 'searchGoods':
        return await searchGoods(event);
      default:
        return { success: false, errMsg: '未知操作类型' };
    }
  } catch (e) {
    return { success: false, errMsg: e.message || e };
  }
};

async function getGoodsList(event) {
  const { page = 1, pageSize = 10, category } = event;
  const whereCondition = { status: 'available' };

  if (category) {
    whereCondition.category = category;
  }

  const totalRes = await db.collection('goods').where(whereCondition).count();
  const total = totalRes.total;

  const listRes = await db.collection('goods')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return {
    success: true,
    data: {
      list: listRes.data,
      total,
      hasMore: page * pageSize < total
    }
  };
}

async function getGoodsDetail(event) {
  const { goodsId } = event;

  const res = await db.collection('goods').doc(goodsId).get();

  return { success: true, data: res.data };
}

async function createGoods(openid, event) {
  const { title, description, category, images, condition, location, wantExchangeFor } = event;

  const userRes = await db.collection('users').where({ _openid: openid }).get();
  const user = userRes.data[0] || {};

  const goodsData = {
    title,
    description,
    category,
    images: images || [],
    condition,
    ownerOpenId: openid,
    ownerNickName: user.nickName || '',
    ownerAvatar: user.avatarUrl || '',
    status: 'available',
    location,
    wantExchangeFor,
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  };

  const addRes = await db.collection('goods').add({ data: goodsData });

  return { success: true, data: { _id: addRes._id } };
}

async function updateGoods(openid, event) {
  const { goodsId, ...fields } = event;

  const goodsRes = await db.collection('goods').doc(goodsId).get();
  const goods = goodsRes.data;

  if (!goods || goods.ownerOpenId !== openid) {
    return { success: false, errMsg: '无权限修改该物品' };
  }

  const updateData = { ...fields, updateTime: db.serverDate() };
  delete updateData.type;
  delete updateData.goodsId;

  await db.collection('goods').doc(goodsId).update({ data: updateData });

  return { success: true };
}

async function deleteGoods(openid, event) {
  const { goodsId } = event;

  const goodsRes = await db.collection('goods').doc(goodsId).get();
  const goods = goodsRes.data;

  if (!goods || goods.ownerOpenId !== openid) {
    return { success: false, errMsg: '无权限删除该物品' };
  }

  await db.collection('goods').doc(goodsId).remove();

  const exchangeRes = await db.collection('exchanges').where({ goodsId }).get();
  for (const item of exchangeRes.data) {
    await db.collection('exchanges').doc(item._id).remove();
  }

  return { success: true };
}

async function getMyGoods(openid, event) {
  const { page = 1, pageSize = 10, status } = event;
  const whereCondition = { ownerOpenId: openid };

  if (status) {
    whereCondition.status = status;
  }

  const totalRes = await db.collection('goods').where(whereCondition).count();
  const total = totalRes.total;

  const listRes = await db.collection('goods')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return {
    success: true,
    data: {
      list: listRes.data,
      total
    }
  };
}

async function searchGoods(event) {
  const { keyword, page = 1, pageSize = 10 } = event;

  const whereCondition = {
    status: 'available',
    $or: [
      { title: db.RegExp({ regexp: keyword, options: 'i' }) },
      { description: db.RegExp({ regexp: keyword, options: 'i' }) }
    ]
  };

  const totalRes = await db.collection('goods').where(whereCondition).count();
  const total = totalRes.total;

  const listRes = await db.collection('goods')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return {
    success: true,
    data: {
      list: listRes.data,
      total,
      hasMore: page * pageSize < total
    }
  };
}
