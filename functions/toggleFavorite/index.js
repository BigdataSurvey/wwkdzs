const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { targetType, targetId } = event

  // 检查是否已收藏
  const existing = await db.collection('favorites')
    .where({
      openid,
      targetType,
      targetId
    })
    .get()

  if (existing.data.length > 0) {
    // 取消收藏
    await db.collection('favorites').doc(existing.data[0]._id).remove()
    return { success: true, action: 'removed' }
  } else {
    // 添加收藏
    await db.collection('favorites').add({
      data: {
        openid,
        targetType,
        targetId,
        createdAt: db.serverDate()
      }
    })
    return { success: true, action: 'added' }
  }
}
