import { getSelectionState } from '../../utils/storage'

Page({
  data: {
    selection: null as any,
    selectionDisplayText: '点击选择行业与阶段',
    diagnosisCount: 0,
    aiUsageCount: 0,
    shakeIndustry: false // 🚨 控制抖动状态
  },

  onShow() {
    this.refreshState()
  },

  refreshState() {
    const selection = getSelectionState()
    const app = getApp<IAppOption>()
    if (app.globalData) {
      app.globalData.selection = selection
    }

    let text = '点击选择行业与阶段'
    if (selection && selection.industryName) {
      text = `${selection.industryName} · ${selection.stageName || ''}`
    }

    this.setData({
      selection: selection,
      selectionDisplayText: text
    })
  },

  goSelectIndustry() {
    wx.navigateTo({ url: '/pages/industry-stage/index' })
  },

  // 🚨 核心修复：如果没有选行业，触发红色视觉报警和抖动
  goBaseAssessment() {
    const { selection } = this.data;
    if (!selection || !selection.industryId) {
      // 触发抖动和反馈
      this.setData({ shakeIndustry: true });
      wx.vibrateShort({ type: 'medium' }); // 物理震动增加质感
      
      // 1秒后自动恢复，让用户可以重新点击
      setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 1000);
      return;
    }

    // 已经选过了，正常跳转，带上参数
    wx.navigateTo({
      url: `/pages/assessment/base/index?industryId=${selection.industryId}&stageKey=${selection.stageKey}`
    });
  },

  // ... 其他方法保持不变 ...
})