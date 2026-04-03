const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const { type, industryId, stageKey } = event;

    // 🚨 核心提速魔法：用 _.or 一次性查出三种可能性，只消耗 1 次网络请求！
    const res = await db.collection('question_bank').where(
      _.or([
        { type: type || 'base', industryId: Number(industryId), stageKey: stageKey }, // 精准匹配
        { type: type || 'base', industryId: Number(industryId) },                     // 行业匹配
        { _id: 'base_questions' }                                                     // 兜底匹配
      ])
    ).get();

    if (!res.data || res.data.length === 0) {
      return { code: 0, msg: 'empty', data: [] };
    }

    // 内存里按最高优先级提取（精准 > 行业 > 兜底）
    const exactMatch = res.data.find(item => item.industryId === Number(industryId) && item.stageKey === stageKey);
    const industryMatch = res.data.find(item => item.industryId === Number(industryId));
    const defaultMatch = res.data.find(item => item._id === 'base_questions');

    const finalData = exactMatch || industryMatch || defaultMatch;

    if (finalData && finalData.data) {
      return { code: 0, msg: 'success', data: finalData.data };
    } else {
      return { code: 0, msg: 'empty', data: [] };
    }

  } catch (error) {
    console.error('获取个性化题库失败:', error);
    return { code: -1, msg: '获取题库失败', error: error };
  }
}