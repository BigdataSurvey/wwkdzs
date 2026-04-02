const app = getApp<IAppOption>();

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false
  },

  onLoad() {
    // 页面初始化逻辑
  },

  onShow() {
    // 解决微信小程序自定义 TabBar 状态不同步的经典问题
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }

    // 每次回到首页，重新拉取本地缓存的数据状态
    const selection = app.globalData.selection || wx.getStorageSync('selectionState') || {};
    const records = wx.getStorageSync('diagnosisRecords') || [];

    // 千人千面：提取行业名称的第一个字作为背景大水印
    let watermark = '';
    if (selection && selection.industryName) {
      watermark = selection.industryName.substring(0, 1);
    }

    this.setData({
      selection: selection,
      diagnosisCount: records.length,
      watermarkChar: watermark
    });
  },

  // 去设置行业
  goSelectIndustry() {
    // 极轻微震动反馈：确认感
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({
      url: '/pages/industry-stage/index'
    });
  },

  // 点击核心大按钮：开始基础体检
  goBaseAssessment() {
    // 核心拦截逻辑：如果没有设置行业，绝对不让进
    if (!this.data.selection || !this.data.selection.industryId) {
      // 错误反馈：中等强度震动 + 触发 CSS 左右抖动动画
      wx.vibrateShort({ type: 'medium' });
      this.setData({ shakeIndustry: true });

      wx.showToast({
        title: '请先设置行业，以匹配专属题库',
        icon: 'none',
        duration: 2000
      });

      // 500ms 后重置抖动状态，保证下次点击还能继续抖动
      setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 500);
      return;
    }

    // 成功放行：给一个踏实的确认震动
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/assessment/base/index'
    });
  },

  // 快捷入口：去档案页
  goArchive() {
    wx.vibrateShort({ type: 'light' });
    wx.switchTab({
      url: '/pages/archive/index'
    });
  },

  // 快捷入口：去工具箱
  goTools() {
    wx.vibrateShort({ type: 'light' });
    wx.switchTab({
      url: '/pages/tools/index'
    });
  }
});