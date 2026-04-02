import { INDUSTRIES, STAGES } from '../../data/mock'
import { getSelectionState, setSelectionState } from '../../utils/storage'
import { pulse } from '../../utils/haptics'

Page({
  data: {
    step: 1,
    industries: INDUSTRIES,
    stages: STAGES,
    selectedIndustryId: 0,
    selectedIndustryName: '',
    selectedStageKey: ''
  },

  onLoad() {
    const selection = getSelectionState()
    if (selection.industryId) {
      const industry = INDUSTRIES.find(i => i.id === selection.industryId)
      this.setData({
        selectedIndustryId: selection.industryId,
        selectedIndustryName: industry?.name || '',
        selectedStageKey: selection.stageKey || '',
        step: selection.stageKey ? 2 : 1
      })
    }
  },

  chooseIndustry(e: any) {
    const id = Number(e.currentTarget.dataset.id)
    const industry = INDUSTRIES.find(i => i.id === id)
    
    pulse()
    this.setData({
      selectedIndustryId: id,
      selectedIndustryName: industry?.name || '',
      selectedStageKey: '' // 切换行业时重置阶段
    })
    
    // 选中后自动进入下一步
    setTimeout(() => {
      this.setData({ step: 2 })
    }, 300)
  },

  chooseStage(e: any) {
    pulse()
    this.setData({
      selectedStageKey: e.currentTarget.dataset.key
    })
  },

  goBack() {
    this.setData({ step: 1 })
  },

  saveSelection() {
    const industry = INDUSTRIES.find((item) => item.id === this.data.selectedIndustryId)
    const stage = STAGES.find((item) => item.key === this.data.selectedStageKey)

    if (!industry || !stage) {
      wx.showToast({
        title: '请选择行业和阶段',
        icon: 'none'
      })
      return
    }

    const selection = {
      industryId: industry.id,
      industryName: industry.name,
      industryTag: industry.tag,
      stageKey: stage.key,
      stageName: stage.name
    }

    setSelectionState(selection)
    getApp<IAppOption>().globalData.selection = selection

    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 500)
  }
})
