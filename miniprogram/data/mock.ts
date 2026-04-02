export const INDUSTRIES = [
  { id: 1, name: '餐饮', tag: '选址 / 客流 / 回本', icon: '餐' },
  { id: 2, name: '零售', tag: '坪效 / 货盘 / 复购', icon: '零' },
  { id: 3, name: '美业', tag: '客单 / 储值 / 人效', icon: '美' },
  { id: 4, name: '小程序创业', tag: '流量 / 转化 / 留存', icon: '小' },
  { id: 5, name: 'AI创业', tag: '成本 / 获客 / 变现', icon: 'AI' }
]

export const STAGES = [
  { key: 'prepare', name: '筹备期', desc: '还没开业，先判断值不值得投。' },
  { key: 'opening', name: '试营业期', desc: '刚开始运营，先盯住客流与转化。' },
  { key: 'running', name: '经营期', desc: '已开店，重点复盘现金流与复购。' }
]

export const BASE_QUESTIONS = [
  {
    id: 'q1',
    title: '你是否能明确说出核心目标用户是谁？',
    desc: '至少能描述画像、消费动机和最常见的到店/下单场景。',
    options: [
      { text: '非常明确，已经验证过', score: 20 },
      { text: '基本清楚，但还没验证充分', score: 12 },
      { text: '还比较模糊', score: 4 }
    ]
  },
  {
    id: 'q2',
    title: '你的首要获客方式是否已有样本验证？',
    desc: '不是停留在想法，而是做过测试。',
    options: [
      { text: '有，且效果稳定', score: 20 },
      { text: '做过测试，但不稳定', score: 11 },
      { text: '还没有跑过样本', score: 4 }
    ]
  },
  {
    id: 'q3',
    title: '你是否算过至少 3 个月的现金流安全线？',
    desc: '包含固定成本、试错预算和最低生存线。',
    options: [
      { text: '算过，并留有缓冲', score: 20 },
      { text: '大概算过，但不细', score: 11 },
      { text: '没有系统算过', score: 3 }
    ]
  },
  {
    id: 'q4',
    title: '你对这个行业的高频踩坑点了解程度如何？',
    desc: '例如餐饮的房租、损耗、翻台；零售的库存、折扣、周转。',
    options: [
      { text: '已系统整理过', score: 20 },
      { text: '知道一部分', score: 12 },
      { text: '了解不多', score: 5 }
    ]
  },
  {
    id: 'q5',
    title: '你是否知道自己的毛利率大致区间？',
    desc: '不知道毛利率，基本无法判断盈亏空间。',
    options: [
      { text: '知道，且有测算依据', score: 20 },
      { text: '大概知道', score: 11 },
      { text: '还不清楚', score: 4 }
    ]
  },
  {
    id: 'q6',
    title: '你是否有一个能跑起来的最小方案？',
    desc: '例如最小品类、最小门店模型、最小产品包。',
    options: [
      { text: '已经定义清楚', score: 20 },
      { text: '有方向但还不清晰', score: 11 },
      { text: '还没有', score: 5 }
    ]
  },
  {
    id: 'q7',
    title: '你是否评估过竞争对手和替代方案？',
    desc: '不是看同行名字，而是看用户为什么会选别人。',
    options: [
      { text: '已做过拆解对比', score: 18 },
      { text: '看过一些，但不系统', score: 11 },
      { text: '几乎没分析过', score: 5 }
    ]
  },
  {
    id: 'q8',
    title: '你的定价逻辑是否站得住？',
    desc: '用户为什么愿意按这个价格买单？',
    options: [
      { text: '定价依据明确', score: 18 },
      { text: '有感性判断', score: 11 },
      { text: '还没有认真考虑', score: 4 }
    ]
  },
  {
    id: 'q9',
    title: '你是否规划过复购或复访机制？',
    desc: '首单不是终点，复购才决定模型是否稳。',
    options: [
      { text: '已有机制或设想', score: 18 },
      { text: '知道重要，但还未设计', score: 11 },
      { text: '暂时没考虑', score: 5 }
    ]
  },
  {
    id: 'q10',
    title: '你是否有明确的首轮试错边界？',
    desc: '包括预算上限、时间上限和止损条件。',
    options: [
      { text: '有边界，也能执行', score: 20 },
      { text: '有概念，但不够严格', score: 11 },
      { text: '没有设置', score: 4 }
    ]
  },
  {
    id: 'q11',
    title: '你对开业后最先盯的经营指标是否清楚？',
    desc: '例如客流、转化、复购、毛利、客诉。',
    options: [
      { text: '很清楚，已经写下来', score: 18 },
      { text: '知道几个，但不完整', score: 11 },
      { text: '还没有明确', score: 5 }
    ]
  },
  {
    id: 'q12',
    title: '你是否准备了一个周期性的复盘机制？',
    desc: '没有复盘，就很难持续纠偏。',
    options: [
      { text: '有固定节奏', score: 18 },
      { text: '偶尔会复盘', score: 10 },
      { text: '暂时没有', score: 5 }
    ]
  }
]
