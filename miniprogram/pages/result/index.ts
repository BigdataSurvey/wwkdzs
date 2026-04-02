import { INDUSTRIES, STAGES } from '../../data/mock'

function getResultByScore(score: number) {
  if (score >= 80) {
    return {
      level: '优先优化',
      title: '基础较稳，可以推进',
      desc: '当前不是“万无一失”，但说明项目判断基础相对扎实。建议小范围试运营，再用数据决定是否扩大投入。',
      tone: 'blue',
      actions: ['把试运营范围缩到最小可验证单元', '把每周核心指标写成复盘表', '先做利润测算，确认现金流缓冲'],
      dimensions: [
        { label: '项目清晰度', value: '较高' },
        { label: '投入风险', value: '中低' },
        { label: '试错空间', value: '有一定余量' }
      ]
    }
  }
  if (score >= 60) {
    return {
      level: '优先优化',
      title: '可以继续做，但先补关键短板',
      desc: '当前更适合把关键问题先补齐，再扩大预算或投入。核心是先补判断、补测算、补验证。',
      tone: 'green',
      actions: ['先补获客路径与转化链路', '把 3 个月现金流安全线再测一遍', '按行业重新整理高频踩坑点'],
      dimensions: [
        { label: '项目清晰度', value: '中等' },
        { label: '投入风险', value: '中等' },
        { label: '试错空间', value: '一般' }
      ]
    }
  }
  return {
    level: '风险高',
    title: '建议暂缓重投入',
    desc: '不是项目一定不能做，而是当前直接上强投入的风险偏高。更稳妥的做法，是先把模型和底线算清楚。',
    tone: 'orange',
    actions: ['不要先上大额投入', '先做利润测算，确认盈亏底线', '明确首轮试错边界与退出条件'],
    dimensions: [
      { label: '项目清晰度', value: '偏低' },
      { label: '投入风险', value: '较高' },
      { label: '试错空间', value: '较有限' }
    ]
  }
}

Page({
  data: {
    type: 'base',
    score: 0,
    industryName: '餐饮',
    stageName: '筹备期',
    result: getResultByScore(0)
  },

  onLoad(query: Record<string, string>) {
    const score = Number(query.score || 0)
    const type = query.type || 'base'
    const industryId = Number(query.industryId || 1)
    const stageKey = query.stageKey || 'prepare'
    const industry = INDUSTRIES.find((item) => item.id === industryId)
    const stage = STAGES.find((item) => item.key === stageKey)
    this.setData({
      score,
      type,
      industryName: industry?.name || '餐饮',
      stageName: stage?.name || '筹备期',
      result: getResultByScore(score)
    })
  },

  goProfit() {
    wx.navigateTo({ url: '/pages/tools/profit/index' })
  },

  goGuide() {
    wx.navigateTo({ url: '/pages/tools/guide/index' })
  },

  goArchive() {
    wx.switchTab({ url: '/pages/archive/index' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
