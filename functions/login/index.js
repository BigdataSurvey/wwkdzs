const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const appid = wxContext.APPID
  const unionid = wxContext.UNIONID || ''

  // 检查用户是否已存在
  const userResult = await db.collection('user_profiles').doc(openid).get().catch(() => null)

  if (!userResult || !userResult.data) {
    // 首次登录，创建用户档案
    await db.collection('user_profiles').add({
      data: {
        _id: openid,
        nickName: '微信用户',
        avatarUrl: '/images/logo.png',
        createdAt: db.serverDate(),
        lastLoginAt: db.serverDate(),
        selection: {},
        proUnlocked: false
      }
    }).catch(() => {})
  } else {
    // 更新最后登录时间
    await db.collection('user_profiles').doc(openid).update({
      data: {
        lastLoginAt: db.serverDate()
      }
    }).catch(() => {})
  }

  return {
    openid,
    appid,
    unionid
  }
}
