const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 接收前端传来的参数，判断是要'base'(基础版) 还是 'pro'(专业版) 的题
    const type = event.type || 'base';

    // 去 question_bank 集合里，精准捞出对应 type 的那条记录
    const res = await db.collection('question_bank').where({ type: type }).get();

    if (res.data.length > 0) {
      return {
        code: 0,
        msg: 'success',
        data: res.data[0].data // 直接把题目数组丢给前端
      };
    } else {
      return { code: -1, msg: '未找到对应题库' };
    }
  } catch (error) {
    console.error('获取题库失败:', error);
    return { code: -1, msg: '获取题库失败', error: error };
  }
}