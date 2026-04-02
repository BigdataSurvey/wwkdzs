const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const payload = {
    openid: wxContext.OPENID,
    industryId: event.industryId,
    industryName: event.industryName,
    stageKey: event.stageKey,
    stageName: event.stageName,
    type: event.type || 'base',
    score: event.score,
    level: event.level,
    summary: event.summary,
    answers: event.answers || [],
    createdAt: db.serverDate()
  }

  const addRes = await db.collection('diagnosis_records').add({ data: payload })

  if (Array.isArray(event.tasks) && event.tasks.length) {
    await Promise.all(event.tasks.map((text) => {
      return db.collection('archive_tasks').add({
        data: {
          openid: wxContext.OPENID,
          text,
          done: false,
          source: 'diagnosis_result',
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    }))
  }

  return {
    success: true,
    id: addRes._id
  }
}
