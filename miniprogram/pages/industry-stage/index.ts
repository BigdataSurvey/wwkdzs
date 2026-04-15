import { getSelectionState, setSelectionState } from '../../utils/storage'

Page({
  data: {
    step: 1,
    industries: [] as any[], // 🚨 初始为空，由云端填入
    stages: [] as any[],
    selectedIndustryId: 0,
    selectedIndustryName: '',
    selectedStageKey: '',
    isLoading: true
  },

  onLoad() {
    this.fetchCloudConfig()
  },

  // 🚨 核心修复：调用云函数获取最新配置
  async fetchCloudConfig() {
    wx.showLoading({ title: '加载专业题库中', mask: true })
    try {
      const res = await wx.cloud.callFunction({ name: 'getSelectionConfig' })
      const result = res.result as any
      if (result.code === 0) {
        this.setData({
          industries: result.data.industries,
          stages: result.data.stages,
          isLoading: false
        })
        this.restoreSelection(result.data.industries, result.data.stages)
      }
    } catch (err) {
      console.error('云配置加载失败:', err)
    } finally {
      wx.hideLoading()
    }
  },

  restoreSelection(industries: any[], stages: any[]) {
    const selection = getSelectionState()
    if (selection.industryId) {
      const industry = industries.find(i => i.id === selection.industryId)
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
    const industry = this.data.industries.find(i => i.id === id)
    this.setData({
      selectedIndustryId: id,
      selectedIndustryName: industry?.name || '',
      selectedStageKey: ''
    })
    setTimeout(() => { this.setData({ step: 2 }) }, 300)
  },

  chooseStage(e: any) {
    this.setData({ selectedStageKey: e.currentTarget.dataset.key })
  },

  goBack() { this.setData({ step: 1 }) },

  saveSelection() {
    const industry = this.data.industries.find(i => i.id === this.data.selectedIndustryId)
    const stage = this.data.stages.find(s => s.key === this.data.selectedStageKey)
    if (!industry || !stage) return
    const selection = {
      industryId: industry.id, industryName: industry.name, industryTag: industry.tag,
      stageKey: stage.key, stageName: stage.name
    }
    setSelectionState(selection)
    getApp().globalData.selection = selection
    wx.showToast({ title: '配置成功', icon: 'success' })
    setTimeout(() => { wx.navigateBack() }, 500)
  }
})