const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { industryId, stageKey, type = 'base' } = event
  const result = await db.collection('question_banks')
    .where({ industryId, stageKey, type, enabled: true })
    .orderBy('sort', 'asc')
    .get()

  return { list: result.data }
}
