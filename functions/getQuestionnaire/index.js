const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database();
  const bank = db.collection('question_bank');
  // 接收前端完美传过来的三个参数
  const { type = 'base', industryId, stageKey } = event;

  try {
    // 🥇 第一级优先级：【行业 + 阶段】精准匹配 (例如：不仅是餐饮，而且必须是“筹备期”)
    if (industryId && stageKey) {
      const exactRes = await bank.where({
        type: type,
        industryId: Number(industryId),
        stageKey: String(stageKey)
      }).get();

      if (exactRes.data && exactRes.data.length > 0) {
        return { code: 0, msg: 'exact_success', data: exactRes.data[0].data };
      }
    }

    // 🥈 第二级优先级：【仅行业】匹配 (例如：只要是选了餐饮行业，不管啥阶段，都给这套题)
    if (industryId) {
      const indRes = await bank.where({
        type: type,
        industryId: Number(industryId)
      }).get();

      if (indRes.data && indRes.data.length > 0) {
        return { code: 0, msg: 'industry_success', data: indRes.data[0].data };
      }
    }

    // 🥉 第三级防线（兜底）：如果该行业你还没来得及在数据库里建题库，直接拉取通用兜底题，保证流程不断！
    const defaultRes = await bank.doc('base_questions').get();
    if (defaultRes.data && defaultRes.data.data) {
      return { code: 0, msg: 'default_success', data: defaultRes.data.data };
    }

    // 如果连兜底题都被误删了
    return { code: -1, msg: '数据库完全为空', data: [] };

  } catch (error) {
    console.error('云数据库查询异常:', error);
    return { code: -1, msg: error.message || '查询异常', data: [] };
  }
}