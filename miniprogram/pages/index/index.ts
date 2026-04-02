import { BASE_QUESTIONS } from '../../data/mock'
import { getSelectionState, getDiagnosisRecords } from '../../utils/storage'
import { errorPulse } from '../../utils/haptics'

// 行业水印字符映射
const WATERMARK_MAP: Record<number, string> = {
  1: '餐',
  2: '零',
  3: '美',
  4: '程',
  5: 'AI'
}

Page({
  data: {
    userReady: true,
    shakeIndustry: false,
    watermarkChar: '',
    diagnosisCount: 0,
    questions: BASE_QUESTIONS,
    selection: {} as Record<string, any>
  },

  onShow() {
    const selection = getSelectionState()
    const records = getDiagnosisRecords()
    const industryId = selection.industryId || 0

    this.setData({
      selection,
      userReady: true,
      watermarkChar: WATERMARK_MAP[industryId] || '',
      diagnosisCount: records.length
    })

    // 同步自定义 tabBar 选中态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  goSelectIndustry() {
    wx.navigateTo({ url: '/pages/industry-stage/index' })
  },

  goBaseAssessment() {
    const selection = this.data.selection as any
    if (!selection.industryId || !selection.stageKey) {
      this.setData({ shakeIndustry: true })
      errorPulse()
      wx.showToast({
        title: '请先设置行业，以匹配专属题库',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        this.setData({ shakeIndustry: false })
      }, 500)
      return
    }
    wx.navigateTo({
      url: `/pages/assessment/base/index?industryId=${selection.industryId}&stageKey=${selection.stageKey}`
    })
  },

  goArchive() {
    wx.switchTab({ url: '/pages/archive/index' })
  },

  goTools() {
    wx.switchTab({ url: '/pages/tools/index' })
  }
})
