const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false, // 控制抖动的开关
    selectionDisplayText: '选择行业 ›',
    aiUsageCount: 0
  },

  shakeTimer: null as number | null,
  aiTimer: null as number | null,

  onLoad() {},

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }

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

    if (selection && selection.industryId) {
      watermark = selection.industryName ? selection.industryName.trim().substring(0, 1) : '';
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

    this.initAiCounter();
  },

  onHide() {
    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
      this.shakeTimer = null;
    }
    if (this.aiTimer) {
      clearInterval(this.aiTimer);
      this.aiTimer = null;
    }
  },

  initAiCounter() {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `ai_usage_count_${today}`;

    let currentCount = wx.getStorageSync(cacheKey);
    if (!currentCount) {
      currentCount = Math.floor(Math.random() * 300) + 1200;
      wx.setStorageSync(cacheKey, currentCount);
    }
    this.setData({ aiUsageCount: currentCount });

    if (this.aiTimer) clearInterval(this.aiTimer);
    this.aiTimer = setInterval(() => {
      const addNum = Math.floor(Math.random() * 3) + 1;
      const newCount = this.data.aiUsageCount + addNum;

      this.setData({ aiUsageCount: newCount });
      wx.setStorageSync(cacheKey, newCount);
    }, 3500) as unknown as number;
  },

  goSelectIndustry() {
    wx.navigateTo({ url: '/pages/industry-stage/index' });
  },

  goBaseAssessment() {
    const selection = this.data.selection;
    if (!selection || !selection.industryId) {
      // 🚨 找回丢失的抖动和物理震动逻辑
      this.setData({ shakeIndustry: true });
      wx.vibrateShort({ type: 'medium' }); // 触发手机物理震动

      // 1秒后关闭抖动状态
      if (this.shakeTimer) clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 1000) as unknown as number;
      return;
    }

    wx.navigateTo({
      url: `/pages/assessment/base/index?industryId=${selection.industryId}&stageKey=${selection.stageKey}`
    });
  },

  goArchive() {
    wx.switchTab({ url: '/pages/archive/index' });
  },

  goTools() {
    wx.switchTab({ url: '/pages/tools/index' });
  }
});