const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const [industries, stages] = await Promise.all([
    db.collection('industries').where({ enabled: true }).orderBy('sort', 'asc').get(),
    db.collection('stages').where({ enabled: true }).orderBy('sort', 'asc').get()
  ])

  return {
    industries: industries.data,
    stages: stages.data
  }
}
