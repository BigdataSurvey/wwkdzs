const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  try {
    // 这里才是去查 selection_config 表的地方！
    const [indRes, staRes] = await Promise.all([
      db.collection('selection_config').doc('config_industries').get(),
      db.collection('selection_config').doc('config_stages').get()
    ])

    return {
      code: 0,
      msg: 'success',
      data: {
        industries: indRes.data.data,
        stages: staRes.data.data
      }
    }
  } catch (err) {
    console.error('云函数执行报错:', err)
    return { code: -1, msg: '数据库查询失败', error: err }
  }
}