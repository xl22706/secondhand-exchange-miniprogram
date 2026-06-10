const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID;

    switch (event.type) {
      case 'createExchange':
        return await createExchange(OPENID, event);
      case 'getExchangeList':
        return await getExchangeList(OPENID, event);
      case 'updateExchangeStatus':
        return await updateExchangeStatus(OPENID, event);
      case 'getExchangeDetail':
        return await getExchangeDetail(OPENID, event);
      default:
        return { success: false, errMsg: '未知操作类型' };
    }
  } catch (e) {
    return { success: false, errMsg: e.message || e };
  }
};

async function createExchange(openid, event) {
  const { goodsId, message } = event;

  const goodsRes = await db.collection('goods').doc(goodsId).get();
  const goods = goodsRes.data;

  if (!goods) {
    return { success: false, errMsg: '物品不存在' };
  }

  if (goods.ownerOpenId === openid) {
    return { success: false, errMsg: '不能申请交换自己发布的物品' };
  }

  const existRes = await db.collection('exchanges').where({
    fromUserOpenId: openid,
    goodsId: goodsId,
    status: 'pending'
  }).get();

  if (existRes.data.length > 0) {
    return { success: false, errMsg: '已存在待处理的交换申请' };
  }

  const userRes = await db.collection('users').where({ _openid: openid }).get();
  const user = userRes.data[0] || {};

  const exchangeData = {
    goodsId,
    goodsTitle: goods.title,
    fromUserOpenId: openid,
    fromUserNickName: user.nickName || '',
    fromUserAvatar: user.avatarUrl || '',
    toUserOpenId: goods.ownerOpenId,
    toUserNickName: goods.ownerNickName || '',
    message: message || '',
    status: 'pending',
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  };

  await db.collection('exchanges').add({ data: exchangeData });

  return { success: true };
}

async function getExchangeList(openid, event) {
  const { type, page = 1, pageSize = 10 } = event;

  const whereCondition = type === 'sent'
    ? { fromUserOpenId: openid }
    : { toUserOpenId: openid };

  const totalRes = await db.collection('exchanges').where(whereCondition).count();
  const total = totalRes.total;

  const listRes = await db.collection('exchanges')
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

async function updateExchangeStatus(openid, event) {
  const { exchangeId, status } = event;

  const exchangeRes = await db.collection('exchanges').doc(exchangeId).get();
  const exchange = exchangeRes.data;

  if (!exchange || exchange.toUserOpenId !== openid) {
    return { success: false, errMsg: '无权限处理该交换申请' };
  }

  await db.collection('exchanges').doc(exchangeId).update({
    data: {
      status,
      updateTime: db.serverDate()
    }
  });

  if (status === 'accepted') {
    await db.collection('goods').doc(exchange.goodsId).update({
      data: {
        status: 'exchanged',
        updateTime: db.serverDate()
      }
    });
  }

  return { success: true };
}

async function getExchangeDetail(openid, event) {
  const { exchangeId } = event;

  const exchangeRes = await db.collection('exchanges').doc(exchangeId).get();
  const exchange = exchangeRes.data;

  if (!exchange) {
    return { success: false, errMsg: '交换记录不存在' };
  }

  if (exchange.fromUserOpenId !== openid && exchange.toUserOpenId !== openid) {
    return { success: false, errMsg: '无权限查看该交换记录' };
  }

  return { success: true, data: exchange };
}
