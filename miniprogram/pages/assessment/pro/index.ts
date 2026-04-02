const INDUSTRY_MAP: Record<number, string> = {
  1: '实体餐饮',
  2: '实体零售',
  3: '美业服务',
  4: 'AI创业项目',
  5: '小程序创业',
  6: '其他实体行业'
}

const QUESTIONS = [
  {
    title: '你的经营模型里，最强的毛利来源是否明确？',
    options: [
      { text: '明确且验证过', score: 22 },
      { text: '基本明确', score: 14 },
      { text: '还不清楚', score: 6 }
    ]
  },
  {
    title: '你是否有复购机制或持续消费场景？',
    options: [
      { text: '有完整机制', score: 22 },
      { text: '有部分设计', score: 14 },
      { text: '几乎没有', score: 6 }
    ]
  },
  {
    title: '你对固定成本与变动成本是否分得清楚？',
    options: [
      { text: '非常清楚', score: 22 },
      { text: '有基本概念', score: 14 },
      { text: '暂时没有梳理', score: 6 }
    ]
  },
  {
    title: '你是否设计过第一阶段增长指标？',
    options: [
      { text: '已设定并准备跟踪', score: 22 },
      { text: '有粗略目标', score: 14 },
      { text: '还没有', score: 6 }
    ]
  }
]

Page({
  data: {
    industryId: 1,
    industryName: '实体餐饮',
    unlocked: false,
    questions: QUESTIONS,
    currentIndex: 0,
    selectedIndex: -1,
    answers: [] as number[]
  },

  onLoad(query: Record<string, string>) {
    const industryId = Number(query.industryId || 1)
    const industryName = INDUSTRY_MAP[industryId] || '实体餐饮'
    const unlocked = !!wx.getStorageSync('isProUnlocked')
    this.setData({ industryId, industryName, unlocked, answers: Array(QUESTIONS.length).fill(-1) })
    this.syncSelectedIndex(0)
  },

  syncSelectedIndex(index: number) {
    const answers = this.data.answers as number[]
    this.setData({ selectedIndex: answers[index] ?? -1 })
  },

  chooseOption(e: any) {
    if (!this.data.unlocked) return
    const optionIndex = Number(e.currentTarget.dataset.index)
    const answers = [...(this.data.answers as number[])]
    answers[this.data.currentIndex] = optionIndex
    this.setData({ answers, selectedIndex: optionIndex })
  },

  prevQuestion() {
    if (!this.data.unlocked || this.data.currentIndex === 0) return
    const currentIndex = this.data.currentIndex - 1
    this.setData({ currentIndex })
    this.syncSelectedIndex(currentIndex)
  },

  nextQuestion() {
    if (!this.data.unlocked) {
      wx.showToast({ title: '请先完成基础诊断', icon: 'none' })
      return
    }
    if (this.data.selectedIndex === -1) {
      wx.showToast({ title: '请先选择一个答案', icon: 'none' })
      return
    }
    if (this.data.currentIndex === QUESTIONS.length - 1) {
      this.submitAssessment()
      return
    }
    const currentIndex = this.data.currentIndex + 1
    this.setData({ currentIndex })
    this.syncSelectedIndex(currentIndex)
  },

  submitAssessment() {
    const answers = this.data.answers as number[]
    if (answers.some((item) => item === -1)) {
      wx.showToast({ title: '还有题目未完成', icon: 'none' })
      return
    }
    const total = QUESTIONS.reduce((sum, question, index) => {
      const answerIndex = answers[index]
      return sum + question.options[answerIndex].score
    }, 0)
    const score = Math.round(total / QUESTIONS.length)
    wx.navigateTo({
      url: `/pages/result/index?type=pro&score=${score}&industryId=${this.data.industryId}`
    })
  },

  goBase() {
    wx.navigateTo({ url: `/pages/assessment/base/index?industryId=${this.data.industryId}` })
  }
})
