const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID;

    switch (event.type) {
      case 'getUserInfo':
        return await getUserInfo(OPENID);
      case 'updateUserInfo':
        return await updateUserInfo(OPENID, event);
      default:
        return { success: false, errMsg: '未知操作类型' };
    }
  } catch (e) {
    return { success: false, errMsg: e.message || e };
  }
};

async function getUserInfo(openid) {
  const userRes = await db.collection('users').where({
    _openid: openid
  }).get();

  if (userRes.data.length > 0) {
    return { success: true, data: userRes.data[0] };
  }

  const newUser = {
    _openid: openid,
    nickName: '微信用户',
    avatarUrl: '',
    contact: '',
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  };

  const addRes = await db.collection('users').add({ data: newUser });
  return { success: true, data: { ...newUser, _id: addRes._id } };
}

async function updateUserInfo(openid, event) {
  const { nickName, avatarUrl, contact } = event;
  const updateData = {
    updateTime: db.serverDate()
  };

  if (nickName !== undefined) updateData.nickName = nickName;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
  if (contact !== undefined) updateData.contact = contact;

  await db.collection('users').where({
    _openid: openid
  }).update({ data: updateData });

  return { success: true };
}
