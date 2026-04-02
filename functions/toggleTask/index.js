const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { taskId, done } = event
  await db.collection('archive_tasks').doc(taskId).update({
    data: {
      done,
      updatedAt: db.serverDate()
    }
  })

  return { success: true }
}
