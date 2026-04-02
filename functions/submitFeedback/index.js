const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const addRes = await db.collection('feedbacks').add({
    data: {
      openid: wxContext.OPENID,
      category: event.category,
      content: event.content,
      status: 'new',
      createdAt: db.serverDate()
    }
  })

  return {
    success: true,
    id: addRes._id
  }
}
