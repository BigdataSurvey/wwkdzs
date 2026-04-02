const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { industryId, industryName, stageKey, stageName } = event

  await db.collection('user_profiles').doc(openid).update({
    data: {
      selection: {
        industryId,
        industryName,
        stageKey,
        stageName
      }
    }
  })

  return { success: true }
}
