const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const [tasksRes, recordsRes] = await Promise.all([
    db.collection('archive_tasks').where({ openid: wxContext.OPENID }).orderBy('updatedAt', 'desc').get(),
    db.collection('diagnosis_records').where({ openid: wxContext.OPENID }).orderBy('createdAt', 'desc').limit(10).get()
  ])

  return {
    tasks: tasksRes.data,
    records: recordsRes.data
  }
}
