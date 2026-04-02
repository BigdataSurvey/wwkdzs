const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false,
    selectionDisplayText: '选择行业 ›'
  },

  shakeTimer: null as number | null,

  onLoad() {},

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }

    // 🚨 核心修复：增加 app 对象生命周期兜底，防止小程序白屏崩溃
    if (!app.globalData) {
      app.globalData = { selection: {} } as any;
    }

    let selection = app.globalData.selection;

    if (!selection || Object.keys(selection).length === 0) {
      selection = wx.getStorageSync('selectionState') || {};
      app.globalData.selection = selection;
    }

    const records = wx.getStorageSync('diagnosisRecords') || [];
    const safeRecordsCount = Array.isArray(records) ? records.length : 0;

    let watermark = '';
    let displayText = '选择行业 ›';

    if (selection && selection.industryName) {
      watermark = selection.industryName.trim().substring(0, 1);
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
    wx.navigateTo({ url: '/pages/industry-stage/index' });
  },

  goBaseAssessment() {
    if (!this.data.selection || !this.data.selection.industryId) {
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