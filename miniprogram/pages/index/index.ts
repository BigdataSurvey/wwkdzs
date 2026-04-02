const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false,
    selectionDisplayText: '选择行业 ›',
    aiUsageCount: 0 // 新增：AI参谋的动态使用人数
  },

  shakeTimer: null as number | null,
  aiTimer: null as number | null, // AI 数字跳动定时器

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

    // 🚨 启动 AI 动态人数模拟器
    this.initAiCounter();
  },

  onHide() {
    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
      this.shakeTimer = null;
    }
    // 页面隐藏时清理定时器，节省性能
    if (this.aiTimer) {
      clearInterval(this.aiTimer);
      this.aiTimer = null;
    }
  },

  // ======== 极其逼真的前台数字模拟引擎 ========
  initAiCounter() {
    // 拿今天的日期作为 Key，保证每天初始值不一样但同天一致
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `ai_usage_count_${today}`;

    let currentCount = wx.getStorageSync(cacheKey);
    if (!currentCount) {
      // 如果今天第一次打开，随机生成一个 1200 ~ 1500 之间的逼真基数
      currentCount = Math.floor(Math.random() * 300) + 1200;
      wx.setStorageSync(cacheKey, currentCount);
    }
    this.setData({ aiUsageCount: currentCount });

    // 设置定时器，每 3~5 秒随机涨 1~3 个人
    if (this.aiTimer) clearInterval(this.aiTimer);
    this.aiTimer = setInterval(() => {
      const addNum = Math.floor(Math.random() * 3) + 1; // 随机增加 1到3人
      const newCount = this.data.aiUsageCount + addNum;

      this.setData({ aiUsageCount: newCount });
      wx.setStorageSync(cacheKey, newCount); // 存入缓存，防止刷新后归零穿帮
    }, 3500) as unknown as number; // 3.5秒跳动一次，频率刚好引起注意又不太假
  },

  goSelectIndustry() {
    wx.navigateTo({ url: '/pages/industry-stage/index' });
  },

  goBaseAssessment() {
    if (!this.data.selection || !this.data.selection.industryId) {
      this.setData({ shakeIndustry: true });
      wx.showToast({ title: '请点击左上方「选择行业」', icon: 'none', duration: 2000 });

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