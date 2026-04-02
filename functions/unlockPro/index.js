const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { unlockType = 'pro_assessment', source = 'rewarded_ad' } = event

  // 记录解锁状态
  await db.collection('unlock_records').add({
    data: {
      openid,
      unlockType,
      source,
      createdAt: db.serverDate()
    }
  })

  // 更新用户档案的专业版状态
  await db.collection('user_profiles').doc(openid).update({
    data: {
      proUnlocked: true
    }
  })

  return { success: true, unlocked: true }
}
