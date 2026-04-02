const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false,
    selectionDisplayText: '选择行业 ›' // 新增：用于首页展示的拼接文本
  },

  shakeTimer: null as number | null,

  onLoad() {},

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }

    let selection = app.globalData.selection;
    if (!selection || Object.keys(selection).length === 0) {
      selection = wx.getStorageSync('selectionState') || {};
      app.globalData.selection = selection;
    }

    const records = wx.getStorageSync('diagnosisRecords');
    const safeRecordsCount = Array.isArray(records) ? records.length : 0;

    let watermark = '';
    let displayText = '选择行业 ›'; // 默认状态

    if (selection && selection.industryName) {
      watermark = selection.industryName.trim().substring(0, 1);
      // 动态拼接状态，如 "美业·筹备期"
      if (selection.stageName) {
        displayText = `${selection.industryName}·${selection.stageName} ›`;
      } else {
        displayText = `${selection.industryName} ›`;
      }
    }

    this.setData({
      selection: selection,
      diagnosisCount: safeRecordsCount,
      watermarkChar: watermark,
      selectionDisplayText: displayText
    });
  },

  onHide() {
    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
      this.shakeTimer = null;
    }
  },

  goSelectIndustry() {
    // 已彻底移除物理震动
    wx.navigateTo({ url: '/pages/industry-stage/index' });
  },

  goBaseAssessment() {
    if (!this.data.selection || !this.data.selection.industryId) {
      // 仅保留 CSS 抖动，移除马达震动
      this.setData({ shakeIndustry: true });
      wx.showToast({ title: '请先设置行业，以匹配专属题库', icon: 'none', duration: 2000 });

      if (this.shakeTimer) clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 500) as unknown as number;
      return;
    }

    wx.navigateTo({ url: '/pages/assessment/base/index' });
  },

  goArchive() {
    wx.switchTab({ url: '/pages/archive/index' });
  },

  goTools() {
    wx.switchTab({ url: '/pages/tools/index' });
  }
});