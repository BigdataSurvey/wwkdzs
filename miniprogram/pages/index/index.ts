const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false,
    selectionDisplayText: '选择行业 ›',
    aiUsageCount: 0,
    greeting: '真金白银砸下去之前',
    isFlipped: false,
    proUnlocked: false
  },

  shakeTimer: null as number | null,
  aiTimer: null as number | null,

  onLoad() {
    this.setDynamicGreeting();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }

    if (!app.globalData) {
      app.globalData = { selection: {} } as any;
    }

    const storedSelection = wx.getStorageSync('selectionState') || {};
    const globalSelection = app.globalData.selection || {};
    const selection = (storedSelection.industryId ? storedSelection : globalSelection) as any;
    app.globalData.selection = selection;

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

    const proFlag = wx.getStorageSync('proUnlocked') || false;
    const hasCompletedBase = safeRecordsCount > 0 || proFlag;
    this.setData({ proUnlocked: hasCompletedBase });

    this.initAiCounter();
    this.setDynamicGreeting();
    this.startAutoFlip();
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
    this.stopAutoFlip();
    if (this.flipTimer) {
      clearTimeout(this.flipTimer);
      this.flipTimer = null;
    }
  },

  // 动态场景文案（完全按你的要求）
  setDynamicGreeting() {
    const now = new Date().getHours();
    let greeting = "";

    // 早高峰 8-10点
    if (now >= 8 && now < 10) {
      greeting = "早上好！请为开店计划做精准评估";
    }
    // 日间常规 10-11点
    else if (now >= 10 && now < 11) {
      greeting = "上午好！理性评估，让开店更稳妥";
    }
    // 中午 11-13点
    else if (now >= 11 && now < 13) {
      greeting = "中午好！评估经营，创业少走弯路";
    }
    // 下午 13-18点
    else if (now >= 13 && now < 18) {
      greeting = "下午好！规划开店，决策更清晰";
    }
    // 晚上 18-22点
    else if (now >= 18 && now < 22) {
      greeting = "晚上好！测算风险，创业更安心";
    }
    // 深夜 22-8点
    else {
      greeting = "夜深啦！数据护航，安心休息";
    }

    // 未完成体检优先级最高
    try {
      const unfinished = wx.getStorageSync('unfinished_exam');
      if (unfinished) {
        greeting = "你的评估未完成，回到上次进度继续完善";
      }
    } catch (e) {}

    this.setData({ greeting });
  },

  flipTimer: null as number | null,
  autoFlipTimer: null as number | null,

  startAutoFlip() {
    this.stopAutoFlip();
    this.autoFlipTimer = setInterval(() => {
      this.setData({ isFlipped: !this.data.isFlipped });
    }, 6000) as unknown as number;
  },

  stopAutoFlip() {
    if (this.autoFlipTimer) {
      clearInterval(this.autoFlipTimer);
      this.autoFlipTimer = null;
    }
  },

  flipTitle() {
    this.stopAutoFlip();

    const next = !this.data.isFlipped;
    this.setData({ isFlipped: next });
    wx.vibrateShort({ type: 'light' });

    if (this.flipTimer) {
      clearTimeout(this.flipTimer);
    }
    this.flipTimer = setTimeout(() => {
      this.flipTimer = null;
      this.startAutoFlip();
    }, 5000) as unknown as number;
  },

  initAiCounter() {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `ai_usage_count_${today}`;

    let currentCount = wx.getStorageSync(cacheKey);
    if (!currentCount || typeof currentCount !== 'number') {
      currentCount = Math.floor(Math.random() * 300) + 1200;
    }
    wx.setStorageSync(cacheKey, currentCount);
    this.setData({ aiUsageCount: currentCount });

    if (this.aiTimer) clearInterval(this.aiTimer);
    this.aiTimer = setInterval(() => {
      const addNum = Math.floor(Math.random() * 4) + 5;
      const newCount = this.data.aiUsageCount + addNum;
      this.setData({ aiUsageCount: newCount });
      wx.setStorageSync(cacheKey, newCount);
    }, 5000) as unknown as number;
  },

  goSelectIndustry() {
    wx.navigateTo({ url: '/pages/industry-stage/index' });
  },

  goBaseAssessment() {
    let selection = this.data.selection;

    if (!selection || !selection.industryId) {
      selection = wx.getStorageSync('selectionState') || {};
      if (selection.industryId) {
        this.setData({ selection });
        app.globalData.selection = selection;
      }
    }

    if (!selection || !selection.industryId) {
      this.setData({ shakeIndustry: true });

      if (this.shakeTimer) clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 1000) as unknown as number;
      return;
    }

    wx.setStorageSync('unfinished_exam', true);

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