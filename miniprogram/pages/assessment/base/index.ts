import { BASE_QUESTIONS, INDUSTRIES, STAGES } from '../../../data/mock'
import { pulse, optionTick, progressivePulse, heavyPulse } from '../../../utils/haptics'
import { addDiagnosisRecord, getArchiveTasks, setArchiveTasks } from '../../../utils/storage'

function defaultTasks(industryName: string) {
  return [
    { text: `把 ${industryName} 项目的 3 个月现金流安全线单独再测一遍`, done: false },
    { text: '明确首轮试错预算与退出条件', done: false },
    { text: '先补一版获客路径与转化链路', done: false }
  ]
}

function calcProgress(currentIndex: number, total: number) {
  return Math.round(((currentIndex + 1) / total) * 100)
}

// 人格化进度文案
function getProgressText(currentIndex: number, total: number): string {
  const percent = (currentIndex + 1) / total
  if (percent <= 0.33) {
    return '正在建立门店基础模型...'
  } else if (percent <= 0.66) {
    return '深度核算成本结构...'
  } else if (percent < 1) {
    return '即将完成抗风险压力测试...'
  } else {
    return '诊断完成，生成报告中...'
  }
}

Page({
  data: {
    industryId: 1,
    stageKey: 'prepare',
    industryName: '餐饮',
    stageName: '筹备期',
    questions: BASE_QUESTIONS,
    currentIndex: 0,
    progressPercent: calcProgress(0, BASE_QUESTIONS.length),
    progressText: getProgressText(0, BASE_QUESTIONS.length),
    answers: Array(BASE_QUESTIONS.length).fill(-1),
    selectedIndex: -1,
    isGenerating: false // 报告生成中状态
  },

  onLoad(query: Record<string, string>) {
    const industryId = Number(query.industryId || 1)
    const stageKey = query.stageKey || 'prepare'
    const industry = INDUSTRIES.find((item) => item.id === industryId)
    const stage = STAGES.find((item) => item.key === stageKey)

    this.setData({
      industryId,
      stageKey,
      industryName: industry?.name || '餐饮',
      stageName: stage?.name || '筹备期',
      progressPercent: calcProgress(0, BASE_QUESTIONS.length),
      progressText: getProgressText(0, BASE_QUESTIONS.length)
    })
  },

  chooseOption(e: any) {
    const selectedIndex = Number(e.currentTarget.dataset.index)
    const { currentIndex, answers } = this.data as any
    answers[currentIndex] = selectedIndex
    
    // 选项点击轻微短震
    optionTick()
    
    this.setData({
      selectedIndex,
      answers
    })
  },

  prevQuestion() {
    if (this.data.currentIndex === 0) return
    pulse()
    const nextIndex = this.data.currentIndex - 1
    const answers = this.data.answers as number[]
    this.setData({
      currentIndex: nextIndex,
      selectedIndex: answers[nextIndex],
      progressPercent: calcProgress(nextIndex, this.data.questions.length),
      progressText: getProgressText(nextIndex, this.data.questions.length)
    })
  },

  nextQuestion() {
    const { currentIndex, selectedIndex, questions, answers } = this.data as any
    if (selectedIndex === -1) {
      wx.showToast({ title: '请选择一个答案', icon: 'none' })
      return
    }

    if (currentIndex === questions.length - 1) {
      this.submitAssessment()
      return
    }

    pulse()
    const nextIndex = currentIndex + 1
    this.setData({
      currentIndex: nextIndex,
      selectedIndex: answers[nextIndex],
      progressPercent: calcProgress(nextIndex, this.data.questions.length),
      progressText: getProgressText(nextIndex, this.data.questions.length)
    })
  },

  submitAssessment() {
    const answers = this.data.answers as number[]
    if (answers.some((item) => item === -1)) {
      wx.showToast({ title: '还有题目未完成', icon: 'none' })
      return
    }

    // 进入生成报告状态
    this.setData({ 
      isGenerating: true,
      progressText: '正在生成专属诊断报告...'
    })

    // 渐进式震动 + 2-3秒过渡
    progressivePulse(() => {
      // 震动结束后，重震一次表示完成
      setTimeout(() => {
        heavyPulse()
        
        // 计算得分
        const total = BASE_QUESTIONS.reduce((sum, question, index) => {
          const answerIndex = answers[index]
          return sum + question.options[answerIndex].score
        }, 0)

        const score = Math.round(total / BASE_QUESTIONS.length)
        const createdAt = new Date()
        const time = `${createdAt.getMonth() + 1}月${createdAt.getDate()}日 ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`

        addDiagnosisRecord({
          type: '基础诊断',
          industry: this.data.industryName,
          stage: this.data.stageName,
          score,
          time,
          summary: score >= 80 ? '整体可推进，但建议先小范围试运营。' : (score >= 60 ? '可以继续做，但先补齐关键短板。' : '建议暂缓重投入，先补测算与验证。')
        })

        const oldTasks = getArchiveTasks()
        if (!oldTasks.length) {
          setArchiveTasks(defaultTasks(this.data.industryName))
        }

        wx.navigateTo({
          url: `/pages/result/index?type=base&score=${score}&industryId=${this.data.industryId}&stageKey=${this.data.stageKey}`
        })
      }, 300)
    })
  }
})
