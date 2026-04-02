export const INDUSTRIES = [
  { id: 1, name: '餐饮', icon: '🍽️', tag: '高频刚需/重现金流' },
  { id: 2, name: '美业', icon: '✂️', tag: '重服务/高利润率' },
  { id: 3, name: '零售', icon: '🛍️', tag: '重供应链/选址依赖' },
  { id: 4, name: '教培', icon: '📚', tag: '重口碑/长周期转化' },
  { id: 5, name: '娱乐', icon: '🎮', tag: '重体验/设备折旧' },
  { id: 6, name: '其他', icon: '💡', tag: '通用商业逻辑分析' }
];

export const STAGES = [
  {
    key: 'planning',
    name: '筹备期',
    icon: '🌱',
    desc: '还没开业，先判断值不值得投。',
    scenario: '适合：有想法｜正在选址｜资金规划中'
  },
  {
    key: 'trial',
    name: '试营业期',
    icon: '🚀',
    desc: '刚开始运营，先盯住客流与转化。',
    scenario: '适合：已开业1-3个月｜数据待优化'
  },
  {
    key: 'operating',
    name: '平稳经营期',
    icon: '📈',
    desc: '店铺已步入正轨，核心关注复购与抗风险能力。',
    scenario: '适合：开业半年以上｜寻求稳定盈利'
  }
];