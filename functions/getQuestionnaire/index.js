const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { type, industryId, stageKey } = event;

    // 1. 尝试精准匹配特定行业和阶段的题库
    let res = await db.collection('question_bank').where({
      type: type || 'base',
      industryId: Number(industryId), // 确保格式对齐
      stageKey: stageKey
    }).get();

    // 2. 如果精准匹配没数据，降级：只匹配行业
    if (!res.data || res.data.length === 0) {
      res = await db.collection('question_bank').where({
        type: type || 'base',
        industryId: Number(industryId)
      }).get();
    }

    // 3. 如果连行业都没数据，终极降级：拉取兜底的通用种子题！
    if (!res.data || res.data.length === 0) {
      // 🚨 换用 where 查询，没查到也不会报错崩溃，只会返回空数组
      const defaultRes = await db.collection('question_bank').where({
        _id: 'base_questions'
      }).get();

      if (defaultRes.data && defaultRes.data.length > 0) {
        return { code: 0, msg: 'success (default)', data: defaultRes.data[0].data };
      } else {
        // 如果连兜底题都没建，安全返回空数组
        return { code: 0, msg: 'empty', data: [] };
      }
    }

    return { code: 0, msg: 'success', data: res.data[0].data };

  } catch (error) {
    console.error('获取个性化题库失败:', error);
    return { code: -1, msg: '获取题库失败', error: error };
  }
}